import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Download } from 'lucide-react';

import { getEmagazines, formatDate } from '@/lib/media';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `E-Magazine — ${site.name}`,
    description: `Terbitan digital e-magazine ${site.fullName}.`,
  };
}

export default async function EmagazinePage() {
  const emagazines = await getEmagazines();

  return (
    <>
      {/* ------------------------------------------------------ Page header */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-gu-50/70 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-gu-700">
              Beranda
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-700">E-Magazine</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            E-Magazine
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terbitan digital karya anggota.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            E-magazine Girl Up UI memuat esai, kajian, dan karya tulis anggota
            tentang isu gender dan hak perempuan.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Daftar terbitan */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {emagazines.length === 0 ? (
            <div className="card p-10 text-center text-sm text-slate-500">
              Belum ada terbitan e-magazine.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {emagazines.map((item) => (
                <article
                  key={item.slug}
                  className="card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-gu-50 to-gu-100 text-gu-300">
                      <BookOpen size={52} />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {item.issue && (
                        <span className="badge bg-gu-50 text-gu-700">
                          {item.issue}
                        </span>
                      )}
                      {item.date && <span>{formatDate(item.date)}</span>}
                    </div>

                    <h2 className="mt-3 font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </p>
                    )}

                    {item.fileUrl ? (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary mt-5 w-full"
                      >
                        <Download size={16} />
                        Unduh / Baca
                      </a>
                    ) : (
                      <span className="mt-5 text-xs text-slate-400">
                        Tautan terbitan belum tersedia.
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}