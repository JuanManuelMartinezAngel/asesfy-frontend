'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { Calculator, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nif, setNif] = useState('');
  const [phone, setPhone] = useState('');
  
  const router = useRouter();
  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(email, password, fullName);
      
      if (result.success) {
        toast.success('¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.');
        router.push('/login');
      } else {
        toast.error(result.error || 'Error al crear la cuenta');
      }
    } catch (error) {
      toast.error('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvisorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, nif, phone }),
      });

      if (response.ok) {
        toast.success('¡Perfil de asesor creado exitosamente!');
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al crear el perfil de asesor');
      }
    } catch (error) {
      toast.error('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Acceso a todos los servicios fiscales',
    'Chat con IA especializada en fiscalidad',
    'Asesoramiento profesional personalizado',
    'Gestión automática de documentos',
    'Calendario fiscal inteligente',
    'Marketplace de servicios premium'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F6F9] to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left side - Benefits */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Calculator className="h-8 w-8 text-[#0A1B3D]" />
              <span className="text-2xl font-bold text-[#0A1B3D]">Asesfy</span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A1B3D] mb-4">
                Únete a Asesfy y simplifica tu gestión fiscal
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Más de 10,000 profesionales ya confían en nosotros para 
                optimizar su gestión fiscal y ahorrar tiempo y dinero.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#0A1B3D] mb-4">
                ¿Qué obtienes al registrarte?
              </h3>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#2FD7B5] flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#2FD7B5]/10 p-6 rounded-lg border border-[#2FD7B5]/20">
              <div className="flex items-center space-x-2 mb-2">
                <Calculator className="h-5 w-5 text-[#2FD7B5]" />
                <span className="font-semibold text-[#0A1B3D]">Prueba gratuita de 30 días</span>
              </div>
              <p className="text-sm text-gray-600">
                Sin compromiso. Cancela cuando quieras.
              </p>
            </div>
          </div>

          {/* Right side - Registration form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
                  Crear Cuenta
                </CardTitle>
                <CardDescription>
                  Completa el formulario para empezar tu prueba gratuita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
                    />
                  </div>

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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirma tu contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta Gratuita'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                      href="/login"
                      className="text-[#2FD7B5] font-medium hover:underline"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  Al registrarte, aceptas nuestros{' '}
                  <Link href="/terms" className="text-[#2FD7B5] hover:underline">
                    Términos de Servicio
                  </Link>{' '}
                  y{' '}
                  <Link href="/privacy" className="text-[#2FD7B5] hover:underline">
                    Política de Privacidad
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}