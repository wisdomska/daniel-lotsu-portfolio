import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth/token';

/**
 * Guards the CMS. /cms itself is the sign-in screen (it shows the dashboard
 * once signed in), so it is always reachable; every other /cms route and the
 * admin API need a valid session. This is a first line of defence only —
 * every CMS page, server action and route handler re-checks the session.
 */
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isApi = pathname.startsWith('/api/cms');
  const isSignIn = pathname === '/cms';

  if (!isSignIn) {
    const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      if (isApi) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
      const url = req.nextUrl.clone();
      url.pathname = '/cms';
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/cms', '/cms/:path*', '/api/cms/:path*'],
};
