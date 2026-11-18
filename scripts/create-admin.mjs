#!/usr/bin/env node
/**
 * Membuat atau memperbarui akun admin.
 *
 * Pemakaian:
 *   npm run create-admin -- admin@perusahaan.com 'SandiRahasia123' "Nama Admin"
 *
 * Membaca DATABASE_URL dari environment, atau dari file .env.local di root proyek.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadEnvLocal() {
  const file = path.join(root, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key] === undefined) {
      process.env[key] = raw.replace(/^["']|["']$/g, '');
    }
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

loadEnvLocal();

const [email, password, fullName = 'Admin'] = process.argv.slice(2);

if (!email || !password) {
  console.error("Pemakaian: npm run create-admin -- <email> '<password>' ['<nama>']");
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password minimal 8 karakter');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL belum di-set (environment atau .env.local)');
  process.exit(1);
}

const { default: pg } = await import('pg');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const result = await client.query(
    `INSERT INTO public.users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           full_name = EXCLUDED.full_name,
           role = 'admin'
     RETURNING id, email, role`,
    [email.trim().toLowerCase(), hashPassword(password), fullName]
  );
  console.log('Admin siap dipakai:', result.rows[0]);
} catch (error) {
  console.error('Gagal membuat admin:', error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
