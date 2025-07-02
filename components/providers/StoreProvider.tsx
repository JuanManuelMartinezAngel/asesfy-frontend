'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useServicesStore } from '@/store/useServicesStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore(state => state.initialize);
  const loadServices = useServicesStore(state => state.loadServices);

  useEffect(() => {
    // Initialize auth store
    initializeAuth();
    
    // Load services
    loadServices();
    
    // Environment check
    if (typeof window !== 'undefined') {
      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
      ];

      const missingVars = requiredEnvVars.filter(
        varName => !process.env[varName]
      );

      if (missingVars.length > 0) {
        console.warn(
          'Missing environment variables:',
          missingVars.join(', '),
          '\nUsing mock data for development.'
        );
      }
    }
  }, [initializeAuth, loadServices]);

  return <>{children}</>;
}