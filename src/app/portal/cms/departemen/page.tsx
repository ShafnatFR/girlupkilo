import type { Metadata } from 'next';

import EntityManager, {
  type FieldDef,
} from '@/components/cms/EntityManager';
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
      />
    </div>
  );
}
