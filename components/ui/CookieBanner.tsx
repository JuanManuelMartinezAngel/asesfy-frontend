'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Settings, Cookie, Shield } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookiePrefs = localStorage.getItem('cookie-preferences');
    const cookieConsent = localStorage.getItem('cookie-consent');
    
    if (!cookiePrefs && !cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    setPreferences(allAccepted);
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', 'true');
    
    // Apply preferences (this would integrate with your analytics/marketing tools)
    applyPreferences(prefs);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      // Enable Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Disable Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }

    // Marketing cookies
    if (prefs.marketing) {
      // Enable marketing pixels
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: 'granted'
        });
      }
    } else {
      // Disable marketing pixels
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          ad_storage: 'denied'
        });
      }
    }
  };

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {!showSettings ? (
            // Main banner
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-10 h-10 bg-[#2FD7B5]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cookie className="h-5 w-5 text-[#2FD7B5]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#0A1B3D] mb-2">
                    Respetamos tu privacidad
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia, analizar el tráfico y personalizar 
                    el contenido. Puedes elegir qué tipos de cookies aceptar.{' '}
                    <Link href="/cookies" className="text-[#2FD7B5] hover:underline">
                      Más información
                    </Link>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Personalizar
                </Button>
                <Button
                  onClick={handleAcceptNecessary}
                  variant="outline"
                  size="sm"
                  className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white"
                >
                  Solo Necesarias
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  size="sm"
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white"
                >
                  Aceptar Todas
                </Button>
              </div>
            </div>
          ) : (
            // Settings panel
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#0A1B3D]">
                  Configuración de Cookies
                </h3>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Necessary cookies */}
                <div className="p-4 bg-gray-50 rounded-lg opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-[#0A1B3D]">Necesarias</span>
                    </div>
                    <div className="w-10 h-5 bg-gray-400 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Esenciales para el funcionamiento del sitio web.
                  </p>
                </div>
                
                {/* Functional cookies */}
                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#0A1B3D]">Funcionales</span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${
                        preferences.functional ? 'bg-[#2FD7B5]' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.functional ? 'translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Mejoran la funcionalidad y personalización.
                  </p>
                </div>
                
                {/* Analytics cookies */}
                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#0A1B3D]">Análisis</span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${
                        preferences.analytics ? 'bg-[#2FD7B5]' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Nos ayudan a entender cómo usas el sitio.
                  </p>
                </div>
                
                {/* Marketing cookies */}
                <div className="p-4 bg-white border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#0A1B3D]">Marketing</span>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${
                        preferences.marketing ? 'bg-[#2FD7B5]' : 'bg-gray-300'
                      }`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                          preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Para mostrar anuncios relevantes.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSaveCustom}
                  className="bg-[#2FD7B5] hover:bg-[#2FD7B5]/90 text-white flex-1"
                >
                  Guardar Preferencias
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="outline"
                  className="border-[#2FD7B5] text-[#2FD7B5] hover:bg-[#2FD7B5] hover:text-white"
                >
                  Aceptar Todas
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
} 