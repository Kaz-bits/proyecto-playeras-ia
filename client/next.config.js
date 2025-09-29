/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['placehold.co', 'localhost', 'api.placeholder.com'],
    unoptimized: true
  },
  // Configuración para manejar importaciones de Three.js
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
  // Para producción en Vercel
  output: 'standalone',
  // Rutas API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` 
          : 'http://localhost:5000/api/:path*'
      }
    ];
  }
}

module.exports = nextConfig;