'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ✅ Interfaz adaptada a la tabla notifications de Supabase
interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'task_update' | 'message' | 'document' | 'calendar' | 'billing' | 'system';
  entity_type?: string;
  entity_id?: string;
  is_read: boolean;
  read_at?: string;
  action_url?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  expires_at?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // ✅ Función para obtener el usuario actual
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  // ✅ Función para cargar notificaciones reales desde Supabase
  const loadNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver notificaciones');
        return;
      }

      setCurrentUser(user);

      // Consulta real a Supabase
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notifications:', error);
        toast.error('Error al cargar notificaciones');
        return;
      }

      setNotifications(data || []);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para marcar notificación como leída
  const markAsRead = async (id: string) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('user_id', currentUser.id); // Seguridad adicional

      if (error) {
        console.error('Error marking as read:', error);
        toast.error('Error al marcar como leída');
        return;
      }

      // Actualizar estado local inmediatamente
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { 
          ...notif, 
          is_read: true, 
          read_at: new Date().toISOString() 
        } : notif
      ));

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar como leída');
    }
  };

  // ✅ Función para eliminar notificación
  const deleteNotification = async (id: string) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', currentUser.id); // Seguridad adicional

      if (error) {
        console.error('Error deleting notification:', error);
        toast.error('Error al eliminar notificación');
        return;
      }

      // Actualizar estado local inmediatamente
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast.success('Notificación eliminada');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar notificación');
    }
  };

  // ✅ Función para marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', currentUser.id)
        .eq('is_read', false); // Solo las no leídas

      if (error) {
        console.error('Error marking all as read:', error);
        toast.error('Error al marcar todas como leídas');
        return;
      }

      // Actualizar estado local
      setNotifications(prev => prev.map(notif => ({ 
        ...notif, 
        is_read: true,
        read_at: new Date().toISOString()
      })));

      toast.success('Todas las notificaciones marcadas como leídas');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al marcar todas como leídas');
    }
  };

  // ✅ Cargar notificaciones al montar el componente
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ✅ Función para obtener icono según tipo (adaptada a nuevos tipos)
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'billing': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'task_update': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'document': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'calendar': return <Calendar className="h-5 w-5 text-purple-600" />;
      case 'message': return <Info className="h-5 w-5 text-blue-600" />;
      case 'system': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  // ✅ Función para obtener color según tipo
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'billing': return 'border-l-green-500 bg-green-50';
      case 'task_update': return 'border-l-yellow-500 bg-yellow-50';
      case 'document': return 'border-l-blue-500 bg-blue-50';
      case 'calendar': return 'border-l-purple-500 bg-purple-50';
      case 'message': return 'border-l-blue-500 bg-blue-50';
      case 'system': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
                  !notification.is_read ? 'ring-2 ring-blue-200' : ''
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
                          <h3 className={`font-semibold ${!notification.is_read ? 'text-[#0A1B3D]' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.is_read && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Nuevo
                            </Badge>
                          )}
                          {notification.priority === 'high' && (
                            <Badge className="bg-orange-500 text-white text-xs">
                              Alta
                            </Badge>
                          )}
                          {notification.priority === 'critical' && (
                            <Badge className="bg-red-500 text-white text-xs">
                              Crítica
                            </Badge>
                          )}
                        </div>
                        <p className={`${!notification.is_read ? 'text-gray-700' : 'text-gray-600'} mb-3`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <div className="flex items-center space-x-2">
                            {notification.action_url && (
                              <Button 
                                size="sm" 
                                className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                                onClick={async () => {
                                  await markAsRead(notification.id);
                                  window.location.href = notification.action_url!;
                                }}
                              >
                                Ver detalles
                              </Button>
                            )}
                            {!notification.is_read && (
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
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => window.location.href = '/calendar'}
              >
                <Calendar className="h-6 w-6 text-[#2FD7B5]" />
                <span className="text-sm font-medium">Ver Calendario</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => window.location.href = '/documents'}
              >
                <FileText className="h-6 w-6 text-[#F4D35E]" />
                <span className="text-sm font-medium">Mis Documentos</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => window.location.href = '/orders'}
              >
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