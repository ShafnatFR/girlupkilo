import Link from 'next/link';
import { ArrowLeft, Compass, Search } from 'lucide-react';

import PublicShell from '@/components/public/PublicShell';
import { getPublicContent } from '@/lib/content';

export default async function NotFound() {
  const { departments } = await getPublicContent();

  return (
    <PublicShell>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gu-50 text-gu-600">
          <Search size={26} />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
          Halaman tidak ditemukan
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          404
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-slate-600">
          Tautan yang kamu buka mungkin sudah dipindahkan atau tidak pernah ada.
          Berikut beberapa tempat yang bisa kamu kunjungi.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary px-5 py-2.5 text-sm">
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
          <Link href="/departemen" className="btn-secondary px-5 py-2.5 text-sm">
            <Compass size={16} />
            Lihat Departemen
          </Link>
        </div>

        <div className="mt-12 w-full rounded-2xl border border-slate-200 bg-white p-6 text-left">
          <h2 className="text-sm font-semibold text-slate-900">
            Jelajahi halaman lain
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              { href: '/', label: 'Beranda' },
              { href: '/visi-misi', label: 'Visi & Misi' },
              { href: '/departemen', label: 'Departemen' },
              { href: '/#program', label: 'Program' },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-gu-50 hover:text-gu-700"
                >
                  {link.label}
                  <ArrowLeft size={14} className="rotate-180 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>

          {departments.length > 0 && (
            <>
              <h3 className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Departemen
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Link
                    key={dept.slug}
                    href={`/departemen#${dept.slug}`}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition-colors hover:border-gu-300 hover:text-gu-700"
                  >
                    {dept.shortName}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PublicShell>
  );
}