import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  ChevronRight, 
  Star, 
  Users, 
  Settings, 
  Luggage, 
  Fuel, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';

export default function VehicleDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'vehicles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setVehicle(null);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setVehicle(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const [pickupPoint, setPickupPoint] = useState(searchParams.get('location') || '');
  const [arrivalDate, setArrivalDate] = useState(searchParams.get('arrival') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('departure') || '');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass selection to checkout via URL
    const searchParams = new URLSearchParams({
      vId: id || '',
      pickup: pickupPoint,
      arrival: arrivalDate,
      departure: departureDate
    });
    navigate(`/checkout?${searchParams.toString()}`);
  };

  if (loading) return <div className="p-24 text-center">Inspecting vehicle...</div>;
  if (!vehicle) return <div className="p-24 text-center">Vehicle not found.</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-8 text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.2em]">
        <Link to="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
        <ChevronRight size={12} className="opacity-40" />
        <span>{vehicle.type === 'car' ? 'Premium Cars' : 'Motorbikes'}</span>
        <ChevronRight size={12} className="opacity-40" />
        <span className="text-secondary">{vehicle.name}</span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-12">
          {/* Gallery Section */}
          <section>
            <div className="w-full aspect-[16/10] rounded-[40px] overflow-hidden glass border-white/5 shadow-2xl flex items-center justify-center bg-slate-100">
              {vehicle.image && vehicle.image.trim() !== '' ? (
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-slate-300">
                  <ImageIcon size={64} strokeWidth={1} />
                  <span className="text-xs uppercase font-black tracking-widest">Image Asset Unavailable</span>
                </div>
              )}
            </div>
          </section>

          <div className="pb-10 border-b border-slate-100">
            <div className="flex gap-3 mb-6">
              {vehicle.tags?.map(tag => (
                 <span key={tag} className="glass text-on-surface text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border-slate-200 bg-white shadow-sm">
                  {tag}
                 </span>
              ))}
            </div>
            <h1 className="text-6xl font-bold tracking-tighter text-on-surface mb-6">
              {vehicle.name.split(' ').slice(0, -1).join(' ')} <span className="font-extrabold text-primary">{vehicle.name.split(' ').pop()}</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="glass-card p-8 flex flex-col items-center gap-3 shadow-sm hover:bg-slate-50 transition-colors group">
              <Users size={32} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-on-surface tabular-nums">{vehicle.seats || '1'}</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Seaters</span>
            </div>
            <div className="glass-card p-8 flex flex-col items-center gap-3 shadow-sm hover:bg-slate-50 transition-colors group">
              <Settings size={32} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-on-surface uppercase">{vehicle.transmission}</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Type</span>
            </div>
            <div className="glass-card p-8 flex flex-col items-center gap-3 shadow-sm hover:bg-slate-50 transition-colors group">
              <Fuel size={32} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-3xl font-bold text-on-surface uppercase">{vehicle.fuel}</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Fuel</span>
            </div>
          </div>



          <div className="bg-primary/5 rounded-2xl p-10 border border-primary/10">
            <h2 className="text-2xl font-bold text-primary mb-2">Rental Terms & Requirements</h2>
            <p className="text-xs font-black uppercase tracking-widest text-primary/60 mb-8">Please read carefully before booking</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Required Documents
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm font-medium text-on-surface-variant">
                    <CheckCircle2 size={18} className="text-secondary-container mt-0.5 flex-shrink-0" />
                    Valid Driver's License (International DL accepted)
                  </li>
                  <li className="flex items-start gap-3 text-sm font-medium text-on-surface-variant">
                    <CheckCircle2 size={18} className="text-secondary-container mt-0.5 flex-shrink-0" />
                    One (1) Government Issued ID
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Key Policies
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-xs font-bold text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-secondary-container mt-0.5 flex-shrink-0" />
                    Return fuel at the same level as pickup
                  </li>
                  <li className="flex items-start gap-3 text-xs font-bold text-on-surface-variant">
                    <CheckCircle2 size={16} className="text-secondary-container mt-0.5 flex-shrink-0" />
                    Full payment required upon vehicle turnover
                  </li>
                  <li className="flex items-start gap-3 text-xs font-bold text-red-500">
                    <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    Strictly prohibited outside Region 8
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-primary/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Reservation Fee</span>
                <span className="text-2xl font-bold text-on-surface">₱500.00 <span className="text-xs font-medium text-on-surface-variant tracking-normal">(Deductible)</span></span>
              </div>
              <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                View All Terms <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 relative">
          <div className="sticky top-32 glass-card p-10 lg:p-10 shadow-2xl flex flex-col gap-8 relative overflow-hidden bg-white border-slate-100">
            <div className="flex justify-between items-end border-b border-slate-50 pb-8 relative z-10">
              <div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] block mb-2">Daily Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-on-surface tabular-nums">₱{vehicle.price}</span>
                  <span className="text-sm text-on-surface-variant font-bold">/day</span>
                </div>
              </div>
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-primary border-slate-200 shadow-sm bg-slate-50">
                <ShieldCheck size={28} />
              </div>
            </div>

            <form onSubmit={handleBooking} className="flex flex-col gap-8 relative z-10">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Pick up location</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-primary" size={18} />
                  <input 
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="Enter pick-up point..."
                    className="w-full bg-transparent border-b border-slate-200 py-3 pl-8 pr-4 text-lg font-light focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Arrival</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-lg font-light focus:outline-none focus:border-primary transition-all" 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Departure</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-200 py-3 text-lg font-light focus:outline-none focus:border-primary transition-all" 
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl flex flex-col gap-4 border border-slate-100">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-on-surface-variant">Standard Rate (Daily)</span>
                  <span className="text-on-surface tabular-nums font-bold">₱{vehicle.price}.00</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-on-surface-variant">Carwash fee</span>
                  <span className="text-on-surface tabular-nums font-bold">₱{vehicle.carwashFee || 0}.00</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em]">Total Estimate</span>
                  <span className="text-3xl font-bold text-on-surface tabular-nums">₱{vehicle.price + (vehicle.carwashFee || 0)}.00</span>
                </div>
              </div>

              <button 
                type="submit"
                className="btn-primary w-full py-5 text-lg flex justify-center items-center gap-3 group"
              >
                Complete Booking
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
