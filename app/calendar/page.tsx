'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPin
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ✅ Interfaz adaptada a la tabla calendar_events de Supabase
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'meeting' | 'deadline' | 'reminder' | 'holiday' | 'training';
  start_time: string; // ISO string from TIMESTAMPTZ
  end_time: string;   // ISO string from TIMESTAMPTZ
  location?: string;
  online_meeting_url?: string;
  organizer_id: string;
  task_id?: string;
  is_all_day: boolean;
  recurrence_rule?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  visibility: 'private' | 'shared' | 'public';
  reminder_minutes?: number[];
  created_at: string;
  updated_at: string;
  // Campos adicionales del JOIN con users
  organizer_name?: string;
  organizer_email?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  // ✅ Función para cargar eventos reales desde Supabase
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver eventos');
        return;
      }

      setCurrentUser(user);

      // Consulta real a Supabase con JOIN para obtener datos del organizador
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          organizer:users!organizer_id(
            full_name,
            email
          )
        `)
        .or(`organizer_id.eq.${user.id},visibility.eq.public`)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        toast.error('Error al cargar eventos');
        return;
      }

      // Mapear datos para incluir campos del organizador
      const mappedEvents = data?.map(event => ({
        ...event,
        organizer_name: event.organizer?.full_name,
        organizer_email: event.organizer?.email
      })) || [];

      setEvents(mappedEvents);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar eventos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para crear nuevo evento en Supabase
  const createEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return false;
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([
          {
            title: eventData.title,
            description: eventData.description,
            event_type: eventData.event_type,
            start_time: eventData.start_time,
            end_time: eventData.end_time,
            location: eventData.location,
            online_meeting_url: eventData.online_meeting_url,
            organizer_id: currentUser.id,
            is_all_day: eventData.is_all_day || false,
            status: 'scheduled',
            visibility: eventData.visibility || 'private'
          }
        ])
        .select();

      if (error) {
        console.error('Error creating event:', error);
        toast.error('Error al crear evento');
        return false;
      }

      toast.success('Evento creado con éxito');
      
      // Recargar eventos para mostrar el nuevo
      await loadEvents();
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear evento');
      return false;
    }
  };

  // ✅ Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'holiday': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'deadline': return <CalendarIcon className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'holiday': return <User className="h-4 w-4" />;
      case 'training': return <User className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          } ${isSelected ? 'bg-[#2FD7B5]/10 border-[#2FD7B5]' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => {
              const eventTime = new Date(event.start_time).toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
              return (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.event_type)}`}
                >
                  {eventTime} {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const todayEvents = events.filter(event => {
    const today = new Date().toISOString().split('T')[0];
    const eventDate = new Date(event.start_time).toISOString().split('T')[0];
    return eventDate === today;
  });

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.start_time);
      const today = new Date();
      return eventDate > today;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  // ✅ Función para manejar la creación de eventos desde el formulario
  const handleCreateEvent = async (formData: FormData) => {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const event_type = formData.get('type') as CalendarEvent['event_type'];
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const duration = Number(formData.get('duration') || 60);
    const location = formData.get('location') as string;
    const isVirtual = formData.get('isVirtual') === 'on';

    // Combinar fecha y hora para crear timestamps
    const start_time = new Date(`${date}T${time}`).toISOString();
    const end_time = new Date(new Date(`${date}T${time}`).getTime() + duration * 60000).toISOString();

         const success = await createEvent({
       title,
       description,
       event_type,
       start_time,
       end_time,
       location: isVirtual ? undefined : location,
       online_meeting_url: isVirtual ? 'https://meet.google.com/new' : undefined,
       is_all_day: false,
       visibility: 'private'
     });

    return success;
  };

  const handleSyncWithGoogleCalendar = () => {
    // Lógica para sincronizar con Google Calendar
    console.log('Sincronizando con Google Calendar...');
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Permiso de notificación concedido.');
      }
    }
  };

  const scheduleReminder = (event: CalendarEvent) => {
    const eventDate = new Date(event.start_time);
    const now = new Date();
    const timeUntilEvent = eventDate.getTime() - now.getTime();

    if (timeUntilEvent > 0) {
      setTimeout(() => {
        new Notification('Recordatorio de Evento', {
          body: `Tienes un evento próximo: ${event.title}`,
        });
      }, timeUntilEvent);
    }
  };

  useEffect(() => {
    requestNotificationPermission();
    events.forEach(scheduleReminder);
  }, [events]);

  const handleScheduleMeeting = () => {
    toast.success('Funcionalidad para programar reunión en desarrollo');
  };

  const handleAddReminder = () => {
    toast.success('Funcionalidad para añadir recordatorio en desarrollo');
  };

  const handleViewClients = () => {
    toast.success('Funcionalidad para ver clientes en desarrollo');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando calendario...</p>
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
              Calendario Fiscal
            </h1>
            <p className="text-gray-600">
              Gestiona tus citas, reuniones y vencimientos fiscales
            </p>
          </div>
          <div className="flex space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Evento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Evento</DialogTitle>
                  <DialogDescription>
                    Añade una nueva cita o recordatorio al calendario
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const success = await handleCreateEvent(formData);
                    if (success) {
                      (e.target as HTMLFormElement).reset();
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    name="title"
                    placeholder="Título del Evento"
                    required
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <textarea
                    name="description"
                    placeholder="Descripción"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <select
                    name="type"
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  >
                    <option value="meeting">Reunión</option>
                    <option value="deadline">Vencimiento</option>
                    <option value="reminder">Recordatorio</option>
                    <option value="training">Formación</option>
                    <option value="holiday">Festivo</option>
                  </select>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <input
                    type="number"
                    name="duration"
                    placeholder="Duración (minutos)"
                    defaultValue={60}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <input
                    type="text"
                    name="location"
                    placeholder="Ubicación"
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isVirtual"
                      className="mr-2"
                    />
                    Evento Virtual
                  </label>
                  <Button type="submit" className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Crear Evento
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Link href="/advisor/clients">
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                Ver Clientes
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-[#0A1B3D]">
                    {currentDate.toLocaleDateString('es-ES', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Hoy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-0 border border-gray-200">
                  {renderCalendarDays()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#0A1B3D]">Eventos de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                {todayEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay eventos programados para hoy</p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.start_time).toLocaleTimeString('es-ES')}
                          </p>
                          {event.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.online_meeting_url && (
                            <div className="flex items-center text-xs text-blue-600 mt-1">
                              <Video className="h-3 w-3 mr-1" />
                              Reunión virtual
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#0A1B3D]">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay eventos próximos</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getEventTypeIcon(event.event_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.start_time).toLocaleDateString('es-ES')} • {new Date(event.start_time).toLocaleTimeString('es-ES')}
                          </p>
                          {event.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.online_meeting_url && (
                            <div className="flex items-center text-xs text-blue-600 mt-1">
                              <Video className="h-3 w-3 mr-1" />
                              Reunión virtual
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-[#0A1B3D]">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Programar Reunión
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Añadir Recordatorio
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Ver Clientes
                </Button>
              </CardContent>
            </Card>

            <Button onClick={handleSyncWithGoogleCalendar} className="bg-blue-500 text-white mt-4">
              Sincronizar con Google Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}