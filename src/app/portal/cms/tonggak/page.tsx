import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
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

export default async function CmsMilestonesPage() {
  await requireCmsPage();
  const milestones = await listMilestones();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
          Tonggak Waktu
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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
      />
    </div>
  );
}
