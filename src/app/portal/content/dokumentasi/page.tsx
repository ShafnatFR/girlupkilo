import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
import { listGallery } from '@/lib/cms/admin';
import { requireContentPage } from '@/lib/cms/content-guard';

export const metadata: Metadata = { title: 'Konten — Dokumentasi' };

const FIELDS: FieldDef[] = [
  {
    name: 'title',
    label: 'Judul',
    type: 'text',
    required: true,
    placeholder: 'Diskusi Womantic',
  },
  {
    name: 'category',
    label: 'Kategori',
    type: 'text',
    placeholder: 'Diskusi / Kampanye / Edukasi',
  },
  {
    name: 'image_url',
    label: 'URL gambar',
    type: 'text',
    placeholder: 'https://...',
    hint: 'Tautan gambar dokumentasi yang akan tampil di galeri.',
  },
  {
    name: 'caption',
    label: 'Keterangan',
    type: 'textarea',
    full: true,
    placeholder: 'Keterangan singkat tentang foto ini...',
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

export default async function ContentGalleryPage() {
  await requireContentPage();
  const gallery = await listGallery();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Konten
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Dokumentasi</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mengelola galeri dokumentasi kegiatan yang tampil pada halaman
          Dokumentasi publik.
        </p>
      </div>

      <EntityManager
        entity="gallery"
        singular="dokumentasi"
        plural="Dokumentasi"
        description="Tambah, ubah, atau hapus foto dokumentasi beserta keterangannya."
        rows={gallery}
        fields={FIELDS}
      />
    </div>
  );
}
