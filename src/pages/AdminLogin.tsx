import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Loader2, RefreshCcw } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function AdminLogin() {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const { signInWithEmail, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const sendOtpEmail = async (targetEmail: string, code: string) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.warn('EmailJS keys missing. OTP logged to console only.');
      return false;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: targetEmail,
          otp_code: code,
          app_name: 'Seff Car Rental Admin'
        },
        publicKey
      );
      return true;
    } catch (err) {
      console.error('EmailJS Error:', err);
      return false;
    }
  };

  // If already logged in and verified, redirect
  useEffect(() => {
    if (user && isAdmin && sessionStorage.getItem('admin_verified') === 'true') {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      
      // If we reach here, credentials are correct.
      // Now trigger OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      
      // Send real email via EmailJS
      await sendOtpEmail(email, code);
      
      // In this environment, we still log to console as a backup
      console.log(`[SECURITY] OTP for ${email}: ${code}`);
      
      setStep('otp');
      setTimeLeft(300); // 5 minutes
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const enteredOtp = otp.join('');
    
    setTimeout(() => {
      if (enteredOtp === generatedOtp) {
        sessionStorage.setItem('admin_verified', 'true');
        navigate('/admin');
      } else {
        setError('Invalid verification code. Please check and try again.');
        setLoading(false);
      }
    }, 1500);
  };

  const resendOtp = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    await sendOtpEmail(email, code);
    console.log(`[SECURITY] RESENT OTP for ${email}: ${code}`);
    
    setTimeLeft(300);
    setOtp(['', '', '', '', '', '']);
    setError('');
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

        <AnimatePresence mode="wait">
          {step === 'credentials' ? (
            <motion.form 
              key="credentials"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
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
                    <span className="text-xs uppercase tracking-[0.2em] font-black">Continue</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-sm text-on-surface-variant font-medium mb-6">
                  We've sent a 6-digit verification code to <span className="text-on-surface font-bold">{email}</span>.
                </p>
                
                <div className="flex justify-between gap-2 max-w-[280px] mx-auto mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-10 h-14 bg-slate-50 border-none rounded-xl text-center text-xl font-black text-on-surface focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                    />
                  ))}
                </div>


              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-center w-full">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={loading || otp.some(d => !d)}
                  className="w-full btn-primary py-5 rounded-[1.5rem] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:grayscale transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <span className="text-xs uppercase tracking-[0.2em] font-black">Verify Identity</span>
                      <ShieldCheck size={18} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Resend code in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                  ) : (
                    <button 
                      type="button" 
                      onClick={resendOtp}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 mx-auto"
                    >
                      <RefreshCcw size={12} />
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
          <ShieldCheck size={14} />
          End-to-End Encrypted Console
        </div>
      </motion.div>
    </div>
  );
}
