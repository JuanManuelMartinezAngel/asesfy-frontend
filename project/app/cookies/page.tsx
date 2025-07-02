'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Cookie, Settings, BarChart3, Shield, Eye } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    functional: true,
    analytics: false,
    marketing: false,
  });

  const handlePreferenceChange = (category: string, value: boolean) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSavePreferences = () => {
    // Save preferences to localStorage and apply settings
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    toast.success('Preferencias de cookies guardadas correctamente');
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
    toast.success('Todas las cookies han sido aceptadas');
  };

  const handleRejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-preferences', JSON.stringify(onlyNecessary));
    toast.success('Solo se han aceptado las cookies necesarias');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-[#2FD7B5]/10 text-[#2FD7B5] border-[#2FD7B5]/20 mb-4">
            Actualizado: 15 de enero de 2024
          </Badge>
          <h1 className="text-4xl font-bold text-[#0A1B3D] mb-4">
            Política de Cookies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Información sobre cómo utilizamos las cookies para mejorar tu experiencia en Asesfy.
          </p>
        </div>

        <div className="space-y-8">
          {/* ¿Qué son las cookies? */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Cookie className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                ¿Qué son las Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                visitas un sitio web. Nos ayudan a recordar tus preferencias, analizar cómo utilizas 
                nuestros servicios y personalizar tu experiencia.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-[#0A1B3D]">Seguras</h4>
                  <p className="text-sm text-gray-600">No contienen información personal identificable</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-[#0A1B3D]">Controlables</h4>
                  <p className="text-sm text-gray-600">Puedes configurarlas según tus preferencias</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-[#0A1B3D]">Útiles</h4>
                  <p className="text-sm text-gray-600">Mejoran la funcionalidad del sitio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de cookies */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Settings className="h-6 w-6 mr-3 text-[#2FD7B5]" />
                Configuración de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Necesarias */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-[#0A1B3D]">Cookies Necesarias</h3>
                    <Badge variant="secondary">Obligatorias</Badge>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    Esenciales para el funcionamiento básico del sitio web. Incluyen autenticación, 
                    seguridad y funcionalidades principales.
                  </p>
                  <p className="text-xs text-gray-500">
                    Ejemplos: session_id, csrf_token, auth_token
                  </p>
                </div>
                <Switch
                  checked={preferences.necessary}
                  disabled={true}
                  className="ml-4"
                />
              </div>

              {/* Funcionales */}
              <div className="flex items-start justify-between p-4 bg-white border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-[#0A1B3D]">Cookies Funcionales</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    Permiten recordar tus preferencias y configuraciones personalizadas para 
                    mejorar tu experiencia de usuario.
                  </p>
                  <p className="text-xs text-gray-500">
                    Ejemplos: theme_preference, language_setting, dashboard_layout
                  </p>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(value) => handlePreferenceChange('functional', value)}
                  className="ml-4"
                />
              </div>

              {/* Analíticas */}
              <div className="flex items-start justify-between p-4 bg-white border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-[#0A1B3D]">Cookies de Análisis</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    Nos ayudan a entender cómo interactúas con nuestro sitio web para poder 
                    mejorarlo continuamente.
                  </p>
                  <p className="text-xs text-gray-500">
                    Ejemplos: _ga, _gid, _gat (Google Analytics)
                  </p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                  className="ml-4"
                />
              </div>

              {/* Marketing */}
              <div className="flex items-start justify-between p-4 bg-white border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-[#0A1B3D]">Cookies de Marketing</h3>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    Utilizadas para mostrarte contenido y publicidad relevante basada en tus 
                    intereses y comportamiento de navegación.
                  </p>
                  <p className="text-xs text-gray-500">
                    Ejemplos: _fbp, _gcl_au, ads_preferences
                  </p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(value) => handlePreferenceChange('marketing', value)}
                  className="ml-4"
                />
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  Guardar Preferencias
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white"
                >
                  Aceptar Todas
                </Button>
                <Button
                  onClick={handleRejectOptional}
                  variant="outline"
                >
                  Solo Necesarias
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tipos de cookies detallados */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Cookies que Utilizamos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-[#0A1B3D]">Nombre</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#0A1B3D]">Propósito</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#0A1B3D]">Duración</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#0A1B3D]">Tipo</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">session_id</td>
                      <td className="py-3 px-4 text-gray-600">Mantener la sesión del usuario</td>
                      <td className="py-3 px-4 text-gray-600">Sesión</td>
                      <td className="py-3 px-4"><Badge variant="secondary">Necesaria</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">auth_token</td>
                      <td className="py-3 px-4 text-gray-600">Autenticación del usuario</td>
                      <td className="py-3 px-4 text-gray-600">7 días</td>
                      <td className="py-3 px-4"><Badge variant="secondary">Necesaria</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">theme_preference</td>
                      <td className="py-3 px-4 text-gray-600">Recordar preferencias de tema</td>
                      <td className="py-3 px-4 text-gray-600">1 año</td>
                      <td className="py-3 px-4"><Badge className="bg-blue-100 text-blue-800">Funcional</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">_ga</td>
                      <td className="py-3 px-4 text-gray-600">Google Analytics - identificación</td>
                      <td className="py-3 px-4 text-gray-600">2 años</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-800">Análisis</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">_fbp</td>
                      <td className="py-3 px-4 text-gray-600">Facebook Pixel</td>
                      <td className="py-3 px-4 text-gray-600">3 meses</td>
                      <td className="py-3 px-4"><Badge className="bg-purple-100 text-purple-800">Marketing</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gestión de cookies */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Cómo Gestionar las Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">En tu Navegador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A1B3D] mb-2">Chrome</h4>
                    <p className="text-sm text-gray-600">
                      Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A1B3D] mb-2">Firefox</h4>
                    <p className="text-sm text-gray-600">
                      Opciones → Privacidad y seguridad → Cookies y datos del sitio
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A1B3D] mb-2">Safari</h4>
                    <p className="text-sm text-gray-600">
                      Preferencias → Privacidad → Gestionar datos de sitios web
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-[#0A1B3D] mb-2">Edge</h4>
                    <p className="text-sm text-gray-600">
                      Configuración → Cookies y permisos de sitio → Cookies y datos almacenados
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#0A1B3D] mb-3">Herramientas de Terceros</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800 mb-2">Google Analytics</h4>
                    <p className="text-sm text-blue-700 mb-2">
                      Puedes optar por no participar en Google Analytics visitando:
                    </p>
                    <a 
                      href="https://tools.google.com/dlpage/gaoptout" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      https://tools.google.com/dlpage/gaoptout
                    </a>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <h4 className="font-semibold text-purple-800 mb-2">Facebook</h4>
                    <p className="text-sm text-purple-700 mb-2">
                      Gestiona tus preferencias de anuncios en:
                    </p>
                    <a 
                      href="https://www.facebook.com/settings?tab=ads" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:underline"
                    >
                      Configuración de anuncios de Facebook
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D]">Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre nuestra política de cookies o necesitas ayuda 
                para configurar tus preferencias, puedes contactarnos:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>Email: <a href="mailto:cookies@asesfy.com" className="text-[#2FD7B5] hover:underline">cookies@asesfy.com</a></p>
                <p>Teléfono: +34 900 123 456</p>
                <p>Dirección: Calle Gran Vía, 123, 28013 Madrid, España</p>
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
            <Link href="/terms" className="text-[#2FD7B5] hover:underline">
              Términos de Uso
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