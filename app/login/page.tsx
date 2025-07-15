'use client';

import { useState, useEffect } from 'react';
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
  
  const { signIn, user, isAuthenticated, isAdvisor, loginDemo, isLoading: storeLoading, isInitialized } = useAuthStore();

  // Auto-redirect if already authenticated - ONLY after store is fully initialized
  useEffect(() => {
    // Don't redirect if store is still loading or not initialized
    if (storeLoading || !isInitialized) {
      return;
    }

    // Only redirect if user is actually authenticated with user data
    if (isAuthenticated && user) {
      const targetRoute = redirect || (isAdvisor() ? '/advisor' : '/dashboard');
      router.push(targetRoute);
    }
  }, [isAuthenticated, user, isAdvisor, redirect, router, storeLoading, isInitialized]);

  // Show loading spinner while store is initializing
  if (storeLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast.success('¡Bienvenido de vuelta!');
        // The useEffect above will handle the redirect once the state updates
      } else {
        toast.error(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'client' | 'advisor') => {
    setIsLoading(true);
    try {
      const result = await loginDemo(role);
      if (result.success) {
        toast.success(`¡Bienvenido! Sesión de demostración como ${role === 'advisor' ? 'asesor' : 'cliente'}`);
        // The useEffect above will handle the redirect
      } else {
        toast.error('Error en el acceso de demostración');
      }
    } catch (error) {
      toast.error('Error inesperado');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Calculator className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de Asesfy
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Bienvenido de vuelta
            </CardTitle>
            <CardDescription className="text-gray-600">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 pt-0">
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'client' | 'advisor')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cliente
                </TabsTrigger>
                <TabsTrigger value="advisor" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Asesor
                </TabsTrigger>
              </TabsList>

              <TabsContent value="client" className="mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>Acceso de demostración para clientes:</strong>
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    Email: demo@asesfy.com | Contraseña: demo123456
                  </p>
                  <Button
                    onClick={() => fillDemoCredentials('client')}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-300 hover:bg-blue-100"
                  >
                    Rellenar credenciales demo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advisor" className="mt-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Acceso de demostración para asesores:</strong>
                  </p>
                  <p className="text-xs text-green-600 mb-2">
                    Email: asesor@asesfy.com | Contraseña: asesor123456
                  </p>
                  <Button
                    onClick={() => fillDemoCredentials('advisor')}
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-300 hover:bg-green-100"
                  >
                    Rellenar credenciales demo
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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

              <div className="flex items-center justify-between">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                  onClick={() => handleDemoLogin('client')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Demo Cliente
                </Button>
                <Button
                  onClick={() => handleDemoLogin('advisor')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Demo Asesor
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/onboarding" className="text-blue-600 hover:text-blue-500 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}