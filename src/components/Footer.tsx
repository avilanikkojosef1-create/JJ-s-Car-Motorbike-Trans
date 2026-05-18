import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook } from 'lucide-react';

export default function Footer() {
  const sections = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Our Fleet', path: '/vehicles' },
    { name: 'Travel Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <footer className="bg-white border-t border-slate-100 py-20 px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Brand & Mission */}
        <div className="md:col-span-4">
          <h3 className="text-2xl font-bold tracking-tight text-on-surface mb-6">
            JJ's Car & Motorbike <span className="text-primary font-black">Trans</span>
          </h3>
          <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-8 max-w-sm">
            Providing premium car and motorbike rental services in Tacloban City. We focus on efficiency, reliability, and making your adventure seamless.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/jjscmt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all shadow-sm border border-slate-100"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface mb-8">Contact Information</h4>
          <ul className="flex flex-col gap-6">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <span className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Our Location</span>
                <span className="text-sm font-bold text-on-surface">San Jose DZR Airport Road, Tacloban City, 6500 Leyte</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <span className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Call Us</span>
                <span className="text-sm font-bold text-on-surface underline decoration-primary/30 underline-offset-4">0927 283 5299</span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <span className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Email Us</span>
                <span className="text-sm font-bold text-on-surface truncate">jjscarmotorbiketrans@gmail.com</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface mb-8">Quick Navigation</h4>
          <nav className="grid grid-cols-1 gap-4">
            {sections.map((section) => (
              <Link
                key={section.name}
                to={section.path}
                className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-primary transition-colors"></div>
                {section.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-black">
            Confidence on the Move • © 2024 JJ's Trans
          </p>
          <Link to="/admin" className="text-[8px] font-black uppercase tracking-widest text-slate-300 hover:text-primary transition-colors w-fit">
            Admin Portal
          </Link>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">
          <span className="cursor-help hover:text-on-surface transition-colors">Registered Transport Operator</span>
        </div>
      </div>
    </footer>
  );
}
