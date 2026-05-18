import { MapPin, Calendar, Search, Facebook, Clock, CheckCircle2 } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [loadingFleets, setLoadingFleets] = useState(true);
  const [settings, setSettings] = useState({
    heroContent: '',
    heroType: 'image' as 'image' | 'video' | 'youtube'
  });
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [location, setLocation] = useState('');
  
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(searchParams.get('booked') === 'success');

  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (arrivalDate) params.set('arrival', arrivalDate);
    if (departureDate) params.set('departure', departureDate);
    navigate(`/vehicles?${params.toString()}`);
  };

  useEffect(() => {
    // Reset video load state when content changes
    setIsVideoLoaded(false);
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

  const getDriveId = (url: string) => {
    return url.match(/\/d\/([^/]+)/)?.[1] || url.match(/[?&]id=([^&]+)/)?.[1] || '';
  };

  const isVideo = (url: string) => {
    const v = url.toLowerCase();
    return v.includes('drive.google.com') || v.includes('firebasestorage') || v.includes('.mp4') || v.includes('.mov') || v.includes('.webm');
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

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
            isYouTube(settings.heroContent) ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden scale-[1.3] pointer-events-none">
                <iframe 
                  key={settings.heroContent}
                  src={`https://www.youtube.com/embed/${settings.heroContent.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=))([^#&?]*)/)?.[1] || ''}?autoplay=1&mute=1&controls=0&loop=1&playlist=${settings.heroContent.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=))([^#&?]*)/)?.[1] || ''}&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&autohide=1&fs=0`}
                  className="w-full h-full border-none brightness-[0.7]"
                  allow="autoplay; muted; fullscreen"
                />
                <div className="absolute inset-0 z-10 bg-transparent" />
              </div>
            ) : isVideo(settings.heroContent) ? (
              <>
                {/* Immediate Poster/Thumbnail to avoid black screen */}
                <div 
                  className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
                >
                  <img 
                    src={settings.heroContent.includes('drive.google.com') 
                      ? `https://drive.google.com/thumbnail?id=${getDriveId(settings.heroContent)}&sz=w1920`
                      : settings.heroContent // Fallback to content URL if it's an image
                    }
                    className="w-full h-full object-cover brightness-[0.6] blur-sm scale-105"
                    alt="Video loading..."
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                </div>
                
                <video 
                  key={settings.heroContent}
                  src={
                    settings.heroContent.includes('drive.google.com')
                      ? `https://drive.google.com/uc?id=${getDriveId(settings.heroContent)}&export=media`
                      : settings.heroContent
                  } 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  preload="auto"
                  onLoadedData={() => setIsVideoLoaded(true)}
                  disablePictureInPicture
                  className={`w-full h-full object-cover brightness-[0.7] contrast-[1.1] transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </>
            ) : (

              <img 
                key={settings.heroContent}
                src={settings.heroContent} 
                referrerPolicy="no-referrer"
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
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.85] drop-shadow-2xl">
                Redefining <br /><span className="font-extrabold text-primary italic">Adventure.</span>
              </h1>
              
              <div className="mb-16">
              </div>

              {/* Aesthetic Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative z-20 w-fit"
              >
                <div className="bg-black/30 backdrop-blur-3xl border border-white/20 p-2 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-stretch md:items-center gap-2">
                  {/* Location */}
                  <div className="flex items-center gap-4 px-8 py-5 hover:bg-white/5 rounded-[2rem] transition-all group min-w-[240px]">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Pick up location</span>
                      <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Jose DZR Airport Road"
                        className="bg-transparent text-white font-extrabold text-lg outline-none w-full placeholder:text-white/50"
                      />
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-white/10 mx-2" />

                  {/* Pick Up */}
                  <div className="flex items-center gap-4 px-8 py-5 hover:bg-white/5 rounded-[2rem] transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <Calendar size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest text-secondary mb-1">Pick Up Time</span>
                      <input 
                        type="datetime-local" 
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="bg-transparent text-white font-extrabold text-sm outline-none cursor-pointer [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-white/10 mx-2" />

                  {/* Drop Off */}
                  <div className="flex items-center gap-4 px-8 py-5 hover:bg-white/5 rounded-[2rem] transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <Clock size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-widest text-accent mb-1">Drop Off Time</span>
                      <input 
                        type="datetime-local" 
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="bg-transparent text-white font-extrabold text-sm outline-none cursor-pointer [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Search Button */}
                  <button 
                    onClick={handleSearch}
                    className="ml-2 bg-primary text-on-primary p-6 rounded-[2rem] hover:bg-on-surface transition-all flex items-center justify-center shadow-lg group"
                  >
                    <Search size={28} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
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

      {/* Guest Reviews Section */}
      <section className="bg-on-surface py-32 px-6 md:px-0 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <p className="text-xs uppercase tracking-[0.4em] text-primary font-black mb-4">Guest Feedback</p>
            <h2 className="text-6xl font-bold tracking-tighter mb-4">Tropical <span className="italic text-primary font-black">Stories.</span></h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: "Jet Cadavis",
                role: "Luxury Traveler",
                text: "The Toyota GL Grandia was pristine. Exploring Tacloban in such comfort made our family vacation truly unforgettable. Highly recommended service!",
                rating: 5
              },
              {
                name: "Maria Santos",
                role: "Adventure Blogger",
                text: "Renting the high-performance motorbike changed the game. I was able to reach remote spots easily. Fast booking and very smooth pickup.",
                rating: 5
              },
              {
                name: "Ricardo Gomez",
                role: "Business Executive",
                text: "Professionalism at its best. They handled all my requirements for local transport perfectly. Always my first choice in Leyte.",
                rating: 5
              }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] relative group hover:bg-white/10 transition-all cursor-default"
              >
                <div className="flex gap-1 mb-8 text-primary text-lg">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xl font-medium leading-relaxed mb-10 text-slate-300 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 text-white font-black text-xl">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary">{review.name}</h4>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
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
                <p className="text-sm font-bold text-on-surface">San Jose DZR Airport Road, Tacloban City, 6500 Leyte</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Office" 
                referrerPolicy="no-referrer"
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
