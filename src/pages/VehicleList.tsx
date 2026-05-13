import React, { useState, useEffect } from 'react';
import VehicleCard from '../components/VehicleCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function VehicleList() {
  const [vehicleType, setVehicleType] = useState<string[]>(['car', 'motorbike']);
  const [categories, setCategories] = useState<string[]>(['Sedan', 'Hatchback', 'Van', 'MPV', 'SUV', 'L300', 'Motorbike']);
  const [transmission, setTransmission] = useState<string>('Automatic');
  const [fuelTypes, setFuelTypes] = useState<string[]>(['Unleaded', 'Diesel', 'Electric']);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'vehicles'));
        const dbVehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVehicles(dbVehicles);
      } catch (error) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);
  
  const filteredVehicles = vehicles.filter(v => 
    vehicleType.includes(v.type) && 
    categories.includes(v.category) &&
    (transmission === 'Automatic' ? v.transmission === 'Auto' : v.transmission === 'Manual') &&
    fuelTypes.includes(v.fuel)
  );

  if (loading) return <div className="p-24 text-center">Fueling up the fleet...</div>;

  const allCategories = ['Sedan', 'Hatchback', 'Van', 'MPV', 'SUV', 'L300', 'Motorbike'];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="glass-card p-10 lg:p-10 sticky top-24 bg-white">
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-100">
              <h2 className="text-3xl font-bold tracking-tight text-on-surface">Filters</h2>
              <button 
                className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:text-on-surface-variant transition-colors"
                onClick={() => {
                  setVehicleType(['car', 'motorbike']);
                  setCategories(['Sedan', 'Hatchback', 'Van', 'MPV', 'SUV', 'L300', 'Motorbike']);
                  setTransmission('Automatic');
                  setFuelTypes(['Unleaded', 'Diesel', 'Electric']);
                }}
              >
                Reset
              </button>
            </div>

            {/* Vehicle Type */}
            <div className="mb-12">
              <h3 className="text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-[0.3em]">Vehicle Type</h3>
              <div className="flex flex-col gap-5">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={vehicleType.includes('car')}
                      onChange={(e) => {
                        if (e.target.checked) setVehicleType([...vehicleType, 'car']);
                        else setVehicleType(vehicleType.filter(t => t !== 'car'));
                      }}
                      className="peer w-6 h-6 appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                    />
                    <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-on-primary font-bold text-[10px]">✓</div>
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Cars</span>
                </label>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={vehicleType.includes('motorbike')}
                      onChange={(e) => {
                        if (e.target.checked) setVehicleType([...vehicleType, 'motorbike']);
                        else setVehicleType(vehicleType.filter(t => t !== 'motorbike'));
                      }}
                      className="peer w-6 h-6 appearance-none rounded-lg border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                    />
                    <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-white font-bold text-[10px]">✓</div>
                  </div>
                  <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">Motorbikes</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="mb-12">
              <h3 className="text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-[0.3em]">Category</h3>
              <div className="flex flex-col gap-4">
                {allCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={categories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) setCategories([...categories, cat]);
                          else setCategories(categories.filter(t => t !== cat));
                        }}
                        className="peer w-5 h-5 appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                      />
                      <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-on-primary font-bold text-[8px]">✓</div>
                    </div>
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-12">
              <h3 className="text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-[0.3em]">Transmission</h3>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setTransmission('Automatic')}
                  className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                    transmission === 'Automatic' 
                      ? 'bg-primary text-on-primary border-primary shadow-md' 
                      : 'bg-slate-50 text-on-surface-variant border-transparent hover:border-slate-200'
                  }`}
                >
                  Automatic
                </button>
                <button 
                  onClick={() => setTransmission('Manual')}
                  className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest border-2 transition-all ${
                    transmission === 'Manual' 
                      ? 'btn-accent' 
                      : 'bg-white/5 text-on-surface-variant border-transparent hover:border-white/10'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <h3 className="text-[10px] font-bold text-on-surface-variant mb-6 uppercase tracking-[0.3em]">Fuel Type</h3>
              <div className="flex flex-col gap-5">
                {['Unleaded', 'Diesel', 'Electric'].map((fuel) => (
                  <label key={fuel} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={fuelTypes.includes(fuel)}
                        onChange={(e) => {
                          if (e.target.checked) setFuelTypes([...fuelTypes, fuel]);
                          else setFuelTypes(fuelTypes.filter(f => f !== fuel));
                        }}
                        className="peer w-6 h-6 appearance-none rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                      />
                      <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none text-on-primary font-bold text-[10px]">✓</div>
                    </div>
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{fuel}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <p className="text-xl font-medium text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{filteredVehicles.length}</span> vehicles available
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Sort by:</span>
              <select className="bg-white border border-slate-200 rounded-2xl py-3 px-8 text-[10px] font-bold uppercase tracking-widest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm appearance-none min-w-[200px]">
                <option className="bg-white">Recommended</option>
                <option className="bg-white">Price: Low to High</option>
                <option className="bg-white">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-on-surface-variant">
                No vehicles found matching your criteria.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center items-center gap-3">
            <button className="w-12 h-12 rounded-full border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50">
              <ChevronLeft size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-md">1</button>
            <button className="w-12 h-12 rounded-full border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-bold">2</button>
            <button className="w-12 h-12 rounded-full border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all text-sm font-bold">3</button>
            <button className="w-12 h-12 rounded-full border-2 border-surface-container-highest flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
