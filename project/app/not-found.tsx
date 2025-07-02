'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Calculator className="h-10 w-10 text-[#0A1B3D]" />
          <span className="text-3xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            {/* 404 Graphic */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-[#2FD7B5] mb-4">404</div>
              <div className="w-24 h-1 bg-[#2FD7B5] mx-auto rounded-full"></div>
            </div>

            <h1 className="text-2xl font-bold text-[#0A1B3D] mb-4">
              Página no encontrada
            </h1>
            
            <p className="text-gray-600 mb-8">
              Lo sentimos, la página que buscas no existe o ha sido movida. 
              Verifica la URL o regresa al inicio.
            </p>

            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Ir al Inicio
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" className="w-full border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ir al Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                ¿Necesitas ayuda?
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <Link href="/blog" className="hover:text-[#2FD7B5] transition-colors">
                  Blog
                </Link>
                <span>•</span>
                <Link href="/pricing" className="hover:text-[#2FD7B5] transition-colors">
                  Precios
                </Link>
                <span>•</span>
                <a href="mailto:soporte@asesfy.com" className="hover:text-[#2FD7B5] transition-colors">
                  Soporte
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 