import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Quote, Target, Compass, ArrowUpRight } from 'lucide-react';

import { APPROACH } from '@/lib/site';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `Visi & Misi — ${site.name}`,
    description: `Visi, misi, nilai inti, dan pendekatan ${site.fullName} dalam menggerakkan kesetaraan gender.`,
  };
}

export default async function VisiMisiPage() {
  const { site, contact, vision, missions, values } = await getPublicContent();

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
            <span className="text-slate-700">Visi & Misi</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            Visi & Misi
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ke mana kami ingin pergi, dan bagaimana kami sampai di sana.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Sebagai chapter Girl Up di Universitas Indonesia, kami menterjemahkan
            visi global Girl Up menjadi aksi yang terukur di kampus dan
            komunitas sekitar.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------ Visi */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gu-50 text-gu-600">
                <Compass size={22} />
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                Visi
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Arah yang kami tuju bersama seluruh gerakan Girl Up.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-gu-100 bg-gu-50/60 p-6 sm:p-8">
                <Quote size={26} className="text-gu-300" />
                <p className="mt-4 text-xl font-medium leading-relaxed text-slate-800 sm:text-2xl">
                  {vision.statement}
                </p>
                <p className="mt-5 border-t border-gu-200/60 pt-4 text-sm text-gu-800/80">
                  {vision.quote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Misi */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gu-100 text-gu-700">
                <Target size={22} />
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Misi
              </h2>
              <p className="mt-3 leading-relaxed text-slate-600">
                Lima langkah konkret yang kami jalankan untuk mewujudkan visi
                tersebut.
              </p>
            </div>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-2">
            {missions.map((mission, i) => (
              <li key={mission.title} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gu-600 text-sm font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {mission.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {mission.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ Nilai */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Nilai inti
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
            Empat nilai yang menjadi kompas kami — warisan dari Girl Up global
            yang kami pegang di setiap keputusan.
          </p>

          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-6 sm:p-7">
                <h3 className="text-base font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gu-600">
                  {value.id}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Pendekatan */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Bagaimana kami bekerja
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
            Alur kerja yang kami pakai untuk memastikan setiap program berangkat
            dari kesadaran dan berakhir pada dampak yang terukur.
          </p>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-gu-700 ring-1 ring-gu-200">
                    {i + 1}
                  </span>
                  <div className="h-px flex-1 bg-gu-200" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ CTA */}
      <section className="bg-gu-700">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Bagian dari gerakan ini?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gu-100">
              Kenali struktur departemen kami dan temukan tempatmu untuk
              berkontribusi.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/departemen"
              className="btn bg-white px-5 py-2.5 text-sm text-gu-700 hover:bg-gu-50"
            >
              Lihat Departemen
              <ArrowRight size={16} />
            </Link>
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/40 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Instagram
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}