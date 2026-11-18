import { NextResponse } from 'next/server';

import { createSession, destroyAllSessions, getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

/** Ganti password user yang sedang login. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const currentPassword = typeof body.current_password === 'string' ? body.current_password : '';
  const newPassword = typeof body.new_password === 'string' ? body.new_password : '';

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'Password baru minimal 8 karakter' }, { status: 400 });
  }

  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM public.users WHERE id = $1',
    [user.id]
  );
  if (!row || !verifyPassword(currentPassword, row.password_hash)) {
    return NextResponse.json({ error: 'Password saat ini salah' }, { status: 400 });
  }

  await query('UPDATE public.users SET password_hash = $1 WHERE id = $2', [
    hashPassword(newPassword),
    user.id,
  ]);

  // Sesi lama dicabut, lalu sesi baru dibuat untuk perangkat ini.
  await destroyAllSessions(user.id);
  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
