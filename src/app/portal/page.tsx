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
    tile: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    ring: 'group-hover:ring-blue-200',
  },
  green: {
    tile: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    ring: 'group-hover:ring-green-200',
  },
  purple: {
    tile: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    ring: 'group-hover:ring-purple-200',
  },
  gu: {
    tile: 'bg-gu-50 text-gu-600 group-hover:bg-gu-100',
    ring: 'group-hover:ring-gu-200',
  },
  amber: {
    tile: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    ring: 'group-hover:ring-amber-200',
  },
  slate: {
    tile: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
    ring: 'group-hover:ring-slate-200',
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
        <h1 className="text-2xl font-bold text-slate-900">
          Halo, {profile.full_name || 'Pengguna'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Pilih modul yang ingin Anda buka.
        </p>
      </div>

      {/* Launcher ala Odoo: kumpulan ikon modul yang dapat diklik. */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const accent = ACCENTS[mod.color];
          return (
            <Link
              key={mod.key}
              href={mod.home}
              title={mod.description}
              className="group flex flex-col items-center rounded-2xl border border-transparent p-6 text-center transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md"
            >
              <span
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ring-4 ring-transparent transition-all ${accent.tile} ${accent.ring}`}
              >
                <Icon size={28} />
              </span>
              <span className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                {mod.title}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
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