import 'server-only';

import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import type { Profile } from '@/lib/types';

// ------------------------------------------------------------------
// Otorisasi
// ------------------------------------------------------------------

/** Peran yang boleh mengelola konten halaman publik. */
export const CMS_ROLES: Profile['role'][] = ['admin', 'manager'];

export type CmsGuard =
  | { ok: true; user: Profile }
  | { ok: false; response: NextResponse };

/** Pastikan pemanggil adalah editor CMS. */
export async function requireCmsEditor(): Promise<CmsGuard> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  if (!CMS_ROLES.includes(user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Hanya admin atau manajer yang boleh mengubah konten' },
        { status: 403 }
      ),
    };
  }
  return { ok: true, user };
}

// ------------------------------------------------------------------
// Bentuk baris
// ------------------------------------------------------------------

export type DeptRecord = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  description: string;
  focus: string[];
  icon: string;
  head_name: string | null;
  deputy_name: string | null;
  member_count: number | null;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export type LeaderRecord = {
  id: string;
  name: string;
  role: string;
  group_name: 'Inti' | 'Departemen';
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export type ProgramRecord = {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export type MilestoneRecord = {
  id: string;
  year: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

// ------------------------------------------------------------------
// Departemen
// ------------------------------------------------------------------

const DEPT_COLUMNS = `id, slug, name, short_name, tagline, description, focus,
  icon, head_name, deputy_name, member_count, sort_order, published,
  updated_at::text AS updated_at`;

export async function listDepartments(): Promise<DeptRecord[]> {
  const rows = await query<DeptRecord & { focus: unknown }>(
    `SELECT ${DEPT_COLUMNS}
       FROM public.cms_departments
      ORDER BY sort_order ASC, created_at ASC`
  );
  return rows.map(normalizeDept);
}

function normalizeDept(row: DeptRecord & { focus: unknown }): DeptRecord {
  return {
    ...row,
    focus: Array.isArray(row.focus)
      ? row.focus.filter((v): v is string => typeof v === 'string')
      : [],
  };
}

export async function createDepartment(input: {
  slug: string;
  name: string;
  short_name: string;
  tagline: string;
  description: string;
  focus: string[];
  icon: string;
  head_name: string | null;
  deputy_name: string | null;
  member_count: number | null;
  sort_order: number;
  published: boolean;
}): Promise<DeptRecord> {
  const rows = await query<DeptRecord & { focus: unknown }>(
    `INSERT INTO public.cms_departments
       (slug, name, short_name, tagline, description, focus, icon,
        head_name, deputy_name, member_count, sort_order, published)
     VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10,$11,$12)
     RETURNING ${DEPT_COLUMNS}`,
    [
      input.slug,
      input.name,
      input.short_name,
      input.tagline,
      input.description,
      JSON.stringify(input.focus),
      input.icon,
      input.head_name,
      input.deputy_name,
      input.member_count,
      input.sort_order,
      input.published,
    ]
  );
  return normalizeDept(rows[0]);
}

export async function updateDepartment(
  id: string,
  input: {
    slug: string;
    name: string;
    short_name: string;
    tagline: string;
    description: string;
    focus: string[];
    icon: string;
    head_name: string | null;
    deputy_name: string | null;
    member_count: number | null;
    sort_order: number;
    published: boolean;
  },
  userId: string
): Promise<DeptRecord | null> {
  const rows = await query<DeptRecord & { focus: unknown }>(
    `UPDATE public.cms_departments SET
       slug = $2, name = $3, short_name = $4, tagline = $5, description = $6,
       focus = $7::jsonb, icon = $8, head_name = $9, deputy_name = $10,
       member_count = $11, sort_order = $12, published = $13, updated_by = $14
     WHERE id = $1
     RETURNING ${DEPT_COLUMNS}`,
    [
      id,
      input.slug,
      input.name,
      input.short_name,
      input.tagline,
      input.description,
      JSON.stringify(input.focus),
      input.icon,
      input.head_name,
      input.deputy_name,
      input.member_count,
      input.sort_order,
      input.published,
      userId,
    ]
  );
  return rows[0] ? normalizeDept(rows[0]) : null;
}

export async function deleteDepartment(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'DELETE FROM public.cms_departments WHERE id = $1 RETURNING id',
    [id]
  );
  return rows.length > 0;
}

// ------------------------------------------------------------------
// Pengurus
// ------------------------------------------------------------------

const LEADER_COLUMNS =
  'id, name, role, group_name, sort_order, published, updated_at::text AS updated_at';

export async function listLeaders(): Promise<LeaderRecord[]> {
  return query<LeaderRecord>(
    `SELECT ${LEADER_COLUMNS} FROM public.cms_leaders
      ORDER BY sort_order ASC, created_at ASC`
  );
}

export async function createLeader(input: {
  name: string;
  role: string;
  group_name: 'Inti' | 'Departemen';
  sort_order: number;
  published: boolean;
}): Promise<LeaderRecord> {
  const rows = await query<LeaderRecord>(
    `INSERT INTO public.cms_leaders (name, role, group_name, sort_order, published)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING ${LEADER_COLUMNS}`,
    [input.name, input.role, input.group_name, input.sort_order, input.published]
  );
  return rows[0];
}

export async function updateLeader(
  id: string,
  input: {
    name: string;
    role: string;
    group_name: 'Inti' | 'Departemen';
    sort_order: number;
    published: boolean;
  },
  userId: string
): Promise<LeaderRecord | null> {
  const rows = await query<LeaderRecord>(
    `UPDATE public.cms_leaders SET
       name = $2, role = $3, group_name = $4, sort_order = $5, published = $6,
       updated_by = $7
     WHERE id = $1
     RETURNING ${LEADER_COLUMNS}`,
    [id, input.name, input.role, input.group_name, input.sort_order, input.published, userId]
  );
  return rows[0] ?? null;
}

export async function deleteLeader(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'DELETE FROM public.cms_leaders WHERE id = $1 RETURNING id',
    [id]
  );
  return rows.length > 0;
}

// ------------------------------------------------------------------
// Program
// ------------------------------------------------------------------

const PROGRAM_COLUMNS =
  'id, title, category, description, icon, sort_order, published, updated_at::text AS updated_at';

export async function listPrograms(): Promise<ProgramRecord[]> {
  return query<ProgramRecord>(
    `SELECT ${PROGRAM_COLUMNS} FROM public.cms_programs
      ORDER BY sort_order ASC, created_at ASC`
  );
}

export async function createProgram(input: {
  title: string;
  category: string;
  description: string;
  icon: string;
  sort_order: number;
  published: boolean;
}): Promise<ProgramRecord> {
  const rows = await query<ProgramRecord>(
    `INSERT INTO public.cms_programs (title, category, description, icon, sort_order, published)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING ${PROGRAM_COLUMNS}`,
    [input.title, input.category, input.description, input.icon, input.sort_order, input.published]
  );
  return rows[0];
}

export async function updateProgram(
  id: string,
  input: {
    title: string;
    category: string;
    description: string;
    icon: string;
    sort_order: number;
    published: boolean;
  },
  userId: string
): Promise<ProgramRecord | null> {
  const rows = await query<ProgramRecord>(
    `UPDATE public.cms_programs SET
       title = $2, category = $3, description = $4, icon = $5,
       sort_order = $6, published = $7, updated_by = $8
     WHERE id = $1
     RETURNING ${PROGRAM_COLUMNS}`,
    [id, input.title, input.category, input.description, input.icon, input.sort_order, input.published, userId]
  );
  return rows[0] ?? null;
}

export async function deleteProgram(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'DELETE FROM public.cms_programs WHERE id = $1 RETURNING id',
    [id]
  );
  return rows.length > 0;
}

