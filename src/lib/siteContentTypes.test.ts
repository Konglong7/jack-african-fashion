import { describe, expect, test } from 'vitest';
import {
  DEFAULT_SITE_CONTENT,
  isConfiguredSocialLink,
  normalizeSiteContent,
  siteWhatsAppLink,
  siteWhatsAppMessageLink
} from './siteContentTypes';

describe('site content helpers', () => {
  test('preserves generated inquiry text while generic CTAs keep the configured business link', () => {
    const content = normalizeSiteContent({ whatsappNumber: '+86 189 2625 7367' });
    const message = 'Dress & quantity: 500\nhttps://zamique.com/products/example';
    const parsed = new URL(siteWhatsAppMessageLink(content, message));
    expect(parsed.pathname).toBe('/8618926257367');
    expect(parsed.searchParams.get('text')).toBe(message);
    expect(siteWhatsAppLink(content)).toBe(content.whatsappLink);
  });
  test('normalizes editable contact and hero fields', () => {
    const content = normalizeSiteContent({
      whatsappNumber: ' +86 189 2625 7367 ',
      whatsappDisplay: ' +86 189 2625 7367 ',
      whatsappLink: ' https://wa.me/message/3N5VOJCFAQIGO1 ',
      heroTitle: ' African Wholesale '
    });

    expect(content.whatsappNumber).toBe('8618926257367');
    expect(content.whatsappDisplay).toBe('+86 189 2625 7367');
    expect(content.whatsappLink).toBe('https://wa.me/message/3N5VOJCFAQIGO1');
    expect(content.heroTitle).toBe('African Wholesale');
  });

  test('uses the configured WhatsApp deep link for all CTA messages', () => {
    const content = normalizeSiteContent({
      whatsappNumber: '12345',
      whatsappLink: 'https://wa.me/message/3N5VOJCFAQIGO1'
    });

    expect(siteWhatsAppLink(content, 'Hello world')).toBe('https://wa.me/message/3N5VOJCFAQIGO1');
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

describe('isConfiguredSocialLink', () => {
  test('rejects platform homepages and accepts brand profile URLs', () => {
    expect(isConfiguredSocialLink('https://www.facebook.com/')).toBe(false);
    expect(isConfiguredSocialLink('https://www.tiktok.com/')).toBe(false);
    expect(isConfiguredSocialLink('https://www.instagram.com/')).toBe(false);
    expect(isConfiguredSocialLink('https://www.instagram.com/jackafricanfashion')).toBe(true);
    expect(isConfiguredSocialLink('javascript:alert(1)')).toBe(false);
  });
});
