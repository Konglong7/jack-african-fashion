import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '@/lib/db';
import type { SiteContent } from '@/lib/siteContentTypes';
import { toPublicProduct } from '@/lib/productPublicFacts';
import { CatalogClient } from './CatalogClient';

vi.mock('next/navigation', () => ({
  usePathname: () => '/catalog',
  useSearchParams: () => new URLSearchParams()
}));

describe('catalog heading structure', () => {
  it('introduces the product grid before individual product headings', () => {
    const products = JSON.parse(readFileSync('data/products.json', 'utf8')) as Product[];
    const site = JSON.parse(readFileSync('data/site-content.json', 'utf8')) as SiteContent;
    const html = renderToStaticMarkup(
      <CatalogClient
        products={products.slice(0, 2).map((product) => toPublicProduct(product))}
        siteContent={site}
        categories={[]}
      />
    );
    const levels = [...html.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
    expect(levels).toContain(3);
    expect(levels[0]).toBe(2);
    expect(levels.every((level, index) => index === 0 || level <= levels[index - 1] + 1)).toBe(
      true
    );
  });
});
