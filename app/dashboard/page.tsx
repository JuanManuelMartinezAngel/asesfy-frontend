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

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            ¡Bienvenido de vuelta, {user?.full_name || user?.email}!
          </h1>
          <p className="text-gray-600">
            Aquí tienes un resumen de tu actividad fiscal y próximas tareas.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ahorro Fiscal
              </CardTitle>
              <Euro className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                €{stats.totalSavings.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Servicios Activos
              </CardTitle>
              <Users className="h-4 w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.activeServices}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                2 completados este mes
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
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.pendingTasks}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                -2 desde ayer
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Próximo Vencimiento
              </CardTitle>
              <Calendar className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.nextDeadline}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                En 5 días
              </p>
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
                  Un resumen de tus últimas actividades fiscales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-[#2FD7B5]" />
                        ) : (
                          <Clock className="h-5 w-5 text-[#F4D35E]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A1B3D]">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.date}
                        </p>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">
                      Ver todo el historial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D]">Próximos Vencimientos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-[#0A1B3D]">
                          {deadline.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deadline.date}
                        </p>
                      </div>
                      <Badge 
                        variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}
                      >
                        {deadline.priority === 'high' ? 'Alta' : 'Media'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/calendar">
                    <Button variant="outline" className="w-full">
                      Ver calendario completo
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
              <CardContent>
                <div className="space-y-3">
                  <Link href="/marketplace">
                    <Button className="w-full justify-start bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                      <FileText className="mr-2 h-4 w-4" />
                      Contratar Servicio
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat con IA
                    </Button>
                  </Link>
                  <Link href="/documents">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Subir Documento
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}