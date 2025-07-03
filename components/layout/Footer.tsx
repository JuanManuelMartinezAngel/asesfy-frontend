import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A1B3D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Image 
                src="/logos/asesfy-logo.png" 
                alt="Asesfy Logo" 
                width={40} 
                height={40} 
                className="h-7 w-7 sm:h-9 sm:w-9 object-contain" 
              />
              <span className="text-xl sm:text-2xl font-bold -ml-1">sesfy</span>
            </Link>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              Simplificamos tu gestión fiscal con tecnología avanzada y 
              asesoramiento personalizado para autónomos y empresas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#2FD7B5] flex-shrink-0" />
                <span className="text-sm">info@asesfy.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#2FD7B5] flex-shrink-0" />
                <span className="text-sm">+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#2FD7B5] flex-shrink-0" />
                <span className="text-sm">Madrid, España</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Declaración de la Renta
                </Link>
              </li>
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  IVA Trimestral
                </Link>
              </li>
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Constitución de Sociedades
                </Link>
              </li>
              <li>
                <Link 
                  href="/marketplace" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Asesoría Fiscal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-[#2FD7B5] transition-colors text-sm block"
                >
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Asesfy. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
              <Link 
                href="/privacy" 
                className="text-gray-300 hover:text-[#2FD7B5] text-xs sm:text-sm transition-colors"
              >
                Privacidad
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-300 hover:text-[#2FD7B5] text-xs sm:text-sm transition-colors"
              >
                Términos
              </Link>
              <Link 
                href="/cookies" 
                className="text-gray-300 hover:text-[#2FD7B5] text-xs sm:text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}