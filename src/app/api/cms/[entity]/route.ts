import { NextResponse } from 'next/server';

import * as cms from '@/lib/cms/admin';
import { cmsErrorResponse } from '@/lib/cms/http';
import {
  parseArticle,
  parseDepartment,
  parseEmagazine,
  parseEvent,
  parseGallery,
  parseLeader,
  parseMilestone,
  parseProgram,
  readJson,
} from '@/lib/cms/validate';

const ENTITIES = [
  'departments',
  'leaders',
  'programs',
  'milestones',
  'events',
  'gallery',
  'articles',
  'emagazines',
] as const;
type Entity = (typeof ENTITIES)[number];

type Context = { params: Promise<{ entity: string }> };

function isEntity(value: string): value is Entity {
  return (ENTITIES as readonly string[]).includes(value);
}

/** Entitas yang dikelola staf/officer (CONTENT_ROLES), bukan hanya admin/manajer. */
const CONTENT_ENTITIES = new Set<Entity>([
  'events',
  'gallery',
  'articles',
  'emagazines',
]);

/** Guard sesuai entitas: konten tambahan mengizinkan staf, sisanya admin/manajer. */
async function guardFor(entity: Entity) {
  return CONTENT_ENTITIES.has(entity)
    ? cms.requireContentEditor()
    : cms.requireCmsEditor();
}

/** GET /api/cms/{entity} */
export async function GET(_request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }

    const guard = await guardFor(entity);
    if (!guard.ok) return guard.response;

    switch (entity) {
      case 'departments':
        return NextResponse.json({ data: await cms.listDepartments() });
      case 'leaders':
        return NextResponse.json({ data: await cms.listLeaders() });
      case 'programs':
        return NextResponse.json({ data: await cms.listPrograms() });
      case 'milestones':
        return NextResponse.json({ data: await cms.listMilestones() });
      case 'events':
        return NextResponse.json({ data: await cms.listEvents() });
      case 'gallery':
        return NextResponse.json({ data: await cms.listGallery() });
      case 'articles':
        return NextResponse.json({ data: await cms.listArticles() });
      case 'emagazines':
        return NextResponse.json({ data: await cms.listEmagazines() });
    }
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

/** POST /api/cms/{entity} */
export async function POST(request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }

    const guard = await guardFor(entity);
    if (!guard.ok) return guard.response;

    const body = await readJson(request);

    switch (entity) {
      case 'departments': {
        const row = await cms.createDepartment(parseDepartment(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'leaders': {
        const row = await cms.createLeader(parseLeader(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'programs': {
        const row = await cms.createProgram(parseProgram(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'milestones': {
        const row = await cms.createMilestone(parseMilestone(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'events': {
        const row = await cms.createEvent(parseEvent(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'gallery': {
        const row = await cms.createGallery(parseGallery(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'articles': {
        const row = await cms.createArticle(parseArticle(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
      case 'emagazines': {
        const row = await cms.createEmagazine(parseEmagazine(body));
        return NextResponse.json({ data: row }, { status: 201 });
      }
    }
  } catch (error) {
    return cmsErrorResponse(error);
  }
}