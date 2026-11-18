'use client';

import { useState } from 'react';

import SaveBar from '@/components/cms/SaveBar';
import { useSettingsForm } from '@/components/cms/useSettingsForm';
import type { SiteContact, SiteIdentity } from '@/lib/content';

interface IdentityFormProps {
  identity: SiteIdentity;
  contact: SiteContact;
  about: { title: string; paragraphs: string[] };
}

function linesToArray(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

export default function IdentityForm({ identity, contact, about }: IdentityFormProps) {
  const { saving, error, saved, run, reset, clearMessages } = useSettingsForm();

  const [form, setForm] = useState({
    name: identity.name,
    fullName: identity.fullName,
    shortName: identity.shortName,
    tagline: identity.tagline,
    established: String(identity.established),
    description: identity.description,
    parent: identity.parent,
    region: identity.region,
    home: identity.home,
    instagram: contact.instagram,
    instagramLabel: contact.instagramLabel,
    linkedin: contact.linkedin,
    medium: contact.medium,
    email: contact.email,
    aboutTitle: about.title,
    aboutParagraphs: about.paragraphs.join('\n'),
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    clearMessages();
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    await run([
      {
        key: 'identity',
        value: {
          name: form.name,
          fullName: form.fullName,
          shortName: form.shortName,
          tagline: form.tagline,
          established: Number(form.established) || identity.established,
          description: form.description,
          parent: form.parent,
          region: form.region,
          home: form.home,
          contact: {
            instagram: form.instagram,
            instagramLabel: form.instagramLabel,
            linkedin: form.linkedin,
            medium: form.medium,
            email: form.email,
          },
        },
      },
      {
        key: 'about',
        value: {
          title: form.aboutTitle,
          paragraphs: linesToArray(form.aboutParagraphs),
        },
      },
    ]);
  }

  return (
    <div className="space-y-5">
      {/* Identitas */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Identitas organisasi</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Dipakai pada navbar, footer, dan metadata halaman.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">
              Nama situs *
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="fullName">
              Nama lengkap *
            </label>
            <input
              id="fullName"
              className="input"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="shortName">
              Nama singkat
            </label>
            <input
              id="shortName"
              className="input"
              value={form.shortName}
              onChange={(e) => set('shortName', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="established">
              Tahun berdiri
            </label>
            <input
              id="established"
              type="number"
              className="input"
              value={form.established}
              onChange={(e) => set('established', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="tagline">
              Tagline
            </label>
            <input
              id="tagline"
              className="input"
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="description">
              Deskripsi singkat
            </label>
            <textarea
              id="description"
              rows={3}
              className="input"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Tampil pada hero halaman beranda dan footer.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="parent">
              Organisasi induk
            </label>
            <input
              id="parent"
              className="input"
              value={form.parent}
              onChange={(e) => set('parent', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="region">
              Regional
            </label>
            <input
              id="region"
              className="input"
              value={form.region}
              onChange={(e) => set('region', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="home">
              Lokasi
            </label>
            <input
              id="home"
              className="input"
              value={form.home}
              onChange={(e) => set('home', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Kontak */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Tautan & kontak</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tampil pada bagian ikon sosial di footer.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="instagram">
              URL Instagram
            </label>
            <input
              id="instagram"
              className="input"
              value={form.instagram}
              onChange={(e) => set('instagram', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="instagramLabel">
              Label Instagram
            </label>
            <input
              id="instagramLabel"
              className="input"
              value={form.instagramLabel}
              onChange={(e) => set('instagramLabel', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="linkedin">
              URL LinkedIn
            </label>
            <input
              id="linkedin"
              className="input"
              value={form.linkedin}
              onChange={(e) => set('linkedin', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="medium">
              URL Medium
            </label>
            <input
              id="medium"
              className="input"
              value={form.medium}
              onChange={(e) => set('medium', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              placeholder="Kosongkan untuk menyembunyikan tautan email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Bagian &ldquo;Tentang&rdquo;</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Narasi latar belakang Girl Up pada halaman beranda.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="aboutTitle">
              Judul
            </label>
            <input
              id="aboutTitle"
              className="input"
              value={form.aboutTitle}
              onChange={(e) => set('aboutTitle', e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="aboutParagraphs">
              Paragraf
            </label>
            <textarea
              id="aboutParagraphs"
              rows={6}
              className="input"
              value={form.aboutParagraphs}
              onChange={(e) => set('aboutParagraphs', e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-500">
              Satu paragraf per baris.
            </p>
          </div>
        </div>
      </section>

      <div className="card p-5">
        <SaveBar
          saving={saving}
          error={error}
          saved={saved}
          onSave={handleSave}
          onReset={() => reset(['identity', 'about'])}
        />
      </div>
    </div>
  );
}