import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getReimbursementForUser } from '@/lib/reimbursements';
import { formatCurrency, formatDate, STATUS_STYLES } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/types';
import { ArrowLeft, Download, CheckCircle, Clock, X } from 'lucide-react';
import Link from 'next/link';

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireUser();
  const item = await getReimbursementForUser(id, profile);

  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/portal/keuangan/submissions"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{item.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Diajukan pada {formatDate(item.created_at)}
          </p>
        </div>
        <span className={`badge ${STATUS_STYLES[item.status]}`}>{STATUS_LABELS[item.status]}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">
              Detail Pengajuan
            </h2>
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Kategori</dt>
                  <dd className="mt-1 font-medium capitalize text-slate-800 dark:text-slate-200">
                    {item.category.replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Tanggal Pengeluaran</dt>
                  <dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(item.expense_date)}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-sm text-slate-500 dark:text-slate-400">Jumlah</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {formatCurrency(Number(item.amount))}
                </dd>
              </div>

              {item.description && (
                <div>
                  <dt className="text-sm text-slate-500 dark:text-slate-400">Deskripsi</dt>
                  <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {item.description}
                  </dd>
                </div>
              )}

              {item.receipt_url && (
                <div>
                  <dt className="mb-2 text-sm text-slate-500 dark:text-slate-400">Bukti Pengeluaran</dt>
                  <dd>
                    <a
                      href={item.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <Download size={16} />
                      Lihat Bukti
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">
              Riwayat Persetujuan
            </h2>
            <div className="space-y-4">
              <TimelineItem
                title="Pengajuan Dibuat"
                description="Pengajuan reimbursement diajukan"
                date={item.created_at}
                status="completed"
              />

              {item.status !== 'draft' && item.status !== 'submitted' && (
                <TimelineItem
                  title="Disetujui Manajer"
                  description="Disetujui oleh manajer"
                  date={item.manager_approved_at || ''}
                  status={item.manager_approved_at ? 'completed' : 'pending'}
                />
              )}

              {item.status !== 'draft' &&
                item.status !== 'submitted' &&
                item.status !== 'manager_approved' && (
                  <TimelineItem
                    title="Disetujui Keuangan"
                    description="Disetujui oleh tim keuangan"
                    date={item.finance_approved_at || ''}
                    status={item.finance_approved_at ? 'completed' : 'pending'}
                  />
                )}

              {item.status === 'paid' && (
                <TimelineItem
                  title="Pembayaran Selesai"
                  description="Reimbursement telah dibayarkan"
                  date={item.paid_at || ''}
                  status="completed"
                />
              )}

              {item.status === 'rejected' && (
                <div className="rounded-lg bg-rose-50 p-4 dark:bg-rose-950/40 dark:border dark:border-rose-800/40">
                  <div className="flex items-start gap-3">
                    <X className="mt-0.5 h-5 w-5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <p className="font-medium text-rose-900 dark:text-rose-200">Pengajuan Ditolak</p>
                      {item.rejection_reason && (
                        <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
                          {item.rejection_reason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">
              Status Pengajuan
            </h3>
            <div className="space-y-3">
              <span className={`badge ${STATUS_STYLES[item.status]}`}>
                {STATUS_LABELS[item.status]}
              </span>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {getStatusDescription(item.status)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  status,
}: {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            status === 'completed'
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border dark:border-emerald-800/40'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
          }`}
        >
          {status === 'completed' ? <CheckCircle size={18} /> : <Clock size={18} />}
        </div>
        {status === 'pending' && (
          <div className="h-full w-0.5 bg-slate-200 dark:bg-slate-700" />
        )}
      </div>
      <div className="pb-4">
        <p className="font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {status === 'completed' && date && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{formatDate(date)}</p>
        )}
      </div>
    </div>
  );
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    draft: 'Pengajuan masih dalam draft dan dapat diedit',
    submitted: 'Pengajuan sedang menunggu persetujuan manajer',
    manager_approved: 'Pengajuan telah disetujui manajer, menunggu persetujuan keuangan',
    finance_approved: 'Pengajuan telah disetujui keuangan, menunggu pembayaran',
    rejected: 'Pengajuan ditolak',
    paid: 'Reimbursement telah dibayarkan',
  };
  return descriptions[status] || '';
}
