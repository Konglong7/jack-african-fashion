import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Product } from '@/lib/db';
import type { SiteContent } from '@/lib/siteContentTypes';
import { getProducts } from '@/lib/db';
import { getSiteContent } from '@/lib/siteContent';

vi.mock('@/lib/db', () => ({ getProducts: vi.fn() }));
vi.mock('@/lib/siteContent', () => ({ getSiteContent: vi.fn() }));
vi.mock('./CatalogClient', () => ({ CatalogClient: () => <div>Interactive catalog</div> }));

import CatalogPage from './page';

const products = JSON.parse(readFileSync('data/products.json', 'utf8')) as Product[];
const siteContent = JSON.parse(readFileSync('data/site-content.json', 'utf8')) as SiteContent;

describe('catalog crawlability', () => {
  beforeEach(() => {
    vi.mocked(getProducts).mockResolvedValue(products);
    vi.mocked(getSiteContent).mockResolvedValue(siteContent);
  });

  it('renders a direct server-side link to every public product', async () => {
    const html = renderToStaticMarkup(await CatalogPage());
    const linkedSlugs = new Set(
      [...html.matchAll(/href="\/products\/([^"?#]+)"/g)].map((match) => match[1])
    );

    expect(linkedSlugs.size).toBe(products.length);
    for (const product of products) expect(linkedSlugs).toContain(product.slug);
  });
});
