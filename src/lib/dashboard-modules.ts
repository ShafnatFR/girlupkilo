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
      '/portal/keuangan/submissions',
      '/portal/keuangan/approvals',
      '/portal/keuangan/reports',
    ],
    home: '/portal/keuangan/submissions',
    items: [
      {
        href: '/portal/keuangan/submissions',
        label: 'Pengajuan Saya',
        icon: FileText,
        overview: true,
      },
      {
        href: '/portal/keuangan/approvals',
        label: 'Persetujuan',
        icon: CheckSquare,
        roles: ['manager', 'finance', 'admin'],
      },
      {
        href: '/portal/keuangan/reports',
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
    match: ['/portal/content'],
    home: '/portal/content',
    roles: CONTENT_ROLES,
    items: [
      {
        href: '/portal/content',
        label: 'Ringkasan',
        icon: LayoutDashboard,
        overview: true,
      },
      {
        href: '/portal/content/acara',
        label: 'Acara',
        icon: CalendarDays,
      },
      {
        href: '/portal/content/dokumentasi',
        label: 'Dokumentasi',
        icon: ImageIcon,
      },
      {
        href: '/portal/content/artikel',
        label: 'Artikel',
        icon: FileText,
      },
      {
        href: '/portal/content/e-magazine',
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
    match: ['/portal/cms'],
    home: '/portal/cms',
    roles: CMS_ROLES,
    items: [
      {
        href: '/portal/cms',
        label: 'Ringkasan',
        icon: LayoutDashboard,
        overview: true,
      },
      {
        href: '/portal/cms/identitas',
        label: 'Identitas & Kontak',
        icon: Home,
      },
      {
        href: '/portal/cms/visi-misi',
        label: 'Visi & Misi',
        icon: Target,
      },
      {
        href: '/portal/cms/beranda',
        label: 'Konten Beranda',
        icon: LayoutTemplate,
      },
      {
        href: '/portal/cms/departemen',
        label: 'Departemen',
        icon: Building2,
      },
      {
        href: '/portal/cms/pengurus',
        label: 'Pengurus',
        icon: Users,
      },
      {
        href: '/portal/cms/program',
        label: 'Program Unggulan',
        icon: Flag,
      },
      {
        href: '/portal/cms/tonggak',
        label: 'Tonggak Waktu',
        icon: Milestone,
      },
      {
        href: '/portal/cms/ikon',
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
    match: ['/portal/settings'],
    home: '/portal/settings',
    items: [
      {
        href: '/portal/settings',
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
  // Launcher (/portal persis) tidak memiliki modul aktif.
  if (pathname === '/portal' || pathname === '/portal/') return null;

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
