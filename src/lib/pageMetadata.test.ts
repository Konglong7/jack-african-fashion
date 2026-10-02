import { describe, expect, test } from 'vitest';
import { pageMetadata } from './pageMetadata';

describe('public page metadata', () => {
  test('uses a page-specific canonical and social URL with an absolute preview image', () => {
    const result = pageMetadata('/catalog', 'Wholesale catalog', 'Browse our styles');
    expect(result.alternates?.canonical).toBe('https://zamique.com/catalog');
    expect(result.openGraph).toMatchObject({
      url: 'https://zamique.com/catalog', title: 'Wholesale catalog',
      description: 'Browse our styles',
      images: ['https://zamique.com/images/site/social-whatsapp-catalog-banner.webp']
    });
  });
});
