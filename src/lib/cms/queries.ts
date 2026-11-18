import 'server-only';

import { query } from '@/lib/db';

// ------------------------------------------------------------------
// Bentuk baris database (mengikuti db/cms.sql)
// ------------------------------------------------------------------

export interface DeptRow {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  description: string;
  focus: unknown;
  icon: string;
  head_name: string | null;
  deputy_name: string | null;
  member_count: number | null;
  sort_order: number;
  published: boolean;
}

export interface LeaderRow {
  id: string;
  name: string;
  role: string;
  group_name: 'Inti' | 'Departemen';
  sort_order: number;
  published: boolean;
}

export interface ProgramRow {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  sort_order: number;
  published: boolean;
}

export interface MilestoneRow {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
}

export interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string | null;
  location: string;
  category: string;
  cover_image_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface GalleryRow {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  category: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface EmagazineRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  issue: string;
  cover_image_url: string;
  file_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export type SettingsMap = Record<string, Record<string, unknown>>;

// ------------------------------------------------------------------
// Pembacaan untuk halaman publik (hanya yang published).
//
// Setiap fungsi menelan error agar halaman publik tetap tampil memakai
// nilai default di src/lib/site.ts bila skema CMS belum dipasang.
// ------------------------------------------------------------------

export async function loadSettings(): Promise<SettingsMap> {
  try {
    const rows = await query<{ key: string; value: unknown }>(
      'SELECT key, value FROM public.site_settings'
    );
    const map: SettingsMap = {};
    for (const row of rows) {
      if (row.value && typeof row.value === 'object' && !Array.isArray(row.value)) {
        map[row.key] = row.value as Record<string, unknown>;
      }
    }
    return map;
  } catch {
    return {};
  }
}

export async function loadDepartments(): Promise<DeptRow[]> {
  try {
    return await query<DeptRow>(
      `SELECT id, slug, name, short_name, tagline, description, focus, icon,
              head_name, deputy_name, member_count, sort_order, published
         FROM public.cms_departments
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadLeaders(): Promise<LeaderRow[]> {
  try {
    return await query<LeaderRow>(
      `SELECT id, name, role, group_name, sort_order, published
         FROM public.cms_leaders
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadPrograms(): Promise<ProgramRow[]> {
  try {
    return await query<ProgramRow>(
      `SELECT id, title, category, description, icon, sort_order, published
         FROM public.cms_programs
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadMilestones(): Promise<MilestoneRow[]> {
  try {
    return await query<MilestoneRow>(
      `SELECT id, year, title, description, sort_order, published
         FROM public.cms_milestones
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadEvents(): Promise<EventRow[]> {
  try {
    return await query<EventRow>(
      `SELECT id, slug, title, description, event_date, location, category,
              cover_image_url, sort_order, published, created_at
         FROM public.cms_events
        WHERE published = true
        ORDER BY event_date DESC NULLS LAST, sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadGallery(): Promise<GalleryRow[]> {
  try {
    return await query<GalleryRow>(
      `SELECT id, title, caption, image_url, category, sort_order, published,
              created_at
         FROM public.cms_gallery
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadArticles(): Promise<ArticleRow[]> {
  try {
    return await query<ArticleRow>(
      `SELECT id, slug, title, excerpt, content, author, category,
              cover_image_url, sort_order, published, created_at
         FROM public.cms_articles
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

export async function loadEmagazines(): Promise<EmagazineRow[]> {
  try {
    return await query<EmagazineRow>(
      `SELECT id, slug, title, description, issue, cover_image_url, file_url,
              sort_order, published, created_at
         FROM public.cms_emagazines
        WHERE published = true
        ORDER BY sort_order ASC, created_at ASC`
    );
  } catch {
    return [];
  }
}

/** Ubah nilai JSONB menjadi array string, dengan fallback bila kosong. */
export function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  const result = value.filter((item): item is string => typeof item === 'string');
  return result.length > 0 ? result : fallback;
}