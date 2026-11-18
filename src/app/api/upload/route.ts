import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']);

export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
}

const EXT_BY_TYPE: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};

/** POST /api/upload — simpan bukti pengeluaran ke disk VPS. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Upload harus multipart/form-data' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'File kosong' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Ukuran file maksimal 10 MB' }, { status: 413 });
  }

  // Tipe ditentukan dari isi file, bukan dari nama/header yang bisa dipalsukan.
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT_BY_TYPE[file.type] ?? sniffExtension(buffer);
  if (!ext || !ALLOWED.has(file.type || '') && !ext) {
    return NextResponse.json(
      { error: 'Format file harus gambar (png/jpg/webp/gif) atau PDF' },
      { status: 415 }
    );
  }

  const dir = path.join(uploadDir(), user.id);
  await fs.mkdir(dir, { recursive: true });

  const name = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  await fs.writeFile(path.join(dir, name), buffer, { mode: 0o640 });

  return NextResponse.json({
    url: `/api/files/${user.id}/${name}`,
    name: file.name,
    size: file.size,
    type: file.type,
  });
}

/** Deteksi ekstensi dari magic bytes, sebagai lapis kedua. */
function sniffExtension(buf: Buffer): string | null {
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'png';
  }
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length > 12 && buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') {
    return 'webp';
  }
  if (buf.length > 3 && buf.subarray(0, 3).toString() === 'GIF') return 'gif';
  if (buf.length > 4 && buf.subarray(0, 4).toString() === '%PDF') return 'pdf';
  return null;
}
