import type { ReimburseStatus } from './types';

/** Format angka ke mata uang Rupiah. */
export function formatCurrency(amount: number, currency = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format tanggal YYYY-MM-DD ke format Indonesia. */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/** Warna badge berdasarkan status yang adaptif terhadap light dan dark mode. */
export const STATUS_STYLES: Record<ReimburseStatus, string> = {
  draft:
    'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300',
  submitted:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border dark:border-blue-800/40',
  manager_approved:
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border dark:border-indigo-800/40',
  finance_approved:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 dark:border dark:border-purple-800/40',
  rejected:
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 dark:border dark:border-rose-800/40',
  paid:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40',
};

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
