import type { Metadata } from 'next';

import HomeContentForm from '@/components/cms/HomeContentForm';
import { getPublicContent } from '@/lib/content';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Konten Beranda' };

export default async function CmsHomeContentPage() {
  await requireCmsPage();
  const content = await getPublicContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Konten Beranda
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Angka statistik pada beranda dan langkah-langkah alur bergabung.
        </p>
      </div>

      <HomeContentForm stats={content.stats} joinSteps={content.joinSteps} />
    </div>
  );
}