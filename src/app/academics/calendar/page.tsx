import { db } from '@/db';
import { academicCalendar, academicSessions, semesters } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export default async function AcademicCalendarPage() {
  const [sessionList, semesterList, calendarEvents] = await Promise.all([
    db.select().from(academicSessions).orderBy(desc(academicSessions.startDate)),
    db.select().from(semesters).orderBy(semesters.semesterNumber),
    db.select().from(academicCalendar).orderBy(academicCalendar.startDate),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Academic Calendar</h1>
            <p className="text-slate-500">Important dates and deadlines for the academic year.</p>
          </div>
          {sessionList.length > 0 && (
            <Card className="mb-6">
              <CardTitle className="mb-4">Academic Sessions</CardTitle>
              <div className="space-y-3">
                {sessionList.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
                    <div>
                      <p className="font-bold text-slate-800">{s.name}</p>
                      <p className="text-sm text-slate-400">{formatDate(s.startDate)} — {formatDate(s.endDate)}</p>
                    </div>
                    {s.isCurrent && <Badge variant="success">Current</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {semesterList.length > 0 && (
            <Card className="mb-6">
              <CardTitle className="mb-4">Semesters</CardTitle>
              <div className="space-y-3">
                {semesterList.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
                    <div>
                      <p className="font-semibold text-slate-800">{s.name}</p>
                      <p className="text-sm text-slate-400">{formatDate(s.startDate)} — {formatDate(s.endDate)}</p>
                      {s.registrationDeadline && <p className="text-xs text-amber-500 mt-0.5">Registration deadline: {formatDate(s.registrationDeadline)}</p>}
                    </div>
                    {s.isCurrent && <Badge variant="success">Current</Badge>}
                  </div>
                ))}
              </div>
            </Card>
          )}
          {calendarEvents.length > 0 ? (
            <Card>
              <CardTitle className="mb-4">Key Dates</CardTitle>
              <div className="space-y-3">
                {calendarEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex flex-col items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{e.title}</p>
                      <p className="text-sm text-slate-400">{formatDate(e.startDate)}{e.endDate ? ` — ${formatDate(e.endDate)}` : ''}</p>
                    </div>
                    <Badge variant={e.isHoliday ? 'warning' : 'info'}>{e.eventType}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            sessionList.length === 0 && semesterList.length === 0 && (
              <Card><EmptyState icon={<Calendar className="w-8 h-8 text-indigo-400" />} title="No Calendar Events" description="Academic calendar dates will be published soon." /></Card>
            )
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
