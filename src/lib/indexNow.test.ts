import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { enqueueIndexNow, flushIndexNow, getIndexNowState } from './indexNow';

let directory: string;
const originalEnv = { ...process.env };
beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'jack-indexnow-test-'));
  process.env.JACK_FASHION_RUNTIME_DATA_DIR = directory;
  process.env.JACK_FASHION_INDEXNOW_ENABLED = '1';
  process.env.JACK_FASHION_INDEXNOW_KEY_FILE = path.join(directory, 'owner-key.txt');
  process.env.NEXT_PUBLIC_SITE_URL = 'https://zamique.com';
  await fs.writeFile(process.env.JACK_FASHION_INDEXNOW_KEY_FILE, 'a'.repeat(32));
});
afterEach(async () => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await fs.rm(directory, { recursive: true, force: true });
});
describe('durable IndexNow update notifications', () => {
  it('uses the prepared public proof when no external key file is configured', async () => {
    delete process.env.JACK_FASHION_INDEXNOW_KEY_FILE;
    vi.spyOn(process, 'cwd').mockReturnValue(directory);
    await fs.mkdir(path.join(directory, 'public'));
    await fs.writeFile(path.join(directory, 'public/indexnow-key.txt'), 'b'.repeat(32));
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 202 }));
    vi.stubGlobal('fetch', fetcher);
    await enqueueIndexNow(['/guides/wholesale-moq'], 'guide-revision');
    await flushIndexNow();
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe('https://api.indexnow.org/indexnow');
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({
      host: 'zamique.com',
      key: 'b'.repeat(32),
      keyLocation: 'https://zamique.com/indexnow-key.txt',
      urlList: ['https://zamique.com/guides/wholesale-moq']
    });
    expect((await getIndexNowState()).receipts[0]).toMatchObject({
      state: 'received',
      httpStatus: 202
    });
  });

  it('keeps a bad or missing explicit key file pending without falling back or transmitting', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    await fs.writeFile(process.env.JACK_FASHION_INDEXNOW_KEY_FILE!, 'invalid key');
    await enqueueIndexNow(['/catalog'], 'key-check');
    await flushIndexNow();
    expect(fetcher).not.toHaveBeenCalled();
    expect((await getIndexNowState()).pending).toHaveLength(1);
    expect((await getIndexNowState()).receipts[0].state).toBe('retry');
  });
  it('deduplicates queued and received changes and records receipt separately from indexing', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    await enqueueIndexNow(['/catalog', '/catalog', '/guides/wholesale-moq'], 'release-1');
    await enqueueIndexNow(['/catalog'], 'release-1');
    expect((await getIndexNowState()).pending).toHaveLength(2);
    await flushIndexNow();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(payload.urlList).toEqual([
      'https://zamique.com/catalog',
      'https://zamique.com/guides/wholesale-moq'
    ]);
    const state = await getIndexNowState();
    expect(state.pending).toHaveLength(0);
    expect(state.receipts[0]).toMatchObject({ httpStatus: 200, state: 'received', urlCount: 2 });
    expect(JSON.stringify(state)).not.toContain('a'.repeat(32));
    await enqueueIndexNow(['/catalog'], 'release-1');
    expect((await getIndexNowState()).pending).toHaveLength(0);
  });
  it('preserves failed notifications for retry and does not lose a later edit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await enqueueIndexNow(['/catalog'], 'revision-1');
    await flushIndexNow();
    expect((await getIndexNowState()).pending[0]).toMatchObject({ attempts: 1 });
    expect((await getIndexNowState()).receipts[0].state).toBe('retry');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        await enqueueIndexNow(['/catalog'], 'revision-2');
        return new Response('', { status: 202 });
      })
    );
    await flushIndexNow({ force: true });
    expect((await getIndexNowState()).pending).toHaveLength(1);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 200 })));
    await flushIndexNow();
    expect((await getIndexNowState()).pending).toHaveLength(0);
  });
  it('rejects foreign and private URLs and skips transmission when disabled', async () => {
    await expect(enqueueIndexNow(['https://other.example/catalog'], 'x')).rejects.toThrow();
    await expect(enqueueIndexNow(['/admin/leads'], 'x')).rejects.toThrow();
    await expect(enqueueIndexNow(['/catalog?sort=newest'], 'x')).rejects.toThrow();
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    await enqueueIndexNow(['/catalog'], 'x');
    process.env.JACK_FASHION_INDEXNOW_ENABLED = '0';
    await flushIndexNow();
    expect(fetcher).not.toHaveBeenCalled();
    expect((await getIndexNowState()).pending).toHaveLength(1);
  });
});
