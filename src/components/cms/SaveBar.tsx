'use client';

import { CheckCircle2, Loader2, RotateCcw, Save } from 'lucide-react';

interface SaveBarProps {
  saving: boolean;
  error: string;
  saved: boolean;
  onSave: () => void;
  onReset?: () => void;
}

/** Bar aksi simpan yang dipakai semua form pengaturan CMS. */
export default function SaveBar({
  saving,
  error,
  saved,
  onSave,
  onReset,
}: SaveBarProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-h-[1.25rem] text-sm">
        {error && <span className="text-red-600">{error}</span>}
        {!error && saved && (
          <span className="inline-flex items-center gap-1.5 text-green-700">
            <CheckCircle2 size={15} />
            Perubahan disimpan
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={saving}
            className="btn-secondary"
          >
            <RotateCcw size={15} />
            Kembalikan default
          </button>
        )}
        <button type="button" onClick={onSave} disabled={saving} className="btn-primary">
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? 'Menyimpan...' : 'Simpan perubahan'}
        </button>
      </div>
    </div>
  );
}