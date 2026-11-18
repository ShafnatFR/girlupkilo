import { NextResponse } from 'next/server';

import { pruneExpiredSessions, verifyPassword, createSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';
import { isValidEmail } from '@/lib/validation';
import type { Profile } from '@/lib/types';

interface UserRow extends Profile {
  password_hash: string | null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!isValidEmail(email) || !password) {
    return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
  }

  let user: UserRow | null = null;
  try {
    user = await queryOne<UserRow>(
      'SELECT id, email, full_name, role, department, password_hash, created_at, updated_at FROM public.users WHERE lower(email) = $1',
      [email]
    );
  } catch (error) {
    console.error('login: gagal query user', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }

  // Pesan error disamakan agar tidak membocorkan email mana yang terdaftar.
  // password_hash NULL berarti akun dibuat lewat Google, jadi tidak bisa login password.
  if (!user || !user.password_hash || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json(
      { error: 'Email atau password salah. Kalau akunmu dibuat lewat Google, pakai tombol "Masuk dengan Google".' },
      { status: 401 }
    );
  }

  await createSession(user.id);
  await pruneExpiredSessions();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  });
}
