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
      <section className="bg-gradient-to-br from-[#0A1B3D] to-[#21242F] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-6">
                Plataforma Líder en Gestión Fiscal
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Gestión Fiscal
                <span className="text-[#2FD7B5]"> Simplificada</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Automatiza tu gestión fiscal, accede a asesoramiento profesional 
                y optimiza tus obligaciones tributarias con nuestra plataforma integral.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <Button size="lg" className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Empezar ahora
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white bg-transparent">
                    Acceso Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <p className="text-sm text-gray-300 mb-2">🎯 <strong>Acceso Rápido Demo:</strong></p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>👤 <strong>Cliente:</strong> demo@asesfy.com / demo123456</div>
                  <div>👨‍💼 <strong>Asesor:</strong> asesor@asesfy.com / asesor123456</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <span className="text-sm">Declaración IRPF</span>
                    <CheckCircle className="h-5 w-5 text-[#2FD7B5]" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <span className="text-sm">IVA Trimestral</span>
                    <CheckCircle className="h-5 w-5 text-[#2FD7B5]" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <span className="text-sm">Nóminas</span>
                    <Clock className="h-5 w-5 text-[#F4D35E]" />
                  </div>
                  <div className="p-4 bg-[#2FD7B5]/10 rounded-lg border border-[#2FD7B5]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Ahorro Fiscal</span>
                      <span className="text-[#2FD7B5] font-bold">€2,340</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F5F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1B3D] mb-4">
              Todo lo que necesitas para tu gestión fiscal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa que combina automatización, asesoramiento profesional 
              y herramientas avanzadas para simplificar tu gestión fiscal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#2FD7B5]/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-[#2FD7B5]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Automatización Fiscal</CardTitle>
                <CardDescription>
                  Cálculos automáticos de impuestos, generación de documentos 
                  y presentación telemática de declaraciones.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#F4D35E]/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#F4D35E]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Asesoramiento Profesional</CardTitle>
                <CardDescription>
                  Equipo de asesores fiscales certificados disponibles 
                  para consultas y planificación fiscal personalizada.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0A1B3D]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-[#0A1B3D]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Seguridad Garantizada</CardTitle>
                <CardDescription>
                  Cifrado de extremo a extremo, cumplimiento RGPD 
                  y máxima seguridad para tus datos fiscales.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#2FD7B5]/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-[#2FD7B5]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Optimización Fiscal</CardTitle>
                <CardDescription>
                  Análisis inteligente para identificar oportunidades 
                  de ahorro y optimización de tu carga tributaria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#F4D35E]/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-[#F4D35E]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Chat IA Especializado</CardTitle>
                <CardDescription>
                  Asistente virtual con inteligencia artificial 
                  especializado en fiscalidad española.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#0A1B3D]/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-[#0A1B3D]" />
                </div>
                <CardTitle className="text-[#0A1B3D]">Gestión Documental</CardTitle>
                <CardDescription>
                  Organización automática de documentos, 
                  recordatorios de vencimientos y archivo digital.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#0A1B3D] mb-2">+10,000</div>
              <div className="text-gray-600">Clientes Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0A1B3D] mb-2">€2.5M</div>
              <div className="text-gray-600">Ahorro Fiscal Generado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0A1B3D] mb-2">99.9%</div>
              <div className="text-gray-600">Tiempo de Actividad</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#0A1B3D] mb-2">4.9/5</div>
              <div className="text-gray-600">Satisfacción Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#F5F6F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1B3D] mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#F4D35E] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Asesfy ha revolucionado la gestión fiscal de mi empresa. 
                  Lo que antes me tomaba días, ahora lo resuelvo en minutos."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#2FD7B5] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">MG</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1B3D]">María García</div>
                    <div className="text-sm text-gray-500">CEO, TechStart</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#F4D35E] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "El chat con IA es increíble. Resuelve todas mis dudas fiscales 
                  al instante y me ha ahorrado mucho dinero en consultas."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#0A1B3D] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">JL</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1B3D]">Juan López</div>
                    <div className="text-sm text-gray-500">Autónomo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#F4D35E] fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "La mejor inversión que he hecho para mi negocio. 
                  El ROI se vio reflejado desde el primer mes."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#F4D35E] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">AR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A1B3D]">Ana Ruiz</div>
                    <div className="text-sm text-gray-500">Directora Financiera</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0A1B3D] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para simplificar tu gestión fiscal?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de profesionales que ya confían en Asesfy 
            para optimizar su gestión fiscal y ahorrar tiempo y dinero.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90">
                Comenzar Gratis
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white bg-transparent">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}