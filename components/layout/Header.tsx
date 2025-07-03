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
  X,
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
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
    router.push('/');
  };

  const NavigationLinks = ({ isMobile = false }) => {
    const baseClasses = isMobile 
      ? "block py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
      : "text-gray-600 hover:text-[#0A1B3D] transition-colors hidden lg:block";
    
    const activeClasses = isMobile
      ? "text-[#0A1B3D] font-medium bg-[#2FD7B5]/10"
      : "text-[#0A1B3D] font-medium";

    if (isPublicRoute) {
      return (
        <>
          <Link
            href="/pricing"
            className={`${baseClasses} ${pathname === '/pricing' ? activeClasses : ''}`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Precios
          </Link>
          <Link
            href="/blog"
            className={`${baseClasses} ${pathname === '/blog' ? activeClasses : ''}`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Blog
          </Link>
        </>
      );
    }

    if (isAdvisor()) {
      return (
        <>
          <Link
            href="/advisor"
            className={`${baseClasses} ${pathname === '/advisor' ? activeClasses : ''}`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Panel Asesor</span>
            </div>
          </Link>
          <Link
            href="/advisor/clients"
            className={`${baseClasses} ${pathname === '/advisor/clients' ? activeClasses : ''}`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clientes</span>
            </div>
          </Link>
          <Link
            href="/advisor/tasks"
            className={`${baseClasses} ${pathname === '/advisor/tasks' ? activeClasses : ''}`}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            Tareas
          </Link>
        </>
      );
    }

    // Client Navigation
    return (
      <>
        <Link
          href="/dashboard"
          className={`${baseClasses} ${pathname === '/dashboard' ? activeClasses : ''}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          href="/marketplace"
          className={`${baseClasses} ${pathname === '/marketplace' ? activeClasses : ''}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          Servicios
        </Link>
      </>
    );
  };

  const ChatLinks = ({ isMobile = false }) => {
    const baseClasses = isMobile 
      ? "block py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
      : "text-gray-600 hover:text-[#0A1B3D] transition-colors hidden lg:block";
    
    const activeClasses = isMobile
      ? "text-[#0A1B3D] font-medium bg-[#2FD7B5]/10"
      : "text-[#0A1B3D] font-medium";

    if (isPublicRoute) return null;

    return (
      <>
        <Link
          href="/chat-ia"
          className={`${baseClasses} ${pathname === '/chat-ia' ? activeClasses : ''}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat con IA</span>
          </div>
        </Link>
        <Link
          href="/chat-clientes"
          className={`${baseClasses} ${pathname === '/chat-clientes' ? activeClasses : ''}`}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat con Clientes</span>
          </div>
        </Link>
      </>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Calculator className="h-7 w-7 sm:h-8 sm:w-8 text-[#0A1B3D]" />
            <span className="text-xl sm:text-2xl font-bold text-[#0A1B3D]">Asesfy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <NavigationLinks />
            <ChatLinks />
            
            {/* Search - Desktop */}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hidden xl:flex"
              >
                <Search className="h-5 w-5" />
                <span className="ml-2">Buscar</span>
              </Button>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Search Button - Tablet/Mobile */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSearch(true)}
                  className="xl:hidden"
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Cart - Only for clients */}
                {isClient() && (
                  <Link href="/cart" className="relative">
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-5"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}

                {/* Notifications */}
                <Link href="/notifications" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>

                {/* User Menu - Desktop */}
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span className="hidden md:inline truncate max-w-24">
                          {user?.full_name || user?.email}
                        </span>
                        {isAdvisor() ? (
                          <Badge className="hidden lg:inline-flex bg-[#2FD7B5] text-white text-xs">
                            Asesor
                          </Badge>
                        ) : subscription?.subscription_status === 'active' && subscription?.price_id ? (
                          <Badge className="hidden lg:inline-flex bg-[#F4D35E] text-[#0A1B3D] text-xs">
                            {getPlanName(subscription.price_id)}
                          </Badge>
                        ) : null}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
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
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu Trigger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center space-x-2">
                        <Calculator className="h-6 w-6 text-[#0A1B3D]" />
                        <span className="text-xl font-bold text-[#0A1B3D]">Asesfy</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-4">
                      {/* User Info */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="h-8 w-8 text-[#0A1B3D]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#0A1B3D] truncate">
                              {user?.full_name || user?.email}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {isAdvisor() ? (
                                <Badge className="bg-[#2FD7B5] text-white text-xs">
                                  Asesor
                                </Badge>
                              ) : subscription?.subscription_status === 'active' && subscription?.price_id ? (
                                <Badge className="bg-[#F4D35E] text-[#0A1B3D] text-xs">
                                  {getPlanName(subscription.price_id)}
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="space-y-2">
                        <NavigationLinks isMobile={true} />
                        <ChatLinks isMobile={true} />
                      </div>

                      {/* Quick Actions */}
                      <div className="border-t pt-4 space-y-2">
                        <Link
                          href="/notifications"
                          className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Bell className="h-5 w-5" />
                          <span>Notificaciones</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          <span>Configuración</span>
                        </Link>
                        {isClient() && (
                          <>
                            <Link
                              href="/orders"
                              className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>Mis Pedidos</span>
                            </Link>
                            <Link
                              href="/documents"
                              className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>Documentos</span>
                            </Link>
                          </>
                        )}
                        {isAdvisor() && (
                          <>
                            <Link
                              href="/advisor/calendar"
                              className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>Calendario</span>
                            </Link>
                            <Link
                              href="/advisor/reports"
                              className="flex items-center space-x-3 py-3 px-4 text-gray-600 hover:text-[#0A1B3D] hover:bg-gray-50 rounded-lg transition-all"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>Informes</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Sign Out */}
                      <div className="border-t pt-4">
                        <Button
                          onClick={handleSignOut}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="h-5 w-5 mr-3" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button 
                    size="sm" 
                    className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white text-xs sm:text-sm px-3 sm:px-4"
                  >
                    <span className="hidden sm:inline">Empezar ahora</span>
                    <span className="sm:hidden">Registro</span>
                  </Button>
                </Link>
                
                {/* Mobile menu for non-authenticated users */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="sm:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px]">
                    <SheetHeader>
                      <SheetTitle className="flex items-center space-x-2">
                        <Calculator className="h-6 w-6 text-[#0A1B3D]" />
                        <span className="text-xl font-bold text-[#0A1B3D]">Asesfy</span>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-4">
                      <NavigationLinks isMobile={true} />
                      
                      <div className="border-t pt-4 space-y-3">
                        <Link href="/login" className="block">
                          <Button variant="outline" className="w-full">
                            Iniciar Sesión
                          </Button>
                        </Link>
                        <Link href="/onboarding" className="block">
                          <Button className="w-full bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white">
                            Empezar ahora
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
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