import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
import { listEmagazines } from '@/lib/cms/admin';
import { requireContentPage } from '@/lib/cms/content-guard';

export const metadata: Metadata = { title: 'Konten — E-Magazine' };

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    label: 'Judul terbitan',
    type: 'text',
    required: true,
    placeholder: 'E-Magazine Edisi 1',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'e-magazine-edisi-1',
    hint: 'Kosongkan untuk dibuat otomatis dari judul. Huruf kecil dan tanda hubung.',
  },
  {
    name: 'issue',
    label: 'Edisi',
    type: 'text',
    placeholder: 'Edisi 1',
  },
  {
    name: 'cover_image_url',
    label: 'URL gambar sampul',
    type: 'text',
    placeholder: 'https://...',
    hint: 'Tautan gambar sampul e-magazine.',
  },
  {
    name: 'file_url',
    label: 'URL berkas (PDF)',
    type: 'text',
    placeholder: 'https://...',
    hint: 'Tautan berkas yang dapat diunduh/dibaca pengunjung.',
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    full: true,
    placeholder: 'Jelaskan isi terbitan ini...',
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

export default async function ContentEmagazinePage() {
  await requireContentPage();
  const emagazines = await listEmagazines();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Konten
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">E-Magazine</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mengelola terbitan e-magazine yang tampil pada halaman E-Magazine
          publik.
        </p>
      </div>

      <EntityManager
        entity="emagazines"
        singular="terbitan"
        plural="E-Magazine"
        description="Tambah, ubah, atau hapus terbitan e-magazine beserta tautan berkasnya."
        rows={emagazines}
        fields={FIELDS}
      />
    </div>
  );
}