// ------------------------------------------------------------------
// Tonggak waktu
// ------------------------------------------------------------------

const MILESTONE_COLUMNS =
  'id, year, title, description, sort_order, published, updated_at::text AS updated_at';

export async function listMilestones(): Promise<MilestoneRecord[]> {
  return query<MilestoneRecord>(
    `SELECT ${MILESTONE_COLUMNS} FROM public.cms_milestones
      ORDER BY sort_order ASC, created_at ASC`
  );
}

export async function createMilestone(input: {
  year: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
}): Promise<MilestoneRecord> {
  const rows = await query<MilestoneRecord>(
    `INSERT INTO public.cms_milestones (year, title, description, sort_order, published)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING ${MILESTONE_COLUMNS}`,
    [input.year, input.title, input.description, input.sort_order, input.published]
  );
  return rows[0];
}

export async function updateMilestone(
  id: string,
  input: {
    year: string;
    title: string;
    description: string;
    sort_order: number;
    published: boolean;
  },
  userId: string
): Promise<MilestoneRecord | null> {
  const rows = await query<MilestoneRecord>(
    `UPDATE public.cms_milestones SET
       year = $2, title = $3, description = $4, sort_order = $5, published = $6,
       updated_by = $7
     WHERE id = $1
     RETURNING ${MILESTONE_COLUMNS}`,
    [id, input.year, input.title, input.description, input.sort_order, input.published, userId]
  );
  return rows[0] ?? null;
}

export async function deleteMilestone(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    'DELETE FROM public.cms_milestones WHERE id = $1 RETURNING id',
    [id]
  );
  return rows.length > 0;
}

// ------------------------------------------------------------------
// Pengaturan (dokumen JSON)
// ------------------------------------------------------------------

/** Bagian konten yang dapat diedit sebagai dokumen JSON. */
export const SETTINGS_KEYS = [
  'identity',
  'about',
  'vision',
  'missions',
  'values',
  'pillars',
  'stats',
  'join_steps',
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

export function isSettingsKey(value: string): value is SettingsKey {
  return (SETTINGS_KEYS as readonly string[]).includes(value);
}

export async function saveSetting(
  key: SettingsKey,
  value: unknown,
  userId: string
): Promise<void> {
  await query(
    `INSERT INTO public.site_settings (key, value, updated_by)
     VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [key, JSON.stringify(value), userId]
  );
}

export async function deleteSetting(key: SettingsKey): Promise<boolean> {
  const rows = await query<{ key: string }>(
    'DELETE FROM public.site_settings WHERE key = $1 RETURNING key',
    [key]
  );
  return rows.length > 0;
}

/** Ambil satu dokumen pengaturan (dipakai form admin). */
export async function getSetting(
  key: SettingsKey
): Promise<Record<string, unknown> | null> {
  return queryOne<Record<string, unknown>>(
    'SELECT value FROM public.site_settings WHERE key = $1',
    [key]
  ).then((row) => (row ? (row.value as Record<string, unknown>) : null));
}