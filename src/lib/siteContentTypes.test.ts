import { describe, expect, test } from 'vitest';
import {
  DEFAULT_SITE_CONTENT,
  normalizeSiteContent,
  siteWhatsAppLink
} from './siteContentTypes';

describe('site content helpers', () => {
  test('normalizes editable contact and hero fields', () => {
    const content = normalizeSiteContent({
      whatsappNumber: ' +86 138 0000 0000 ',
      whatsappDisplay: ' +86 138 0000 0000 ',
      heroTitle: ' African Wholesale ',
      socialLinks: { instagram: ' https://instagram.com/jack ' }
    });

    expect(content.whatsappNumber).toBe('8613800000000');
    expect(content.whatsappDisplay).toBe('+86 138 0000 0000');
    expect(content.heroTitle).toBe('African Wholesale');
    expect(content.socialLinks.instagram).toBe('https://instagram.com/jack');
  });

  test('builds whatsapp links from editable content', () => {
    const content = normalizeSiteContent({ whatsappNumber: '12345' });

    expect(siteWhatsAppLink(content, 'Hello world')).toBe('https://wa.me/12345?text=Hello%20world');
  });

  test('normalizes location url with default fallback', () => {
    expect(normalizeSiteContent({ locationUrl: 'not-a-url' }).locationUrl).toBe(
      DEFAULT_SITE_CONTENT.locationUrl
    );
    expect(normalizeSiteContent({ locationUrl: 'https://example.com/maps' }).locationUrl).toBe(
      'https://example.com/maps'
    );
  });

  test('normalizes editable categories', () => {
    const content = normalizeSiteContent({
      categories: [
        {
          name: ' Linen Dresses ',
          image: ' /images/categories/linen.jpg ',
          description: ' Summer '
        },
        { name: ' ', image: '/bad.jpg' }
      ]
    });

    expect(content.categories).toEqual([
      {
        name: 'Linen Dresses',
        image: '/images/categories/linen.jpg',
        description: 'Summer'
      }
    ]);
  });
});
