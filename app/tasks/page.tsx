'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  User,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'declaration' | 'consultation' | 'review' | 'meeting' | 'document';
  status: 'created' | 'assigned' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
  advisorName: string;
  documentId?: string;
  documentName?: string;
  estimatedCompletion?: string;
  progress?: number;
  lastUpdate: string;
  notes?: string;
}

export default function ClientTasksPage() {
  const { user, isClient } = useAuthStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not client
  useEffect(() => {
    if (user && !isClient()) {
      router.push('/advisor/tasks');
      return;
    }
  }, [user, isClient, router]);

  // Get tasks for current client
  const getClientTasks = (): Task[] => {
    if (!user) return [];
    
    return [
      {
        id: 'task-1',
        title: 'Revisión Certificado de Ingresos 2023',
        description: 'Revisión y validación del certificado de ingresos para declaración IRPF',
        type: 'document',
        status: 'completed',
        priority: 'medium',
        dueDate: '2024-01-25',
        createdAt: '2024-01-20',
        advisorName: 'María García Rodríguez',
        documentId: '1',
        documentName: 'Certificado_Ingresos_2023.pdf',
        estimatedCompletion: '2024-01-24',
        progress: 100,
        lastUpdate: '2024-01-23',
        notes: 'Documento revisado y validado. Todo correcto.'
      },
      {
        id: 'task-2',
        title: 'Procesamiento Facturas Q4 2023',
        description: 'Análisis y procesamiento de facturas del cuarto trimestre para liquidación IVA',
        type: 'document',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-01-30',
        createdAt: '2024-01-19',
        advisorName: 'María García Rodríguez',
        documentId: '2',
        documentName: 'Facturas_Q4_2023.zip',
        estimatedCompletion: '2024-01-28',
        progress: 65,
        lastUpdate: '2024-01-22',
        notes: 'Revisando facturas. Pendiente de validar 3 documentos.'
      },
      {
        id: 'task-3',
        title: 'Preparación Declaración IRPF 2023',
        description: 'Elaboración completa de la declaración de la renta anual',
        type: 'declaration',
        status: 'assigned',
        priority: 'high',
        dueDate: '2024-02-15',
        createdAt: '2024-01-16',
        advisorName: 'María García Rodríguez',
        estimatedCompletion: '2024-02-10',
        progress: 25,
        lastUpdate: '2024-01-21',
        notes: 'Esperando documentos adicionales del cliente.'
      },
      {
        id: 'task-4',
        title: 'Consulta sobre deducciones energéticas',
        description: 'Asesoramiento sobre deducciones por eficiencia energética',
        type: 'consultation',
        status: 'review',
        priority: 'medium',
        dueDate: '2024-01-26',
        createdAt: '2024-01-18',
        advisorName: 'María García Rodríguez',
        estimatedCompletion: '2024-01-25',
        progress: 90,
        lastUpdate: '2024-01-24',
        notes: 'Informe preparado. Pendiente de revisión final.'
      }
    ];
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const clientTasks = getClientTasks();
      setTasks(clientTasks);
      setFilteredTasks(clientTasks);
      setIsLoading(false);
    };

    loadTasks();
  }, [user]);

  useEffect(() => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-gray-100 text-gray-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'declaration': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'consultation': return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'review': return <Eye className="h-5 w-5 text-purple-600" />;
      case 'meeting': return <Calendar className="h-5 w-5 text-orange-600" />;
      case 'document': return <FileText className="h-5 w-5 text-gray-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Creada';
      case 'assigned': return 'Asignada';
      case 'in_progress': return 'En Progreso';
      case 'review': return 'En Revisión';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => ['created', 'assigned', 'in_progress'].includes(t.status)).length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">Mis Tareas</h1>
          <p className="text-gray-600">
            Seguimiento del estado de tus trámites y consultas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Tareas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">En Proceso</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completadas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.urgent}</div>
              <div className="text-sm text-gray-600">Urgentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tareas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2FD7B5]"
              >
                <option value="all">Todos los estados</option>
                <option value="assigned">Asignada</option>
                <option value="in_progress">En Progreso</option>
                <option value="review">En Revisión</option>
                <option value="completed">Completada</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron tareas
                </h3>
                <p className="text-gray-600">
                  No tienes tareas que coincidan con los filtros seleccionados
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(task.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {task.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {task.advisorName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            Vence: {new Date(task.dueDate).toLocaleDateString('es-ES')}
                          </div>
                          {task.documentName && (
                            <div className="flex items-center text-sm text-gray-500">
                              <FileText className="h-4 w-4 mr-1" />
                              <Link href="/documents" className="text-blue-600 hover:underline">
                                {task.documentName}
                              </Link>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority.toUpperCase()}
                          </Badge>
                        </div>

                        {task.progress !== undefined && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progreso</span>
                              <span>{task.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#2FD7B5] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {task.notes && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Última actualización:</strong> {task.notes}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(task.lastUpdate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contactar
                      </Button>
                      {task.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Ver Resultado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}