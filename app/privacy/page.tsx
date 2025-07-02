'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Users, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F9] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-4">
            Actualizado: 15 de enero de 2024
          </Badge>
          <h1 className="text-4xl font-bold text-[#0A1B3D] mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En Asesfy, protegemos tu privacidad y datos personales con los más altos estándares de seguridad.
          </p>
        </div>

        <div className="space-y-8">
          {/* Introducción */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Shield className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Introducción
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Asesfy, S.L. (en adelante, "Asesfy", "nosotros", "nos" o "nuestro") respeta tu privacidad y 
                se compromete a proteger los datos personales que compartes con nosotros. Esta Política de 
                Privacidad describe cómo recopilamos, utilizamos, compartimos y protegemos tu información 
                personal cuando utilizas nuestros servicios de asesoría fiscal.
              </p>
            </CardContent>
          </Card>

          {/* Datos que recopilamos */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Eye className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Datos que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Datos Personales</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Nombre completo y datos de contacto (email, teléfono, dirección)</li>
                  <li>• NIF/NIE y datos fiscales necesarios para nuestros servicios</li>
                  <li>• Información financiera y contable</li>
                  <li>• Documentos fiscales y declaraciones</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Datos Técnicos</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Dirección IP y datos de navegación</li>
                  <li>• Cookies y tecnologías similares</li>
                  <li>• Logs de actividad en la plataforma</li>
                  <li>• Información del dispositivo y navegador</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Uso de datos */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <FileText className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Cómo Utilizamos tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Servicios Principales</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Prestación de servicios fiscales y contables</li>
                    <li>• Elaboración de declaraciones y documentos</li>
                    <li>• Asesoramiento personalizado</li>
                    <li>• Comunicación sobre tu cuenta</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#0A1B3D]">Mejoras del Servicio</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Análisis de uso de la plataforma</li>
                    <li>• Mejora de funcionalidades</li>
                    <li>• Soporte técnico y atención al cliente</li>
                    <li>• Prevención de fraude y seguridad</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base legal */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Lock className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Base Legal del Tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Ejecución de Contrato</h4>
                  <p className="text-gray-700 text-sm">
                    Procesamos tus datos para cumplir con los servicios contratados y nuestras obligaciones contractuales.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Cumplimiento Legal</h4>
                  <p className="text-gray-700 text-sm">
                    Tratamos datos para cumplir con obligaciones legales fiscales y contables.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Interés Legítimo</h4>
                  <p className="text-gray-700 text-sm">
                    Para mejorar nuestros servicios, seguridad y comunicaciones comerciales relevantes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Derechos del usuario */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Users className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Tus Derechos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Acceso</h4>
                      <p className="text-sm text-gray-600">Obtener información sobre tus datos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Rectificación</h4>
                      <p className="text-sm text-gray-600">Corregir datos inexactos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Supresión</h4>
                      <p className="text-sm text-gray-600">Solicitar la eliminación de datos</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Portabilidad</h4>
                      <p className="text-sm text-gray-600">Obtener tus datos en formato estructurado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Oposición</h4>
                      <p className="text-sm text-gray-600">Oponerte al tratamiento</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#2FD7B5] rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-[#0A1B3D]">Limitación</h4>
                      <p className="text-sm text-gray-600">Restringir el procesamiento</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[#2FD7B5]/10 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Para ejercer tus derechos:</strong> Contacta con nosotros en{' '}
                  <a href="mailto:privacidad@asesfy.com" className="text-[#2FD7B5] hover:underline">
                    privacidad@asesfy.com
                  </a>{' '}
                  o a través de nuestro formulario de contacto.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Shield className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Seguridad de los Datos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos personales:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-[#0A1B3D]">Cifrado</h4>
                    <p className="text-sm text-gray-600">SSL/TLS en todas las comunicaciones</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-[#0A1B3D]">Acceso Controlado</h4>
                    <p className="text-sm text-gray-600">Autenticación y autorización rigurosa</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-[#0A1B3D]">Auditorías</h4>
                    <p className="text-sm text-gray-600">Revisiones regulares de seguridad</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Calendar className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Contacto y Actualizaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Delegado de Protección de Datos</h4>
                  <p className="text-gray-700">
                    Email: <a href="mailto:dpo@asesfy.com" className="text-[#2FD7B5] hover:underline">dpo@asesfy.com</a><br />
                    Dirección: Calle Gran Vía, 123, 28013 Madrid, España
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#0A1B3D] mb-2">Autoridad de Control</h4>
                  <p className="text-gray-700">
                    Agencia Española de Protección de Datos (AEPD)<br />
                    Web: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-[#2FD7B5] hover:underline">www.aepd.es</a>
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Nota:</strong> Esta política puede actualizarse periódicamente. 
                    Te notificaremos de cambios significativos por email o a través de la plataforma.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/terms" className="text-[#2FD7B5] hover:underline">
              Términos de Uso
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