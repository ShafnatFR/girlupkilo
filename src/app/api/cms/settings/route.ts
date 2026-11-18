import { NextResponse } from 'next/server';

import * as cms from '@/lib/cms/admin';
import { query } from '@/lib/db';
import { cmsErrorResponse } from '@/lib/cms/http';
import { CmsValidationError, readJson } from '@/lib/cms/validate';

/** GET /api/cms/settings — seluruh dokumen konten. */
export async function GET() {
  try {
    const guard = await cms.requireCmsEditor();
    if (!guard.ok) return guard.response;

    const rows = await query<{ key: string; value: unknown }>(
      'SELECT key, value FROM public.site_settings'
    );

    const data: Record<string, unknown> = {};
    for (const row of rows) data[row.key] = row.value;

    return NextResponse.json({ data });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

/** PUT /api/cms/settings — simpan satu dokumen konten. */
export async function PUT(request: Request) {
  try {
    const guard = await cms.requireCmsEditor();
    if (!guard.ok) return guard.response;

    const body = await readJson(request);
    const key = body.key;

    if (typeof key !== 'string' || !cms.isSettingsKey(key)) {
      throw new CmsValidationError('Bagian konten tidak dikenal');
    }

    if (!('value' in body)) {
      throw new CmsValidationError('Nilai konten wajib disertakan');
    }

    await cms.saveSetting(key, body.value, guard.user.id);

    return NextResponse.json({ ok: true, key });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

/** DELETE /api/cms/settings?key=... — kembalikan bagian ke nilai default. */
export async function DELETE(request: Request) {
  try {
    const guard = await cms.requireCmsEditor();
    if (!guard.ok) return guard.response;

    const key = new URL(request.url).searchParams.get('key');
    if (!key || !cms.isSettingsKey(key)) {
      throw new CmsValidationError('Bagian konten tidak dikenal');
    }

    const deleted = await cms.deleteSetting(key);
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}