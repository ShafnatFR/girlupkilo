# Ringkasan Modul

> Detail teknis, setup, dan deployment ada di [README.md](./README.md).

## Modul yang tersedia

### 1. Situs Publik (Guest)

Halaman yang dapat diakses tanpa login:

| Rute          | Isi |
| ------------- | --- |
| `/`           | Landing page — hero, statistik, latar belakang Girl Up, 4 pilar, nilai inti, program unggulan, pratinjau departemen, tonggak waktu |
| `/visi-misi`  | Visi, 5 misi, nilai inti, alur kerja |
| `/departemen` | Jajaran pengurus, 7 departemen + fokus kerja, alur bergabung |

Seluruh konten halaman publik ada di **`src/lib/site.ts`** dan dapat diubah
tanpa menyentuh komponen halaman.

### 2. Autentikasi

`/login` dan `/register` — sesi disimpan sebagai cookie `rg_session`
(httpOnly, `Secure` saat HTTPS), token disimpan sebagai hash SHA-256 di tabel
`sessions`, dan password di-hash dengan scrypt.

### 3. Reimbursement (Internal)

`/dashboard/*` — pengajuan reimbursement dengan alur persetujuan berjenjang:

```
draft → submitted → manager_approved → finance_approved → paid
                                              ↘ rejected
```

Dilengkapi dashboard ringkasan, halaman persetujuan, laporan, unggah bukti
pengeluaran, dan pengaturan profil.

## Peran Pengguna

| Peran    | Akses |
| -------- | ----- |
| Staf     | Membuat dan mengelola pengajuan sendiri |
| Manajer  | Menyetujui tahap 1 |
| Keuangan | Menyetujui tahap 2 dan menandai pembayaran |
| Admin    | Seluruh fitur |

## Catatan

- Halaman publik tidak bergantung pada database, sehingga tetap dapat dirender
  meski `DATABASE_URL` belum dikonfigurasi.
- Nama pengurus pada `LEADERSHIP` dan `DEPARTMENTS` di `src/lib/site.ts`
  dikompilasi dari sumber publik dan perlu dikonfirmasi sebelum dipublikasikan.
- Palet warna publik memakai token `gu-*` (magenta); modul internal memakai
  `brand-*` (biru).