import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import { DEFAULT_SITE_CONTENT, getSiteLocations } from '../../lib/siteContentTypes';
import { ContactClient } from './ContactClient';
import { CustomOrdersClient } from '../custom-orders/CustomOrdersClient';

vi.mock('@/components/ResponsiveImage', () => ({ default: () => null }));
vi.mock('@/components/Icons', () => ({ WhatsAppIcon: () => null }));
vi.mock('@/lib/siteContentTypes', () => import('../../lib/siteContentTypes'));
vi.mock('@/lib/siteImages', () => import('../../lib/siteImages'));

describe('direct WhatsApp contact', () => {
  test('uses the configured WhatsApp destination for every contact action without requesting buyer details', () => {
    const siteContent = {
      ...DEFAULT_SITE_CONTENT,
      whatsappLink: 'https://wa.me/message/BUYERCONTACT'
    };
    const html = renderToStaticMarkup(
      createElement(ContactClient, { initialSiteContent: siteContent })
    );
    const destinations = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) =>
      match[1].replace(/&amp;/g, '&')
    );
    expect(
      destinations.filter((href) => href === siteContent.whatsappLink).length
    ).toBeGreaterThanOrEqual(6);
    expect(
      destinations.every(
        (href) =>
          href === siteContent.whatsappLink ||
          Object.values(siteContent.socialLinks).includes(href) ||
          getSiteLocations(siteContent).some((location) => location.mapUrl === href)
      )
    ).toBe(true);
    expect(html).not.toMatch(/<(form|input|textarea|select)\b/);
    expect(html).not.toContain('#contact-form');
    expect(html).toContain('Shop 0081, LIUHUA Market');
    expect(html).toContain('Yulong Fashion Plaza');
  });

  test('lets custom-order buyers send pictures on WhatsApp without filling a form or uploading files', () => {
    const siteContent = {
      ...DEFAULT_SITE_CONTENT,
      whatsappLink: 'https://wa.me/message/CUSTOMCONTACT'
    };
    const html = renderToStaticMarkup(
      createElement(CustomOrdersClient, { initialSiteContent: siteContent })
    );
    const destinations = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1]);
    expect(destinations.length).toBeGreaterThan(0);
    expect(destinations.every((href) => href === siteContent.whatsappLink)).toBe(true);
    expect(html).not.toMatch(/<(form|input|textarea|select)\b/);
  });
});
