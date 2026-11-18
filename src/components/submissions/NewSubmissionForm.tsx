'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from '@/lib/types';
import { Loader2, Upload, X } from 'lucide-react';

type UploadResult = { url: string; name: string };

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

  const [uploaded, setUploaded] = useState<UploadResult | null>(null);

  async function uploadReceipt(file: File) {
    setUploading(true);
    setError('');

    const body = new FormData();
    body.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Gagal mengunggah file');
        return;
      }

      setUploaded({ url: data.url, name: data.name });
    } catch {
      setError('Tidak dapat menghubungi server saat mengunggah');
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadReceipt(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reimbursements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          amount: Number(formData.amount),
          expense_date: formData.expense_date,
          description: formData.description,
          receipt_url: uploaded?.url ?? null,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Gagal menyimpan pengajuan');
        setLoading(false);
        return;
      }

      router.push('/dashboard/submissions');
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Informasi Pengajuan</h2>

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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  setFormData({ ...formData, category: e.target.value as ExpenseCategory })
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
                step="any"
                className="input"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Bukti Pengeluaran (Opsional)</label>
            <div className="mt-1 flex items-center gap-4">
              {uploaded ? (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">
                  <Upload size={16} />
                  <a href={uploaded.url} target="_blank" rel="noreferrer" className="underline">
                    {uploaded.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => setUploaded(null)}
                    aria-label="Hapus bukti"
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
                    accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              )}
              <span className="text-xs text-slate-500">PNG, JPG, WEBP, GIF, atau PDF. Maks 10 MB.</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()} className="btn-secondary">
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
