import { describe, expect, test } from 'vitest';
import type { Product } from './db';
import { generateProductJsonLd } from './productJsonLd';
import type { ClaimRecord } from './contentClaims';

const product: Product = {
  id: 'p-1',
  slug: 'test-dress',
  name: 'Test Dress',
  category: 'Maxi Dresses',
  image: '/images/products/test-dress.webp',
  images: ['/images/products/test-dress.webp'],
  priceMin: 9.5,
  moq: 500,
  moqOptions: [500],
  stockType: 'Ready Stock',
  tags: [],
  sizes: ['XL'],
  colors: [{ name: 'Blue', hex: '#0000ff' }],
  description: 'Wholesale test dress.',
  features: [],
  whatsappMessage: 'Hello'
};

describe('product JSON-LD', () => {
  test('uses absolute images, links the organization and omits unverifiable offers', () => {
    const jsonLd = generateProductJsonLd(product, 'https://zamique.com/');
    const schema = jsonLd['@graph'][0] as Record<string, unknown>;

    expect(schema.image).toEqual(['https://zamique.com/images/products/test-dress.webp']);
    expect(schema.brand).toEqual({ '@id': 'https://zamique.com/#organization' });
    expect(schema.description).not.toBe(product.description);
    expect(schema.description).toContain('confirm current stock');
    expect(schema).not.toHaveProperty('offers');
    expect(schema.additionalProperty).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'MOQ', value: '500 pcs' }),
        expect.objectContaining({ name: 'Listed size references' }),
        expect.objectContaining({ name: 'Listed color references' })
      ])
    );
    expect(schema.additionalProperty).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'Confirm current stock with Jack Fashion on WhatsApp.' })
      ])
    );
  });

  test('adds only current verified product facts to additional properties', () => {
    const claims: ClaimRecord[] = [
      {
        id: 'verified-moq',
        subjectType: 'product',
        subjectId: 'p-1',
        field: 'moq',
        publicValue: '500 pcs',
        status: 'verified',
        evidenceId: 'quote-1',
        verifiedAt: '2026-10-01',
        expiresAt: '2026-10-31'
      },
      {
        id: 'blocked-stock',
        subjectType: 'product',
        subjectId: 'p-1',
        field: 'stock',
        publicValue: 'In stock',
        status: 'blocked',
        evidenceId: 'stale-stock',
        verifiedAt: '2026-10-01'
      }
    ];
    const jsonLd = generateProductJsonLd(
      product,
      'https://zamique.com/',
      new Date('2026-10-05T12:00:00Z'),
      claims
    );
    const schema = jsonLd['@graph'][0] as Record<string, unknown>;

    expect(schema.additionalProperty).toEqual([
      { '@type': 'PropertyValue', name: 'MOQ', value: '500 pcs' }
    ]);
  });
});
