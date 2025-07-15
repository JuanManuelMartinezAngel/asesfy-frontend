import { create } from 'zustand';
import supabase from '@/lib/supabase';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  popular?: boolean;
  features: string[];
}

interface ServicesState {
  services: Service[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServicesByCategory: (category: string) => Service[];
  getPopularServices: () => Service[];
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;

      const services: Service[] = data?.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        category: service.category,
        duration: service.duration || '1-2 días',
        popular: service.popular || false,
        features: service.features || []
      })) || [];

      const categories = [...new Set(services.map(s => s.category))];

      set({ 
        services, 
        categories, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      set({ 
        error: 'Error al cargar los servicios',
        isLoading: false,
        services: [],
        categories: []
      });
    }
  },

  getServicesByCategory: (category: string) => {
    const { services } = get();
    return services.filter(service => service.category === category);
  },

  getPopularServices: () => {
    const { services } = get();
    return services.filter(service => service.popular);
  },
}));