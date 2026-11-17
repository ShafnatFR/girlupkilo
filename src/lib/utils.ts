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

/** Warna badge berdasarkan status. */
export const STATUS_STYLES: Record<ReimburseStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  manager_approved: 'bg-indigo-100 text-indigo-700',
  finance_approved: 'bg-purple-100 text-purple-700',
  rejected: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
};

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}