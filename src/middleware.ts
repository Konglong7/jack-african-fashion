import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { hasProductSlug } from '@/lib/productRoute';
import { getSiteOrigin } from '@/lib/siteUrl';

// Protects every /admin page and /api/admin route.
// Unauthenticated requests are redirected to the login page (pages)
// or return 401 (API).

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/products' || pathname.startsWith('/products/')) {
    let slug = '';
    try { slug = decodeURIComponent(pathname.slice('/products/'.length)); } catch {}
    if (!slug || !(await hasProductSlug(slug))) {
      // Resolve through the existing top-level 404 page before React streaming
      // starts, while preserving dynamic pages for admin-added products.
      const destination = new URL('/_missing-product', req.url);
      // Next normalizes loopback rewrites to localhost and can proxy them.
      // Our loopback application listener uses HTTP, even when Nginx forwards
      // an HTTPS public request. Keep that hop on the listener's protocol.
      destination.hostname = '127.0.0.1';
      destination.protocol = 'http:';
      const response = NextResponse.rewrite(destination);
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      response.headers.set('Cache-Control', 'private, no-store, max-age=0');
      return response;
    }
    return NextResponse.next();
  }

  // The login page and its API are public
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';
  if (isLoginPage || isLoginApi) {
    return NextResponse.next();
  }

  const authed = await isAuthenticated(req);

  if (!authed) {
    // API routes get a JSON 401
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
    // Pages redirect to login
    const loginUrl = req.nextUrl.clone();
    // Use the configured public origin only for its verified proxy host;
    // local previews retain their local login URL and arbitrary hosts cannot
    // turn this authentication redirect into an external redirect.
    const siteUrl = new URL(getSiteOrigin());
    if (req.headers.get('x-forwarded-host') === siteUrl.host) {
      loginUrl.host = siteUrl.host;
      loginUrl.port = siteUrl.port;
      loginUrl.protocol = siteUrl.protocol;
    }
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/admin/:path*', '/api/admin/:path*', '/products/:path*']
};
