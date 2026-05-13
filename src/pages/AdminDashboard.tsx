import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Car, 
  FileText, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Image as ImageIcon,
  ChevronRight,
  TrendingUp,
  Package,
  ArrowRight,
  Lock,
  Mail,
  Settings,
  Upload
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  query, 
  serverTimestamp,
  where,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Link, Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signInWithEmail } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'vehicles' | 'blog' | 'settings'>('bookings');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  if (authLoading) return <div className="p-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Synchronizing Admin Privileges...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-8 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-12 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-primary mb-6 border border-slate-100 shadow-sm">
              <Lock size={32} />
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter uppercase mb-2">Restricted <span className="text-primary italic">Access</span></h2>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest text-center">Master Administrator Authorization Required</p>
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setLoginLoading(true);
              setLoginError(null);
              try {
                await signInWithEmail(loginEmail, loginPass);
              } catch (err: any) {
                setLoginError(err.message || 'Invalid Administrator Credentials');
              } finally {
                setLoginLoading(false);
              }
            }}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Email Identity</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium"
                  placeholder="admin@trans.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Secure Passcode</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password" 
                  required
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 text-center animate-pulse">{loginError}</p>
            )}

            <button 
              disabled={loginLoading}
              className="btn-accent w-full py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-black"
            >
              {loginLoading ? 'Decrypting Access...' : 'Authenticate'}
              {!loginLoading && <ChevronRight size={18} />}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-on-surface transition-colors flex items-center justify-center gap-2">
              <ArrowRight size={12} className="rotate-180" /> Return to Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sidebar / Top Nav */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <BarChart3 size={18} />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-on-surface">Admin <span className="text-primary italic">Console</span></h1>
          </div>
          
          <nav className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'vehicles', label: 'Vehicles', icon: Car },
              { id: 'blog', label: 'Blog', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">{user?.displayName}</p>
            <p className="text-[8px] font-bold text-primary uppercase tracking-widest">Master Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <Users size={18} className="text-slate-300" />
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && <BookingsManager key="bookings" />}
          {activeTab === 'vehicles' && <VehiclesManager key="vehicles" />}
          {activeTab === 'blog' && <BlogManager key="blog" />}
          {activeTab === 'settings' && <SettingsManager key="settings" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Settings Manager ---
function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    logo: '',
    heroContent: '',
    heroType: 'image' as 'image' | 'video'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'general');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'heroContent') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (Firestore limit is 1MB per document)
    if (file.size > 1024 * 1024) {
      alert("File is too large (Max 1MB). For larger files, please use a direct URL.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSettings(prev => ({
        ...prev,
        [field]: base64,
        heroType: field === 'heroContent' ? (file.type.startsWith('video') ? 'video' : 'image') : prev.heroType
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('Settings updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'settings/general');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-24 text-center">Configuring system preferences...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">System <span className="text-primary italic">Settings</span></h2>
        <p className="text-on-surface-variant font-medium">Customize your digital presence.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-xl space-y-10">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Brand Logo</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input 
                  value={settings.logo}
                  onChange={e => setSettings({...settings, logo: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium mb-2"
                  placeholder="Paste URL or upload below"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, 'logo')}
                    className="hidden" 
                    id="logo-upload" 
                  />
                  <label 
                    htmlFor="logo-upload" 
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-on-surface-variant text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                  >
                    <Upload size={14} /> Browse PNG/JPEG
                  </label>
                </div>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
                {settings.logo ? (
                  <img src={settings.logo} className="max-w-full max-h-full object-contain" alt="" />
                ) : (
                  <ImageIcon size={24} className="text-slate-300" />
                )}
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant ml-2">Appears in the navigation bar and global UI. Max 1MB for uploads.</p>
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Hero Section Content</label>
            <div className="flex flex-col gap-4">
              <input 
                required
                value={settings.heroContent}
                onChange={e => setSettings({...settings, heroContent: e.target.value})}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Paste URL or upload below"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={(e) => handleFileChange(e, 'heroContent')}
                    className="hidden" 
                    id="hero-img-upload" 
                  />
                  <label 
                    htmlFor="hero-img-upload" 
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-100 text-on-surface-variant text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ImageIcon size={14} /> Upload Image
                  </label>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="video/mp4" 
                    onChange={(e) => handleFileChange(e, 'heroContent')}
                    className="hidden" 
                    id="hero-vid-upload" 
                  />
                  <label 
                    htmlFor="hero-vid-upload" 
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-100 text-on-surface-variant text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Upload size={14} /> Upload MP4
                  </label>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant ml-2">Max 1MB for direct uploads. Larger files require a URL.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Hero Content Type</label>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
              {['image', 'video'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSettings({...settings, heroType: type as any})}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    settings.heroType === type 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <button 
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-black"
          >
            {saving ? 'Updating System...' : 'Propagate Settings'}
            {!saving && <CheckCircle2 size={18} />}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      <div className="mt-12">
        <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-6 text-center">Live Asset Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">Logo Preview</span>
            {settings.logo && settings.logo.trim() !== '' ? (
              <img src={settings.logo} className="max-h-16 w-auto object-contain" alt="Logo preview" />
            ) : (
              <div className="text-slate-300 italic text-xs">No logo provided</div>
            )}
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden min-h-[200px] relative group">
             {settings.heroContent && settings.heroContent.trim() !== '' ? (
                settings.heroType === 'video' ? (
                  <video src={settings.heroContent} autoPlay muted loop className="w-full h-full object-cover" />
                ) : (
                  <img src={settings.heroContent} className="w-full h-full object-cover" alt="Hero preview" />
                )
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-xs bg-slate-50">Hero empty</div>
             )}
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col p-4">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Hero Background Preview</span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Bookings Manager ---
function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status, updatedAt: serverTimestamp() });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      
      if (status === 'confirmed') {
        const booking = bookings.find(b => b.id === id);
        console.log(`Sending confirmation email to avilanikkojosef1@gmail.com for booking ${id} of ${booking?.vehicleName}`);
        // In a real app, this would trigger a Cloud Function or call a specialized API
        const emailMsg = `Booking Confirmed!\n\nA notification email has been triggered for:\nRecipient: avilanikkojosef1@gmail.com\nVehicle: ${booking?.vehicleName}\nTotal: ₱${booking?.totalPrice}\n\n(Simulation phase: Email sent successfully via system relay)`;
        alert(emailMsg);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
    }
  };

  if (loading) return <div className="py-24 text-center">Loading all reservations...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">Active <span className="text-primary italic">Reservations</span></h2>
          <p className="text-on-surface-variant font-medium">Manage and process community bookings.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Global Volume</span>
            <span className="text-2xl font-bold text-primary">{bookings.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Pending</span>
            <span className="text-2xl font-bold text-amber-500">{bookings.filter(b => b.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                <Calendar size={28} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-on-surface">{booking.firstName} {booking.lastName}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                    booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                    booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{booking.vehicleName} • ₱{booking.totalPrice}.00</p>
                <p className="text-[10px] text-on-surface font-medium mt-1">{booking.arrivalDate} ‒ {booking.departureDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {booking.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle2 size={14} /> Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusChange(booking.id, 'cancelled')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-on-surface-variant rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    <XCircle size={14} /> Decline
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <button 
                  onClick={() => handleStatusChange(booking.id, 'completed')}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-on-surface-variant rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Mark Completed
                </button>
              )}
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors cursor-pointer">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Vehicles Manager ---
function VehiclesManager() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'car',
    price: 0,
    category: 'Sedan',
    image: '',
    transmission: 'Auto',
    fuel: 'Unleaded',
    description: '',
    tags: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const q = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'vehicles'), {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        rating: 5.0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowForm(false);
      fetchVehicles();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'vehicles');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await deleteDoc(doc(db, 'vehicles', id));
      fetchVehicles();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `vehicles/${id}`);
    }
  };

  if (loading) return <div className="py-24 text-center">Opening inventory...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">Fleet <span className="text-primary italic">Inventory</span></h2>
          <p className="text-on-surface-variant font-medium">Add and maintain your vehicle catalog.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Vehicle'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddVehicle}
            className="bg-white border border-slate-200 rounded-3xl p-8 overflow-hidden shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Vehicle Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ex: Toyota Hilux" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none">
                  <option value="car">Car</option>
                  <option value="motorbike">Motorbike</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none">
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Van">Van</option>
                  <option value="MPV">MPV</option>
                  <option value="SUV">SUV</option>
                  <option value="L300">L300</option>
                  <option value="Motorbike">Motorbike</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Daily Price (₱)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Transmission</label>
                <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="bg-slate-100 border-none rounded-xl px-4 py-3 outline-none">
                  <option>Auto</option>
                  <option>Manual</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Fuel</label>
                <select value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} className="bg-slate-100 border-none rounded-xl px-4 py-3 outline-none">
                  <option>Unleaded</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Image URL</label>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none" placeholder="https://unsplash..." />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Tags (Comma separated)</label>
                <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none" placeholder="Premium, SUV, etc." />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none h-24" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-sm">Deploy to Catalog</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 relative overflow-hidden bg-slate-100">
              {v.image ? (
                <img src={v.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={48} />
                </div>
              )}
              <button 
                onClick={() => handleDelete(v.id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">{v.name}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{v.type} • {v.transmission}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">₱{v.price}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">/ day</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button className="flex-1 py-3 rounded-xl bg-slate-50 text-xs font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-center gap-2">
                  <Edit3 size={14} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- Blog Manager ---
function BlogManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'posts'), {
        ...formData,
        author: 'JJ Admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'posts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Archive this publication?')) return;
    try {
      await deleteDoc(doc(db, 'posts', id));
      fetchPosts();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `posts/${id}`);
    }
  };

  if (loading) return <div className="py-24 text-center">Accessing newsroom...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-8"
    >
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">Blog <span className="text-primary italic">Editor</span></h2>
          <p className="text-on-surface-variant font-medium">Publish stories and travel guides.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-accent flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleAddPost}
            className="bg-white border border-slate-200 rounded-3xl p-10 overflow-hidden shadow-2xl space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Headline</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none" placeholder="Ex: Top 5 Destinations in Leyte" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Slug</label>
                <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none font-mono text-xs" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Cover Image URL</label>
                <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Introduction (Excerpt)</label>
                <input value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Full Story (Markdown)</label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="bg-slate-50 border-none rounded-xl px-4 py-3 outline-none h-64 font-sans leading-relaxed" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-5 text-sm uppercase tracking-widest font-black">Publish to Journal</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between gap-8 hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface mb-1">{post.title}</h3>
                  <p className="text-xs text-on-surface-variant font-medium line-clamp-1 max-w-xl">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">{post.author}</span>
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-300">{post.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={() => handleDelete(post.id)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={16} />
                </button>
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer shadow-sm">
                  <ChevronRight size={18} />
                </div>
             </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
