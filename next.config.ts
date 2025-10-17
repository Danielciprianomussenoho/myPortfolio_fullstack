

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Configuração para desenvolvimento
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      // Configuração para produção - usando seu domínio real
      {
        protocol: 'https',
        hostname: 'myportfolioapi.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
  // Outras configurações recomendadas para produção
  experimental: {
    esmExternals: 'loose'
  },
}

module.exports = nextConfig