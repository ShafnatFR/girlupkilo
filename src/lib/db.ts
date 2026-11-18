import { Pool } from 'pg';

/**
 * Koneksi PostgreSQL tunggal (pool) untuk aplikasi.
 * DATABASE_URL contoh: postgres://girlupkilo_app:secret@127.0.0.1:5432/girlupkilo
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL belum di-set di environment aplikasi');
}

declare global {
  // eslint-disable-next-line no-var
  var __reimbursePool: Pool | undefined;
}

export const pool =
  globalThis.__reimbursePool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

// Saat dev dengan hot reload, pool lama dipakai ulang agar koneksi tidak menumpuk.
if (process.env.NODE_ENV !== 'production') {
  globalThis.__reimbursePool = pool;
}

/** Jalankan query yang mengembalikan banyak baris. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

/** Jalankan query yang mengembalikan satu baris (atau null). */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
