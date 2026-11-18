# GirlUpKilo

Aplikasi web untuk **Girl Up Universitas Indonesia** — menggabungkan situs publik
(profil organisasi) dengan sistem internal (reimbursement keuangan).

## Modul

| Modul         | Rute                               | Pengakses        | Keterangan |
| ------------- | ---------------------------------- | ---------------- | ---------- |
| Situs publik  | `/`, `/visi-misi`, `/departemen`   | Guest / publik   | Landing page, visi–misi, struktur departemen & pengurus |
| CMS           | `/dashboard/cms/*`                 | Admin, Manajer   | Kelola seluruh konten halaman publik dari browser |
| Autentikasi   | `/login`, `/register`              | Publik           | Masuk / daftar akun internal |
| Reimbursement | `/dashboard/*`                     | Pengguna login   | Pengajuan, persetujuan berjenjang, laporan |

## Teknologi

- **Next.js 16** (App Router, React Server Components) + **TypeScript**
- **Tailwind CSS** — token `gu-*` (magenta, publik) & `brand-*` (biru, internal)
- **PostgreSQL** via `pg` — dapat dijalankan di VPS mana pun, dan kompatibel
  dengan Postgres milik Supabase
- **lucide-react** untuk ikon

## Struktur

```
.
├── db/
│   └── schema.sql              # skema database (users, sessions, reimbursements)
├── scripts/
│   └── create-admin.mjs        # pembuatan akun admin via CLI
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx      # kerangka halaman publik
│   │   │   ├── visi-misi/page.tsx
│   │   │   └── departemen/page.tsx
│   │   ├── page.tsx            # landing page
│   ├── sitemap.ts robots.ts # SEO untuk halaman publik
│   │   ├── login/ register/    # autentikasi
│   │   ├── api/                # route handler
│   │   ├── dashboard/          # modul reimbursement (protected)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── public/             # PublicShell, SiteNavbar, SiteFooter
│   │   ├── auth/ dashboard/ approvals/ submissions/ settings/
│   ├── lib/
│   │   ├── site.ts             # ← sumber konten halaman publik
│   │   ├── auth.ts db.ts types.ts utils.ts validation.ts reimbursements.ts
│   └── middleware.ts           # proteksi /dashboard/*
├── tailwind.config.js
└── .env.local.example
```

## Halaman Publik (Guest)

Tiga halaman yang dapat dibuka **tanpa login**:

- **`/`** — hero, statistik, latar belakang Girl Up, 4 pilar, nilai inti,
  program unggulan, pratinjau departemen, dan tonggak waktu.
- **`/visi-misi`** — pernyataan visi, 5 misi, nilai inti, dan alur kerja.
- **`/departemen`** — struktur organisasi, jajaran pengurus, 7 departemen beserta
  fokus kerja, dan alur bergabung.

### Mengubah konten

Seluruh teks halaman publik terpusat di **`src/lib/site.ts`** — identitas,
statistik, nilai, pilar, program, departemen, pengurus, dan tonggak waktu.
Ubah file tersebut untuk memperbarui konten tanpa menyentuh komponen halaman.

```ts
// src/lib/site.ts
export const DEPARTMENTS: Department[] = [
  {
    slug: 'programs',
    name: 'Programs Department',
    shortName: 'Programs',
    tagline: 'Dari gagasan menjadi aksi di lapangan',
    description: '...',
    focus: ['...', '...', '...'],
    icon: Sprout,
    head: 'Nama Kepala Departemen',   // opsional
    deputy: 'Nama Wakil',             // opsional
    members: 13,                      // opsional
  },
];
```

### Catatan

- `middleware.ts` hanya melindungi `/dashboard/*`, sehingga halaman publik
  tetap terbuka untuk guest.
- `PublicShell` sengaja tidak mengimpor `lib/db`, agar halaman publik tetap
  dapat dirender meski `DATABASE_URL` belum dikonfigurasi.
- Nama pengurus pada `LEADERSHIP` dan `DEPARTMENTS` dikompilasi dari sumber
  publik dan **perlu dikonfirmasi** sebelum dipublikasikan.

## CMS (Kelola Konten)

Seluruh teks halaman publik dapat diubah dari browser melalui `/dashboard/cms`
tanpa menyentuh kode. Terbuka untuk peran **admin** dan **manajer**.

| Halaman | Mengatur |
| ------- | -------- |
| `/dashboard/cms/identitas` | Nama, tagline, deskripsi, tautan sosial, bagian "Tentang" |
| `/dashboard/cms/visi-misi` | Pernyataan visi, misi, nilai inti, pilar |
| `/dashboard/cms/beranda` | Angka statistik, alur bergabung |
| `/dashboard/cms/departemen` | Departemen, fokus kerja, ikon, kepala & wakil |
| `/dashboard/cms/pengurus` | Nama dan jabatan pengurus |
| `/dashboard/cms/program` | Program unggulan |
| `/dashboard/cms/tonggak` | Tonggak waktu |
| `/dashboard/cms/ikon` | Daftar ikon yang bisa dipilih |

