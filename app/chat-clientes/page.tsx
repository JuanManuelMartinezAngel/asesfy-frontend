"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  Filter,
  Smile
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

// ✅ Interfaces adaptadas a las tablas de Supabase
type Client = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  message_content: string;
  message_type: 'text' | 'file' | 'image';
  is_read: boolean;
  created_at: string;
  updated_at: string;
  // Campos del JOIN
  sender_name?: string;
  receiver_name?: string;
};

type Conversation = {
  id: string;
  client_id: string;
  advisor_id: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  // Campos del JOIN
  client_name?: string;
  client_email?: string;
};

const ChatClientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // ✅ Función para cargar clientes y sus conversaciones
  const loadClientsAndConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Debes estar autenticado para usar el chat');
        return;
      }

      setCurrentUser(user);

      // Solo advisors pueden usar este chat
      if (user.user_metadata?.role !== 'advisor') {
        toast.error('Solo los asesores pueden acceder al chat de clientes');
        return;
      }

      // Cargar conversaciones del asesor con datos de cliente
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select(`
          *,
          client:users!client_id(
            id,
            full_name,
            email
          )
        `)
        .eq('advisor_id', user.id)
        .order('updated_at', { ascending: false });

      if (convError) {
        console.error('Error loading conversations:', convError);
        toast.error('Error al cargar conversaciones');
        return;
      }

      const conversationsList = conversationsData || [];
      setConversations(conversationsList);

      // Convertir conversaciones a clientes con datos de chat
      const clientsList: Client[] = await Promise.all(
        conversationsList.map(async (conv) => {
          // Contar mensajes no leídos para este cliente
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            id: conv.client_id,
            name: conv.client?.full_name || 'Cliente sin nombre',
            email: conv.client?.email || '',
            status: 'offline' as const, // TODO: Implementar presencia real
            lastMessage: conv.last_message || 'Sin mensajes',
            lastMessageTime: conv.last_message_at 
              ? new Date(conv.last_message_at).toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              : '',
            unreadCount: unreadCount || 0
          };
        })
      );

      setClients(clientsList);

      // Calcular total de mensajes no leídos
      const totalUnread = clientsList.reduce((sum, client) => sum + client.unreadCount, 0);
      setUnreadCount(totalUnread);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos del chat');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Función para cargar mensajes de una conversación
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(
            id,
            full_name
          ),
          receiver:users!receiver_id(
            id,
            full_name
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        toast.error('Error al cargar mensajes');
        return;
      }

      const messagesList = data?.map(msg => ({
        ...msg,
        sender_name: msg.sender?.full_name,
        receiver_name: msg.receiver?.full_name
      })) || [];

      setMessages(messagesList);

      // Marcar mensajes como leídos si el usuario actual es el receptor
      if (currentUser) {
        const unreadMessages = messagesList
          .filter(msg => msg.receiver_id === currentUser.id && !msg.is_read)
          .map(msg => msg.id);

        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadMessages);
          
          // Recargar clientes para actualizar contadores
          await loadClientsAndConversations();
        }
      }

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar mensajes');
    }
  }, [currentUser, loadClientsAndConversations]);

  // ✅ Función para enviar mensaje
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) {
      return;
    }

    const receiverId = selectedClient?.id;
    if (!receiverId) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: selectedConversation,
            sender_id: currentUser.id,
            receiver_id: receiverId,
            message_content: newMessage.trim(),
            message_type: 'text',
            is_read: false
          }
        ])
        .select();

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Error al enviar mensaje');
        return;
      }

      // Actualizar última actividad de la conversación
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedConversation);

      setNewMessage('');

      // Los mensajes se actualizarán automáticamente vía subscription

    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al enviar mensaje');
    }
  };

  // ✅ Función para manejar selección de cliente
  const handleClientSelect = async (client: Client) => {
    setSelectedClient(client);

    // Buscar la conversación correspondiente
    const conversation = conversations.find(conv => conv.client_id === client.id);
    if (conversation) {
      setSelectedConversation(conversation.id);
      await loadMessages(conversation.id);
    }
  };

  // ✅ Configurar subscriptions en tiempo real
  useEffect(() => {
    if (!selectedConversation) return;

    // Subscription para nuevos mensajes
    const messagesSubscription = supabase
      .channel(`messages-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          
          if (payload.eventType === 'INSERT') {
            // Recargar mensajes cuando se inserte uno nuevo
            loadMessages(selectedConversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [selectedConversation, loadMessages]);

  // ✅ Configurar subscription para conversaciones
  useEffect(() => {
    if (!currentUser) return;

    const conversationsSubscription = supabase
      .channel(`conversations-${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `advisor_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time conversation update:', payload);
          // Recargar lista de clientes cuando cambien las conversaciones
          loadClientsAndConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, [currentUser, loadClientsAndConversations]);

  // ✅ Cargar datos iniciales
  useEffect(() => {
    loadClientsAndConversations();
  }, [loadClientsAndConversations]);

  // Filtrar clientes
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2FD7B5] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2">
            Chat con Clientes
          </h1>
          <p className="text-gray-600">
            Gestiona todas tus conversaciones con clientes en tiempo real
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
                Con conversaciones activas
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
                {unreadCount}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversaciones
              </CardTitle>
              <Clock className="h-4 w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {conversations.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total activas
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
                Lista de todos tus clientes con conversaciones
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
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {searchTerm ? 'No se encontraron clientes' : 'No hay conversaciones activas'}
                    </p>
                  </div>
                ) : (
                  filteredClients.map((client) => (
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
                            <AvatarFallback>
                              {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
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
                  ))
                )}
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
                          <AvatarFallback>
                            {selectedClient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
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
                  
                  {/* Messages Area */}
                  <CardContent className="flex flex-col h-[500px] p-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg mb-2">¡Comienza la conversación!</p>
                            <p className="text-sm">Escribe un mensaje para empezar a chatear con {selectedClient.name}</p>
                          </div>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const isFromCurrentUser = message.sender_id === currentUser?.id;
                          
                          return (
                            <div key={message.id} className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                isFromCurrentUser 
                                  ? 'bg-[#0A1B3D] text-white rounded-br-none' 
                                  : 'bg-white text-gray-800 rounded-bl-none'
                              }`}>
                                <p className="text-sm">{message.message_content}</p>
                                <div className="flex items-center justify-between mt-1">
                                  <span className={`text-xs ${
                                    isFromCurrentUser ? 'text-gray-300' : 'text-gray-500'
                                  }`}>
                                    {new Date(message.created_at).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                  {isFromCurrentUser && (
                                    <span className={`text-xs ${
                                      message.is_read ? 'text-green-300' : 'text-gray-400'
                                    }`}>
                                      {message.is_read ? '✓✓' : '✓'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t bg-white p-4">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder={`Escribe un mensaje a ${selectedClient.name}...`}
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="pr-20 py-3 resize-none border-gray-300 focus:border-[#0A1B3D] focus:ring-[#0A1B3D]"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Paperclip className="h-4 w-4 text-gray-400" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Smile className="h-4 w-4 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-[#0A1B3D] hover:bg-[#0A1B3D]/90 px-4 py-3"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>Presiona Enter para enviar</span>
                        <span>{newMessage.length}/1000</span>
                      </div>
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