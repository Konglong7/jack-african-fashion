import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, test } from 'vitest';
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';
import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import nextConfig from '../../next.config';
import { ProductImage } from './ProductImage';

const auditedPhotos = [
  '/images/products/1003068.png',
  '/images/products/1003070.png',
  '/images/products/1003069.png'
];

describe('mobile product photo delivery', () => {
  test.each(auditedPhotos)('serves the complete photo below 800px for the 651px PageSpeed slot: %s', async (src) => {
    const html = renderToStaticMarkup(createElement(
      ImageConfigContext.Provider,
      { value: { ...imageConfigDefault, ...nextConfig.images } },
      createElement(ProductImage, {
        src,
        alt: 'Wholesale dress',
        sizes: '(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 33vw'
      })
    ));
    const image = html.match(/<img\b[^>]*>/)?.[0];
    expect(image).toBeDefined();
    expect(image).toContain('object-contain');
    expect(image).toContain('loading="lazy"');
    const candidates = image!.match(/\bsrcset="([^"]+)"/i)![1].split(',').map((item) => {
      const [url, width] = item.trim().split(/\s+/);
      return { url, width: parseInt(width, 10) };
    });
    const physicalSlot = (412 - 40) * 1.75;
    const candidate = candidates.find((item) => item.width >= physicalSlot)!;
    const bytes = await readFile(path.join(process.cwd(), 'public', candidate.url));
    const original = await sharp(await readFile(path.join(process.cwd(), 'public', src))).metadata();
    const delivered = await sharp(bytes).metadata();
    expect(delivered.width).toBeGreaterThanOrEqual(physicalSlot);
    expect(delivered.width).toBeLessThan(800);
    expect(Math.abs(delivered.width! / delivered.height! / (original.width! / original.height!) - 1)).toBeLessThan(0.004);
  });
});
