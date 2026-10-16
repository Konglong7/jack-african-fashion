import { existsSync, readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FactoryGallery } from './FactoryGallery';
import { FACTORY_PHOTOS } from '@/lib/factoryPhotos';

describe('factory photography', () => {
  it('renders all four photographs with matching visible and structured descriptions', () => {
    const html = renderToStaticMarkup(<FactoryGallery path='/about' />);
    const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    expect(raw).toBeTruthy();
    const schema = JSON.parse(raw!);
    expect(schema.image).toHaveLength(4);
    expect((html.match(/<figure\b/g) || []).length).toBe(4);
    for (const photo of FACTORY_PHOTOS) {
      expect(html).toContain(`alt="${photo.alt}"`);
      expect(html).toContain(photo.caption);
      expect(schema.image).toContainEqual(
        expect.objectContaining({
          contentUrl: `https://zamique.com${photo.src}`,
          caption: photo.caption,
          width: 1448,
          height: 1086
        })
      );
    }
    expect(JSON.stringify(schema)).not.toMatch(
      /contentLocation|latitude|longitude|aggregateRating|certification/
    );
  });

  it('keeps the homepage preview short with a direct link to the complete factory section', () => {
    const html = renderToStaticMarkup(<FactoryGallery path='/' compact />);
    expect((html.match(/<figure\b/g) || []).length).toBe(2);
    expect(html).toContain('href="/about#factory-workshop"');
    expect(html).not.toContain('<form');
    expect(html).toContain('/images/optimized/');
    expect(html).not.toContain('/_next/image?');
  });

  it('has prepared static variants for every photograph without removing existing assets', () => {
    const variants = JSON.parse(readFileSync('src/lib/generated/imageVariants.json', 'utf8'));
    for (const photo of FACTORY_PHOTOS) {
      expect(existsSync(`public${photo.src}`)).toBe(true);
      expect(Object.keys(variants[photo.src])).toEqual(
        expect.arrayContaining(['64', '160', '320', '480', '640', '768', '960', '1280', '1920'])
      );
      for (const variant of Object.values(variants[photo.src])) {
        expect(existsSync(`public${variant}`)).toBe(true);
      }
    }
  });
});
