'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthInitializer() {
  const { initialize, isLoading } = useAuthStore();
  
  useEffect(() => {
    // Initialize auth on app start
    const cleanup = initialize() as unknown;
    
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
  
  // If still loading auth state, don't render anything
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2FD7B5] mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }
  
  return null;
} 