import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
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

export default async function CmsProgramsPage() {
  await requireCmsPage();
  const programs = await listPrograms();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
          Program Unggulan
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
      />
    </div>
  );
}
