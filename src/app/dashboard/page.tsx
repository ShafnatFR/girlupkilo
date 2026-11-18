import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BarChart3,
  CheckSquare,
  Database,
  FileText,
  Images,
  Settings,
  type LucideIcon,
} from 'lucide-react';

import { requireUser } from '@/lib/auth';
import type { Profile } from '@/lib/types';

export const metadata: Metadata = { title: 'Dashboard' };

const CMS_ROLES = ['admin', 'manager'];
const CONTENT_ROLES = ['admin', 'manager', 'staff'];

interface ModuleDef {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Warna aksen ikon. */
  color: 'blue' | 'green' | 'purple' | 'gu' | 'amber' | 'slate';
  /** Peran yang boleh melihat modul; undefined = semua peran. */
  roles?: string[];
}

const MODULES: ModuleDef[] = [
  {
    href: '/dashboard/submissions',
    title: 'Pengajuan Saya',
    description:
      'Buat dan pantau pengajuan reimbursement Anda, dari draft hingga dibayar.',
    icon: FileText,
    color: 'blue',
  },
  {
    href: '/dashboard/approvals',
    title: 'Persetujuan',
    description:
      'Tinjau dan setujui pengajuan reimbursement yang menunggu persetujuan Anda.',
    icon: CheckSquare,
    color: 'green',
    roles: ['manager', 'finance', 'admin'],
  },
  {
    href: '/dashboard/reports',
    title: 'Laporan',
    description:
      'Lihat rekap dan analisis pengajuan reimbursement dalam berbagai bentuk laporan.',
    icon: BarChart3,
    color: 'purple',
  },
  {
    href: '/dashboard/content',
    title: 'Konten',
    description:
      'Kelola acara, dokumentasi, artikel, dan e-magazine yang tampil di situs publik.',
    icon: Images,
    color: 'gu',
    roles: CONTENT_ROLES,
  },
  {
    href: '/dashboard/cms',
    title: 'CMS Konten',
    description:
      'Kelola seluruh teks halaman profil publik tanpa mengubah kode.',
    icon: Database,
    color: 'amber',
    roles: CMS_ROLES,
  },
  {
    href: '/dashboard/settings',
    title: 'Pengaturan',
    description: 'Perbarui profil, kata sandi, dan preferensi akun Anda.',
    icon: Settings,
    color: 'slate',
  },
];

const ACCENTS: Record<
  ModuleDef['color'],
  { tile: string; ring: string }
> = {
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

  const modules = MODULES.filter(
    (mod) => !mod.roles || mod.roles.includes(profile.role)
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const accent = ACCENTS[mod.color];
          return (
            <Link
              key={mod.href}
              href={mod.href}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}