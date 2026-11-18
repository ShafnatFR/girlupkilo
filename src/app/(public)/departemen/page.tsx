import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Users,
  UserRound,
  Sparkles,
} from 'lucide-react';

import { getPublicContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getPublicContent();
  return {
    title: `Departemen & Pengurus — ${site.name}`,
    description: `Struktur organisasi, susunan departemen, dan jajaran pengurus ${site.fullName}.`,
  };
}

export default async function DepartemenPage() {
  const { site, contact, departments, leadership, joinSteps } =
    await getPublicContent();

  const core = leadership.filter((m) => m.group === 'Inti');
  const deptLeaders = leadership.filter((m) => m.group === 'Departemen');
  const president = leadership.find((m) => m.role === 'President');
  const vicePresidents = leadership.filter((m) =>
    m.role.toLowerCase().includes('vice president')
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
            <span className="text-slate-700">Departemen</span>
          </nav>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gu-600">
            Struktur Organisasi
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tujuh departemen yang menopang satu gerakan.
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">
            Setiap departemen memegang peran yang saling melengkapi — dari
            perancangan program, kajian dan advokasi, hingga keuangan dan tata
            kelola internal.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {departments.map((dept) => (
              <a
                key={dept.slug}
                href={`#${dept.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-gu-300 hover:text-gu-700"
              >
                {dept.shortName}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Struktur */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Struktur Organisasi
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Alur koordinasi organisasi — dari jajaran pengurus inti hingga
            tujuh departemen yang menjalankan program.
          </p>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            {/* President */}
            {president && (
              <div className="flex justify-center">
                <div className="rounded-xl bg-gradient-to-br from-gu-600 to-gu-700 px-8 py-4 text-center text-white shadow-sm">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gu-200">
                    President
                  </p>
                  <p className="mt-1 font-semibold">{president.name}</p>
                </div>
              </div>
            )}

            {/* Connector */}
            <div className="mx-auto h-8 w-px bg-slate-200" />

            {/* Vice Presidents */}
            {vicePresidents.length > 0 && (
              <>
                <div className="flex flex-wrap justify-center gap-3">
                  {vicePresidents.map((vp) => (
                    <div
                      key={vp.name}
                      className="rounded-lg border border-gu-200 bg-gu-50 px-4 py-2.5 text-center"
                    >
                      <p className="text-[10px] font-medium uppercase tracking-wider text-gu-600">
                        {vp.role}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-900">
                        {vp.name}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mx-auto h-8 w-px bg-slate-200" />
              </>
            )}

            {/* Departments */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <div
                    key={dept.slug}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-gu-600 ring-1 ring-slate-200">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">
                        {dept.shortName}
                      </p>
                      {(dept.head || dept.deputy) && (
                        <p className="truncate text-[11px] text-slate-500">
                          {dept.head ?? dept.deputy}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Pengurus inti */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gu-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Jajaran Pengurus
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Pengurus periode berjalan yang memegang koordinasi utama organisasi.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {core.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-4 rounded-xl border border-gu-100 bg-gu-50/50 p-5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gu-500 to-gu-700 text-sm font-bold text-white">
                  {member.name
                    .split(' ')
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">
                    {member.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gu-700">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          {deptLeaders.length > 0 && (
            <>
              <h3 className="mt-10 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Kepala & Wakil Departemen
              </h3>
              <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
                {deptLeaders.map((member) => (
                  <div key={member.name} className="bg-white p-4">
                    <p className="text-sm font-medium text-slate-900">
                      {member.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------ Departemen */}
      <section className="border-b border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Susunan Departemen
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Kenali bidang kerja masing-masing departemen.
          </p>

          <div className="mt-10 space-y-5">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <article
                  key={dept.slug}
                  id={dept.slug}
                  className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
                >
                  <div className="grid gap-6 lg:grid-cols-12">
                    {/* Identity */}
                    <div className="lg:col-span-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gu-50 text-gu-600">
                          <Icon size={21} />
                        </span>
                        <div>
                          <h3 className="font-semibold leading-tight text-slate-900">
                            {dept.shortName}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {dept.name}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm font-medium text-gu-700">
                        {dept.tagline}
                      </p>

                      <div className="mt-4 space-y-2 text-sm">
                        {dept.head && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <UserRound size={14} className="text-slate-400" />
                            <span className="text-slate-500">Kepala:</span>
                            <span className="font-medium">{dept.head}</span>
                          </div>
                        )}
                        {dept.deputy && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <UserRound size={14} className="text-slate-400" />
                            <span className="text-slate-500">Wakil:</span>
                            <span className="font-medium">{dept.deputy}</span>
                          </div>
                        )}
                        {typeof dept.members === 'number' && (
                          <div className="flex items-center gap-2 text-slate-700">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-slate-500">Anggota:</span>
                            <span className="font-medium">
                              {dept.members} orang
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-8">
                      <p className="text-sm leading-relaxed text-slate-600">
                        {dept.description}
                      </p>

                      <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Fokus Kerja
                      </h4>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {dept.focus.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <CheckCircle2
                              size={15}
                              className="mt-0.5 shrink-0 text-gu-500"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Alur gabung */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Alur Bergabung
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Empat langkah sederhana untuk menjadi bagian dari gerakan ini.
          </p>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {joinSteps.map((step, i) => (
              <li key={step.title} className="card p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gu-100 text-xs font-bold text-gu-700">
                  {i + 1}
                </span>
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
              Siap berkontribusi?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gu-100">
              Pantau kanal resmi Girl Up UI untuk informasi rekrutasi departemen
              dan program terbaru.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
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
        </div>
      </section>
    </>
  );
}