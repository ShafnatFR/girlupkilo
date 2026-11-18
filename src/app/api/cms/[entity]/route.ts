import { NextResponse } from 'next/server';

import * as cms from '@/lib/cms/admin';
import { cmsErrorResponse } from '@/lib/cms/http';
import {
  parseDepartment,
  parseLeader,
  parseMilestone,
  parseProgram,
  readJson,
} from '@/lib/cms/validate';

const ENTITIES = ['departments', 'leaders', 'programs', 'milestones'] as const;
type Entity = (typeof ENTITIES)[number];

type Context = { params: Promise<{ entity: string }> };

function isEntity(value: string): value is Entity {
  return (ENTITIES as readonly string[]).includes(value);
}

/** GET /api/cms/{departments|leaders|programs|milestones} */
export async function GET(_request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }

    const guard = await cms.requireCmsEditor();
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
    }
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

/** POST /api/cms/{departments|leaders|programs|milestones} */
export async function POST(request: Request, { params }: Context) {
  try {
    const { entity } = await params;
    if (!isEntity(entity)) {
      return NextResponse.json({ error: 'Entitas tidak ditemukan' }, { status: 404 });
    }

    const guard = await cms.requireCmsEditor();
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
    }
  } catch (error) {
    return cmsErrorResponse(error);
  }
}