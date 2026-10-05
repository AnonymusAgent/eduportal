import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, programs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><p className="text-center text-slate-500 py-8">No student profile found.</p></Card>;
  const [program] = student.programId ? await db.select().from(programs).where(eq(programs.id, student.programId)).limit(1) : [null];

  const totalSem = program?.totalSemesters || 8;
  const completedSem = Math.max(0, student.currentSemester - 1);
  const totalCr = program?.totalCredits || 120;
  const doneCr = student.totalCreditsCompleted || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">Academic Progress</h1>
      <Card>
        <CardTitle className="mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" /> Semester Timeline</CardTitle>
        <div className="flex flex-wrap gap-3 mb-6">
          {Array.from({ length: totalSem }, (_, i) => i + 1).map((s) => (
            <div key={s} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold ${s < student.currentSemester ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : s === student.currentSemester ? 'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white ring-2 ring-indigo-300' : 'bg-white/30 text-slate-400'}`}>
              <span>S{s}</span>
              {s < student.currentSemester && <span className="text-[8px]">✓</span>}
              {s === student.currentSemester && <span className="text-[8px]">Now</span>}
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Semester Progress</span><span className="font-bold text-slate-700">{completedSem}/{totalSem}</span></div>
            <ProgressBar value={completedSem} max={totalSem} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Credits Completed</span><span className="font-bold text-slate-700">{doneCr}/{totalCr}</span></div>
            <ProgressBar value={doneCr} max={totalCr} variant="success" />
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{student.cgpa || 'N/A'}</p><p className="text-xs text-slate-400">CGPA</p></Card>
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{program?.degreeType || 'N/A'}</p><p className="text-xs text-slate-400">Degree</p></Card>
        <Card className="text-center"><p className="text-2xl font-extrabold text-slate-800">{formatDate(student.expectedGraduationDate)}</p><p className="text-xs text-slate-400">Expected Graduation</p></Card>
      </div>
    </div>
  );
}
