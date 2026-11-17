# Reimburse — Sistem Reimbursement Keuangan

Sistem web untuk pengajuan dan persetujuan reimbursement keuangan perusahaan.

## Fitur

- **Autentikasi** — Login/registrasi dengan email/password atau Google OAuth
- **Pengajuan Reimbursement** — Buat, edit, dan hapus pengajuan dengan upload bukti
- **Alur Persetujuan Berjenjang** — Manajer → Keuangan → Pembayaran
- **Dashboard** — Ringkasan statistik dan pengajuan terbaru
- **Laporan** — Analisis pengeluaran per kategori, status, dan bulan
- **Role-Based Access Control** — Staf, Manajer, Keuangan, Admin
- **Row Level Security** — Data terlindungi di level database

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel (serverless) atau VPS (Node.js)

## Struktur Project

```
reimburse/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── reimbursements/
│   │   │   └── approvals/
│   │   ├── auth/
│   │   │   └── callback/     # OAuth callback
│   │   ├── dashboard/        # Halaman dashboard (protected)
│   │   │   ├── approvals/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── submissions/
│   │   ├── login/
│   │   └── register/
│   ├── components/
│   │   ├── auth/             # Form login/register
│   │   ├── approvals/        # Form approval
│   │   ├── dashboard/        # Sidebar
│   │   ├── settings/         # Form settings
│   │   └── submissions/      # Form pengajuan
│   ├── lib/
│   │   ├── supabase/         # Supabase clients
│   │   │   ├── client.ts     # Browser client
│   │   │   ├── server.ts     # Server client
│   │   │   └── server-helpers.ts
│   │   ├── types.ts          # TypeScript types
│   │   └── utils.ts          # Utility functions
│   └── middleware.ts         # Auth middleware
├── supabase/
│   └── schema.sql            # Database schema
├── public/
├── package.json
└── README.md
```

## Setup Supabase

### 1. Buat Project Supabase

1. Daftar di [supabase.com](https://supabase.com)
2. Buat project baru
3. Tunggu hingga project selesai di-provision

### 2. Jalankan Schema

1. Buka **SQL Editor** di dashboard Supabase
2. Copy-paste isi file `supabase/schema.sql`
3. Klik **Run**

### 3. Dapatkan Kredensial

1. Buka **Settings > API**
2. Copy **Project URL** dan **anon/public key**
3. Copy **service_role key** (untuk server-side operations)

### 4. Setup Storage Bucket

1. Buka **Storage** di dashboard
2. Buat bucket baru bernama `receipts`
3. Set policy agar public read, authenticated write

## Setup Environment

Buat file `.env.local` (copy dari `.env.local.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Menjalankan Aplikasi

### Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build untuk production
npm run build

# Jalankan production server
npm start
```

## Deployment

### Vercel (Recommended)

1. Push code ke GitHub/GitLab
2. Import project di [vercel.com](https://vercel.com)
3. Set environment variables di dashboard Vercel
4. Deploy

### VPS (Node.js)

#### Prasyarat

- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

#### Langkah Deployment

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd reimburse
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **Setup PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "reimburse" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx** (`/etc/nginx/sites-available/reimburse`)
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
   }
   ```

5. **Enable site dan restart Nginx**
   ```bash
   sudo ln -s /etc/nginx/sites-available/reimburse /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL dengan Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

7. **Update environment variables**
   ```bash
   nano .env.local
   # Set NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

8. **Restart aplikasi**
   ```bash
   pm2 restart reimburse
   ```

## Penggunaan

### 1. Registrasi Akun

1. Buka `/register`
2. Isi nama lengkap, email, dan password
3. Verifikasi email (cek inbox)

### 2. Set Role (Admin)

Setelah user pertama terdaftar, set role menjadi admin:

```sql
-- Di Supabase SQL Editor
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@perusahaan.com';
```

### 3. Membuat Pengajuan

1. Login ke dashboard
2. Klik **Pengajuan Saya > Buat Baru**
3. Isi detail reimbursement
4. Upload bukti (opsional)
5. Klik **Ajukan Reimbursement**

### 4. Persetujuan

- **Manajer**: Review pengajuan status `submitted`
- **Keuangan**: Review pengajuan status `manager_approved`
- **Admin**: Akses semua tahap

## API Endpoints

### Reimbursements

- `GET /api/reimbursements` — Ambil semua reimbursement user
- `POST /api/reimbursements` — Buat reimbursement baru
- `GET /api/reimbursements/[id]` — Ambil detail
- `PATCH /api/reimbursements/[id]` — Update
- `DELETE /api/reimbursements/[id]` — Hapus

### Approvals

- `GET /api/approvals` — Ambil pengajuan yang perlu disetujui
- `PATCH /api/approvals/[id]` — Setujui/tolak

## Role & Permissions

| Role      | Permissions                                      |
|-----------|--------------------------------------------------|
| Staf      | Buat/edit/hapus pengajuan sendiri                |
| Manajer   | Setujui pengajuan tahap 1                        |
| Keuangan  | Setujui pengajuan tahap 2, tandai dibayar       |
| Admin     | Akses semua fitur                                |

## Troubleshooting

### Issue: "Invalid login credentials"

- Pastikan email sudah diverifikasi
- Cek apakah user ada di tabel `auth.users`

### Issue: "permission denied for table"

- Jalankan ulang `supabase/schema.sql`
- Cek RLS policies sudah aktif

### Issue: Upload file gagal

- Pastikan bucket `receipts` sudah dibuat
- Cek policy storage sudah benar

## Lisensi

MIT License

## Support

Untuk pertanyaan atau bug, silakan buat issue di repository.