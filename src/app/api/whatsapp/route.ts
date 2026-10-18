import { NextRequest, NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/siteContent';
import { getWhatsAppContacts } from '@/lib/siteContentTypes';
import { CONSOLIDATED_WHATSAPP_NUMBER } from '@/lib/whatsappRouter';

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
  // General enquiries always go to Jack, including visitors with an old assignment.
  // Named contact links remain available for buyers choosing another contact.
  const contact =
    contacts.find((item) => item.number === CONSOLIDATED_WHATSAPP_NUMBER) || contacts[0];
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
