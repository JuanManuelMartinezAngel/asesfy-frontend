'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus,
  Search, 
  Download, 
  Eye, 
  Edit,
  Send,
  Calendar,
  Euro,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  PieChart,
  TrendingUp,
  Users
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdvisorInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  services: InvoiceService[];
  paymentMethod?: string;
  paidDate?: string;
  description: string;
  notes?: string;
}

interface InvoiceService {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function AdvisorBillingPage() {
  const { user, isAdvisor } = useAuthStore();
  const router = useRouter();
  const [invoices, setInvoices] = useState<AdvisorInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<AdvisorInvoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    clientId: '',
    description: '',
    services: [{ description: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });

  // Redirect if not advisor
  useEffect(() => {
    if (user && !isAdvisor()) {
      router.push('/invoices');
      return;
    }
  }, [user, isAdvisor, router]);

  // Mock clients data
  const getAdvisorClients = (): Client[] => [
    { id: 'client-1', name: 'Juan Pérez López', email: 'juan.perez@email.com' },
    { id: 'client-2', name: 'Ana Martín Sánchez', email: 'ana.martin@email.com' },
    { id: 'client-3', name: 'TechStart SL', email: 'admin@techstart.com' },
    { id: 'client-4', name: 'Carlos Ruiz Fernández', email: 'carlos.ruiz@email.com' },
    { id: 'client-5', name: 'Innovación Digital SA', email: 'facturacion@innovacion.com' }
  ];

