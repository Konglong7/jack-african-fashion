import { describe, expect, test } from 'vitest';
import { absoluteSiteUrl, getSiteOrigin, toAbsoluteImageUrl } from './siteUrl';

describe('site URL helpers', () => {
  test('normalizes a configured origin and removes paths and trailing slashes', () => {
    expect(getSiteOrigin('https://zamique.com/marketing/?ref=test')).toBe('https://zamique.com');
  });

  test('falls back to the canonical site for missing or unsafe values', () => {
    expect(getSiteOrigin('')).toBe('https://zamique.com');
    expect(getSiteOrigin('javascript:alert(1)')).toBe('https://zamique.com');
    expect(getSiteOrigin('not a url')).toBe('https://zamique.com');
  });

  test('builds canonical page and image URLs without duplicate slashes', () => {
    expect(absoluteSiteUrl('/faq', 'https://zamique.com/')).toBe('https://zamique.com/faq');
    expect(toAbsoluteImageUrl('/images/products/dress.webp', 'https://zamique.com/')).toBe(
      'https://zamique.com/images/products/dress.webp'
    );
    expect(toAbsoluteImageUrl('https://cdn.example.com/dress.webp')).toBe(
      'https://cdn.example.com/dress.webp'
    );
  });
});
