import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { getProductImageAspect, PRODUCT_IMAGE_DIMENSIONS } from '../lib/productImageDimensions';

const componentsDir = join(process.cwd(), 'src', 'components');

function readComponent(file: string) {
  return readFileSync(join(componentsDir, file), 'utf8');
}

describe('ProductCard full-photo redesign contract', () => {
  const card = readComponent('ProductCard.tsx');

  test('removes outer borders and card drop-shadows', () => {
    expect(card).not.toContain('shadow-sm border border-stone-200');
    expect(card).toContain('bg-white');
  });

  test('merges MOQ and stock status into a single line', () => {
    expect(card).toContain('MOQ: {product.moq} pcs');
    expect(card).toContain('·');
    expect(card).toContain("product.stockType.includes('Ready') ? 'Ready Stock' : 'Custom'");
  });

  test('places WhatsApp and Add to Inquiry buttons side-by-side in a 2-column grid', () => {
    expect(card).toContain('grid grid-cols-2 gap-2');
    expect(card).toContain('WhatsApp');
    expect(card).toContain('InquiryAddButton');
  });

  test('restricts product title to maximum two lines', () => {
    expect(card).toContain('line-clamp-2');
  });

  test('supports dynamic aspect ratio adaptation and dimension index lookup', () => {
    expect(card).toContain('getProductImageAspect');
    expect(card).toContain('setAspect');
    expect(card).toContain('aspectRatio: `${aspect}`');
  });

  test('dimension index covers tall matrices (0.56), square (1.0) and landscape (1.25)', () => {
    const aspects = Object.values(PRODUCT_IMAGE_DIMENSIONS).map((d) => d.aspectRatio);
    expect(aspects.some((a) => a < 0.6)).toBe(true); // 9:16 tall six-color matrices
    expect(aspects.some((a) => a === 0.75)).toBe(true); // 3:4 classic fashion
    expect(aspects.some((a) => a === 1.0)).toBe(true); // 1:1 square
    expect(aspects.some((a) => a > 1.1)).toBe(true); // landscape / wide
    expect(getProductImageAspect('/images/products/elegant-pleated-maxi-dress.webp')).toBe(0.75);
  });

  test('links title to product detail and reserves image container for zoom preview', () => {
    expect(card).toContain('href={`/products/${product.slug}`}');
    expect(card).toContain('onClick={handleOpenZoom}');
    expect(card).toContain('ProductQuickZoomModal');
    expect(card).toContain('handleQuickDownload');
    expect(card).toContain("objectPosition='object-top'");
  });
});
