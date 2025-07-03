'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { stripeProducts, type StripeProduct } from '@/src/stripe-config';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuthStore();

  const handleSubscribe = async (product: StripeProduct) => {
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para suscribirte');
      return;
    }

    setIsLoading(true);
    setLoadingPriceId(product.priceId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/checkout-success`,
          cancel_url: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la sesión de pago');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pago');
    } finally {
      setIsLoading(false);
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#0A1B3D] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1B3D] mb-4 sm:mb-6">
            Elige el plan perfecto para tu negocio
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Simplifica tu gestión fiscal con nuestros planes diseñados para 
            cada etapa de crecimiento de tu empresa.
          </p>
          <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 text-sm py-2 px-4">
            ✨ 30 días de prueba gratuita en todos los planes
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 sm:mb-16 max-w-5xl mx-auto">
          {stripeProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                index === 0 
                  ? 'ring-2 ring-[#2FD7B5] lg:scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {index === 0 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#2FD7B5] text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 p-6 sm:p-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-[#0A1B3D] mb-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-4 text-sm sm:text-base">
                  {product.description}
                </CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl sm:text-4xl font-bold text-[#0A1B3D]">
                    €{product.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-sm sm:text-base">
                    /mes
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8 pt-0">
                <ul className="space-y-3 mb-6 sm:mb-8">
                  {product.name === 'Starter Plan' ? (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Hasta 10 facturas mensuales</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Declaraciones trimestrales básicas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Soporte por email</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Acceso al marketplace básico</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">1 consulta mensual con asesor</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Facturas ilimitadas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Declaraciones completas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Soporte prioritario</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Acceso completo al marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">3 consultas mensuales con asesor</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Gestión de nóminas básica</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">Análisis fiscal personalizado</span>
                      </li>
                    </>
                  )}
                </ul>
                
                {isAuthenticated ? (
                  <Button 
                    onClick={() => handleSubscribe(product)}
                    disabled={isLoading}
                    className={`w-full h-12 text-sm sm:text-base font-medium ${
                      index === 0
                        ? 'bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white'
                        : 'bg-white border-2 border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white'
                    }`}
                  >
                    {loadingPriceId === product.priceId ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      'Elegir Plan'
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="w-full block">
                      <Button 
                        className={`w-full h-12 text-sm sm:text-base font-medium ${
                          index === 0
                            ? 'bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white'
                            : 'bg-white border-2 border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white'
                        }`}
                      >
                        Iniciar Sesión para Suscribirse
                      </Button>
                    </Link>
                    <div className="text-center">
                      <Link 
                        href="/onboarding" 
                        className="text-sm text-[#2FD7B5] hover:underline"
                      >
                        ¿No tienes cuenta? Créala gratis
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] text-center mb-8 sm:mb-12">
            Comparación Detallada
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 sm:p-6 font-semibold text-[#0A1B3D] text-sm sm:text-base">
                      Características
                    </th>
                    <th className="text-center p-4 sm:p-6 font-semibold text-[#0A1B3D] text-sm sm:text-base min-w-32">
                      Starter
                    </th>
                    <th className="text-center p-4 sm:p-6 font-semibold text-[#0A1B3D] text-sm sm:text-base min-w-32">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Facturas mensuales</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Hasta 10</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Ilimitadas</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Declaraciones fiscales</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Básicas</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Completas</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Consultas con asesor</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">1/mes</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">3/mes</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Soporte</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Email</td>
                    <td className="p-4 sm:p-6 text-center text-sm sm:text-base">Prioritario</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Gestión de nóminas</td>
                    <td className="p-4 sm:p-6 text-center">
                      <span className="text-gray-400 text-sm sm:text-base">—</span>
                    </td>
                    <td className="p-4 sm:p-6 text-center">
                      <CheckCircle className="h-5 w-5 text-[#2FD7B5] mx-auto" />
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 sm:p-6 text-gray-700 text-sm sm:text-base">Análisis fiscal personalizado</td>
                    <td className="p-4 sm:p-6 text-center">
                      <span className="text-gray-400 text-sm sm:text-base">—</span>
                    </td>
                    <td className="p-4 sm:p-6 text-center">
                      <CheckCircle className="h-5 w-5 text-[#2FD7B5] mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] text-center mb-8 sm:mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0A1B3D] mb-2 text-sm sm:text-base">
                  ¿Puedo cambiar de plan en cualquier momento?
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Sí, puedes actualizar o degradar tu plan en cualquier momento. 
                  Los cambios se aplicarán en tu próximo ciclo de facturación.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0A1B3D] mb-2 text-sm sm:text-base">
                  ¿Qué incluye la prueba gratuita?
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  La prueba gratuita de 30 días incluye acceso completo a todas las 
                  funciones del plan que elijas, sin restricciones.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-[#0A1B3D] mb-2 text-sm sm:text-base">
                  ¿Hay permanencia mínima?
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  No, no hay permanencia mínima. Puedes cancelar tu suscripción 
                  en cualquier momento desde tu panel de usuario.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] mb-4 sm:mb-6">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            Nuestro equipo de especialistas puede ayudarte a encontrar el plan 
            perfecto para las necesidades específicas de tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              variant="outline" 
              className="flex-1 h-12 text-sm sm:text-base"
              asChild
            >
              <a href="mailto:ventas@asesfy.com">
                Contactar Ventas
              </a>
            </Button>
            <Button 
              className="flex-1 bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white h-12 text-sm sm:text-base"
              asChild
            >
              <Link href="/chat-ia">
                Chat con IA
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}