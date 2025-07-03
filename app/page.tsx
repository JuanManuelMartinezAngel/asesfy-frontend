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
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0A1B3D] to-[#21242F] text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-4 sm:mb-6 text-xs sm:text-sm">
                Plataforma Líder en Gestión Fiscal
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                Gestión Fiscal
                <span className="text-[#2FD7B5]"> Simplificada</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Automatiza tu gestión fiscal, accede a asesoramiento profesional 
                y optimiza tus obligaciones tributarias con nuestra plataforma integral.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                <Link href="/onboarding" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white w-full sm:w-auto"
                  >
                    Empezar ahora
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white bg-transparent w-full sm:w-auto"
                  >
                    Acceso Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 max-w-md mx-auto lg:mx-0">
                <p className="text-xs sm:text-sm text-gray-300 mb-2">🎯 <strong>Acceso Rápido Demo:</strong></p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="break-all">👤 <strong>Cliente:</strong> demo@asesfy.com / demo123456</div>
                  <div className="break-all">👨‍💼 <strong>Asesor:</strong> asesor@asesfy.com / asesor123456</div>
                </div>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 max-w-lg mx-auto">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Declaración IRPF</span>
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5]" />
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-lg">
                    <span className="text-xs sm:text-sm">IVA Trimestral</span>
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5]" />
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/10 rounded-lg">
                    <span className="text-xs sm:text-sm">Nóminas</span>
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#F4D35E]" />
                  </div>
                  <div className="p-3 sm:p-4 bg-[#2FD7B5]/10 rounded-lg border border-[#2FD7B5]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium">Ahorro Fiscal</span>
                      <span className="text-[#2FD7B5] font-bold text-sm sm:text-base">€2,340</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F5F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-3 sm:mb-4">
              Todo lo que necesitas para tu gestión fiscal
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Una plataforma completa que combina automatización, asesoramiento profesional 
              y herramientas avanzadas para simplificar tu gestión fiscal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2FD7B5]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-[#2FD7B5]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Automatización Fiscal</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Cálculos automáticos de impuestos, generación de documentos 
                  y presentación telemática de declaraciones.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F4D35E]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#F4D35E]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Asesoramiento Profesional</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Equipo de asesores fiscales certificados disponibles 
                  para consultas y planificación fiscal personalizada.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A1B3D]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-[#0A1B3D]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Seguridad Garantizada</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Cifrado de extremo a extremo, cumplimiento RGPD 
                  y máxima seguridad para tus datos fiscales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2FD7B5]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#2FD7B5]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Optimización Fiscal</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Análisis inteligente para identificar oportunidades 
                  de ahorro y optimización de tu carga tributaria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F4D35E]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-[#F4D35E]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Chat IA Especializado</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Asistente virtual con inteligencia artificial 
                  especializado en fiscalidad española.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#0A1B3D]/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-[#0A1B3D]" />
                </div>
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Gestión Documental</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Organización automática de documentos, 
                  recordatorios de vencimientos y archivo digital.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-2">+10K</div>
              <div className="text-gray-600 text-sm sm:text-base">Clientes Activos</div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-2">€2.5M</div>
              <div className="text-gray-600 text-sm sm:text-base">Ahorro Fiscal Generado</div>
            </div>
            <div className="p-4 sm:p-6 col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-2">99.9%</div>
              <div className="text-gray-600 text-sm sm:text-base">Tiempo de Actividad</div>
            </div>
            <div className="p-4 sm:p-6 col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-2">4.9/5</div>
              <div className="text-gray-600 text-sm sm:text-base">Satisfacción Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F5F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1B3D] mb-3 sm:mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Miles de empresas confían en Asesfy para su gestión fiscal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F4D35E] text-[#F4D35E]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  "Asesfy ha revolucionado la forma en que gestionamos nuestros impuestos. 
                  La automatización nos ahorra horas cada mes."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#0A1B3D] text-sm sm:text-base">María González</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Directora Financiera, TechStart</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F4D35E] text-[#F4D35E]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  "El asesoramiento personalizado y la atención al detalle son excepcionales. 
                  Recomiendo Asesfy sin dudarlo."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#0A1B3D] text-sm sm:text-base">Carlos Ruiz</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Fundador, Innovacorp</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F4D35E] text-[#F4D35E]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  "La plataforma es intuitiva y el soporte técnico responde rápidamente. 
                  Una inversión que vale la pena."
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-[#0A1B3D] text-sm sm:text-base">Ana Martín</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Gerente, Consultoría López</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#0A1B3D]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            ¿Listo para simplificar tu gestión fiscal?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            Únete a miles de empresas que ya confían en Asesfy para optimizar su fiscalidad
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white w-full sm:w-auto"
              >
                Comenzar Gratis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#0A1B3D] w-full sm:w-auto"
              >
                Ver Precios
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}