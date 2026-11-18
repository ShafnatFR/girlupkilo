import type { Metadata } from 'next';
import Link from 'next/link';
import { Images, ImageOff, ArrowRight } from 'lucide-react';

import { getGallery } from '@/lib/media';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `Dokumentasi — ${site.name}`,
    description: `Galeri dokumentasi kegiatan ${site.fullName}.`,
  };
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  // Kelompokkan berdasarkan kategori bila ada.
  const categories = Array.from(
    new Set(gallery.map((item) => item.category).filter(Boolean))
  );

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
            <span className="text-slate-700">Dokumentasi</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            Dokumentasi
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Momen dan kegiatan yang kami abadikan.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Galeri dokumentasi dari setiap diskusi, kampanye, dan aksi yang kami
            jalankan bersama komunitas.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Filter kategori */}
      {categories.length > 0 && (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4 sm:px-6 lg:px-8">
            {categories.map((category) => (
              <a
                key={category}
                href={`#kategori-${slugify(category)}`}
                className="badge bg-gu-50 text-gu-700 hover:bg-gu-100"
              >
                {category}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ Galeri */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {gallery.length === 0 ? (
            <div className="card p-10 text-center text-sm text-slate-500">
              Belum ada dokumentasi yang dipublikasikan.
            </div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
              {gallery.map((item, i) => (
                <figure
                  key={`${item.title}-${i}`}
                  id={
                    item.category ? `kategori-${slugify(item.category)}` : undefined
                  }
                  className="break-inside-avoid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-gu-50 to-gu-100 text-gu-300">
                      <ImageOff size={40} />
                    </div>
                  )}
                  <figcaption className="p-4">
                    {item.category && (
                      <span className="badge mb-2 bg-gu-50 text-gu-700">
                        {item.category}
                      </span>
                    )}
                    <h2 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    {item.caption && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {item.caption}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ CTA */}
      <section className="bg-gu-700">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Lihat lebih banyak momen
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gu-100">
              Ikuti kanal media sosial kami untuk dokumentasi lengkap setiap
              kegiatan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/acara"
              className="btn bg-white px-5 py-2.5 text-sm text-gu-700 hover:bg-gu-50"
            >
              Lihat Acara
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/artikel"
              className="btn border border-white/40 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Baca Artikel
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/** Ubah teks menjadi slug untuk id anchor. */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}