import { create } from 'zustand';
import { User, auth } from '@/lib/auth';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role?: 'client' | 'advisor') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => () => void; // Returns cleanup function
  loginDemo: (role: 'client' | 'advisor') => Promise<{ success: boolean }>;
  isAdvisor: () => boolean;
  isClient: () => boolean;
  refreshUser: () => Promise<void>;
}

interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  role?: 'client' | 'advisor';
  advisor_id?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      // onAuthStateChange will handle the state update
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  signUp: async (email: string, password: string, fullName: string, role: 'client' | 'advisor' = 'client') => {
    try {
      set({ isLoading: true });
      const { data, error } = await auth.signUp(email, password, fullName, role);
      
      set({ isLoading: false });
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      
      // Clear Supabase session
      await auth.signOut();
      
      // Clear local state immediately
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });

      // Clear any remaining cookies
      if (typeof window !== 'undefined') {
        document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        
        // Force reload to clear any cached state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Force clear state even if there's an error
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
      
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  },

  refreshUser: async () => {
    try {
      const { user: supabaseUser } = await auth.getUser();
      
      if (supabaseUser) {
        const meta = supabaseUser.user_metadata as UserMetadata;
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          full_name: meta.full_name || 'Usuario Demo',
          avatar_url: meta.avatar_url || '',
          role: meta.role || 'client',
          advisor_id: meta.advisor_id || '',
        };
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    }
  },

  initialize: () => {
    // If already initialized, return empty cleanup
    if (get().isInitialized) {
      return () => {};
    }

    set({ isLoading: true, isInitialized: true });

    // Set up auth state listener as the single source of truth
    const { data: { subscription } } = auth.onAuthStateChange((authUser: User | null) => {
      if (authUser) {
        // authUser is already our custom User type from the auth callback
        set({ 
          user: authUser, 
          isAuthenticated: true, 
          isLoading: false 
        });

        // Set auth cookies for middleware
        if (typeof window !== 'undefined') {
          document.cookie = `auth-session=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
          document.cookie = `user-role=${authUser.role}; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });

        // Clear auth cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      }
    });

    // Check initial session
    get().refreshUser();

    // Return cleanup function
    return () => {
      subscription?.unsubscribe();
      set({ isInitialized: false });
    };
  },

  loginDemo: async (role: 'client' | 'advisor') => {
    const email = role === 'advisor' ? 'asesor@asesfy.com' : 'demo@asesfy.com';
    const password = role === 'advisor' ? 'asesor123456' : 'demo123456';
    
    const result = await get().signIn(email, password);
    return { success: result.success };
  },

  isAdvisor: () => {
    const { user } = get();
    return user?.role === 'advisor';
  },

  isClient: () => {
    const { user } = get();
    return user?.role === 'client';
  },
}));
