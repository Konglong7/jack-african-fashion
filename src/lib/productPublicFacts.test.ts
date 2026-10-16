import { describe, expect, it } from 'vitest';
import type { ClaimRecord } from './contentClaims';
import type { Product } from './db';
import {
  buildPublicProductKeywords,
  buildProductMetaDescription,
  getPublicProductFacts,
  toPublicProduct
} from './productPublicFacts';

const product: Product = {
  id: 'style-1',
  slug: 'style-1',
  name: 'Pleated Maxi Dress',
  category: 'Maxi Dresses',
  image: '/images/products/style-1.webp',
  moq: 100,
  moqOptions: [100],
  stockType: 'Ready Stock',
  tags: ['Maxi'],
  sizes: ['XL', 'XXL'],
  colors: [{ name: 'Blue', hex: '#0000ff' }],
  description: 'Guaranteed in stock with factory-direct export packing.',
  features: ['Guaranteed repeat orders'],
  whatsappMessage: 'Ask about style-1'
};

const claim = (field: string, publicValue: string): ClaimRecord => ({
  id: `style-1-${field}`,
  subjectType: 'product',
  subjectId: 'style-1',
  field,
  publicValue,
  status: 'verified',
  evidenceId: `evidence-${field}`,
  verifiedAt: '2026-10-01'
});

describe('product search descriptions', () => {
  it('uses a complete style-specific wholesale sentence instead of cutting into the next sentence', () => {
    const summary = 'Wholesale one-shoulder midi dress with a ring detail and gathered skirt.';
    expect(buildProductMetaDescription(`${summary} Confirm measurements on WhatsApp.`)).toBe(
      summary
    );
  });

  it('preserves the enquiry context for products without reviewed style copy', () => {
    expect(
      buildProductMetaDescription(
        'Catalog reference for a dress. Confirm wholesale details on WhatsApp.'
      )
    ).toBe('Catalog reference for a dress. Confirm wholesale details on WhatsApp.');
  });

  it('keeps long descriptions within the limit without cutting a word in half', () => {
    const description = 'Wholesale dress details ' + 'neckline sleeves pleats '.repeat(12);
    const result = buildProductMetaDescription(description);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toMatch(/\b(?:neckline|sleeves|pleats)…$/);
  });
});

describe('getPublicProductFacts', () => {
  it('replaces unverified commercial data with inquiry-safe copy', () => {
    const facts = getPublicProductFacts(product, new Date('2026-10-05'), []);

    expect(facts.description).not.toContain('Guaranteed');
    expect(facts.moq).toBe('Confirm on WhatsApp');
    expect(facts.stock).toBe('Confirm current batch');
    expect(facts.sizes).toBe('Confirm measurements and size run');
    expect(facts.colors).toBe('Confirm current batch colors');
    expect(facts.features.join(' ')).not.toContain('repeat orders');
    expect(facts.allowDetailedContent).toBe(false);
  });

  it('publishes only current verified product fields', () => {
    const claims = [
      claim('description', 'Pleated maxi dress catalog style for wholesale buyers.'),
      claim('moq', '80 pcs'),
      claim('stock', 'Made after order confirmation'),
      claim('sizes', 'XL–4XL'),
      claim('colors', 'Blue / Green'),
      claim('features', 'Pleated finish|Long silhouette'),
      claim('detailContent', 'Approved product detail content')
    ];

    const facts = getPublicProductFacts(product, new Date('2026-10-05'), claims);

    expect(facts).toMatchObject({
      description: 'Pleated maxi dress catalog style for wholesale buyers.',
      moq: '80 pcs',
      stock: 'Made after order confirmation',
      sizes: 'XL–4XL',
      colors: 'Blue / Green',
      features: ['Pleated finish', 'Long silhouette'],
      allowDetailedContent: true
    });
  });

  it('does not publish expired verified fields', () => {
    const expired = {
      ...claim('moq', '60 pcs'),
      expiresAt: '2026-10-04'
    };

    expect(getPublicProductFacts(product, new Date('2026-10-05'), [expired]).moq).toBe(
      'Confirm on WhatsApp'
    );
  });

  it('removes unverified commercial fields before a product crosses into client UI', () => {
    const safe = toPublicProduct(product, new Date('2026-10-05'), []);

    expect(safe).not.toHaveProperty('moq');
    expect(safe).not.toHaveProperty('moqOptions');
    expect(safe).not.toHaveProperty('stockType');
    expect(safe).not.toHaveProperty('tags');
    expect(safe).not.toHaveProperty('sizes');
    expect(safe).not.toHaveProperty('colors');
    expect(safe.description).not.toContain('Guaranteed');
    expect(safe.features.join(' ')).not.toContain('repeat orders');
    expect(safe.detailPage).toBeUndefined();
    expect(safe.whatsappMessage).toContain('confirm stock, MOQ');
  });

  it('builds metadata keywords without leaking unverified raw product tags', () => {
    const tagged = {
      ...product,
      tags: ['Ready Stock', '100-piece MOQ', 'Guaranteed Dispatch']
    };

    const keywords = buildPublicProductKeywords(tagged);

    expect(keywords).toContain('Pleated Maxi Dress');
    expect(keywords).toContain('Maxi Dresses');
    expect(keywords).not.toMatch(/Ready Stock|100-piece|Guaranteed Dispatch/i);
  });
});
