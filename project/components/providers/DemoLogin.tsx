'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export default function DemoLogin() {
  const { isAuthenticated, loginDemo, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  
  const isPublicRoute = ['/', '/login', '/onboarding', '/pricing', '/blog', '/about', '/privacy', '/terms', '/cookies'].includes(pathname) || pathname.startsWith('/blog/');
  
  useEffect(() => {
    // Only auto-login if not on a public route and not already authenticated
    if (!isAuthenticated && !isLoading && !isPublicRoute) {
      const autoLogin = async () => {
        try {
          await loginDemo('client');
          // Don't redirect, stay on current page
        } catch (error) {
          console.error('Auto-login failed:', error);
          // Redirect to login if auto-login fails
          router.push('/login');
        }
      };
      
      autoLogin();
    }
  }, [isAuthenticated, isLoading, isPublicRoute, loginDemo, router]);
  
  return null;
} 