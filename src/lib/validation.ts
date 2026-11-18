import { EXPENSE_CATEGORIES, type ExpenseCategory, type Profile, type Reimbursement, type ReimbursementWithProfile, type UserRole } from '@/lib/types';

export const APPROVER_ROLES: UserRole[] = ['manager', 'finance', 'admin'];

export function isApprover(role: string): boolean {
  return APPROVER_ROLES.includes(role as UserRole);
}

/** True kalau user boleh melihat semua pengajuan (manajer/keuangan/admin). */
export function canSeeAll(role: string): boolean {
  return isApprover(role);
}

export function isExpenseCategory(value: unknown): value is ExpenseCategory {
  return typeof value === 'string' && (EXPENSE_CATEGORIES as readonly string[]).includes(value);
}

/** Validasi & normalisasi input pengajuan. Mengembalikan pesan error atau null. */
export function validateReimbursementInput(body: Record<string, unknown>): string | null {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const amount = Number(body.amount);
  const date = typeof body.expense_date === 'string' ? body.expense_date : '';

  if (!title) return 'Judul pengajuan wajib diisi';
  if (title.length > 200) return 'Judul pengajuan terlalu panjang';
  if (!isExpenseCategory(body.category)) return 'Kategori tidak valid';
  if (!Number.isFinite(amount) || amount <= 0) return 'Jumlah harus lebih besar dari nol';
  if (amount > 1_000_000_000_000) return 'Jumlah terlalu besar';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return 'Tanggal pengeluaran tidak valid';

  return null;
}

/** Validasi sederhana email. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export type { Profile, Reimbursement, ReimbursementWithProfile };
