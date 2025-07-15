'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Users,
  Shield,
  Clock,
  ChevronRight,
  Star,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  FileText,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAdvisor, isLoading, isInitialized } = useAuthStore();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && isInitialized && !isLoading) {
      if (isAdvisor()) {
        router.push('/advisor');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isAdvisor, isInitialized, isLoading, router]);

  // Show loading while checking auth state
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1B3D] via-[#1A365D] to-[#2D3748] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Tu Gestoría Fiscal
              <span className="block text-[#2FD7B5]">Digital e Inteligente</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Simplifica tu gestión fiscal con nuestra plataforma integral. 
              Servicios profesionales, asesoramiento personalizado y herramientas digitales 
              que transforman tu experiencia fiscal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button 
                  size="lg" 
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-[#0A1B3D] font-semibold px-8 py-4 text-lg"
                >
                  Empezar Gratis
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-[#0A1B3D] px-8 py-4 text-lg"
                >
                  Ver Precios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1B3D] mb-4">
              Todo lo que necesitas en una plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desde declaraciones hasta asesoramiento especializado, 
              gestionamos tu fiscalidad de manera integral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-[#2FD7B5]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Calculator className="h-8 w-8 text-[#2FD7B5]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Gestión Automatizada
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Declaraciones de IVA, IRPF y Sociedades completamente automatizadas. 
                  Olvídate del papeleo manual.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-[#F4D35E]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#F4D35E]" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Asesoramiento Experto
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Acceso directo a asesores fiscales especializados. 
                  Consulta tus dudas cuando las necesites.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Máxima Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Tus datos están protegidos con el más alto nivel de seguridad. 
                  Cumplimiento total con la normativa.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Ahorro de Tiempo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Reduce el tiempo dedicado a gestiones fiscales en un 80%. 
                  Más tiempo para tu negocio.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Chat con IA
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Resuelve dudas fiscales al instante con nuestro asistente de IA 
                  especializado en legislación española.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-[#0A1B3D]">
                  Documentación Digital
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600">
                  Todos tus documentos organizados y accesibles desde cualquier lugar. 
                  Sin papeles, sin complicaciones.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1B3D] mb-4">
              Planes adaptados a tu negocio
            </h2>
            <p className="text-xl text-gray-600">
              Desde autónomos hasta empresas, tenemos el plan perfecto para ti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="border-2 border-gray-200 hover:border-[#2FD7B5] transition-colors">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 bg-blue-100 text-blue-800">Starter</Badge>
                <CardTitle className="text-2xl font-bold text-[#0A1B3D]">19€</CardTitle>
                <CardDescription className="text-gray-600">por mes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Hasta 5 facturas/mes</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Declaración trimestral IVA</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Soporte por email</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Chat con IA básico</span>
                  </div>
                </div>
                <Link href="/onboarding" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Empezar Gratis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-[#2FD7B5] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#2FD7B5] text-white">Más Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 bg-[#2FD7B5] text-white">Pro</Badge>
                <CardTitle className="text-2xl font-bold text-[#0A1B3D]">49€</CardTitle>
                <CardDescription className="text-gray-600">por mes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Facturas ilimitadas</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Todas las declaraciones</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Asesor fiscal asignado</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Chat con IA avanzado</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Soporte prioritario</span>
                  </div>
                </div>
                <Link href="/onboarding" className="block">
                  <Button className="w-full mt-6 bg-[#2FD7B5] hover:bg-[#2FD7B5]/90">
                    Empezar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 hover:border-[#F4D35E] transition-colors">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 bg-yellow-100 text-yellow-800">Enterprise</Badge>
                <CardTitle className="text-2xl font-bold text-[#0A1B3D]">149€</CardTitle>
                <CardDescription className="text-gray-600">por mes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Todo lo de Pro</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Múltiples empresas</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">API personalizada</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Consultoría estratégica</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Dedicación exclusiva</span>
                  </div>
                </div>
                <Link href="/onboarding" className="block">
                  <Button variant="outline" className="w-full mt-6">
                    Contactar Ventas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1B3D] mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Asesfy ha transformado completamente mi gestión fiscal. Lo que antes me llevaba días, 
                  ahora lo resuelvo en minutos."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-[#0A1B3D]">María González</p>
                    <p className="text-sm text-gray-600">Autónoma, Madrid</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "El asesoramiento personalizado es excepcional. Siempre tengo respuestas claras 
                  y precisas a mis consultas fiscales."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-[#0A1B3D]">Carlos Rodríguez</p>
                    <p className="text-sm text-gray-600">Director Financiero</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "La automatización de declaraciones me ha ahorrado tanto tiempo que ahora puedo 
                  enfocarme en hacer crecer mi negocio."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-[#0A1B3D]">Ana Martín</p>
                    <p className="text-sm text-gray-600">Emprendedora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0A1B3D] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para simplificar tu fiscalidad?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de empresarios que ya han digitalizado su gestión fiscal con Asesfy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-[#0A1B3D] font-semibold px-8 py-4 text-lg"
              >
                Prueba Gratis por 30 Días
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-[#0A1B3D] px-8 py-4 text-lg"
              >
                Conocer Más
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Sin permanencia • Cancela cuando quieras • Soporte 24/7
          </p>
        </div>
      </section>
    </div>
  );
}