import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/db';
import { MARKET_PAGES, WHOLESALE_PAGES } from '@/lib/aioContent';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { getSiteOrigin } from '@/lib/siteUrl';
import { BUYER_GUIDES, GUIDE_UPDATED_DATE } from '@/lib/buyerGuides';
import { getReviewedProductContentDate } from '@/lib/productContentDate';
import { MARKET_PAGE_UPDATED_DATE } from '@/lib/marketProductSelection';
import { FACTORY_PHOTOS_UPDATED_DATE, getFactoryPhotos } from '@/lib/factoryPhotos';
import { HOMEPAGE_SELECTION_UPDATED_DATE } from '@/components/home/homeProducts';

// Country navigation was added to the buying-market directory on this date.
const MARKET_DIRECTORY_UPDATED_DATE = '2026-10-13';
// MOQ wording was clarified on these two buying-policy pages.
const BUYING_POLICY_UPDATED_DATE = '2026-10-14';
// Contact-page visit guidance was changed to appointment confirmation on this UTC date.
const CONTACT_PAGE_UPDATED_DATE = '2026-10-14';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteOrigin();
  const products = await getProducts();
  const contentDates = new Map(
    products.map((product) => [product.id, getReviewedProductContentDate(product.id)])
  );
  const knownDates = [...contentDates.values()].filter((date): date is Date => !!date);
  const catalogModified = knownDates.length
    ? new Date(Math.max(...knownDates.map((date) => date.getTime())))
    : undefined;

  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/catalog', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/custom-orders', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/markets', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/buying-guide', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/guides', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 }
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    ...(page.path === '/catalog' && catalogModified ? { lastModified: catalogModified } : {}),
    ...(page.path === '/markets' ? { lastModified: new Date(MARKET_DIRECTORY_UPDATED_DATE) } : {}),
    ...(page.path === '/contact' ? { lastModified: new Date(CONTACT_PAGE_UPDATED_DATE) } : {}),
    ...(['/faq', '/buying-guide'].includes(page.path)
      ? { lastModified: new Date(BUYING_POLICY_UPDATED_DATE) }
      : {}),
    ...(['', '/about', '/custom-orders'].includes(page.path)
      ? {
        lastModified: new Date(
          page.path === '' ? HOMEPAGE_SELECTION_UPDATED_DATE : FACTORY_PHOTOS_UPDATED_DATE
        ),
        images: getFactoryPhotos(page.path === '').map((photo) => `${baseUrl}${photo.src}`)
      }
      : {})
  }));

  const wholesalePages = WHOLESALE_PAGES.map((page) => ({
    url: `${baseUrl}/wholesale/${page.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    ...(page.updatedDate ? { lastModified: new Date(page.updatedDate) } : {})
  }));

  const marketPages = [...MARKET_PAGES, ...MARKET_REGIONS].map((market) => ({
    url: `${baseUrl}/markets/${market.slug}`,
    lastModified: new Date(MARKET_PAGE_UPDATED_DATE),
    changeFrequency: 'monthly' as const,
    priority: 0.8
  }));

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    ...(contentDates.get(product.id) ? { lastModified: contentDates.get(product.id) } : {})
  }));

  const guides = BUYER_GUIDES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(GUIDE_UPDATED_DATE),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));
  return [...staticPages, ...wholesalePages, ...marketPages, ...productUrls, ...guides];
}
