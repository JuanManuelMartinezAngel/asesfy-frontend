'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Calendar, 
  Euro, 
  FileText, 
  Eye,
  Download,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  total: number;
  services: string[];
  assignedAdvisor?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ASF-2024-001',
      date: '2024-01-20',
      status: 'completed',
      total: 89,
      services: ['Declaración de la Renta'],
      assignedAdvisor: 'María García'
    },
    {
      id: '2',
      orderNumber: 'ASF-2024-002',
      date: '2024-01-18',
      status: 'in-progress',
      total: 45,
      services: ['IVA Trimestral'],
      assignedAdvisor: 'Carlos Ruiz'
    },
    {
      id: '3',
      orderNumber: 'ASF-2024-003',
      date: '2024-01-15',
      status: 'pending',
      total: 299,
      services: ['Constitución de Sociedad'],
    },
  ];

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando pedidos...</p>
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
            Mis Pedidos
          </h1>
          <p className="text-gray-600">
            Gestiona y revisa el estado de todos tus servicios contratados
          </p>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número de pedido o servicio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron pedidos
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Intenta ajustar tu búsqueda' : 'Aún no has realizado ningún pedido'}
                </p>
                <Link href="/marketplace">
                  <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Explorar Servicios
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-[#0A1B3D]">
                          Pedido {order.orderNumber}
                        </h3>
                        <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                          {getStatusIcon(order.status)}
                          <span>
                            {order.status === 'pending' && 'Pendiente'}
                            {order.status === 'in-progress' && 'En Progreso'}
                            {order.status === 'completed' && 'Completado'}
                            {order.status === 'cancelled' && 'Cancelado'}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(order.date).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Euro className="h-4 w-4 mr-2" />
                          €{order.total}
                        </div>
                        {order.assignedAdvisor && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2" />
                            Asesor: {order.assignedAdvisor}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">Servicios:</p>
                        {order.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                      {order.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">
                {orders.length}
              </div>
              <div className="text-sm text-gray-600">Total Pedidos</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {orders.filter(o => o.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#2FD7B5] mb-1">
                €{orders.reduce((sum, order) => sum + order.total, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Invertido</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}