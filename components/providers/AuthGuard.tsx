'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/marketplace',
  '/cart',
  '/orders',
  '/documents',
  '/settings',
  '/chat-ia',
  '/chat-clientes',
  '/notifications',
  '/advisor',
];

// Routes that advisors can access
const ADVISOR_ROUTES = [
  '/advisor',
  '/advisor/dashboard',
  '/advisor/clients',
  '/advisor/tasks',
  '/advisor/calendar',
  '/advisor/documents',
  '/advisor/activity',
];

// Routes that clients can access
const CLIENT_ROUTES = [
  '/dashboard',
  '/marketplace',
  '/cart',
  '/orders',
  '/documents',
  '/chat-ia',
  '/chat-clientes',
];

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, isInitialized, isAdvisor, isClient } = useAuthStore();

  useEffect(() => {
    // Don't redirect if still loading or not initialized
    if (isLoading || !isInitialized) {
      return;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );

    // If it's a protected route and user is not authenticated
    if (isProtectedRoute && !isAuthenticated) {
      router.push('/login');
      return;
    }

    // If user is authenticated, check role-based access
    if (isAuthenticated && user) {
      // Check if advisor is trying to access client routes
      if (isAdvisor() && CLIENT_ROUTES.some(route => pathname.startsWith(route))) {
        router.push('/advisor');
        return;
      }

      // Check if client is trying to access advisor routes
      if (isClient() && ADVISOR_ROUTES.some(route => pathname.startsWith(route))) {
        router.push('/dashboard');
        return;
      }

      // Redirect to appropriate dashboard based on role
      if (pathname === '/') {
        if (isAdvisor()) {
          router.push('/advisor');
        } else {
          router.push('/dashboard');
        }
        return;
      }
    }
  }, [pathname, isAuthenticated, isLoading, isInitialized, user, isAdvisor, isClient, router]);

  // Show loading state while initializing
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}