import 'server-only';

import { cache } from 'react';
import type { LucideIcon } from 'lucide-react';

import {
  ABOUT_GLOBAL,
  CONTACT,
  DEPARTMENTS,
  JOIN_STEPS,
  LEADERSHIP,
  MILESTONES,
  MISSIONS,
  PILLARS,
  PROGRAMS,
  SITE,
  STATS,
  VALUES,
  VISION,
  VISION_QUOTE,
  type Department,
  type LeadershipMember,
  type Milestone,
  type Program,
} from '@/lib/site';
import { resolveIcon } from '@/lib/cms/icons';
import {
  loadDepartments,
  loadLeaders,
  loadMilestones,
  loadPrograms,
  loadSettings,
  toStringArray,
  type SettingsMap,
} from '@/lib/cms/queries';

// ------------------------------------------------------------------
// Bentuk konten yang dipakai halaman publik
// ------------------------------------------------------------------

export interface SiteIdentity {
  name: string;
  fullName: string;
  shortName: string;
  tagline: string;
  established: number;
  description: string;
  parent: string;
  region: string;
  home: string;
}

export interface SiteContact {
  instagram: string;
  instagramLabel: string;
  linkedin: string;
  medium: string;
  email: string;
}

export interface PublicContent {
  site: SiteIdentity;
  contact: SiteContact;
  about: { title: string; paragraphs: string[] };
  vision: { statement: string; quote: string };
  missions: { title: string; description: string }[];
  values: { title: string; id: string; description: string }[];
  pillars: { title: string; description: string; icon: LucideIcon }[];
  stats: { value: string; label: string; note: string }[];
  departments: Department[];
  leadership: LeadershipMember[];
  programs: Program[];
  milestones: Milestone[];
  joinSteps: { title: string; description: string }[];
}

// ------------------------------------------------------------------
// Helper konversi yang aman terhadap data JSON dari database
// ------------------------------------------------------------------

function obj(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() !== '' ? value : fallback;
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function objects(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Record<string, unknown> =>
      !!item && typeof item === 'object' && !Array.isArray(item)
  );
}

/** Ambil dokumen JSON satu bagian dari map settings. */
function section(settings: SettingsMap, key: string): Record<string, unknown> {
  return obj(settings[key]);
}

// ------------------------------------------------------------------
// Penyusun konten publik: default dari kode, ditimpa data CMS bila ada
// ------------------------------------------------------------------

/**
 * Konten untuk halaman publik.
 *
 * Data dibaca dari database (tabel CMS). Bila sebuah bagian belum diisi
 * atau skema CMS belum dipasang, nilai default dari src/lib/site.ts
 * dipakai sehingga halaman tidak pernah kosong.
 *
 * Di-cache per-request lewat React cache() agar layout dan page yang
 * sama-sama memanggil fungsi ini tidak menggandakan query.
 */
