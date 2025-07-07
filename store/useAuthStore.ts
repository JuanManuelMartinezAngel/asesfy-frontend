import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, auth } from '@/lib/auth';
import { isAdvisorEmail, determineRoleFromEmail, handleUserOnboarding } from '@/lib/advisor-utils';

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
            
            // ✅ Determinar rol basado en el email
            const determinedRole = determineRoleFromEmail(data.user.email!);
            
            // ✅ Validar que el usuario tenga permisos de asesor si intenta acceder como tal
            if (meta.role === 'advisor' && !isAdvisorEmail(data.user.email!)) {
              return { success: false, error: 'No tienes permisos de asesor. Contacta con el administrador.' };
            }
            
            const user: User = {
              id: data.user.id,
              email: data.user.email!,
              full_name: meta.full_name || 'Usuario Demo',
              avatar_url: meta.avatar_url || '',
              role: determinedRole, // Usar el rol determinado por el email
              advisor_id: meta.advisor_id || '',
            };
            
            set({ user, isAuthenticated: true });
            
            // ✅ Set auth cookies for middleware including email
            if (typeof window !== 'undefined') {
              document.cookie = 'auth-session=true; path=/';
              document.cookie = `user-role=${user.role}; path=/`;
              document.cookie = `user-email=${user.email}; path=/`;
            }
            
            return { success: true };
          }

          return { success: false, error: 'Login failed' };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      signUp: async (email: string, password: string, fullName: string, role?: 'client' | 'advisor') => {
        try {
          // ✅ Determinar rol automáticamente basado en el email
          const determinedRole = determineRoleFromEmail(email);
          
          // ✅ Si se especifica un rol de asesor, validar que el email esté autorizado
          if (role === 'advisor' && !isAdvisorEmail(email)) {
            return { success: false, error: 'Este correo no está autorizado para ser asesor.' };
          }
          
          const { data, error } = await auth.signUp(email, password, fullName, determinedRole);
          
          if (error) {
            return { success: false, error: error.message };
          }

          // ✅ Manejar onboarding automático si el registro es exitoso
          if (data.user) {
            try {
              await handleUserOnboarding(data.user.id, email, fullName);
            } catch (onboardingError) {
              console.error('Error in user onboarding:', onboardingError);
              // No fallar el registro por errores de onboarding
            }
          }

          return { success: true };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      signOut: async () => {
        await auth.signOut();
        set({ user: null, isAuthenticated: false });
        
        // ✅ Remove all auth cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user-email=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
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
          // ✅ Set auth cookies if we have persisted state
          if (typeof window !== 'undefined') {
            document.cookie = `auth-session=true; path=/`;
            document.cookie = `user-role=${user.role}; path=/`;
            document.cookie = `user-email=${user.email}; path=/`;
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
              // ✅ Determinar rol basado en el email
              const determinedRole = determineRoleFromEmail(user.email!);
              
              return {
                id: user.id,
                email: user.email!,
                full_name: meta.full_name || 'Usuario Demo',
                avatar_url: meta.avatar_url || '',
                role: determinedRole, // Usar el rol determinado por el email
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
              document.cookie = `user-email=${authUser.email}; path=/`;
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
            // ✅ Determinar rol basado en el email
            const determinedRole = determineRoleFromEmail(authUser.email!);
            
            return {
              id: authUser.id,
              email: authUser.email!,
              full_name: meta.full_name || 'Usuario Demo',
              avatar_url: meta.avatar_url || '',
              role: determinedRole, // Usar el rol determinado por el email
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
            document.cookie = `user-email=${user.email}; path=/`;
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
