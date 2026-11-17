'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Reimbursement } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/types';
import { ArrowLeft, Check, X, Loader2, Download } from 'lucide-react';
import Link from 'next/link';

export default function ApprovalDetailForm({
  reimbursement,
}: {
  reimbursement: Reimbursement;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const nextStatus =
    reimbursement.status === 'submitted'
      ? 'manager_approved'
      : reimbursement.status === 'manager_approved'
      ? 'finance_approved'
      : 'paid';

  const actionLabel =
    reimbursement.status === 'submitted'
      ? 'Setujui sebagai Manajer'
      : reimbursement.status === 'manager_approved'
      ? 'Setujui sebagai Keuangan'
      : 'Tandai Dibayar';

  async function handleApprove() {
    setLoading(true);
    setError('');

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const updates: any = { status: nextStatus };

    if (nextStatus === 'manager_approved') {
      updates.manager_approver = user.id;
      updates.manager_approved_at = new Date().toISOString();
    } else if (nextStatus === 'finance_approved') {
      updates.finance_approver = user.id;
      updates.finance_approved_at = new Date().toISOString();
    } else if (nextStatus === 'paid') {
      updates.paid_at = new Date().toISOString();
      updates.paid_by = user.id;
    }

    const { error } = await supabase
      .from('reimbursements')
      .update(updates)
      .eq('id', reimbursement.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/approvals');
    router.refresh();
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      setError('Alasan penolakan harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase
      .from('reimbursements')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
      })
      .eq('id', reimbursement.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/approvals');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/approvals"
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">
            {reimbursement.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tinjau pengajuan reimbursement
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Detail Card */}
          <div className="card p-6">
            <h2 className="mb-4 font-semibold text-slate-900">Detail Pengajuan</h2>
            <dl className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-slate-500">Kategori</dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {reimbursement.category.replace('_', ' ').charAt(0).toUpperCase() +
                      reimbursement.category.slice(1).replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Tanggal Pengeluaran</dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {formatDate(reimbursement.expense_date)}
                  </dd>
                </div>
              </div>

              <div>
                <dt className="text-sm text-slate-500">Jumlah</dt>
                <dd className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(Number(reimbursement.amount))}
                </dd>
              </div>

              {reimbursement.description && (
                <div>
                  <dt className="text-sm text-slate-500">Deskripsi</dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {reimbursement.description}
                  </dd>
                </div>
              )}

              {reimbursement.receipt_url && (
                <div>
                  <dt className="mb-2 text-sm text-slate-500">
                    Bukti Pengeluaran
                  </dt>
                  <dd>
                    <a
                      href={reimbursement.receipt_url}
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

          {/* Actions */}
          {!showReject && (
            <div className="card p-6">
              <h2 className="mb-4 font-semibold text-slate-900">Aksi</h2>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Check size={18} />
                  )}
                  {actionLabel}
                </button>
                <button
                  onClick={() => setShowReject(true)}
                  disabled={loading}
                  className="btn-danger"
                >
                  <X size={18} />
                  Tolak
                </button>
              </div>
            </div>
          )}

          {/* Reject Form */}
          {showReject && (
            <div className="card border-red-200 bg-red-50 p-6">
              <h2 className="mb-4 font-semibold text-red-900">
                Tolak Pengajuan
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="label" htmlFor="rejectionReason">
                    Alasan Penolakan *
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows={4}
                    required
                    className="input"
                    placeholder="Jelaskan alasan penolakan pengajuan ini..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={loading || !rejectionReason.trim()}
                    className="btn-danger"
                  >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    Konfirmasi Penolakan
                  </button>
                  <button
                    onClick={() => {
                      setShowReject(false);
                      setRejectionReason('');
                      setError('');
                    }}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-slate-900">
              Status Pengajuan
            </h3>
            <div className="space-y-3">
              <span className="badge bg-blue-100 text-blue-700">
                {STATUS_LABELS[reimbursement.status]}
              </span>
              <p className="text-sm text-slate-600">
                {getStatusDescription(reimbursement.status)}
              </p>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-semibold text-slate-900">Alur Persetujuan</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check size={14} />
                </div>
                <span className="text-sm text-slate-700">Diajukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    reimbursement.status === 'submitted'
                      ? 'bg-yellow-100 text-yellow-600'
                      : reimbursement.status === 'manager_approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {reimbursement.status === 'manager_approved' ? (
                    <Check size={14} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                <span className="text-sm text-slate-700">
                  Persetujuan Manajer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    reimbursement.status === 'manager_approved'
                      ? 'bg-yellow-100 text-yellow-600'
                      : reimbursement.status === 'finance_approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {reimbursement.status === 'finance_approved' ? (
                    <Check size={14} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                <span className="text-sm text-slate-700">
                  Persetujuan Keuangan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    reimbursement.status === 'finance_approved'
                      ? 'bg-yellow-100 text-yellow-600'
                      : reimbursement.status === 'paid'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {reimbursement.status === 'paid' ? (
                    <Check size={14} />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>
                <span className="text-sm text-slate-700">Pembayaran</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusDescription(status: string): string {
  const descriptions: Record<string, string> = {
    submitted: 'Menunggu persetujuan manajer',
    manager_approved: 'Menunggu persetujuan keuangan',
    finance_approved: 'Menunggu pembayaran',
    paid: 'Reimbursement telah dibayarkan',
  };
  return descriptions[status] || '';
}