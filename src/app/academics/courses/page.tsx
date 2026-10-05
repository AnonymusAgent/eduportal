import { db } from '@/db';
import { courses, departments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import PublicHeader from '@/components/layouts/PublicHeader';
import PublicFooter from '@/components/layouts/PublicFooter';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { BookOpen } from 'lucide-react';

export default async function CoursesPage() {
  const courseList = await db
    .select({ course: courses, department: departments })
    .from(courses)
    .leftJoin(departments, eq(courses.departmentId, departments.id))
    .where(eq(courses.isActive, true));

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main id="main-content" className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Course Catalog</h1>
            <p className="text-slate-500 max-w-2xl mx-auto">Explore all courses offered across our departments.</p>
          </div>
          {courseList.length > 0 ? (
            <Card padding="none">
              <div className="overflow-x-auto">
                <Table ariaLabel="Course catalog">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseList.map(({ course, department }) => (
                      <TableRow key={course.id}>
                        <TableCell><span className="font-semibold text-indigo-600">{course.code}</span></TableCell>
                        <TableCell><span className="font-medium text-slate-800">{course.name}</span></TableCell>
                        <TableCell>{department?.name || '—'}</TableCell>
                        <TableCell>{course.creditHours}</TableCell>
                        <TableCell><Badge variant={course.isElective ? 'info' : 'default'}>{course.isElective ? 'Elective' : 'Required'}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <Card><EmptyState icon={<BookOpen className="w-8 h-8 text-indigo-400" />} title="No Courses" description="Course information will be available soon." /></Card>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
