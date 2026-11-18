import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
import { listPrograms } from '@/lib/cms/admin';
import { ICON_CHOICES } from '@/lib/cms/icons';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Program' };

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    label: 'Nama program',
    type: 'text',
    required: true,
    placeholder: 'Womantic',
    full: true,
  },
  {
    name: 'category',
    label: 'Kategori',
    type: 'text',
    placeholder: 'Diskusi & Advokasi',
  },
  {
    name: 'icon',
    label: 'Ikon',
    type: 'select',
    options: ICON_CHOICES,
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    full: true,
  },
  {
    name: 'sort_order',
    label: 'Urutan tampil',
    type: 'number',
  },
  {
    name: 'published',
    label: 'Tayangkan di halaman publik',
    type: 'checkbox',
    full: true,
  },
];

const COLUMNS: ColumnDef[] = [
  {
    key: 'title',
    label: 'Program',
    render: (row: CmsRow) => (
      <span className="font-medium text-slate-900">{String(row.title ?? '')}</span>
    ),
  },
  {
    key: 'category',
    label: 'Kategori',
    render: (row: CmsRow) => (
      <span className="badge bg-slate-100 text-slate-600">
        {String(row.category || '—')}
      </span>
    ),
  },
  {
    key: 'description',
    label: 'Deskripsi',
    className: 'max-w-sm',
    render: (row: CmsRow) => (
      <span className="line-clamp-2 text-xs text-slate-600">
        {String(row.description || '—')}
      </span>
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

export default async function CmsProgramsPage() {
  await requireCmsPage();
  const programs = await listPrograms();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Program Unggulan
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kartu program yang tampil pada bagian "Program" di halaman beranda.
        </p>
      </div>

      <EntityManager
        entity="programs"
        singular="program"
        plural="Program"
        description="Tambah, ubah, atau hapus program yang ditampilkan ke publik."
        rows={programs}
        fields={FIELDS}
        columns={COLUMNS}
        makeEmpty={() => ({
          title: '',
          category: '',
          description: '',
          icon: 'sparkles',
          sort_order: programs.length + 1,
          published: true,
        })}
      />
    </div>
  );
}