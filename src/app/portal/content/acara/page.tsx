import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
import { listEvents } from '@/lib/cms/admin';
import { requireContentPage } from '@/lib/cms/content-guard';

export const metadata: Metadata = { title: 'Konten — Acara' };

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    label: 'Judul acara',
    type: 'text',
    required: true,
    placeholder: "Women's Talk on Current Issues",
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'women-s-talk-2026',
    hint: 'Kosongkan untuk dibuat otomatis dari judul. Huruf kecil dan tanda hubung.',
  },
  {
    name: 'event_date',
    label: 'Tanggal acara',
    type: 'text',
    placeholder: 'YYYY-MM-DD',
    hint: 'Format YYYY-MM-DD, mis. 2026-03-14. Kosongkan bila belum ditentukan.',
  },
  {
    name: 'location',
    label: 'Lokasi',
    type: 'text',
    placeholder: 'Universitas Indonesia, Depok',
  },
  {
    name: 'category',
    label: 'Kategori',
    type: 'text',
    placeholder: 'Diskusi / Kampanye / Edukasi',
  },
  {
    name: 'cover_image_url',
    label: 'URL gambar sampul',
    type: 'text',
    placeholder: 'https://...',
    hint: 'Tautan gambar yang akan tampil di kartu acara.',
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    full: true,
    placeholder: 'Jelaskan acara ini...',
  },
  {
    name: 'sort_order',
    label: 'Urutan tampil',
    type: 'number',
    hint: 'Angka kecil tampil lebih dulu.',
  },
  {
    name: 'published',
    label: 'Tayangkan di halaman publik',
    type: 'checkbox',
    full: true,
    hint: 'Hapus centang untuk menyimpan sebagai draft.',
  },
];

export default async function ContentEventsPage() {
  await requireContentPage();
  const events = await listEvents();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Konten
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">Acara</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mengelola daftar acara yang tampil pada halaman Acara publik.
        </p>
      </div>

      <EntityManager
        entity="events"
        singular="acara"
        plural="Acara"
        description="Tambah, ubah, atau hapus acara beserta tanggal, lokasi, dan sampulnya."
        rows={events}
        fields={FIELDS}
      />
    </div>
  );
}
