import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'rg_session';

/**
 * Middleware hanya memeriksa ADA-TIDAKNYA cookie sesi (tanpa akses database,
 * karena middleware berjalan sebelum runtime Node). Keabsahan sesi diperiksa
 * di layout dashboard lewat getCurrentUser().
 */
export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const { pathname } = request.nextUrl;

  if (!hasSession && pathname.startsWith('/portal')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasSession && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/login', '/register'],
};
