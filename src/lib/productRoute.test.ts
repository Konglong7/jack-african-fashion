import { mkdtemp, writeFile, rename, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test, expect } from 'vitest';
import { hasProductSlug } from './productRoute';

test('route checks follow newly added and removed products after atomic updates', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'zamique-product-route-'));
  const file = path.join(directory, 'products.json');
  try {
    await writeFile(file, JSON.stringify([{ slug: 'existing-style' }]));
    expect(await hasProductSlug('existing-style', file)).toBe(true);
    expect(await hasProductSlug('new-style', file)).toBe(false);
    const replacement = path.join(directory, 'replacement.json');
    await writeFile(replacement, JSON.stringify([{ slug: 'new-style' }]));
    await rename(replacement, file);
    expect(await hasProductSlug('new-style', file)).toBe(true);
    expect(await hasProductSlug('existing-style', file)).toBe(false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
