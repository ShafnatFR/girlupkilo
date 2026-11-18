import { NextResponse, type NextRequest } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import type { Reimbursement } from '@/lib/types';

async function loadOwned(id: string, userId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return queryOne<Reimbursement>(
    'SELECT * FROM public.reimbursements WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
}

/** GET /api/reimbursements/[id] */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const row = /^[0-9a-f-]{36}$/i.test(id)
    ? await queryOne<Reimbursement>('SELECT * FROM public.reimbursements WHERE id = $1', [id])
    : null;

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (row.user_id !== user.id && !['manager', 'finance', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(row);
}

/** PATCH /api/reimbursements/[id] — hanya draft milik sendiri yang boleh diubah. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const existing = await loadOwned(id, user.id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (existing.status !== 'draft') {
    return NextResponse.json({ error: 'Hanya draft yang bisa diubah' }, { status: 409 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  // Hanya kolom aman yang bisa diubah dari klien.
  const allowed: Record<string, unknown> = {};
  if (typeof body.title === 'string') allowed.title = body.title.trim().slice(0, 200);
  if (typeof body.category === 'string') allowed.category = body.category;
  if (body.amount !== undefined) allowed.amount = Number(body.amount);
  if (typeof body.expense_date === 'string') allowed.expense_date = body.expense_date;
  if (body.description !== undefined) {
    allowed.description = typeof body.description === 'string' ? body.description.slice(0, 2000) : null;
  }
  allowed.status = body.status === 'submitted' ? 'submitted' : 'draft';

  const entries = Object.entries(allowed);
  const sets = entries.map(([key], index) => `${key} = $${index + 3}`);
  const rows = await query<Reimbursement>(
    `UPDATE public.reimbursements SET ${sets.join(', ')}
      WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, user.id, ...entries.map(([, value]) => value)]
  );

  return NextResponse.json(rows[0]);
}

/** DELETE /api/reimbursements/[id] — hanya draft milik sendiri. */
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const rows = await query(
    `DELETE FROM public.reimbursements
      WHERE id = $1 AND user_id = $2 AND status = 'draft' RETURNING id`,
    [id, user.id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Tidak ditemukan atau sudah diajukan' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
