import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, auth } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role?: 'client' | 'advisor') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  initialize: () => void;
  loginDemo: (role: 'client' | 'advisor') => Promise<{ success: boolean }>;
  isAdvisor: () => boolean;
  isClient: () => boolean;
}

interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  role?: 'client' | 'advisor';
  advisor_id?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await auth.signIn(email, password);
          
          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user) {
            const meta = data.user.user_metadata as UserMetadata;
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              full_name: meta.full_name || 'Usuario Demo',
              avatar_url: meta.avatar_url || '',
              role: meta.role || 'client',
              advisor_id: meta.advisor_id || '',
            };
            
            set({ user, isAuthenticated: true });
            
            // Set auth cookie for middleware
            if (typeof window !== 'undefined') {
              document.cookie = 'auth-session=true; path=/';
              document.cookie = `user-role=${user.role}; path=/`;
            }
            
            return { success: true };
          }

          return { success: false, error: 'Login failed' };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      signUp: async (email: string, password: string, fullName: string, role: 'client' | 'advisor' = 'client') => {
        try {
          const { data, error } = await auth.signUp(email, password, fullName, role);
          
          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      signOut: async () => {
        await auth.signOut();
        set({ user: null, isAuthenticated: false });
        
        // Remove auth cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      },

      loginDemo: async (role: 'client' | 'advisor') => {
        const email = role === 'advisor' ? 'asesor@asesfy.com' : 'demo@asesfy.com';
        const password = role === 'advisor' ? 'asesor123456' : 'demo123456';
        
        const result = await get().signIn(email, password);
        return { success: result.success };
      },

      initialize: () => {
        // Check if we have persisted auth state
        const { user, isAuthenticated } = get();
        
        if (user && isAuthenticated) {
          // Set auth cookie if we have persisted state
          if (typeof window !== 'undefined') {
            document.cookie = `auth-session=true; path=/`;
            document.cookie = `user-role=${user.role}; path=/`;
          }
          set({ isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        
        // Check for existing session only if no persisted state
        const checkSession = async () => {
          try {
            const { user } = await auth.getUser();
            const authUser = user ? (() => {
              const meta = user.user_metadata as UserMetadata;
              return {
                id: user.id,
                email: user.email!,
                full_name: meta.full_name || 'Usuario Demo',
                avatar_url: meta.avatar_url || '',
                role: meta.role || 'client',
                advisor_id: meta.advisor_id || '',
              };
            })() : null;
            
            set({ 
              user: authUser, 
              isAuthenticated: !!authUser, 
              isLoading: false 
            });
            
            if (authUser && typeof window !== 'undefined') {
              document.cookie = `auth-session=true; path=/`;
              document.cookie = `user-role=${authUser.role}; path=/`;
            }
          } catch (error) {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        };

        checkSession();

        // Set up auth state listener
        const { data: { subscription } } = auth.onAuthStateChange((authUser) => {
          const user = authUser && 'user_metadata' in authUser ? (() => {
            const meta = (authUser as { user_metadata: UserMetadata }).user_metadata;
            return {
              id: authUser.id,
              email: authUser.email!,
              full_name: meta.full_name || 'Usuario Demo',
              avatar_url: meta.avatar_url || '',
              role: meta.role || 'client',
              advisor_id: meta.advisor_id || '',
            };
          })() : null;
          
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          });
          
          if (user && typeof window !== 'undefined') {
            document.cookie = `auth-session=true; path=/`;
            document.cookie = `user-role=${user.role}; path=/`;
          }
        });

        return () => {
          subscription?.unsubscribe();
        };
      },

      isAdvisor: () => {
        const { user } = get();
        return user?.role === 'advisor';
      },

      isClient: () => {
        const { user } = get();
        return user?.role === 'client';
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
