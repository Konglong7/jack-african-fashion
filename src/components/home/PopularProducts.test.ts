import { describe, expect, test } from 'vitest';
import type { Product } from '@/lib/db';
import { pickHomepageProducts } from './homeProducts';

function product(id: string, flags: Pick<Product, 'isNew' | 'isPopular'> = {}) {
  return { id, ...flags } as Product;
}

describe('pickHomepageProducts', () => {
  test('prioritizes newest new styles, then popular styles, then other uploads', () => {
    const picked = pickHomepageProducts([
      product('old-popular', { isPopular: true }),
      product('old-new', { isNew: true }),
      product('both', { isNew: true, isPopular: true }),
      product('plain'),
      product('newest-new', { isNew: true }),
      product('newest-popular', { isPopular: true })
    ]);

    expect(picked.map((item) => item.id)).toEqual([
      'newest-new',
      'both',
      'old-new',
      'newest-popular',
      'old-popular',
      'plain'
    ]);
  });

  test('limits the homepage to six products', () => {
    const picked = pickHomepageProducts(
      Array.from({ length: 20 }, (_, index) => product(String(index + 1), { isNew: true }))
    );

    expect(picked).toHaveLength(6);
    expect(picked[0].id).toBe('20');
  });

  test('gives the selected maxi, plus-size and set styles a stable place beside the latest uploads', () => {
    const maxi = { ...product('maxi'), image: '/images/products/0921026.webp' };
    const plus = { ...product('plus', { isNew: true }), image: '/images/products/0921016.webp' };
    const set = { ...product('set'), image: '/images/products/0921023.webp' };
    const latest = Array.from({ length: 8 }, (_, index) => product(`new-${index}`, { isNew: true }));

    const picked = pickHomepageProducts([maxi, plus, set, ...latest]);

    expect(picked.map((item) => item.id)).toEqual(['maxi', 'plus', 'set', 'new-7', 'new-6', 'new-5']);
    expect(new Set(picked.map((item) => item.id)).size).toBe(6);
  });

  test('fills missing selected styles from the current catalog without leaving empty positions', () => {
    const plus = { ...product('plus'), image: '/images/products/0921016.webp' };
    const latest = Array.from({ length: 8 }, (_, index) => product(`new-${index}`, { isNew: true }));

    const picked = pickHomepageProducts([plus, ...latest]);

    expect(picked.map((item) => item.id)).toEqual(['plus', 'new-7', 'new-6', 'new-5', 'new-4', 'new-3']);
  });
});
