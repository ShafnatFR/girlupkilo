'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  Images,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Profile } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/types';
import { initials as getInitials } from '@/lib/utils';

interface SidebarProps {
  profile: Profile;
}

const navItems = [
  { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/dashboard/submissions', label: 'Pengajuan Saya', icon: FileText },
  { href: '/dashboard/approvals', label: 'Persetujuan', icon: CheckSquare },
  { href: '/dashboard/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/dashboard/content', label: 'Konten', icon: Images },
  { href: '/dashboard/cms', label: 'CMS Konten', icon: Database },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings },
];

const CMS_ROLES = ['admin', 'manager'];
const CONTENT_ROLES = ['admin', 'manager', 'staff'];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.replace('/login');
      router.refresh();
    }
  }

  // Tampilkan menu sesuai peran pengguna.
  const visibleItems = navItems.filter((item) => {
    if (item.href === '/dashboard/approvals') {
      return ['manager', 'finance', 'admin'].includes(profile.role);
    }
    if (item.href === '/dashboard/cms') {
      return CMS_ROLES.includes(profile.role);
    }
    if (item.href === '/dashboard/content') {
      return CONTENT_ROLES.includes(profile.role);
    }
    return true;
  });

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <>
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
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <span className="font-bold">R</span>
            </div>
            <span className="font-bold text-slate-900">Reimburse</span>
          </div>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
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
              <p className="truncate text-xs text-slate-500">{ROLE_LABELS[profile.role]}</p>
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
    </>
  );
}
