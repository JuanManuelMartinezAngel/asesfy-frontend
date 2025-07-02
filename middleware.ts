import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

    // Get user role from cookie (in production this would be from JWT or session)
    const userRole = req.cookies.get('user-role')?.value || 'client';

    // If user is on an auth route and already authenticated, redirect based on role
    if (isAuthenticated && authRoutes.includes(pathname)) {
      if (userRole === 'advisor') {
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

    // If user is trying to access advisor routes but is not an advisor
    if (isAuthenticated && advisorRoutes.some(route => pathname.startsWith(route)) && userRole !== 'advisor') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
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