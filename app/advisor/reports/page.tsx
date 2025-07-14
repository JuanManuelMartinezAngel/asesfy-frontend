'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Euro,
  Calendar,
  Clock,
  Target,
  Award,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  period: string;
  icon: any;
  color: string;
}

interface ClientPerformance {
  clientId: string;
  clientName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  revenue: number;
  satisfaction: number;
  lastActivity: string;
}

interface TimeSeriesData {
  period: string;
  tasks: number;
  revenue: number;
  clients: number;
}

export default function AdvisorReportsPage() {
  const { user, isAdvisor } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not advisor
  useEffect(() => {
    if (user && !isAdvisor()) {
      router.push('/dashboard');
      return;
    }
  }, [user, isAdvisor, router]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    loadData();
  }, [selectedPeriod]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Mock data for metrics
  const metrics: MetricCard[] = [
    {
      title: 'Clientes Activos',
      value: 24,
      change: 12.5,
      period: 'vs mes anterior',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Tareas Completadas',
      value: 156,
      change: 8.3,
      period: 'este mes',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Ingresos Mensuales',
      value: '€4,250',
      change: 15.7,
      period: 'vs mes anterior',
      icon: Euro,
      color: 'text-emerald-600'
    },
    {
      title: 'Satisfacción Promedio',
      value: '4.8/5',
      change: 5.2,
      period: 'puntuación',
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      title: 'Tiempo Promedio',
      value: '2.3h',
      change: -12.1,
      period: 'por tarea',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Tasa de Conversión',
      value: '94%',
      change: 3.2,
      period: 'consultas cerradas',
      icon: Target,
      color: 'text-indigo-600'
    }
  ];

  // Mock data for client performance
  const clientPerformance: ClientPerformance[] = [
    {
      clientId: '1',
      clientName: 'Juan Pérez López',
      totalTasks: 12,
      completedTasks: 10,
      pendingTasks: 2,
      revenue: 340,
      satisfaction: 5.0,
      lastActivity: '2024-01-22'
    },
    {
      clientId: '2',
      clientName: 'Ana Martín Sánchez',
      totalTasks: 8,
      completedTasks: 7,
      pendingTasks: 1,
      revenue: 280,
      satisfaction: 4.8,
      lastActivity: '2024-01-21'
    },
    {
      clientId: '3',
      clientName: 'TechStart SL',
      totalTasks: 15,
      completedTasks: 12,
      pendingTasks: 3,
      revenue: 750,
      satisfaction: 4.9,
      lastActivity: '2024-01-20'
    },
    {
      clientId: '4',
      clientName: 'Carlos Ruiz Fernández',
      totalTasks: 6,
      completedTasks: 6,
      pendingTasks: 0,
      revenue: 210,
      satisfaction: 4.7,
      lastActivity: '2024-01-19'
    }
  ];

  // Mock data for time series
  const timeSeriesData: TimeSeriesData[] = [
    { period: 'Ene', tasks: 45, revenue: 3200, clients: 18 },
    { period: 'Feb', tasks: 52, revenue: 3650, clients: 20 },
    { period: 'Mar', tasks: 48, revenue: 3890, clients: 22 },
    { period: 'Abr', tasks: 61, revenue: 4100, clients: 23 },
    { period: 'May', tasks: 58, revenue: 4250, clients: 24 },
    { period: 'Jun', tasks: 65, revenue: 4500, clients: 25 }
  ];

  const exportReport = (type: string) => {
    // Mock export functionality
    const fileName = `informe_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
    // In real app, this would trigger actual file download
    alert(`Exportando ${fileName}...`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">Informes y Analytics</h1>
            <p className="text-gray-600">
              Análisis de rendimiento y métricas de tu actividad como asesor
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2FD7B5]"
            >
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
            </select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todo
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-[#0A1B3D]">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {metric.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        {metric.period}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-[#2FD7B5]" />
                Evolución de Ingresos
              </CardTitle>
              <CardDescription>
                Ingresos mensuales de los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSeriesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-12">{data.period}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2FD7B5] h-2 rounded-full"
                          style={{ width: `${(data.revenue / 5000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0A1B3D] w-16 text-right">
                      €{data.revenue}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => exportReport('ingresos')}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Informe de Ingresos
              </Button>
            </CardContent>
          </Card>

          {/* Tasks Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Productividad de Tareas
              </CardTitle>
              <CardDescription>
                Tareas completadas por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSeriesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-12">{data.period}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(data.tasks / 70) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0A1B3D] w-16 text-right">
                      {data.tasks} tareas
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => exportReport('productividad')}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Informe de Productividad
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Client Performance Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0A1B3D] flex items-center">
              <Users className="h-5 w-5 mr-2 text-emerald-600" />
              Rendimiento por Cliente
            </CardTitle>
            <CardDescription>
              Análisis detallado del rendimiento de cada cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Tareas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Completadas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Ingresos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Satisfacción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Última Actividad</th>
                  </tr>
                </thead>
                <tbody>
                  {clientPerformance.map((client) => (
                    <tr key={client.clientId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0A1B3D]">{client.clientName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{client.totalTasks}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-gray-900 mr-2">{client.completedTasks}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(client.completedTasks / client.totalTasks) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-emerald-600">€{client.revenue}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-gray-900">{client.satisfaction}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-500">
                          {new Date(client.lastActivity).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => exportReport('clientes')}
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Informe de Clientes
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-[#2FD7B5] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                Informe Financiero
              </h3>
              <p className="text-gray-600 mb-4">
                Genera un informe detallado de ingresos y facturación
              </p>
              <Button 
                className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90"
                onClick={() => exportReport('financiero')}
              >
                Generar Informe
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                Informe de Actividad
              </h3>
              <p className="text-gray-600 mb-4">
                Resumen de todas las tareas y actividades realizadas
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => exportReport('actividad')}
              >
                Generar Informe
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                Informe de Clientes
              </h3>
              <p className="text-gray-600 mb-4">
                Análisis detallado del rendimiento de cada cliente
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => exportReport('detalle-clientes')}
              >
                Generar Informe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}