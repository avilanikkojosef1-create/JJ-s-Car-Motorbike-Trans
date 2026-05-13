import React from 'react';
import { motion } from 'motion/react';
import { Shield, Clock, MapPin, Users, Star, Award } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Vehicles', value: '50+', icon: Award },
    { label: 'Happy Clients', value: '10k+', icon: Users },
    { label: 'Service Years', value: '8+', icon: Clock },
    { label: 'Locations', value: '2', icon: MapPin },
  ];

  const values = [
    {
      title: 'Reliability',
      description: 'Our fleet is maintained to the highest standards, ensuring your safety and peace of mind on every journey.',
      icon: Shield
    },
    {
      title: 'Local Expertise',
      description: 'As a Tacloban-based operator, we know the terrain and the needs of our community better than anyone.',
      icon: MapPin
    },
    {
      title: 'Premium Service',
      description: 'From booking to drop-off, we provide a seamless, high-touch experience tailored to your needs.',
      icon: Star
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-slate-50 py-32 px-8 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] text-primary font-bold mb-4"
          >
            Since 2016
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-on-surface mb-8 max-w-4xl leading-[0.9]"
          >
            Driven by <span className="text-primary italic">Excellence</span>, <br />Rooted in Tacloban.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed"
          >
            JJ's Car & Motorbike Trans began with a simple mission: to provide the most reliable and efficient transport solutions in Leyte. Today, we are proud to be the trusted partner for both local travelers and international visitors.
          </motion.p>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </section>

      {/* Stats */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-4xl font-bold text-on-surface mb-1">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant font-black">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-3">Our Values</p>
            <h2 className="text-5xl font-bold tracking-tight text-on-surface mb-6">What Defines <span className="text-primary/70">Us</span></h2>
            <div className="w-24 h-1 bg-primary/20 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, i) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-10 flex flex-col gap-6 hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-on-surface">
                  <value.icon size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-on-surface mb-4">{value.title}</h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Journey" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-[-40px] left-[-40px] glass-card p-8 z-20 max-w-[240px]">
              <p className="text-sm font-bold text-on-surface mb-2 italic">"We don't just rent vehicles, we enable adventures."</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-primary">— JJ, Founder</p>
            </div>
          </div>
          <div>
            <h2 className="text-5xl font-bold tracking-tight text-on-surface mb-8">A Journey Of <span className="text-primary/70">Trust</span></h2>
            <div className="flex flex-col gap-6 text-on-surface-variant text-lg font-medium leading-relaxed">
              <p>
                Founded in 2016, JJ's Car & Motorbike Trans started as a small local family business with just three motorbikes. Our goal was simple: provide reliable transport for residents and travelers in Tacloban City.
              </p>
              <p>
                Through dedication to customer service and a commitment to vehicle maintenance, we've grown into a premier transport operator in Leyte. We now manage a diverse fleet ranging from economical motorbikes to premium executive SUVs.
              </p>
              <p>
                Whether you're here for a business trip, a family vacation, or a solo adventure across the islands, we are here to ensure your journey is smooth, safe, and memorable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
