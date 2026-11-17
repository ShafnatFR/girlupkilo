'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/types';
import { Loader2, Upload, X } from 'lucide-react';

export default function NewSubmissionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'lainnya' as ExpenseCategory,
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>('');

  async function uploadReceipt(file: File) {
    setUploading(true);
    setError('');

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('receipts').getPublicUrl(fileName);

    setReceiptUrl(publicUrl);
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      uploadReceipt(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('reimbursements')
      .insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        amount: parseFloat(formData.amount),
        expense_date: formData.expense_date,
        description: formData.description || null,
        receipt_url: receiptUrl || null,
        status: 'submitted',
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/submissions');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Informasi Pengajuan
        </h2>

        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="title">
              Judul Pengajuan *
            </label>
            <input
              id="title"
              type="text"
              required
              className="input"
              placeholder="Contoh: Transportasi ke Kantor Klien"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="category">
                Kategori *
              </label>
              <select
                id="category"
                className="input"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ExpenseCategory,
                  })
                }
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ').charAt(0).toUpperCase() +
                      cat.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="amount">
                Jumlah (Rp) *
              </label>
              <input
                id="amount"
                type="number"
                required
                min="1"
                step="1000"
                className="input"
                placeholder="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="expense_date">
              Tanggal Pengeluaran *
            </label>
            <input
              id="expense_date"
              type="date"
              required
              className="input"
              value={formData.expense_date}
              onChange={(e) =>
                setFormData({ ...formData, expense_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label" htmlFor="description">
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={3}
              className="input"
              placeholder="Jelaskan lebih detail tentang pengeluaran ini..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Bukti Pengeluaran (Opsional)</label>
            <div className="mt-1 flex items-center gap-4">
              {receiptUrl ? (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                  <Upload size={16} />
                  File berhasil diunggah
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptUrl('');
                      setReceiptFile(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600 hover:border-brand-500 hover:text-brand-600">
                  <Upload size={16} />
                  {uploading ? 'Mengunggah...' : 'Pilih File'}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Batal
        </button>
        <button type="submit" disabled={loading || uploading} className="btn-primary">
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Menyimpan...' : 'Ajukan Reimbursement'}
        </button>
      </div>
    </form>
  );
}