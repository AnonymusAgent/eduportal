import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { examinations, courses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { FileText, Calendar, Clock, MapPin } from 'lucide-react';

export default async function ExamsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const exams = await db
    .select({ exam: examinations, course: courses })
    .from(examinations)
    .leftJoin(courses, eq(examinations.courseId, courses.id))
    .where(eq(examinations.isPublished, true))
    .orderBy(desc(examinations.examDate));

  const now = new Date();
  const upcoming = exams.filter((e) => new Date(e.exam.examDate) >= now);
  const past = exams.filter((e) => new Date(e.exam.examDate) < now);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Examinations</h1>

      <Card>
        <CardTitle className="mb-4">Upcoming Exams</CardTitle>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map(({ exam, course }) => (
              <div key={exam.id} className="p-4 rounded-xl bg-white/30 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex flex-col items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{exam.name}</p>
                  {course && <p className="text-sm text-indigo-500">{course.code} — {course.name}</p>}
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(exam.examDate)}</span>
                    {exam.startTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.startTime.slice(0, 5)}{exam.endTime ? `–${exam.endTime.slice(0, 5)}` : ''}</span>}
                    {exam.roomNumber && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Room {exam.roomNumber}</span>}
                  </div>
                </div>
                <Badge variant="info">{exam.examType}</Badge>
              </div>
            ))}
          </div>
        ) : <EmptyState title="No Upcoming Exams" description="No examinations are scheduled at this time." />}
      </Card>

      {past.length > 0 && (
        <Card>
          <CardTitle className="mb-4">Past Exams</CardTitle>
          <div className="space-y-2">
            {past.map(({ exam, course }) => (
              <div key={exam.id} className="p-3 rounded-xl bg-white/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700 text-sm">{exam.name}</p>
                  {course && <p className="text-xs text-slate-400">{course.code}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">{formatDate(exam.examDate)}</p>
                  <Badge variant="default">{exam.examType}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
