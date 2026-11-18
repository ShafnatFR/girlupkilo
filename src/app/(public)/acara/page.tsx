import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import { getEvents, formatDate } from '@/lib/media';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `Acara — ${site.name}`,
    description: `Daftar acara, diskusi, dan kampanye ${site.fullName}.`,
  };
}

export default async function EventsPage() {
  const { contact } = await getPublicContent();
  const events = await getEvents();

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
            <span className="text-slate-700">Acara</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            Acara
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Diskusi, kampanye, dan kegiatan yang kami selenggarakan.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Setiap acara adalah ruang untuk belajar, berdiskusi, dan mengambil
            aksi bersama demi kesetaraan gender.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Daftar acara */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          {events.length === 0 ? (
            <div className="card p-10 text-center text-sm text-slate-500">
              Belum ada acara yang dipublikasikan.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {events.map((event) => (
                <article
                  key={event.slug}
                  className="card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {event.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-gu-50 to-gu-100 text-gu-300">
                      <CalendarDays size={48} />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {event.category && (
                        <span className="badge bg-gu-50 text-gu-700">
                          {event.category}
                        </span>
                      )}
                      {event.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-slate-400" />
                          {formatDate(event.date)}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 font-semibold text-slate-900">
                      {event.title}
                    </h2>
                    {event.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                        {event.description}
                      </p>
                    )}

                    {event.location && (
                      <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={14} className="text-slate-400" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </article>
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
              Ikuti kabar acara terbaru
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gu-100">
              Pantau Instagram kami untuk informasi pendaftaran dan agenda
              mendatang.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white px-5 py-2.5 text-sm text-gu-700 hover:bg-gu-50"
            >
              Instagram
            </a>
            <Link
              href="/dokumentasi"
              className="btn border border-white/40 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Dokumentasi
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}