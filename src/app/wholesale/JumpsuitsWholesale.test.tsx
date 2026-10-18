import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import WholesalePage, { generateMetadata, generateStaticParams } from './[category]/page';
import sitemap from '../sitemap';
import { getProducts } from '@/lib/db';
import * as db from '@/lib/db';
import { buildFooterLinks, buildNavLinks } from '@/lib/siteNavigation';
import { Categories } from '@/components/home/Categories';

const path = '/wholesale/jumpsuits';
const params = () => Promise.resolve({ category: 'jumpsuits' });

describe('jumpsuit wholesale buyer discovery', () => {
  test('makes the buying page a canonical, discoverable collection', async () => {
    expect(generateStaticParams()).toContainEqual({ category: 'jumpsuits' });
    const metadata = await generateMetadata({ params: params() });
    expect(metadata.title).toMatch(/Jumpsuits Wholesale.*Guangzhou/);
    expect(metadata.alternates?.canonical).toBe(`https://zamique.com${path}`);
    expect((await sitemap()).filter((entry) => entry.url === `https://zamique.com${path}`))
      .toHaveLength(1);
  });

  test('shows only real jumpsuits, including a smaller collection without filler products', async () => {
    const products = await getProducts();
    const collection = products.filter((product) => product.category === 'Jumpsuits').slice(0, 3);
    const expected = collection.slice().reverse();
    expect(expected.length).toBeGreaterThan(0);
    expect(expected.length).toBeLessThan(6);
    const catalog = vi.spyOn(db, 'getProducts').mockResolvedValue([
      ...products.filter((product) => product.category !== 'Jumpsuits').slice(0, 6),
      ...collection
    ]);
    let html: string;
    try {
      html = renderToStaticMarkup(await WholesalePage({ params: params() }));
    } finally {
      catalog.mockRestore();
    }
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    expect(raw).toBeTruthy();
    const graph = JSON.parse(raw!)['@graph'];
    const list = graph.find((item: { '@type': string }) => item['@type'] === 'ItemList');
    expect(list.numberOfItems).toBe(expected.length);
    expect(list.itemListElement.map((item: { url: string }) => item.url)).toEqual(
      expected.map((product) => `https://zamique.com/products/${product.slug}`)
    );
    expect(html).toContain('/catalog?category=Jumpsuits');
    expect(html).toMatch(/wa\.me\/8618926257367|\/api\/whatsapp/);
    expect(html).toContain('object-contain');
    expect(html).toMatch(/inseam|torso/);
    expect(html).not.toMatch(/100[- ]piece minimum|guaranteed stock|lowest price/i);
  });

  test('offers the same collection from home and navigation without changing custom categories', () => {
    const categories = [{ name: 'Jumpsuits' }, { name: 'New Boutique Range' }];
    expect(renderToStaticMarkup(createElement(Categories, { categories }))).toContain(`href="${path}"`);
    expect(buildNavLinks(categories)).toContainEqual({ label: 'Jumpsuits', href: path });
    expect(buildFooterLinks(categories).products).toContainEqual({ label: 'Jumpsuits', href: path });
    expect(buildNavLinks(categories)).toContainEqual({
      label: 'New Boutique Range', href: '/catalog?category=New%20Boutique%20Range'
    });
  });
});
