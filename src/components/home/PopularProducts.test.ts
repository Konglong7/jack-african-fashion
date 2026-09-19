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

  test('limits the homepage to twelve products', () => {
    const picked = pickHomepageProducts(
      Array.from({ length: 20 }, (_, index) => product(String(index + 1), { isNew: true }))
    );

    expect(picked).toHaveLength(12);
    expect(picked[0].id).toBe('20');
  });
});
