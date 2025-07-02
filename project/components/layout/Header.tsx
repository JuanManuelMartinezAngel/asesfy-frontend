'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import SearchDialog from '@/components/ui/SearchDialog';
import {
  Calculator,
  ShoppingCart,
  User,
  Menu,
  Bell,
  LogOut,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import ChatComponent from '@/components/ui/ChatComponent';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const { user, isAuthenticated, signOut, isAdvisor, isClient } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { subscription, loadSubscription } = useSubscriptionStore();
  const totalItems = getTotalItems();

  const isPublicRoute = ['/', '/login', '/onboarding', '/pricing', '/blog', '/checkout-success', '/forgot-password'].includes(pathname) || pathname.startsWith('/blog/');

  useEffect(() => {
    if (isAuthenticated && isClient()) {
      loadSubscription();
    }
  }, [isAuthenticated, isClient, loadSubscription]);

  const getPlanName = (priceId: string) => {
    switch (priceId) {
      case 'price_1RUUfMJHfrNln9fJu0LG0ppp':
        return 'Pro';
      case 'price_1RUUeiJHfrNln9fJCJGuIdl9':
        return 'Starter';
      default:
        return 'Premium';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-[#0A1B3D]" />
            <span className="text-2xl font-bold text-[#0A1B3D]">Asesfy</span>
          </Link>

          {/* Navigation and Actions - Combined */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            {isPublicRoute ? (
              <>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-[#0A1B3D] transition-colors"
                >
                  Precios
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-[#0A1B3D] transition-colors"
                >
                  Blog
                </Link>
              </>
            ) : (
              <>
                {isAdvisor() ? (
                  // Advisor Navigation
                  <>
                    <Link
                      href="/advisor"
                      className={`transition-colors ${
                        pathname === '/advisor'
                          ? 'text-[#0A1B3D] font-medium'
                          : 'text-gray-600 hover:text-[#0A1B3D]'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4" />
                        <span>Panel Asesor</span>
                      </div>
                    </Link>
                    <Link
                      href="/advisor/clients"
                      className={`transition-colors ${
                        pathname === '/advisor/clients'
                          ? 'text-[#0A1B3D] font-medium'
                          : 'text-gray-600 hover:text-[#0A1B3D]'
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Clientes</span>
                      </div>
                    </Link>
                    <Link
                      href="/advisor/tasks"
                      className={`transition-colors ${
                        pathname === '/advisor/tasks'
                          ? 'text-[#0A1B3D] font-medium'
                          : 'text-gray-600 hover:text-[#0A1B3D]'
                      }`}
                    >
                      Tareas
                    </Link>
                  </>
                ) : (
                  // Client Navigation
                  <>
                    <Link
                      href="/dashboard"
                      className={`transition-colors ${
                        pathname === '/dashboard'
                          ? 'text-[#0A1B3D] font-medium'
                          : 'text-gray-600 hover:text-[#0A1B3D]'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/marketplace"
                      className={`transition-colors ${
                        pathname === '/marketplace'
                          ? 'text-[#0A1B3D] font-medium'
                          : 'text-gray-600 hover:text-[#0A1B3D]'
                      }`}
                    >
                      Servicios
                    </Link>
                  </>
                )}
                <Link
                  href="/chat-ia"
                  className={`transition-colors ${
                    pathname === '/chat-ia'
                      ? 'text-[#0A1B3D] font-medium'
                      : 'text-gray-600 hover:text-[#0A1B3D]'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat con IA</span>
                  </div>
                </Link>
                <Link
                  href="/chat-clientes"
                  className={`transition-colors ${
                    pathname === '/chat-clientes'
                      ? 'text-[#0A1B3D] font-medium'
                      : 'text-gray-600 hover:text-[#0A1B3D]'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat con Clientes</span>
                  </div>
                </Link>
              </>
            )}

            {/* Search - Only for authenticated users */}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hidden md:flex"
              >
                <Search className="h-5 w-5" />
                <span className="ml-2">Buscar</span>
              </Button>
            )}

            {/* User Actions */}
            {isAuthenticated ? (
              <>
                {/* Search for mobile */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="md:hidden"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Cart - Only for clients */}
                {isClient() && (
                  <Link href="/cart" className="relative">
                    <Button variant="ghost" size="sm">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}

                {/* Notifications */}
                <Link href="/notifications">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                      <span className="ml-2 hidden md:inline">
                        {user?.full_name || user?.email}
                      </span>
                      {isAdvisor() ? (
                        <Badge className="ml-2 bg-[#2FD7B5] text-white text-xs">
                          Asesor
                        </Badge>
                      ) : subscription?.subscription_status === 'active' && subscription?.price_id ? (
                        <Badge className="ml-2 bg-[#F4D35E] text-[#0A1B3D] text-xs">
                          {getPlanName(subscription.price_id)}
                        </Badge>
                      ) : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    {isClient() && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/orders">Mis Pedidos</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/documents">Documentos</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {isAdvisor() && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/advisor/calendar">Calendario</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/advisor/reports">Informes</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link href="/onboarding">
                  <Button className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                    Empezar ahora
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Search Dialog */}
      <SearchDialog open={showSearch} onOpenChange={setShowSearch} />
    </header>
  );
}