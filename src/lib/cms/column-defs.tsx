'use client';

import { ColumnDef, CmsRow } from '@/components/cms/EntityManager';
import StatusBadge from '@/components/cms/StatusBadge';

/**
 * Definisi kolom dan fungsi makeEmpty per entitas CMS.
 * Disimpan di sisi client karena berisi fungsi render (JSX) yang tidak
 * dapat diserap dari Server Component ke Client Component.
 */
export function getColumnDefs(entity: string): ColumnDef[] {
  switch (entity) {
    case 'events':
      return [
        {
          key: 'title',
          label: 'Acara',
          render: (row: CmsRow) => (
            <div>
              <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
              <p className="text-xs text-slate-500">{String(row.slug ?? '')}</p>
            </div>
          ),
        },
        {
          key: 'event_date',
          label: 'Tanggal',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.event_date ?? '—')}</span>
          ),
        },
        {
          key: 'location',
          label: 'Lokasi',
          className: 'max-w-xs',
          render: (row: CmsRow) => (
            <span className="line-clamp-2 text-xs text-slate-600">
              {String(row.location ?? '—')}
            </span>
          ),
        },
        {
          key: 'category',
          label: 'Kategori',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.category ?? '—')}</span>
          ),
        },
        {
          key: 'published',
          label: 'Status',
          render: (row: CmsRow) => <StatusBadge published={row.published} />,
        },
      ];

    case 'articles':
      return [
        {
          key: 'title',
          label: 'Artikel',
          render: (row: CmsRow) => (
            <div>
              <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
              <p className="text-xs text-slate-500">{String(row.slug ?? '')}</p>
            </div>
          ),
        },
        {
          key: 'category',
          label: 'Kategori',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.category ?? '—')}</span>
          ),
        },
        {
          key: 'author',
          label: 'Penulis',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.author ?? '—')}</span>
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

    case 'gallery':
      return [
        {
          key: 'title',
          label: 'Judul',
          render: (row: CmsRow) => (
            <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
          ),
        },
        {
          key: 'category',
          label: 'Kategori',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.category ?? '—')}</span>
          ),
        },
        {
          key: 'caption',
          label: 'Keterangan',
          className: 'max-w-xs',
          render: (row: CmsRow) => (
            <span className="line-clamp-2 text-xs text-slate-600">
              {String(row.caption ?? '—')}
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

    case 'emagazines':
      return [
        {
          key: 'title',
          label: 'Terbitan',
          render: (row: CmsRow) => (
            <div>
              <p className="font-medium text-slate-900">{String(row.title ?? '')}</p>
              <p className="text-xs text-slate-500">{String(row.slug ?? '')}</p>
            </div>
          ),
        },
        {
          key: 'issue',
          label: 'Edisi',
          render: (row: CmsRow) => (
            <span className="text-slate-600">{String(row.issue ?? '—')}</span>
          ),
        },
        {
          key: 'file_url',
          label: 'Berkas',
          className: 'max-w-xs',
          render: (row: CmsRow) => (
            <span className="line-clamp-1 text-xs text-slate-500">
              {String(row.file_url ?? '—')}
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

    case 'departments':
      return [
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

    case 'leaders':
      return [
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

    case 'programs':
      return [
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

    case 'milestones':
      return [
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

    default:
      return [];
  }
}

export function getMakeEmpty(entity: string): () => Record<string, unknown> {
  switch (entity) {
    case 'events':
      return () => ({
        title: '',
        slug: '',
        event_date: '',
        location: '',
        category: '',
        cover_image_url: '',
        description: '',
        sort_order: 1,
        published: true,
      });
    case 'articles':
      return () => ({
        title: '',
        slug: '',
        category: '',
        author: '',
        cover_image_url: '',
        excerpt: '',
        content: '',
        sort_order: 1,
        published: true,
      });
    case 'gallery':
      return () => ({
        title: '',
        category: '',
        image_url: '',
        caption: '',
        sort_order: 1,
        published: true,
      });
    case 'emagazines':
      return () => ({
        title: '',
        slug: '',
        issue: '',
        cover_image_url: '',
        file_url: '',
        description: '',
        sort_order: 1,
        published: true,
      });
    case 'departments':
      return () => ({
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
        sort_order: 1,
        published: true,
      });
    case 'leaders':
      return () => ({
        name: '',
        role: '',
        group_name: 'Departemen',
        sort_order: 1,
        published: true,
      });
    case 'programs':
      return () => ({
        title: '',
        category: '',
        description: '',
        icon: 'sparkles',
        sort_order: 1,
        published: true,
      });
    case 'milestones':
      return () => ({
        year: '',
        title: '',
        description: '',
        sort_order: 1,
        published: true,
      });
    default:
      return () => ({});
  }
}
