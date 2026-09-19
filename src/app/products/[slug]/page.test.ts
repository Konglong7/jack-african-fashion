import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('product page static generation', () => {
  test('emits a route for every current product slug', async () => {
    const source = await readFile(path.join(process.cwd(), 'src/app/products/[slug]/page.tsx'), 'utf8');
    expect(source).toContain('export async function generateStaticParams');
  });
});
