'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Scale, Shield, Users, CreditCard, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F9] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-4">
            Actualizado: 15 de enero de 2024
          </Badge>
          <h1 className="text-4xl font-bold text-[#0A1B3D] mb-4">
            Términos de Uso
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Condiciones legales que regulan el uso de los servicios de Asesfy.
          </p>
        </div>

        <div className="space-y-8">
          {/* Introducción */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <FileText className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Aceptación de los Términos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Al acceder y utilizar los servicios de Asesfy, S.L. (en adelante "Asesfy", "nosotros" o "la Plataforma"), 
                aceptas automáticamente estos Términos de Uso. Si no estás de acuerdo con alguna de estas condiciones, 
                no deberás utilizar nuestros servicios. Estos términos constituyen un acuerdo legal vinculante entre 
                tú y Asesfy.
              </p>
            </CardContent>
          </Card>

          {/* Servicios */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Scale className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Descripción de los Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Servicios Fiscales y Contables</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Elaboración y presentación de declaraciones fiscales (IRPF, IVA, Sociedades)</li>
                  <li>• Asesoramiento fiscal personalizado</li>
                  <li>• Gestión contable y administrativa</li>
                  <li>• Constitución de sociedades y trámites mercantiles</li>
                  <li>• Planificación fiscal y optimización tributaria</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Plataforma Digital</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Acceso a panel de cliente personalizado</li>
                  <li>• Chat con inteligencia artificial especializada</li>
                  <li>• Gestión documental en la nube</li>
                  <li>• Calendario fiscal automatizado</li>
                  <li>• Marketplace de servicios adicionales</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Obligaciones del usuario */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Users className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Obligaciones del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Uso Responsable</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Proporcionar información veraz y actualizada</li>
                    <li>• Mantener la confidencialidad de tus credenciales</li>
                    <li>• No compartir tu cuenta con terceros</li>
                    <li>• Cumplir con la legislación aplicable</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Documentación</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Aportar documentos necesarios en tiempo y forma</li>
                    <li>• Verificar la exactitud de la información</li>
                    <li>• Colaborar en el proceso de asesoramiento</li>
                    <li>• Comunicar cambios relevantes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tarifas y pagos */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <CreditCard className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Tarifas y Condiciones de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Planes de Suscripción</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Starter Plan - €29.95/mes</h4>
                    <p className="text-sm text-blue-700">Ideal para autónomos y pequeñas empresas</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Pro Plan - €49.95/mes</h4>
                    <p className="text-sm text-green-700">Completo para empresas en crecimiento</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Condiciones de Pago</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Facturación mensual anticipada</li>
                    <li>• Renovación automática</li>
                    <li>• 30 días de prueba gratuita</li>
                    <li>• Cancelación sin compromiso</li>
                    <li>• Reembolso en caso de insatisfacción</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                  <strong>Importante:</strong> Los precios pueden cambiar con 30 días de aviso previo. 
                  Los servicios adicionales pueden tener costes separados según la tarifa vigente.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Propiedad intelectual */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Shield className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Propiedad Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Derechos de Asesfy</h3>
                <p className="text-gray-700 mb-3">
                  Todos los derechos de propiedad intelectual sobre la plataforma, incluyendo pero no limitado a:
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Software, código fuente y algoritmos</li>
                  <li>• Diseño, interfaz y experiencia de usuario</li>
                  <li>• Contenido, textos y materiales educativos</li>
                  <li>• Marcas, logos y elementos gráficos</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Licencia de Uso</h3>
                <p className="text-gray-700">
                  Te otorgamos una licencia no exclusiva, no transferible y revocable para usar 
                  nuestros servicios únicamente para tus necesidades fiscales y contables personales 
                  o empresariales.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitación de responsabilidad */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <AlertTriangle className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Limitación de Responsabilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h4 className="font-semibold text-red-800 mb-2">Exención de Garantías</h4>
                <p className="text-sm text-red-700">
                  Los servicios se proporcionan "tal como están". No garantizamos resultados específicos 
                  ni la ausencia de errores en el software.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#0A1B3D]">Limitaciones</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Nuestra responsabilidad se limita al importe pagado por los servicios</li>
                  <li>• No somos responsables de decisiones tomadas basadas en nuestro asesoramiento</li>
                  <li>• El cliente es responsable final de cumplir con sus obligaciones fiscales</li>
                  <li>• No garantizamos la disponibilidad 24/7 de la plataforma</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Cobertura de Seguro</h4>
                <p className="text-sm text-blue-700">
                  Asesfy cuenta con seguro de responsabilidad civil profesional que cubre 
                  errores u omisiones en nuestros servicios según los términos de la póliza.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cancelación y terminación */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Cancelación y Terminación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Por parte del Cliente</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Cancelación sin penalización con 30 días de aviso</li>
                    <li>• Acceso a datos hasta finalización del período pagado</li>
                    <li>• Descarga de documentos disponible por 90 días</li>
                    <li>• Reembolso proporcional si aplica</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Por parte de Asesfy</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Suspensión por incumplimiento de términos</li>
                    <li>• Aviso previo de 15 días salvo casos graves</li>
                    <li>• Mantenimiento de datos por tiempo legal</li>
                    <li>• Facilitar transición a otro proveedor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ley aplicable */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Ley Aplicable y Jurisdicción</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Estos términos se rigen por la legislación española. Para cualquier controversia 
                  relacionada con estos términos o el uso de nuestros servicios, las partes se 
                  someten a la jurisdicción de los tribunales de Madrid, España.
                </p>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Resolución de Conflictos</h4>
                  <p className="text-sm text-gray-700">
                    Antes de acudir a los tribunales, las partes intentarán resolver cualquier 
                    disputa mediante mediación o arbitraje según las normas del Centro de Arbitraje 
                    de la Cámara de Comercio de Madrid.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Modificaciones y Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Modificaciones</h3>
                  <p className="text-gray-700">
                    Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                    Los cambios significativos serán notificados con 30 días de antelación por 
                    email y a través de la plataforma.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Contacto</h3>
                  <div className="space-y-2 text-gray-700">
                    <p>Para consultas sobre estos términos:</p>
                    <p>Email: <a href="mailto:legal@asesfy.com" className="text-[#2FD7B5] hover:underline">legal@asesfy.com</a></p>
                    <p>Dirección: Calle Gran Vía, 123, 28013 Madrid, España</p>
                    <p>Teléfono: +34 900 123 456</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-[#2FD7B5] hover:underline">
              Política de Privacidad
            </Link>
            <Link href="/cookies" className="text-[#2FD7B5] hover:underline">
              Política de Cookies
            </Link>
            <Link href="/about" className="text-[#2FD7B5] hover:underline">
              Sobre Nosotros
            </Link>
            <Link href="/" className="text-[#2FD7B5] hover:underline">
              Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 