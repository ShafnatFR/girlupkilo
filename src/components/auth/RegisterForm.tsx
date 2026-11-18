'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import GoogleButton from '@/components/auth/GoogleButton';

export default function RegisterForm({
  googleEnabled = false,
  initialError = '',
}: {
  googleEnabled?: boolean;
  initialError?: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Gagal mendaftar, coba lagi');
        setLoading(false);
        return;
      }

      // Registrasi langsung membuat sesi, jadi bisa masuk ke dashboard.
      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server');
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
          <span className="text-xl font-bold">R</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Buat Akun</h1>
        <p className="mt-2 text-sm text-slate-500">
          Daftar untuk mulai mengajukan reimbursement
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-6">
        <div>
          <label className="label" htmlFor="fullName">
            Nama Lengkap
          </label>
          <input
            id="fullName"
            type="text"
            required
            className="input"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            className="input"
            placeholder="nama@perusahaan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              autoComplete="new-password"
              className="input pr-10"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">Minimal 8 karakter.</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Memproses...' : 'Daftar'}
        </button>

        {googleEnabled && (
          <>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-400">atau</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
            <GoogleButton label="Daftar dengan Google" />
            <p className="text-center text-xs text-slate-500">
              Nama dan email diambil otomatis dari akun Google kamu.
            </p>
          </>
        )}

        <p className="text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <a href="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Masuk di sini
          </a>
        </p>
      </form>
    </div>
  );
}
