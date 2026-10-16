import { NextResponse } from 'next/server';
import { getClientIp, recordAnalyticsEvent } from '@/lib/analyticsStore';
import { analyticsRateLimiter, isTrustedAnalyticsRequest } from '@/lib/analyticsIngress';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const clientIp = getClientIp(req.headers);
  if (!isTrustedAnalyticsRequest(req) || !analyticsRateLimiter.allow(clientIp)) {
    return NextResponse.json({ ok: true, accepted: false });
  }

  let accepted = false;
  try {
    const text = await req.text();
    if (text.length <= 4_096) {
      accepted = await recordAnalyticsEvent(JSON.parse(text), {
        ip: clientIp,
        userAgent: req.headers.get('user-agent') || ''
      });
    }
  } catch {
    // Analytics must never interrupt the visitor's page or WhatsApp action.
  }
  return NextResponse.json({ ok: true, accepted });
}
