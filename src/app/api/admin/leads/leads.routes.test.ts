import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { createHmac } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { GET, POST } from './route';
import { PATCH } from './[id]/route';
vi.mock('@/lib/db', () => ({ getProducts: async () => [{ id: '1' }, { id: '2' }] }));

const env = { ...process.env };
let directory: string;
beforeEach(async () => {
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'jack-lead-api-'));
  process.env.JACK_FASHION_RUNTIME_DATA_DIR = directory;
  process.env.ADMIN_SECRET = 'private-test-session-key-32-characters-long';
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD = 'local-test-only';
});
afterEach(async () => {
  process.env = { ...env };
  await fs.rm(directory, { recursive: true, force: true });
});
function request(
  method: string,
  body?: unknown,
  authorized = true,
  origin = 'https://zamique.com'
) {
  const expires = String(Date.now() + 60_000);
  const signature = createHmac('sha256', process.env.ADMIN_SECRET!).update(expires).digest('hex');
  const headers = new Headers({ 'Content-Type': 'application/json', origin });
  if (authorized) headers.set('cookie', 'jack_admin_session=' + expires + '.' + signature);
  return new NextRequest('https://zamique.com/api/admin/leads', {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
}
describe('administrator-only enquiry API', () => {
  it('blocks anonymous reads and writes, including individual updates', async () => {
    expect((await GET(request('GET', undefined, false))).status).toBe(401);
    expect((await POST(request('POST', { customer: 'Denied' }, false))).status).toBe(401);
    expect(
      (
        await PATCH(request('PATCH', { notes: 'Denied' }, false), {
          params: Promise.resolve({ id: 'missing' })
        })
      ).status
    ).toBe(401);
    expect(await fs.readdir(directory)).toEqual([]);
  });
  it('requires same-site writes and validates actual style IDs and quantities', async () => {
    expect(
      (await POST(request('POST', { customer: 'Denied' }, true, 'https://foreign.example'))).status
    ).toBe(403);
    expect(
      (await POST(request('POST', { customer: 'Bad style', productIds: ['999'] }))).status
    ).toBe(400);
    expect((await POST(request('POST', { customer: 'Bad quantity', quantity: -1 }))).status).toBe(
      400
    );
    expect(
      (await POST(request('POST', { customer: 'Too large', notes: 'x'.repeat(20_000) }))).status
    ).toBe(400);
    expect(await fs.readdir(directory)).toEqual([]);
  });

  it('accepts a loopback preview whose listener URL is normalized to localhost', async () => {
    const headers = new Headers(request('POST').headers);
    headers.set('origin', 'http://127.0.0.1:3213');
    headers.set('host', '127.0.0.1:3213');
    const local = new NextRequest('http://localhost:3213/api/admin/leads', {
      method: 'POST',
      headers,
      body: JSON.stringify({ customer: 'Preview' })
    });
    expect((await POST(local)).status).toBe(201);
  });
  it('creates, edits and archives a record while preserving the stage dates and private response', async () => {
    const created = await POST(
      request('POST', {
        customer: 'Local API test',
        country: 'Ghana',
        productIds: ['1'],
        quantity: 100
      })
    );
    expect(created.status).toBe(201);
    const { lead } = await created.json();
    const updated = await PATCH(
      request('PATCH', {
        status: 'qualified',
        source: 'google',
        sourceEvidence: 'customer_reported',
        archived: true
      }),
      { params: Promise.resolve({ id: lead.id }) }
    );
    expect(updated.status).toBe(200);
    const next = (await updated.json()).lead;
    expect(next.timeline.new).toBe(lead.timeline.new);
    expect(next.timeline.qualified).toBeTruthy();
    expect(next.archivedAt).toBeTruthy();
    const list = await GET(request('GET'));
    expect(list.headers.get('cache-control')).toBe('private, no-store');
    expect(list.headers.get('x-robots-tag')).toContain('noindex');
    expect((await list.json()).leads).toHaveLength(1);
  });
});
