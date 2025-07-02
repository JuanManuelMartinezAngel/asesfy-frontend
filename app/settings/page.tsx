'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Bell,
  CreditCard,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { subscription, loadSubscription } = useSubscriptionStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    deadlineReminders: true,
    marketingEmails: false,
  });

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Preferencias actualizadas');
    } catch (error) {
      toast.error('Error al actualizar preferencias');
    }
  };

  const getPlanName = (priceId: string) => {
    switch (priceId) {
      case 'price_1RUUfMJHfrNln9fJu0LG0ppp':
        return 'Pro Plan';
      case 'price_1RUUeiJHfrNln9fJCJGuIdl9':
        return 'Starter Plan';
      default:
        return 'Plan Premium';
    }
  };

  const getPlanPrice = (priceId: string) => {
    switch (priceId) {
      case 'price_1RUUfMJHfrNln9fJu0LG0ppp':
        return '€49.95';
      case 'price_1RUUeiJHfrNln9fJCJGuIdl9':
        return '€29.95';
      default:
        return '€0';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Configuración
          </h1>
          <p className="text-gray-600">
            Gestiona tu perfil, seguridad y preferencias
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información Personal
              </CardTitle>
              <CardDescription>
                Actualiza tu información de perfil y datos de contacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+34 600 123 456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Madrid"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Calle Principal, 123"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Cambia tu contraseña y gestiona la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Nueva contraseña"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirma la nueva contraseña"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#0A1B3D]">Notificaciones por email</h4>
                    <p className="text-sm text-gray-600">Recibe actualizaciones importantes por correo</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#0A1B3D]">Notificaciones SMS</h4>
                    <p className="text-sm text-gray-600">Recibe alertas urgentes por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => handleNotificationUpdate('smsNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#0A1B3D]">Recordatorios de vencimientos</h4>
                    <p className="text-sm text-gray-600">Alertas sobre fechas límite importantes</p>
                  </div>
                  <Switch
                    checked={notifications.deadlineReminders}
                    onCheckedChange={(checked) => handleNotificationUpdate('deadlineReminders', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-[#0A1B3D]">Emails promocionales</h4>
                    <p className="text-sm text-gray-600">Ofertas especiales y novedades del servicio</p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => handleNotificationUpdate('marketingEmails', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Facturación y Suscripción
              </CardTitle>
              <CardDescription>
                Gestiona tu plan y métodos de pago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-[#0A1B3D]">Plan Actual</h4>
                        <p className="text-sm text-gray-600">
                          {getPlanName(subscription.price_id)} - {getPlanPrice(subscription.price_id)}/mes
                        </p>
                        <p className="text-xs text-gray-500">
                          Estado: {subscription.subscription_status === 'active' ? 'Activa' : subscription.subscription_status}
                        </p>
                      </div>
                      <Link href="/pricing">
                        <Button variant="outline">
                          Cambiar Plan
                        </Button>
                      </Link>
                    </div>
                    
                    {subscription.payment_method_brand && subscription.payment_method_last4 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-[#0A1B3D]">Método de Pago</h4>
                          <p className="text-sm text-gray-600">
                            {subscription.payment_method_brand.toUpperCase()} •••• •••• •••• {subscription.payment_method_last4}
                          </p>
                        </div>
                        <Button variant="outline">
                          Actualizar
                        </Button>
                      </div>
                    )}
                    
                    {subscription.current_period_end && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-1">Próxima Facturación</h4>
                        <p className="text-sm text-blue-600">
                          {new Date(subscription.current_period_end * 1000).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-yellow-800]">Sin Suscripción Activa</h4>
                      <p className="text-sm text-yellow-600">Suscríbete para acceder a todas las funciones</p>
                    </div>
                    <Link href="/pricing">
                      <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                        Ver Planes
                      </Button>
                    </Link>
                  </div>
                )}
                
                <Button variant="outline" className="w-full">
                  Ver Historial de Facturación
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-0 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Zona de Peligro
              </CardTitle>
              <CardDescription>
                Acciones irreversibles para tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Eliminar Cuenta</h4>
                  <p className="text-sm text-red-600 mb-4">
                    Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. 
                    Esta acción no se puede deshacer.
                  </p>
                  <Button variant="destructive">
                    Eliminar Cuenta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}