import { Calculator } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F6F9] flex items-center justify-center">
      <div className="text-center">
        {/* Logo con animación */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="animate-pulse">
            <Calculator className="h-12 w-12 text-[#0A1B3D]" />
          </div>
          <span className="text-3xl font-bold text-[#0A1B3D]">Asesfy</span>
        </div>

        {/* Spinner principal */}
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-[#2FD7B5] mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-[#2FD7B5]/30 mx-auto"></div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-[#0A1B3D]">
            Cargando...
          </p>
          <p className="text-sm text-gray-600">
            Preparando tu experiencia fiscal
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 mx-auto mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#2FD7B5] to-[#0A1B3D] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Dots de carga */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-[#2FD7B5] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#2FD7B5] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#2FD7B5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
} 