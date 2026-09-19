import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion']
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
    formats: ['image/avif', 'image/webp'],
    qualities: [85],
    minimumCacheTTL: 14_400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
