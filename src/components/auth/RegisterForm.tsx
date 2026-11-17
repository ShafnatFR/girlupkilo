'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
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

      {success ? (
        <div className="card p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            ✓
          </div>
          <h2 className="mb-2 text-lg font-semibold text-slate-900">
            Periksa Email Anda
          </h2>
          <p className="text-sm text-slate-500">
            Kami telah mengirim tautan verifikasi ke{' '}
            <strong>{email}</strong>. Klik tautan tersebut untuk mengaktifkan
            akun Anda.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary mt-4 w-full"
          >
            Kembali ke Halaman Masuk
          </button>
        </div>
      ) : (
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
                minLength={6}
                className="input pr-10"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <a
              href="/login"
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              Masuk di sini
            </a>
          </p>
        </form>
      )}
    </div>
  );
}