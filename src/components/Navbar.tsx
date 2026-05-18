import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const location = useLocation();

  const { user, logout } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'general'), (doc) => {
      if (doc.exists()) {
        setLogo(doc.data().logo);
      }
    });
    return () => unsub();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: 'Blog', path: '/blog' },
    ...(user ? [{ name: 'My Bookings', path: '/bookings' }] : []),
  ];

  return (
    <nav className="glass sticky top-0 z-50 px-6 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {logo && logo.trim() !== '' ? (
            <img src={logo} alt="JJ Logo" className="max-h-12 w-auto object-contain" />
          ) : (
            <div className="w-10 h-10 bg-on-surface rounded-xl flex items-center justify-center shadow-lg shadow-on-surface/10">
              <span className="text-white font-bold">JJ</span>
            </div>
          )}
          <span className="text-lg font-black tracking-tighter text-on-surface font-display hidden lg:block uppercase">
            JJ's CAR & Motorbike <span className="text-primary italic">TRANS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 h-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`h-full flex items-center text-xs uppercase tracking-[0.2em] font-semibold transition-all relative ${
                location.pathname === link.path
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(254,183,0,0.5)]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <Link
            to="/vehicles"
            className="btn-accent text-sm"
          >
            Book Now
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-on-surface"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 glass p-8 md:hidden flex flex-col gap-6 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-lg font-light tracking-tight text-on-surface"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
