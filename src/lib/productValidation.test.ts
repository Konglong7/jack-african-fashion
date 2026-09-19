import { describe, expect, it } from 'vitest';
import { normalizeProductInput } from './productValidation';
import { DEFAULT_PRODUCT_COLORS, DEFAULT_PRODUCT_SIZES } from './productDefaults';

describe('normalizeProductInput', () => {
  it('uses broad default sizes and colors when omitted', () => {
    const result = normalizeProductInput({
      name: 'AI Uploaded Dress',
      category: 'Maxi Dresses'
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.product.sizes).toEqual(DEFAULT_PRODUCT_SIZES);
    expect(result.product.colors).toEqual(DEFAULT_PRODUCT_COLORS);
  });

  it('rejects empty category values', () => {
    const result = normalizeProductInput({
      name: 'Test Dress',
      category: ' '
    });

    if (result.ok) throw new Error('Expected validation to fail');
    expect(result.error).toContain('category');
  });

  it('accepts custom admin-managed categories', () => {
    const result = normalizeProductInput({
      name: 'Linen Dress',
      category: 'Linen Dresses'
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.product.category).toBe('Linen Dresses');
  });

  it('normalizes product fields for persistence', () => {
    const result = normalizeProductInput({
      name: ' Test Dress ',
      slug: '',
      category: 'Pleated Dresses',
      priceMin: '6.8',
      priceMax: '9.5',
      moq: '25',
      moqOptions: ['25', '50', 0],
      colors: [{ name: ' Wine ', hex: '#7B1E3B' }]
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.product.slug).toBe('test-dress');
    expect(result.product.priceMin).toBe(6.8);
    expect(result.product.priceMax).toBe(9.5);
    expect(result.product.moq).toBe(25);
    expect(result.product.moqOptions).toEqual([25, 50]);
    expect(result.product.colors).toEqual([{ name: 'Wine', hex: '#7B1E3B' }]);
  });

  it('normalizes modular detail page fields and removes empty decoration content', () => {
    const result = normalizeProductInput({
      name: 'Boutique Dress',
      category: 'Maxi Dresses',
      detailPage: {
        specs: [
          { label: 'Lead time', value: '7-15 days' },
          { label: 'Empty value', value: ' ' }
        ],
        sizeChart: {
          enabled: true,
          note: 'Manual measurement tolerance: 2-3 cm.',
          rows: [
            { size: 'M', bust: '96', length: '135' },
            { size: '', bust: '', length: '' }
          ]
        },
        materialCare: {
          enabled: true,
          fabric: 'Stretch pleated crepe',
          care: ['Hand wash cold', ' ']
        },
        production: {
          enabled: true,
          leadTime: 'Ready stock ships in 3 days',
          customization: ['Private label', ' '],
          qualityControl: ['Piece-by-piece inspection']
        },
        packagingShipping: {
          enabled: true,
          packing: '1 pc/polybag',
          shipping: 'Air cargo, sea freight, express',
          exportMarkets: ['Nigeria', ' ']
        },
        faq: [
          { question: 'Can I mix sizes?', answer: 'Yes, mixed size ratio is supported.' },
          { question: ' ', answer: 'No question' }
        ],
        detailSections: [
          {
            enabled: true,
            title: 'Boutique-ready presentation',
            body: 'Clean finish for premium racks.',
            image: '/images/products/dress-detail.jpg',
            layout: 'image-left'
          },
          { enabled: true, title: '', body: '', image: '' }
        ]
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.product.detailPage?.specs).toEqual([{ label: 'Lead time', value: '7-15 days' }]);
    expect(result.product.detailPage?.sizeChart?.rows).toEqual([
      { size: 'M', bust: '96', waist: '', hip: '', length: '135' }
    ]);
    expect(result.product.detailPage?.materialCare?.care).toEqual(['Hand wash cold']);
    expect(result.product.detailPage?.production?.customization).toEqual(['Private label']);
    expect(result.product.detailPage?.packagingShipping?.exportMarkets).toEqual(['Nigeria']);
    expect(result.product.detailPage?.faq).toEqual([
      { question: 'Can I mix sizes?', answer: 'Yes, mixed size ratio is supported.' }
    ]);
    expect(result.product.detailPage?.detailSections).toEqual([
      {
        enabled: true,
        title: 'Boutique-ready presentation',
        body: 'Clean finish for premium racks.',
        image: '/images/products/dress-detail.jpg',
        layout: 'image-left'
      }
    ]);
  });

  it('keeps detailPage optional for existing products', () => {
    const result = normalizeProductInput({
      name: 'Legacy Dress',
      category: 'Pleated Dresses'
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.product.detailPage).toBeUndefined();
  });
});
