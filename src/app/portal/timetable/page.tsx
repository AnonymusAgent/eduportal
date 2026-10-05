import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, timetable, courses, staff, semesters } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default async function TimetablePage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><EmptyState title="No Profile" /></Card>;

  const [currentSem] = await db.select().from(semesters).where(eq(semesters.isCurrent, true)).limit(1);
  const entries = currentSem ? await db
    .select({ tt: timetable, course: courses, instructor: staff })
    .from(timetable)
    .innerJoin(courses, eq(timetable.courseId, courses.id))
    .leftJoin(staff, eq(timetable.instructorId, staff.id))
    .where(and(eq(timetable.semesterId, currentSem.id), eq(timetable.isActive, true))) : [];

  const grouped = DAYS.map((day, i) => ({ day, entries: entries.filter((e) => e.tt.dayOfWeek === i) })).filter((g) => g.entries.length > 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Timetable</h1>
      {grouped.length > 0 ? grouped.map((g) => (
        <Card key={g.day}>
          <CardTitle className="mb-4">{g.day}</CardTitle>
          <div className="space-y-3">
            {g.entries.sort((a, b) => a.tt.startTime.localeCompare(b.tt.startTime)).map((e) => (
              <div key={e.tt.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/30">
                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-bold text-indigo-600">{e.tt.startTime?.slice(0, 5)}</p>
                  <p className="text-xs text-slate-400">{e.tt.endTime?.slice(0, 5)}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{e.course.name} <span className="text-indigo-500 text-xs">({e.course.code})</span></p>
                  {e.instructor && <p className="text-sm text-slate-500">{e.instructor.firstName} {e.instructor.lastName}</p>}
                </div>
                {e.tt.roomNumber && <span className="text-xs bg-white/40 px-2 py-1 rounded-lg text-slate-500 font-medium">Room {e.tt.roomNumber}</span>}
              </div>
            ))}
          </div>
        </Card>
      )) : (
        <Card><EmptyState icon={<Calendar className="w-8 h-8 text-indigo-400" />} title="No Timetable" description="Your timetable for the current semester has not been published yet." /></Card>
      )}
    </div>
  );
}
