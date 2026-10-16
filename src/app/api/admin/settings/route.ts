import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteContent, updateSiteContent } from '@/lib/siteContent';
import { readJsonBody } from '@/lib/apiRequest';
import { notifyPublicChanges } from '@/lib/indexNow';
import { getProducts } from '@/lib/db';
import { MARKET_PAGES, WHOLESALE_PAGES } from '@/lib/aioContent';
import { MARKET_REGIONS } from '@/lib/marketRegions';
import { BUYER_GUIDES } from '@/lib/buyerGuides';

export async function GET() {
  return NextResponse.json({ settings: await getSiteContent() });
}

export async function PUT(req: NextRequest) {
  const body = await readJsonBody(req);
  if (!body.ok) {
    return NextResponse.json({ ok: false, error: body.error }, { status: 400 });
  }

  const before = await getSiteContent();
  const settings = await updateSiteContent(body.data);
  [
    '/',
    '/about',
    '/catalog',
    '/contact',
    '/custom-orders',
    '/faq',
    '/buying-guide',
    '/guides',
    '/markets',
    '/privacy',
    '/terms'
  ].forEach((path) => revalidatePath(path));
  revalidatePath('/markets/[country]', 'page');
  revalidatePath('/wholesale/[category]', 'page');
  revalidatePath('/products/[slug]', 'page');
  revalidatePath('/guides/[slug]', 'page');
  if (JSON.stringify(before) !== JSON.stringify(settings)) {
    // Shared navigation/contact/footer settings are visible on every public page.
    const products = await getProducts();
    const paths = [
      '/',
      '/catalog',
      '/about',
      '/contact',
      '/custom-orders',
      '/faq',
      '/buying-guide',
      '/guides',
      '/markets',
      '/privacy',
      '/terms',
      ...products.map((product) => '/products/' + product.slug),
      ...[...MARKET_PAGES, ...MARKET_REGIONS].map((page) => '/markets/' + page.slug),
      ...WHOLESALE_PAGES.map((page) => '/wholesale/' + page.slug),
      ...BUYER_GUIDES.map((guide) => '/guides/' + guide.slug)
    ];
    await notifyPublicChanges(paths, JSON.stringify(settings));
  }
  return NextResponse.json({ ok: true, settings });
}
