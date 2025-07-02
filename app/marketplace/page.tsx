'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useServicesStore } from '@/store/useServicesStore';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Clock, 
  CheckCircle,
  Tag
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
    selectedCategory,
    searchQuery,
    isLoading,
    loadServices,
    filterByCategory,
    setSearchQuery,
    getFilteredServices,
  } = useServicesStore();

  const { addItem } = useCartStore();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localSearchQuery, setSearchQuery]);

  const filteredServices = getFilteredServices();

  const handleAddToCart = (service: any) => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category,
    });
    
    toast.success(`${service.name} añadido al carrito`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Marketplace de Servicios Fiscales
          </h1>
          <p className="text-gray-600">
            Encuentra y contrata los servicios fiscales que necesitas para tu negocio
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar servicios..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
              />
            </div>
            <div className="min-w-[200px]">
              <Select
                value={selectedCategory || 'all'}
                onValueChange={(value) => filterByCategory(value === 'all' ? null : value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-[#2FD7B5]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-[#0A1B3D] mb-2 flex items-center">
                      {service.name}
                      {service.popular && (
                        <Badge className="ml-2 bg-[#F4D35E] text-[#0A1B3D]">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-[#0A1B3D]">
                    €{service.price}
                  </div>
                  <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5]">
                    {service.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                {service.duration && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {service.duration}
                  </div>
                )}

                <div className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-[#2FD7B5] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{service.features.length - 3} características más
                    </div>
                  )}
                </div>

                {service.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => handleAddToCart(service)}
                  className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir al Carrito
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
              No se encontraron servicios
            </h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-[#0A1B3D] text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-gray-300 mb-6">
            Nuestros asesores pueden ayudarte a encontrar la solución perfecta 
            para tus necesidades fiscales específicas.
          </p>
          <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
            Contactar con un Asesor
          </Button>
        </div>
      </div>
    </div>
  );
}