'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Plus,
  File,
  Image,
  FileSpreadsheet
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
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { notifyAdvisorOfClientDocument } from '@/lib/advisor-utils';

// ✅ Interfaz adaptada a la tabla documents de Supabase
interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_by: string;
  client_id: string;
  category: 'irpf' | 'iva' | 'sociedades' | 'nominas' | 'otros';
  status: 'pending' | 'reviewed' | 'processed' | 'archived';
  tags?: string[];
  description?: string;
  created_at: string;
  updated_at: string;
  // Campos del JOIN con users
  client_name?: string;
  client_email?: string;
  uploader_name?: string;
}

interface NewDocument {
  file: File;
  client_id: string;
  category: 'irpf' | 'iva' | 'sociedades' | 'nominas' | 'otros';
  description?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    client_id: '',
    category: 'otros' as const,
    description: ''
  });

  // ✅ Función para obtener el usuario actual
  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  };

  // ✅ Función para cargar clientes disponibles
  const loadClients = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      let clientsQuery;
      
      // Si es advisor, cargar solo sus clientes asignados
      if (user.user_metadata?.role === 'advisor') {
        const { data, error } = await supabase
          .from('client_profiles')
          .select(`
            user_id,
            users!inner(id, full_name, email)
          `)
          .eq('assigned_advisor_id', user.id);

        if (error) {
          console.error('Error loading advisor clients:', error);
          return;
        }

        const clientList = data?.map((item: any) => ({
          id: item.user_id,
          name: item.users?.full_name || 'Cliente sin nombre',
          email: item.users?.email || ''
        })) || [];

        setClients(clientList);
      } else {
        // Si es cliente, solo mostrar sus propios documentos
        setClients([{
          id: user.id,
          name: user.user_metadata?.full_name || 'Mi perfil',
          email: user.email || ''
        }]);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }, []);

  // ✅ Función para cargar documentos reales desde Supabase con JOINs
  const loadDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para ver documentos');
        return;
      }

      setCurrentUser(user);

      let query = supabase
        .from('documents')
        .select(`
          *,
          client:users!client_id(
            id,
            full_name,
            email
          ),
          uploader:users!uploaded_by(
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar según el rol del usuario
      if (user.user_metadata?.role === 'advisor') {
        // Advisor: ver documentos de sus clientes
        const { data: clientIds } = await supabase
          .from('client_profiles')
          .select('user_id')
          .eq('assigned_advisor_id', user.id);

        const clientIdsList = clientIds?.map(c => c.user_id) || [];
        if (clientIdsList.length > 0) {
          query = query.in('client_id', clientIdsList);
        }
      } else {
        // Cliente: ver solo sus propios documentos
        query = query.eq('client_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading documents:', error);
        toast.error('Error al cargar documentos');
        return;
      }

      // Mapear datos para incluir campos de cliente y uploader
      const mappedDocuments = data?.map(doc => ({
        ...doc,
        client_name: doc.client?.full_name,
        client_email: doc.client?.email,
        uploader_name: doc.uploader?.full_name
      })) || [];

      setDocuments(mappedDocuments);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar documentos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para subir archivo a Supabase Storage
  const uploadFile = async (file: File, clientId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${clientId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }

      return {
        path: data.path,
        fullPath: data.fullPath
      };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  // ✅ Función para crear documento en la base de datos
  const createDocument = async (documentData: NewDocument) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return false;
      }

      setIsUploading(true);

      // 1. Subir archivo al Storage
      const fileUpload = await uploadFile(documentData.file, documentData.client_id);

      // 2. Crear registro en la base de datos
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            file_name: documentData.file.name,
            file_type: documentData.file.type,
            file_size: documentData.file.size,
            file_path: fileUpload.path,
            uploaded_by: currentUser.id,
            client_id: documentData.client_id,
            category: documentData.category,
            status: 'pending',
            description: documentData.description || undefined
          }
        ])
        .select();

      if (error) {
        console.error('Error creating document:', error);
        toast.error('Error al crear documento');
        return false;
      }

      toast.success('Documento subido con éxito');
      
      // ✅ Notificar al asesor del nuevo documento
      try {
        await notifyAdvisorOfClientDocument(
          documentData.client_id,
          documentData.file.name
        );
      } catch (notificationError) {
        console.error('Error sending notification to advisor:', notificationError);
        // No fallar el proceso por errores de notificación
      }
      
      // Recargar documentos para mostrar el nuevo
      await loadDocuments();
      return true;

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al subir documento');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Función para actualizar estado del documento
  const updateDocumentStatus = async (documentId: string, newStatus: Document['status']) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      const { error } = await supabase
        .from('documents')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        console.error('Error updating document status:', error);
        toast.error('Error al actualizar estado');
        return;
      }

      // Actualizar estado local inmediatamente
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId ? { ...doc, status: newStatus } : doc
      ));

      toast.success('Estado del documento actualizado');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar estado');
    }
  };

  // ✅ Función para descargar archivo
  const downloadDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(doc.file_path);

      if (error) {
        console.error('Error downloading file:', error);
        toast.error('Error al descargar archivo');
        return;
      }

      // Crear URL para descarga
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Descargando ${doc.file_name}`);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al descargar archivo');
    }
  };

  // ✅ Función para eliminar documento
  const deleteDocument = async (documentId: string, filePath: string) => {
    try {
      if (!currentUser) {
        toast.error('Debes estar autenticado');
        return;
      }

      // 1. Eliminar archivo del Storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) {
        console.warn('Error deleting file from storage:', storageError);
        // Continuar con la eliminación del registro aunque falle el storage
      }

      // 2. Eliminar registro de la base de datos
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        console.error('Error deleting document from database:', dbError);
        toast.error('Error al eliminar documento');
        return;
      }

      // Actualizar estado local
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Documento eliminado');

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar documento');
    }
  };

  // ✅ Cargar datos al montar el componente
  useEffect(() => {
    loadDocuments();
    loadClients();
  }, [loadDocuments, loadClients]);

  // Filtros (mantenemos la lógica original)
  useEffect(() => {
    let filtered = documents;

    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, categoryFilter, statusFilter]);

  // Funciones de utilidad
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
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // ✅ Manejar subida de archivo
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Selecciona un archivo');
      return;
    }

    // Para clientes, usar su propio ID automáticamente
    let clientId = uploadData.client_id;
    if (currentUser?.user_metadata?.role !== 'advisor') {
      clientId = currentUser?.id || '';
    }

    if (!clientId) {
      toast.error('Selecciona un cliente');
      return;
    }

    const success = await createDocument({
      file: selectedFile,
      client_id: clientId,
      category: uploadData.category,
      description: uploadData.description
    });

    if (success) {
      setSelectedFile(null);
      setUploadData({
        client_id: '',
        category: 'otros',
        description: ''
      });
      setIsUploadOpen(false);
    }
  };

  // Calcular estadísticas
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
              Organiza y gestiona todos los documentos{currentUser?.user_metadata?.role === 'advisor' ? ' de tus clientes' : ''}
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
                  Sube un documento {currentUser?.user_metadata?.role === 'advisor' ? 'para un cliente específico' : 'a tu perfil'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {selectedFile ? selectedFile.name : 'Selecciona un archivo'}
                  </p>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline">
                      Seleccionar Archivo
                    </Button>
                  </label>
                </div>
                
                {currentUser?.user_metadata?.role === 'advisor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <Select
                      value={uploadData.client_id}
                      onValueChange={(value) => setUploadData(prev => ({ ...prev, client_id: value }))}
                    >
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
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <Select
                    value={uploadData.category}
                    onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value as any }))}
                  >
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (opcional)
                  </label>
                  <Input
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del documento"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? 'Subiendo...' : 'Subir Documento'}
                </Button>
              </form>
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
                        {getFileIcon(document.file_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-[#0A1B3D] truncate">
                          {document.file_name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {document.client_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(document.created_at).toLocaleDateString('es-ES')}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatFileSize(document.file_size)}
                          </span>
                        </div>
                        {document.description && (
                          <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                        )}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadDocument(document)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {currentUser?.user_metadata?.role === 'advisor' && (
                        <>
                          {document.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateDocumentStatus(document.id, 'reviewed')}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Revisar
                            </Button>
                          )}
                          {document.status === 'reviewed' && (
                            <Button
                              size="sm"
                              onClick={() => updateDocumentStatus(document.id, 'processed')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Procesar
                            </Button>
                          )}
                        </>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteDocument(document.id, document.file_path)}
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