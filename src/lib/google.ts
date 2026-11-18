import 'server-only';

/**
 * Login dengan Google — implementasi OAuth 2.0 Authorization Code tanpa library
 * tambahan (hanya fetch bawaan Node.js), mengikuti gaya auth yang sudah ada:
 * sesi sendiri di PostgreSQL, bukan NextAuth/Supabase.
 *
 * Env yang dibutuhkan:
 *   GOOGLE_CLIENT_ID      dari Google Cloud Console (OAuth 2.0 Client, tipe Web)
 *   GOOGLE_CLIENT_SECRET  pasangannya (jangan pernah dikirim ke browser)
 *   NEXT_PUBLIC_APP_URL   URL publik aplikasi, mis. https://girlup.example.com
 *   GOOGLE_ALLOWED_DOMAINS  opsional, mis. "girlup.id,mail.girlup.id"
 *   GOOGLE_AUTO_REGISTER    opsional; "false" = hanya user yang sudah ada boleh masuk
 */

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const USERINFO_ENDPOINT = 'https://openidconnect.googleapis.com/v1/userinfo';

/** Cookie berumur pendek untuk menyimpan parameter `state` (anti-CSRF). */
export const OAUTH_STATE_COOKIE = 'rg_oauth_state';

export interface GoogleProfile {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture: string | null;
}

export function googleEnabled(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export function secureCookies(): boolean {
  return appBaseUrl().startsWith('https://');
}

/** Harus sama persis dengan yang didaftarkan di Google Cloud Console. */
export function googleRedirectUri(): string {
  return `${appBaseUrl()}/api/auth/google/callback`;
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });

  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Tukar `code` menjadi token, lalu ambil profil user.
 * Userinfo dipanggil langsung ke Google dengan access token (TLS + client secret),
 * jadi tanda tangan ID token tidak perlu diverifikasi ulang secara manual.
 */
export async function exchangeCodeForGoogleProfile(code: string): Promise<GoogleProfile> {
  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: googleRedirectUri(),
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });

  if (!tokenResponse.ok) {
    throw new Error(`tukar code gagal (${tokenResponse.status}): ${await tokenResponse.text()}`);
  }

  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) throw new Error('respons token Google tanpa access_token');

  const infoResponse = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: 'no-store',
  });

  if (!infoResponse.ok) {
    throw new Error(`ambil userinfo gagal (${infoResponse.status}): ${await infoResponse.text()}`);
  }

  const info = (await infoResponse.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };

  if (!info.sub || !info.email) throw new Error('userinfo Google tidak lengkap');

  const email = info.email.trim().toLowerCase();

  return {
    sub: info.sub,
    email,
    emailVerified: info.email_verified === true,
    name: (info.name || email.split('@')[0]).trim().slice(0, 120),
    picture: info.picture ?? null,
  };
}

/** Kalau GOOGLE_ALLOWED_DOMAINS diisi, hanya email dari domain itu yang boleh masuk. */
export function isEmailDomainAllowed(email: string): boolean {
  const raw = (process.env.GOOGLE_ALLOWED_DOMAINS || '').trim();
  if (!raw) return true;

  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  if (!domain) return false;

  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean)
    .some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}

export function googleAutoRegisterEnabled(): boolean {
  return (process.env.GOOGLE_AUTO_REGISTER ?? 'true').toLowerCase() !== 'false';
}
