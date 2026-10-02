import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { ProductImage } from './ProductImage';

describe('product photos', () => {
  test('preserves the complete photo by default and permits explicit cover for artwork', () => {
    const props = { src: '/images/products/example.webp', alt: 'Example dress' };
    expect(renderToStaticMarkup(createElement(ProductImage, props))).toContain('object-contain');
    expect(renderToStaticMarkup(createElement(ProductImage, { ...props, objectFit: 'cover' })))
      .toContain('object-cover');
  });

  test.each(['//untrusted.example/image.jpg', 'https://untrusted.example/image.jpg', 'broken.jpg'])
  ('falls back without crashing rendering for unsupported image source %s', (src) => {
    const html = renderToStaticMarkup(createElement(ProductImage, { src, alt: 'Unavailable dress' }));
    expect(html).toContain('Unavailable dress');
    expect(html).not.toContain('<img');
  });
});
