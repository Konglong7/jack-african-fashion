import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

// Protects every /admin page and /api/admin route.
// Unauthenticated requests are redirected to the login page (pages)
// or return 401 (API).

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
