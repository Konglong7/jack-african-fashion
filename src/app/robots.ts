import type { MetadataRoute } from 'next';
import { getSiteOrigin } from '@/lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/inquiry']
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot'
        ],
        allow: '/',
        disallow: ['/admin', '/api/', '/inquiry']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
