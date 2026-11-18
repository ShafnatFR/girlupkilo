import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

/**
 * 404 khusus area dashboard — dipakai saat notFound() dipanggil di dalam
 * /dashboard/*, agar tetap tampil di dalam kerangka dashboard (sidebar),
 * bukan kerangka halaman publik.
 */
export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        <FileQuestion size={24} />
      </span>

      <h1 className="mt-5 text-xl font-bold text-slate-900">
        Data tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
        Pengajuan yang kamu cari mungkin sudah dihapus atau bukan milikmu.
        Kembali ke daftar untuk melanjutkan.
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href="/dashboard/submissions" className="btn-primary">
          <ArrowLeft size={16} />
          Daftar Pengajuan
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          Ringkasan
        </Link>
      </div>
    </div>
  );
}