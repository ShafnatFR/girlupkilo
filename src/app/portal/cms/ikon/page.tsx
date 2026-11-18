import type { Metadata } from 'next';

import { ICON_CHOICES, resolveIcon } from '@/lib/cms/icons';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Panduan Ikon' };

export default async function CmsIconsPage() {
  await requireCmsPage();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
          Panduan Ikon
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Nilai yang dipilih pada kolom &ldquo;Ikon&rdquo; di form departemen dan
          program harus salah satu dari daftar berikut.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ICON_CHOICES.map((choice) => {
          const Icon = resolveIcon(choice.value);
          return (
            <div
              key={choice.value}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-700/60 dark:bg-[#1a202c]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 dark:border dark:border-brand-800/30">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {choice.label}
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">{choice.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
