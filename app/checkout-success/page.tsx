'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Calculator, 
  Download, 
  Calendar,
  Users,
  MessageSquare,
  ArrowRight,
  Gift,
  Star
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get session_id from URL params
  const sessionId = searchParams.get('session_id');
  const planType = searchParams.get('plan') || 'starter';

  useEffect(() => {
    // Simulate loading order details
    const loadOrderDetails = async () => {
      setIsLoading(true);
      
      // Clear cart after successful purchase
      clearCart();
      
      // Mock order details
      const mockOrder = {
        id: 'ASF-2024-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toISOString(),
        plan: planType === 'pro' ? 'Pro Plan' : 'Starter Plan',
        amount: planType === 'pro' ? 49.95 : 29.95,
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: planType === 'pro' ? [
          'Facturas ilimitadas',
          'Declaraciones completas', 
          'Soporte prioritario',
          'Acceso completo al marketplace',
          '3 consultas mensuales con asesor',
          'Gestión de nóminas básica',
          'Análisis fiscal personalizado'
        ] : [
          'Hasta 10 facturas mensuales',
          'Declaraciones trimestrales básicas',
          'Soporte por email',
          'Acceso al marketplace básico',
          '1 consulta mensual con asesor'
        ]
      };
      
      setOrderDetails(mockOrder);
      setIsLoading(false);
    };

    loadOrderDetails();
  }, [sessionId, planType, clearCart]);

  const nextSteps = [
    {
      icon: Users,
      title: 'Asignación de Asesor',
      description: 'En las próximas 24 horas te asignaremos un asesor fiscal personal.',
      action: 'Ver perfil del asesor',
      link: '/advisor'
    },
    {
      icon: MessageSquare,
      title: 'Primera Consulta',
      description: 'Programa tu primera consulta gratuita para conocer tus necesidades.',
      action: 'Programar cita',
      link: '/calendar'
    },
    {
      icon: Download,
      title: 'Subir Documentos',
      description: 'Comparte tus documentos fiscales de forma segura en nuestra plataforma.',
      action: 'Subir documentos',
      link: '/documents'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu pedido...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Success */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-[#0A1B3D] mb-4">
            ¡Suscripción Exitosa!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gracias por confiar en Asesfy. Tu cuenta ha sido activada y ya puedes 
            empezar a disfrutar de todos nuestros servicios fiscales.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Calculator className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Detalles de tu Suscripción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-semibold text-[#0A1B3D]">{orderDetails?.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan seleccionado:</span>
                <Badge className="bg-[#2FD7B5] text-white">{orderDetails?.plan}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Importe:</span>
                <span className="font-semibold text-[#0A1B3D]">€{orderDetails?.amount}/mes</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fecha de inicio:</span>
                <span className="text-[#0A1B3D]">
                  {new Date(orderDetails?.date).toLocaleDateString('es-ES')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Próxima facturación:</span>
                <span className="text-[#0A1B3D]">
                  {new Date(orderDetails?.nextBilling).toLocaleDateString('es-ES')}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Star className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Características Incluidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {orderDetails?.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-[#2FD7B5] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Benefits */}
        <Card className="border-0 shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="text-[#0A1B3D] flex items-center">
              <Gift className="h-6 w-6 mr-3 text-[#2FD7B5]" />
              Beneficios de Bienvenida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-[#0A1B3D] mb-2">30 Días Gratis</h3>
                <p className="text-sm text-gray-600">
                  Tu primer mes está incluido. Solo pagarás a partir del segundo mes.
                </p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-[#0A1B3D] mb-2">Consulta Gratuita</h3>
                <p className="text-sm text-gray-600">
                  Primera sesión de 1 hora con tu asesor sin coste adicional.
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-[#0A1B3D] mb-2">Guía de Inicio</h3>
                <p className="text-sm text-gray-600">
                  Material exclusivo para optimizar tu gestión fiscal desde el día 1.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#0A1B3D] text-center mb-8">
            Próximos Pasos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-[#2FD7B5]/10 rounded-full flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-[#2FD7B5]" />
                    </div>
                    <div className="w-6 h-6 bg-[#0A1B3D] text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {step.description}
                  </p>
                  
                  <Link href={step.link}>
                    <Button variant="outline" size="sm" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                      {step.action}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0A1B3D] text-center">
              Accede a tu Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Tu cuenta está lista. Explora todas las funcionalidades disponibles 
                en tu panel de control personalizado.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Ir al Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <Link href="/marketplace">
                  <Button variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                    Explorar Servicios
                  </Button>
                </Link>
                
                <Link href="/chat-ia">
                  <Button variant="outline">
                    Probar Chat IA
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            ¿Tienes alguna pregunta? Nuestro equipo está aquí para ayudarte.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="mailto:soporte@asesfy.com" className="text-[#2FD7B5] hover:underline">
              soporte@asesfy.com
            </a>
            <span className="text-gray-400">•</span>
            <a href="tel:+34900123456" className="text-[#2FD7B5] hover:underline">
              +34 900 123 456
            </a>
            <span className="text-gray-400">•</span>
            <Link href="/chat-clientes" className="text-[#2FD7B5] hover:underline">
              Chat en vivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}