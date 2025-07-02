'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F5F6F9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1B3D] mb-6">
            Elige el plan perfecto para tu negocio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Simplifica tu gestión fiscal con nuestros planes diseñados para 
            cada etapa de crecimiento de tu empresa.
          </p>
          <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 text-sm py-2 px-4">
            ✨ 30 días de prueba gratuita en todos los planes
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {stripeProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                index === 0 
                  ? 'ring-2 ring-[#2FD7B5] scale-105' 
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
              
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-[#0A1B3D] mb-2">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {product.description}
                </CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-[#0A1B3D]">
                    €{product.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /mes
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {product.name === 'Starter Plan' ? (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Hasta 10 facturas mensuales</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Declaraciones trimestrales básicas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Soporte por email</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Acceso al marketplace básico</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">1 consulta mensual con asesor</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Facturas ilimitadas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Declaraciones completas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Soporte prioritario</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Acceso completo al marketplace</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">3 consultas mensuales con asesor</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Gestión de nóminas básica</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-[#2FD7B5] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Análisis fiscal personalizado</span>
                      </li>
                    </>
                  )}
                </ul>
                
                {isAuthenticated ? (
                  <Button 
                    onClick={() => handleSubscribe(product)}
                    disabled={isLoading}
                    className={`w-full ${
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
                  <Link href="/login">
                    <Button 
                      className={`w-full ${
                        index === 0
                          ? 'bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white'
                          : 'bg-white border-2 border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white'
                      }`}
                    >
                      Iniciar Sesión para Elegir
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-[#0A1B3D] text-center mb-8">
            Preguntas Frecuentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-[#0A1B3D] mb-2">
                ¿Puedo cambiar de plan en cualquier momento?
              </h3>
              <p className="text-gray-600 text-sm">
                Sí, puedes actualizar o reducir tu plan en cualquier momento desde 
                tu panel de configuración. Los cambios se aplican inmediatamente.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#0A1B3D] mb-2">
                ¿Qué incluye la prueba gratuita?
              </h3>
              <p className="text-gray-600 text-sm">
                La prueba de 30 días incluye acceso completo a todas las 
                funcionalidades del plan que elijas, sin limitaciones.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#0A1B3D] mb-2">
                ¿Hay permanencia mínima?
              </h3>
              <p className="text-gray-600 text-sm">
                No, nuestros planes son mensuales sin permanencia. Puedes 
                cancelar tu suscripción en cualquier momento.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#0A1B3D] mb-2">
                ¿Incluyen soporte técnico?
              </h3>
              <p className="text-gray-600 text-sm">
                Todos los planes incluyen soporte técnico. Los planes superiores 
                tienen soporte prioritario y por teléfono.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-[#0A1B3D] mb-4">
            ¿Necesitas un plan personalizado?
          </h2>
          <p className="text-gray-600 mb-6">
            Para empresas con necesidades específicas, ofrecemos planes a medida 
            con funcionalidades personalizadas.
          </p>
          <Button variant="outline" size="lg" className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
            Contactar con Ventas
          </Button>
        </div>
      </div>
    </div>
  );
}