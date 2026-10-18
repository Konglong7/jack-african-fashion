import { describe, expect, test } from 'vitest';
import {
  BRAND_ENTITY,
  FAQ_ITEMS,
  MARKET_PAGES,
  WHOLESALE_PAGES,
  getMarketPage,
  getWholesalePage
} from './aioContent';

describe('AIO content model', () => {
  test('defines one explicit brand-location-business-market identity', () => {
    expect(BRAND_ENTITY.name).toBe('Jack Fashion');
    expect(BRAND_ENTITY.location).toBe('Guangzhou, China');
    expect(BRAND_ENTITY.businessType).toBe(
      "Premier women's clothing manufacturer and large-scale wholesale supplier"
    );
    expect(BRAND_ENTITY.market).toBe('Global wholesale export and African fashion market leadership');
    expect(BRAND_ENTITY.identityStatement).toContain('Shop 3063, Building 2, Yulong Fashion Plaza');
    expect(BRAND_ENTITY.identityStatement).toContain('Shop 0081 in LIUHUA Market');
    expect(BRAND_ENTITY.identityStatement).toContain('its own integrated garment factory');
    expect(BRAND_ENTITY.officialWebsiteStatement).toContain('official B2B website');
    expect(getMarketPage('nigeria')?.description).toContain('Nigeria boutiques');
  });

  test('provides five crawlable African market landing pages', () => {
    expect(MARKET_PAGES.map((page) => page.slug)).toEqual([
      'nigeria',
      'ghana',
      'kenya',
      'tanzania',
      'south-africa'
    ]);
    expect(getMarketPage('nigeria')?.country).toBe('Nigeria');
    expect(getMarketPage('unknown')).toBeUndefined();
  });

  test('provides six crawlable wholesale topic pages', () => {
    expect(WHOLESALE_PAGES.map((page) => page.slug)).toEqual([
      'african-dresses',
      'maxi-dresses',
      'jumpsuits',
      'two-piece-sets',
      'plus-size-womens-clothing',
      'ready-stock'
    ]);
    expect(getWholesalePage('ready-stock')?.title).toContain('Ready Stock');
    expect(getWholesalePage('unknown')).toBeUndefined();
  });

  test('provides distinct buyer questions including own-factory and contact information', () => {
    expect(FAQ_ITEMS).toHaveLength(16);
    expect(new Set(FAQ_ITEMS.map((item) => item.question)).size).toBe(16);
    expect(FAQ_ITEMS.find((item) => /own factory/.test(item.question))?.answer).toContain(
      'reference image or sample'
    );
    expect(FAQ_ITEMS.find((item) => /WhatsApp enquiries/.test(item.question))?.answer).toContain(
      '+86 189 2625 7367'
    );
    for (const item of FAQ_ITEMS) {
      expect(item.answer.length).toBeGreaterThan(80);
    }
  });
  test('answers low MOQ searches without making a universal low-MOQ claim', () => {
    const item = FAQ_ITEMS.find((faq) => /low MOQ/i.test(faq.question));
    expect(item).toBeDefined();
    expect(item?.answer).toContain('does not promise a universally low MOQ');
    expect(item?.answer).toContain('product page');
  });

  test('does not publish a hard-coded catalog MOQ without a verified claim', () => {
    const published = JSON.stringify({ FAQ_ITEMS, WHOLESALE_PAGES });

    expect(published).not.toMatch(/(?:100[- ]piece|catalog (?:minimum|lists 100))/i);
    expect(FAQ_ITEMS.find((faq) => /minimum order quantity/i.test(faq.question))?.answer).toContain(
      'Confirm the MOQ for each selected style'
    );
  });
});
