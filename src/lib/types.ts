// ============================================================
// Tipe data domain untuk aplikasi Reimburse
// ============================================================

export type UserRole = 'staff' | 'manager' | 'finance' | 'admin';

export type ReimburseStatus =
  | 'draft'
  | 'submitted'
  | 'manager_approved'
  | 'finance_approved'
  | 'rejected'
  | 'paid';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface Reimbursement {
  id: string;
  user_id: string;
  title: string;
  category: string;
  amount: number;
  currency: string;
  expense_date: string;
  description: string | null;
  receipt_url: string | null;
  status: ReimburseStatus;
  rejection_reason: string | null;
  manager_approver: string | null;
  manager_approved_at: string | null;
  finance_approver: string | null;
  finance_approved_at: string | null;
  paid_at: string | null;
  paid_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReimbursementWithProfile extends Reimbursement {
  profile?: Pick<Profile, 'full_name' | 'email' | 'department'> | null;
}

export const EXPENSE_CATEGORIES = [
  'transportasi',
  'makan',
  'penginapan',
  'perlengkapan',
  'perjalanan_dinas',
  'listrik_internet',
  'kesehatan',
  'lainnya',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const STATUS_LABELS: Record<ReimburseStatus, string> = {
  draft: 'Draft',
  submitted: 'Diajukan',
  manager_approved: 'Disetujui Manajer',
  finance_approved: 'Disetujui Keuangan',
  rejected: 'Ditolak',
  paid: 'Dibayar',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  staff: 'Staf',
  manager: 'Manajer',
  finance: 'Keuangan',
  admin: 'Admin',
};

/** Alur status berikutnya untuk approval berjenjang */
export const NEXT_STATUS: Partial<Record<ReimburseStatus, ReimburseStatus>> = {
  submitted: 'manager_approved',
  manager_approved: 'finance_approved',
  finance_approved: 'paid',
};
