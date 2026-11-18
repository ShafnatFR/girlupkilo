import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { issueSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import {
  appBaseUrl,
  exchangeCodeForGoogleProfile,
  googleAutoRegisterEnabled,
  googleEnabled,
  isEmailDomainAllowed,
  OAUTH_STATE_COOKIE,
} from '@/lib/google';

export const dynamic = 'force-dynamic';

interface UserRow {
  id: string;
  google_sub: string | null;
}

/** Redirect balik ke /login dengan kode error, sambil menghapus cookie state. */
function fail(reason: string, status = 303) {
  const response = NextResponse.redirect(new URL(`/login?error=${reason}`, appBaseUrl()), status);
  response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}

function sameState(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Callback Google: verifikasi state, tukar code, lalu login/daftarkan user.
 * - google_sub sudah ada        -> login
 * - email sudah ada             -> hubungkan google_sub ke akun itu, login
 * - email belum ada             -> daftar otomatis (kecuali GOOGLE_AUTO_REGISTER=false)
 */
export async function GET(request: Request) {
  if (!googleEnabled()) return fail('google_disabled');

  const url = new URL(request.url);
  if (url.searchParams.get('error')) return fail('google_cancelled');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const jar = await cookies();
  const expectedState = jar.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !expectedState || !sameState(state, expectedState)) {
    return fail('google_state');
  }

  let profile;
  try {
    profile = await exchangeCodeForGoogleProfile(code);
  } catch (error) {
    console.error('google callback: gagal menukar code', error);
    return fail('google_token');
  }

  if (!profile.emailVerified) return fail('google_email');
  if (!isEmailDomainAllowed(profile.email)) return fail('google_domain');

  try {
    let user = await queryOne<UserRow>('SELECT id, google_sub FROM public.users WHERE google_sub = $1', [
      profile.sub,
    ]);

    if (!user) {
      const byEmail = await queryOne<UserRow>(
        'SELECT id, google_sub FROM public.users WHERE lower(email) = $1',
        [profile.email]
      );

      if (byEmail) {
        // Akun Google lain sudah terhubung ke email yang sama: tolak, jangan timpa.
        if (byEmail.google_sub && byEmail.google_sub !== profile.sub) return fail('google_conflict');

        await query(
          'UPDATE public.users SET google_sub = $1, avatar_url = COALESCE($2, avatar_url) WHERE id = $3',
          [profile.sub, profile.picture, byEmail.id]
        );
        user = { ...byEmail, google_sub: profile.sub };
      } else {
        if (!googleAutoRegisterEnabled()) return fail('google_not_registered');

        const rows = await query<UserRow>(
          `INSERT INTO public.users (email, full_name, google_sub, avatar_url, password_hash)
           VALUES ($1, $2, $3, $4, NULL)
           RETURNING id, google_sub`,
          [profile.email, profile.name, profile.sub, profile.picture]
        );
        user = rows[0];
      }
    }

    const session = await issueSession(user.id);
    const response = NextResponse.redirect(new URL('/dashboard', appBaseUrl()), 303);
    response.cookies.set(session.name, session.value, session.options);
    response.cookies.set(OAUTH_STATE_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    console.error('google callback: gagal membuat sesi', error);
    return fail('google_server');
  }
}
