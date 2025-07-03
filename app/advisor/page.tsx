'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Euro,
  BarChart3,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

interface AdvisorStats {
  totalClients: number;
  activeClients: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  monthlyRevenue: number;
  averageRating: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'task_completed' | 'new_client' | 'meeting_scheduled' | 'document_uploaded';
  title: string;
  description: string;
  date: string;
  clientName?: string;
}

interface UpcomingTask {
  id: string;
  title: string;
  clientName: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
}

export default function AdvisorDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdvisorStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockStats: AdvisorStats = {
    totalClients: 24,
    activeClients: 18,
    totalTasks: 156,
    pendingTasks: 8,
    completedTasks: 142,
    monthlyRevenue: 4250,
    averageRating: 4.8,
    completionRate: 94,
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Declaración IRPF completada',
      description: 'Declaración de la renta procesada exitosamente',
      date: '2024-01-25',
      clientName: 'Juan Pérez López'
    },
    {
      id: '2',
      type: 'new_client',
      title: 'Nuevo cliente asignado',
      description: 'Cliente empresarial añadido a tu cartera',
      date: '2024-01-24',
      clientName: 'TechStart SL'
    },
    {
      id: '3',
      type: 'meeting_scheduled',
      title: 'Reunión programada',
      description: 'Consulta sobre planificación fiscal',
      date: '2024-01-24',
      clientName: 'Ana Martín Sánchez'
    },
    {
      id: '4',
      type: 'document_uploaded',
      title: 'Documentos recibidos',
      description: 'Certificados de ingresos subidos',
      date: '2024-01-23',
      clientName: 'Carlos Ruiz Fernández'
    }
  ];

  const mockUpcomingTasks: UpcomingTask[] = [
    {
      id: '1',
      title: 'IVA Trimestral Q4',
      clientName: 'Miguel Torres Ruiz',
      dueDate: '2024-01-30',
      priority: 'urgent',
      type: 'Declaración'
    },
    {
      id: '2',
      title: 'Reunión planificación fiscal',
      clientName: 'Carlos Ruiz Fernández',
      dueDate: '2024-01-26',
      priority: 'high',
      type: 'Reunión'
    },
    {
      id: '3',
      title: 'Revisión documentos constitución',
      clientName: 'Laura Sánchez Gómez',
      dueDate: '2024-01-28',
      priority: 'medium',
      type: 'Revisión'
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(mockStats);
      setRecentActivity(mockRecentActivity);
      setUpcomingTasks(mockUpcomingTasks);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'new_client': return <User className="h-4 w-4 text-blue-600" />;
      case 'meeting_scheduled': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'document_uploaded': return <FileText className="h-4 w-4 text-orange-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel del asesor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Panel del Asesor Fiscal
          </h1>
          <p className="text-gray-600">
            Bienvenido/a de vuelta, {user?.full_name}. Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Clientes Totales
              </CardTitle>
              <Users className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats?.totalClients}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.activeClients} activos
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tareas Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats?.pendingTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                de {stats?.totalTasks} totales
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos del Mes
              </CardTitle>
              <Euro className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                €{stats?.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +15% vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Finalización
              </CardTitle>
              <Target className="h-4 w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats?.completionRate}%
              </div>
              <Progress value={stats?.completionRate || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Actividad Reciente</CardTitle>
                <CardDescription>
                  Últimas acciones realizadas en tu panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1B3D]">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          {activity.clientName && (
                            <span className="text-xs text-gray-500">
                              Cliente: {activity.clientName}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/advisor/activity">
                    <Button variant="outline" className="w-full">
                      Ver toda la actividad
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Próximas Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#0A1B3D] truncate">
                          {task.title}
                        </h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'low' && 'Baja'}
                          {task.priority === 'medium' && 'Media'}
                          {task.priority === 'high' && 'Alta'}
                          {task.priority === 'urgent' && 'Urgente'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{task.clientName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{task.type}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/advisor/tasks">
                    <Button variant="outline" className="w-full">
                      Ver todas las tareas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/advisor/clients">
                  <Button className="w-full justify-start bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    <Users className="mr-2 h-4 w-4" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="/advisor/tasks">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Tareas
                  </Button>
                </Link>
                <Link href="/advisor/calendar">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendario
                  </Button>
                </Link>
                <Link href="/advisor/reports">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Informes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Satisfacción del Cliente</span>
                      <span>{stats?.averageRating}/5</span>
                    </div>
                    <Progress value={(stats?.averageRating || 0) * 20} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tareas Completadas</span>
                      <span>{stats?.completionRate}%</span>
                    </div>
                    <Progress value={stats?.completionRate || 0} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}