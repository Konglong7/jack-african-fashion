import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContentTypes';
import { GET } from './route';

const mocks = vi.hoisted(() => ({ getSiteContent: vi.fn(), randomInt: vi.fn() }));
vi.mock('@/lib/siteContent', () => ({ getSiteContent: mocks.getSiteContent }));
vi.mock('node:crypto', () => ({ randomInt: mocks.randomInt }));
const contacts = [
  {
    link: 'https://wa.me/qr/AMLHEDRK4NQTL1',
    number: '8618926257367',
    display: '+86 189 2625 7367'
  },
  {
    link: 'https://wa.me/message/YCF76Z5EEXJIF1',
    number: '8618665055946',
    display: '+86 186 6505 5946'
  }
];
const settings = {
  ...DEFAULT_SITE_CONTENT,
  whatsappLink: contacts[0].link,
  whatsappContacts: contacts
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.getSiteContent.mockResolvedValue(settings);
  mocks.randomInt.mockReturnValue(0);
});

describe('default WhatsApp contact', () => {
  it.each([0, 79, 80, 99])('always sends a new visitor to Jack even for draw %s', async (draw) => {
    mocks.randomInt.mockReturnValue(draw);
    const response = await GET(new NextRequest('https://zamique.com/api/whatsapp'));
    expect(mocks.randomInt).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(contacts[0].link);
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    expect(response.cookies.get('jack_whatsapp_contact')?.value).toBe(contacts[0].number);
  });

  it('keeps the same visitor on the same account even when the enquiry text changes', async () => {
    const message = 'Dress 1003069 & quantity: 200\nDestination: Accra';
    const request = new NextRequest(
      'https://zamique.com/api/whatsapp?text=' + encodeURIComponent(message),
      {
        headers: { cookie: 'jack_whatsapp_contact=8618926257367' }
      }
    );
    const response = await GET(request);
    const url = new URL(response.headers.get('location')!);
    expect(url.pathname).toBe('/8618926257367');
    expect(url.searchParams.get('text')).toBe(message);
    expect(mocks.randomInt).not.toHaveBeenCalled();
  });

  it('ignores an obsolete cookie and never accepts a user-supplied redirect destination', async () => {
    const request = new NextRequest('https://zamique.com/api/whatsapp?url=https://example.com', {
      headers: { cookie: 'jack_whatsapp_contact=not-a-configured-account' }
    });
    expect((await GET(request)).headers.get('location')).toBe(contacts[0].link);
    expect(mocks.randomInt).not.toHaveBeenCalled();
  });

  it('replaces an existing Amber assignment with the requested default Jack', async () => {
    const request = new NextRequest('https://zamique.com/api/whatsapp', {
      headers: { cookie: 'jack_whatsapp_contact=8618665055946' }
    });
    const response = await GET(request);
    expect(response.headers.get('location')).toBe(contacts[0].link);
    expect(response.cookies.get('jack_whatsapp_contact')?.value).toBe(contacts[0].number);
    expect(mocks.randomInt).not.toHaveBeenCalled();
  });

  it('finds Jack even when the configured contact list has Amber first', async () => {
    mocks.getSiteContent.mockResolvedValue({ ...settings, whatsappContacts: [...contacts].reverse(), whatsappLink: contacts[1].link });
    const response = await GET(new NextRequest('https://zamique.com/api/whatsapp'));
    expect(response.headers.get('location')).toBe(contacts[0].link);
  });

  it('does not draw when only one account is configured', async () => {
    mocks.getSiteContent.mockResolvedValue({ ...settings, whatsappContacts: [contacts[0]] });
    const response = await GET(new NextRequest('https://zamique.com/api/whatsapp'));
    expect(response.headers.get('location')).toBe(contacts[0].link);
    expect(mocks.randomInt).not.toHaveBeenCalled();
  });

  it('does not assign a visitor during link prefetch', async () => {
    const response = await GET(
      new NextRequest('https://zamique.com/api/whatsapp', {
        headers: { purpose: 'prefetch' }
      })
    );
    expect(response.status).toBe(204);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(mocks.randomInt).not.toHaveBeenCalled();
  });
});
