import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Quote-only pages generate metadata from local data. Emit it in head for
  // every crawler, including clients that do not process streamed metadata.
  htmlLimitedBots: /.*/,
  experimental: {
    optimizePackageImports: ['framer-motion'],
    imgOptConcurrency: 1
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config) => {
    // ponytail: Next's default watchOptions.ignored is a RegExp, and webpack's schema
    // rejects RegExp inside an array (elements must be non-empty strings). Don't try to
    // merge with the default — just set explicit globs that cover what we need ignored.
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.playwright-mcp/**',
        '**/artifacts/**',
        '**/test_screenshots/**'
      ]
    };

    return config;
  },
  images: {
    // Enable image optimization for better performance
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 85],
    minimumCacheTTL: 14_400,
    deviceSizes: [320, 480, 640, 960, 1280, 1920],
    imageSizes: [32, 64, 96, 128, 160, 256],
    // Restrict remote patterns to trusted hosts to prevent SSRF
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' }
        ]
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
