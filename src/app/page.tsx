import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react';

import PublicShell from '@/components/public/PublicShell';
import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  };
}

export default async function HomePage() {
  const {
    site,
    contact,
    stats,
    about,
    values,
    pillars,
    programs,
    departments,
    milestones,
  } = await getPublicContent();

  return (
    <PublicShell>
      {/* ---------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gu-200/50 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-gu-100/60 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gu-200 bg-gu-50 px-3 py-1 text-xs font-medium text-gu-700">
              <Sparkles size={14} />
              Chapter Girl Up Universitas Indonesia
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              When Girls Rise,
              <br />
              <span className="bg-gradient-to-r from-gu-600 to-gu-400 bg-clip-text text-transparent">
                We All Rise.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {site.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/visi-misi" className="btn-primary px-5 py-2.5 text-sm">
                Kenali Kami
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/departemen"
                className="btn-secondary px-5 py-2.5 text-sm"
              >
                Lihat Departemen
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <p className="mt-8 flex items-center gap-2 text-sm text-slate-500">
              <Users size={16} className="text-gu-500" />
              Bagian dari jaringan global Girl Up di 155 negara.
            </p>
          </div>

          {/* Highlight card */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-gu-900/5 sm:p-8">
              <Quote size={28} className="text-gu-300" />
              <p className="mt-4 text-lg font-medium leading-relaxed text-slate-800">
                “Girl Up envision a more equitable and just world for girls and
                women — which benefits all people.”
              </p>
              <p className="mt-4 text-sm text-slate-500">
                Girl Up — Sejak 2010, kini di bawah Global Fund for Children.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-xl font-bold text-slate-900">155</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
                    Negara
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">345rb+</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
                    Pemimpin muda
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">2030</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
                    Target 1 juta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="px-2 py-4 text-center">
              <p className="text-3xl font-bold text-gu-600">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {stat.label}
              </p>
              <p className="mx-auto mt-1.5 max-w-[16rem] text-xs leading-relaxed text-slate-500">
                {stat.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- Tentang */}
      <section
        id="tentang"
        className="scroll-mt-20 border-b border-slate-200 bg-slate-50/60"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {about.title}
              </h2>
              <Link
                href="/visi-misi"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gu-700 hover:text-gu-800"
              >
                Baca visi & misi lengkap
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="space-y-5 lg:col-span-8">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Pilar */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Empat Pilar"
            title="Cara kami bekerja"
            description="Empat pilar yang menopang setiap program dan aksi Girl Up di seluruh dunia."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gu-200 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gu-50 text-gu-600 transition-colors group-hover:bg-gu-100">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Nilai */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Nilai Inti"
            title="Yang kami pegang"
            description="Empat nilai yang menjadi kompas dalam setiap keputusan dan program kami."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map((value, i) => (
              <div key={value.title} className="card p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gu-100 text-sm font-bold text-gu-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {value.title}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wide text-gu-600">
                      {value.id}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Program */}
      <section id="program" className="scroll-mt-20 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Program Unggulan"
            title="Aksi yang kami jalankan"
            description="Dari diskusi publik hingga aksi sosial — inilah wujud nyata advokasi kami di lapangan."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => {
              const Icon = program.icon;
              return (
                <article
                  key={program.title}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon size={19} />
                    </span>
                    <span className="badge bg-gu-50 text-gu-700">
                      {program.category}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {program.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {program.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Departemen */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Struktur Organisasi"
              title="Tujuh departemen, satu gerakan"
              description="Setiap departemen memegang peran yang saling melengkapi dalam menjalankan program dan tata kelola."
            />
            <Link
              href="/departemen"
              className="btn-secondary shrink-0 px-4 py-2 text-sm"
            >
              Lihat detail
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link
                  key={dept.slug}
                  href="/departemen"
                  className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-gu-200 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gu-50 text-gu-600 transition-colors group-hover:bg-gu-100">
                    <Icon size={19} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {dept.shortName}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {dept.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Tonggak */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            eyebrow="Perjalanan"
            title="Tonggak yang membentuk kami"
            description="Dari sebuah ide di United Nations Foundation hingga gerakan yang dipimpin anak muda hari ini."
          />

          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {milestones.map((m) => (
              <li key={m.year} className="relative rounded-xl border border-slate-200 bg-white p-6">
                <span className="absolute -top-3 left-6 rounded-full bg-gu-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {m.year}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-slate-900">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {m.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden bg-gu-700">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gu-500/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Mau ikut menggerakkan kesetaraan gender?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gu-100 sm:text-base">
            Girl Up UI terbuka untuk siapa pun yang ingin belajar, berkontribusi,
            dan bertumbuh bersama. Ikuti kanal resmi kami untuk informasi
            rekrutasi berikutnya.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-white px-5 py-2.5 text-sm text-gu-700 hover:bg-gu-50"
            >
              Ikuti Instagram
              <ArrowUpRight size={16} />
            </a>
            <Link
              href="/register"
              className="btn border border-white/40 px-5 py-2.5 text-sm text-white hover:bg-white/10"
            >
              Buat Akun
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-gu-200">
            <CheckCircle2 size={14} />
            Terbuka untuk seluruh civitas academica Universitas Indonesia.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-gu-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}