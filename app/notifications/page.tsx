'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calendar,
  FileText,
  Euro,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Declaración completada',
      message: 'Tu declaración de la renta ha sido procesada y presentada exitosamente.',
      date: '2024-01-25',
      read: false,
      actionUrl: '/orders/1'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Vencimiento próximo',
      message: 'El IVA del cuarto trimestre vence el 30 de enero. No olvides presentarlo.',
      date: '2024-01-24',
      read: false,
      actionUrl: '/calendar'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nuevo asesor asignado',
      message: 'María García ha sido asignada como tu nueva asesora fiscal.',
      date: '2024-01-22',
      read: true,
      actionUrl: '/advisor'
    },
    {
      id: '4',
      type: 'success',
      title: 'Pago procesado',
      message: 'Hemos recibido tu pago de €89 por la declaración de la renta.',
      date: '2024-01-20',
      read: true
    },
    {
      id: '5',
      type: 'info',
      title: 'Documentos requeridos',
      message: 'Para completar tu declaración, necesitamos que subas tu certificado de ingresos.',
      date: '2024-01-18',
      read: true,
      actionUrl: '/documents'
    }
  ];

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setIsLoading(false);
    };

    loadNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2 flex items-center">
              <Bell className="h-8 w-8 mr-3" />
              Notificaciones
              {unreadCount > 0 && (
                <Badge className="ml-3 bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">
              Mantente al día con todas las actualizaciones importantes
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              variant="outline"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No tienes notificaciones
                </h3>
                <p className="text-gray-600">
                  Cuando tengas actualizaciones importantes, aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`border-0 shadow-lg border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${!notification.read ? 'text-[#0A1B3D]' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <p className={`${!notification.read ? 'text-gray-700' : 'text-gray-600'} mb-3`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {new Date(notification.date).toLocaleDateString('es-ES')}
                          </span>
                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Button 
                                size="sm" 
                                className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                                onClick={() => {
                                  markAsRead(notification.id);
                                  window.location.href = notification.actionUrl!;
                                }}
                              >
                                Ver detalles
                              </Button>
                            )}
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marcar como leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-[#0A1B3D]">Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede rápidamente a las secciones más importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6 text-[#2FD7B5]" />
                <span className="text-sm font-medium">Ver Calendario</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <FileText className="h-6 w-6 text-[#F4D35E]" />
                <span className="text-sm font-medium">Mis Documentos</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Euro className="h-6 w-6 text-[#0A1B3D]" />
                <span className="text-sm font-medium">Mis Pedidos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}