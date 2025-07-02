import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  duration?: string;
  features: string[];
  popular?: boolean;
}

interface ServicesState {
  services: Service[];
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  loadServices: () => Promise<void>;
  filterByCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredServices: () => Service[];
}

// Mock services data
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Declaración de la Renta',
    description: 'Gestión completa de tu declaración anual de IRPF',
    price: 89,
    category: 'Declaraciones',
    tags: ['IRPF', 'Anual', 'Personal'],
    duration: '2-3 días',
    features: ['Revisión completa', 'Optimización fiscal', 'Presentación telemática'],
    popular: true
  },
  {
    id: '2',
    name: 'IVA Trimestral',
    description: 'Liquidación trimestral del IVA para autónomos y empresas',
    price: 45,
    category: 'IVA',
    tags: ['Trimestral', 'Autónomos', 'Empresas'],
    duration: '1-2 días',
    features: ['Cálculo automático', 'Presentación online', 'Seguimiento'],
  },
  {
    id: '3',
    name: 'Constitución de Sociedad',
    description: 'Trámites completos para crear tu empresa',
    price: 299,
    category: 'Sociedades',
    tags: ['Constitución', 'SL', 'Notaría'],
    duration: '7-10 días',
    features: ['Estatutos personalizados', 'Gestión notarial', 'Registro mercantil'],
  },
  {
    id: '4',
    name: 'Asesoría Fiscal Mensual',
    description: 'Asesoramiento fiscal continuo para tu negocio',
    price: 120,
    category: 'Asesoría',
    tags: ['Mensual', 'Continuo', 'Personalizado'],
    duration: 'Mensual',
    features: ['Consultas ilimitadas', 'Planificación fiscal', 'Soporte telefónico'],
  },
  {
    id: '5',
    name: 'Nóminas y Seguros Sociales',
    description: 'Gestión completa de nóminas y cotizaciones',
    price: 15,
    category: 'Laboral',
    tags: ['Nóminas', 'SS', 'Trabajadores'],
    duration: 'Por trabajador',
    features: ['Nómina mensual', 'Liquidaciones SS', 'Certificados'],
  },
  {
    id: '6',
    name: 'Recurso Hacienda',
    description: 'Interposición de recursos ante la Administración',
    price: 199,
    category: 'Recursos',
    tags: ['Recurso', 'Hacienda', 'Defensa'],
    duration: '15-30 días',
    features: ['Análisis del caso', 'Redacción recurso', 'Seguimiento'],
  }
];

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,

  loadServices: async () => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const categories = [...new Set(mockServices.map(s => s.category))];
      
      set({
        services: mockServices,
        categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error loading services',
        isLoading: false,
      });
    }
  },

  filterByCategory: (category) => {
    set({ selectedCategory: category });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredServices: () => {
    const { services, selectedCategory, searchQuery } = get();
    
    let filtered = services;

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  },
}));