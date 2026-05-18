import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Facebook, MessageSquare, Send, Clock } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! Our team will get back to you shortly.");
  };

  return (
    <div className="flex flex-col">
      {/* Hero Header */}
      <section className="bg-primary py-24 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 italic">
              Let's <span className="opacity-50">Connect.</span>
            </h1>
            <p className="text-white/80 max-w-xl font-medium text-lg leading-relaxed">
              Have questions about our fleet, long-term rates, or airport transfers? We're here to assist you 24/7.
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8">Reach Out Directly</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Call for Immediate Support</p>
                  <a href="tel:09272835299" className="text-2xl font-black text-on-surface hover:text-primary transition-colors">0927 283 5299</a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:-rotate-6">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Send us an Email</p>
                  <a href="mailto:jjscarmotorbiketrans@gmail.com" className="text-lg font-bold text-on-surface hover:text-primary transition-colors break-all">jjscarmotorbiketrans@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Visit our Operations Hub</p>
                  <p className="text-lg font-bold text-on-surface">San Jose DZR Airport Road, <br/>Tacloban City, 6500 Leyte</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Service Hours
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-on-surface-variant">Monday — Sunday</span>
                <span className="font-bold text-on-surface">06:00 AM – 10:00 PM</span>
              </div>
            </div>
            <p className="text-[10px] text-on-surface-variant font-medium mt-6 leading-relaxed italic">
              * Airport pickups can be arranged outside regular hours with advance booking.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-primary/5 border border-slate-100">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
              <MessageSquare size={12} /> Contact Registry
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-on-surface">How can we <span className="text-primary italic">help?</span></h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-primary/20 transition-all font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Subject</label>
              <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-primary/20 transition-all font-bold appearance-none">
                <option>General Inquiry</option>
                <option>Corporate Car Rental</option>
                <option>Long-term Leasing</option>
                <option>Partner with us</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Message</label>
              <textarea 
                rows={6}
                required
                placeholder="Tell us about your requirements..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-primary/20 transition-all font-medium resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-on-surface text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-3 group"
            >
              Dispatch Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>

      {/* Social Media Connect */}
      <section className="py-24 px-8 bg-on-surface text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold tracking-tight mb-4 italic text-primary">Join the Community</h2>
            <p className="text-white/60 font-medium">Follow us for travel tips, fleet updates, and exclusive promos in Tacloban.</p>
          </div>
          <a 
            href="https://www.facebook.com/jjscmt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white/10 px-10 py-5 rounded-full border border-white/20 hover:bg-primary transition-all group"
          >
            <Facebook size={32} className="group-hover:scale-110 transition-transform" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white">Facebook Page</p>
              <p className="text-lg font-bold tracking-tight">@jjscmt</p>
            </div>
          </a>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-[80px]"></div>
           <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary rounded-full blur-[60px]"></div>
        </div>
      </section>
    </div>
  );
}
