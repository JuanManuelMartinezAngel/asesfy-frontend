"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { callChatGPT, checkEdgeFunctionsHealth, callEdgeFunction } from '@/lib/supabase-functions';
import { supabase } from '@/lib/supabase';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'loading' | 'warning';
  message: string;
  details?: any;
}

export default function DiagnosticPanel() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);
    
    const results: DiagnosticResult[] = [];

    // 1. Verificar variables de entorno
    const checkEnvVars = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return {
          name: 'Variables de Entorno',
          status: 'error' as const,
          message: 'Variables de entorno no configuradas',
          details: { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey }
        };
      }
      
      return {
        name: 'Variables de Entorno',
        status: 'success' as const,
        message: 'Variables configuradas correctamente',
        details: { supabaseUrl, supabaseKey: supabaseKey.substring(0, 20) + '...' }
      };
    };

    results.push(checkEnvVars());
    setDiagnostics([...results]);

    // 2. Verificar conexión a Supabase
    try {
      const { data, error } = await supabase.auth.getSession();
      results.push({
        name: 'Conexión Supabase',
        status: 'success',
        message: 'Conectado a Supabase exitosamente',
        details: { hasSession: !!data.session }
      });
    } catch (error) {
      results.push({
        name: 'Conexión Supabase',
        status: 'error',
        message: 'Error al conectar con Supabase',
        details: error
      });
    }
    setDiagnostics([...results]);

    // 3. Verificar Edge Function ChatGPT
    try {
      const testMessages = [
        { role: 'user', content: 'Hola, esto es una prueba de diagnóstico' }
      ];
      
      const response = await callChatGPT(testMessages);
      results.push({
        name: 'Edge Function ChatGPT',
        status: 'success',
        message: 'Edge Function respondió correctamente',
        details: { response: response.message?.substring(0, 100) + '...' }
      });
    } catch (error) {
      results.push({
        name: 'Edge Function ChatGPT',
        status: 'error',
        message: 'Error al conectar con Edge Function',
        details: error
      });
    }
    setDiagnostics([...results]);

    // 4. Verificar Edge Function Cart
    try {
      const cartResponse = await callEdgeFunction('cart', {
        method: 'GET',
        params: { sessionId: 'diagnostic-test' }
      });
      
      results.push({
        name: 'Edge Function Cart',
        status: 'success',
        message: 'Edge Function Cart funciona correctamente',
        details: cartResponse
      });
    } catch (error) {
      results.push({
        name: 'Edge Function Cart',
        status: 'error',
        message: 'Error en Edge Function Cart',
        details: error
      });
    }
    setDiagnostics([...results]);

    // 5. Verificar Edge Function Advisor
    try {
      const advisorResponse = await callEdgeFunction('advisor-onboarding', {
        method: 'POST',
        body: {
          fullName: 'Test User',
          nif: '12345678Z',
          phone: '600000000'
        }
      });
      
      results.push({
        name: 'Edge Function Advisor',
        status: 'success',
        message: 'Edge Function Advisor responde correctamente',
        details: advisorResponse
      });
    } catch (error) {
      results.push({
        name: 'Edge Function Advisor',
        status: 'error',
        message: 'Error en Edge Function Advisor',
        details: error
      });
    }
    setDiagnostics([...results]);

    // 6. Verificar salud general
    try {
      const healthCheck = await checkEdgeFunctionsHealth();
      results.push({
        name: 'Salud General',
        status: healthCheck.available ? 'success' : 'error',
        message: healthCheck.available ? 'Todas las funciones están disponibles' : 'Algunas funciones no están disponibles',
        details: healthCheck
      });
    } catch (error) {
      results.push({
        name: 'Salud General',
        status: 'error',
        message: 'Error en verificación de salud',
        details: error
      });
    }
    setDiagnostics([...results]);

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'loading':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const successCount = diagnostics.filter(d => d.status === 'success').length;
  const errorCount = diagnostics.filter(d => d.status === 'error').length;
  const totalCount = diagnostics.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-[#0A1B3D]">
                Diagnóstico de Edge Functions
              </CardTitle>
              <CardDescription>
                Verificación del estado de las APIs migradas a Supabase
              </CardDescription>
            </div>
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="bg-[#0A1B3D] hover:bg-[#0A1B3D]/90"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isRunning ? 'Ejecutando...' : 'Ejecutar Diagnóstico'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Resumen */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-green-700">Exitosos</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-red-700">Errores</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            {diagnostics.map((result, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#0A1B3D]">{result.name}</h3>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                        Ver detalles
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>

          {diagnostics.length === 0 && !isRunning && (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p>No se han ejecutado diagnósticos aún</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}