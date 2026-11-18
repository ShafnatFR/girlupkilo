import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
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

const COLUMNS: ColumnDef[] = [
  {
    key: 'title',
    label: 'Acara',
    render: (row: CmsRow) => (
      <div>
        <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
        <p className="text-xs text-slate-500">{String(row.slug ?? '')}</p>
      </div>
    ),
  },
  {
    key: 'event_date',
    label: 'Tanggal',
    render: (row: CmsRow) => (
      <span className="text-slate-600">{String(row.event_date ?? '—')}</span>
    ),
  },
  {
    key: 'location',
    label: 'Lokasi',
    className: 'max-w-xs',
    render: (row: CmsRow) => (
      <span className="line-clamp-2 text-xs text-slate-600">
        {String(row.location ?? '—')}
      </span>
    ),
  },
  {
    key: 'category',
    label: 'Kategori',
    render: (row: CmsRow) => (
      <span className="text-slate-600">{String(row.category ?? '—')}</span>
    ),
  },
  {
    key: 'published',
    label: 'Status',
    render: (row: CmsRow) => <StatusBadge published={row.published} />,
  },
];

export default async function ContentEventsPage() {
  await requireContentPage();
  const events = await listEvents();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Konten
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Acara</h1>
        <p className="mt-1 text-sm text-slate-500">
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
        columns={COLUMNS}
        makeEmpty={() => ({
          title: '',
          slug: '',
          event_date: '',
          location: '',
          category: '',
          cover_image_url: '',
          description: '',
          sort_order: events.length + 1,
          published: true,
        })}
      />
    </div>
  );
}