### Penerapan skema

Skema CMS terpisah dari skema utama agar bisa dijalankan kapan saja:

```bash
# Jalankan sebagai PEMILIK skema (bukan role aplikasi)
psql -h <host> -U postgres -d girlupkilo -f db/cms.sql
```

File ini idempoten — aman dijalankan ulang. Seed hanya mengisi tabel yang masih
kosong, sehingga tidak menimpa hasil edit dari admin. Di akhir file terdapat
grant akses untuk role aplikasi `girlupkilo_app`.

### Cara kerja penyajian konten

```
Database (tabel CMS)  ──►  src/lib/content.ts  ──►  halaman publik
        │                        │
        └─ kosong/gagal ─────────┴──►  src/lib/site.ts (nilai default)
```

Halaman publik membaca database terlebih dahulu. Bila sebuah tabel belum ada,
belum diisi, atau query gagal, sistem memakai nilai default dari
`src/lib/site.ts`. Karena itu situs **tidak pernah kosong** meski CMS belum
disiapkan.

### Penyimpanan

| Tabel | Isi |
| ----- | --- |
| `site_settings` | Dokumen JSON per bagian (`identity`, `about`, `vision`, `missions`, `values`, `pillars`, `stats`, `join_steps`) |
| `cms_departments` | Departemen |
| `cms_leaders` | Pengurus |
| `cms_programs` | Program unggulan |
| `cms_milestones` | Tonggak waktu |

Setiap baris punya kolom `published`. Mencabut centang "Tayangkan" akan
menyimpan data sebagai draft tanpa menampilkannya ke publik.

### Endpoint

| Metode | Rute | Keterangan |
| ------ | ---- | ---------- |
| GET | `/api/cms/{entity}` | Daftar seluruh data (termasuk draft) |
| POST | `/api/cms/{entity}` | Tambah data |
| PATCH | `/api/cms/{entity}/{id}` | Ubah data |
| DELETE | `/api/cms/{entity}/{id}` | Hapus data |
| GET | `/api/cms/settings` | Semua dokumen konten |
| PUT | `/api/cms/settings` | Simpan satu dokumen |
| DELETE | `/api/cms/settings?key=` | Kembalikan satu bagian ke nilai default |

`entity` bernilai `departments`, `leaders`, `programs`, atau `milestones`.

## Setup

### 1. Environment

```bash
cp .env.local.example .env.local
```

| Variabel              | Wajib | Keterangan |
| --------------------- | ----- | ---------- |
| `DATABASE_URL`        | ✅    | Koneksi PostgreSQL |
| `NEXT_PUBLIC_APP_URL` | ✅    | URL publik; menentukan cookie `Secure` saat HTTPS |
| `UPLOAD_DIR`          | ➖    | Folder penyimpanan bukti pengeluaran |

### 2. Database

```bash
psql -d girlupkilo -f db/schema.sql
```

Skema membuat tabel `users`, `sessions`, dan `reimbursements`. Bila memakai
Postgres di Supabase, gunakan connection string project tersebut pada
`DATABASE_URL`.

### 3. Akun admin

```bash
npm run create-admin -- admin@perusahaan.com 'SandiRahasia123' "Nama Admin"
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Perintah lain:

```bash
npm run build      # build produksi
npm start          # jalankan hasil build
npm run typecheck  # pemeriksaan tipe
```

## Deployment

### Vercel

1. Push repositori ke GitHub/GitLab.
2. Import project di [vercel.com](https://vercel.com).
3. Isi environment variables (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, `UPLOAD_DIR`).
4. Deploy. Set `NEXT_PUBLIC_APP_URL` ke domain publik agar cookie `Secure` aktif.

### VPS (Node.js)

```bash
# 1. Clone & install
git clone <repo-url> && cd GirlUpKilo
npm install
npm run build

# 2. Jalankan dengan PM2
npm install -g pm2
pm2 start npm --name "girlupkilo" -- start
pm2 save && pm2 startup
```

Nginx sebagai reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;   # untuk unggah bukti pengeluaran
}
```

SSL dengan Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Peran Pengguna

| Peran    | Akses |
| -------- | ----- |
| Staf     | Membuat dan mengelola pengajuan sendiri |
| Manajer  | Menyetujui tahap 1 |
| Keuangan | Menyetujui tahap 2 dan menandai pembayaran |
| Admin    | Seluruh fitur |

## Lisensi

MIT