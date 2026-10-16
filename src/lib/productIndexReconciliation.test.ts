import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { Product } from './db';
import { enqueueIndexNow, flushIndexNow } from './indexNow';
import { reconcileProductIndexNow } from './productPublication';

let directory: string;
const originalEnv = { ...process.env };
const products = JSON.parse(await fs.readFile('data/products.json', 'utf8')) as Product[];

beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'jack-product-index-test-'));
  process.env.JACK_FASHION_RUNTIME_DATA_DIR = directory;
  process.env.JACK_FASHION_INDEXNOW_ENABLED = '1';
  process.env.JACK_FASHION_INDEXNOW_KEY_FILE = path.join(directory, 'owner-key.txt');
  process.env.NEXT_PUBLIC_SITE_URL = 'https://zamique.com';
  await fs.writeFile(process.env.JACK_FASHION_INDEXNOW_KEY_FILE, 'a'.repeat(32));
});

afterEach(async () => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  await fs.rm(directory, { recursive: true, force: true });
});

describe('bulk product IndexNow reconciliation', () => {
  it('notifies only products missing from legacy receipts, then tracks later edits', async () => {
    const [existing, added] = products;
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);

    await enqueueIndexNow(['/catalog', `/products/${existing.slug}`], 'legacy-release');
    await flushIndexNow();
    fetcher.mockClear();

    await reconcileProductIndexNow([existing, added]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetcher.mock.calls[0][1].body).urlList).toEqual([
      `https://zamique.com/products/${added.slug}`,
      'https://zamique.com/catalog'
    ]);

    fetcher.mockClear();
    await reconcileProductIndexNow([existing, added]);
    expect(fetcher).not.toHaveBeenCalled();

    const edited = { ...existing, name: `${existing.name} Updated` };
    await reconcileProductIndexNow([edited, added]);
    expect(JSON.parse(fetcher.mock.calls[0][1].body).urlList).toEqual([
      `https://zamique.com/products/${existing.slug}`,
      'https://zamique.com/catalog'
    ]);
  });
});
