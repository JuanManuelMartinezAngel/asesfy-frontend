'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Bell, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Mail,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { 
  getAdvisorLoadStats, 
  AUTHORIZED_ADVISOR_EMAILS, 
  assignClientToAdvisor,
  isAdvisorEmail
} from '@/lib/advisor-utils';

interface AdvisorStats {
  advisor: { id: string; email: string; full_name: string };
  clientCount: number;
  pendingTasks: number;
  unreadNotifications: number;
}

export default function AdvisorAdminPage() {
  const [advisorStats, setAdvisorStats] = useState<AdvisorStats[]>([]);
  const [totalClients, setTotalClients] = useState(0);
  const [unassignedClients, setUnassignedClients] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalDocuments: 0,
    totalTasks: 0,
    totalNotifications: 0,
    recentActivity: 0
  });
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

  // ✅ Función para cargar estadísticas de asesores
  const loadAdvisorStats = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado');
        return;
      }

      // Verificar que el usuario es un asesor autorizado
      if (!isAdvisorEmail(user.email!)) {
        toast.error('No tienes permisos para ver esta página');
        return;
      }

      setCurrentUser(user);

      // Obtener estadísticas de todos los asesores
      const stats = await getAdvisorLoadStats();
      setAdvisorStats(stats);

      // Calcular total de clientes
      const totalClientsCount = stats.reduce((sum, stat) => sum + stat.clientCount, 0);
      setTotalClients(totalClientsCount);

      // Obtener clientes sin asignar
      const { data: unassigned, error: unassignedError } = await supabase
        .from('client_profiles')
        .select(`
          user_id,
          users!inner(id, full_name, email, created_at)
        `)
        .is('assigned_advisor_id', null);

      if (unassignedError) {
        console.error('Error getting unassigned clients:', unassignedError);
      } else {
        setUnassignedClients(unassigned || []);
      }

      // Obtener estadísticas del sistema
      const [docsResult, tasksResult, notificationsResult] = await Promise.all([
        supabase.from('documents').select('id').limit(1000),
        supabase.from('tasks').select('id').limit(1000),
        supabase.from('notifications').select('id').limit(1000)
      ]);

      setSystemStats({
        totalDocuments: docsResult.data?.length || 0,
        totalTasks: tasksResult.data?.length || 0,
        totalNotifications: notificationsResult.data?.length || 0,
        recentActivity: stats.reduce((sum, stat) => sum + stat.pendingTasks, 0)
      });

    } catch (error) {
      console.error('Error loading advisor stats:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para asignar cliente sin asignar
  const handleAssignClient = async (clientId: string) => {
    try {
      const success = await assignClientToAdvisor(clientId);
      
      if (success) {
        toast.success('Cliente asignado correctamente');
        await loadAdvisorStats(); // Recargar estadísticas
      } else {
        toast.error('Error al asignar cliente');
      }
    } catch (error) {
      console.error('Error assigning client:', error);
      toast.error('Error al asignar cliente');
    }
  };

  // ✅ Función para redistribuir clientes
  const handleRedistribute = async () => {
    try {
      setIsLoading(true);
      
      // Obtener todos los clientes sin asignar
      const { data: unassigned } = await supabase
        .from('client_profiles')
        .select('user_id')
        .is('assigned_advisor_id', null);

             if (!unassigned || unassigned.length === 0) {
         toast.success('No hay clientes sin asignar');
         return;
       }

      // Asignar cada cliente al asesor con menos carga
      let assignedCount = 0;
      for (const client of unassigned) {
        const success = await assignClientToAdvisor(client.user_id);
        if (success) assignedCount++;
      }

      toast.success(`Se asignaron ${assignedCount} clientes`);
      await loadAdvisorStats(); // Recargar estadísticas

    } catch (error) {
      console.error('Error redistributing clients:', error);
      toast.error('Error al redistribuir clientes');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    loadAdvisorStats();
  }, [loadAdvisorStats]);

  // ✅ Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] mb-2">
                Panel de Administración
              </h1>
              <p className="text-gray-600">
                Gestión y estadísticas del sistema de asesores
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleRedistribute}
                disabled={isLoading}
                className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Redistribuir Clientes
              </Button>
              <Button
                onClick={loadAdvisorStats}
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">{totalClients}</div>
              <p className="text-xs text-gray-500">
                {unassignedClients.length} sin asignar
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Asesores Activos
              </CardTitle>
              <Mail className="h-4 w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">{advisorStats.length}</div>
              <p className="text-xs text-gray-500">
                {AUTHORIZED_ADVISOR_EMAILS.length} autorizados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tareas Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">{systemStats.recentActivity}</div>
              <p className="text-xs text-gray-500">
                Todas las tareas activas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Documentos
              </CardTitle>
              <FileText className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">{systemStats.totalDocuments}</div>
              <p className="text-xs text-gray-500">
                En el sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas por asesor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Distribución de carga */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] text-xl">Distribución de Carga</CardTitle>
              <CardDescription>
                Clientes y tareas asignadas por asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {advisorStats.map((stat) => (
                  <div key={stat.advisor.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#0A1B3D]">
                          {stat.advisor.full_name || stat.advisor.email}
                        </p>
                        <p className="text-sm text-gray-500">{stat.advisor.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mr-2">
                          {stat.clientCount} clientes
                        </Badge>
                        {stat.pendingTasks > 0 && (
                          <Badge variant="destructive">
                            {stat.pendingTasks} tareas
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Barra de progreso basada en carga */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carga de trabajo</span>
                        <span>{stat.clientCount + stat.pendingTasks}</span>
                      </div>
                      <Progress 
                        value={Math.min(((stat.clientCount + stat.pendingTasks) / (totalClients * 0.3)) * 100, 100)} 
                        className="h-2"
                      />
                    </div>

                    {/* Notificaciones */}
                    {stat.unreadNotifications > 0 && (
                      <div className="mt-2 flex items-center text-sm text-orange-600">
                        <Bell className="h-4 w-4 mr-1" />
                        {stat.unreadNotifications} notificaciones no leídas
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clientes sin asignar */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] text-xl">Clientes Sin Asignar</CardTitle>
              <CardDescription>
                Clientes que necesitan ser asignados a un asesor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unassignedClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">¡Todos los clientes están asignados!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {unassignedClients.slice(0, 5).map((client: any) => (
                    <div 
                      key={client.user_id} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[#0A1B3D]">
                          {client.users?.full_name || 'Sin nombre'}
                        </p>
                        <p className="text-sm text-gray-500">{client.users?.email}</p>
                        <p className="text-xs text-gray-400">
                          Registrado: {new Date(client.users?.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignClient(client.user_id)}
                        className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90"
                      >
                        Asignar
                      </Button>
                    </div>
                  ))}
                  
                  {unassignedClients.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-sm text-gray-500">
                        Y {unassignedClients.length - 5} más...
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRedistribute}
                        className="mt-2"
                      >
                        Asignar Todos
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuración del sistema */}
        <Card className="border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-[#0A1B3D] text-xl">Configuración del Sistema</CardTitle>
            <CardDescription>
              Correos autorizados y configuración de asesores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[#0A1B3D] mb-3">Correos Autorizados</h3>
                <div className="space-y-2">
                  {AUTHORIZED_ADVISOR_EMAILS.map((email) => (
                    <div key={email} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{email}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-[#0A1B3D] mb-3">Patrón de Validación</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <code className="text-sm">asesor[número]@demo.com</code>
                  <p className="text-xs text-gray-600 mt-2">
                    Cualquier correo que siga este patrón será reconocido como asesor autorizado
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}