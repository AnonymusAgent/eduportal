import { NextResponse } from 'next/server';
import { db } from '@/db';
import { programs, campuses, academicSessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const [programList, campusList, sessionList] = await Promise.all([
      db.select({ id: programs.id, name: programs.name, code: programs.code })
        .from(programs)
        .where(eq(programs.isActive, true)),
      db.select({ id: campuses.id, name: campuses.name, code: campuses.code })
        .from(campuses)
        .where(eq(campuses.isActive, true)),
      db.select({ id: academicSessions.id, name: academicSessions.name })
        .from(academicSessions),
    ]);

    return NextResponse.json({
      programs: programList.map((p) => ({ value: p.id, label: p.name })),
      campuses: campusList.map((c) => ({ value: c.id, label: c.name })),
      sessions: sessionList.map((s) => ({ value: s.id, label: s.name })),
    });
  } catch (error) {
    console.error('Failed to fetch options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch options' },
      { status: 500 }
    );
  }
}
