import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import WholesalePage, { generateMetadata, generateStaticParams } from './[category]/page';
import sitemap from '../sitemap';
import { getProducts } from '@/lib/db';
import { buildFooterLinks, buildNavLinks } from '@/lib/siteNavigation';
import { Categories } from '@/components/home/Categories';

const path = '/wholesale/maxi-dresses';
const params = () => Promise.resolve({ category: 'maxi-dresses' });

describe('maxi dress wholesale discovery', () => {
  test('publishes a dedicated collection with its own canonical URL and sourcing title', async () => {
    expect(generateStaticParams()).toContainEqual({ category: 'maxi-dresses' });
    const metadata = await generateMetadata({ params: params() });
    expect(metadata.title).toMatch(/Maxi Dresses Wholesale.*Guangzhou/);
    expect(metadata.alternates?.canonical).toBe(`https://zamique.com${path}`);
    const entries = await sitemap();
    expect(entries.filter((entry) => entry.url === `https://zamique.com${path}`)).toHaveLength(1);
  });

  test('shows real maxi-dress products with complete photographs and a direct enquiry', async () => {
    const expected = (await getProducts()).filter((product) => product.category === 'Maxi Dresses')
      .slice(-6).reverse();
    const html = renderToStaticMarkup(await WholesalePage({ params: params() }));
    expect(html).toContain('Maxi Dresses Wholesale from Guangzhou');
    expect(html).toContain('/catalog?category=Maxi%20Dresses');
    expect(html).toContain('/api/whatsapp');
    expect(html).toContain('object-contain');
    for (const product of expected) {
      expect(html).toContain(`href="/products/${product.slug}"`);
    }
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    expect(raw).toBeTruthy();
    const graph = JSON.parse(raw!)['@graph'];
    const list = graph.find((item: { '@type': string }) => item['@type'] === 'ItemList');
    expect(list.numberOfItems).toBe(expected.length);
    expect(list.itemListElement.map((item: { url: string }) => item.url)).toEqual(
      expected.map((product) => `https://zamique.com/products/${product.slug}`)
    );
    expect(html).not.toMatch(/guaranteed stock|lowest price|ships within \d|factory address/i);
  });

  test('links the collection from the homepage, header and footer while keeping editable categories', () => {
    const categories = [{ name: 'Maxi Dresses' }, { name: 'New Boutique Range' }];
    const html = renderToStaticMarkup(createElement(Categories, { categories }));
    expect(html).toContain(`href="${path}"`);
    expect(buildNavLinks(categories)).toContainEqual({ label: 'Maxi Dresses', href: path });
    expect(buildFooterLinks(categories).products).toContainEqual({ label: 'Maxi Dresses', href: path });
    expect(buildNavLinks(categories)).toContainEqual({
      label: 'New Boutique Range', href: '/catalog?category=New%20Boutique%20Range'
    });
  });
});
