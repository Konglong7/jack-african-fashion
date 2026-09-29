import { describe, expect, test } from 'vitest';
import type { Product } from './db';
import { generateProductJsonLd } from './productJsonLd';

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
    expect(schema).not.toHaveProperty('offers');
  });
});
