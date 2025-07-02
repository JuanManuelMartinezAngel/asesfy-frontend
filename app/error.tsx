'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
    
    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Calculator className="h-10 w-10 text-[#0A1B3D]" />
          <span className="text-3xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
              ¡Oops! Algo salió mal
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado 
                y estamos trabajando para solucionarlo.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Detalles del error (desarrollo)
                  </summary>
                  <code className="text-xs text-red-600 break-all">
                    {error.message}
                  </code>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </details>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={reset}
                className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Inicio
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500 mb-2">
                ¿El problema persiste?
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:soporte@asesfy.com"
                  className="text-sm text-[#2FD7B5] hover:underline block"
                >
                  Contacta con soporte: soporte@asesfy.com
                </a>
                <a 
                  href="tel:+34900123456"
                  className="text-sm text-[#2FD7B5] hover:underline block"
                >
                  Llámanos: +34 900 123 456
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 