import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { normalizeProductInput } from './productValidation';

describe('new-70-products.json validation', () => {
  const filePath = path.join(process.cwd(), 'data', 'new-70-products.json');

  it('loads valid JSON with exactly 70 products', () => {
    expect(fs.existsSync(filePath)).toBe(true);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(raw);
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(70);
  });

  it('passes normalizeProductInput for all 70 products', () => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(raw);

    products.forEach((p: Record<string, unknown>, idx: number) => {
      const result = normalizeProductInput(p);
      expect(result.ok, `Product at index ${idx} (id: ${p.id}) failed validation`).toBe(true);
      if (result.ok) {
        expect(result.product.name).toBeTruthy();
        expect(result.product.category).toBeTruthy();
        expect(result.product.slug).toBeTruthy();
        expect(result.product.moq).toBe(100);
        expect(result.product.stockType).toBe('Ready Stock');
        expect(result.product.sizes).toEqual(['XL', 'XXL', '3XL', '4XL', '5XL']);
        expect(result.product.colors.length).toBe(6);
      }
    });
  });

  it('strictly adheres to all B2B core business rules', () => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(raw);

    expect(products[0].id).toBe('69');
    expect(products[69].id).toBe('138');

    for (let i = 0; i < 70; i++) {
      const p = products[i];
      const code = String(1003001 + i);
      const expectedId = String(69 + i);

      expect(p.id).toBe(expectedId);
      expect(p.slug.endsWith(`-${code}`)).toBe(true);
      expect(p.image).toBe(`/images/products/${code}.png`);
      expect(p.images).toEqual([`/images/products/${code}.png`]);
      expect(p.priceMin).toBeNull();
      expect(p.priceMax).toBeNull();
      expect(p.moq).toBe(100);
      expect(p.moqOptions).toEqual([100, 500, 1000, 3000]);
      expect(p.stockType).toBe('Ready Stock');
      expect(p.isNew).toBe(true);
      expect(p.isPopular).toBe(false);
      expect(p.whatsappMessage).toBe(
        `Hi Jack, I want to inquire about Style ${code} (${p.name}). Please share the wholesale quotation, available color mix, and minimum order quantity.`
      );

      // Verify category distribution
      const numCode = 1003001 + i;
      if (numCode <= 1003024) {
        expect(p.category).toBe('Plus Size Dresses');
      } else if (numCode <= 1003044) {
        expect(p.category).toBe('Maxi Dresses');
      } else if (numCode <= 1003060) {
        expect(p.category).toBe('Two Piece Sets');
      } else {
        expect(p.category).toBe('Jumpsuits');
      }

      // Verify image exists in public
      const imgPath = path.join(process.cwd(), 'public', 'images', 'products', `${code}.png`);
      expect(fs.existsSync(imgPath)).toBe(true);
    }
  });
});
