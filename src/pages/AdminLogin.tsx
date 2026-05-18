import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signInWithEmail, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in and verified, redirect
  useEffect(() => {
    if (user && isAdmin && sessionStorage.getItem('admin_verified') === 'true') {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      sessionStorage.setItem('admin_verified', 'true');
      // Direct navigation to bypass any delay in the useEffect's isAdmin update
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary shadow-inner">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-on-surface uppercase italic">
            Admin <span className="text-primary italic">Secure</span>
          </h1>
          <p className="text-on-surface-variant text-xs mt-2 font-black uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleCredentialsSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold text-on-surface shadow-inner"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-3 ml-1">Secure Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-sm font-semibold text-on-surface shadow-inner"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-5 rounded-[1.5rem] flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="text-xs uppercase tracking-[0.2em] font-black">Login to Console</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </motion.form>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
          <ShieldCheck size={14} />
          End-to-End Encrypted Console
        </div>
      </motion.div>
    </div>
  );
}
