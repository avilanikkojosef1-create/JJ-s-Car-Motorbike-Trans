import { MapPin, Calendar, Search, Facebook, Clock, CheckCircle2 } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [loadingFleets, setLoadingFleets] = useState(true);
  const [settings, setSettings] = useState({
    heroContent: '',
    heroType: 'image'
  });
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('10:00');
  const [departureTime, setDepartureTime] = useState('10:00');
  
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(searchParams.get('booked') === 'success');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as any);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'), limit(3));
        const snapshot = await getDocs(q);
        setFeaturedVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoadingFleets(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="flex flex-col">
      {/* Booking Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass p-6 rounded-2xl border-primary/20 shadow-2xl flex items-center gap-4 bg-white/90 backdrop-blur-xl"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Booking Received!</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-on-surface-variant">We'll contact you for confirmation shortly.</p>
            </div>
            <button onClick={() => setShowToast(false)} className="ml-4 text-on-surface-variant hover:text-on-surface uppercase text-[10px] font-black tracking-widest">Close</button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center px-6 md:px-0 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {settings.heroContent ? (
            settings.heroType === 'video' ? (
              <video 
                src={settings.heroContent} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
              />
            ) : (
              <img 
                src={settings.heroContent} 
                className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
                alt="Hero background"
              />
            )
          ) : (
            <div className="w-full h-full bg-on-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface via-on-surface/40 to-transparent" />
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Premium Experience
              </div>
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.85] drop-shadow-2xl">
                Redefining <br /><span className="font-extrabold text-primary italic">Adventure.</span>
              </h1>
              <p className="text-xl text-slate-200 mb-12 max-w-xl font-medium leading-relaxed drop-shadow-md">
                Experience the ultimate freedom with our premium collection of luxury SUVs and high-performance motorbikes. Built for the bold.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <Link to="/vehicles" className="btn-primary flex items-center gap-2 px-10 py-5 text-sm uppercase tracking-widest font-black shadow-[0_0_30px_rgba(254,183,0,0.3)]">
                  Explore Fleet
                </Link>
                <Link to="/about" className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm uppercase tracking-widest font-black hover:bg-white/20 transition-all">
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Bento */}
      <section className="max-w-7xl mx-auto w-full py-32 px-6 md:px-0">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Discovery</p>
            <h2 className="text-5xl font-bold tracking-tight text-on-surface mb-2">Featured <span className="text-primary/70">Fleet</span></h2>
            <p className="text-on-surface-variant max-w-md font-medium">Top-tier vehicles curated for ultimate performance and comfort.</p>
          </div>
          <Link 
            to="/vehicles"
            className="hidden md:block btn-secondary text-sm"
          >
            View All Fleet
          </Link>
        </div>

        {loadingFleets ? (
          <div className="py-24 text-center text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Synchronizing Fleet...</div>
        ) : featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-[2.5rem] p-24 text-center border-2 border-dashed border-slate-200">
            <p className="text-on-surface-variant font-medium text-lg mb-6">Our new fleet is arriving shortly.</p>
            <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Add First Vehicle</Link>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-50 py-32 px-6 md:px-0">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Get in Touch</p>
            <h2 className="text-5xl font-bold tracking-tight text-on-surface mb-8">Ready to <span className="text-primary/70">Start?</span></h2>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-12">
              Visit our office in Tacloban or reach out via phone or email for special requests and group bookings.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Phone</span>
                <a href="tel:09272835299" className="text-xl font-bold text-on-surface hover:text-primary transition-colors italic">0927 283 5299</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Email</span>
                <a href="mailto:jjscarmotorbiketrans@gmail.com" className="text-sm font-bold text-on-surface hover:text-primary transition-colors">jjscarmotorbiketrans@gmail.com</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Social</span>
                <a href="https://www.facebook.com/jjscmt" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center gap-2">
                  <Facebook size={16} /> @jjscmt
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Office</span>
                <p className="text-sm font-bold text-on-surface">Tacloban City, 6500</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Office" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -track-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] -z-0"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
