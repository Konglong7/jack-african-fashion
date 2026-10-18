import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContentTypes';
import { ProductionProcess } from './ProductionProcess';
import { CargoProofGallery } from './CargoProofGallery';
import { BuyerToolkit } from './BuyerToolkit';

describe('homepage enquiries reach the named default contact', () => {
  test.each([
    ['custom production', ProductionProcess, 1],
    ['cargo', CargoProofGallery, 1],
    ['buyer resources', BuyerToolkit, 3]
  ] as const)('%s preserves the enquiry and addresses Jack through the shared redirect', (_, Component, count) => {
    const html = renderToStaticMarkup(createElement(Component, { siteContent: DEFAULT_SITE_CONTENT }));
    const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].replaceAll('&amp;', '&'));
    expect(links).toHaveLength(count);
    for (const link of links) {
      const url = new URL(link, 'https://zamique.com');
      expect(url.pathname).toMatch(/^\/(8618926257367|api\/whatsapp)$/);
      expect(url.searchParams.get('text')).toMatch(/^Hello Jack,/);
      expect(url.searchParams.get('text')!.length).toBeGreaterThan(40);
    }
  });
});
