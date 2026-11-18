import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
import { listMilestones } from '@/lib/cms/admin';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Tonggak Waktu' };

const FIELDS: FieldDef[] = [
  {
    name: 'year',
    label: 'Tahun',
    type: 'text',
    required: true,
    placeholder: '2025',
    hint: 'Boleh berupa teks, mis. "2025" atau "2030".',
  },
  {
    name: 'sort_order',
    label: 'Urutan tampil',
    type: 'number',
  },
  {
    name: 'title',
    label: 'Judul',
    type: 'text',
    required: true,
    placeholder: 'Girl Up UI berdiri',
    full: true,
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    full: true,
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
    key: 'year',
    label: 'Tahun',
    render: (row: CmsRow) => (
      <span className="badge bg-gu-50 text-gu-700">
        {String(row.year ?? '')}
      </span>
    ),
  },
  {
    key: 'title',
    label: 'Judul',
    render: (row: CmsRow) => (
      <span className="font-medium text-slate-900">{String(row.title ?? '')}</span>
    ),
  },
  {
    key: 'description',
    label: 'Deskripsi',
    className: 'max-w-md',
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

export default async function CmsMilestonesPage() {
  await requireCmsPage();
  const milestones = await listMilestones();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Tonggak Waktu
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Perjalanan organisasi yang tampil pada bagian "Perjalanan" di
          halaman beranda.
        </p>
      </div>

      <EntityManager
        entity="milestones"
        singular="tonggak"
        plural="Tonggak waktu"
        description="Tambah, ubah, atau hapus tonggak perjalanan organisasi."
        rows={milestones}
        fields={FIELDS}
        columns={COLUMNS}
        makeEmpty={() => ({
          year: '',
          title: '',
          description: '',
          sort_order: milestones.length + 1,
          published: true,
        })}
      />
    </div>
  );
}