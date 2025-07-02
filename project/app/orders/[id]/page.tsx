'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Euro, 
  FileText, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface OrderDetail {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  total: number;
  services: Array<{
    name: string;
    price: number;
    description: string;
  }>;
  assignedAdvisor?: {
    name: string;
    email: string;
    phone: string;
  };
  timeline: Array<{
    date: string;
    status: string;
    description: string;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = params?.id as string || 'unknown';

  // Mock order detail data
  const mockOrder: OrderDetail = {
    id: orderId,
    orderNumber: 'ASF-2024-001',
    date: '2024-01-20',
    status: 'completed',
    total: 89,
    services: [
      {
        name: 'Declaración de la Renta',
        price: 89,
        description: 'Gestión completa de tu declaración anual de IRPF'
      }
    ],
    assignedAdvisor: {
      name: 'María García',
      email: 'maria.garcia@asesfy.com',
      phone: '+34 600 123 456'
    },
    timeline: [
      {
        date: '2024-01-20',
        status: 'Pedido realizado',
        description: 'Tu pedido ha sido confirmado y está en cola de procesamiento'
      },
      {
        date: '2024-01-21',
        status: 'Asesor asignado',
        description: 'María García ha sido asignada como tu asesora fiscal'
      },
      {
        date: '2024-01-22',
        status: 'En progreso',
        description: 'Hemos comenzado a trabajar en tu declaración'
      },
      {
        date: '2024-01-25',
        status: 'Completado',
        description: 'Tu declaración ha sido completada y presentada'
      }
    ]
  };

  useEffect(() => {
    const loadOrder = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock order with correct ID
      const mockOrderData: OrderDetail = {
        ...mockOrder,
        id: orderId,
        orderNumber: `ASF-2024-${orderId.slice(-3).padStart(3, '0')}`,
      };
      
      setOrder(mockOrderData);
      setIsLoading(false);
    };

    if (orderId && orderId !== 'unknown') {
      loadOrder();
    } else {
      setIsLoading(false);
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#0A1B3D] mb-2">Pedido no encontrado</h1>
            <p className="text-gray-600">
              El pedido con ID "{orderId}" no existe o no tienes permisos para verlo.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/orders">
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                Volver a Mis Pedidos
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">
                Ir al Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to orders */}
        <Link 
          href="/orders" 
          className="inline-flex items-center text-[#2FD7B5] hover:text-[#2FD7B5]/80 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a pedidos
        </Link>

        {/* Order Header */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-[#0A1B3D]">
                  Pedido {order?.orderNumber}
                </CardTitle>
                <CardDescription>
                  Realizado el {order ? new Date(order.date).toLocaleDateString('es-ES') : ''}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(order?.status ?? '')} text-lg px-4 py-2`}>
                {order?.status === 'pending' && 'Pendiente'}
                {order?.status === 'in-progress' && 'En Progreso'}
                {order?.status === 'completed' && 'Completado'}
                {order?.status === 'cancelled' && 'Cancelado'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Servicios Contratados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.services.map((service, index) => (
                    <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#0A1B3D]">{service.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#0A1B3D]">€{service.price}</div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-[#0A1B3D]">
                      <span>Total</span>
                      <span>€{order?.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Estado del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order?.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#2FD7B5] rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-[#0A1B3D]">{event.status}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Advisor */}
            {order?.assignedAdvisor && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0A1B3D]">Asesor Asignado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#2FD7B5] rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-[#0A1B3D]">{order?.assignedAdvisor?.name}</div>
                        <div className="text-sm text-gray-500">Asesor Fiscal Senior</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {order?.assignedAdvisor?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {order?.assignedAdvisor?.phone}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Contactar Asesor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order?.status === 'completed' && (
                  <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Documentos
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Factura
                </Button>
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    Contactar Soporte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}