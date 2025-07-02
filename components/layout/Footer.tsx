import Link from 'next/link';
import { Calculator, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A1B3D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-[#2FD7B5]" />
              <span className="text-2xl font-bold">Asesfy</span>
            </Link>
            <p className="text-gray-300 mb-4">
              Simplificamos tu gestión fiscal con tecnología avanzada y 
              asesoramiento personalizado para autónomos y empresas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#2FD7B5]" />
                <span className="text-sm">info@asesfy.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-[#2FD7B5]" />
                <span className="text-sm">+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-[#2FD7B5]" />
                <span className="text-sm">Madrid, España</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Declaración de la Renta
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  IVA Trimestral
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Constitución de Sociedades
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Asesoría Fiscal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-[#2FD7B5] transition-colors">
                  Términos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2024 Asesfy. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-[#2FD7B5] text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-[#2FD7B5] text-sm transition-colors">
                Términos
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-[#2FD7B5] text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}