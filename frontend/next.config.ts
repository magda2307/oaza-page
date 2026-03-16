import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '*.cloudflare.com' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      // Allow any HTTPS host during development — tighten for production
      { protocol: 'https', hostname: '**' },
    ],
  },
}

export default nextConfig
