import 'server-only';

import { cache } from 'react';

import {
  loadArticles,
  loadEmagazines,
  loadEvents,
  loadGallery,
} from '@/lib/cms/queries';
import {
  DEFAULT_ARTICLES,
  DEFAULT_EMAGAZINES,
  DEFAULT_EVENTS,
  DEFAULT_GALLERY,
  type MediaArticle,
  type MediaEmagazine,
  type MediaEvent,
  type MediaGalleryItem,
} from '@/lib/media-defaults';

// ------------------------------------------------------------------
// Normalisasi tanggal: tampilkan sebagai string YYYY-MM-DD.
// ------------------------------------------------------------------

function isoDate(value: string | null | undefined): string {
  if (!value) return '';
  const text = String(value).trim();
  // Buang kemungkinan komponen waktu bila ada (mis. "2026-03-14T00:00:00Z").
  return text.slice(0, 10);
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];
  const day = Number(match[3]);
  const month = months[Number(match[2]) - 1] ?? '';
  return `${day} ${month} ${match[1]}`;
}

export { formatDate };

// ------------------------------------------------------------------
// Pemuat konten publik dengan fallback ke data default di kode.
// Sama seperti getPublicContent(): bila tabel CMS belum dipasang
// atau kosong, nilai default dipakai agar halaman tidak pernah kosong.
// ------------------------------------------------------------------

export const getEvents = cache(async (): Promise<MediaEvent[]> => {
  const rows = await loadEvents();
  if (rows.length === 0) return DEFAULT_EVENTS;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: isoDate(row.event_date),
    location: row.location,
    category: row.category,
    image: row.cover_image_url,
  }));
});

export const getGallery = cache(async (): Promise<MediaGalleryItem[]> => {
  const rows = await loadGallery();
  if (rows.length === 0) return DEFAULT_GALLERY;
  return rows.map((row) => ({
    title: row.title,
    caption: row.caption,
    image: row.image_url,
    category: row.category,
  }));
});

export const getArticles = cache(async (): Promise<MediaArticle[]> => {
  const rows = await loadArticles();
  if (rows.length === 0) return DEFAULT_ARTICLES;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category,
    image: row.cover_image_url,
    date: isoDate(row.created_at),
  }));
});

export const getEmagazines = cache(async (): Promise<MediaEmagazine[]> => {
  const rows = await loadEmagazines();
  if (rows.length === 0) return DEFAULT_EMAGAZINES;
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    issue: row.issue,
    image: row.cover_image_url,
    fileUrl: row.file_url,
    date: isoDate(row.created_at),
  }));
});

/** Cari satu artikel berdasarkan slug (untuk halaman detail). */
export async function getArticleBySlug(
  slug: string
): Promise<MediaArticle | null> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}