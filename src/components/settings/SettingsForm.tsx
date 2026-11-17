'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    department: profile.department,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        department: formData.department,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const form = e.target as HTMLFormElement;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement)
      .value;
    const confirmPassword = (
      form.elements.namedItem('confirmPassword') as HTMLInputElement
    ).value;

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    form.reset();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile Settings */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Profil Saya
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input bg-slate-50"
              value={profile.email}
              disabled
            />
            <p className="mt-1 text-xs text-slate-500">
              Email tidak dapat diubah
            </p>
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
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Perubahan berhasil disimpan
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Ubah Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="label" htmlFor="newPassword">
              Password Baru
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="input"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="input"
              placeholder="Ketik ulang password baru"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              Password berhasil diubah
            </div>
          )}

          <button type="submit" className="btn-primary">
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
}