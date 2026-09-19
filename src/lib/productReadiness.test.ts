import { describe, expect, it } from 'vitest';
import type { Product } from './db';
import { getProductReadiness, getReadinessStatus, getReadinessSummary } from './productReadiness';

function baseProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    slug: 'test-dress',
    name: 'Test Dress',
    category: 'Pleated Dresses',
    image: '/images/products/test-dress.jpg',
    images: ['/images/products/test-dress.jpg', '/images/products/test-dress-2.jpg'],
    moq: 50,
    moqOptions: [50, 100, 300],
    stockType: 'Ready Stock & Custom',
    tags: ['Pleated'],
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Black', hex: '#000000' }],
    description: 'A wholesale dress for boutique buyers.',
    features: ['Soft pleated fabric'],
    whatsappMessage: "Hello Jack, I'm interested in Test Dress.",
    detailPage: undefined,
    ...overrides
  };
}

describe('product readiness', () => {
  it('marks an image-first product as ready without size chart or logistics', () => {
    const product = baseProduct();

    expect(getProductReadiness(product)).toEqual([]);
    expect(getReadinessStatus(product)).toBe('ready');
    expect(getReadinessSummary(product)).toEqual({
      status: 'ready',
      label: 'Ready',
      missing: []
    });
  });

  it('reports missing media and WhatsApp copy for sparse products', () => {
    const product = baseProduct({
      image: '',
      images: [],
      whatsappMessage: ''
    });

    expect(getProductReadiness(product).map((item) => item.label)).toEqual([
      'Cover image',
      'Gallery images',
      'WhatsApp copy'
    ]);
  });

  it('reports needs-info when cover image is missing', () => {
    expect(getReadinessStatus(baseProduct({ image: '' }))).toBe('needs-info');
  });

  it('reports needs-info when WhatsApp copy is missing', () => {
    expect(getReadinessStatus(baseProduct({ whatsappMessage: '' }))).toBe('needs-info');
  });

  it('reports needs-info when only a single cover image is present', () => {
    expect(
      getReadinessStatus(baseProduct({ images: ['/images/products/test-dress.jpg'] }))
    ).toBe('needs-info');
  });

  it('treats a detail section image as gallery coverage', () => {
    const product = baseProduct({
      images: ['/images/products/test-dress.jpg'],
      detailPage: {
        detailSections: [
          {
            enabled: true,
            title: 'Fabric detail',
            body: 'Close-up of pleated texture.',
            image: '/images/products/test-dress-detail.jpg',
            layout: 'image-left'
          }
        ]
      }
    });

    expect(getReadinessStatus(product)).toBe('ready');
  });
});
