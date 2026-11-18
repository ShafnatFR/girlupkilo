import { NextResponse } from 'next/server';

import * as cms from '@/lib/cms/admin';
import { assertUuid, cmsErrorResponse } from '@/lib/cms/http';
import {
  parseDepartment,
  parseLeader,
  parseMilestone,
  parseProgram,
  readJson,
} from '@/lib/cms/validate';

const ENTITIES = ['departments', 'leaders', 'programs', 'milestones'] as const;
type Entity = (typeof ENTITIES)[number];

type Context = { params: Promise<{ entity: string; id: string }> };

function isEntity(value: string): value is Entity {
  return (ENTITIES as readonly string[]).includes(value);
}

/** PATCH /api/cms/{entity}/{id} */
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { entity, id } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }
    assertUuid(id);

    const guard = await cms.requireCmsEditor();
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

    const guard = await cms.requireCmsEditor();
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
    }

    if (!deleted) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}