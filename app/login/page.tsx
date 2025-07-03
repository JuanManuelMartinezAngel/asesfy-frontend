'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Calculator, Eye, EyeOff, Users, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'client' | 'advisor'>('client');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  
  const { signIn, isAdvisor } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast.success('¡Bienvenido de vuelta!');
        
        // Redirect based on user role and original redirect
        if (redirect) {
          router.push(redirect);
        } else {
          // Check if user is advisor after login
          setTimeout(() => {
            if (isAdvisor()) {
              router.push('/advisor');
            } else {
              router.push('/dashboard');
            }
          }, 100);
        }
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'client' | 'advisor') => {
    if (type === 'advisor') {
      setEmail('asesor@asesfy.com');
      setPassword('asesor123456');
    } else {
      setEmail('demo@asesfy.com');
      setPassword('demo123456');
    }
    setLoginType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-6 sm:mb-8">
          <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-[#0A1B3D]" />
          <span className="text-2xl sm:text-3xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-[#0A1B3D]">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Accede a tu cuenta para gestionar tu fiscalidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
            {/* Demo accounts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700 text-center sm:text-left">
                Cuentas de demostración:
              </p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('client')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Cliente</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('advisor')}
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Asesor</span>
                </Button>
              </div>
              
              {/* Demo Credentials Display */}
              <div className="bg-[#F5F6F9] p-3 rounded-lg text-xs text-gray-600">
                <p className="font-medium mb-1">💡 Credenciales rápidas:</p>
                <div className="space-y-1">
                  <div>👤 <strong>Cliente:</strong> demo@asesfy.com</div>
                  <div>👨‍💼 <strong>Asesor:</strong> asesor@asesfy.com</div>
                  <div>🔑 <strong>Contraseña:</strong> demo123456 / asesor123456</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] h-10 sm:h-11 text-sm sm:text-base"
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] pr-10 h-10 sm:h-11 text-sm sm:text-base"
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      </span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-3 sm:gap-0">
                  <Link
                    href="/forgot-password"
                    className="text-[#2FD7B5] hover:underline order-2 sm:order-1"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                  <Link
                    href="/onboarding"
                    className="text-[#2FD7B5] hover:underline order-1 sm:order-2"
                  >
                    Crear cuenta nueva
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white h-10 sm:h-11 text-sm sm:text-base font-medium"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
            </div>

            {/* Additional Actions */}
            <div className="border-t pt-4 space-y-3">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  ¿Nuevo en Asesfy?
                </p>
                <Link href="/onboarding" className="w-full block">
                  <Button 
                    variant="outline" 
                    className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  >
                    Crear Cuenta Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            ¿Necesitas ayuda? {' '}
            <a 
              href="mailto:soporte@asesfy.com" 
              className="text-[#2FD7B5] hover:underline font-medium"
            >
              Contacta con soporte
            </a>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link 
            href="/" 
            className="text-xs sm:text-sm text-gray-500 hover:text-[#0A1B3D] transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}