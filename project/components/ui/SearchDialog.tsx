'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Calculator, 
  Users, 
  Calendar,
  MessageSquare,
  Settings,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  icon: any;
  keywords: string[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Dashboard Principal',
      description: 'Resumen de tu actividad fiscal y contable',
      category: 'Navegación',
      url: '/dashboard',
      icon: TrendingUp,
      keywords: ['dashboard', 'inicio', 'resumen', 'actividad', 'panel']
    },
    {
      id: '2',
      title: 'Documentos',
      description: 'Gestiona y sube tus documentos fiscales',
      category: 'Gestión',
      url: '/documents',
      icon: FileText,
      keywords: ['documentos', 'archivos', 'subir', 'fiscal', 'pdf']
    },
    {
      id: '3',
      title: 'Calendario Fiscal',
      description: 'Fechas importantes y obligaciones tributarias',
      category: 'Planificación',
      url: '/calendar',
      icon: Calendar,
      keywords: ['calendario', 'fechas', 'obligaciones', 'vencimientos', 'tributario']
    },
    {
      id: '4',
      title: 'Chat con IA',
      description: 'Consulta fiscal inteligente 24/7',
      category: 'Consultas',
      url: '/chat-ia',
      icon: MessageSquare,
      keywords: ['chat', 'ia', 'inteligencia artificial', 'consulta', 'preguntas']
    },
    {
      id: '5',
      title: 'Marketplace',
      description: 'Servicios fiscales adicionales',
      category: 'Servicios',
      url: '/marketplace',
      icon: Calculator,
      keywords: ['marketplace', 'servicios', 'comprar', 'adicional', 'fiscal']
    },
    {
      id: '6',
      title: 'Mis Asesores',
      description: 'Contacta con tu equipo de asesores',
      category: 'Soporte',
      url: '/advisor',
      icon: Users,
      keywords: ['asesores', 'equipo', 'contacto', 'profesionales', 'ayuda']
    },
    {
      id: '7',
      title: 'Configuración',
      description: 'Ajusta las preferencias de tu cuenta',
      category: 'Cuenta',
      url: '/settings',
      icon: Settings,
      keywords: ['configuración', 'ajustes', 'preferencias', 'cuenta', 'perfil']
    },
    {
      id: '8',
      title: 'Facturación',
      description: 'Gestiona tus pagos y suscripciones',
      category: 'Cuenta',
      url: '/orders',
      icon: CreditCard,
      keywords: ['facturación', 'pagos', 'suscripción', 'billing', 'cobros']
    },
    {
      id: '9',
      title: 'Declaración de la Renta',
      description: 'Información sobre IRPF y declaraciones',
      category: 'Ayuda',
      url: '/blog',
      icon: FileText,
      keywords: ['renta', 'irpf', 'declaración', 'hacienda', 'impuestos']
    },
    {
      id: '10',
      title: 'IVA Trimestral',
      description: 'Gestión y presentación del IVA',
      category: 'Ayuda',
      url: '/blog',
      icon: Calculator,
      keywords: ['iva', 'trimestral', 'impuesto', 'valor', 'añadido']
    }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Debounced search function
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = searchData.filter(item => {
        const searchTerm = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm) ||
          item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
        );
      }).slice(0, 8); // Limit to 8 results

      setResults(filtered);
      setIsLoading(false);
    }, 300);
  }, []);

  // Handle search input changes
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;

    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent-searches', JSON.stringify(updated));
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(searchQuery);
    onOpenChange(false);
    router.push(result.url);
    setSearchQuery('');
  };

  const handleRecentSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0A1B3D] flex items-center">
            <Search className="h-5 w-5 mr-2 text-[#2FD7B5]" />
            Buscar en Asesfy
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar documentos, servicios, configuración..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-3 text-base"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2FD7B5]"></div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery && results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-700 px-2">
                Resultados ({results.length})
              </h3>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#2FD7B5] hover:bg-[#2FD7B5]/5 transition-colors text-left group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-[#2FD7B5]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#2FD7B5]/20 transition-colors">
                      <result.icon className="h-5 w-5 text-[#2FD7B5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[#0A1B3D] truncate">
                          {result.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {result.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#2FD7B5] transition-colors flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery && !isLoading && results.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 text-sm">
                Intenta con otros términos de búsqueda o explora las categorías disponibles.
              </p>
            </div>
          )}

          {/* Recent Searches & Quick Actions */}
          {!searchQuery && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Búsquedas recientes
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Limpiar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentSearchClick(search)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        <Clock className="h-3 w-3" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Acciones rápidas
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/documents">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => onOpenChange(false)}
                    >
                      <FileText className="h-4 w-4 mr-2 text-[#2FD7B5]" />
                      <div className="text-left">
                        <div className="font-medium">Subir Documento</div>
                        <div className="text-xs text-gray-500">Añadir archivos</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/chat-ia">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => onOpenChange(false)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 text-[#2FD7B5]" />
                      <div className="text-left">
                        <div className="font-medium">Consulta IA</div>
                        <div className="text-xs text-gray-500">Pregunta fiscal</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/calendar">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => onOpenChange(false)}
                    >
                      <Calendar className="h-4 w-4 mr-2 text-[#2FD7B5]" />
                      <div className="text-left">
                        <div className="font-medium">Ver Calendario</div>
                        <div className="text-xs text-gray-500">Fechas importantes</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/marketplace">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => onOpenChange(false)}
                    >
                      <Calculator className="h-4 w-4 mr-2 text-[#2FD7B5]" />
                      <div className="text-left">
                        <div className="font-medium">Servicios</div>
                        <div className="text-xs text-gray-500">Explorar marketplace</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> para ir al primer resultado
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 