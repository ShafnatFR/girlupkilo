import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
import { listLeaders } from '@/lib/cms/admin';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Pengurus' };

const FIELDS: FieldDef[] = [
  {
    name: 'name',
    label: 'Nama',
    type: 'text',
    required: true,
    placeholder: 'Nama lengkap',
    full: true,
  },
  {
    name: 'role',
    label: 'Jabatan',
    type: 'text',
    required: true,
    placeholder: 'Head of Programs Department',
    full: true,
  },
  {
    name: 'group_name',
    label: 'Kelompok',
    type: 'select',
    options: [
      { value: 'Inti', label: 'Jajaran inti (President / Vice President)' },
      { value: 'Departemen', label: 'Kepala & wakil departemen' },
    ],
    hint: 'Menentukan bagian mana tempat orang ini ditampilkan.',
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
    key: 'name',
    label: 'Nama',
    render: (row: CmsRow) => (
      <span className="font-medium text-slate-900">{String(row.name ?? '')}</span>
    ),
  },
  {
    key: 'role',
    label: 'Jabatan',
    render: (row: CmsRow) => (
      <span className="text-slate-600">{String(row.role ?? '')}</span>
    ),
  },
  {
    key: 'group_name',
    label: 'Kelompok',
    render: (row: CmsRow) => (
      <span
        className={`badge ${
          row.group_name === 'Inti'
            ? 'bg-gu-50 text-gu-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        {String(row.group_name ?? '')}
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

export default async function CmsLeadersPage() {
  await requireCmsPage();
  const leaders = await listLeaders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Pengurus</h1>
        <p className="mt-1 text-sm text-slate-500">
          Nama dan jabatan yang tampil pada bagian "Jajaran Pengurus" dan
          diagram struktur organisasi.
        </p>
      </div>

      <EntityManager
        entity="leaders"
        singular="pengurus"
        plural="Pengurus"
        description="Atur siapa saja yang tercantum beserta jabatannya."
        rows={leaders}
        fields={FIELDS}
        columns={COLUMNS}
        makeEmpty={() => ({
          name: '',
          role: '',
          group_name: 'Departemen',
          sort_order: leaders.length + 1,
          published: true,
        })}
      />
    </div>
  );
}