import type { Metadata } from 'next';

import EntityManager, {
  type ColumnDef,
  type CmsRow,
  type FieldDef,
} from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';
import { listDepartments } from '@/lib/cms/admin';
import { ICON_CHOICES } from '@/lib/cms/icons';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Departemen' };

const FIELDS: FieldDef[] = [
  {
    name: 'name',
    label: 'Nama lengkap',
    type: 'text',
    required: true,
    placeholder: 'Programs Department',
  },
  {
    name: 'short_name',
    label: 'Nama singkat',
    type: 'text',
    required: true,
    placeholder: 'Programs',
    hint: 'Ditampilkan di kartu dan diagram struktur.',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'programs',
    hint: 'Dipakai sebagai tautan #slug. Huruf kecil dan tanda hubung.',
  },
  {
    name: 'icon',
    label: 'Ikon',
    type: 'select',
    options: ICON_CHOICES,
  },
  {
    name: 'tagline',
    label: 'Tagline',
    type: 'text',
    placeholder: 'Dari gagasan menjadi aksi di lapangan',
    full: true,
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    full: true,
    placeholder: 'Jelaskan bidang kerja departemen ini...',
  },
  {
    name: 'focus',
    label: 'Fokus kerja',
    type: 'list',
    full: true,
    hint: 'Satu butir per baris.',
  },
  {
    name: 'head_name',
    label: 'Nama kepala departemen',
    type: 'text',
    nullable: true,
    placeholder: 'Kosongkan bila belum ada',
  },
  {
    name: 'deputy_name',
    label: 'Nama wakil departemen',
    type: 'text',
    nullable: true,
    placeholder: 'Kosongkan bila belum ada',
  },
  {
    name: 'member_count',
    label: 'Jumlah anggota',
    type: 'number',
    nullable: true,
    placeholder: 'Kosongkan bila tidak diketahui',
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
    key: 'short_name',
    label: 'Departemen',
    render: (row: CmsRow) => (
      <div>
        <p className="font-medium text-slate-900">{String(row.short_name ?? '')}</p>
        <p className="text-xs text-slate-500">{String(row.name ?? '')}</p>
      </div>
    ),
  },
  {
    key: 'tagline',
    label: 'Tagline',
    className: 'max-w-xs',
    render: (row: CmsRow) => (
      <span className="line-clamp-2 text-xs text-slate-600">
        {String(row.tagline ?? '—')}
      </span>
    ),
  },
  {
    key: 'head_name',
    label: 'Kepala / Wakil',
    render: (row: CmsRow) => (
      <div className="text-xs">
        <p className="text-slate-700">{String(row.head_name ?? '—')}</p>
        {row.deputy_name ? (
          <p className="text-slate-500">Wakil: {String(row.deputy_name)}</p>
        ) : null}
      </div>
    ),
  },
  {
    key: 'member_count',
    label: 'Anggota',
    render: (row: CmsRow) => (
      <span className="text-slate-600">
        {row.member_count === null || row.member_count === undefined
          ? '—'
          : String(row.member_count)}
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

export default async function CmsDepartmentsPage() {
  await requireCmsPage();
  const departments = await listDepartments();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Departemen</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mengatur susunan departemen yang tampil pada halaman publik dan
          diagram struktur organisasi.
        </p>
      </div>

      <EntityManager
        entity="departments"
        singular="departemen"
        plural="Departemen"
        description="Tambah, ubah, atau hapus departemen beserta fokus kerja dan pengurusnya."
        rows={departments}
        fields={FIELDS}
        columns={COLUMNS}
        makeEmpty={() => ({
          slug: '',
          name: '',
          short_name: '',
          tagline: '',
          description: '',
          focus: [],
          icon: 'sprout',
          head_name: '',
          deputy_name: '',
          member_count: '',
          sort_order: departments.length + 1,
          published: true,
        })}
      />
    </div>
  );
}