import { NextResponse, type NextRequest } from 'next/server';
import { isAuthenticated } from './auth';
import { getSiteOrigin } from './siteUrl';

export function privateLeadResponse(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }
  });
}
export async function guardLeadRequest(req: NextRequest, write = false) {
  if (!(await isAuthenticated(req))) {
    return privateLeadResponse({ ok: false, error: 'Unauthorized' }, 401);
  }
  const origin = req.headers.get('origin');
  const allowedOrigins = new Set([req.nextUrl.origin, getSiteOrigin()]);
  // Next can normalize a loopback listener URL to localhost.
  const loopbacks = new Set(['localhost', '127.0.0.1', '[::1]']);
  if (loopbacks.has(req.nextUrl.hostname)) {
    try {
      const incoming = new URL(req.nextUrl.protocol + '//' + req.headers.get('host'));
      if (loopbacks.has(incoming.hostname) && incoming.port === req.nextUrl.port) {
        allowedOrigins.add(incoming.origin);
      }
    } catch {}
  }
  if (write && origin && !allowedOrigins.has(origin)) {
    return privateLeadResponse({ ok: false, error: 'Invalid request origin' }, 403);
  }
  return null;
}
export async function readLeadBody(req: NextRequest): Promise<Record<string, unknown>> {
  if (Number(req.headers.get('content-length')) > 16_384) throw new Error('Record is too large');
  const text = await req.text();
  if (Buffer.byteLength(text, 'utf-8') > 16_384) throw new Error('Record is too large');
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON body');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid record');
  return data as Record<string, unknown>;
}
