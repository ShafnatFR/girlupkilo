import { requireUser } from '@/lib/auth';
import { listOwnReimbursements } from '@/lib/reimbursements';
import { formatCurrency } from '@/lib/utils';
import { FileText, CheckCircle, Clock, DollarSign, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { STATUS_LABELS, type Reimbursement } from '@/lib/types';

export default async function DashboardPage() {
  const profile = await requireUser();
  const all = await listOwnReimbursements(profile.id);

  const stats = {
    total: all.length,
    draft: all.filter((r) => r.status === 'draft').length,
    submitted: all.filter((r) => r.status === 'submitted').length,
    approved: all.filter((r) => ['manager_approved', 'finance_approved'].includes(r.status)).length,
    paid: all.filter((r) => r.status === 'paid').length,
    totalAmount: all.reduce((sum, r) => sum + Number(r.amount), 0),
    paidAmount: all
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + Number(r.amount), 0),
  };

  const recent = all.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Halo, {profile.full_name || 'Pengguna'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Berikut ringkasan reimbursement Anda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Pengajuan" value={stats.total.toString()} color="blue" />
        <StatCard
          icon={Clock}
          label="Menunggu Persetujuan"
          value={stats.submitted.toString()}
          color="yellow"
        />
        <StatCard icon={CheckCircle} label="Disetujui" value={stats.approved.toString()} color="green" />
        <StatCard
          icon={DollarSign}
          label="Total Diajukan"
          value={formatCurrency(stats.totalAmount)}
          color="purple"
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold text-slate-900">Pengajuan Terbaru</h2>
          <Link
            href="/dashboard/submissions"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="divide-y">
          {recent.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
              <p className="text-sm text-slate-500">Belum ada pengajuan reimbursement</p>
              <Link href="/dashboard/submissions/new" className="btn-primary mt-4">
                Buat Pengajuan Pertama
              </Link>
            </div>
          ) : (
            recent.map((item: Reimbursement) => (
              <Link
                key={item.id}
                href={`/dashboard/submissions/${item.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.category} • {new Date(item.expense_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(Number(item.amount))}
                  </span>
                  <span
                    className={`badge ${
                      item.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="card p-6">
      <div className={`mb-4 inline-flex rounded-lg p-2 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
