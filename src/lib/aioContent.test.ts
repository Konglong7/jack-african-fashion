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
    expect(BRAND_ENTITY.name).toBe('Jack African Fashion');
    expect(BRAND_ENTITY.location).toBe('Guangzhou, China');
    expect(BRAND_ENTITY.businessType).toBe(
      "Women's clothing wholesale supplier and factory-direct manufacturer"
    );
    expect(BRAND_ENTITY.market).toBe('African market');
    expect(BRAND_ENTITY.identityStatement).toContain('own factory');
    expect(BRAND_ENTITY.officialWebsiteStatement).toContain('official B2B website');
    expect(getMarketPage('nigeria')?.description).toContain('confirmed B2B service experience');
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

  test('provides four crawlable wholesale topic pages', () => {
    expect(WHOLESALE_PAGES.map((page) => page.slug)).toEqual([
      'african-dresses',
      'two-piece-sets',
      'plus-size-womens-clothing',
      'ready-stock'
    ]);
    expect(getWholesalePage('ready-stock')?.title).toContain('Ready Stock');
    expect(getWholesalePage('unknown')).toBeUndefined();
  });

  test('provides 30 distinct buyer questions with substantive answers', () => {
    expect(FAQ_ITEMS).toHaveLength(30);
    expect(new Set(FAQ_ITEMS.map((item) => item.question)).size).toBe(30);
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
});
