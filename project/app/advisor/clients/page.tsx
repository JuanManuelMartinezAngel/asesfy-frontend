'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Euro,
  Plus,
  Eye,
  MessageSquare,
  AlertCircle,
  CheckCircle
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
import Link from 'next/link';
import ChatComponent from '@/components/ui/ChatComponent';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  clientType: 'individual' | 'company';
  status: 'active' | 'inactive' | 'pending';
  registeredAt: string;
  lastActivity: string;
  totalServices: number;
  totalSpent: number;
  pendingTasks: number;
  nextDeadline?: string;
}

export default function AdvisorClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    clientType: 'individual',
  });

  // Mock clients data
  const mockClients: Client[] = [
    {
      id: '1',
      name: 'Juan Pérez López',
      email: 'juan.perez@email.com',
      phone: '+34 600 123 456',
      clientType: 'individual',
      status: 'active',
      registeredAt: '2024-01-15',
      lastActivity: '2024-01-20',
      totalServices: 3,
      totalSpent: 234,
      pendingTasks: 1,
      nextDeadline: '2024-01-25'
    },
    {
      id: '2',
      name: 'Ana Martín Sánchez',
      email: 'ana.martin@email.com',
      phone: '+34 600 234 567',
      clientType: 'individual',
      status: 'active',
      registeredAt: '2024-01-10',
      lastActivity: '2024-01-22',
      totalServices: 2,
      totalSpent: 134,
      pendingTasks: 0,
    },
    {
      id: '3',
      name: 'Carlos Ruiz Fernández',
      email: 'carlos@techstart.com',
      phone: '+34 600 345 678',
      company: 'TechStart SL',
      clientType: 'company',
      status: 'active',
      registeredAt: '2024-01-05',
      lastActivity: '2024-01-24',
      totalServices: 5,
      totalSpent: 1299,
      pendingTasks: 2,
      nextDeadline: '2024-01-30'
    },
    {
      id: '4',
      name: 'Laura Sánchez Gómez',
      email: 'laura.sanchez@email.com',
      phone: '+34 600 456 789',
      clientType: 'individual',
      status: 'pending',
      registeredAt: '2024-01-22',
      lastActivity: '2024-01-22',
      totalServices: 1,
      totalSpent: 89,
      pendingTasks: 1,
      nextDeadline: '2024-01-28'
    },
    {
      id: '5',
      name: 'Miguel Torres Ruiz',
      email: 'miguel@consultoria.com',
      phone: '+34 600 567 890',
      company: 'Consultoría Torres',
      clientType: 'company',
      status: 'inactive',
      registeredAt: '2023-12-20',
      lastActivity: '2024-01-10',
      totalServices: 8,
      totalSpent: 2340,
      pendingTasks: 0,
    }
  ];

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClients(mockClients);
      setFilteredClients(mockClients);
      setIsLoading(false);
    };

    loadClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(client => client.clientType === typeFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'inactive': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    totalRevenue: clients.reduce((sum, client) => sum + client.totalSpent, 0),
  };

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para añadir el nuevo cliente
    console.log('Nuevo Cliente:', newClient);
    setClients((prev) => [
      ...prev,
      {
        ...newClient,
        clientType: newClient.clientType as 'individual' | 'company',
        id: Date.now().toString(),
        status: 'active',
        registeredAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        totalServices: 0,
        totalSpent: 0,
        pendingTasks: 0
      }
    ]);
    setNewClient({ name: '', email: '', phone: '', clientType: 'individual' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando clientes...</p>
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
              Gestión de Clientes
            </h1>
            <p className="text-gray-600">
              Administra y supervisa todos tus clientes asignados
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Cliente</DialogTitle>
                <DialogDescription>
                  Registra un nuevo cliente en el sistema
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateClient} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Nombre Completo"
                  value={newClient.name}
                  onChange={handleNewClientChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Correo Electrónico"
                  value={newClient.email}
                  onChange={handleNewClientChange}
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Teléfono"
                  value={newClient.phone}
                  onChange={handleNewClientChange}
                  required
                />
                <Button type="submit" className="w-full bg-green-500 text-white">Registrar Cliente</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Clientes</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.active}</div>
              <div className="text-sm text-gray-600">Activos</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#2FD7B5] mb-1">€{stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ingresos Totales</div>
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
                  placeholder="Buscar clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="individual">Particular</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron clientes
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar tus filtros o añade un nuevo cliente
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-[#2FD7B5] rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#0A1B3D]">
                            {client.name}
                          </h3>
                          {client.company && (
                            <p className="text-sm text-gray-600">{client.company}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(client.status)}>
                              {getStatusIcon(client.status)}
                              <span className="ml-1">
                                {client.status === 'active' && 'Activo'}
                                {client.status === 'pending' && 'Pendiente'}
                                {client.status === 'inactive' && 'Inactivo'}
                              </span>
                            </Badge>
                            <Badge variant="outline">
                              {client.clientType === 'individual' ? 'Particular' : 'Empresa'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Registro: {new Date(client.registeredAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-[#0A1B3D]">{client.totalServices}</div>
                          <div className="text-xs text-gray-600">Servicios</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-[#2FD7B5]">€{client.totalSpent}</div>
                          <div className="text-xs text-gray-600">Facturado</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-yellow-600">{client.pendingTasks}</div>
                          <div className="text-xs text-gray-600">Pendientes</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Última actividad</div>
                          <div className="text-sm font-medium text-[#0A1B3D]">
                            {new Date(client.lastActivity).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>

                      {client.nextDeadline && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center text-sm text-yellow-800">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Próximo vencimiento: {new Date(client.nextDeadline).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/advisor/clients/${client.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Perfil
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Nueva Tarea
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        <ChatComponent />
      </div>
    </div>
  );
}