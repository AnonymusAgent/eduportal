import { db } from '@/db';
import { programs, departments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { GraduationCap } from 'lucide-react';

export default async function ProgramsPage() {
  const programList = await db
    .select({ program: programs, department: departments })
    .from(programs)
    .leftJoin(departments, eq(programs.departmentId, departments.id))
    .where(eq(programs.isActive, true));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Our Programs</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Browse our full catalog of degree programs.</p>
          </div>
          {programList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programList.map(({ program, department }) => (
                <Card key={program.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="info">{program.degreeType || 'Degree'}</Badge>
                    <span className="text-xs text-slate-400 font-semibold">{program.code}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">{program.name}</h2>
                  {department && <p className="text-xs text-indigo-500 font-semibold mb-2">{department.name}</p>}
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{program.description || 'A comprehensive academic program.'}</p>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <span>{program.durationYears} Years</span>
                    <span>{program.totalCredits} Credits</span>
                    <span>{program.totalSemesters} Semesters</span>
                  </div>
                  <Link href="/apply"><Button variant="outline" size="sm" className="w-full">Apply Now</Button></Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card><EmptyState icon={<GraduationCap className="w-8 h-8 text-indigo-400" />} title="No Programs" description="Program information will be available soon." /></Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
