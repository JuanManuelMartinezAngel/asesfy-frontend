'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';
import supabase from '@/lib/supabase';

interface OrderDetails {
  id: string;
  date: string;
  plan: string;
  amount: number;
  nextBilling: string;
  features: string[];
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order_id');

    if (!sessionId && !orderId) {
      router.push('/pricing');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        // Clear cart after successful purchase
        clearCart();
        
        // Fetch order details from Supabase
        let orderData;
        
        if (orderId) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
            
          if (error) throw error;
          orderData = data;
        } else {
          // If no orderId, create a basic order record
          const { data, error } = await supabase
            .from('orders')
            .insert({
              user_id: user?.id,
              session_id: sessionId,
              status: 'completed',
              created_at: new Date().toISOString()
            })
            .select()
            .single();
            
          if (error) throw error;
          orderData = data;
        }

        // Fetch subscription details if available
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setOrderDetails({
          id: orderData.id,
          date: orderData.created_at,
          plan: subscriptionData?.plan_type || 'Basic Plan',
          amount: subscriptionData?.amount || 29.95,
          nextBilling: subscriptionData?.next_billing_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          features: subscriptionData?.features || [
            'Hasta 10 facturas mensuales',
            'Declaraciones trimestrales básicas',
            'Soporte por email',
            'Acceso al marketplace básico',
            '1 consulta mensual con asesor'
          ]
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Fallback to basic success message without specific details
        setOrderDetails({
          id: 'ASF-' + Date.now(),
          date: new Date().toISOString(),
          plan: 'Subscription',
          amount: 0,
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          features: ['Acceso a la plataforma']
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, router, clearCart, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Procesando tu compra...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error al procesar la compra</p>
          <Button asChild className="mt-4">
            <Link href="/pricing">Volver a Precios</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Compra Realizada con Éxito!
          </h1>
          <p className="text-xl text-gray-600">
            Tu suscripción ha sido activada correctamente
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Detalles de la Compra
              </CardTitle>
              <CardDescription>
                Información de tu pedido #{orderDetails.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Plan:</span>
                <Badge variant="secondary">{orderDetails.plan}</Badge>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Importe:</span>
                <span className="font-semibold">€{orderDetails.amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Fecha de compra:</span>
                <span>{new Date(orderDetails.date).toLocaleDateString('es-ES')}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Próxima facturación:</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(orderDetails.nextBilling).toLocaleDateString('es-ES')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Tu Plan Incluye</CardTitle>
              <CardDescription>
                Características de tu suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {orderDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Descargar Factura
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/settings">
                Configurar Cuenta
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/marketplace">
                Explorar Servicios
              </Link>
            </Button>
          </div>
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Próximos Pasos</CardTitle>
            <CardDescription>
              Te recomendamos seguir estos pasos para aprovechar al máximo tu suscripción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Completa tu Perfil</h3>
                <p className="text-sm text-gray-600">
                  Añade tu información fiscal para personalizar tu experiencia
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Conecta tus Cuentas</h3>
                <p className="text-sm text-gray-600">
                  Vincula tus cuentas bancarias para automatizar la gestión
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Agenda tu Primera Consulta</h3>
                <p className="text-sm text-gray-600">
                  Programa una sesión con nuestros asesores expertos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            ¿Necesitas ayuda? Contacta con nuestro{' '}
            <Link href="/chat" className="text-blue-600 hover:underline">
              soporte técnico
            </Link>{' '}
            o envíanos un email a{' '}
            <a href="mailto:soporte@asesfy.com" className="text-blue-600 hover:underline">
              soporte@asesfy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}