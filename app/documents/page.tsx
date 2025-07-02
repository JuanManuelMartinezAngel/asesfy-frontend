'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  User,
  FolderOpen,
  Plus
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
import { toast } from 'sonner';

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'irpf' | 'iva' | 'sociedades' | 'nominas' | 'otros';
  clientId: string;
  clientName: string;
  uploadedAt: string;
  size: number;
  status: 'pending' | 'reviewed' | 'processed' | 'archived';
  url?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Mock documents data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Certificado_Ingresos_2023.pdf',
      type: 'pdf',
      category: 'irpf',
      clientId: 'client-1',
      clientName: 'Juan Pérez López',
      uploadedAt: '2024-01-20',
      size: 245760,
      status: 'reviewed'
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
      status: 'pending'
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
      status: 'processed'
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
      status: 'reviewed'
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
      status: 'processed'
    },
    {
      id: '6',
      name: 'Contrato_Alquiler_Local.pdf',
      type: 'pdf',
      category: 'otros',
      clientId: 'client-5',
      clientName: 'Laura Sánchez Gómez',
      uploadedAt: '2024-01-15',
      size: 1572864,
      status: 'pending'
    }
  ];

  useEffect(() => {
    const loadDocuments = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setIsLoading(false);
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    let filtered = documents;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, categoryFilter, statusFilter]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'irpf': return 'bg-purple-100 text-purple-800';
      case 'iva': return 'bg-blue-100 text-blue-800';
      case 'sociedades': return 'bg-green-100 text-green-800';
      case 'nominas': return 'bg-orange-100 text-orange-800';
      case 'otros': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const handleDownload = (document: Document) => {
    toast.success(`Descargando ${document.name}`);
  };

  const handleDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    toast.success('Documento eliminado');
  };

  const updateDocumentStatus = (documentId: string, newStatus: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, status: newStatus as any } : doc
    ));
    toast.success('Estado del documento actualizado');
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    reviewed: documents.filter(d => d.status === 'reviewed').length,
    processed: documents.filter(d => d.status === 'processed').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando documentos...</p>
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
              Gestión de Documentos
            </h1>
            <p className="text-gray-600">
              Organiza y gestiona todos los documentos de tus clientes
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Subir Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Subir Nuevo Documento</DialogTitle>
                <DialogDescription>
                  Sube un documento para un cliente específico
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Arrastra y suelta archivos aquí, o haz clic para seleccionar
                  </p>
                  <Button variant="outline">
                    Seleccionar Archivos
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client-1">Juan Pérez López</SelectItem>
                      <SelectItem value="client-2">Ana Martín Sánchez</SelectItem>
                      <SelectItem value="client-3">TechStart SL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="irpf">IRPF</SelectItem>
                      <SelectItem value="iva">IVA</SelectItem>
                      <SelectItem value="sociedades">Sociedades</SelectItem>
                      <SelectItem value="nominas">Nóminas</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                  Subir Documento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar documentos o clientes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
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
                  Intenta ajustar tus filtros o sube un nuevo documento
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDocuments.map((document) => (
              <Card key={document.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(document.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#0A1B3D] truncate">
                          {document.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {document.clientName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(document.uploadedAt).toLocaleDateString('es-ES')}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatFileSize(document.size)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getCategoryColor(document.category)}>
                            {document.category.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status === 'pending' && 'Pendiente'}
                            {document.status === 'reviewed' && 'Revisado'}
                            {document.status === 'processed' && 'Procesado'}
                            {document.status === 'archived' && 'Archivado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {document.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateDocumentStatus(document.id, 'reviewed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Marcar como Revisado
                        </Button>
                      )}
                      {document.status === 'reviewed' && (
                        <Button
                          size="sm"
                          onClick={() => updateDocumentStatus(document.id, 'processed')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Marcar como Procesado
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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