import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { MARKET_PAGES } from './aioContent';
import { MARKET_REGIONS } from './marketRegions';
import type { Product } from './db';
import { selectMarketProducts } from './marketProductSelection';

const products: Product[] = JSON.parse(readFileSync('data/products.json', 'utf8'));

describe('market product shortlists', () => {
  it('represents every available advertised category before repeating one', () => {
    for (const page of [...MARKET_PAGES, ...MARKET_REGIONS]) {
      const categories = 'availableCategories' in page ? page.availableCategories : page.categories;
      const available = categories.filter((category) => products.some((p) => p.category === category));
      const selected = selectMarketProducts(products, categories);

      expect(selected).toHaveLength(6);
      expect(new Set(selected.map((p) => p.id)).size).toBe(6);
      expect(selected.slice(0, available.length).map((p) => p.category)).toEqual(available);
      expect(selected.every((p) => categories.includes(p.category))).toBe(true);
    }
  });

  it('keeps sets and plus-size styles visible when the latest six products are dresses', () => {
    const categories = MARKET_PAGES.find((page) => page.slug === 'ghana')!.availableCategories;
    const selected = selectMarketProducts(products, categories);

    expect(selected.some((p) => p.category === 'Two Piece Sets')).toBe(true);
    expect(selected.some((p) => p.category === 'Plus Size Dresses')).toBe(true);
    expect(selected.some((p) => p.category === 'Coordinated Styles')).toBe(true);
    expect(selectMarketProducts(products, categories)).toEqual(selected);
    expect(products.map((p) => p.id)).toEqual(
      JSON.parse(readFileSync('data/products.json', 'utf8')).map((p: Product) => p.id)
    );
  });

  it('handles small catalogs, missing or repeated categories, and a smaller limit', () => {
    const set = products.find((p) => p.category === 'Two Piece Sets')!;
    const dress = products.find((p) => p.category === 'Maxi Dresses')!;
    expect(selectMarketProducts([], ['Maxi Dresses'])).toEqual([]);
    expect(selectMarketProducts([dress, set], ['Missing', 'Two Piece Sets', 'Two Piece Sets', 'Maxi Dresses']))
      .toEqual([set, dress]);
    expect(selectMarketProducts(products, ['Two Piece Sets', 'Plus Size Dresses'], 2)
      .map((p) => p.category)).toEqual(['Two Piece Sets', 'Plus Size Dresses']);
  });
});
