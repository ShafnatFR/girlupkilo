import type { Metadata } from 'next';

import IdentityForm from '@/components/cms/IdentityForm';
import { getPublicContent } from '@/lib/content';
import { requireCmsPage } from '@/lib/cms/page-guard';

export const metadata: Metadata = { title: 'CMS — Identitas' };

export default async function CmsIdentityPage() {
  await requireCmsPage();
  const content = await getPublicContent();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          CMS
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Identitas &amp; Kontak
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Nama, tagline, deskripsi, tautan sosial, dan narasi bagian
          &ldquo;Tentang&rdquo;.
        </p>
      </div>

      <IdentityForm
        identity={content.site}
        contact={content.contact}
        about={content.about}
      />
    </div>
  );
}