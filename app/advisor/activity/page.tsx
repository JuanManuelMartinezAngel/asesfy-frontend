'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatisticsChart } from '@/components/ui/StatisticsChart';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ChatComponent from '@/components/ui/ChatComponent';

const AdvisorPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleExport = () => {
    // Simulate data export
    toast.success('Datos exportados con éxito');
  };

  return (
    <div className="advisor-page-container">
      <ChatComponent />
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Input
              type="text"
              placeholder="Buscar actividades..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-1/2"
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="border-gray-300 focus:border-[#2FD7B5] focus:ring-[#2FD7B5]"
            >
              <option value="all">Todas</option>
              <option value="meetings">Reuniones</option>
              <option value="documents">Documentos</option>
              <option value="updates">Actualizaciones</option>
            </select>
            <Button onClick={handleExport} className="bg-[#2FD7B5] text-white">Exportar</Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0A1B3D]">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm text-gray-600">Reunión con el cliente Juan Pérez</p>
                  <p className="text-xs text-gray-400">Hace 2 horas</p>
                </li>
                <li className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm text-gray-600">Revisión de documentos fiscales</p>
                  <p className="text-xs text-gray-400">Hace 1 día</p>
                </li>
                <li className="p-4 bg-white rounded-lg shadow">
                  <p className="text-sm text-gray-600">Actualización de la agenda</p>
                  <p className="text-xs text-gray-400">Hace 3 días</p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-[#0A1B3D]">Gráfico de Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <StatisticsChart />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvisorPage;

function ActivityItem({ activity }: { activity: { description: string; time: string } }) {
  const [comment, setComment] = useState('');

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    toast.success('Comentario agregado');
    setComment('');
  };

  return (
    <li className="p-4 bg-white rounded-lg shadow">
      <p className="text-sm text-gray-600">{activity.description}</p>
      <p className="text-xs text-gray-400">{activity.time}</p>
      <div className="mt-2">
        <Input
          type="text"
          placeholder="Agregar comentario..."
          value={comment}
          onChange={handleCommentChange}
          className="w-full"
        />
        <Button onClick={handleCommentSubmit} className="mt-2 bg-[#2FD7B5] text-white">Comentar</Button>
      </div>
    </li>
  );
} 