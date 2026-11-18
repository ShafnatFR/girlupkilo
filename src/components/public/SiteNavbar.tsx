'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import type { SiteIdentity } from '@/lib/content';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/visi-misi', label: 'Visi & Misi' },
  { href: '/departemen', label: 'Departemen' },
  { href: '/acara', label: 'Acara' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/dokumentasi', label: 'Dokumentasi' },
  { href: '/e-magazine', label: 'E-Magazine' },
  { href: '/#tentang', label: 'Tentang' },
];

export default function SiteNavbar({
  isLoggedIn,
  site,
}: {
  isLoggedIn: boolean;
  site: SiteIdentity;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href.startsWith('/#') ? pathname === '/' : pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gu-500 to-gu-700 text-sm font-bold text-white shadow-sm">
            GU
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold text-slate-900">{site.name}</span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-gu-600">
              Universitas Indonesia
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-gu-50 text-gu-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Masuk
              </Link>
              <Link href="/register" className="btn-primary">
                Daftar
                <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-gu-50 text-gu-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="btn-primary w-full"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-secondary w-full"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  Daftar
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}