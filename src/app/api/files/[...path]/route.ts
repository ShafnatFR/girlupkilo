import fs from 'node:fs/promises';
import path from 'node:path';

import { getCurrentUser } from '@/lib/auth';
import { uploadDir } from '@/app/api/upload/route';

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
};

const SAFE = /^[A-Za-z0-9._-]+$/;

/** GET /api/files/<userId>/<namaFile> — sajikan bukti pengeluaran dari disk. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { path: segments } = await params;
  if (!segments || segments.length !== 2 || !segments.every((s) => SAFE.test(s))) {
    return new Response('Not found', { status: 404 });
  }

  const [ownerId, filename] = segments;
  // Staff hanya boleh membuka file miliknya; approver boleh semua.
  const canRead = ownerId === user.id || ['manager', 'finance', 'admin'].includes(user.role);
  if (!canRead) return new Response('Forbidden', { status: 403 });

  const full = path.join(uploadDir(), ownerId, filename);
  try {
    const data = await fs.readFile(full);
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    return new Response(new Uint8Array(data), {
      headers: {
        'content-type': MIME[ext] ?? 'application/octet-stream',
        'cache-control': 'private, max-age=3600',
        'content-disposition': `inline; filename="${filename}"`,
      },
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
