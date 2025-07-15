'use client';

import { useState, useEffect } from 'react';
import { useServicesStore } from '@/store/useServicesStore';
import { useCartStore } from '@/store/useCartStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter,
  Star,
  Clock,
  Euro,
  ShoppingCart,
  Check,
  Grid,
  List
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MarketplacePage() {
  const {
    services,
    categories,
    isLoading,
    fetchServices,
    getServicesByCategory,
    getPopularServices,
  } = useServicesStore();

  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getFilteredServices = () => {
    let filtered = services;

    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = getServicesByCategory(selectedCategory);
    }

    return filtered;
  };

  const handleAddToCart = (service: any) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace de Servicios</h1>
          <p className="text-gray-600">Encuentra los servicios fiscales que necesitas para tu negocio</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar servicios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Services */}
        {getPopularServices().length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Star className="mr-2 h-6 w-6 text-yellow-500" />
              Servicios Populares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getPopularServices().slice(0, 3).map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">Popular</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          {service.duration}
                        </div>
                        <div className="flex items-center text-2xl font-bold text-gray-900">
                          <Euro className="mr-1 h-5 w-5" />
                          {service.price}
                        </div>
                      </div>
                      
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="mr-2 h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full" onClick={() => handleAddToCart(service)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Añadir al Carrito
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Todos los Servicios</h2>
          
          {getFilteredServices().length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
                <p className="text-gray-600">
                  {services.length === 0 
                    ? "Aún no hay servicios disponibles" 
                    : "No se encontraron servicios que coincidan con tu búsqueda"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {getFilteredServices().map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="mr-1 h-4 w-4" />
                          {service.duration}
                        </div>
                        <div className="flex items-center text-2xl font-bold text-gray-900">
                          <Euro className="mr-1 h-5 w-5" />
                          {service.price}
                        </div>
                      </div>
                      
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Check className="mr-2 h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full" onClick={() => handleAddToCart(service)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Añadir al Carrito
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}