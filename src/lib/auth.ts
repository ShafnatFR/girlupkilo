import 'server-only';

import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { query, queryOne } from '@/lib/db';
import type { Profile } from '@/lib/types';

export const SESSION_COOKIE = 'rg_session';
const SESSION_DAYS = 7;

/** true kalau aplikasi disajikan lewat HTTPS (cookie Secure hanya boleh di HTTPS). */
function useSecureCookies(): boolean {
  const url = process.env.NEXT_PUBLIC_APP_URL || '';
  return url.startsWith('https://');
}

// ---------------------------------------------------------------- password

/**
 * Hash password dengan scrypt bawaan Node.js — tanpa dependency tambahan.
 * Format: scrypt$<salt hex>$<hash hex>
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);

  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

/** Token sesi disimpan sebagai hash, jadi bocornya isi tabel tidak berarti bocornya cookie. */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ---------------------------------------------------------------- session

export interface SessionCookie {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    sameSite: 'lax';
    secure: boolean;
    path: string;
    expires: Date;
  };
}

/**
 * Buat sesi di database dan kembalikan cookie-nya tanpa memasangnya.
 * Dipakai route handler yang ingin memasang cookie langsung ke response
 * (mis. callback OAuth yang juga harus menghapus cookie state).
 */
export async function issueSession(userId: string): Promise<SessionCookie> {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await query(
    'INSERT INTO public.sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, hashToken(token), expiresAt]
  );

  return {
    name: SESSION_COOKIE,
    value: token,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      secure: useSecureCookies(),
      path: '/',
      expires: expiresAt,
    },
  };
}

export async function createSession(userId: string): Promise<void> {
  const session = await issueSession(userId);

  const jar = await cookies();
  jar.set(session.name, session.value, session.options);
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await query('DELETE FROM public.sessions WHERE token_hash = $1', [hashToken(token)]);
  }

  jar.delete(SESSION_COOKIE);
}

/** Hapus semua sesi milik user (dipakai setelah ganti password). */
export async function destroyAllSessions(userId: string): Promise<void> {
  await query('DELETE FROM public.sessions WHERE user_id = $1', [userId]);
}

/**
 * User yang sedang login berdasarkan cookie sesi.
 * Di-cache per request supaya halaman yang memanggil berkali-kali tidak query berulang.
 */
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return queryOne<Profile>(
    `SELECT u.id, u.email, u.full_name, u.role, u.department, u.created_at, u.updated_at
       FROM public.sessions s
       JOIN public.users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)]
  );
});

/** Untuk Server Component / Route Handler yang wajib login. */
export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Bersihkan sesi kedaluwarsa (dipanggil sesekali dari route login). */
export async function pruneExpiredSessions(): Promise<void> {
  await query('DELETE FROM public.sessions WHERE expires_at < now()');
}
