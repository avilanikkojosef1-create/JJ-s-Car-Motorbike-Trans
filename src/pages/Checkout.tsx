import React, { useState, useEffect } from 'react';
import { Shield, User, Lock, Calendar, MapPin, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { VEHICLES } from '../constants';
import { useAuth } from '../lib/AuthContext';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const vehicleId = searchParams.get('vId');
  
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!vehicleId) return;
      try {
        const docRef = doc(db, 'vehicles', vehicleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching vehicle for checkout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driversLicense: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        userId: user?.uid || 'anonymous',
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        pickupLocation: searchParams.get('pickup') || 'Main Office',
        arrivalDate: searchParams.get('arrival') || '',
        departureDate: searchParams.get('departure') || '',
        status: 'pending',
        totalPrice: vehicle.price + (vehicle.carwashFee || 0),
        ...formData,
        protectionPlan: 'standard',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking submitted with ID: ', docRef.id);
      navigate('/?booked=success');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-24 text-center">Preparing documents...</div>;
  if (!vehicle) return <div className="p-24 text-center">Vehicle unavailable.</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <Link to={`/vehicles/${vehicle.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-12 hover:text-primary transition-colors">
        <ChevronLeft size={14} /> Back to Details
      </Link>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div>
            <h1 className="text-4xl text-primary mb-2">Complete Your Booking</h1>
            <p className="text-lg text-on-surface-variant font-medium">Review your details and finalize your reservation.</p>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col gap-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-red-600 flex items-center gap-2">
               <Shield className="w-4 h-4" /> Important Rental Policies
             </h3>
             <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
               <li className="text-[10px] font-bold text-red-800 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-red-400" /> Must present 2 valid IDs upon pickup
               </li>
               <li className="text-[10px] font-bold text-red-800 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-red-400" /> Full payment required upon turnover
               </li>
               <li className="text-[10px] font-bold text-red-800 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-red-400" /> Strictly Region 8 only
               </li>
               <li className="text-[10px] font-bold text-red-800 flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-red-400" /> Return fuel at same level
               </li>
             </ul>
             <p className="text-[10px] font-medium text-red-700 italic border-t border-red-100 pt-2 mt-2">
               *A ₱500 reservation fee is required to secure this booking (non-refundable once cancelled).
             </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-primary text-center w-full justify-center">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              <span className="text-sm font-bold uppercase tracking-widest">Complete Your Details</span>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Step 1 Form */}
            <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-highest p-10 flex flex-col gap-8">
              <h2 className="text-2xl text-primary flex items-center gap-3">
                <User className="text-secondary-container" />
                1. Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">First Name</label>
                  <input 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="Enter your first name" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Last Name</label>
                  <input 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="Enter your last name" 
                  />
                </div>
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Phone Number</label>
                  <input 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="+1 (555) 000-0000" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-primary uppercase tracking-widest">Driver's License</label>
                  <input 
                    required
                    value={formData.driversLicense}
                    onChange={(e) => setFormData({...formData, driversLicense: e.target.value})}
                    className="bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    placeholder="Ex: D12345678" 
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Summary */}
        <aside className="lg:col-span-4 sticky top-32">
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl border border-surface-container-highest flex flex-col">
            <div className="h-48 relative overflow-hidden bg-slate-100 flex items-center justify-center">
              {vehicle.image && vehicle.image.trim() !== '' ? (
                <img 
                  src={vehicle.image} 
                  className="w-full h-full object-cover"
                  alt={vehicle.name}
                />
              ) : (
                <Shield className="text-slate-300" size={48} strokeWidth={1} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-6">
                <span className="text-[10px] font-bold text-secondary-container uppercase tracking-widest mb-1">{vehicle.category}</span>
                <h3 className="text-2xl text-white font-bold">{vehicle.name}</h3>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div className="pb-6 border-b border-surface-container-highest flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <Calendar className="text-secondary-container mt-1" size={20} />
                  <div>
                    <p className="text-sm font-bold text-primary">
                      {searchParams.get('arrival')} - {searchParams.get('departure')}
                    </p>
                    <p className="text-xs text-on-surface-variant font-semibold">Custom Rental Period</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-secondary-container mt-1" size={20} />
                  <div>
                    <p className="text-sm font-bold text-primary">{searchParams.get('pickup')}</p>
                    <p className="text-xs text-on-surface-variant font-semibold">Pickup & Return</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-on-surface-variant">Base Rate (Daily)</span>
                  <span className="text-on-surface">₱{vehicle.price}.00</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-on-surface-variant">Carwash fee</span>
                  <span className="text-on-surface">₱{vehicle.carwashFee || 0}.00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-surface-container-highest flex justify-between items-end">
                <span className="text-2xl font-bold text-primary">Total</span>
                <span className="text-3xl font-bold text-primary">₱{vehicle.price + (vehicle.carwashFee || 0)}.00</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary-container text-on-secondary-container font-bold py-5 rounded-2xl hover:bg-opacity-90 transition-all flex justify-center items-center gap-2 group shadow-lg mt-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[10px] font-bold text-on-surface-variant text-center uppercase tracking-widest">
                <Lock size={12} className="inline mr-1 -mt-0.5" /> Secure Checkout
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
