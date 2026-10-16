import { describe, expect, test } from 'vitest';
import { pageMetadata } from './pageMetadata';

describe('public page metadata', () => {
  test.each(['/', '/catalog', '/guides/wholesale-moq', '/products/print-dress'])(
    'points English and default language links to the canonical page for %s',
    (path) => {
      const result = pageMetadata(path, 'Wholesale womenswear', 'Buyer information');
      expect(result.alternates?.languages).toEqual({
        en: `https://zamique.com${path}`,
        'x-default': `https://zamique.com${path}`
      });
    }
  );

  test('uses a page-specific canonical and social URL with an absolute preview image', () => {
    const result = pageMetadata('/catalog', 'Wholesale catalog', 'Browse our styles');
    expect(result.alternates?.canonical).toBe('https://zamique.com/catalog');
    expect(result.openGraph).toMatchObject({
      url: 'https://zamique.com/catalog',
      title: 'Wholesale catalog',
      description: 'Browse our styles',
      images: ['https://zamique.com/images/site/jack-fashion-social.png']
    });
  });
});
