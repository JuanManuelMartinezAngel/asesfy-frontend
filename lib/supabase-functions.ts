// Helper para llamadas a Edge Functions de Supabase
import { supabase } from './supabase';

// URLs base para las Edge Functions
const getEdgeFunctionUrl = (functionName: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Helper genérico para llamadas a Edge Functions
export const callEdgeFunction = async (
  functionName: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    params?: Record<string, string>;
  } = {}
) => {
  const { method = 'POST', body, params } = options;
  
  // Construir URL con parámetros si es GET
  let url = getEdgeFunctionUrl(functionName);
  if (method === 'GET' && params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Logging detallado para diagnóstico
  console.log(`🔄 [Edge Function] Llamando a ${functionName}:`, {
    url,
    method,
    hasBody: !!body,
    bodyPreview: body ? JSON.stringify(body).substring(0, 200) + '...' : null,
    params
  });

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Añadir token de autorización si existe
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
      console.log(`🔐 [Edge Function] Token de autorización añadido`);
    } else {
      console.log(`⚠️ [Edge Function] Sin token de autorización`);
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log(`📡 [Edge Function] Respuesta de ${functionName}:`, {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Edge Function] Error ${response.status}:`, errorText);
      
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: errorText, rawResponse: errorText };
      }
      
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ [Edge Function] ${functionName} exitoso:`, result);
    return result;
  } catch (error) {
    console.error(`💥 [Edge Function] ${functionName} error completo:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : null,
      url,
      method,
      functionName
    });
    throw error;
  }
};

// Funciones específicas para cada Edge Function

/**
 * Llamar a la función de ChatGPT
 */
export const callChatGPT = async (messages: any[]) => {
  return callEdgeFunction('chatgpt', {
    method: 'POST',
    body: { messages }
  });
};

/**
 * Obtener elementos del carrito
 */
export const getCartItems = async (userId?: string, sessionId?: string) => {
  return callEdgeFunction('cart', {
    method: 'GET',
    params: { 
      ...(userId && { userId }),
      ...(sessionId && { sessionId })
    }
  });
};

/**
 * Guardar elementos del carrito
 */
export const saveCartItems = async (items: any[], userId?: string, sessionId?: string) => {
  return callEdgeFunction('cart', {
    method: 'POST',
    body: { items, userId, sessionId }
  });
};

/**
 * Eliminar elemento del carrito
 */
export const deleteCartItem = async (itemId: string, userId?: string, sessionId?: string) => {
  return callEdgeFunction('cart', {
    method: 'DELETE',
    params: { 
      itemId,
      ...(userId && { userId }),
      ...(sessionId && { sessionId })
    }
  });
};

/**
 * Crear perfil de asesor
 */
export const createAdvisorProfile = async (data: {
  fullName: string;
  nif: string;
  phone: string;
}) => {
  return callEdgeFunction('advisor-onboarding', {
    method: 'POST',
    body: data
  });
};

// Configuración de fallback para desarrollo local
export const isEdgeFunctionsAvailable = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL;
};

// Función para verificar el estado de las Edge Functions
export const checkEdgeFunctionsHealth = async () => {
  if (!isEdgeFunctionsAvailable()) {
    return { available: false, reason: 'Supabase URL not configured' };
  }

  try {
    // Intentar una llamada simple para verificar conectividad
    await callEdgeFunction('chatgpt', {
      method: 'POST',
      body: { messages: [{ role: 'user', content: 'test' }] }
    });
    return { available: true };
  } catch (error) {
    return { 
      available: false, 
      reason: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};