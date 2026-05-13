import { Car, Bike, Users, Settings, Gauge, Fuel, Luggage, Star, Calendar, MapPin, ChevronRight, Lock, ArrowRight, BookOpen, Clock, Shield, Info, Phone } from 'lucide-react';

export interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'motorbike';
  category: 'Sedan' | 'Hatchback' | 'Van' | 'MPV' | 'SUV' | 'L300' | 'Motorbike';
  price: number;
  image: string;
  rating: number;
  seats?: number;
  transmission: 'Auto' | 'Manual';
  fuel: 'Unleaded' | 'Diesel' | 'Electric';
  cc?: string;
  capacity?: string;
  tags: string[];
  description: string;
  specs: {
    engine: string;
    horsepower: string;
    driveType: string;
    ac: string;
    infotainment: string;
    safety: string;
  };
}

export const VEHICLES: Vehicle[] = [];
