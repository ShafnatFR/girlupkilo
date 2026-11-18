import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckSquare,
  Database,
  FileText,
  Flag,
  Home,
  Image as ImageIcon,
  Images,
  LayoutDashboard,
  LayoutTemplate,
  Milestone,
  Palette,
  Settings,
  Target,
  Users,
  Wallet,
} from 'lucide-react';

/** Peran yang boleh mengelola CMS profil. */
export const CMS_ROLES = ['admin', 'manager'];
/** Peran yang boleh mengelola modul konten (acara/galeri/artikel/e-magazine). */
export const CONTENT_ROLES = ['admin', 'manager', 'staff'];

export type AccentColor = 'blue' | 'green' | 'purple' | 'gu' | 'amber' | 'slate';

export interface ModuleNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Peran yang boleh melihat item; undefined = semua peran. */
  roles?: string[];
  /** true bila item ini merupakan halaman ringkasan modul. */
  overview?: boolean;
}

export interface DashboardModule {
  /** Identitas unik modul. */
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: AccentColor;
  /** Prefiks path yang menandakan pengguna sedang berada di modul ini. */
  match: string[];
  /** Halaman default saat modul dibuka dari launcher. */
  home: string;
  /** Peran yang boleh membuka modul; undefined = semua peran. */
  roles?: string[];
  /** Isi menu sidebar modul. */
  items: ModuleNavItem[];
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    key: 'keuangan',
    title: 'Keuangan',
    description:
      'Kelola pengajuan reimbursement, persetujuan berjenjang, dan laporan keuangan.',
    icon: Wallet,
    color: 'green',
    match: [
      '/dashboard/submissions',
      '/dashboard/approvals',
      '/dashboard/reports',
    ],
    home: '/dashboard/submissions',
    items: [
      {
        href: '/dashboard/submissions',
        label: 'Pengajuan Saya',
        icon: FileText,
        overview: true,
      },
      {
        href: '/dashboard/approvals',
        label: 'Persetujuan',
        icon: CheckSquare,
        roles: ['manager', 'finance', 'admin'],
      },
      {
        href: '/dashboard/reports',
        label: 'Laporan',
        icon: BarChart3,
      },
    ],
  },
  {
    key: 'content',
    title: 'Konten',
    description:
      'Kelola acara, dokumentasi, artikel, dan e-magazine yang tampil di situs publik.',
    icon: Images,
    color: 'gu',
    match: ['/dashboard/content'],
    home: '/dashboard/content',
    roles: CONTENT_ROLES,
    items: [
      {
        href: '/dashboard/content',
        label: 'Ringkasan',
        icon: LayoutDashboard,
        overview: true,
      },
      {
        href: '/dashboard/content/acara',
        label: 'Acara',
        icon: CalendarDays,
      },
      {
        href: '/dashboard/content/dokumentasi',
        label: 'Dokumentasi',
        icon: ImageIcon,
      },
      {
        href: '/dashboard/content/artikel',
        label: 'Artikel',
        icon: FileText,
      },
      {
        href: '/dashboard/content/e-magazine',
        label: 'E-Magazine',
        icon: BookOpen,
      },
    ],
  },
  {
    key: 'cms',
    title: 'CMS Konten',
    description: 'Kelola seluruh teks halaman profil publik tanpa mengubah kode.',
    icon: Database,
    color: 'amber',
    match: ['/dashboard/cms'],
    home: '/dashboard/cms',
    roles: CMS_ROLES,
    items: [
      {
        href: '/dashboard/cms',
        label: 'Ringkasan',
        icon: LayoutDashboard,
        overview: true,
      },
      {
        href: '/dashboard/cms/identitas',
        label: 'Identitas & Kontak',
        icon: Home,
      },
      {
        href: '/dashboard/cms/visi-misi',
        label: 'Visi & Misi',
        icon: Target,
      },
      {
        href: '/dashboard/cms/beranda',
        label: 'Konten Beranda',
        icon: LayoutTemplate,
      },
      {
        href: '/dashboard/cms/departemen',
        label: 'Departemen',
        icon: Building2,
      },
      {
        href: '/dashboard/cms/pengurus',
        label: 'Pengurus',
        icon: Users,
      },
      {
        href: '/dashboard/cms/program',
        label: 'Program Unggulan',
        icon: Flag,
      },
      {
        href: '/dashboard/cms/tonggak',
        label: 'Tonggak Waktu',
        icon: Milestone,
      },
      {
        href: '/dashboard/cms/ikon',
        label: 'Panduan Ikon',
        icon: Palette,
      },
    ],
  },
  {
    key: 'settings',
    title: 'Pengaturan',
    description: 'Perbarui profil, kata sandi, dan preferensi akun Anda.',
    icon: Settings,
    color: 'slate',
    match: ['/dashboard/settings'],
    home: '/dashboard/settings',
    items: [
      {
        href: '/dashboard/settings',
        label: 'Pengaturan Akun',
        icon: Settings,
        overview: true,
      },
    ],
  },
];

export function rolesForModule(module: DashboardModule): string[] | undefined {
  return module.roles;
}

/** Cari modul aktif berdasarkan pathname. Mengembalikan null bila di launcher. */
export function resolveModule(pathname: string): DashboardModule | null {
  // Launcher (/dashboard persis) tidak memiliki modul aktif.
  if (pathname === '/dashboard' || pathname === '/dashboard/') return null;

  let best: DashboardModule | null = null;
  for (const mod of DASHBOARD_MODULES) {
    for (const prefix of mod.match) {
      const hit =
        pathname === prefix || pathname.startsWith(prefix + '/');
      if (hit && (!best || prefix.length > best.match[0].length)) {
        best = mod;
      }
    }
  }
  return best;
}