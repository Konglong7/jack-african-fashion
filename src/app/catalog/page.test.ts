import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

describe('catalog page caching', () => {
  test('keeps URL filters out of the server page so ISR can cache the catalog', async () => {
    const source = await readFile(path.join(process.cwd(), 'src/app/catalog/page.tsx'), 'utf8');
    expect(source).not.toContain('searchParams');
  });
});
