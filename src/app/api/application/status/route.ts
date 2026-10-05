import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { admissionApplications, programs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { formatDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.json({ error: 'Reference number is required.' }, { status: 400 });

  const [app] = await db.select().from(admissionApplications).where(eq(admissionApplications.applicationNumber, ref.trim())).limit(1);
  if (!app) return NextResponse.json({ error: 'No application found with that reference number.' }, { status: 404 });

  let programName = '';
  if (app.programId) {
    const [p] = await db.select().from(programs).where(eq(programs.id, app.programId)).limit(1);
    programName = p?.name || '';
  }

  return NextResponse.json({
    status: app.status,
    name: [app.firstName, app.lastName].filter(Boolean).join(' ') || 'Applicant',
    program: programName,
    date: formatDate(app.submittedAt || app.createdAt),
  });
}
