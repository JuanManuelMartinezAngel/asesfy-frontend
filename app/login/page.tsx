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
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Calculator className="h-10 w-10 text-[#0A1B3D]" />
          <span className="text-3xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Accede a tu cuenta para gestionar tu fiscalidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo accounts */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Cuentas de demostración:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('client')}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Cliente</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('advisor')}
                  className="flex items-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Asesor</span>
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] pr-10"
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
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-[#2FD7B5] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                  <Link
                    href="/onboarding"
                    className="text-[#2FD7B5] hover:underline"
                  >
                    Crear cuenta
                  </Link>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? {' '}
            <a href="mailto:soporte@asesfy.com" className="text-[#2FD7B5] hover:underline">
              Contacta con soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}