import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { requireUser } from '@/lib/auth';
import {
  DASHBOARD_MODULES,
  type AccentColor,
  type DashboardModule,
} from '@/lib/dashboard-modules';
import type { Profile } from '@/lib/types';

export const metadata: Metadata = { title: 'Dashboard' };

const ACCENTS: Record<AccentColor, { tile: string; ring: string }> = {
  blue: {
    tile: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-800/30 dark:group-hover:bg-blue-900/40',
    ring: 'group-hover:ring-blue-200 dark:group-hover:ring-blue-800/40',
  },
  green: {
    tile: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border dark:border-emerald-800/30 dark:group-hover:bg-emerald-900/40',
    ring: 'group-hover:ring-emerald-200 dark:group-hover:ring-emerald-800/40',
  },
  purple: {
    tile: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border dark:border-purple-800/30 dark:group-hover:bg-purple-900/40',
    ring: 'group-hover:ring-purple-200 dark:group-hover:ring-purple-800/40',
  },
  gu: {
    tile: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-800/30 dark:group-hover:bg-rose-900/40',
    ring: 'group-hover:ring-rose-200 dark:group-hover:ring-rose-800/40',
  },
  amber: {
    tile: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-800/30 dark:group-hover:bg-amber-900/40',
    ring: 'group-hover:ring-amber-200 dark:group-hover:ring-amber-800/40',
  },
  slate: {
    tile: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border dark:border-slate-700/40 dark:group-hover:bg-slate-700/60',
    ring: 'group-hover:ring-slate-200 dark:group-hover:ring-slate-600/40',
  },
};

export default async function DashboardPage() {
  const profile: Profile = await requireUser();

  const modules = DASHBOARD_MODULES.filter(
    (mod: DashboardModule) => !mod.roles || mod.roles.includes(profile.role)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Halo, {profile.full_name || 'Pengguna'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pilih modul yang ingin Anda buka.
        </p>
      </div>

      {/* Launcher kumpulan ikon modul yang dapat diklik. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const accent = ACCENTS[mod.color];
          return (
            <Link
              key={mod.key}
              href={mod.home}
              title={mod.description}
              className="group flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-[#1a202c] dark:hover:border-slate-600 dark:hover:bg-[#202736] dark:hover:shadow-lg"
            >
              <span
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-4 ring-transparent transition-all ${accent.tile} ${accent.ring}`}
              >
                <Icon size={28} />
              </span>
              <span className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-brand-600 dark:text-slate-200 dark:group-hover:text-brand-400">
                {mod.title}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
                Buka
                <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
