import 'server-only';

import { query, queryOne } from '@/lib/db';
import { canSeeAll } from '@/lib/validation';
import type { Profile, Reimbursement, ReimbursementWithProfile } from '@/lib/types';

const REIMBURSE_COLUMNS = `r.id, r.user_id, r.title, r.category, r.amount, r.currency,
  r.expense_date, r.description, r.receipt_url, r.status, r.rejection_reason,
  r.manager_approver, r.manager_approved_at, r.finance_approver, r.finance_approved_at,
  r.paid_at, r.paid_by, r.created_at, r.updated_at`;

/** Semua pengajuan milik satu user. */
export function listOwnReimbursements(userId: string): Promise<Reimbursement[]> {
  return query<Reimbursement>(
    `SELECT ${REIMBURSE_COLUMNS} FROM public.reimbursements r
      WHERE r.user_id = $1 ORDER BY r.created_at DESC`,
    [userId]
  );
}

/** Semua pengajuan (untuk laporan). Staff hanya melihat miliknya sendiri. */
export function listReimbursementsForUser(user: Profile): Promise<Reimbursement[]> {
  if (canSeeAll(user.role)) {
    return query<Reimbursement>(
      `SELECT ${REIMBURSE_COLUMNS} FROM public.reimbursements r ORDER BY r.created_at DESC`
    );
  }
  return listOwnReimbursements(user.id);
}

/** Detail satu pengajuan, dengan pengecekan hak akses. */
export async function getReimbursementForUser(
  id: string,
  user: Profile
): Promise<Reimbursement | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const row = await queryOne<Reimbursement>(
    `SELECT ${REIMBURSE_COLUMNS} FROM public.reimbursements r WHERE r.id = $1`,
    [id]
  );
  if (!row) return null;
  if (row.user_id !== user.id && !canSeeAll(user.role)) return null;

  return row;
}

/** Daftar pengajuan yang relevan untuk approver sesuai role-nya. */
export function listApprovals(role: string): Promise<ReimbursementWithProfile[]> {
  const statusFilter =
    role === 'manager'
      ? `AND r.status IN ('submitted', 'manager_approved')`
      : role === 'finance'
        ? `AND r.status IN ('manager_approved', 'finance_approved', 'paid')`
        : `AND r.status <> 'draft'`;

  return query<ReimbursementWithProfile & { owner_full_name: string; owner_email: string; owner_department: string }>(
    `SELECT ${REIMBURSE_COLUMNS}, u.full_name AS owner_full_name, u.email AS owner_email,
            u.department AS owner_department
       FROM public.reimbursements r
       JOIN public.users u ON u.id = r.user_id
      WHERE r.status <> 'rejected' ${statusFilter}
      ORDER BY r.created_at DESC`
  ).then((rows) =>
    rows.map((row) => {
      const { owner_full_name, owner_email, owner_department, ...rest } = row;
      return {
        ...rest,
        profile: {
          full_name: owner_full_name,
          email: owner_email,
          department: owner_department,
        },
      } as ReimbursementWithProfile;
    })
  );
}
