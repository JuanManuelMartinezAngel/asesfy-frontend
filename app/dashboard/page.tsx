'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Euro,
  Users,
  MessageSquare,
  ChevronRight,
  Bell,
  Download,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ✅ Interfaces para el dashboard
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingTasks: number;
  unreadMessages: number;
  unreadNotifications: number;
  recentDocuments: number;
  upcomingEvents: number;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'order' | 'document' | 'message' | 'notification';
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'in_progress';
  user_name?: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    pendingTasks: 0,
    unreadMessages: 0,
    unreadNotifications: 0,
    recentDocuments: 0,
    upcomingEvents: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

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

  // ✅ Función para cargar todas las estadísticas del dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver el dashboard');
        return;
      }

      setCurrentUser(user);

      // Parallel queries para mejor performance
      const promises = [];

      // 1. Stats de órdenes/facturación
      if (user.user_metadata?.role === 'advisor') {
        // Advisor: estadísticas de sus clientes
        const clientsQuery = supabase
          .from('client_profiles')
          .select('user_id')
          .eq('assigned_advisor_id', user.id);
        
        promises.push(
          clientsQuery.then(async ({ data: clientIds }) => {
            const clientIdsList = clientIds?.map(c => c.user_id) || [];
            
            if (clientIdsList.length > 0) {
              // Órdenes de los clientes del advisor
              const { data: orders } = await supabase
                .from('orders')
                .select('total_amount, status')
                .in('client_id', clientIdsList);
              
              const totalRevenue = orders?.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.total_amount, 0) || 0;
              const totalOrders = orders?.length || 0;
              
              return { totalRevenue, totalOrders };
            }
            return { totalRevenue: 0, totalOrders: 0 };
          })
        );
      } else {
        // Cliente: sus propias órdenes
        promises.push(
          supabase
            .from('orders')
            .select('total_amount, status')
            .eq('client_id', user.id)
            .then(({ data: orders }) => {
              const totalRevenue = orders?.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.total_amount, 0) || 0;
              const totalOrders = orders?.length || 0;
              return { totalRevenue, totalOrders };
            })
        );
      }

      // 2. Tasks pendientes
      promises.push(
        supabase
          .from('tasks')
          .select('id')
          .eq(user.user_metadata?.role === 'advisor' ? 'advisor_id' : 'client_id', user.id)
          .in('status', ['pending', 'in_progress'])
          .then(({ data }) => ({ pendingTasks: data?.length || 0 }))
      );

      // 3. Mensajes no leídos
      promises.push(
        supabase
          .from('messages')
          .select('id')
          .eq('receiver_id', user.id)
          .eq('is_read', false)
          .then(({ data }) => ({ unreadMessages: data?.length || 0 }))
      );

      // 4. Notificaciones no leídas
      promises.push(
        supabase
          .from('notifications')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_read', false)
          .then(({ data }) => ({ unreadNotifications: data?.length || 0 }))
      );

      // 5. Documentos recientes (últimos 7 días)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      promises.push(
        supabase
          .from('documents')
          .select('id')
          .eq(user.user_metadata?.role === 'advisor' ? 'uploaded_by' : 'client_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString())
          .then(({ data }) => ({ recentDocuments: data?.length || 0 }))
      );

      // 6. Eventos próximos (próximos 30 días)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      promises.push(
        supabase
          .from('calendar_events')
          .select('id')
          .eq('user_id', user.id)
          .gte('start_time', new Date().toISOString())
          .lte('start_time', thirtyDaysFromNow.toISOString())
          .then(({ data }) => ({ upcomingEvents: data?.length || 0 }))
      );

      // Ejecutar todas las queries en paralelo
      const results = await Promise.all(promises);

      // Combinar resultados
      const newStats: DashboardStats = {
        totalRevenue: 0,
        totalOrders: 0,
        pendingTasks: 0,
        unreadMessages: 0,
        unreadNotifications: 0,
        recentDocuments: 0,
        upcomingEvents: 0,
      };

      results.forEach(result => {
        Object.assign(newStats, result);
      });

      setStats(newStats);

      // Cargar actividad reciente y eventos próximos
      await loadRecentActivity(user);
      await loadUpcomingEvents(user);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para cargar actividad reciente
  const loadRecentActivity = async (user: any) => {
    try {
      const activities: RecentActivity[] = [];

      // Tareas recientes
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, status, updated_at, client:users!client_id(full_name)')
        .eq(user.user_metadata?.role === 'advisor' ? 'advisor_id' : 'client_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(3);

      tasks?.forEach((task: any) => {
        activities.push({
          id: task.id,
          type: 'task',
          title: task.title,
          date: task.updated_at,
          status: task.status === 'completed' ? 'completed' : task.status === 'in_progress' ? 'in_progress' : 'pending',
          user_name: task.client?.full_name
        });
      });

      // Documentos recientes
      const { data: docs } = await supabase
        .from('documents')
        .select('id, file_name, status, created_at, client:users!client_id(full_name)')
        .eq(user.user_metadata?.role === 'advisor' ? 'uploaded_by' : 'client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      docs?.forEach((doc: any) => {
        activities.push({
          id: doc.id,
          type: 'document',
          title: `Documento: ${doc.file_name}`,
          date: doc.created_at,
          status: doc.status === 'processed' ? 'completed' : 'pending',
          user_name: doc.client?.full_name
        });
      });

      // Ordenar por fecha y tomar los más recientes
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivity(activities.slice(0, 5));

    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  // ✅ Función para cargar eventos próximos
  const loadUpcomingEvents = async (user: any) => {
    try {
      const { data: events } = await supabase
        .from('calendar_events')
        .select('id, title, start_time, event_type')
        .eq('user_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(3);

      setUpcomingEvents(events || []);

    } catch (error) {
      console.error('Error loading upcoming events:', error);
    }
  };

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const quickActions = [
    {
      title: 'Subir Documentos',
      description: 'Añade facturas o certificados',
      href: '/documents',
      icon: FileText,
      color: 'bg-[#2FD7B5]',
    },
    {
      title: 'Chat con IA',
      description: 'Consulta fiscal inmediata',
      href: '/chat-ia',
      icon: MessageSquare,
      color: 'bg-[#F4D35E]',
    },
    {
      title: 'Ver Servicios',
      description: 'Explora nuestro marketplace',
      href: '/marketplace',
      icon: Users,
      color: 'bg-[#0A1B3D]',
    },
  ];

  // ✅ Mostrar loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] mb-2">
            ¡Bienvenido de vuelta{currentUser?.user_metadata?.full_name ? `, ${currentUser.user_metadata.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {currentUser?.user_metadata?.role === 'advisor' ? 
              'Panel de gestión para asesores fiscales - Resumen de clientes y actividad' : 
              'Tu resumen personal de actividad fiscal y próximas tareas'
            }
          </p>
          {currentUser?.user_metadata?.role === 'advisor' && (
            <div className="mt-2">
              <Badge className="bg-[#2FD7B5] text-white">
                <Users className="h-3 w-3 mr-1" />
                Asesor Fiscal
              </Badge>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                {currentUser?.user_metadata?.role === 'advisor' ? 'Ingresos Totales' : 'Total Invertido'}
              </CardTitle>
              <Euro className="h-3 w-3 sm:h-4 sm:w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                €{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {currentUser?.user_metadata?.role === 'advisor' ? 'Facturado' : 'Invertido'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                {currentUser?.user_metadata?.role === 'advisor' ? 'Total Órdenes' : 'Mis Pedidos'}
              </CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                {stats.totalOrders}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.recentDocuments} documentos recientes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Tareas Pendientes
              </CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                {stats.pendingTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                -2 desde ayer
              </p>
            </CardContent>
          </Card>

                      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                  Eventos Próximos
                </CardTitle>
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                  {stats.upcomingEvents}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.unreadNotifications} notificaciones nuevas
                </p>
              </CardContent>
            </Card>
        </div>

        {/* Quick Actions - Mobile Only */}
        <div className="lg:hidden mb-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-[#0A1B3D] text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1B3D] truncate">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Actividad Reciente</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Un resumen de tus últimas actividades fiscales
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          {activity.type === 'task' && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5]" />}
                          {activity.type === 'document' && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#F4D35E]" />}
                          {activity.type === 'order' && <Euro className="h-4 w-4 sm:h-5 sm:w-5 text-[#0A1B3D]" />}
                          {activity.type === 'message' && <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5]" />}
                          {activity.type === 'notification' && <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[#F4D35E]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {activity.user_name && ` • ${activity.user_name}`}
                          </p>
                        </div>
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 
                                   activity.status === 'in_progress' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {activity.status === 'completed' ? 'Completado' : 
                           activity.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No hay actividad reciente</p>
                      <p className="text-xs mt-1">Las actividades aparecerán aquí cuando empieces a usar la plataforma</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-6">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">
                      Ver toda la actividad
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Próximos Vencimientos</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Fechas importantes que no debes olvidar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.start_time).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Badge 
                          variant={event.event_type === 'meeting' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {event.event_type || 'Evento'}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No hay eventos próximos</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-6">
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full">
                      Ver calendario completo
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Desktop */}
            <Card className="border-0 shadow-lg hidden lg:block">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Acciones Rápidas</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Tareas frecuentes a un clic
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D]">
                            {action.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#0A1B3D] transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-6 sm:mt-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-[#0A1B3D] text-lg sm:text-xl">Progreso del Año Fiscal</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Tu avance en las obligaciones fiscales de 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#0A1B3D]">Declaraciones IVA</span>
                    <span className="text-sm text-gray-500">3/4</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Próximo: Q1 2024</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#0A1B3D]">Retenciones IRPF</span>
                    <span className="text-sm text-gray-500">12/12</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Completado ✅</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#0A1B3D]">Declaración Anual</span>
                    <span className="text-sm text-gray-500">0/1</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Disponible en Marzo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}