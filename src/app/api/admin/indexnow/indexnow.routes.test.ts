import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { createHmac } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { POST } from './route';
import { getIndexNowState } from '@/lib/indexNow';

const env = { ...process.env };
let directory: string;
beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'jack-release-api-'));
  process.env.JACK_FASHION_RUNTIME_DATA_DIR = directory;
  process.env.JACK_FASHION_INDEXNOW_ENABLED = '0';
  process.env.ADMIN_SECRET = 'private-test-session-key-32-characters-long';
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD = 'local-test-only';
  process.env.NEXT_PUBLIC_SITE_URL = 'https://zamique.com';
});
afterEach(async () => {
  process.env = { ...env };
  await fs.rm(directory, { recursive: true, force: true });
});
function request(body?: unknown, authenticated = true) {
  const expiry = String(Date.now() + 60_000);
  const token =
    expiry + '.' + createHmac('sha256', process.env.ADMIN_SECRET!).update(expiry).digest('hex');
  return new NextRequest('https://zamique.com/api/admin/indexnow', {
    method: 'POST',
    headers: {
      origin: 'https://zamique.com',
      ...(authenticated ? { cookie: 'jack_admin_session=' + token } : {})
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}
describe('release notification endpoint', () => {
  it('keeps release updates administrator-only and rejects private or unknown paths', async () => {
    expect((await POST(request({ paths: ['/guides'], change: 'release-1' }, false))).status).toBe(
      401
    );
    expect((await POST(request({ paths: ['/admin/leads'], change: 'release-1' }))).status).toBe(
      400
    );
    expect((await POST(request({ paths: ['/guides/unknown'], change: 'release-1' }))).status).toBe(
      400
    );
    expect((await getIndexNowState()).pending).toHaveLength(0);
  });
  it('queues only current canonical pages and keeps bodyless retry compatible', async () => {
    expect(
      (await POST(request({ paths: ['/guides', '/catalog', '/guides'], change: 'release-1' })))
        .status
    ).toBe(200);
    expect((await getIndexNowState()).pending).toHaveLength(2);
    expect((await POST(request())).status).toBe(200);
    expect((await getIndexNowState()).pending).toHaveLength(2);
  });
  it('normalizes the homepage with or without a trailing slash in a release batch', async () => {
    expect(
      (
        await POST(
          request({
            paths: ['/', 'https://zamique.com', 'https://zamique.com/', '/guides'],
            change: 'release-home'
          })
        )
      ).status
    ).toBe(200);
    const state = await getIndexNowState();
    expect(state.pending.map((entry) => entry.url).sort()).toEqual([
      'https://zamique.com/',
      'https://zamique.com/guides'
    ]);
  });
});
