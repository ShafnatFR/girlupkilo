import { requireUser } from '@/lib/auth';
import { listReimbursementsForUser } from '@/lib/reimbursements';
import { formatCurrency } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/types';
import { DollarSign, CheckCircle, Clock } from 'lucide-react';

export default async function ReportsPage() {
  const profile = await requireUser();
  const all = await listReimbursementsForUser(profile);

  const byCategory = all.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  const byStatus = all.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byMonth = all.reduce(
    (acc, item) => {
      const month = String(item.expense_date).substring(0, 7);
      acc[month] = (acc[month] || 0) + Number(item.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  const totalAmount = all.reduce((sum, r) => sum + Number(r.amount), 0);
  const paidAmount = all
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const pendingAmount = all
    .filter((r) => !['paid', 'rejected', 'draft'].includes(r.status))
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Laporan</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Statistik dan analisis reimbursement
          {['manager', 'finance', 'admin'].includes(profile.role) ? ' seluruh perusahaan' : ' Anda'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <DollarSign size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Diajukan</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sudah Dibayar</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{formatCurrency(paidAmount)}</p>
        </div>
        <div className="card p-6">
          <div className="mb-4 inline-flex rounded-lg bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock size={20} />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Menunggu Persetujuan</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">{formatCurrency(pendingAmount)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Pengeluaran per Kategori</h2>
          <div className="space-y-4">
            {Object.entries(byCategory).length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data</p>
            )}
            {Object.entries(byCategory).map(([category, amount]) => {
              const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
              return (
                <div key={category}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                      {category.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/40">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Pengajuan per Status</h2>
          <div className="space-y-3">
            {Object.entries(byStatus).length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data</p>
            )}
            {Object.entries(byStatus).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-700/30"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                </span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Tren Pengeluaran per Bulan</h2>
          <div className="space-y-3">
            {Object.entries(byMonth).length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada data</p>
            )}
            {Object.entries(byMonth)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([month, amount]) => {
                const maxAmount = Math.max(...Object.values(byMonth));
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                return (
                  <div key={month}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {new Date(month + '-01').toLocaleDateString('id-ID', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{formatCurrency(amount)}</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/40">
                      <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700/60">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200">Ringkasan Pengajuan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-700/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
              {all.slice(0, 10).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(item.expense_date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{item.title}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm capitalize text-slate-600 dark:text-slate-400">
                    {item.category.replace('_', ' ')}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(Number(item.amount))}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300">
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
