import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { listApprovals } from '@/lib/reimbursements';
import { formatCurrency, formatDate, STATUS_STYLES } from '@/lib/utils';
import { STATUS_LABELS, type ReimbursementWithProfile } from '@/lib/types';
import { CheckSquare, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ApprovalsPage() {
  const profile = await requireUser();

  if (!['manager', 'finance', 'admin'].includes(profile.role)) {
    redirect('/portal');
  }

  const all = await listApprovals(profile.role);

  const pending = all.filter((r) => {
    if (profile.role === 'manager') return r.status === 'submitted';
    if (profile.role === 'finance')
      return r.status === 'manager_approved' || r.status === 'finance_approved';
    return ['submitted', 'manager_approved', 'finance_approved'].includes(r.status);
  });

  const approved = all.filter((r) => {
    if (profile.role === 'manager') return r.status === 'manager_approved';
    if (profile.role === 'finance') return r.status === 'finance_approved' || r.status === 'paid';
    return r.status === 'paid';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Persetujuan</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola persetujuan reimbursement</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Menunggu Persetujuan</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{pending.length}</p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sudah Disetujui</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{approved.length}</p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <CheckSquare size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{all.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700/60">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">
            Menunggu Persetujuan ({pending.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700/60">
          {pending.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-500" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tidak ada pengajuan yang perlu disetujui
              </p>
            </div>
          ) : (
            pending.map((item) => <ApprovalItem key={item.id} item={item} />)
          )}
        </div>
      </div>

      {approved.length > 0 && (
        <div className="card">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700/60">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200">Baru Disetujui ({approved.length})</h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {approved.map((item) => (
              <ApprovalItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ApprovalItem({ item }: { item: ReimbursementWithProfile }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="min-w-0 flex-1">
        <Link
          href={`/portal/keuangan/submissions/${item.id}`}
          className="font-medium text-slate-800 hover:text-brand-600 dark:text-slate-200 dark:hover:text-brand-400"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {item.profile?.full_name || 'Pengguna'} • {item.profile?.department || 'Departemen'}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {formatCurrency(Number(item.amount))}
          </span>
          <span className={`badge ${STATUS_STYLES[item.status]}`}>{STATUS_LABELS[item.status]}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(item.expense_date)}</span>
        </div>
      </div>

      <Link href={`/portal/keuangan/approvals/${item.id}`} className="btn-primary ml-4">
        Tinjau
      </Link>
    </div>
  );
}
