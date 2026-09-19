import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSiteContent, updateSiteContent } from '@/lib/siteContent';
import { readJsonBody } from '@/lib/apiRequest';

export async function GET() {
  return NextResponse.json({ settings: await getSiteContent() });
}

export async function PUT(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: 400 });
  }

  const settings = await updateSiteContent(body.data);
  return NextResponse.json({ ok: true, settings });
}
