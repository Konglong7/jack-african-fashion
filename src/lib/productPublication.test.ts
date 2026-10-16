import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { changedProductPages } from './productPublication';
import type { Product } from './db';
const products = JSON.parse(readFileSync('data/products.json', 'utf8')) as Product[];
describe('product update notifications', () => {
  it('does not notify a save with identical public data', () => {
    expect(changedProductPages(products, structuredClone(products))).toEqual([]);
  });
  it('includes old and new URLs on a slug change and rechecks affected selections', () => {
    const next = structuredClone(products);
    const targetIndex = next.findLastIndex((item) =>
      ['Two Piece Sets', 'Maxi Dresses', 'Plus Size Dresses'].includes(item.category)
    );
    next[targetIndex].slug += '-changed';
    const paths = changedProductPages(products, next);
    expect(paths).toContain('/catalog');
    expect(paths).toContain('/products/' + products[targetIndex].slug);
    expect(paths).toContain('/products/' + next[targetIndex].slug);
    expect(paths.some((value) => value.startsWith('/markets/'))).toBe(true);
    expect(paths.some((value) => value.startsWith('/guides/'))).toBe(true);
    expect(paths).not.toContain('/privacy');
  });
});
