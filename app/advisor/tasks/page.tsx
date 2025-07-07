'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ✅ Interfaz adaptada a la tabla tasks de Supabase
interface Task {
  id: string;
  title: string;
  description: string;
  task_type: 'modelo_303' | 'irpf' | 'constitucion' | 'consultoria' | 'documentos';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'under_review' | 'completed' | 'cancelled';
  client_id: string;
  advisor_id: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  completion_percentage: number;
  client_notes?: string;
  advisor_notes?: string;
  internal_notes?: string;
  billing_status: 'pending' | 'billed' | 'paid';
  amount?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  // Campos del JOIN con users (cliente)
  client_name?: string;
  client_email?: string;
  // Campos del JOIN con advisor
  advisor_name?: string;
  advisor_email?: string;
}

interface NewTask {
  title: string;
  description: string;
  task_type: 'modelo_303' | 'irpf' | 'constitucion' | 'consultoria' | 'documentos';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string;
  estimated_hours: number;
  client_id: string;
}

export default function AdvisorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    task_type: 'consultoria',
    priority: 'medium',
    due_date: '',
    estimated_hours: 1,
    client_id: '',
  });

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

  // ✅ Función para cargar clientes disponibles para el asesor
  const loadClients = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

             // Buscar clientes asignados a este asesor
       const { data, error } = await supabase
         .from('client_profiles')
         .select(`
           user_id,
           users!inner(id, full_name, email)
         `)
         .eq('assigned_advisor_id', user.id);

       if (error) {
         console.error('Error loading clients:', error);
         return;
       }

       const clientList = data?.map((item: any) => ({
         id: item.user_id,
         name: item.users?.full_name || 'Cliente sin nombre',
         email: item.users?.email || ''
       })) || [];

      setClients(clientList);
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  // ✅ Función para cargar tareas reales desde Supabase con JOINs
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver tareas');
        return;
      }

      setCurrentUser(user);

      // Consulta compleja con JOINs para obtener datos de cliente y asesor
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:users!client_id(
            id,
            full_name,
            email
          ),
          advisor:users!advisor_id(
            id,
            full_name,
            email
          )
        `)
        .eq('advisor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        toast.error('Error al cargar tareas');
        return;
      }

      // Mapear datos para incluir campos de cliente y asesor
      const mappedTasks = data?.map(task => ({
        ...task,
        client_name: task.client?.full_name,
        client_email: task.client?.email,
        advisor_name: task.advisor?.full_name,
        advisor_email: task.advisor?.email
      })) || [];

      setTasks(mappedTasks);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar tareas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para crear nueva tarea
  const createTask = async (taskData: NewTask) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return false;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskData.title,
            description: taskData.description,
            task_type: taskData.task_type,
            priority: taskData.priority,
            status: 'pending',
            client_id: taskData.client_id,
            advisor_id: currentUser.id,
            due_date: taskData.due_date,
            estimated_hours: taskData.estimated_hours,
            completion_percentage: 0,
            billing_status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error creating task:', error);
        toast.error('Error al crear tarea');
        return false;
      }

      toast.success('Tarea creada con éxito');
      
      // Recargar tareas para mostrar la nueva
      await loadTasks();
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear tarea');
      return false;
    }
  };

  // ✅ Función para actualizar estado de tarea
  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      const updateData: any = { 
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Si se completa, marcar fecha de completado
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completion_percentage = 100;
      }

      // Si se inicia, marcar fecha de inicio
      if (newStatus === 'in_progress') {
        updateData.started_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('advisor_id', currentUser.id); // Seguridad adicional

      if (error) {
        console.error('Error updating task status:', error);
        toast.error('Error al actualizar estado');
        return;
      }

      // Actualizar estado local inmediatamente
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { 
          ...task, 
          status: newStatus,
          ...(newStatus === 'completed' && { 
            completed_at: new Date().toISOString(),
            completion_percentage: 100 
          }),
          ...(newStatus === 'in_progress' && { 
            started_at: new Date().toISOString() 
          })
        } : task
      ));

      toast.success('Estado de tarea actualizado');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado');
    }
  };

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    loadTasks();
    loadClients();
  }, [loadTasks, loadClients]);

  // Filtros (mantenemos la lógica original)
  useEffect(() => {
    let filtered = tasks;

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(task => task.task_type === typeFilter);
    }

    // Ordenar por prioridad y fecha de vencimiento
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, statusFilter, priorityFilter, typeFilter]);

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
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
      case 'modelo_303': return <FileText className="h-4 w-4" />;
      case 'irpf': return <FileText className="h-4 w-4" />;
      case 'constitucion': return <User className="h-4 w-4" />;
      case 'consultoria': return <User className="h-4 w-4" />;
      case 'documentos': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calcular estadísticas
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    overdue: tasks.filter(t => {
      const days = getDaysUntilDue(t.due_date);
      return days !== null && days < 0 && t.status !== 'completed';
    }).length,
  };

  // ✅ Manejar creación de nueva tarea
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!newTask.client_id) {
      toast.error('Selecciona un cliente');
      return;
    }

    const success = await createTask(newTask);
    if (success) {
      setNewTask({
        title: '',
        description: '',
        task_type: 'consultoria',
        priority: 'medium',
        due_date: '',
        estimated_hours: 1,
        client_id: '',
      });
    }
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
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Descripción"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded p-2 min-h-[80px]"
                  required
                />
                <Select
                  value={newTask.task_type}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, task_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de tarea" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultoria">Consultoría</SelectItem>
                    <SelectItem value="irpf">Declaración IRPF</SelectItem>
                    <SelectItem value="modelo_303">Modelo 303 (IVA)</SelectItem>
                    <SelectItem value="constitucion">Constitución Empresa</SelectItem>
                    <SelectItem value="documentos">Gestión Documental</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newTask.client_id}
                  onValueChange={(value) => setNewTask(prev => ({ ...prev, client_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  name="due_date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                  required
                />
                <Input
                  type="number"
                  name="estimated_hours"
                  placeholder="Horas estimadas"
                  min="0.5"
                  step="0.5"
                  value={newTask.estimated_hours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: parseFloat(e.target.value) }))}
                  required
                />
                <Button type="submit" className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  Crear Tarea
                </Button>
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
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="under_review">En revisión</SelectItem>
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
                  <SelectItem value="consultoria">Consultoría</SelectItem>
                  <SelectItem value="irpf">IRPF</SelectItem>
                  <SelectItem value="modelo_303">Modelo 303</SelectItem>
                  <SelectItem value="constitucion">Constitución</SelectItem>
                  <SelectItem value="documentos">Documentos</SelectItem>
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
              const daysUntilDue = getDaysUntilDue(task.due_date);
              const isOverdue = daysUntilDue !== null && daysUntilDue < 0 && task.status !== 'completed';
              
              return (
                <Card key={task.id} className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(task.task_type)}
                            <h3 className="text-lg font-semibold text-[#0A1B3D]">
                              {task.title}
                            </h3>
                          </div>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status === 'pending' && 'Pendiente'}
                            {task.status === 'in_progress' && 'En Progreso'}
                            {task.status === 'under_review' && 'En Revisión'}
                            {task.status === 'completed' && 'Completada'}
                            {task.status === 'cancelled' && 'Cancelada'}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'low' && 'Baja'}
                            {task.priority === 'medium' && 'Media'}
                            {task.priority === 'high' && 'Alta'}
                            {task.priority === 'urgent' && 'Urgente'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{task.client_name}</span>
                          </div>
                          {task.due_date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(task.due_date).toLocaleDateString('es-ES')}
                                {daysUntilDue !== null && (
                                  <span className={`ml-1 ${isOverdue ? 'text-red-600 font-medium' : daysUntilDue <= 3 ? 'text-orange-600' : ''}`}>
                                    ({isOverdue ? `${Math.abs(daysUntilDue)} días atrasada` : 
                                       daysUntilDue === 0 ? 'Vence hoy' :
                                       `${daysUntilDue} días restantes`})
                                  </span>
                                )}
                              </span>
                            </div>
                          )}
                          {task.estimated_hours && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.estimated_hours}h estimadas</span>
                              {task.actual_hours && (
                                <span> / {task.actual_hours}h trabajadas</span>
                              )}
                            </div>
                          )}
                        </div>

                        {task.completion_percentage > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progreso</span>
                              <span>{task.completion_percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#2FD7B5] h-2 rounded-full" 
                                style={{ width: `${task.completion_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {task.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, 'in_progress')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        {task.status === 'in_progress' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'under_review')}
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                            >
                              En Revisión
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completar
                            </Button>
                          </>
                        )}
                        {task.status === 'under_review' && (
                          <Button
                            size="sm"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Aprobar
                          </Button>
                        )}
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