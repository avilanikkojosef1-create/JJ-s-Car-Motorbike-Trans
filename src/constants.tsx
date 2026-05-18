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
  tags: string[];
  description: string;
}

export const VEHICLES: Vehicle[] = [];
