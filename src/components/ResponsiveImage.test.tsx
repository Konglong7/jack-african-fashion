import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import ResponsiveImage from './ResponsiveImage';

const photo = {
  src: '/images/site/08-custom-orders.webp',
  alt: 'Custom womenswear wholesale reference',
  fill: true,
  sizes: '100vw'
};

describe('responsive image delivery', () => {
  test('emits intrinsic dimensions while retaining the reserved fill layout', () => {
    const html = renderToStaticMarkup(createElement(ResponsiveImage, photo));
    expect(html).toMatch(/<img[^>]*width="[1-9]\d*"/);
    expect(html).toMatch(/<img[^>]*height="[1-9]\d*"/);
    expect(html).toContain('position:absolute');
    expect(html).toContain('width:100%');
    expect(html).toContain('height:100%');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain(`alt="${photo.alt}"`);
  });

  test('marks the primary image high priority and leaves it out of lazy loading', () => {
    const html = renderToStaticMarkup(createElement(ResponsiveImage, { ...photo, priority: true }));
    expect(html).toMatch(/<img[^>]*fetchPriority="high"/i);
    expect(html).not.toContain('loading="lazy"');
  });

  test('keeps new uploads without prepared dimensions renderable', () => {
    const html = renderToStaticMarkup(
      createElement(ResponsiveImage, {
        ...photo,
        src: '/images/products/new-upload.webp'
      })
    );
    expect(html).toContain('<img');
    expect(html).toContain('position:absolute');
    expect(html).toContain('/_next/image?');
  });
});
