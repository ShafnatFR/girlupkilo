import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

/** Ubah nama & departemen user yang sedang login. */
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const fullName = typeof body.full_name === 'string' ? body.full_name.trim() : '';
  const department = typeof body.department === 'string' ? body.department.trim() : '';

  if (!fullName) return NextResponse.json({ error: 'Nama lengkap wajib diisi' }, { status: 400 });
  if (fullName.length > 120 || department.length > 120) {
    return NextResponse.json({ error: 'Nama atau departemen terlalu panjang' }, { status: 400 });
  }

  const rows = await query(
    `UPDATE public.users SET full_name = $1, department = $2
      WHERE id = $3
      RETURNING id, email, full_name, role, department`,
    [fullName, department, user.id]
  );

  return NextResponse.json({ user: rows[0] });
}
