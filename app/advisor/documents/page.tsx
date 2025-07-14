'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Calendar,
  User,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdvisorDocument {
  id: string;
  name: string;
  type: string;
  category: 'irpf' | 'iva' | 'sociedades' | 'nominas' | 'otros';
  clientId: string;
  clientName: string;
  uploadedAt: string;
  size: number;
  status: 'pending' | 'reviewed' | 'processed' | 'archived';
  taskId?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  notes?: string;
}

export default function AdvisorDocumentsPage() {
  const { user, isAdvisor } = useAuthStore();
  const router = useRouter();
  const [documents, setDocuments] = useState<AdvisorDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<AdvisorDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not advisor
  useEffect(() => {
    if (user && !isAdvisor()) {
      router.push('/documents');
      return;
    }
  }, [user, isAdvisor, router]);

  // Get all documents from advisor's clients
  const getAdvisorDocuments = (): AdvisorDocument[] => {
    if (!user) return [];
    
    return [
      {
        id: '1',
        name: 'Certificado_Ingresos_2023.pdf',
        type: 'pdf',
        category: 'irpf',
        clientId: 'client-1',
        clientName: 'Juan Pérez López',
        uploadedAt: '2024-01-20',
        size: 245760,
        status: 'pending',
        taskId: 'task-1',
        priority: 'high',
        dueDate: '2024-01-25',
        notes: 'Cliente requiere revisión urgente para declaración.'
      },
      {
        id: '2',
        name: 'Facturas_Q4_2023.zip',
        type: 'zip',
        category: 'iva',
        clientId: 'client-2',
        clientName: 'Ana Martín Sánchez',
        uploadedAt: '2024-01-19',
        size: 1048576,
        status: 'reviewed',
        taskId: 'task-2',
        priority: 'medium',
        notes: 'Facturas revisadas, pendiente de procesamiento final.'
      },
      {
        id: '3',
        name: 'Balance_Situacion_2023.xlsx',
        type: 'xlsx',
        category: 'sociedades',
        clientId: 'client-3',
        clientName: 'TechStart SL',
        uploadedAt: '2024-01-18',
        size: 512000,
        status: 'processed',
        priority: 'low',
        notes: 'Documento procesado y enviado al cliente.'
      },
      {
        id: '4',
        name: 'Nominas_Diciembre_2023.pdf',
        type: 'pdf',
        category: 'nominas',
        clientId: 'client-4',
        clientName: 'Carlos Ruiz Fernández',
        uploadedAt: '2024-01-17',
        size: 327680,
        status: 'pending',
        taskId: 'task-4',
        priority: 'urgent',
        dueDate: '2024-01-22',
        notes: 'Nóminas urgentes para liquidación.'
      },
      {
        id: '5',
        name: 'Gastos_Deducibles_2023.xlsx',
        type: 'xlsx',
        category: 'irpf',
        clientId: 'client-1',
        clientName: 'Juan Pérez López',
        uploadedAt: '2024-01-16',
        size: 204800,
        status: 'archived',
        priority: 'low',
        notes: 'Documento archivado tras completar declaración.'
      }
    ];
  };

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;
      
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const advisorDocs = getAdvisorDocuments();
      setDocuments(advisorDocs);
      setFilteredDocuments(advisorDocs);
      setIsLoading(false);
    };

    loadDocuments();
  }, [user]);

  useEffect(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by client
    if (clientFilter !== 'all') {
      filtered = filtered.filter(doc => doc.clientId === clientFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, clientFilter, statusFilter, categoryFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateDocumentStatus = (documentId: string, newStatus: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status: newStatus as any } : doc
    ));
    
    const statusText = {
      'reviewed': 'revisado',
      'processed': 'procesado', 
      'archived': 'archivado'
    }[newStatus] || newStatus;
    
    // Simulate updating task status
    alert(`Documento marcado como ${statusText}. Tarea actualizada automáticamente.`);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    reviewed: documents.filter(d => d.status === 'reviewed').length,
    processed: documents.filter(d => d.status === 'processed').length,
  };

  const uniqueClients = Array.from(new Set(documents.map(d => d.clientId)))
    .map(id => documents.find(d => d.clientId === id))
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">Gestión de Documentos</h1>
          <p className="text-gray-600">
            Administra y procesa todos los documentos de tus clientes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#0A1B3D] mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Documentos</div>
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
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.reviewed}</div>
              <div className="text-sm text-gray-600">Revisados</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.processed}</div>
              <div className="text-sm text-gray-600">Procesados</div>
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
                  placeholder="Buscar documentos o clientes..."
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
                  {uniqueClients.map((client) => (
                    <SelectItem key={client?.clientId} value={client?.clientId || ''}>
                      {client?.clientName}
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
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="reviewed">Revisado</SelectItem>
                  <SelectItem value="processed">Procesado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="irpf">IRPF</SelectItem>
                  <SelectItem value="iva">IVA</SelectItem>
                  <SelectItem value="sociedades">Sociedades</SelectItem>
                  <SelectItem value="nominas">Nóminas</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0A1B3D] mb-2">
                  No se encontraron documentos
                </h3>
                <p className="text-gray-600">
                  Ajusta tus filtros para ver más documentos
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((document) => (
              <Card key={document.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        <FileText className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                          {document.name}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <Link href={`/advisor/clients?client=${document.clientId}`} className="text-blue-600 hover:underline">
                              {document.clientName}
                            </Link>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(document.uploadedAt).toLocaleDateString('es-ES')}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatFileSize(document.size)}
                          </span>
                          {document.dueDate && (
                            <div className="flex items-center text-sm text-red-600">
                              <Clock className="h-4 w-4 mr-1" />
                              Vence: {new Date(document.dueDate).toLocaleDateString('es-ES')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getStatusColor(document.status)}>
                            {document.status === 'pending' && 'Pendiente'}
                            {document.status === 'reviewed' && 'Revisado'}
                            {document.status === 'processed' && 'Procesado'}
                            {document.status === 'archived' && 'Archivado'}
                          </Badge>
                          <Badge className={getPriorityColor(document.priority)}>
                            {document.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {document.category.toUpperCase()}
                          </Badge>
                        </div>

                        {document.notes && (
                          <div className="p-3 bg-gray-50 rounded-lg mb-3">
                            <p className="text-sm text-gray-700">
                              <strong>Notas:</strong> {document.notes}
                            </p>
                          </div>
                        )}

                        {document.taskId && (
                          <div className="text-sm text-blue-600">
                            <Link href={`/advisor/tasks?task=${document.taskId}`} className="hover:underline">
                              Ver tarea relacionada →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="Ver documento">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" title="Descargar">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        {document.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateDocumentStatus(document.id, 'reviewed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Marcar Revisado
                          </Button>
                        )}
                        {document.status === 'reviewed' && (
                          <Button
                            size="sm"
                            onClick={() => updateDocumentStatus(document.id, 'processed')}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Marcar Procesado
                          </Button>
                        )}
                        {document.status === 'processed' && (
                          <Button
                            size="sm"
                            onClick={() => updateDocumentStatus(document.id, 'archived')}
                            className="bg-gray-600 hover:bg-gray-700 text-white text-xs"
                          >
                            <Archive className="h-3 w-3 mr-1" />
                            Archivar
                          </Button>
                        )}
                      </div>
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