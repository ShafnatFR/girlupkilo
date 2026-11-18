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

/** Ubah nilai JSONB menjadi array string, dengan fallback bila kosong. */
export function toStringArray(value: unknown, fallback: string[] = []): string[] {
  if (!Array.isArray(value)) return fallback;
  const result = value.filter((item): item is string => typeof item === 'string');
  return result.length > 0 ? result : fallback;
}