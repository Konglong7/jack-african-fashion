import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/siteContent';

export async function GET() {
  return NextResponse.json({ settings: await getSiteContent() });
}
