'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Plus,
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Task {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  type: 'declaration' | 'consultation' | 'review' | 'meeting' | 'document';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
}

interface NewTask {
  title: string;
  description: string;
  type: 'declaration' | 'consultation' | 'review' | 'meeting' | 'document';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  clientName: string;
}

export default function AdvisorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    type: 'declaration',
    priority: 'medium',
    dueDate: '',
    clientName: '',
  });

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: '1',
      clientId: 'client-1',
      clientName: 'Juan Pérez López',
      title: 'Declaración IRPF 2023',
      description: 'Revisión y presentación de declaración de la renta anual',
      type: 'declaration',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-25',
      createdAt: '2024-01-15',
      estimatedHours: 3,
      actualHours: 1.5,
    },
    {
      id: '2',
      clientId: 'client-2',
      clientName: 'Ana Martín Sánchez',
      title: 'Consulta deducciones energéticas',
      description: 'Asesoramiento sobre deducciones por eficiencia energética',
      type: 'consultation',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-01-22',
      createdAt: '2024-01-18',
      estimatedHours: 1,
    },
    {
      id: '3',
      clientId: 'client-3',
      clientName: 'TechStart SL',
      title: 'Revisión contabilidad Q4',
      description: 'Revisión de la contabilidad del cuarto trimestre',
      type: 'review',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-20',
      createdAt: '2024-01-10',
      estimatedHours: 4,
      actualHours: 3.5,
    },
    {
      id: '4',
      clientId: 'client-4',
      clientName: 'Carlos Ruiz Fernández',
      title: 'Reunión planificación fiscal 2024',
      description: 'Reunión para planificar estrategia fiscal del próximo año',
      type: 'meeting',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-01-24',
      createdAt: '2024-01-19',
      estimatedHours: 2,
    },
    {
      id: '5',
      clientId: 'client-5',
      clientName: 'Laura Sánchez Gómez',
      title: 'Revisión documentos constitución SL',
      description: 'Revisión de documentos para constitución de sociedad limitada',
      type: 'document',
      status: 'in-progress',
      priority: 'urgent',
      dueDate: '2024-01-23',
      createdAt: '2024-01-17',
      estimatedHours: 2.5,
      actualHours: 1,
    },
    {
      id: '6',
      clientId: 'client-6',
      clientName: 'Miguel Torres Ruiz',
      title: 'IVA Trimestral Q4 2023',
      description: 'Liquidación del IVA del cuarto trimestre',
      type: 'declaration',
      status: 'pending',
      priority: 'urgent',
      dueDate: '2024-01-30',
      createdAt: '2024-01-20',
      estimatedHours: 1.5,
    }
  ];

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTasks(mockTasks);
      setFilteredTasks(mockTasks);
      setIsLoading(false);
    };

    loadTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.type === typeFilter);
    }

    // Sort by priority and due date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'declaration': return <FileText className="h-4 w-4" />;
      case 'consultation': return <User className="h-4 w-4" />;
      case 'review': return <CheckCircle className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as any } : task
    ));
    toast.success('Estado de tarea actualizado');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    overdue: tasks.filter(t => getDaysUntilDue(t.dueDate) < 0 && t.status !== 'completed').length,
  };

  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]:
        name === 'type' && ['declaration', 'consultation', 'review', 'meeting', 'document'].includes(value)
          ? (value as NewTask['type'])
          : name === 'priority' && ['low', 'medium', 'high', 'urgent'].includes(value)
          ? (value as NewTask['priority'])
          : value,
    }));
  };

  const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para añadir la nueva tarea
    console.log('Nueva Tarea:', newTask);
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        clientId: '', // valor por defecto
        estimatedHours: 0 // valor por defecto
      }
    ]);
    setNewTask({ title: '', description: '', type: 'declaration', priority: 'medium', dueDate: '', clientName: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
              Gestión de Tareas
            </h1>
            <p className="text-gray-600">
              Administra todas las tareas asignadas a tus clientes
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Añade una nueva tarea para un cliente
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  type="text"
                  name="title"
                  placeholder="Título de la Tarea"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  required
                />
                <Input
                  type="text"
                  name="description"
                  placeholder="Descripción"
                  value={newTask.description}
                  onChange={handleNewTaskChange}
                  required
                />
                <Input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleNewTaskChange}
                  required
                />
                <Input
                  type="text"
                  name="clientName"
                  placeholder="Nombre del Cliente"
                  value={newTask.clientName}
                  onChange={handleNewTaskChange}
                  required
                />
                <Button type="submit" className="w-full bg-blue-500 text-white">Añadir Tarea</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">{stats.total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.inProgress}</div>
              <div className="text-xs text-gray-600">En Progreso</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
              <div className="text-xs text-gray-600">Completadas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.urgent}</div>
              <div className="text-xs text-gray-600">Urgentes</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700 mb-1">{stats.overdue}</div>
              <div className="text-xs text-gray-600">Vencidas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tareas o clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="in-progress">En progreso</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las prioridades</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="declaration">Declaración</SelectItem>
                  <SelectItem value="consultation">Consulta</SelectItem>
                  <SelectItem value="review">Revisión</SelectItem>
                  <SelectItem value="meeting">Reunión</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron tareas
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar tus filtros o crea una nueva tarea
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
              
              return (
                <Card key={task.id} className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(task.type)}
                            <h3 className="text-lg font-semibold text-[#0A1B3D]">
                              {task.title}
                            </h3>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'low' && 'Baja'}
                            {task.priority === 'medium' && 'Media'}
                            {task.priority === 'high' && 'Alta'}
                            {task.priority === 'urgent' && 'Urgente'}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === 'pending' && 'Pendiente'}
                            {task.status === 'in-progress' && 'En progreso'}
                            {task.status === 'completed' && 'Completada'}
                            {task.status === 'cancelled' && 'Cancelada'}
                          </Badge>
                          {isOverdue && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Vencida
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {task.clientName}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString('es-ES')}
                            {daysUntilDue >= 0 ? (
                              <span className="ml-1 text-gray-400">
                                ({daysUntilDue === 0 ? 'Hoy' : `${daysUntilDue} días`})
                              </span>
                            ) : (
                              <span className="ml-1 text-red-600">
                                ({Math.abs(daysUntilDue)} días vencida)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {task.actualHours ? `${task.actualHours}h / ${task.estimatedHours}h` : `${task.estimatedHours}h estimadas`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        )}
                        {task.status === 'in-progress' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'pending')}
                              variant="outline"
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Pausar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completar
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}