import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react';

import { getArticleBySlug, getArticles, formatDate } from '@/lib/media';
import { getPublicContent } from '@/lib/content';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const { site } = await getPublicContent();

  if (!article) {
    return { title: `Artikel tidak ditemukan — ${site.name}` };
  }

  return {
    title: `${article.title} — ${site.name}`,
    description: article.excerpt || article.title,
  };
}

export default async function ArticleDetailPage({ params }: Params) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
  ]);

  if (!article) notFound();

  const others = allArticles.filter((item) => item.slug !== slug).slice(0, 3);
  const paragraphs = article.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {/* ------------------------------------------------------ Page header */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-gu-50/70 to-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-gu-700">
              Beranda
            </Link>
            <span aria-hidden>/</span>
            <Link href="/artikel" className="hover:text-gu-700">
              Artikel
            </Link>
            <span aria-hidden>/</span>
            <span className="line-clamp-1 text-slate-700">{article.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {article.category && (
              <span className="badge bg-gu-50 text-gu-700">
                {article.category}
              </span>
            )}
            {article.date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-slate-400" />
                {formatDate(article.date)}
              </span>
            )}
            {article.author && (
              <span className="inline-flex items-center gap-1.5">
                <UserRound size={14} className="text-slate-400" />
                {article.author}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ Cover */}
      {article.image && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              className="w-full rounded-xl object-cover"
            />
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ Isi */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {paragraphs.length === 0 ? (
            <p className="text-sm italic text-slate-500">
              Isi artikel belum tersedia.
            </p>
          ) : (
            <div className="space-y-5 leading-relaxed text-slate-700">
              {paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-slate-200 pt-6">
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 text-sm font-medium text-gu-600 hover:text-gu-700"
            >
              <ArrowLeft size={15} />
              Kembali ke semua artikel
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Artikel lain */}
      {others.length > 0 && (
        <section className="border-b border-slate-200 bg-slate-50/60">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Bacaan lainnya
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/artikel/${item.slug}`}
                  className="card p-5 transition-all hover:-translate-y-0.5 hover:border-gu-300 hover:shadow-md"
                >
                  {item.category && (
                    <span className="badge bg-gu-50 text-gu-700">
                      {item.category}
                    </span>
                  )}
                  <h3 className="mt-3 font-semibold leading-snug text-slate-900">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}