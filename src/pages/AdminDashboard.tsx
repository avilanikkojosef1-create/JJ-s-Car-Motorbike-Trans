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
  Upload,
  ShieldCheck,
  Info,
  User as UserIcon,
  ExternalLink,
  Zap
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Link, Navigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'vehicles' | 'blog' | 'settings'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  const handleLogout = async () => {
    sessionStorage.removeItem('admin_verified');
    await logout();
  };

  if (authLoading) return <div className="p-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Synchronizing Admin Privileges...</div>;

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
            <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">{user?.displayName || user?.email}</p>
            <p className="text-[8px] font-bold text-primary uppercase tracking-widest">Master Administrator</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl overflow-hidden border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            title="Secure Logout"
          >
            <Lock size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'bookings' && <BookingsManager key="bookings" onSelectBooking={setSelectedBooking} />}
          {activeTab === 'vehicles' && <VehiclesManager key="vehicles" />}
          {activeTab === 'blog' && <BlogManager key="blog" />}
          {activeTab === 'settings' && <SettingsManager key="settings" userEmail={user?.email || ''} />}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingDetailsModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
            onStatusChange={(status) => {
              // Refreshing list logic is in the parent usually, 
              // but for simplicity we'll just handle it where needed
              setSelectedBooking(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Booking Details Modal ---
function BookingDetailsModal({ booking, onClose, onStatusChange }: { booking: any, onClose: () => void, onStatusChange: (s: string) => void }) {
  const maskDL = (val: string) => {
    if (!val) return 'N/A';
    if (val.length <= 4) return '****';
    return val.substring(0, 2) + '****' + val.substring(val.length - 2);
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      await updateDoc(bookingRef, { status, updatedAt: serverTimestamp() });
      alert(`Booking ${status} successfully.`);
      onStatusChange(status);
      window.location.reload(); // Simple refresh for state sync
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${booking.id}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-on-surface/90 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200"
      >
        <div className="bg-primary/5 p-8 border-b border-slate-100 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">Reservation Dossier</span>
            <h2 className="text-3xl font-black text-on-surface tracking-tighter">
              {booking.firstName} <span className="text-primary italic">{booking.lastName}</span>
            </h2>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">ID: {booking.id}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-on-surface-variant hover:text-red-500 shadow-sm transition-colors ring-1 ring-slate-100">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Customer Contact</span>
                <p className="font-bold flex items-center gap-2"><Mail size={14} className="text-primary" /> {booking.email}</p>
                <p className="font-bold flex items-center gap-2"><Settings size={14} className="text-primary" /> {booking.phone}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Driver's Credential</span>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-sm tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                    {maskDL(booking.driversLicense)}
                  </p>
                  <button 
                    onClick={() => alert(`Unmasked DL for Verification: ${booking.driversLicense}`)}
                    className="text-[10px] font-black text-primary uppercase hover:underline"
                  >
                    View Securely
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vehicle Unit</span>
                <p className="font-black text-lg text-primary uppercase italic">{booking.vehicleName}</p>
                <p className="text-[10px] font-bold text-on-surface-variant tracking-widest">PLAN: {booking.protectionPlan || 'STANDARD'}</p>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Financial Total</span>
                <p className="text-2xl font-black text-on-surface">₱{booking.totalPrice}.00</p>
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified Payment Expected</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 grid grid-cols-2 gap-8 relative overflow-hidden">
             <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200 -translate-x-1/2"></div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">Pick-up Logistics</span>
                <p className="text-sm font-bold text-on-surface mb-1">{booking.arrivalDate}</p>
                <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{booking.pickupLocation || 'Main Office'}</p>
             </div>
             <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Return Schedule</span>
                <p className="text-sm font-bold text-on-surface mb-1">{booking.departureDate}</p>
                <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{booking.returnLocation || 'Main Office'}</p>
             </div>
          </div>

          <div className="flex gap-4 pt-4">
            {booking.status === 'pending' ? (
              <>
                <button 
                  onClick={() => handleStatusUpdate('confirmed')}
                  className="flex-1 btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em]"
                >
                  <CheckCircle2 size={20} /> Authorize Booking
                </button>
                <button 
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="px-8 py-5 rounded-2xl bg-slate-100 text-on-surface-variant hover:bg-red-500 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em]"
                >
                  Reject
                </button>
              </>
            ) : booking.status === 'confirmed' ? (
              <button 
                onClick={() => handleStatusUpdate('completed')}
                className="w-full py-5 rounded-2xl border-2 border-primary text-primary font-black text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all"
              >
                Mark Journey Completed
              </button>
            ) : (
              <div className="w-full py-4 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                Terminated State: {booking.status}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Settings Manager ---
function SettingsManager({ userEmail }: { userEmail: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [settings, setSettings] = useState({
    logo: '',
    heroContent: '',
    heroPoster: '',
    heroType: 'image' as 'image' | 'video' | 'youtube'
  });

  useEffect(() => {
    fetchSettings();
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, 'admins'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error('Error fetching admins:', e);
    }
  };

  const addAdmin = async () => {
    if (!newAdminEmail.includes('@')) return;
    setSaving(true);
    try {
      // In a real app we might want to resolve UID first, but for simple lookup
      // we'll just check it by email or manually add via Console.
      // Here we assume the user provides a UID or we use Email as ID for lookup
      // Actually, my rule uses request.auth.uid, so we NEED the UID.
      alert("Manual Security Note: To add a new admin, you currently need to provide their Firebase UID to the system or add them via the Firebase Console to the 'admins' collection.");
    } finally {
      setSaving(false);
    }
  };

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'heroContent') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video and over a reasonable limit (e.g., 50MB) for this environment
    if (file.size > 50 * 1024 * 1024) {
      alert("File is too large for direct upload (Max 50MB). Please use a YouTube or Google Drive link instead.");
      return;
    }

    setSaving(true);
    try {
      // Create a storage reference
      const storageRef = ref(storage, `assets/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      
      // Upload the file
      console.log(`Starting upload for ${file.name}...`);
      console.log(`Using bucket: ${storage.app.options.storageBucket || 'default'}`);
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Upload successful. URL:', downloadURL);
      
      const isVid = file.type.startsWith('video/');
      setSettings(prev => ({
        ...prev,
        [field]: downloadURL,
        heroType: field === 'heroContent' ? (isVid ? 'video' : 'image') : prev.heroType
      }));
      
      alert(`Successfully uploaded: ${file.name}\n\nThe asset has been synced to Cloud Storage.`);
    } catch (error: any) {
      console.error('CRITICAL UPLOAD ERROR:', error);
      
      let message = error.message;
      if (error.code === 'storage/retry-limit-exceeded') {
        message = "Connection timeout. This often means your Firebase Storage bucket is not yet active. \n\nACTION REQUIRED: Please go to your Firebase Console -> Storage and click 'Get Started' to initialize the bucket. If it's already active, check your internet connection or try a smaller file (Max 50MB).";
      } else if (error.code === 'storage/unauthorized') {
        message = "Security Rules Violation. Your Storage rules may be blocking this upload. Please set them to: \n\nallow read, write: if request.auth != null;";
      }
      
      alert(`Upload failed: ${message}`);
    } finally {
      setSaving(false);
    }
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

  const isVideo = (url: string) => {
    const v = url.toLowerCase();
    return v.includes('drive.google.com') || v.includes('firebasestorage') || v.includes('.mp4') || v.includes('.mov') || v.includes('.webm');
  };

  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
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

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0">
              <Zap size={18} />
            </div>
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Video Performance Tip</h4>
               <p className="text-[10px] text-green-700 font-medium leading-relaxed">
                 To make your video play in &lt;1 second (like Thrifty), use a compressed MP4 file under 5MB. 
                 Direct links (e.g. from Firebase Storage) are much faster than Google Drive links.
                 <br /><strong>Pro Tip:</strong> Upload a "Hero Poster" (static image) to show it instantly while the video buffers in the background.
               </p>
            </div>
          </div>


          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Hero Section Content (Video or Image URL)</label>
            <div className="flex flex-col gap-4">
              <input 
                required
                value={settings.heroContent}
                onChange={e => {
                  const val = e.target.value;
                  const isVid = val.toLowerCase().includes('.mp4') || val.toLowerCase().includes('.mov') || val.toLowerCase().includes('.webm');
                  const isYouTube = val.includes('youtube.com') || val.includes('youtu.be');
                  const isDrive = val.includes('drive.google.com');
                  
                  let finalHeroType: 'image' | 'video' | 'youtube';
                  if (isYouTube) finalHeroType = 'youtube';
                  else if (isDrive || isVid || val.includes('firebasestorage')) finalHeroType = 'video';
                  else finalHeroType = 'image';
                  
                  setSettings({
                    ...settings, 
                    heroContent: val,
                    heroType: finalHeroType
                  });
                }}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Paste URL (YouTube/Google Drive/Direct Video) or upload below"
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

          {settings.heroType === 'video' && (
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Video Poster / Static Thumbnail (Optional but Recommended)</label>
              <div className="flex flex-col gap-4">
                <input 
                  value={settings.heroPoster || ''}
                  onChange={e => setSettings({...settings, heroPoster: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  placeholder="URL to a static image to show while video loads"
                />
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={(e) => handleFileChange(e, 'heroPoster' as any)}
                    className="hidden" 
                    id="hero-poster-upload" 
                  />
                  <label 
                    htmlFor="hero-poster-upload" 
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-100 text-on-surface-variant text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    <ImageIcon size={14} /> Upload Poster Image
                  </label>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant ml-2">This image shows instantly before the video starts. Essential for "fast" perceived load times.</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Hero Content Type</label>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
              {['image', 'video', 'youtube'].map((type) => (
                <button
                  key={type}
                  id={`hero-type-${type}`}
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
        <div className="pt-6 border-t border-slate-50">
          <button 
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] font-black"
          >
            {saving ? 'Updating System...' : 'Save & Publish to Homepage'}
            {!saving && <CheckCircle2 size={18} />}
          </button>
        </div>
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
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden min-h-[200px] relative group bg-slate-50">
             {settings.heroContent && settings.heroContent.trim() !== '' ? (
                isYouTube(settings.heroContent) ? (
                  <div className="w-full h-full relative overflow-hidden pointer-events-none">
                    <iframe 
                      key={settings.heroContent}
                      src={`https://www.youtube.com/embed/${settings.heroContent.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=))([^#&?]*)/)?.[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${settings.heroContent.match(/(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=))([^#&?]*)/)?.[1]}&rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&autohide=1`}
                      className="w-full h-full border-none scale-150"
                    />
                  </div>
                ) : isVideo(settings.heroContent) ? (
                  <video 
                    key={settings.heroContent} 
                    src={
                      settings.heroContent.includes('drive.google.com')
                        ? `https://drive.google.com/uc?id=${settings.heroContent.match(/\/d\/([^/]+)/)?.[1] || settings.heroContent.match(/[?&]id=([^&]+)/)?.[1] || ''}&export=media`
                        : settings.heroContent
                    }
                    poster={settings.heroPoster || (settings.heroContent.includes('drive.google.com') 
                      ? `https://drive.google.com/thumbnail?id=${settings.heroContent.match(/\/d\/([^/]+)/)?.[1] || settings.heroContent.match(/[?&]id=([^&]+)/)?.[1] || ''}&sz=w1920`
                      : '')
                    }
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    preload="auto"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img key={settings.heroContent} src={settings.heroContent} className="w-full h-full object-cover" alt="Hero preview" />
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

      {/* Global Access Control (Admins) */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 mt-12">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Security & Access Control (RBAC)</span>
            <h3 className="text-2xl font-black text-on-surface tracking-tighter">System <span className="text-primary italic">Administrators</span></h3>
            <p className="text-xs font-bold text-on-surface-variant mt-1">Personnel authorized for high-level operations.</p>
          </div>
          <div className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
            <Users size={14} className="text-on-surface-variant" />
            <span className="text-[10px] font-black">{admins.length} ACTIVE</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Master Fallback Admins (Logic Level) */}
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between border-dashed">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary italic">jjscarmotorbiketrans@gmail.com</p>
                <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Master Root (System Primary)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-md">Root</span>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between border-dashed opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-primary italic">avilanikkojosef1@gmail.com</p>
                <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Master Root (Emergency Override)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-md">Root</span>
          </div>

          {/* Collection-based Admins */}
          {admins.map((admin: any) => (
            <div key={admin.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-on-surface-variant">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{admin.email}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">UID: {admin.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-md">Verified Personnel</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
            <Plus size={24} />
          </div>
          <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">
            Secure Entry Provisioning
          </h4>
          <p className="text-[10px] font-bold text-on-surface-variant mb-6 max-w-xs mx-auto px-4 opacity-70">
            To grant access, add the personnel's <span className="text-primary italic">Firebase UID</span> to the 'admins' collection in your database.
          </p>
          <a 
            href="https://console.firebase.google.com" 
            target="_blank" 
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-primary text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all inline-flex items-center gap-2"
          >
            Open Admin Registry <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// --- Bookings Manager ---
function BookingsManager({ onSelectBooking }: { onSelectBooking: (b: any) => void }) {
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
          <div 
            key={booking.id} 
            onClick={() => onSelectBooking(booking)}
            className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all cursor-pointer"
          >
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
              <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'car',
    price: 0,
    category: 'Sedan',
    image: '',
    transmission: 'Auto',
    fuel: 'Unleaded',
    seats: 4,
    carwashFee: 0,
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

  const handleEdit = (vehicle: any) => {
    setEditingId(vehicle.id);
    setFormData({
      name: vehicle.name || '',
      type: vehicle.type || 'car',
      price: vehicle.price || 0,
      category: vehicle.category || 'Sedan',
      image: vehicle.image || '',
      transmission: vehicle.transmission || 'Auto',
      fuel: vehicle.fuel || 'Unleaded',
      seats: vehicle.seats || 4,
      carwashFee: vehicle.carwashFee || 0,
      description: vehicle.description || '',
      tags: Array.isArray(vehicle.tags) ? vehicle.tags.join(', ') : (vehicle.tags || '')
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `vehicles/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error: any) {
      console.error('Upload error:', error);
      let message = error.message;
      if (error.code === 'storage/unauthorized') {
        message = "Permission Denied: Your Firebase Storage rules are blocking this upload. Please update them to allow authenticated admins.";
      }
      alert(`Upload failed: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const vehicleData = {
        ...formData,
        price: Number(formData.price),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'vehicles', editingId), vehicleData);
      } else {
        await addDoc(collection(db, 'vehicles'), {
          ...vehicleData,
          rating: 5.0,
          createdAt: serverTimestamp()
        });
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        type: 'car',
        price: 0,
        category: 'Sedan',
        image: '',
        transmission: 'Auto',
        fuel: 'Unleaded',
        seats: 4,
        carwashFee: 0,
        description: '',
        tags: ''
      });
      fetchVehicles();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, editingId ? `vehicles/${editingId}` : 'vehicles');
    } finally {
      setSaving(false);
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
          onClick={() => {
            if (showForm) {
              setEditingId(null);
              setFormData({
                name: '',
                type: 'car',
                price: 0,
                category: 'Sedan',
                image: '',
                transmission: 'Auto',
                fuel: 'Unleaded',
                seats: 4,
                carwashFee: 0,
                description: '',
                tags: ''
              });
            }
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <XCircle size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Vehicle'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-col gap-4 mb-4"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Info size={18} />
              </div>
              <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Image Recommendations</h4>
                 <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                   <strong>Hero Banner:</strong> 1920x1080 (16:9) or better. <br/>
                   <strong>Vehicle Images:</strong> 1200x900 (4:3) recommended for best display.
                 </p>
              </div>
            </div>

             <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
               <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                 <ShieldCheck size={18} />
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Storage Activation Required</h4>
                  <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                    If uploads fail with "Unauthorized", please ensure your <strong>Firebase Storage Rules</strong> allow writes. 
                    Go to Firebase Console &gt; Storage &gt; Rules and set them to: <code className="bg-amber-100 px-1 rounded">allow read, write: if request.auth != null;</code>
                  </p>
               </div>
             </div>

            <form 
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-3xl p-8 overflow-hidden shadow-xl"
            >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Vehicle Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-semibold text-on-surface" placeholder="Ex: Toyota Hilux" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20">
                  <option value="car">Car</option>
                  <option value="motorbike">Motorbike</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20">
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
                <input 
                  type="number" 
                  required 
                  value={formData.price || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    setFormData({...formData, price: val === '' ? 0 : Number(val)});
                  }} 
                  className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-semibold" 
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Transmission</label>
                <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20">
                  <option>Auto</option>
                  <option>Manual</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Fuel</label>
                <select value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20">
                  <option>Unleaded</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Seaters</label>
                <input 
                  type="number" 
                  required 
                  value={formData.seats || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    setFormData({...formData, seats: val === '' ? 0 : Number(val)});
                  }} 
                  className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-semibold" 
                  placeholder="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Carwash Fee (₱)</label>
                <input 
                  type="number" 
                  value={formData.carwashFee || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    setFormData({...formData, carwashFee: val === '' ? 0 : Number(val)});
                  }} 
                  className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-semibold" 
                  placeholder="Leave 0 for default"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Image Content</label>
                <div className="flex gap-2">
                  <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none font-medium focus:ring-2 focus:ring-primary/20 text-on-surface" placeholder="Paste image URL here..." />
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="vehicle-upload" />
                    <label htmlFor="vehicle-upload" className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shadow-sm ${saving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-on-surface'}`}>
                      <Upload size={14} /> {saving ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-2 border border-slate-200 min-h-[80px]">
                {formData.image ? (
                  <img src={formData.image} referrerPolicy="no-referrer" className="h-20 w-auto object-contain rounded-lg shadow-sm" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon size={24} className="text-slate-300" />
                    <span className="text-[8px] text-slate-400 font-bold uppercase">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Tags (Comma separated)</label>
                <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none font-semibold focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Premium, SUV, etc." />
              </div>
              <div className="flex flex-col gap-2 md:col-span-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none h-24 font-medium focus:bg-white focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary w-full py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
            >
              {saving ? 'Processing...' : (editingId ? 'Update Vehicle Details' : 'Deploy to Catalog')}
              <ArrowRight size={18} />
            </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 relative overflow-hidden bg-slate-100">
              {v.image ? (
                <img 
                  src={v.image} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={v.name} 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600'; // Fallback
                    console.warn(`Failed to load image for ${v.name}, using fallback.`);
                  }}
                />
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{v.type} • {v.transmission} • {v.seats || 0} Seaters</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">₱{v.price}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">/ day</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleEdit(v)}
                  className="flex-1 py-3 rounded-xl bg-on-surface text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm"
                >
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
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    thumbnail: '',
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
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Cover Image URL or Upload</label>
                <div className="flex gap-2">
                  <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" placeholder="https://unsplash..." />
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSaving(true);
                      try {
                        const storageRef = ref(storage, `blog/hero_${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
                        const snapshot = await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(snapshot.ref);
                        setFormData(prev => ({ ...prev, image: url }));
                      } catch (err) {
                        console.error(err);
                        alert("Upload failed. Check storage rules.");
                      } finally {
                        setSaving(false);
                      }
                    }} className="hidden" id="blog-upload" />
                    <label htmlFor="blog-upload" className="px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-on-surface transition-all cursor-pointer shadow-sm flex items-center gap-2">
                      <Upload size={14} /> {saving ? '...' : 'Upload Hero'}
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Thumbnail (List View) URL or Upload</label>
                <div className="flex gap-2">
                  <input value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Small version of the cover image..." />
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setSaving(true);
                      try {
                        const storageRef = ref(storage, `blog/thumb_${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
                        const snapshot = await uploadBytes(storageRef, file);
                        const url = await getDownloadURL(snapshot.ref);
                        setFormData(prev => ({ ...prev, thumbnail: url }));
                      } catch (err) {
                        console.error(err);
                        alert("Upload failed.");
                      } finally {
                        setSaving(false);
                      }
                    }} className="hidden" id="blog-thumb-upload" />
                    <label htmlFor="blog-thumb-upload" className="px-6 py-3 rounded-xl bg-secondary text-white text-[10px] font-black uppercase tracking-widest hover:bg-on-surface transition-all cursor-pointer shadow-sm flex items-center gap-2">
                      <Upload size={14} /> {saving ? '...' : 'Upload Thumb'}
                    </label>
                  </div>
                </div>
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
                  <img src={post.thumbnail || post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" alt="" />
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
