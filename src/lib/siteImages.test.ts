import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { SITE_IMAGES } from './siteImages';

const publicDir = join(process.cwd(), 'public');

describe('site image mapping', () => {
  test('maps required marketing images to public files', () => {
    expect(SITE_IMAGES.hero).toBe('/images/site/01-hero-banner.png');
    expect(SITE_IMAGES.categories['Plus Size Dresses']).toBe(
      '/images/site/02-category-plus-size-dresses.png'
    );
    expect(SITE_IMAGES.categories['Two Piece Sets']).toBe(
      '/images/site/03-category-two-piece-sets.png'
    );
    expect(SITE_IMAGES.categories['Pleated Dresses']).toBe(
      '/images/site/04-category-pleated-styles.png'
    );
    expect(SITE_IMAGES.categories['Maxi Dresses']).toBe(
      '/images/site/05-category-maxi-dresses.png'
    );
    expect(SITE_IMAGES.categories.Jumpsuits).toBe('/images/site/category-jumpsuits-cover.webp');
    expect(SITE_IMAGES.categories['Custom Orders']).toBe(
      '/images/site/12-category-custom-orders.png'
    );
    expect(SITE_IMAGES.aboutShowroom).toBe('/images/site/06-about-showroom.png');
    expect(SITE_IMAGES.warehouseShipping).toBe('/images/site/07-warehouse-packing-shipping.png');
    expect(SITE_IMAGES.customOrders).toBe('/images/site/08-custom-orders.png');
    expect(SITE_IMAGES.whatsappContact).toBe('/images/site/09-whatsapp-contact.png');
    expect(SITE_IMAGES.whatsappCatalogBanner).toBe(
      '/images/site/social-whatsapp-catalog-banner.webp'
    );
    expect(SITE_IMAGES.africanMarketCollage).toBe('/images/site/10-african-market-collage.png');
    expect(SITE_IMAGES.blog).toEqual([
      '/images/site/13-blog-buying-guide.png',
      '/images/site/14-blog-ready-stock-vs-custom-orders.png',
      '/images/site/15-blog-factory-prices-guangzhou.png'
    ]);
  });

  test('required marketing images exist in public assets', () => {
    const paths = [
      SITE_IMAGES.hero,
      ...Object.values(SITE_IMAGES.categories),
      SITE_IMAGES.aboutShowroom,
      SITE_IMAGES.warehouseShipping,
      SITE_IMAGES.customOrders,
      SITE_IMAGES.whatsappContact,
      SITE_IMAGES.whatsappCatalogBanner,
      SITE_IMAGES.africanMarketCollage,
      ...SITE_IMAGES.blog
    ];

    for (const path of paths) {
      expect(existsSync(join(publicDir, path))).toBe(true);
    }
  });
});
