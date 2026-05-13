import { Link } from 'react-router-dom';
import { Star, Settings, Users, Fuel, Gauge } from 'lucide-react';
import { Vehicle } from '../constants';
import { motion } from 'motion/react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass-card overflow-hidden flex flex-col group p-2"
    >
      <Link to={`/vehicles/${vehicle.id}`} className="relative h-56 overflow-hidden rounded-[32px] bg-slate-100 flex items-center justify-center">
        {vehicle.image && vehicle.image.trim() !== '' ? (
          <img
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300">
            <Settings size={48} strokeWidth={1} />
            <span className="text-[10px] uppercase font-black tracking-widest">No Image Asset</span>
          </div>
        )}
        {vehicle.tags.length > 0 && (
          <div className="absolute top-4 left-4 glass rounded-full px-4 py-1.5 border border-slate-200 shadow-sm">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface">
              {vehicle.tags[0]}
            </span>
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-on-surface leading-tight group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em] mt-2">
              {vehicle.category}
            </p>
          </div>
          <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full border border-slate-200">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-[10px] font-bold tabular-nums text-on-surface">
              {vehicle.rating}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-slate-200">
            <Settings size={12} className="text-secondary" />
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
              {vehicle.transmission}
            </span>
          </div>
          {vehicle.seats && (
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border border-slate-200">
              <Users size={12} className="text-secondary" />
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                {vehicle.seats} Seats
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] block font-black mb-1">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary tabular-nums">₱{vehicle.price}</span>
              <span className="text-xs text-on-surface-variant font-bold">/day</span>
            </div>
          </div>
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="btn-primary h-12 w-12 !p-0 flex items-center justify-center rounded-full"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
