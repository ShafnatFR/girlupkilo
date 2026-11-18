import type { Metadata } from 'next';

import VisionMissionForm from '@/components/cms/VisionMissionForm';
import { iconKeyOf } from '@/lib/cms/icons';
import { getPublicContent } from '@/lib/content';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Visi & Misi' };

export default async function CmsVisionPage() {
  await requireCmsPage();
  const content = await getPublicContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">Visi &amp; Misi</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pernyataan visi, daftar misi, nilai inti, dan pilar yang tampil pada
          halaman Visi &amp; Misi serta beranda.
        </p>
      </div>

      <VisionMissionForm
        vision={content.vision}
        missions={content.missions}
        values={content.values}
        pillars={content.pillars.map((pillar) => ({
          title: pillar.title,
          description: pillar.description,
          icon: iconKeyOf(pillar.icon),
        }))}
      />
    </div>
  );
}