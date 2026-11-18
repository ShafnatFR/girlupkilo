import { ICON_MAP } from '@/lib/cms/icons';

/** Error validasi yang dipetakan ke HTTP 400 oleh route handler. */
export class CmsValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CmsValidationError';
  }
}

// ------------------------------------------------------------------
// Helper field
// ------------------------------------------------------------------

export function requiredText(value: unknown, label: string, max = 200): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new CmsValidationError(`${label} wajib diisi`);
  }
  const text = value.trim();
  if (text.length > max) {
    throw new CmsValidationError(`${label} maksimal ${max} karakter`);
  }
  return text;
}

export function optionalText(value: unknown, label: string, max = 500): string {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'string') {
    throw new CmsValidationError(`${label} harus berupa teks`);
  }
  const text = value.trim();
  if (text.length > max) {
    throw new CmsValidationError(`${label} maksimal ${max} karakter`);
  }
  return text;
}

export function nullableText(
  value: unknown,
  label: string,
  max = 200
): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') {
    throw new CmsValidationError(`${label} harus berupa teks`);
  }
  const text = value.trim();
  if (text === '') return null;
  if (text.length > max) {
    throw new CmsValidationError(`${label} maksimal ${max} karakter`);
  }
  return text;
}

export function integer(
  value: unknown,
  label: string,
  opts: { min?: number; max?: number; fallback?: number } = {}
): number {
  if (value === null || value === undefined || value === '') {
    return opts.fallback ?? 0;
  }
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new CmsValidationError(`${label} harus berupa bilangan bulat`);
  }
  const min = opts.min ?? 0;
  const max = opts.max ?? 999_999;
  if (value < min || value > max) {
    throw new CmsValidationError(`${label} harus antara ${min} dan ${max}`);
  }
  return value;
}

export function nullableInteger(
  value: unknown,
  label: string,
  opts: { min?: number; max?: number } = {}
): number | null {
  if (value === null || value === undefined || value === '') return null;
  return integer(value, label, opts);
}

export function boolean(value: unknown, label: string): boolean {
  if (typeof value !== 'boolean') {
    throw new CmsValidationError(`${label} harus berupa true atau false`);
  }
  return value;
}

export function stringList(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) {
    throw new CmsValidationError(`${label} harus berupa daftar teks`);
  }
  const result: string[] = [];
  value.forEach((item, i) => {
    if (typeof item !== 'string') {
      throw new CmsValidationError(`${label} butir ke-${i + 1} harus berupa teks`);
    }
    const text = item.trim();
    if (text !== '') result.push(text);
  });
  return result;
}

export function iconKey(value: unknown): string {
  const key = optionalText(value, 'Ikon', 40) || 'sprout';
  if (!(key in ICON_MAP)) {
    throw new CmsValidationError('Pilihan ikon tidak valid');
  }
  return key;
}

export function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  label: string
): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new CmsValidationError(`${label} tidak valid`);
  }
  return value as T;
}

/** Ubah teks menjadi slug URL yang aman. */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (slug === '') {
    throw new CmsValidationError('Slug tidak valid — gunakan huruf dan angka');
  }
  return slug;
}

// ------------------------------------------------------------------
// Parser per entitas
// ------------------------------------------------------------------

export function parseDepartment(body: Record<string, unknown>) {
  return {
    slug: slugify(
      typeof body.slug === 'string' && body.slug.trim() !== ''
        ? body.slug
        : requiredText(body.name, 'Nama departemen', 120)
    ),
    name: requiredText(body.name, 'Nama departemen', 120),
    short_name: requiredText(body.short_name, 'Nama singkat', 60),
    tagline: optionalText(body.tagline, 'Tagline', 160),
    description: optionalText(body.description, 'Deskripsi', 1200),
    focus: stringList(body.focus ?? [], 'Fokus kerja'),
    icon: iconKey(body.icon),
    head_name: nullableText(body.head_name, 'Nama kepala', 120),
    deputy_name: nullableText(body.deputy_name, 'Nama wakil', 120),
    member_count: nullableInteger(body.member_count, 'Jumlah anggota', {
      min: 0,
      max: 999,
    }),
    sort_order: integer(body.sort_order, 'Urutan', { fallback: 0, min: 0 }),
    published: boolean(body.published ?? false, 'Status tayang'),
  };
}

export function parseLeader(body: Record<string, unknown>) {
  return {
    name: requiredText(body.name, 'Nama', 120),
    role: requiredText(body.role, 'Jabatan', 160),
    group_name: oneOf(body.group_name, ['Inti', 'Departemen'] as const, 'Kelompok'),
    sort_order: integer(body.sort_order, 'Urutan', { fallback: 0, min: 0 }),
    published: boolean(body.published ?? false, 'Status tayang'),
  };
}

export function parseProgram(body: Record<string, unknown>) {
  return {
    title: requiredText(body.title, 'Judul program', 160),
    category: optionalText(body.category, 'Kategori', 80),
    description: optionalText(body.description, 'Deskripsi', 1200),
    icon: iconKey(body.icon),
    sort_order: integer(body.sort_order, 'Urutan', { fallback: 0, min: 0 }),
    published: boolean(body.published ?? false, 'Status tayang'),
  };
}

export function parseMilestone(body: Record<string, unknown>) {
  return {
    year: requiredText(body.year, 'Tahun', 12),
    title: requiredText(body.title, 'Judul', 160),
    description: optionalText(body.description, 'Deskripsi', 1200),
    sort_order: integer(body.sort_order, 'Urutan', { fallback: 0, min: 0 }),
    published: boolean(body.published ?? false, 'Status tayang'),
  };
}

/** Baca body JSON atau lempar error validasi 400. */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new CmsValidationError('Body JSON tidak valid');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new CmsValidationError('Body harus berupa objek JSON');
  }
  return body as Record<string, unknown>;
}