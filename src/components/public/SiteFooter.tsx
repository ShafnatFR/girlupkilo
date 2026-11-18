import Link from 'next/link';
import { ArrowUpRight, BookOpen, Instagram, Linkedin, Mail } from 'lucide-react';

import type { SiteContact, SiteIdentity } from '@/lib/content';

const LINK_GROUPS = [
  {
    title: 'Jelajahi',
    links: [
      { label: 'Beranda', href: '/' },
      { label: 'Visi & Misi', href: '/visi-misi' },
      { label: 'Departemen', href: '/departemen' },
      { label: 'Acara', href: '/acara' },
      { label: 'Artikel', href: '/artikel' },
      { label: 'Dokumentasi', href: '/dokumentasi' },
      { label: 'E-Magazine', href: '/e-magazine' },
    ],
  },
  {
    title: 'Sistem',
    links: [
      { label: 'Masuk', href: '/login' },
      { label: 'Daftar', href: '/register' },
      { label: 'Reimbursement', href: '/portal' },
    ],
  },
];

export default function SiteFooter({
  site,
  contact,
}: {
  site: SiteIdentity;
  contact: SiteContact;
}) {
  const socials = [
    {
      label: 'Instagram',
      href: contact.instagram,
      icon: Instagram,
    },
    {
      label: 'LinkedIn',
      href: contact.linkedin,
      icon: Linkedin,
    },
    {
      label: 'Medium',
      href: contact.medium,
      icon: BookOpen,
    },
    ...(contact.email
      ? [{ label: 'Email', href: `mailto:${contact.email}`, icon: Mail }]
      : []),
  ];

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gu-500 to-gu-700 text-sm font-bold text-white">
                {site.shortName.slice(0, 2).toUpperCase() || 'GU'}
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-sm font-bold text-slate-900">{site.name}</span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-gu-600">
                  {site.home}
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              {site.description}
            </p>

            <div className="mt-5 flex items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-gu-300 hover:bg-gu-50 hover:text-gu-700"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="md:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-gu-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Afiliasi */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Afiliasi
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-center justify-between gap-2">
                <span>{site.parent}</span>
                <a
                  href="https://girlup.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gu-600 hover:text-gu-700"
                  aria-label="Kunjungi girlup.org"
                >
                  <ArrowUpRight size={15} />
                </a>
              </li>
              <li>{site.region}</li>
              <li>{site.home}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {site.fullName}. Dibangun untuk gerakan
            kesetaraan gender.
          </p>
          <p className="text-xs text-slate-500">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}