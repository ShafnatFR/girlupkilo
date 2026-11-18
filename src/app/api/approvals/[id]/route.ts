import { NextResponse, type NextRequest } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { isApprover } from '@/lib/validation';
import type { Reimbursement } from '@/lib/types';

type Update = {
  status: Reimbursement['status'];
  manager_approver?: string;
  manager_approved_at?: string;
  finance_approver?: string;
  finance_approved_at?: string;
  paid_at?: string;
  paid_by?: string;
  rejection_reason?: string;
};

/** PATCH /api/approvals/[id] — setujui atau tolak pengajuan. */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isApprover(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const action = body.action;
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  }

  const reimbursement = await queryOne<Reimbursement>(
    'SELECT * FROM public.reimbursements WHERE id = $1',
    [id]
  );
  if (!reimbursement) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const now = new Date().toISOString();
  let update: Update | null = null;

  if (action === 'reject') {
    if (['paid', 'rejected'].includes(reimbursement.status)) {
      return NextResponse.json({ error: 'Pengajuan ini sudah final' }, { status: 409 });
    }
    const reason = typeof body.rejection_reason === 'string' ? body.rejection_reason.trim() : '';
    if (!reason) return NextResponse.json({ error: 'Alasan penolakan wajib diisi' }, { status: 400 });
    update = { status: 'rejected', rejection_reason: reason.slice(0, 1000) };
  } else if (reimbursement.status === 'submitted' && ['manager', 'admin'].includes(user.role)) {
    update = { status: 'manager_approved', manager_approver: user.id, manager_approved_at: now };
  } else if (reimbursement.status === 'manager_approved' && ['finance', 'admin'].includes(user.role)) {
    update = { status: 'finance_approved', finance_approver: user.id, finance_approved_at: now };
  } else if (reimbursement.status === 'finance_approved' && ['finance', 'admin'].includes(user.role)) {
    update = { status: 'paid', paid_at: now, paid_by: user.id };
  }

  if (!update) {
    return NextResponse.json(
      { error: 'Kamu tidak berwenang menyetujui pengajuan pada tahap ini' },
      { status: 403 }
    );
  }

  const entries = Object.entries(update);
  const sets = entries.map(([key], index) => `${key} = $${index + 2}`);
  const rows = await query<Reimbursement>(
    `UPDATE public.reimbursements SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...entries.map(([, value]) => value)]
  );

  return NextResponse.json(rows[0]);
}
