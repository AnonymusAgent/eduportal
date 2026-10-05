import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, attendance, courses, semesters } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Alert from '@/components/ui/Alert';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell, MobileTableCard, MobileTableRow } from '@/components/ui/Table';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/lib/utils';
import { ClipboardCheck, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

async function getStudentAttendance(userId: string) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.userId, userId))
    .limit(1);

  if (!student) return null;

  // Get attendance by course
  const courseAttendance = await db
    .select({
      courseId: attendance.courseId,
      courseName: courses.name,
      courseCode: courses.code,
      total: sql<number>`count(*)`,
      present: sql<number>`count(*) filter (where ${attendance.status} = 'present')`,
      absent: sql<number>`count(*) filter (where ${attendance.status} = 'absent')`,
      late: sql<number>`count(*) filter (where ${attendance.status} = 'late')`,
      excused: sql<number>`count(*) filter (where ${attendance.status} = 'excused')`,
    })
    .from(attendance)
    .innerJoin(courses, eq(attendance.courseId, courses.id))
    .where(eq(attendance.studentId, student.id))
    .groupBy(attendance.courseId, courses.name, courses.code);

  // Get recent attendance records
  const recentAttendance = await db
    .select({
      attendance: attendance,
      course: courses,
    })
    .from(attendance)
    .innerJoin(courses, eq(attendance.courseId, courses.id))
    .where(eq(attendance.studentId, student.id))
    .orderBy(desc(attendance.date))
    .limit(20);

  // Calculate overall attendance
  const overallStats = await db
    .select({
      total: sql<number>`count(*)`,
      present: sql<number>`count(*) filter (where ${attendance.status} = 'present' or ${attendance.status} = 'late')`,
    })
    .from(attendance)
    .where(eq(attendance.studentId, student.id));

  const totalClasses = overallStats[0]?.total || 0;
  const presentClasses = overallStats[0]?.present || 0;
  const overallPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  return {
    student,
    courseAttendance,
    recentAttendance,
    totalClasses,
    presentClasses,
    overallPercentage,
  };
}

export default async function AttendancePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const data = await getStudentAttendance(session.id);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <EmptyState
            title="No Attendance Records"
            description="Your attendance information is not available at this time."
          />
        </Card>
      </div>
    );
  }

  const { courseAttendance, recentAttendance, totalClasses, presentClasses, overallPercentage } = data;
  const minimumAttendance = 75;
  const isAttendanceLow = overallPercentage < minimumAttendance && totalClasses > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Attendance</h1>
        <p className="text-slate-500">Track your class attendance</p>
      </div>

      {/* Attendance Warning */}
      {isAttendanceLow && (
        <Alert variant="warning" title="Attendance Warning">
          Your overall attendance is {overallPercentage}%, which is below the required minimum of {minimumAttendance}%. 
          Please ensure regular attendance to be eligible for examinations.
        </Alert>
      )}

      {/* Overall Attendance */}
      <Card>
        <CardTitle className="mb-4">Overall Attendance</CardTitle>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-32 h-32 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={overallPercentage >= 75 ? '#22c55e' : overallPercentage >= 50 ? '#eab308' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${overallPercentage}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{overallPercentage}%</span>
              <span className="text-xs text-gray-500">Overall</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{totalClasses}</p>
              <p className="text-sm text-gray-500">Total Classes</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{presentClasses}</p>
              <p className="text-sm text-gray-500">Present</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{totalClasses - presentClasses}</p>
              <p className="text-sm text-gray-500">Absent/Late</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{minimumAttendance}%</p>
              <p className="text-sm text-gray-500">Required</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Attendance by Course */}
      <Card>
        <CardTitle className="mb-4">Attendance by Course</CardTitle>

        {courseAttendance.length > 0 ? (
          <div className="space-y-4">
            {courseAttendance.map((course) => {
              const percentage = course.total > 0 
                ? Math.round(((course.present + course.late) / course.total) * 100)
                : 0;
              const isLow = percentage < minimumAttendance;

              return (
                <div key={course.courseId} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{course.courseName}</p>
                      <p className="text-sm text-gray-500">{course.courseCode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLow && (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" aria-hidden="true" />
                      )}
                      <span className={`text-lg font-bold ${
                        percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <ProgressBar value={percentage} showLabel={false} />
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-500">Total: {course.total}</span>
                    <span className="text-green-600">Present: {course.present}</span>
                    <span className="text-red-600">Absent: {course.absent}</span>
                    <span className="text-yellow-600">Late: {course.late}</span>
                    <span className="text-blue-600">Excused: {course.excused}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Course Attendance"
            description="Attendance records by course will appear here once recorded."
          />
        )}
      </Card>

      {/* Recent Attendance */}
      <Card>
        <CardTitle className="mb-4">Recent Attendance Records</CardTitle>

        {recentAttendance.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table ariaLabel="Recent attendance records">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.map(({ attendance: att, course }) => (
                    <TableRow key={att.id}>
                      <TableCell>{formatDate(att.date)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-gray-500">{course.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {att.status === 'present' && <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />}
                          {att.status === 'absent' && <XCircle className="w-4 h-4 text-red-500" aria-hidden="true" />}
                          {att.status === 'late' && <Clock className="w-4 h-4 text-yellow-500" aria-hidden="true" />}
                          {att.status === 'excused' && <CheckCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />}
                          <Badge status={att.status}>{att.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{att.remarks || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {recentAttendance.map(({ attendance: att, course }) => (
                <MobileTableCard key={att.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                    <Badge status={att.status}>{att.status}</Badge>
                  </div>
                  <MobileTableRow label="Date" value={formatDate(att.date)} />
                  {att.remarks && <MobileTableRow label="Remarks" value={att.remarks} />}
                </MobileTableCard>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            title="No Recent Records"
            description="Your recent attendance records will appear here."
          />
        )}
      </Card>
    </div>
  );
}