export const getPublicContent = cache(async (): Promise<PublicContent> => {
  const [settings, deptRows, leaderRows, programRows, milestoneRows] =
    await Promise.all([
      loadSettings(),
      loadDepartments(),
      loadLeaders(),
      loadPrograms(),
      loadMilestones(),
    ]);

  // ---------------- identitas & kontak
  const identity = section(settings, 'identity');
  const site: SiteIdentity = {
    name: str(identity.name, SITE.name),
    fullName: str(identity.fullName, SITE.fullName),
    shortName: str(identity.shortName, SITE.shortName),
    tagline: str(identity.tagline, SITE.tagline),
    established: num(identity.established, SITE.established),
    description: str(identity.description, SITE.description),
    parent: str(identity.parent, SITE.parent),
    region: str(identity.region, SITE.region),
    home: str(identity.home, SITE.home),
  };

  const rawContact = obj(identity.contact);
  const contact: SiteContact = {
    instagram: str(rawContact.instagram, CONTACT.instagram),
    instagramLabel: str(rawContact.instagramLabel, CONTACT.instagramLabel),
    linkedin: str(rawContact.linkedin, CONTACT.linkedin),
    medium: str(rawContact.medium, CONTACT.medium),
    email: str(rawContact.email, CONTACT.email),
  };

  // ---------------- tentang Girl Up
  const rawAbout = section(settings, 'about');
  const about = {
    title: str(rawAbout.title, ABOUT_GLOBAL.title),
    paragraphs: toStringArray(rawAbout.paragraphs, [...ABOUT_GLOBAL.paragraphs]),
  };

  // ---------------- visi
  const rawVision = section(settings, 'vision');
  const vision = {
    statement: str(rawVision.statement, VISION),
    quote: str(rawVision.quote, VISION_QUOTE),
  };

  // ---------------- misi
  const rawMissions = objects(settings.missions);
  const missions =
    rawMissions.length > 0
      ? rawMissions.map((item, i) => ({
          title: str(item.title, MISSIONS[i]?.title ?? `Misi ${i + 1}`),
          description: str(
            item.description,
            MISSIONS[i]?.description ?? ''
          ),
        }))
      : MISSIONS;

  // ---------------- nilai inti
  const rawValues = objects(settings.values);
  const values =
    rawValues.length > 0
      ? rawValues.map((item, i) => ({
          title: str(item.title, VALUES[i]?.title ?? `Nilai ${i + 1}`),
          id: str(item.id, VALUES[i]?.id ?? ''),
          description: str(item.description, VALUES[i]?.description ?? ''),
        }))
      : VALUES;

  // ---------------- pilar
  const rawPillars = objects(settings.pillars);
  const pillars =
    rawPillars.length > 0
      ? rawPillars.map((item, i) => ({
          title: str(item.title, PILLARS[i]?.title ?? `Pilar ${i + 1}`),
          description: str(item.description, PILLARS[i]?.description ?? ''),
          icon: resolveIcon(str(item.icon, 'sparkles')),
        }))
      : PILLARS;

  // ---------------- statistik
  const rawStats = objects(settings.stats);
  const stats =
    rawStats.length > 0
      ? rawStats.map((item, i) => ({
          value: str(item.value, STATS[i]?.value ?? '0'),
          label: str(item.label, STATS[i]?.label ?? ''),
          note: str(item.note, STATS[i]?.note ?? ''),
        }))
      : STATS;

  // ---------------- departemen
  const departments: Department[] =
    deptRows.length > 0
      ? deptRows.map((row) => ({
          slug: row.slug,
          name: row.name,
          shortName: row.short_name,
          tagline: row.tagline,
          description: row.description,
          focus: toStringArray(row.focus),
          icon: resolveIcon(row.icon),
          head: row.head_name ?? undefined,
          deputy: row.deputy_name ?? undefined,
          members: row.member_count ?? undefined,
        }))
      : DEPARTMENTS;

  // ---------------- pengurus
  const leadership: LeadershipMember[] =
    leaderRows.length > 0
      ? leaderRows.map((row) => ({
          name: row.name,
          role: row.role,
          group: row.group_name,
        }))
      : LEADERSHIP;

  // ---------------- program
  const programs: Program[] =
    programRows.length > 0
      ? programRows.map((row) => ({
          title: row.title,
          category: row.category,
          description: row.description,
          icon: resolveIcon(row.icon),
        }))
      : PROGRAMS;

  // ---------------- tonggak waktu
  const milestones: Milestone[] =
    milestoneRows.length > 0
      ? milestoneRows.map((row) => ({
          year: row.year,
          title: row.title,
          description: row.description,
        }))
      : MILESTONES;

  // ---------------- alur bergabung
  const rawJoin = objects(settings.join_steps);
  const joinSteps =
    rawJoin.length > 0
      ? rawJoin.map((item, i) => ({
          title: str(item.title, JOIN_STEPS[i]?.title ?? `Langkah ${i + 1}`),
          description: str(item.description, JOIN_STEPS[i]?.description ?? ''),
        }))
      : JOIN_STEPS;

  return {
    site,
    contact,
    about,
    vision,
    missions,
    values,
    pillars,
    stats,
    departments,
    leadership,
    programs,
    milestones,
    joinSteps,
  };
});