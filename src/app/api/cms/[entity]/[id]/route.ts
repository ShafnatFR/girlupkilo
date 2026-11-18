import { NextResponse } from 'next/server';

import * as cms from '@/lib/cms/admin';
import { assertUuid, cmsErrorResponse } from '@/lib/cms/http';
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

type Context = { params: Promise<{ entity: string; id: string }> };

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

/** PATCH /api/cms/{entity}/{id} */
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { entity, id } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }
    assertUuid(id);

    const guard = await guardFor(entity);
    if (!guard.ok) return guard.response;

    const body = await readJson(request);
    const userId = guard.user.id;

    switch (entity) {
      case 'departments': {
        const row = await cms.updateDepartment(id, parseDepartment(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'leaders': {
        const row = await cms.updateLeader(id, parseLeader(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'programs': {
        const row = await cms.updateProgram(id, parseProgram(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'milestones': {
        const row = await cms.updateMilestone(id, parseMilestone(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'events': {
        const row = await cms.updateEvent(id, parseEvent(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'gallery': {
        const row = await cms.updateGallery(id, parseGallery(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'articles': {
        const row = await cms.updateArticle(id, parseArticle(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
      case 'emagazines': {
        const row = await cms.updateEmagazine(id, parseEmagazine(body), userId);
        if (!row) {
          return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
        }
        return NextResponse.json({ data: row });
      }
    }
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

/** DELETE /api/cms/{entity}/{id} */
export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { entity, id } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }
    assertUuid(id);

    const guard = await guardFor(entity);
    if (!guard.ok) return guard.response;

    let deleted = false;
    switch (entity) {
      case 'departments':
        deleted = await cms.deleteDepartment(id);
        break;
      case 'leaders':
        deleted = await cms.deleteLeader(id);
        break;
      case 'programs':
        deleted = await cms.deleteProgram(id);
        break;
      case 'milestones':
        deleted = await cms.deleteMilestone(id);
        break;
      case 'events':
        deleted = await cms.deleteEvent(id);
        break;
      case 'gallery':
        deleted = await cms.deleteGallery(id);
        break;
      case 'articles':
        deleted = await cms.deleteArticle(id);
        break;
      case 'emagazines':
        deleted = await cms.deleteEmagazine(id);
        break;
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}