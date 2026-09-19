import { NextResponse } from 'next/server';
import { getClientIp, recordAnalyticsEvent } from '@/lib/analyticsStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (text.length <= 4_096) {
      await recordAnalyticsEvent(JSON.parse(text), {
        ip: getClientIp(req.headers),
        userAgent: req.headers.get('user-agent') || ''
      });
    }
  } catch {
    // Analytics must never interrupt the visitor's page or WhatsApp action.
  }
  return NextResponse.json({ ok: true });
}
