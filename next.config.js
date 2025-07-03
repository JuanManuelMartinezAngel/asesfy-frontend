/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comentamos output: export para permitir middleware en desarrollo
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    // Permitir dominios externos para imágenes
    domains: ['localhost'],
  },
  // Configuración de webpack para resolver problemas de dependencias
  webpack: (config, { isServer }) => {
    // Silenciar warnings críticos de Supabase realtime-js
    config.module.exprContextCritical = false;
    
    // Ignorar módulos opcionales de WebSocket que causan warnings
    config.externals = config.externals || [];
    config.externals.push({
      'bufferutil': 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    });

    // Resolver fallbacks para módulos Node.js en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // Configuración adicional para desarrollo
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};

module.exports = nextConfig;
