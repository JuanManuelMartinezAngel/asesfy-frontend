'use client';

import { useState, useEffect, useCallback } from 'react';
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
  AlertCircle,
  CreditCard,
  DollarSign
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ✅ Interfaz adaptada a la tabla orders de Supabase
interface Order {
  id: string;
  order_number: string;
  client_id: string;
  advisor_id?: string;
  total_amount: number;
  tax_amount: number;
  subtotal_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  stripe_session_id?: string;
  description?: string;
  due_date?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  // Campos del JOIN
  client_name?: string;
  client_email?: string;
  advisor_name?: string;
  // Campos calculados
  services?: string[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    totalAmount: 0
  });

  // ✅ Función para obtener el usuario actual
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  // ✅ Función para cargar órdenes reales desde Supabase
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver tus pedidos');
        return;
      }

      setCurrentUser(user);

      let query = supabase
        .from('orders')
        .select(`
          *,
          client:users!client_id(
            id,
            full_name,
            email
          ),
          advisor:users!advisor_id(
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar según el rol del usuario
      if (user.user_metadata?.role === 'advisor') {
        // Advisor: ver órdenes de sus clientes asignados
        const { data: clientIds } = await supabase
          .from('client_profiles')
          .select('user_id')
          .eq('assigned_advisor_id', user.id);

        const clientIdsList = clientIds?.map(c => c.user_id) || [];
        if (clientIdsList.length > 0) {
          query = query.in('client_id', clientIdsList);
        }
      } else {
        // Cliente: ver solo sus propias órdenes
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Error al cargar pedidos');
        return;
      }

      // Mapear datos para incluir campos de cliente y asesor
      const mappedOrders = data?.map(order => ({
        ...order,
        client_name: order.client?.full_name,
        client_email: order.client?.email,
        advisor_name: order.advisor?.full_name,
        services: [order.description || 'Servicio de consultoría'] // Por ahora usamos description
      })) || [];

      setOrders(mappedOrders);

      // Calcular estadísticas
      const statsData = {
        total: mappedOrders.length,
        pending: mappedOrders.filter(o => o.status === 'pending').length,
        paid: mappedOrders.filter(o => o.status === 'paid').length,
        totalAmount: mappedOrders
          .filter(o => o.status === 'paid')
          .reduce((sum, order) => sum + order.total_amount, 0)
      };
      setStats(statsData);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para actualizar estado de orden (solo para advisors)
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      if (!currentUser || currentUser.user_metadata?.role !== 'advisor') {
        toast.error('No tienes permisos para actualizar órdenes');
        return;
      }

      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Si se marca como pagado, actualizar payment_status y paid_at
      if (newStatus === 'paid') {
        updateData.payment_status = 'paid';
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast.error('Error al actualizar estado del pedido');
        return;
      }

      // Actualizar estado local inmediatamente
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { 
          ...order, 
          status: newStatus,
          ...(newStatus === 'paid' && { 
            payment_status: 'paid',
            paid_at: new Date().toISOString() 
          })
        } : order
      ));

      toast.success('Estado del pedido actualizado');

      // Recalcular estadísticas
      await loadOrders();

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado del pedido');
    }
  };

  // ✅ Función para descargar factura/recibo
  const downloadInvoice = async (order: Order) => {
    try {
      // Generar PDF simple o redirigir a endpoint de factura
      const invoiceData = {
        orderNumber: order.order_number,
        clientName: order.client_name,
        amount: order.total_amount,
        date: order.created_at,
        description: order.description
      };

      // Por ahora mostramos toast, pero aquí iría la generación de PDF
      toast.success(`Descargando factura ${order.order_number}`);
      
      // TODO: Implementar generación de PDF real
      console.log('Invoice data:', invoiceData);

    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Error al descargar factura');
    }
  };

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      case 'refunded': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar órdenes
  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
            {currentUser?.user_metadata?.role === 'advisor' ? 'Facturación de Clientes' : 'Mis Pedidos'}
          </h1>
          <p className="text-gray-600">
            {currentUser?.user_metadata?.role === 'advisor' 
              ? 'Gestiona la facturación y pagos de todos tus clientes'
              : 'Gestiona y revisa el estado de todos tus servicios contratados'
            }
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-[#0A1B3D]" />
                <div className="text-2xl font-bold text-[#0A1B3D]">
                  {stats.total}
                </div>
              </div>
              <div className="text-sm text-gray-600">Total Pedidos</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
              </div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </div>
              </div>
              <div className="text-sm text-gray-600">Pagados</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Euro className="h-5 w-5 text-[#2FD7B5]" />
                <div className="text-2xl font-bold text-[#2FD7B5]">
                  €{stats.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {currentUser?.user_metadata?.role === 'advisor' ? 'Facturado' : 'Invertido'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número de pedido, servicio o cliente..."
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
                  {searchQuery ? 'Intenta ajustar tu búsqueda' : 'Aún no hay pedidos registrados'}
                </p>
                {currentUser?.user_metadata?.role !== 'advisor' && (
                  <Link href="/marketplace">
                    <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                      Explorar Servicios
                    </Button>
                  </Link>
                )}
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
                          Pedido {order.order_number}
                        </h3>
                        <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                          {getStatusIcon(order.status)}
                          <span>
                            {order.status === 'pending' && 'Pendiente'}
                            {order.status === 'paid' && 'Pagado'}
                            {order.status === 'cancelled' && 'Cancelado'}
                            {order.status === 'refunded' && 'Reembolsado'}
                          </span>
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          <CreditCard className="h-3 w-3 mr-1" />
                          {order.payment_status === 'pending' && 'Pago Pendiente'}
                          {order.payment_status === 'paid' && 'Pagado'}
                          {order.payment_status === 'failed' && 'Pago Fallido'}
                          {order.payment_status === 'refunded' && 'Reembolsado'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(order.created_at).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          €{order.total_amount.toFixed(2)}
                          {order.tax_amount > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              (IVA: €{order.tax_amount.toFixed(2)})
                            </span>
                          )}
                        </div>
                        {currentUser?.user_metadata?.role === 'advisor' && order.client_name && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2" />
                            Cliente: {order.client_name}
                          </div>
                        )}
                        {order.advisor_name && currentUser?.user_metadata?.role !== 'advisor' && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2" />
                            Asesor: {order.advisor_name}
                          </div>
                        )}
                        {order.payment_method && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Método: {order.payment_method}
                          </div>
                        )}
                        {order.paid_at && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Pagado: {new Date(order.paid_at).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>

                      {order.description && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">Descripción:</p>
                          <p className="text-sm text-gray-600">{order.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                      
                      {order.status === 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadInvoice(order)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Factura
                        </Button>
                      )}

                      {/* Acciones para advisors */}
                      {currentUser?.user_metadata?.role === 'advisor' && (
                        <div className="flex flex-col space-y-1">
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Marcar Pagado
                            </Button>
                          )}
                          {order.status === 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'refunded')}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              Reembolsar
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}