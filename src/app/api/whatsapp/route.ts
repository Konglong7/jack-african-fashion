import { randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/siteContent';
import { getWhatsAppContacts } from '@/lib/siteContentTypes';

export const dynamic = 'force-dynamic';
const cookieName = 'jack_whatsapp_contact';
const headers = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
  Vary: 'Cookie'
};

export async function GET(request: NextRequest) {
  if (
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.has('next-router-prefetch')
  ) {
    return new NextResponse(null, { status: 204, headers });
  }
  const contacts = getWhatsAppContacts(await getSiteContent());
  const previousNumber = request.cookies.get(cookieName)?.value;
  const previousContact = contacts.find((item) => item.number === previousNumber);
  // The first configured account is primary. Keep existing conversations stable;
  // new visitors go to the primary account 80% of the time.
  const contact =
    previousContact ||
    (contacts.length === 1 || randomInt(100) < 80
      ? contacts[0]
      : contacts[contacts.length === 2 ? 1 : randomInt(1, contacts.length)]);
  const message = request.nextUrl.searchParams.get('text');
  const target =
    message && /^[1-9]\d{7,14}$/.test(contact.number)
      ? `https://wa.me/${contact.number}?text=${encodeURIComponent(message)}`
      : contact.link;
  const response = NextResponse.redirect(target, { status: 307, headers });
  response.cookies.set(cookieName, contact.number, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/'
  });
  return response;
}
