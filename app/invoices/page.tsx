'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Euro,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  services: InvoiceService[];
  paymentMethod?: string;
  paidDate?: string;
  advisorName: string;
  description: string;
  downloadUrl?: string;
}

interface InvoiceService {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function InvoicesPage() {
  const { user, isClient } = useAuthStore();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not client
  useEffect(() => {
    if (user && !isClient()) {
      router.push('/advisor');
      return;
    }
  }, [user, isClient, router]);

  // Get invoices for current client
  const getClientInvoices = (): Invoice[] => {
    if (!user) return [];
    
    return [
      {
        id: 'inv-001',
        invoiceNumber: 'ASF-2024-001',
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
        advisorName: 'María García Rodríguez',
        description: 'Servicio de asesoramiento fiscal para declaración IRPF'
      },
      {
        id: 'inv-002',
        invoiceNumber: 'ASF-2024-007',
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
        advisorName: 'María García Rodríguez',
        description: 'Servicios de consultoría fiscal y revisión documental'
      },
      {
        id: 'inv-003',
        invoiceNumber: 'ASF-2024-012',
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
        advisorName: 'María García Rodríguez',
        description: 'Consulta urgente sobre vencimientos fiscales'
      },
      {
        id: 'inv-004',
        invoiceNumber: 'ASF-2024-015',
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
        advisorName: 'María García Rodríguez',
        description: 'Liquidación trimestral de IVA cuarto trimestre'
      }
    ];
  };

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user) return;
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const clientInvoices = getClientInvoices();
      setInvoices(clientInvoices);
      setFilteredInvoices(clientInvoices);
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
        invoice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.services.some(service => 
          service.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchQuery, statusFilter]);

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

  const handlePayInvoice = (invoiceId: string) => {
    // Mock payment process
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'paid' as any, paidDate: new Date().toISOString().split('T')[0], paymentMethod: 'Tarjeta de crédito' }
        : inv
    ));
    alert('Pago procesado correctamente. Recibirás un email de confirmación.');
  };

  const handleDownload = (invoice: Invoice) => {
    // Mock download
    alert(`Descargando factura ${invoice.invoiceNumber}...`);
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => ['sent', 'draft'].includes(i.status)).length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">Mis Facturas</h1>
          <p className="text-gray-600">
            Gestiona y consulta todas tus facturas de servicios fiscales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="text-2xl font-bold text-emerald-600 mb-1">€{stats.totalAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Pagado</div>
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
                  placeholder="Buscar facturas por número o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2FD7B5]"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="sent">Enviada</option>
                <option value="paid">Pagada</option>
                <option value="overdue">Vencida</option>
              </select>
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
                  No tienes facturas que coincidan con los filtros seleccionados
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                          <FileText className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Asesor:</strong> {invoice.advisorName}
                          </span>
                        </div>
                      </div>

                      {/* Services breakdown */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Servicios:</h4>
                        <div className="space-y-1">
                          {invoice.services.map((service) => (
                            <div key={service.id} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                              <span>{service.description}</span>
                              <span>€{service.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-2 pt-2 border-t">
                          <span>Subtotal: €{invoice.amount.toFixed(2)}</span>
                          <span>IVA (21%): €{invoice.tax.toFixed(2)}</span>
                        </div>
                      </div>

                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                          <div className="flex items-center text-sm text-green-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span>
                              Pagado el {new Date(invoice.paidDate).toLocaleDateString('es-ES')}
                              {invoice.paymentMethod && ` mediante ${invoice.paymentMethod}`}
                            </span>
                          </div>
                        </div>
                      )}

                      {invoice.status === 'overdue' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                          <div className="flex items-center text-sm text-red-800">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <span>
                              Esta factura está vencida desde el {new Date(invoice.dueDate).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(invoice)}
                        title="Descargar factura"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>

                      {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <Button
                          size="sm"
                          onClick={() => handlePayInvoice(invoice.id)}
                          className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                        >
                          <CreditCard className="h-4 w-4 mr-1" />
                          Pagar Ahora
                        </Button>
                      )}

                      {invoice.status === 'overdue' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Contactar Asesor
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {stats.overdue > 0 && (
          <Card className="border-0 shadow-lg mt-8 border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Tienes {stats.overdue} factura(s) vencida(s)
                    </h3>
                    <p className="text-red-600">
                      Te recomendamos ponerte al día con tus pagos para evitar interrupciones en el servicio.
                    </p>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Pagar Facturas Vencidas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}