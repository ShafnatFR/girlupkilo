import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { validateReimbursementInput } from '@/lib/validation';

/** GET /api/reimbursements — daftar pengajuan milik user yang login. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await query(
    `SELECT * FROM public.reimbursements WHERE user_id = $1 ORDER BY created_at DESC`,
    [user.id]
  );

  return NextResponse.json(rows);
}

/** POST /api/reimbursements — buat pengajuan baru (langsung berstatus submitted). */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const invalid = validateReimbursementInput(body);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  const description =
    typeof body.description === 'string' && body.description.trim()
      ? body.description.trim().slice(0, 2000)
      : null;

  // receipt_url hanya boleh menunjuk ke file yang diunggah lewat aplikasi ini.
  const receipt = typeof body.receipt_url === 'string' ? body.receipt_url : '';
  const receiptUrl = /^\/api\/files\/[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/.test(receipt)
    ? receipt
    : null;

  const rows = await query(
    `INSERT INTO public.reimbursements
       (user_id, title, category, amount, expense_date, description, receipt_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'submitted')
     RETURNING *`,
    [
      user.id,
      String(body.title).trim(),
      String(body.category),
      Number(body.amount),
      String(body.expense_date),
      description,
      receiptUrl,
    ]
  );

  return NextResponse.json(rows[0], { status: 201 });
}
