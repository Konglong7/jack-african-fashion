import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';
import { MARKET_PAGES, WHOLESALE_PAGES } from '@/lib/aioContent';
import { getSiteOrigin } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteOrigin();
  const products = await getProducts();

  const lastModified = new Date('2026-10-01');

  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/catalog', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/custom-orders', changeFrequency: 'monthly' as const, priority: 0.8 }
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));

  const wholesalePages = WHOLESALE_PAGES.map((page) => ({
    url: `${baseUrl}/wholesale/${page.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));

  const marketPages = MARKET_PAGES.map((market) => ({
    url: `${baseUrl}/markets/${market.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }));

  return [...staticPages, ...wholesalePages, ...marketPages, ...productUrls];
}
