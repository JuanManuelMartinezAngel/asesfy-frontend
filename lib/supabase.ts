import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// Create Supabase client - this will work even with placeholder values
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// Mock client for when Supabase is not configured
const createMockClient = () => {
  // Helper to create chainable mock operations
  const createChainableMock = () => ({
    eq: () => createChainableMock(),
    neq: () => createChainableMock(),
    gt: () => createChainableMock(),
    lt: () => createChainableMock(),
    gte: () => createChainableMock(),
    lte: () => createChainableMock(),
    like: () => createChainableMock(),
    ilike: () => createChainableMock(),
    is: () => createChainableMock(),
    in: () => createChainableMock(),
    contains: () => createChainableMock(),
    containedBy: () => createChainableMock(),
    rangeGt: () => createChainableMock(),
    rangeLt: () => createChainableMock(),
    rangeGte: () => createChainableMock(),
    rangeLte: () => createChainableMock(),
    rangeAdjacent: () => createChainableMock(),
    overlaps: () => createChainableMock(),
    textSearch: () => createChainableMock(),
    match: () => createChainableMock(),
    not: () => createChainableMock(),
    or: () => createChainableMock(),
    filter: () => createChainableMock(),
    limit: () => createChainableMock(),
    range: () => createChainableMock(),
    order: () => createChainableMock(),
    then: async () => ({ data: [], error: null }),
    // Make it promise-like
    data: [],
    error: null
  })

  return {
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
      select: (columns?: string) => createChainableMock(),
      insert: (data: any) => createChainableMock(),
      update: (data: any) => createChainableMock(),
      delete: () => createChainableMock(),
      upsert: (data: any) => createChainableMock(),
    }),
  }
}

// Export the appropriate client based on configuration
const supabase = isSupabaseConfigured() ? supabaseClient : createMockClient()

// Named export for compatibility
export { supabase }

// Default export
export default supabase