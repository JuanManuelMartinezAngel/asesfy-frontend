import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ Correos de asesores autorizados
const AUTHORIZED_ADVISOR_EMAILS = [
  'asesor1@demo.com',
  'asesor2@demo.com',
  'asesor3@demo.com',
  'asesor4@demo.com',
  'asesor5@demo.com'
];

// ✅ Función para validar si un correo es de asesor
const isAdvisorEmail = (email: string): boolean => {
  // Verificar si está en la lista de autorizados
  if (AUTHORIZED_ADVISOR_EMAILS.includes(email.toLowerCase())) {
    return true;
  }
  
  // Verificar si sigue el patrón asesor[número]@demo.com
  const advisorPattern = /^asesor\d+@demo\.com$/i;
  return advisorPattern.test(email);
};

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/marketplace',
  '/cart',
  '/chat',
  '/advisor',
  '/documents',
  '/invoices',
  '/notifications',
  '/settings',
  '/orders',
];

// Routes that should redirect to dashboard if user is authenticated
const authRoutes = ['/login', '/onboarding', '/forgot-password'];

// Routes that require advisor role
const advisorRoutes = [
  '/advisor',
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  try {
    // For development, we'll check for a simple session cookie
    const authCookie = req.cookies.get('auth-session');
    const isAuthenticated = !!authCookie;

    // Get user role and email from cookies
    const userRole = req.cookies.get('user-role')?.value || 'client';
    const userEmail = req.cookies.get('user-email')?.value || '';

    // ✅ Validar acceso a rutas de asesor con sistema de correos autorizados
    if (isAuthenticated && advisorRoutes.some(route => pathname.startsWith(route))) {
      // Verificar si el usuario es realmente un asesor autorizado
      if (userRole === 'advisor' && !isAdvisorEmail(userEmail)) {
        console.warn(`Unauthorized advisor access attempt: ${userEmail}`);
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      // Si el rol es cliente pero el email es de asesor, redirigir al dashboard
      if (userRole !== 'advisor') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // If user is on an auth route and already authenticated, redirect based on role
    if (isAuthenticated && authRoutes.includes(pathname)) {
      if (userRole === 'advisor' && isAdvisorEmail(userEmail)) {
        return NextResponse.redirect(new URL('/advisor', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // If user is not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    // If there's an error, allow access for development
    console.warn('Middleware auth check failed:', error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};