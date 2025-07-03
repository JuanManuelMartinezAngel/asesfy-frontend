'use client';

import { useEffect } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Mock data for dashboard
  const stats = {
    totalSavings: 2340,
    activeServices: 5,
    pendingTasks: 3,
    nextDeadline: '15 Ene 2024',
  };

  const recentActivity = [
    {
      id: 1,
      type: 'service',
      title: 'Declaración IRPF completada',
      date: '2024-01-10',
      status: 'completed',
    },
    {
      id: 2,
      type: 'deadline',
      title: 'IVA Trimestral - Vencimiento próximo',
      date: '2024-01-15',
      status: 'pending',
    },
    {
      id: 3,
      type: 'document',
      title: 'Certificado de ingresos subido',
      date: '2024-01-08',
      status: 'completed',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'IVA 4º Trimestre 2023',
      date: '2024-01-30',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Modelo 303 - IVA',
      date: '2024-02-20',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Retenciones IRPF',
      date: '2024-02-20',
      priority: 'medium',
    },
  ];

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

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1B3D] mb-2">
            ¡Bienvenido de vuelta{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Aquí tienes un resumen de tu actividad fiscal y próximas tareas.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Ahorro Fiscal
              </CardTitle>
              <Euro className="h-3 w-3 sm:h-4 sm:w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                €{stats.totalSavings.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">
                Servicios Activos
              </CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                {stats.activeServices}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                2 completados este mes
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
                Próximo Vencimiento
              </CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0A1B3D]">
                {stats.nextDeadline}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                En 5 días
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
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[#2FD7B5]" />
                        ) : (
                          <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#F4D35E]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1B3D] truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date}
                        </p>
                      </div>
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
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
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1B3D] truncate">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deadline.date}
                        </p>
                      </div>
                      <Badge 
                        variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {deadline.priority === 'high' ? 'Urgente' : 'Normal'}
                      </Badge>
                    </div>
                  ))}
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