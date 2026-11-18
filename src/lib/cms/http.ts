import { NextResponse } from 'next/server';

import { CmsValidationError } from '@/lib/cms/validate';

/** Satu tempat untuk memetakan error CMS ke respons HTTP. */
export function cmsErrorResponse(error: unknown): NextResponse {
  if (error instanceof CmsValidationError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const code = (error as { code?: string } | null)?.code;

  if (code === '23505') {
    return NextResponse.json(
      { error: 'Nilai yang harus unik sudah dipakai — periksa kolom slug' },
      { status: 409 }
    );
  }
  if (code === '23503') {
    return NextResponse.json(
      { error: 'Data terkait tidak ditemukan' },
      { status: 400 }
    );
  }

  console.error('[cms]', error);
  return NextResponse.json(
    { error: 'Terjadi kesalahan pada server' },
    { status: 500 }
  );
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Pastikan parameter id berupa UUID yang valid. */
export function assertUuid(value: string): void {
  if (!UUID_RE.test(value)) {
    throw new CmsValidationError('ID tidak valid');
  }
}