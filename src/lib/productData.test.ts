import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('public product data', () => {
  test('does not publish placeholder test products', () => {
    const products = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'products.json'), 'utf8')
    ) as Array<{ slug: string; name: string }>;

    expect(products.some((product) => product.slug === 'test' || product.name === 'test')).toBe(
      false
    );
  });
});
