import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
import { listArticles } from '@/lib/cms/admin';
import { requireContentPage } from '@/lib/cms/content-guard';

export const metadata: Metadata = { title: 'Konten — Artikel' };

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    label: 'Judul artikel',
    type: 'text',
    required: true,
    placeholder: 'Memahami Kesetaraan Gender',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'memahami-kesetaraan-gender',
    hint: 'Kosongkan untuk dibuat otomatis dari judul. Huruf kecil dan tanda hubung.',
  },
  {
    name: 'category',
    label: 'Kategori',
    type: 'text',
    placeholder: 'Artikel / Esai / Kajian',
  },
  {
    name: 'author',
    label: 'Penulis',
    type: 'text',
    placeholder: 'Nama penulis atau tim',
  },
  {
    name: 'cover_image_url',
    label: 'URL gambar sampul',
    type: 'text',
    placeholder: 'https://...',
    hint: 'Tautan gambar sampul yang tampil di kartu artikel.',
  },
  {
    name: 'excerpt',
    label: 'Ringkasan',
    type: 'textarea',
    full: true,
    placeholder: 'Ringkasan singkat yang tampil di daftar artikel...',
  },
  {
    name: 'content',
    label: 'Isi artikel',
    type: 'textarea',
    full: true,
    placeholder: 'Tulis isi artikel. Pisahkan paragraf dengan baris kosong.',
    hint: 'Pisahkan setiap paragraf dengan satu baris kosong.',
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
    label: 'Artikel',
    render: (row: CmsRow) => (
      <div>
        <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
        <p className="text-xs text-slate-500">{String(row.slug ?? '')}</p>
      </div>
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
    key: 'author',
    label: 'Penulis',
    render: (row: CmsRow) => (
      <span className="text-slate-600">{String(row.author ?? '—')}</span>
    ),
  },
  {
    key: 'sort_order',
    label: 'Urutan',
    render: (row: CmsRow) => (
      <span className="text-slate-500">{String(row.sort_order ?? 0)}</span>
    ),
  },
  {
    key: 'published',
    label: 'Status',
    render: (row: CmsRow) => <StatusBadge published={row.published} />,
  },
];

export default async function ContentArticlesPage() {
  await requireContentPage();
  const articles = await listArticles();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Konten
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Artikel</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mengelola artikel yang tampil pada halaman Artikel publik.
        </p>
      </div>

      <EntityManager
        entity="articles"
        singular="artikel"
        plural="Artikel"
        description="Tambah, ubah, atau hapus artikel beserta isi dan penulisnya."
        rows={articles}
        fields={FIELDS}
        columns={COLUMNS}
        makeEmpty={() => ({
          title: '',
          slug: '',
          category: '',
          author: '',
          cover_image_url: '',
          excerpt: '',
          content: '',
          sort_order: articles.length + 1,
          published: true,
        })}
      />
    </div>
  );
}