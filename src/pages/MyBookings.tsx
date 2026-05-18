import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Calendar, MapPin, Car, Clock, ChevronRight, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  vehicleName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  arrivalDate: string;
  departureDate: string;
  pickupLocation: string;
  totalPrice: number;
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'cancelled',
        updatedAt: new Date()
      });
      fetchBookings();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'text-green-500 bg-green-500/10';
      case 'pending': return 'text-amber-500 bg-amber-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'completed': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  if (loading) return <div className="p-24 text-center">Loading bookings...</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-on-surface mb-2">My Reservations</h1>
          <p className="text-on-surface-variant font-medium">Track your upcoming and past rentals.</p>
        </div>
        <Link to="/vehicles" className="btn-primary flex items-center gap-2">
          Find More Vehicles <ArrowRight size={18} />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24 glass-card">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-on-surface-variant">
            <Car size={32} />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Bookings Found</h3>
          <p className="text-on-surface-variant mb-8">You haven't made any reservations yet.</p>
          <Link to="/vehicles" className="text-primary font-bold uppercase tracking-widest text-xs hover:underline decoration-2 underline-offset-4">Explore our fleet</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card hover:bg-slate-50 transition-colors border-slate-100 shadow-sm flex flex-col md:flex-row overflow-hidden"
            >
              {/* Status Bar */}
              <div className={`w-2 md:w-4 ${getStatusColor(booking.status).replace('text-', 'bg-').split(' ')[1]}`}></div>
              
              <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <h3 className="text-2xl font-bold text-on-surface mb-2">{booking.vehicleName}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
                    <Clock size={14} />
                    <span>Booking ID: #{booking.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>

                <div className="md:col-span-5 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Arrival</span>
                    <span className="text-sm font-bold text-on-surface">{booking.arrivalDate}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Departure</span>
                    <span className="text-sm font-bold text-on-surface">{booking.departureDate}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Location</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                       <MapPin size={14} className="text-primary" />
                       {booking.pickupLocation}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col items-end gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-1">Total Paid</span>
                    <span className="text-2xl font-bold text-primary">${booking.totalPrice}.50</span>
                  </div>
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleCancel(booking.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                      <XCircle size={14} /> Cancel Booking
                    </button>
                  ) || booking.status === 'confirmed' && (
                    <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest">
                       <CheckCircle2 size={16} /> Ready for Pickup
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


