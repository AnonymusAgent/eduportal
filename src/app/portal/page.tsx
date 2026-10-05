import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import {
  students, programs, departments, studentFees, attendance,
  notifications, examinations, academicSessions,
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Avatar from '@/components/ui/Avatar';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  TrendingUp, CreditCard, ClipboardCheck, Calendar,
  Bell, BookOpen, Award, ArrowRight, AlertTriangle,
} from 'lucide-react';

async function getStudentData(userId: string) {
  const [student] = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
  if (!student) return null;

  const [program] = student.programId
    ? await db.select().from(programs).where(eq(programs.id, student.programId)).limit(1) : [null];
  const [department] = student.departmentId
    ? await db.select().from(departments).where(eq(departments.id, student.departmentId)).limit(1) : [null];
  const [academicSession] = student.academicSessionId
    ? await db.select().from(academicSessions).where(eq(academicSessions.id, student.academicSessionId)).limit(1) : [null];

  const pendingFees = await db.select().from(studentFees)
    .where(and(eq(studentFees.studentId, student.id), eq(studentFees.status, 'pending'))).limit(5);

  const recentNotifications = await db.select().from(notifications)
    .where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(5);

  const upcomingExams = await db.select().from(examinations)
    .where(eq(examinations.isPublished, true)).orderBy(examinations.examDate).limit(3);

  const attendanceData = await db.select({
    total: sql<number>`count(*)`,
    present: sql<number>`count(*) filter (where ${attendance.status} = 'present')`,
  }).from(attendance).where(eq(attendance.studentId, student.id));

  const attendancePercentage = attendanceData[0]?.total
    ? Math.round((attendanceData[0].present / attendanceData[0].total) * 100) : 0;

  return {
    student, program, department, academicSession, pendingFees,
    recentNotifications, upcomingExams, attendancePercentage,
    totalClasses: attendanceData[0]?.total || 0,
    presentClasses: attendanceData[0]?.present || 0,
  };
}

