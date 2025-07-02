'use client';

import { useState, useEffect } from 'react';
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

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'appointment';
  date: string;
  time: string;
  duration: number;
  clientName?: string;
  location?: string;
  isVirtual?: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function AdvisorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock events data
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Reunión con Juan Pérez',
      description: 'Revisión de declaración IRPF 2023',
      type: 'meeting',
      date: '2024-01-22',
      time: '10:00',
      duration: 60,
      clientName: 'Juan Pérez López',
      isVirtual: true,
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Vencimiento IVA Q4',
      description: 'Presentación liquidación IVA cuarto trimestre',
      type: 'deadline',
      date: '2024-01-30',
      time: '23:59',
      duration: 0,
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Consulta Ana Martín',
      description: 'Asesoramiento sobre deducciones energéticas',
      type: 'appointment',
      date: '2024-01-24',
      time: '15:30',
      duration: 45,
      clientName: 'Ana Martín Sánchez',
      location: 'Oficina Madrid',
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Recordatorio: Documentos TechStart',
      description: 'Solicitar documentos contables Q4',
      type: 'reminder',
      date: '2024-01-25',
      time: '09:00',
      duration: 0,
      clientName: 'TechStart SL',
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Reunión planificación fiscal',
      description: 'Estrategia fiscal 2024 con Carlos Ruiz',
      type: 'meeting',
      date: '2024-01-26',
      time: '11:00',
      duration: 90,
      clientName: 'Carlos Ruiz Fernández',
      location: 'Oficina Barcelona',
      status: 'scheduled'
    }
  ];

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'appointment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'deadline': return <CalendarIcon className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      case 'appointment': return <User className="h-4 w-4" />;
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
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)}`}
              >
                {event.time} {event.title}
              </div>
            ))}
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
    return event.date === today;
  });

  const upcomingEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate > today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
              Calendario del Asesor
            </h1>
            <p className="text-gray-600">
              Gestiona tus citas, reuniones y vencimientos fiscales
            </p>
          </div>
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
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Funcionalidad de creación de eventos en desarrollo
                </p>
              </div>
            </DialogContent>
          </Dialog>
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
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.time}
                            {event.clientName && ` • ${event.clientName}`}
                          </p>
                          {event.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          )}
                          {event.isVirtual && (
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
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0A1B3D] truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('es-ES')} • {event.time}
                          </p>
                          {event.clientName && (
                            <p className="text-xs text-gray-500">{event.clientName}</p>
                          )}
                          <Badge className={`mt-1 ${getEventTypeColor(event.type)}`}>
                            {event.type === 'meeting' && 'Reunión'}
                            {event.type === 'deadline' && 'Vencimiento'}
                            {event.type === 'reminder' && 'Recordatorio'}
                            {event.type === 'appointment' && 'Cita'}
                          </Badge>
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
          </div>
        </div>
      </div>
    </div>
  );
}