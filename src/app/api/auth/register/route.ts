import { NextResponse } from 'next/server';

import { createSession, hashPassword } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { isValidEmail } from '@/lib/validation';

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!fullName) return NextResponse.json({ error: 'Nama lengkap wajib diisi' }, { status: 400 });
  if (fullName.length > 120) return NextResponse.json({ error: 'Nama terlalu panjang' }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
  }

  try {
    const existing = await queryOne('SELECT 1 FROM public.users WHERE lower(email) = $1', [email]);
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const rows = await query<{ id: string }>(
      `INSERT INTO public.users (email, password_hash, full_name)
       VALUES ($1, $2, $3) RETURNING id`,
      [email, hashPassword(password), fullName]
    );

    await createSession(rows[0].id);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('register: gagal membuat user', error);
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
