/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgix.cosmicjs.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.cosmicjs.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react']
  },
  typedRoutes: false
}

module.exports = nextConfig