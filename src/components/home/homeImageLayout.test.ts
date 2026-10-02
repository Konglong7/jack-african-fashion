import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { SITE_IMAGES } from '../../lib/siteImages';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent } from '../../lib/siteContentTypes';

// Actual layout, layering, responsive columns and link destinations are checked
// in tests/e2e/test_homepage_design.py rather than inferred from CSS class names.
describe('homepage image and content configuration', () => {
  test('keeps the existing hero and all six category photos available', () => {
    const content = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'site-content.json'), 'utf8')
    );
    expect(content.categories).toHaveLength(6);
    for (const image of [
      SITE_IMAGES.hero,
      SITE_IMAGES.trust.showroomExterior,
      ...content.categories.map((category: { image: string }) => category.image)
    ]) {
      expect(existsSync(join(process.cwd(), 'public', image))).toBe(true);
    }
  });

  test('uses the same concise hero description in stored content and fallback content', () => {
    const stored = JSON.parse(
      readFileSync(join(process.cwd(), 'data', 'site-content.json'), 'utf8')
    );
    expect(stored.heroBody).toBe(DEFAULT_SITE_CONTENT.heroBody);
    expect(stored.heroTitle).toBe(DEFAULT_SITE_CONTENT.heroTitle);
    expect(stored.heroAccent).toBe(DEFAULT_SITE_CONTENT.heroAccent);
  });

  test('continues to honor custom homepage content supplied by the administrator', () => {
    const content = normalizeSiteContent({
      heroTitle: 'Custom headline',
      heroAccent: 'Wholesale',
      heroBody: 'Available styles for your store.'
    });
    expect(content.heroTitle).toBe('Custom headline');
    expect(content.heroAccent).toBe('Wholesale');
    expect(content.heroBody).toBe('Available styles for your store.');
  });
});
