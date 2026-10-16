import { describe, expect, it, vi } from 'vitest';
import { BUYER_GUIDES, GUIDE_UPDATED_DATE } from '@/lib/buyerGuides';
import { getProducts } from '@/lib/db';
import sitemap from './sitemap';
import { MARKET_PAGES } from '@/lib/aioContent';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { MARKET_PAGE_UPDATED_DATE } from '@/lib/marketProductSelection';
import { FACTORY_PHOTOS } from '@/lib/factoryPhotos';

describe('sitemap modification dates', () => {
  it('lists the same factory photographs shown on the three updated pages', async () => {
    const entries = await sitemap();
    for (const path of ['/about', '/custom-orders']) {
      expect(entries.find((entry) => entry.url === `https://zamique.com${path}`)?.images).toEqual(
        FACTORY_PHOTOS.map((photo) => `https://zamique.com${photo.src}`)
      );
    }
    const homeImages = entries.find((entry) => entry.url === 'https://zamique.com')?.images;
    expect(homeImages).toHaveLength(2);
    expect(homeImages).toContain(
      'https://zamique.com/images/factory/jack-fashion-fabric-cutting.webp'
    );
    expect(homeImages).toContain(
      'https://zamique.com/images/factory/jack-fashion-sewing-workshop.webp'
    );
  });

  it('covers the current catalog, collections, markets and guides without private URLs', async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    const products = await getProducts();

    expect(products.length).toBeGreaterThan(0);
    expect(entries.filter((entry) => entry.url.includes('/products/'))).toHaveLength(
      products.length
    );
    for (const product of products) {
      expect(urls).toContain(`https://zamique.com/products/${product.slug}`);
    }
    expect(urls).toEqual(
      expect.arrayContaining([
        'https://zamique.com/catalog',
        'https://zamique.com/wholesale/african-dresses',
        'https://zamique.com/wholesale/maxi-dresses',
        'https://zamique.com/wholesale/jumpsuits',
        'https://zamique.com/wholesale/two-piece-sets',
        'https://zamique.com/wholesale/plus-size-womens-clothing',
        'https://zamique.com/wholesale/ready-stock',
        'https://zamique.com/markets/nigeria',
        'https://zamique.com/markets/africa',
        'https://zamique.com/guides/wholesale-moq'
      ])
    );
    expect(new Set(urls).size).toBe(urls.length);
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/zamique\.com(?:\/|$)/);
      expect(new URL(entry.url).pathname).not.toMatch(/^\/(admin|api|inquiry)(\/|$)/);
      expect(entry.changeFrequency).toBeTruthy();
    }
  });

  it('only publishes last-modified dates backed by a real content date', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-14T12:00:00Z'));
    try {
      const entries = await sitemap();
      const datedEntries = entries.filter((entry) => entry.lastModified);

      expect(datedEntries).toHaveLength(
        BUYER_GUIDES.length + 138 + 10 + MARKET_PAGES.length + MARKET_REGIONS.length
      );
      for (const market of [...MARKET_PAGES, ...MARKET_REGIONS]) {
        expect(
          entries.find((entry) => entry.url.endsWith(`/markets/${market.slug}`))
        ).toMatchObject({ lastModified: new Date(MARKET_PAGE_UPDATED_DATE) });
      }
      for (const guide of BUYER_GUIDES) {
        expect(entries.find((entry) => entry.url.endsWith(`/guides/${guide.slug}`))).toMatchObject({
          lastModified: new Date(GUIDE_UPDATED_DATE)
        });
      }
      expect(
        entries.find((entry) => entry.url.endsWith('/products/plus-size-loose-dress'))
      ).toMatchObject({ lastModified: new Date('2026-10-12') });
      expect(
        entries.find((entry) => entry.url.endsWith('/products/elegant-pleated-maxi-dress'))
      ).toMatchObject({ lastModified: new Date('2026-10-13') });
      expect(entries.find((entry) => entry.url.endsWith('/catalog'))).toMatchObject({
        lastModified: new Date('2026-10-13')
      });
      expect(entries.find((entry) => entry.url.endsWith('/markets'))).toMatchObject({
        lastModified: new Date('2026-10-13')
      });
      expect(entries.find((entry) => entry.url === 'https://zamique.com')).toMatchObject({
        lastModified: new Date('2026-10-14')
      });
      for (const path of ['/about', '/custom-orders']) {
        expect(entries.find((entry) => entry.url === `https://zamique.com${path}`)).toMatchObject({
          lastModified: new Date('2026-10-13')
        });
      }
      expect(entries.find((entry) => entry.url.endsWith('/wholesale/maxi-dresses'))).toMatchObject({
        lastModified: new Date('2026-10-14')
      });
      for (const path of ['/wholesale/jumpsuits', '/faq', '/buying-guide', '/contact']) {
        expect(entries.find((entry) => entry.url.endsWith(path))).toMatchObject({
          lastModified: new Date('2026-10-14')
        });
      }
    } finally {
      vi.useRealTimers();
    }
  });
});
