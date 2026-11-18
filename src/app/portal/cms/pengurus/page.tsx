import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
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

export default async function CmsLeadersPage() {
  await requireCmsPage();
  const leaders = await listLeaders();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">Pengurus</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
      />
    </div>
  );
}
