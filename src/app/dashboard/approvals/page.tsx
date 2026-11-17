import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile, ReimbursementWithProfile } from '@/lib/types';
import { formatCurrency, formatDate, STATUS_STYLES } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/types';
import { CheckSquare, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ApprovalsPage() {
  const profile = (await getProfile()) as Profile | null;
  if (!profile) redirect('/login');

  const supabase = await createClient();

  // Hanya manager, finance, dan admin yang bisa melihat halaman ini
  if (!['manager', 'finance', 'admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Ambil pengajuan yang perlu disetujui berdasarkan role
  let query = supabase
    .from('reimbursements')
    .select(
      '*, profile:profiles!reimbursements_user_id_fkey(full_name, email, department)'
    )
    .neq('status', 'draft')
    .neq('status', 'rejected')
    .neq('status', 'paid');

  // Filter berdasarkan role
  if (profile.role === 'manager') {
    query = query.eq('status', 'submitted');
  } else if (profile.role === 'finance') {
    query = query.in('status', ['manager_approved', 'finance_approved']);
  }
  // admin bisa melihat semua

  const { data: reimbursements } = await query.order('created_at', {
    ascending: false,
  });

  const all = (reimbursements || []) as ReimbursementWithProfile[];

  // Pisahkan berdasarkan status
  const pending = all.filter((r) => {
    if (profile.role === 'manager') return r.status === 'submitted';
    if (profile.role === 'finance')
      return r.status === 'manager_approved' || r.status === 'finance_approved';
    return false;
  });

  const approved = all.filter((r) => {
    if (profile.role === 'manager') return r.status === 'manager_approved';
    if (profile.role === 'finance') return r.status === 'finance_approved';
    return r.status === 'paid';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Persetujuan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola persetujuan reimbursement
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-yellow-100 p-2 text-yellow-600">
            <Clock size={20} />
          </div>
          <p className="text-sm text-slate-500">Menunggu Persetujuan</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {pending.length}
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-2 text-green-600">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm text-slate-500">Sudah Disetujui</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {approved.length}
          </p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-2 text-purple-600">
            <CheckSquare size={20} />
          </div>
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {all.length}
          </p>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="card">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold text-slate-900">
            Menunggu Persetujuan ({pending.length})
          </h2>
        </div>
        <div className="divide-y">
          {pending.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-sm text-slate-500">
                Tidak ada pengajuan yang perlu disetujui
              </p>
            </div>
          ) : (
            pending.map((item) => (
              <ApprovalItem key={item.id} item={item} profile={profile} />
            ))
          )}
        </div>
      </div>

      {/* Recently Approved */}
      {approved.length > 0 && (
        <div className="card">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Baru Disetujui ({approved.length})
            </h2>
          </div>
          <div className="divide-y">
            {approved.map((item) => (
              <ApprovalItem key={item.id} item={item} profile={profile} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalItem({
  item,
  profile,
}: {
  item: ReimbursementWithProfile;
  profile: Profile;
}) {
  const canApprove =
    (profile.role === 'manager' && item.status === 'submitted') ||
    (profile.role === 'finance' &&
      (item.status === 'manager_approved' || item.status === 'finance_approved')) ||
    profile.role === 'admin';

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="min-w-0 flex-1">
        <Link
          href={`/dashboard/submissions/${item.id}`}
          className="font-medium text-slate-900 hover:text-brand-600"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-slate-500">
          {item.profile?.full_name || 'Pengguna'} • {item.profile?.department || 'Departemen'}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="font-semibold text-slate-900">
            {formatCurrency(Number(item.amount))}
          </span>
          <span className={`badge ${STATUS_STYLES[item.status]}`}>
            {STATUS_LABELS[item.status]}
          </span>
          <span className="text-xs text-slate-500">
            {formatDate(item.expense_date)}
          </span>
        </div>
      </div>

      {canApprove && (
        <Link
          href={`/dashboard/approvals/${item.id}`}
          className="btn-primary ml-4"
        >
          Tinjau
        </Link>
      )}
    </div>
  );
}