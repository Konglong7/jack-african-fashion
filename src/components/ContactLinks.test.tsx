import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SocialLinks, WhatsAppContacts } from './ContactLinks';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContentTypes';

describe('explicit contact links', () => {
  it('shows Jack and sends direct inquiry to his official WhatsApp account', () => {
    const html = renderToStaticMarkup(
      createElement(WhatsAppContacts, { siteContent: DEFAULT_SITE_CONTENT })
    );
    expect(html).toContain('Jack:');
    expect(html).toContain('href="https://wa.me/message/3N5VOJCFAQIGO1"');
    expect(html).toContain('+86 189 2625 7367');
    expect(html).not.toContain('/api/whatsapp');
  });

  it('links accessible social icons to the configured official profiles', () => {
    const html = renderToStaticMarkup(
      createElement(SocialLinks, { siteContent: DEFAULT_SITE_CONTENT })
    );
    for (const platform of ['Facebook', 'Instagram', 'TikTok']) {
      expect(html).toContain(`aria-label="Jack Fashion on ${platform}"`);
    }
    for (const url of Object.values(DEFAULT_SITE_CONTENT.socialLinks)) {
      expect(html).toContain(`href="${url}"`);
    }
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
