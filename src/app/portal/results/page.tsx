import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, semesterResults, semesters } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Award } from 'lucide-react';

export default async function ResultsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><EmptyState title="No Profile" /></Card>;

  const results = await db
    .select({ result: semesterResults, semester: semesters })
    .from(semesterResults)
    .innerJoin(semesters, eq(semesterResults.semesterId, semesters.id))
    .where(eq(semesterResults.studentId, student.id))
    .orderBy(desc(semesters.semesterNumber));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{student.cgpa || 'N/A'}</p><p className="text-xs text-slate-400">Cumulative GPA</p></Card>
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{student.totalCreditsCompleted}</p><p className="text-xs text-slate-400">Credits Earned</p></Card>
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{student.currentSemester}</p><p className="text-xs text-slate-400">Current Semester</p></Card>
      </div>
      <Card>
        <CardTitle className="mb-4">Semester Results</CardTitle>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map(({ result, semester }) => (
              <div key={result.id} className="p-4 rounded-xl bg-white/30 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">{semester.name}</p>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span>GPA: <strong>{result.semesterGpa || '—'}</strong></span>
                    <span>CGPA: <strong>{result.cgpa || '—'}</strong></span>
                    <span>Credits: {result.creditsEarned || 0}/{result.creditsAttempted || 0}</span>
                  </div>
                </div>
                <div className="text-right">
                  {result.academicStanding && <Badge variant={result.academicStanding === 'good' ? 'success' : 'warning'}>{result.academicStanding}</Badge>}
                  {result.status && <Badge status={result.status} className="ml-2">{result.status}</Badge>}
                </div>
              </div>
            ))}
          </div>
        ) : <EmptyState icon={<Award className="w-8 h-8 text-indigo-400" />} title="No Results" description="Your semester results will appear here once published." />}
      </Card>
    </div>
  );
}
