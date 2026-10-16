import { describe, expect, test } from 'vitest';
import { getProducts } from './db';
import { generateProductJsonLd } from './productJsonLd';
import { getPublicProductFaq } from './productFaq';
import { buildCollectionJsonLd } from './collectionJsonLd';
import { BUYER_GUIDES } from './buyerGuides';
import { getBuyerGuideFaq } from './buyerGuideFaq';
import { buildFaqJsonLd } from './faqJsonLd';

describe('published structured data', () => {
  test('product FAQ uses public content and keeps unverified detail answers private', async () => {
    const [source] = await getProducts();
    const product = {
      ...source,
      detailPage: {
        ...source.detailPage,
        faq: [{ question: 'Unverified claim?', answer: 'Guaranteed stock and delivery.' }]
      }
    };
    const schema = generateProductJsonLd(
      product,
      'https://zamique.com',
      new Date('2026-10-09'),
      []
    );
    const faq = schema['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(faq).toMatchObject(
      buildFaqJsonLd(
        `https://zamique.com/products/${product.slug}`,
        getPublicProductFaq(product, false)
      )
    );
    expect(JSON.stringify(schema)).not.toContain('Guaranteed stock');
    expect(getPublicProductFaq(product, true)).toEqual(product.detailPage.faq);
  });

  test('catalog collection describes every published product with sequential absolute links', async () => {
    const products = await getProducts();
    const schema = buildCollectionJsonLd({
      path: '/catalog',
      name: 'Wholesale catalog',
      description: 'Browse the catalog.',
      products,
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Wholesale catalog', path: '/catalog' }
      ]
    });
    expect(schema['@graph'][0]).toMatchObject({
      '@id': 'https://zamique.com/catalog#webpage',
      mainEntity: { '@id': 'https://zamique.com/catalog#products' }
    });
    const list = schema['@graph'][2];
    expect(list).toMatchObject({ numberOfItems: products.length });
    expect(list.itemListElement).toEqual(
      products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `https://zamique.com/products/${product.slug}`
      }))
    );
    expect(schema['@graph'][1].itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zamique.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Wholesale catalog',
        item: 'https://zamique.com/catalog'
      }
    ]);
  });

  test('all guides have two substantive answers drawn from their visible buying advice', () => {
    for (const guide of BUYER_GUIDES) {
      const faq = getBuyerGuideFaq(guide);
      expect(faq).toHaveLength(2);
      faq.forEach((item, index) => {
        expect(item.question).toMatch(/\?$/);
        expect(item.answer).toBe(guide.sections[index].paragraphs[0]);
        expect(item.answer.length).toBeGreaterThan(80);
      });
    }
  });
});
