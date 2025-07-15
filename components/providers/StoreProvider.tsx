'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useServicesStore } from '@/store/useServicesStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore(state => state.initialize);
  const fetchServices = useServicesStore(state => state.fetchServices);

  useEffect(() => {
    // Initialize auth store and get cleanup function
    const cleanup = initialize();
    
    // Load services
    fetchServices();
    
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
          missingVars.join(', ') +
          '\nUsing mock data for development.'
        );
      }
    }

    // Return cleanup function
    return cleanup;
  }, []); // Empty dependency array - initialize only once

  return <>{children}</>;
}