import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow images from Supabase storage
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Headers for better mobile caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

export default nextConfig