  // Get invoices for current advisor
  const getAdvisorInvoices = (): AdvisorInvoice[] => {
    if (!user) return [];
    
    return [
      {
        id: 'inv-001',
        invoiceNumber: 'ASF-2024-001',
        clientId: 'client-1',
        clientName: 'Juan Pérez López',
        clientEmail: 'juan.perez@email.com',
        date: '2024-01-15',
        dueDate: '2024-02-15',
        amount: 89.00,
        tax: 18.69,
        total: 107.69,
        status: 'paid',
        services: [
          {
            id: 'srv-1',
            description: 'Declaración de la Renta 2023',
            quantity: 1,
            unitPrice: 89.00,
            total: 89.00
          }
        ],
        paymentMethod: 'Tarjeta de crédito',
        paidDate: '2024-01-20',
        description: 'Servicio de asesoramiento fiscal para declaración IRPF'
      },
      {
        id: 'inv-002',
        invoiceNumber: 'ASF-2024-007',
        clientId: 'client-2',
        clientName: 'Ana Martín Sánchez',
        clientEmail: 'ana.martin@email.com',
        date: '2024-01-25',
        dueDate: '2024-02-25',
        amount: 156.00,
        tax: 32.76,
        total: 188.76,
        status: 'sent',
        services: [
          {
            id: 'srv-2',
            description: 'Consulta fiscal deducciones energéticas',
            quantity: 1,
            unitPrice: 75.00,
            total: 75.00
          },
          {
            id: 'srv-3',
            description: 'Revisión documentos contables',
            quantity: 2,
            unitPrice: 40.50,
            total: 81.00
          }
        ],
        description: 'Servicios de consultoría fiscal y revisión documental'
      },
      {
        id: 'inv-003',
        invoiceNumber: 'ASF-2024-012',
        clientId: 'client-4',
        clientName: 'Carlos Ruiz Fernández',
        clientEmail: 'carlos.ruiz@email.com',
        date: '2023-12-20',
        dueDate: '2024-01-20',
        amount: 45.00,
        tax: 9.45,
        total: 54.45,
        status: 'overdue',
        services: [
          {
            id: 'srv-4',
            description: 'Consulta telefónica urgente',
            quantity: 1,
            unitPrice: 45.00,
            total: 45.00
          }
        ],
        description: 'Consulta urgente sobre vencimientos fiscales'
      },
      {
        id: 'inv-004',
        invoiceNumber: 'ASF-2024-015',
        clientId: 'client-3',
        clientName: 'TechStart SL',
        clientEmail: 'admin@techstart.com',
        date: '2024-01-28',
        dueDate: '2024-02-28',
        amount: 120.00,
        tax: 25.20,
        total: 145.20,
        status: 'draft',
        services: [
          {
            id: 'srv-5',
            description: 'Preparación liquidación IVA Q4',
            quantity: 1,
            unitPrice: 120.00,
            total: 120.00
          }
        ],
        description: 'Liquidación trimestral de IVA cuarto trimestre'
      }
    ];
  };

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user) return;
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const advisorInvoices = getAdvisorInvoices();
      setInvoices(advisorInvoices);
      setFilteredInvoices(advisorInvoices);
      setIsLoading(false);
    };

    loadInvoices();
  }, [user]);

  useEffect(() => {
    let filtered = invoices;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Filter by client
    if (clientFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.clientId === clientFilter);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchQuery, statusFilter, clientFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Clock className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'sent': return 'Enviada';
      case 'paid': return 'Pagada';
      case 'overdue': return 'Vencida';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'sent' as any } : inv
    ));
    alert('Factura enviada al cliente por email.');
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'paid' as any, paidDate: new Date().toISOString().split('T')[0] }
        : inv
    ));
    alert('Factura marcada como pagada.');
  };

  const addService = () => {
    setNewInvoice(prev => ({
      ...prev,
      services: [...prev.services, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const updateService = (index: number, field: string, value: any) => {
    setNewInvoice(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const removeService = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const calculateInvoiceTotal = () => {
    const subtotal = newInvoice.services.reduce((sum, service) => {
      return sum + (service.quantity * service.unitPrice);
    }, 0);
    const tax = subtotal * 0.21;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCreateInvoice = () => {
    const client = getAdvisorClients().find(c => c.id === newInvoice.clientId);
    if (!client) return;

    const { subtotal, tax, total } = calculateInvoiceTotal();
    const nextNumber = String(invoices.length + 1).padStart(3, '0');
    
    const invoice: AdvisorInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `ASF-2024-${nextNumber}`,
      clientId: newInvoice.clientId,
      clientName: client.name,
      clientEmail: client.email,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: subtotal,
      tax,
      total,
      status: 'draft',
      services: newInvoice.services.map((service, index) => ({
        id: `srv-${Date.now()}-${index}`,
        ...service,
        total: service.quantity * service.unitPrice
      })),
      description: newInvoice.description,
      notes: newInvoice.notes
    };

    setInvoices(prev => [invoice, ...prev]);
    setShowCreateModal(false);
    setNewInvoice({
      clientId: '',
      description: '',
      services: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: ''
    });
    alert('Factura creada correctamente.');
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => ['sent', 'draft'].includes(i.status)).length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pendingRevenue: invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, inv) => sum + inv.total, 0)
  };

  const clients = getAdvisorClients();
  const uniqueClients = Array.from(new Set(invoices.map(i => i.clientId)))
    .map(id => invoices.find(i => i.clientId === id))
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">Facturación</h1>
            <p className="text-gray-600">
              Gestiona y crea facturas para tus clientes
            </p>
          </div>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Factura</DialogTitle>
                <DialogDescription>
                  Completa los datos para generar una nueva factura para tu cliente.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cliente</label>
                    <Select value={newInvoice.clientId} onValueChange={(value) => setNewInvoice(prev => ({ ...prev, clientId: value }))}>
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descripción General</label>
                    <Input
                      placeholder="Ej: Servicios fiscales enero 2024"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Servicios</label>
                    <Button type="button" variant="outline" size="sm" onClick={addService}>
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir Servicio
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {newInvoice.services.map((service, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Input
                            placeholder="Descripción del servicio"
                            value={service.description}
                            onChange={(e) => updateService(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Cant."
                            value={service.quantity}
                            onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Precio"
                            value={service.unitPrice}
                            onChange={(e) => updateService(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-right">
                            €{(service.quantity * service.unitPrice).toFixed(2)}
                          </div>
                        </div>
                        <div className="col-span-1">
                          {newInvoice.services.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeService(index)}
                              className="text-red-600"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-right space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>€{calculateInvoiceTotal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (21%):</span>
                        <span>€{calculateInvoiceTotal().tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-1">
                        <span>Total:</span>
                        <span>€{calculateInvoiceTotal().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notas (opcional)</label>
                  <Textarea
                    placeholder="Notas adicionales para la factura..."
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateInvoice}
                  disabled={!newInvoice.clientId || !newInvoice.description || newInvoice.services.some(s => !s.description || s.unitPrice <= 0)}
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  Crear Factura
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Facturas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.paid}</div>
              <div className="text-sm text-gray-600">Pagadas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.overdue}</div>
              <div className="text-sm text-gray-600">Vencidas</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-emerald-600 mb-1">€{stats.totalRevenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Facturado</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-xl font-bold text-orange-600 mb-1">€{stats.pendingRevenue.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Pendiente Cobro</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar facturas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {uniqueClients.map((invoice) => (
                    <SelectItem key={invoice?.clientId} value={invoice?.clientId || ''}>
                      {invoice?.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="paid">Pagada</SelectItem>
                  <SelectItem value="overdue">Vencida</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <PieChart className="h-4 w-4 mr-1" />
                  Informes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron facturas
                </h3>
                <p className="text-gray-600">
                  {invoices.length === 0 ? 'Crea tu primera factura para comenzar' : 'Ajusta tus filtros para ver más facturas'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-[#0A1B3D] mb-1">
                            Factura {invoice.invoiceNumber}
                          </h3>
                          <p className="text-sm text-gray-600">{invoice.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0A1B3D] mb-1">
                            €{invoice.total.toFixed(2)}
                          </div>
                          <Badge className={getStatusColor(invoice.status)}>
                            <div className="flex items-center">
                              {getStatusIcon(invoice.status)}
                              <span className="ml-1">{getStatusText(invoice.status)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Cliente:</strong> {invoice.clientName}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Fecha:</strong> {new Date(invoice.date).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Vencimiento:</strong> {new Date(invoice.dueDate).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Euro className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Subtotal:</strong> €{invoice.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {invoice.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <strong>Notas:</strong> {invoice.notes}
                          </p>
                        </div>
                      )}

                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                          <div className="flex items-center text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>
                              Pagado el {new Date(invoice.paidDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      )}

                      {invoice.status === 'overdue' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                          <div className="flex items-center text-sm text-red-800">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <span>
                              Factura vencida desde el {new Date(invoice.dueDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button variant="outline" size="sm" title="Descargar PDF">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      
                      <Button variant="outline" size="sm" title="Ver detalles">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>

                      <Button variant="outline" size="sm" title="Editar factura">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>

                      {invoice.status === 'draft' && (
                        <Button
                          size="sm"
                          onClick={() => handleSendInvoice(invoice.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Enviar
                        </Button>
                      )}

                      {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar Pagada
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}