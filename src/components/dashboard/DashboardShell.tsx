'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, LogOut, Menu, X } from 'lucide-react';

import {
  resolveModule,
  type DashboardModule,
  type ModuleNavItem,
} from '@/lib/dashboard-modules';
import type { Profile } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/types';
import { initials as getInitials } from '@/lib/utils';

interface DashboardShellProps {
  profile: Profile;
  children: React.ReactNode;
}

function filterItems(
  items: ModuleNavItem[],
  role: Profile['role']
): ModuleNavItem[] {
  return items.filter((item) => !item.roles || item.roles.includes(role));
}

export default function DashboardShell({
  profile,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const module = resolveModule(pathname);

  // Launcher (/portal): tanpa sidebar, konten selebar penuh.
  if (!module) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</div>
      </div>
    );
  }

  return (
    <ModuleLayout module={module} profile={profile}>
      {children}
    </ModuleLayout>
  );
}

function ModuleLayout({
  module,
  profile,
  children,
}: {
  module: DashboardModule;
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const items = filterItems(module.items, profile.role);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-white shadow-lg transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link
            href="/portal"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <span className="font-bold">R</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-bold text-slate-900">
                {module.title}
              </span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Modul
              </span>
            </span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Kembali ke daftar modul */}
        <div className="border-b px-3 py-2">
          <Link
            href="/portal"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            <ArrowLeft size={16} />
            Semua Modul
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {getInitials(profile.full_name || profile.email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {profile.full_name || 'Pengguna'}
              </p>
              <p className="truncate text-xs text-slate-500">
                {ROLE_LABELS[profile.role]}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={18} />
            {loggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </aside>

      <button
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}