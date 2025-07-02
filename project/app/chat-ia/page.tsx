"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Bot,
  MessageSquare,
  Zap,
  Clock,
  Send,
  Paperclip,
  Mic,
  Settings,
  History,
  BookOpen,
  TrendingUp,
  FileText,
  Calculator,
  Calendar
} from 'lucide-react';

type Template = {
  id: number;
  title: string;
  description: string;
  prompt: string;
  category: string;
  icon: any;
};

const ChatIA = () => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Mock data para estadísticas
  const stats = {
    totalQueries: 156,
    avgResponseTime: '1.2s',
    successRate: 98,
    savedTime: '24h'
  };

  // Templates de consultas frecuentes
  const queryTemplates: Template[] = [
    {
      id: 1,
      title: 'Declaración IRPF',
      description: 'Ayuda con la declaración de la renta',
      prompt: '¿Puedes ayudarme con mi declaración de IRPF? Necesito saber qué documentos necesito.',
      category: 'fiscal',
      icon: FileText
    },
    {
      id: 2,
      title: 'Cálculo IVA',
      description: 'Calcular IVA trimestral',
      prompt: 'Necesito calcular el IVA del último trimestre. ¿Qué pasos debo seguir?',
      category: 'contabilidad',
      icon: Calculator
    },
    {
      id: 3,
      title: 'Deducciones',
      description: 'Consultar deducciones aplicables',
      prompt: '¿Qué deducciones puedo aplicar en mi declaración como autónomo?',
      category: 'fiscal',
      icon: TrendingUp
    },
    {
      id: 4,
      title: 'Calendario Fiscal',
      description: 'Próximos vencimientos',
      prompt: '¿Cuáles son los próximos vencimientos fiscales que debo tener en cuenta?',
      category: 'planificacion',
      icon: Calendar
    }
  ];

  // Historial de conversaciones recientes
  const recentChats = [
    {
      id: 1,
      title: 'Consulta sobre deducciones',
      preview: 'Las deducciones por vivienda habitual...',
      timestamp: 'Hace 2 horas',
      category: 'fiscal'
    },
    {
      id: 2,
      title: 'Cálculo de IVA',
      preview: 'Para calcular el IVA trimestral...',
      timestamp: 'Ayer',
      category: 'contabilidad'
    },
    {
      id: 3,
      title: 'Fechas de vencimiento',
      preview: 'Los próximos vencimientos son...',
      timestamp: 'Hace 3 días',
      category: 'planificacion'
    }
  ];

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setMessage(template.prompt);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fiscal': return 'bg-blue-100 text-blue-800';
      case 'contabilidad': return 'bg-green-100 text-green-800';
      case 'planificacion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A1B3D] mb-2 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-[#2FD7B5]" />
            Chat con IA Fiscal
          </h1>
          <p className="text-gray-600">
            Tu asistente inteligente para consultas fiscales y contables
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Consultas Totales
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-[#2FD7B5]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.totalQueries}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +15% este mes
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiempo de Respuesta
              </CardTitle>
              <Zap className="h-4 w-4 text-[#F4D35E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.avgResponseTime}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Promedio actual
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tasa de Éxito
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-[#0A1B3D]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.successRate}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Respuestas útiles
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tiempo Ahorrado
              </CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#0A1B3D]">
                {stats.savedTime}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Templates y Historial */}
          <div className="space-y-6">
            {/* Query Templates */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D] flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Consultas Frecuentes
                </CardTitle>
                <CardDescription>
                  Plantillas para empezar rápidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queryTemplates.map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <div
                        key={template.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                          selectedTemplate?.id === template.id 
                            ? 'border-[#0A1B3D] bg-[#0A1B3D] text-white' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className={`h-5 w-5 mt-0.5 ${
                            selectedTemplate?.id === template.id ? 'text-white' : 'text-[#2FD7B5]'
                          }`} />
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              selectedTemplate?.id === template.id ? 'text-white' : 'text-[#0A1B3D]'
                            }`}>
                              {template.title}
                            </h4>
                            <p className={`text-xs mt-1 ${
                              selectedTemplate?.id === template.id ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              {template.description}
                            </p>
                            <Badge className={`mt-2 text-xs ${
                              selectedTemplate?.id === template.id 
                                ? 'bg-white text-[#0A1B3D]' 
                                : getCategoryColor(template.category)
                            }`}>
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Historial */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0A1B3D] flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Conversaciones Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <h4 className="text-sm font-medium text-[#0A1B3D] mb-1">
                        {chat.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {chat.preview}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getCategoryColor(chat.category)}`}>
                          {chat.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {chat.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Principal */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-[#2FD7B5] rounded-full flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[#0A1B3D] text-lg">
                        Asistente IA Fiscal
                      </CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>En línea y listo para ayudar</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1">
                {/* Chat Messages Area */}
                <div className="h-96 mb-4 p-4 bg-gray-50 rounded-lg overflow-y-auto">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-8 w-8 bg-[#2FD7B5] rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-md">
                      <p className="text-sm text-gray-700">
                        ¡Hola! Soy tu asistente IA especializado en temas fiscales y contables. 
                        ¿En qué puedo ayudarte hoy? Puedes usar las plantillas de consulta o hacerme cualquier pregunta.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Escribe tu consulta fiscal aquí..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-gray-500">
                        {message.length}/1000 caracteres
                      </span>
                    </div>
                    
                    <Button 
                      className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90"
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Consulta
                    </Button>
                  </div>
                  
                  {selectedTemplate && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">
                          Usando plantilla: {selectedTemplate.title}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedTemplate(null);
                            setMessage('');
                          }}
                        >
                          Limpiar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatIA; 