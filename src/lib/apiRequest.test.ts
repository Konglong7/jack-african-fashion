import { describe, expect, it } from 'vitest';
import { readFormDataBody, readJsonBody } from './apiRequest';

describe('readJsonBody', () => {
  it('returns a validation error instead of throwing for malformed JSON', async () => {
    const req = new Request('http://localhost/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad json'
    });

    const result = await readJsonBody(req);

    expect(result).toEqual({ ok: false, error: 'Invalid JSON body' });
  });

  it('returns parsed JSON for valid request bodies', async () => {
    const req = new Request('http://localhost/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Dress' })
    });

    const result = await readJsonBody(req);

    expect(result).toEqual({ ok: true, data: { name: 'Test Dress' } });
  });
});

describe('readFormDataBody', () => {
  it('returns a validation error instead of throwing for malformed multipart bodies', async () => {
    const req = new Request('http://localhost/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data; boundary=bad' },
      body: '--not-the-configured-boundary'
    });

    const result = await readFormDataBody(req);

    expect(result).toEqual({ ok: false, error: 'Invalid form data' });
  });
});
