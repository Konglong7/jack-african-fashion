import { describe, expect, it } from 'vitest';
import products from '../../data/products.json';
import { buildProductMetaDescription, getPublicProductFacts, toPublicProduct } from './productPublicFacts';
import { generateProductJsonLd } from './productJsonLd';
import type { Product } from './db';

// Reviewed against the actual catalog images, rather than the legacy URL names.
const reviewedStyles = [
  ['3', 'Collared Long-Sleeve Ombre Pleated Midi Style', 'Coordinated Styles'],
  ['69', 'Halter Keyhole Draped Maxi Dress', 'Maxi Dresses'],
  ['70', 'One-Shoulder Floral Ruffle Maxi Dress', 'Maxi Dresses'],
  ['133', 'Halter Cut-Out Draped Maxi Dress', 'Maxi Dresses'],
  ['134', 'One-Shoulder Ruched Slit Maxi Dress', 'Maxi Dresses'],
  ['135', 'Halter Cascade Ruffle Maxi Dress', 'Maxi Dresses'],
  ['136', 'Keyhole Halter Ruched Ruffle Maxi Dress', 'Maxi Dresses'],
  ['137', 'One-Shoulder Ring-Detail Midi Dress', 'Midi Dresses'],
  ['138', 'Halter Cut-Out Ruched Slit Midi Dress', 'Midi Dresses']
];

describe('reviewed priority catalog content', () => {
  it.each(reviewedStyles)('matches the reviewed garment for style %s', (id, name, category) => {
    expect(products.find((product) => product.id === id)).toMatchObject({ name, category });
  });

  it('publishes distinct style details consistently in buyer copy and product schema', () => {
    const descriptions = products.map((item) => {
      const product = item as Product;
      const facts = getPublicProductFacts(product);
      const publicProduct = toPublicProduct(product);
      const schema = generateProductJsonLd(product)['@graph'][0] as Record<string, unknown>;
      expect(facts.description).not.toMatch(/^Catalog reference for/);
      expect(facts.description).toMatch(/wholesale/i);
      expect(facts.features).toHaveLength(3);
      expect(publicProduct.description).toBe(facts.description);
      expect(schema.description).toBe(facts.description);
      expect(facts.description).toBe(product.description);
      expect(facts.features).toEqual(product.features);
      const meta = buildProductMetaDescription(facts.description);
      expect(meta).toMatch(/wholesale/i);
      expect(meta.length).toBeLessThanOrEqual(160);
      if (facts.allowDetailedContent) {
        expect(facts.moq).toContain('WhatsApp');
        expect(facts.stock).toContain('Guangzhou');
      } else {
        expect(facts.moq).toBe('Confirm on WhatsApp');
        expect(facts.stock).toBe('Confirm current batch');
        expect(facts.allowDetailedContent).toBe(false);
      }
      expect(schema).not.toHaveProperty('offers');
      return facts.description;
    });
    expect(new Set(descriptions).size).toBe(products.length);
  });

  it('describes the visible double-breasted blazer without changing its existing URL', () => {
    const blazer = products.find((product) => product.id === '35')!;
    expect(blazer.name).toBe('Double-Breasted Blazer & Tapered Trouser Set');
    expect(blazer.slug).toBe('high-neck-wrap-blouse-a-line-skirt-set-0921023');
    expect(getPublicProductFacts(blazer).features).toContain('Two rows of dark front buttons');
  });

  it.each([
    ['71', 'Square-Neck Hip-Drape Maxi Dress', 'Maxi Dresses'],
    ['77', 'Sleeveless Cowl-Neck Knotted Slit Midi Dress', 'Midi Dresses'],
    ['113', 'High-Neck Shoulder Cut-Out Ruffle Midi Dress', 'Midi Dresses'],
    ['129', 'Long-Sleeve Animal-Stripe Cut-Out Maxi Dress', 'Maxi Dresses'],
    ['131', 'Cross-Halter Leaf-Print Cut-Out Mini Dress', 'Mini Dresses']
  ])('retains the image-reviewed dress classification for style %s', (id, name, category) => {
    expect(products.find((product) => product.id === id)).toMatchObject({ name, category });
  });
});
