'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bell, LogOut, MessageCircle, Settings } from 'lucide-react';
import type { Profile } from '@/lib/types';

export default function TopHeader({ profile }: { profile: Profile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="sticky top-0 z-20 bg-slate-900 border-b border-slate-800">
      <div className="flex h-11 items-center justify-between gap-2 px-4 lg:px-6">
        {/* Aksi cepat: pesan & notifikasi (placeholder, diwire ke API nanti). */}
        <div className="hidden sm:flex items-center gap-4 text-slate-400">
          <button
            aria-label="Pesan"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-brand-400 transition-colors"
            onClick={() => setOpen(false)}
          >
            <MessageCircle size={18} />
          </button>
          <button
            aria-label="Notifikasi"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-brand-400 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Bell size={18} />
          </button>
        </div>

        {/* Profil + dropdown (Pengaturan, Keluar). */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer rounded-lg px-2.5 py-1.5 hover:bg-slate-800 transition-colors"
            aria-label="Profil pengguna"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900/30 text-sm font-semibold text-brand-400">
              {(profile.full_name || profile.email).charAt(0)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-100 leading-tight">
                {profile.full_name || 'Pengguna'}
              </p>
            </div>
          </div>

          <div
            className={`fixed right-4 top-12 z-50 mt-2 w-48 rounded-lg border border-slate-800 bg-slate-900 shadow-lg py-2 ${
              open ? 'block' : 'hidden'
            }`}
          >
            <Link
              href="/portal/settings"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              aria-current={isActive('/portal/settings') ? 'page' : undefined}
            >
              <Settings size={16} /> Pengaturan
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
