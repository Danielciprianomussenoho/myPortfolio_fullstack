/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'myportfolioapi-production-1dd2.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig