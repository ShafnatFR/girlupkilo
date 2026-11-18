import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Flag,
  Home,
  Image,
  LayoutTemplate,
  Milestone as MilestoneIcon,
  Target,
  Users,
} from 'lucide-react';

import { requireCmsPage } from '@/lib/cms/page-guard';
import {
  listDepartments,
  listLeaders,
  listMilestones,
  listPrograms,
} from '@/lib/cms/admin';

export const metadata: Metadata = { title: 'CMS Konten' };

export default async function CmsOverviewPage() {
  await requireCmsPage();

  const [departments, leaders, programs, milestones] = await Promise.all([
    listDepartments(),
    listLeaders(),
    listPrograms(),
    listMilestones(),
  ]);

  const cards = [
    {
      href: '/dashboard/cms/identitas',
      title: 'Identitas & Kontak',
      description:
        'Nama organisasi, tagline, deskripsi, tautan sosial, dan bagian "Tentang Girl Up".',
      icon: Building2,
      meta: '1 bagian',
    },
    {
      href: '/dashboard/cms/visi-misi',
      title: 'Visi & Misi',
      description:
        'Pernyataan visi, daftar misi, nilai inti, dan empat pilar Girl Up.',
      icon: Target,
      meta: '4 bagian',
    },
    {
      href: '/dashboard/cms/beranda',
      title: 'Konten Beranda',
      description:
        'Angka statistik pada beranda dan langkah-langkah alur bergabung.',
      icon: LayoutTemplate,
      meta: '2 bagian',
    },
    {
      href: '/dashboard/cms/departemen',
      title: 'Departemen',
      description:
        'Susunan departemen, fokus kerja, ikon, serta kepala dan wakil departemen.',
      icon: Building2,
      meta: `${departments.length} data`,
    },
    {
      href: '/dashboard/cms/pengurus',
      title: 'Pengurus',
      description:
        'Nama dan jabatan pengurus inti maupun kepala departemen.',
      icon: Users,
      meta: `${leaders.length} data`,
    },
    {
      href: '/dashboard/cms/program',
      title: 'Program Unggulan',
      description:
        'Program yang ditampilkan pada bagian "Program" di halaman beranda.',
      icon: Flag,
      meta: `${programs.length} data`,
    },
    {
      href: '/dashboard/cms/tonggak',
      title: 'Tonggak Waktu',
      description: 'Perjalanan organisasi dari tahun ke tahun.',
      icon: MilestoneIcon,
      meta: `${milestones.length} data`,
    },
    {
      href: '/dashboard/cms/ikon',
      title: 'Panduan Ikon',
      description:
        'Daftar ikon yang bisa dipilih untuk departemen dan program.',
      icon: Image,
      meta: 'referensi',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS Konten</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola seluruh teks halaman publik tanpa mengubah kode. Perubahan
          langsung tampil setelah disimpan.
        </p>
      </div>

      <div className="rounded-xl border border-brand-200 bg-brand-50/60 px-5 py-4">
        <p className="text-sm text-brand-900">
          <strong>Cara kerja:</strong> halaman publik membaca data dari sini
          terlebih dahulu. Bila sebuah bagian belum diisi, sistem memakai nilai
          default dari kode, sehingga halaman tidak pernah kosong.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group card flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
                  <Icon size={19} />
                </span>
                <span className="text-xs text-slate-400">{card.meta}</span>
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">{card.title}</h2>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-500">
                {card.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                Kelola
                <ArrowRight size={13} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="card p-5">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <Home size={17} className="text-slate-400" />
          Pratinjau halaman publik
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/" className="btn-secondary" target="_blank">
            Beranda
          </Link>
          <Link href="/visi-misi" className="btn-secondary" target="_blank">
            Visi & Misi
          </Link>
          <Link href="/departemen" className="btn-secondary" target="_blank">
            Departemen
          </Link>
        </div>
      </div>
    </div>
  );
}