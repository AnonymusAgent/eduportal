import { db } from '@/db';
import { departments, programs } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default async function DepartmentsPage() {
  const deptList = await db
    .select({
      id: departments.id, name: departments.name, code: departments.code,
      description: departments.description,
      programCount: sql<number>`(select count(*) from ${programs} where ${programs.departmentId} = ${departments.id})`,
    })
    .from(departments)
    .where(eq(departments.isActive, true));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Academic Departments</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Explore our departments and the programs they offer.</p>
          </div>
          {deptList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deptList.map((dept) => (
                <Card key={dept.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                      <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 text-lg">{dept.name}</h2>
                      <p className="text-xs text-indigo-500 font-semibold">{dept.code}</p>
                      {dept.description && <p className="text-slate-500 text-sm mt-2 line-clamp-3">{dept.description}</p>}
                      <p className="text-xs text-slate-400 mt-2">{dept.programCount} program(s)</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card><EmptyState title="No Departments" description="Department information will be available soon." /></Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
