import { supabase, isSupabaseConfigured } from './supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'client' | 'advisor' | 'admin';
  advisor_id?: string; // For clients assigned to an advisor
}

export const auth = {
  async signUp(email: string, password: string, fullName?: string, role: 'client' | 'advisor' = 'client') {
    if (!isSupabaseConfigured()) {
      // Mock successful signup for development
      return {
        data: { user: { id: 'mock-user', email, user_metadata: { full_name: fullName, role } } },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Mock successful signin for development with role detection
      let role: 'client' | 'advisor' | 'admin' = 'client';
      
      // Demo credentials for advisor
      if (email === 'asesor@asesfy.com' || email.includes('asesor') || email.includes('advisor')) {
        role = 'advisor';
      }
      
      return {
        data: { 
          user: { 
            id: 'mock-user', 
            email,
            user_metadata: { 
              full_name: role === 'advisor' ? 'María García Rodríguez' : 'Usuario Demo',
              role: role
            }
          },
          session: { access_token: 'mock-token' }
        },
        error: null
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  },

  async signOut() {
    if (!isSupabaseConfigured()) {
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUser() {
    if (!isSupabaseConfigured()) {
      return { user: null, error: null };
    }

    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured()) {
      return { data: {}, error: null };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    
    return { data, error };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    if (!isSupabaseConfigured()) {
      // Mock auth state change
      setTimeout(() => callback(null), 100);
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        full_name: session.user.user_metadata?.full_name,
        avatar_url: session.user.user_metadata?.avatar_url,
        role: session.user.user_metadata?.role || 'client',
        advisor_id: session.user.user_metadata?.advisor_id,
      } : null;
      
      callback(user);
    });
  },
};