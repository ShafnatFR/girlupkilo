# Reimburse — Sistem Reimbursement Keuangan

Sistem web untuk pengajuan dan persetujuan reimbursement keuangan perusahaan.
Berjalan mandiri di satu VPS: Next.js + PostgreSQL, tanpa layanan pihak ketiga.

## Fitur

- **Autentikasi sendiri** — login/registrasi email + password (scrypt + cookie sesi httpOnly)
- **Pengajuan Reimbursement** — buat pengajuan dengan upload bukti
- **Alur Persetujuan Berjenjang** — Manajer → Keuangan → Pembayaran
- **Dashboard** — ringkasan statistik dan pengajuan terbaru
- **Laporan** — analisis pengeluaran per kategori, status, dan bulan
- **Role-Based Access Control** — Staf, Manajer, Keuangan, Admin (dicek di server)
- **Penyimpanan bukti di disk VPS** — di luar direktori repo, disajikan lewat route berproteksi

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router, Route Handlers), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 16 (driver `pg`, SQL parametris)
- **Sesi**: token acak di cookie httpOnly, hash SHA-256 disimpan di tabel `sessions`
- **Deployment**: VPS (PM2 + Caddy)

## Struktur Project

```
├── db/schema.sql            # skema database (users, sessions, reimbursements)
├── scripts/create-admin.mjs # buat/ubah akun admin
├── src/
│   ├── app/
│   │   ├── api/             # auth, profile, upload, files, reimbursements, approvals
│   │   ├── dashboard/       # halaman yang dilindungi
│   │   ├── login/ register/
│   ├── components/          # form dan sidebar
│   ├── lib/
│   │   ├── auth.ts          # hash password, sesi, getCurrentUser
│   │   ├── db.ts            # pool pg + helper query
│   │   ├── reimbursements.ts# query domain
│   │   ├── validation.ts    # validasi input & aturan role
│   │   ├── types.ts utils.ts
│   └── middleware.ts        # guard rute /dashboard
```

## Setup Database

```bash
sudo -u postgres psql -c "CREATE DATABASE girlupkilo;"
sudo -u postgres psql -d girlupkilo -f db/schema.sql
```

Buat role aplikasi (least privilege) lalu isi `DATABASE_URL`:

```sql
CREATE ROLE girlupkilo_app LOGIN PASSWORD 'ganti-password-ini';
GRANT CONNECT ON DATABASE girlupkilo TO girlupkilo_app;
GRANT USAGE ON SCHEMA public TO girlupkilo_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO girlupkilo_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO girlupkilo_app;
```

## Environment

Copy `.env.local.example` menjadi `.env.local`:

```bash
DATABASE_URL=postgres://girlupkilo_app:password@127.0.0.1:5432/girlupkilo
NEXT_PUBLIC_APP_URL=https://domain-anda.com
UPLOAD_DIR=/var/lib/girlupkilo/uploads
```

## Menjalankan

```bash
npm ci
npm run build
npm start            # atau: pm2 start npm --name girlupkilo -- start
```

Buat akun admin pertama:

```bash
npm run create-admin -- admin@perusahaan.com 'SandiRahasia123' "Nama Admin"
```

## Deployment VPS (ringkas)

1. `npm ci && npm run build`
2. `pm2 start npm --name girlupkilo -- start && pm2 save && pm2 startup`
3. Reverse proxy Caddy/Nginx ke `127.0.0.1:3000`
4. Folder `UPLOAD_DIR` dan database di-backup berkala

## API Endpoints

| Method | Path | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | Daftar akun (langsung login) |
| POST | `/api/auth/login` | Masuk |
| POST | `/api/auth/logout` | Keluar |
| POST | `/api/auth/password` | Ganti password |
| PATCH | `/api/profile` | Ubah nama/departemen |
| POST | `/api/upload` | Unggah bukti (maks 10 MB, gambar/PDF) |
| GET | `/api/files/<userId>/<file>` | Ambil bukti (wajib login) |
| GET/POST | `/api/reimbursements` | Daftar / buat pengajuan |
| GET/PATCH/DELETE | `/api/reimbursements/[id]` | Detail / ubah draft / hapus draft |
| GET | `/api/approvals` | Daftar pengajuan untuk approver |
| PATCH | `/api/approvals/[id]` | Setujui / tolak |

## Role & Permissions

| Role | Permissions |
|---|---|
| Staf | Buat dan lihat pengajuannya sendiri |
| Manajer | Setujui tahap 1, lihat semua pengajuan |
| Keuangan | Setujui tahap 2, tandai dibayar |
| Admin | Akses semua tahap dan semua data |

## Lisensi

MIT License
