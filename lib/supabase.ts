import { createClient, SupabaseClient } from '@supabase/supabase-js'

// More robust build-time detection
const isBuildTime = typeof window === 'undefined' && (
  process.env.NODE_ENV === 'production' || 
  process.env.NEXT_PHASE === 'phase-production-build' ||
  !process.env.VERCEL_URL
)

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function that returns the Supabase client or a mock
function createSupabaseClient(): SupabaseClient {
  // If we're in build time or don't have proper env vars, create a mock client
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl.includes('placeholder') || 
      supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not properly configured, using mock client')
    return createMockClient() as any
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client, using mock:', error)
    return createMockClient() as any
  }
}

// Mock client that mimics Supabase interface
function createMockClient() {
  const mockResponse = { data: null, error: null }
  
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    upsert: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    single: () => Promise.resolve(mockResponse),
    then: () => Promise.resolve(mockResponse)
  }

  return {
    auth: {
      signUp: async () => mockResponse,
      signInWithPassword: async () => mockResponse,
      signOut: async () => mockResponse,
      getUser: async () => mockResponse,
      getSession: async () => mockResponse,
      onAuthStateChange: () => ({ 
        data: { subscription: { unsubscribe: () => {} } } 
      }),
      resetPasswordForEmail: async () => mockResponse,
    },
    from: () => mockQueryBuilder,
    storage: {
      from: () => ({
        upload: async () => mockResponse,
        download: async () => mockResponse,
        remove: async () => mockResponse,
        list: async () => mockResponse,
      })
    },
    rpc: async () => mockResponse,
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {}
    })
  }
}

// Create and export the client
const supabase = createSupabaseClient()

export default supabase

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl !== 'https://placeholder.supabase.co'
  )
}