'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    department: profile.department,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Gagal menyimpan perubahan');
        return;
      }

      setSuccess('Perubahan berhasil disimpan');
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server');
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Konfirmasi password tidak cocok');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPasswordError(data.error || 'Gagal mengubah password');
        return;
      }

      setPasswordSuccess('Password berhasil diubah');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      setPasswordError('Tidak dapat menghubungi server');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Profil Saya</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className="input bg-slate-50 dark:bg-slate-700/30" value={profile.email} disabled />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Email tidak dapat diubah</p>
          </div>

          <div>
            <label className="label" htmlFor="full_name">
              Nama Lengkap
            </label>
            <input
              id="full_name"
              type="text"
              className="input"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="department">
              Departemen
            </label>
            <input
              id="department"
              type="text"
              className="input"
              placeholder="Contoh: Keuangan"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{error}</div>}
          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">{success}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">Ubah Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label" htmlFor="current_password">
              Password Saat Ini
            </label>
            <input
              id="current_password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              value={passwordData.current_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, current_password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label" htmlFor="new_password">
              Password Baru
            </label>
            <input
              id="new_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input"
              placeholder="Minimal 8 karakter"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="confirm_password">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="input"
              placeholder="Ketik ulang password baru"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, confirm_password: e.target.value })
              }
            />
          </div>

          {passwordError && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {passwordSuccess}
            </div>
          )}

          <button type="submit" disabled={passwordLoading} className="btn-primary">
            {passwordLoading && <Loader2 size={18} className="animate-spin" />}
            {passwordLoading ? 'Menyimpan...' : 'Ubah Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