export default async function PortalDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');
  const data = await getStudentData(session.id);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <Card className="text-center py-12">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to EduPortal</h1>
          <p className="text-slate-500">Your student profile is being set up. Please check back later.</p>
        </Card>
      </div>
    );
  }

  const { student, program, department, academicSession, pendingFees, recentNotifications, upcomingExams, attendancePercentage } = data;
  const totalSemesters = program?.totalSemesters || 8;
  const completedSemesters = Math.max(0, student.currentSemester - 1);
  const creditsCompleted = student.totalCreditsCompleted || 0;
  const totalCredits = program?.totalCredits || 120;
  const creditsRemaining = totalCredits - creditsCompleted;
  const totalPendingAmount = pendingFees.reduce((sum, fee) => sum + parseFloat(fee.pendingAmount?.toString() || '0'), 0);
  const unreadNotifications = recentNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <Avatar firstName={student.firstName} lastName={student.lastName} src={student.photoUrl} size="xl" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Welcome back, {student.firstName}!
            </h1>
            <p className="text-slate-500 font-medium">{student.studentId} &bull; {program?.name || 'N/A'}</p>
          </div>
        </div>
        <Badge status={student.enrollmentStatus || 'active'} className="self-start sm:self-auto">
          {(student.enrollmentStatus || 'active').toUpperCase()}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current CGPA', value: student.cgpa || 'N/A', icon: TrendingUp, gradient: 'from-indigo-500 to-blue-500' },
          { label: 'Semester', value: `${student.currentSemester} of ${totalSemesters}`, icon: BookOpen, gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Attendance', value: `${attendancePercentage}%`, icon: ClipboardCheck, gradient: attendancePercentage >= 75 ? 'from-emerald-500 to-teal-500' : 'from-rose-500 to-pink-500' },
          { label: 'Pending Fees', value: formatCurrency(totalPendingAmount), icon: CreditCard, gradient: totalPendingAmount > 0 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className={`animate-fade-in-up animate-delay-${(i + 1) * 100}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-extrabold text-slate-800">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Alerts */}
      {(attendancePercentage < 75 && attendancePercentage > 0 || totalPendingAmount > 0) && (
        <div className="space-y-2 animate-fade-in-up animate-delay-200">
          {attendancePercentage < 75 && attendancePercentage > 0 && (
            <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-rose-200/50" role="alert">
              <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500">
                <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-rose-700 text-sm">Attendance Warning</p>
                <p className="text-sm text-rose-600">Your attendance is below 75%. Current: {attendancePercentage}%</p>
              </div>
            </div>
          )}
          {totalPendingAmount > 0 && (
            <div className="flex items-center gap-3 p-4 glass rounded-2xl border border-amber-200/50" role="alert">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <AlertTriangle className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-amber-700 text-sm">Fee Payment Due</p>
                <p className="text-sm text-amber-600">
                  Pending fees: {formatCurrency(totalPendingAmount)}.{' '}
                  <Link href="/portal/fees" className="underline font-semibold">Pay now</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Progress */}
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <CardTitle className="flex items-center justify-between mb-6">
            <span>Academic Progress</span>
            <Link href="/portal/progress" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </CardTitle>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">Semester Progress</span>
                <span className="font-bold text-slate-700">{completedSemesters} of {totalSemesters} completed</span>
              </div>
              <ProgressBar value={completedSemesters} max={totalSemesters} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 font-medium">Credits Completed</span>
                <span className="font-bold text-slate-700">{creditsCompleted} of {totalCredits}</span>
              </div>
              <ProgressBar value={creditsCompleted} max={totalCredits} variant="success" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/30">
              {[
                { label: 'Department', value: department?.name || 'N/A' },
                { label: 'Degree', value: program?.degreeType || 'N/A' },
                { label: 'Session', value: academicSession?.name || 'N/A' },
                { label: 'Credits Left', value: creditsRemaining },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl bg-white/30">
                  <p className="text-lg font-extrabold text-slate-800">{item.value}</p>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
            {student.expectedGraduationDate && (
              <div className="flex items-center justify-between pt-4 border-t border-white/30">
                <span className="text-slate-500 font-medium text-sm">Expected Graduation</span>
                <span className="font-bold text-slate-700 text-sm">{formatDate(student.expectedGraduationDate)}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="animate-fade-in-up animate-delay-300">
          <CardTitle className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-2">
              Notifications
              {unreadNotifications > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </span>
            <Link href="/portal/notifications" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</Link>
          </CardTitle>
          <div className="space-y-2.5">
            {recentNotifications.length > 0 ? recentNotifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-xl transition-colors ${notification.isRead ? 'bg-white/30' : 'bg-indigo-50/60 border border-indigo-100/50'}`}>
                <div className="flex items-start gap-3">
                  <Bell className={`w-4 h-4 mt-0.5 ${notification.isRead ? 'text-slate-400' : 'text-indigo-500'}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.isRead ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>{notification.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-6">No notifications</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <Card className="animate-fade-in-up animate-delay-300">
          <CardTitle className="flex items-center justify-between mb-4">
            <span>Upcoming Examinations</span>
            <Link href="/portal/exams" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</Link>
          </CardTitle>
          <div className="space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map((exam) => (
              <div key={exam.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/30">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate text-sm">{exam.name}</p>
                  <p className="text-xs text-slate-400">{formatDate(exam.examDate)}</p>
                </div>
                <Badge variant="info">{exam.examType}</Badge>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-6">No upcoming exams</p>
            )}
          </div>
        </Card>

        {/* Pending Fees */}
        <Card className="animate-fade-in-up animate-delay-400">
          <CardTitle className="flex items-center justify-between mb-4">
            <span>Pending Fees</span>
            <Link href="/portal/fees" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All</Link>
          </CardTitle>
          <div className="space-y-3">
            {pendingFees.length > 0 ? pendingFees.map((fee) => (
              <div key={fee.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-400" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{fee.description || 'Fee Payment'}</p>
                    <p className="text-xs text-slate-400">Due: {formatDate(fee.dueDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">{formatCurrency(fee.pendingAmount)}</p>
                  <Badge status={fee.status}>{fee.status}</Badge>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-emerald-600 font-semibold text-sm">All fees paid!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
