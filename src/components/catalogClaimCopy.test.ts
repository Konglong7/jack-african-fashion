import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

describe('catalog claim-safe labels', () => {
  test('does not imply universal ready stock or confirmed dispatch', () => {
    const catalog = readFileSync(
      join(process.cwd(), 'src', 'app', 'catalog', 'CatalogClient.tsx'),
      'utf8'
    );
    const trust = readFileSync(
      join(process.cwd(), 'src', 'components', 'home', 'AfricaTrustStrip.tsx'),
      'utf8'
    );

    expect(catalog).not.toMatch(/>\s*Ready Stock\s*</i);
    expect(catalog).not.toContain('Dispatch after confirmation');
    expect(trust).not.toContain("title: 'Dispatch After Confirmation'");
  });
});
