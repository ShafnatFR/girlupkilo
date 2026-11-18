import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Images,
} from 'lucide-react';

import { requireContentPage } from '@/lib/cms/content-guard';
import {
  listArticles,
  listEmagazines,
  listEvents,
  listGallery,
} from '@/lib/cms/admin';

export const metadata: Metadata = { title: 'Konten — Acara, Artikel & Publikasi' };

export default async function ContentOverviewPage() {
  await requireContentPage();

  const [events, gallery, articles, emagazines] = await Promise.all([
    listEvents(),
    listGallery(),
    listArticles(),
    listEmagazines(),
  ]);

  const cards = [
    {
      href: '/portal/content/acara',
      title: 'Acara',
      description:
        'Daftar diskusi, kampanye, dan kegiatan yang tampil di halaman Acara publik.',
      icon: CalendarDays,
      meta: `${events.length} data`,
    },
    {
      href: '/portal/content/dokumentasi',
      title: 'Dokumentasi / Galeri',
      description:
        'Kumpulan foto dan dokumentasi kegiatan yang tampil di halaman Dokumentasi.',
      icon: Images,
      meta: `${gallery.length} data`,
    },
    {
      href: '/portal/content/artikel',
      title: 'Artikel',
      description:
        'Esai, kajian, dan karya tulis anggota yang tampil di halaman Artikel.',
      icon: FileText,
      meta: `${articles.length} data`,
    },
    {
      href: '/portal/content/e-magazine',
      title: 'E-Magazine',
      description:
        'Terbitan digital e-magazine beserta tautan berkas untuk diunduh.',
      icon: BookOpen,
      meta: `${emagazines.length} data`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Konten — Acara, Artikel & Publikasi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola modul konten publik: acara, dokumentasi, artikel, dan
          e-magazine. Perubahan langsung tampil setelah disimpan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
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
    </div>
  );
}