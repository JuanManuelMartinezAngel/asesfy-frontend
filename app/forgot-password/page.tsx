'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calculator, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, introduce tu correo electrónico');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call:
      // const { error } = await auth.resetPassword(email);
      
      setIsEmailSent(true);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      toast.error('Error al enviar el correo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Calculator className="h-8 w-8 text-[#0A1B3D]" />
            <span className="text-2xl font-bold text-[#0A1B3D]">Asesfy</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="w-16 h-16 bg-[#2FD7B5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#2FD7B5]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
                Correo Enviado
              </CardTitle>
              <CardDescription>
                Hemos enviado las instrucciones de recuperación a tu correo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="p-4 bg-[#2FD7B5]/10 rounded-lg border border-[#2FD7B5]/20">
                  <Mail className="h-6 w-6 text-[#2FD7B5] mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Revisa tu bandeja de entrada y sigue las instrucciones 
                    para restablecer tu contraseña.
                  </p>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>¿No has recibido el correo?</p>
                  <p>Revisa tu carpeta de spam o correo no deseado.</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail('');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Enviar de nuevo
                </Button>
                
                <Link href="/login">
                  <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to login */}
        <Link 
          href="/login" 
          className="inline-flex items-center text-[#2FD7B5] hover:text-[#2FD7B5]/80 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio de sesión
        </Link>

        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Calculator className="h-8 w-8 text-[#0A1B3D]" />
          <span className="text-2xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
              ¿Olvidaste tu contraseña?
            </CardTitle>
            <CardDescription>
              Introduce tu correo electrónico y te enviaremos las instrucciones 
              para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Recordaste tu contraseña?{' '}
                <Link
                  href="/login"
                  className="text-[#2FD7B5] font-medium hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <h3 className="font-medium mb-2">¿Necesitas ayuda?</h3>
          <p className="mb-2">
            Si tienes problemas para acceder a tu cuenta, puedes contactarnos:
          </p>
          <ul className="space-y-1">
            <li>• Email: soporte@asesfy.com</li>
            <li>• Teléfono: +34 900 123 456</li>
            <li>• Horario: L-V 9:00-18:00</li>
          </ul>
        </div>
      </div>
    </div>
  );
}