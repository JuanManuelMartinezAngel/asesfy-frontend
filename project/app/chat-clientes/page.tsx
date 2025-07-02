"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  MessageSquare,
  Users,
  Clock,
  Phone,
  Video,
  Paperclip,
  Send,
  MoreVertical,
  Star,
  Archive,
  Filter
} from 'lucide-react';
import ChatComponent from '@/components/ui/ChatComponent';

type Client = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

const ChatClientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock data para clientes
  const clients: Client[] = [
    {
      id: 1,
      name: 'María García',
      email: 'maria.garcia@email.com',
      avatar: '/avatars/maria.jpg',
      status: 'online',
      lastMessage: 'Necesito ayuda con mi declaración de IRPF',
      lastMessageTime: '10:30',
      unreadCount: 2
    },
    {
      id: 2,
      name: 'Carlos López',
      email: 'carlos.lopez@email.com',
      avatar: '/avatars/carlos.jpg',
      status: 'offline',
      lastMessage: 'Gracias por la información',
      lastMessageTime: 'Ayer',
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      avatar: '/avatars/ana.jpg',
      status: 'online',
      lastMessage: '¿Cuándo podemos programar una reunión?',
      lastMessageTime: '09:15',
      unreadCount: 1
    }
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'online') return matchesSearch && client.status === 'online';
    if (activeFilter === 'unread') return matchesSearch && client.unreadCount > 0;
    
    return matchesSearch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Chat con Clientes
          </h1>
          <p className="text-gray-600">
            Gestiona todas tus conversaciones con clientes en un solo lugar
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {clients.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +2 nuevos esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                En Línea
              </CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {clients.filter(c => c.status === 'online').length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Disponibles ahora
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensajes Sin Leer
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {clients.reduce((sum, c) => sum + c.unreadCount, 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiempo Promedio
              </CardTitle>
              <Clock className="h-4 w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                2.5h
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Respuesta promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Client List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0A1B3D] flex items-center justify-between">
                Clientes
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Lista de todos tus clientes activos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'online', label: 'En línea' },
                    { key: 'unread', label: 'Sin leer' },
                  ].map((filter) => (
                    <Button
                      key={filter.key}
                      variant={activeFilter === filter.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.key)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Client List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id 
                        ? 'bg-[#0A1B3D] text-white' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={client.avatar} alt={client.name} />
                          <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {client.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium truncate ${
                            selectedClient?.id === client.id ? 'text-white' : 'text-[#0A1B3D]'
                          }`}>
                            {client.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            {client.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {client.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs truncate ${
                          selectedClient?.id === client.id ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {client.lastMessage}
                        </p>
                        <p className={`text-xs ${
                          selectedClient?.id === client.id ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                          {client.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-full">
              {selectedClient ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
                          <AvatarFallback>{selectedClient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-[#0A1B3D] text-lg">
                            {selectedClient.name}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <div className={`h-2 w-2 rounded-full ${
                              selectedClient.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span>{selectedClient.status === 'online' ? 'En línea' : 'Desconectado'}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0">
                    <div className="h-[500px]">
                      <ChatComponent />
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#0A1B3D] mb-2">
                      Selecciona un cliente
                    </h3>
                    <p className="text-gray-500">
                      Elige un cliente de la lista para comenzar a chatear
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatClientes; 