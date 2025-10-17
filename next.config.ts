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
        hostname: 'myportfolioapi.up.railway.app',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig