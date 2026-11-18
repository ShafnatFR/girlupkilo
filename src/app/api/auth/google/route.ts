import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

import { buildGoogleAuthUrl, googleEnabled, OAUTH_STATE_COOKIE, secureCookies } from '@/lib/google';

export const dynamic = 'force-dynamic';

/**
 * Titik masuk "Masuk dengan Google": buat `state` acak, simpan di cookie
 * httpOnly berumur 10 menit, lalu lempar user ke halaman persetujuan Google.
 */
export async function GET() {
  if (!googleEnabled()) {
    return NextResponse.redirect(new URL('/login?error=google_disabled', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }

  const state = crypto.randomBytes(24).toString('base64url');
  const response = NextResponse.redirect(buildGoogleAuthUrl(state));

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies(),
    path: '/',
    maxAge: 600,
  });

  return response;
}
