import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, studentEnrollments, courses, semesters, staff } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default async function CoursesPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const [student] = await db.select().from(students).where(eq(students.userId, session.id)).limit(1);
  if (!student) return <Card className="max-w-4xl mx-auto mt-8"><EmptyState title="No Profile" description="Student profile not found." /></Card>;

  const enrollments = await db
    .select({ enrollment: studentEnrollments, course: courses, semester: semesters, instructor: staff })
    .from(studentEnrollments)
    .innerJoin(courses, eq(studentEnrollments.courseId, courses.id))
    .leftJoin(semesters, eq(studentEnrollments.semesterId, semesters.id))
    .leftJoin(staff, eq(studentEnrollments.instructorId, staff.id))
    .where(eq(studentEnrollments.studentId, student.id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-800">My Courses</h1>
      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollments.map(({ enrollment, course, semester, instructor }) => (
            <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600">{course.code}</span>
                <Badge status={enrollment.status || 'enrolled'}>{enrollment.status || 'Enrolled'}</Badge>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{course.name}</h3>
              <div className="text-sm text-slate-500 space-y-0.5">
                {instructor && <p>Instructor: {instructor.firstName} {instructor.lastName}</p>}
                <p>Credits: {course.creditHours}</p>
                {semester && <p>Semester: {semester.name}</p>}
                {enrollment.grade && <p>Grade: <span className="font-semibold text-slate-700">{enrollment.grade}</span></p>}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card><EmptyState icon={<BookOpen className="w-8 h-8 text-indigo-400" />} title="No Courses" description="You are not enrolled in any courses yet." /></Card>
      )}
    </div>
  );
}
