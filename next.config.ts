import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://static.cloudflareinsights.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''} https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://cloudflareinsights.com`,
  'frame-src https://www.google.com https://maps.google.com',
  ...(isDev ? [] : ['upgrade-insecure-requests'])
].join('; ');

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
    deviceSizes: [320, 480, 640, 768, 960, 1280, 1920],
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
        source: '/indexnow-key.txt',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }]
      },
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
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=15552000'
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy
          }
        ]
      }
    ];
  }
};

export default nextConfig;
