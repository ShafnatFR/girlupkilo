import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

import { getArticles, formatDate } from '@/lib/media';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `Artikel — ${site.name}`,
    description: `Artikel, esai, dan kajian dari ${site.fullName}.`,
  };
}

export default async function ArticlesPage() {
  const articles = await getArticles();

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
            <span className="text-slate-700">Artikel</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            Artikel
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Esai, kajian, dan karya tulis seputar isu gender.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Tulisan dari anggota dan kolaborator Girl Up UI yang mengupas
            kesetaraan gender, hak perempuan, dan isu sosial terkini.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Daftar artikel */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {articles.length === 0 ? (
            <div className="card p-10 text-center text-sm text-slate-500">
              Belum ada artikel yang dipublikasikan.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/artikel/${article.slug}`}
                  className="card group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-gu-300 hover:shadow-md"
                >
                  {article.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-gu-50 to-gu-100 text-gu-300">
                      <FileText size={40} />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {article.category && (
                        <span className="badge bg-gu-50 text-gu-700">
                          {article.category}
                        </span>
                      )}
                      {article.date && <span>{formatDate(article.date)}</span>}
                    </div>

                    <h2 className="mt-3 font-semibold leading-snug text-slate-900 group-hover:text-gu-700">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                        {article.excerpt}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-gu-600">
                      Baca selengkapnya
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}