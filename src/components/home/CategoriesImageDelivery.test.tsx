import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import nextConfig from '../../../next.config';
import { Categories } from './Categories';

function imageAttributes(src: string) {
  const html = renderToStaticMarkup(
    createElement(
      ImageConfigContext.Provider,
      { value: { ...imageConfigDefault, ...nextConfig.images } },
      createElement(Categories, { categories: [{ name: 'Plus Size Dresses', image: src }] })
    )
  );
  const image = html.match(/<img\b[^>]*>/)?.[0];
  if (!image) throw new Error('Category photo did not render');
  const sizes = image.match(/\bsizes="([^"]+)"/)?.[1];
  const srcSet = image.match(/\bsrcSet="([^"]+)"/i)?.[1];
  if (!sizes || !srcSet) throw new Error('Responsive candidates are missing');
  return { html, image, sizes, srcSet };
}

function declaredWidth(sizes: string, viewport: number): number {
  for (const part of sizes.split(',')) {
    const condition = part.trim().match(/^\(max-width: (\d+)px\) (.+)$/);
    if (condition && viewport > Number(condition[1])) continue;
    const value = condition ? condition[2] : part.trim();
    const calc = value.match(/^calc\(([\d.]+)vw - ([\d.]+)px\)$/);
    if (calc) return Number(calc[1]) * viewport / 100 - Number(calc[2]);
    if (value.endsWith('vw')) return parseFloat(value) * viewport / 100;
    if (value.endsWith('px')) return parseFloat(value);
    throw new Error(`Unsupported published sizes value: ${value}`);
  }
  throw new Error('No matching image size');
}

describe('category photo delivery', () => {
  test('matches the 143px visible photo measured by mobile PageSpeed at 412px and DPR 1.75', () => {
    const { sizes, srcSet } = imageAttributes('/images/products/0921056.webp');
    const physicalWidth = declaredWidth(sizes, 412) * 1.75;
    expect(Math.abs(physicalWidth - 143)).toBeLessThan(2);
    const candidates = srcSet.split(',').map((entry) => {
      const [url, width] = entry.trim().split(/\s+/);
      return { url, width: parseInt(width, 10) };
    });
    const selected = candidates.find((entry) => entry.width >= physicalWidth);
    expect(selected?.url).toMatch(/-160\.webp$/);
  });

  test('retains the complete photo, its dimensions and lazy loading', () => {
    const { image } = imageAttributes('/images/products/0921056.webp');
    expect(image).toContain('object-fit:contain');
    expect(image).toContain('width="941"');
    expect(image).toContain('height="1672"');
    expect(image).toContain('loading="lazy"');
  });

  test('keeps newly uploaded images without known dimensions supported', () => {
    const { image, sizes } = imageAttributes('/images/products/new-category-upload.webp');
    expect(image).toContain('/_next/image?');
    expect(declaredWidth(sizes, 412)).toBeCloseTo(116, 1);
    expect(declaredWidth(sizes, 1440)).toBeCloseTo(194.6667, 1);
  });

  test.each([
    '/images/site/01-hero-banner.webp',
    '/images/site/jack-fashion-logo-192.png'
  ])('preserves the full grid width for wide or square photos: %s', (src) => {
    const { sizes } = imageAttributes(src);
    expect(declaredWidth(sizes, 320)).toBeCloseTo(85.3333, 1);
    expect(declaredWidth(sizes, 768)).toBeCloseTo(108, 1);
    expect(declaredWidth(sizes, 1024)).toBeCloseTo(145.3333, 1);
    expect(declaredWidth(sizes, 1440)).toBeCloseTo(194.6667, 1);
  });
});
