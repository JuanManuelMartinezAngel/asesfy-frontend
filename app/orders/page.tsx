'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Calendar, User, DollarSign } from 'lucide-react';
import Link from 'next/link';
import supabase from '@/lib/supabase';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  total: number;
  services: string[];
  assignedAdvisor?: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusText = {
  pending: 'Pendiente',
  'in-progress': 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_services(
              service_name
            ),
            advisors(
              full_name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedOrders: Order[] = data?.map(order => ({
          id: order.id,
          orderNumber: order.order_number || `ASF-${order.id}`,
          date: new Date(order.created_at).toISOString().split('T')[0],
          status: order.status,
          total: order.total_amount || 0,
          services: order.order_services?.map((s: any) => s.service_name) || [],
          assignedAdvisor: order.advisors?.full_name
        })) || [];

        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.services.some(service => 
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">Gestiona y revisa el historial de tus servicios contratados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos</h3>
              <p className="text-gray-600 mb-6">
                {orders.length === 0 
                  ? "Aún no has realizado ningún pedido" 
                  : "No se encontraron pedidos que coincidan con tu búsqueda"
                }
              </p>
              <Button asChild>
                <Link href="/marketplace">Explorar Servicios</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Pedido realizado el {new Date(order.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                      {statusText[order.status]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Servicios</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {order.services.map((service, index) => (
                          <li key={index}>• {service}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Asesor Asignado</h4>
                      <p className="text-sm text-gray-600">
                        {order.assignedAdvisor || 'Por asignar'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Total</h4>
                      <p className="text-2xl font-bold text-gray-900">€{order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}