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
  Tag,
  X,
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
  const [showFilters, setShowFilters] = useState(false);

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

  const clearFilters = () => {
    setLocalSearchQuery('');
    filterByCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] mb-2">
            Marketplace de Servicios Fiscales
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Encuentra y contrata los servicios fiscales que necesitas para tu negocio
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-6 sm:mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar servicios fiscales..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] text-sm sm:text-base"
              />
              {localSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setLocalSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 sm:max-w-xs">
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={(value) => filterByCategory(value === 'all' ? null : value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-[#2FD7B5] w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoría" />
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

              {/* Active Filters */}
              {(selectedCategory || localSearchQuery) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Filtros activos:</span>
                  {selectedCategory && (
                    <Badge variant="secondary" className="text-xs">
                      {selectedCategory}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto w-auto p-0 ml-1"
                        onClick={() => filterByCategory(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs h-auto py-1 px-2"
                  >
                    Limpiar todo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-600 text-sm sm:text-base">
            Mostrando {filteredServices.length} servicio{filteredServices.length !== 1 ? 's' : ''}
            {selectedCategory && ` en ${selectedCategory}`}
            {localSearchQuery && ` para "${localSearchQuery}"`}
          </p>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No se encontraron servicios</p>
              <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <CardHeader className="p-4 sm:p-6 flex-shrink-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-[#0A1B3D] mb-2 flex items-start gap-2 text-lg sm:text-xl">
                        <span className="line-clamp-2">{service.name}</span>
                        {service.popular && (
                          <Badge className="bg-[#F4D35E] text-[#0A1B3D] flex-shrink-0 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-sm sm:text-base line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl sm:text-2xl font-bold text-[#0A1B3D]">
                      €{service.price}
                    </div>
                    <Badge variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] text-xs">
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 pt-0 flex flex-col flex-1">
                  {service.duration && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      {service.duration}
                    </div>
                  )}

                  <div className="space-y-2 mb-4 sm:mb-6 flex-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start text-xs sm:text-sm">
                        <CheckCircle className="h-4 w-4 text-[#2FD7B5] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 line-clamp-2">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-xs sm:text-sm text-gray-500">
                        +{service.features.length - 3} característica{service.features.length - 3 !== 1 ? 's' : ''} más
                      </div>
                    )}
                  </div>

                  {service.tags && (
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {service.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{service.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => handleAddToCart(service)}
                    className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white mt-auto text-sm sm:text-base"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Añadir al Carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More - if needed */}
        {filteredServices.length > 0 && filteredServices.length >= 20 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Cargar más servicios
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}