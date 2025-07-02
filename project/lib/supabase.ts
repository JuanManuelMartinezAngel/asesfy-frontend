import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase - usando credenciales reales
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjnuiedpoulujfqzsdmx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqbnVpZWRwb3VsdWpmcXpzZG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMTY5NzEsImV4cCI6MjA2Njg5Mjk3MX0.IAgwme4KnIHwkUSFBRMGAhLCmK0dgCxjiTaDh4liX4w';

// Mock client for development when Supabase is not configured
const createMockClient = () => ({
  auth: {
    signUp: async (credentials: any) => ({ 
      data: { user: { id: 'mock-user', email: credentials.email } }, 
      error: null 
    }),
    signInWithPassword: async (credentials: any) => ({ 
      data: { 
        user: { 
          id: 'mock-user', 
          email: credentials.email,
          user_metadata: { full_name: 'Usuario Demo' }
        },
        session: { access_token: 'mock-token' }
      }, 
      error: null 
    }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ 
      data: { user: null }, 
      error: null 
    }),
    getSession: async () => ({
      data: { session: null },
      error: null
    }),
    onAuthStateChange: (callback: any) => {
      // Simulate auth state change
      setTimeout(() => callback('SIGNED_OUT', null), 100);
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    },
    resetPasswordForEmail: async () => ({ data: {}, error: null }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({ data: [], error: null }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ data: null, error: null })
    }),
    upsert: (data: any) => ({ data: null, error: null }),
  }),
});

// Crear cliente de Supabase real
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return true; // Ahora siempre está configurado
};