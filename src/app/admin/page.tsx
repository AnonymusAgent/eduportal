import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, admissionApplications, studentFees, supportTickets, announcements } from '@/db/schema';
import { sql, desc } from 'drizzle-orm';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  Users, FileText, CreditCard, HelpCircle, TrendingUp,
  UserPlus, DollarSign, AlertTriangle, ArrowRight,
  CheckCircle, Clock,
} from 'lucide-react';

async function getAdminDashboardData() {
  const [studentStats] = await db.select({ total: sql<number>`count(*)`, active: sql<number>`count(*) filter (where ${students.enrollmentStatus} = 'active')` }).from(students);
  const [applicationStats] = await db.select({ total: sql<number>`count(*)`, pending: sql<number>`count(*) filter (where ${admissionApplications.status} = 'submitted')`, underReview: sql<number>`count(*) filter (where ${admissionApplications.status} = 'under_review')`, accepted: sql<number>`count(*) filter (where ${admissionApplications.status} = 'accepted')` }).from(admissionApplications);
  const [feeStats] = await db.select({ totalCollected: sql<number>`coalesce(sum(${studentFees.paidAmount}), 0)`, totalPending: sql<number>`coalesce(sum(${studentFees.pendingAmount}), 0)`, overdueCount: sql<number>`count(*) filter (where ${studentFees.status} = 'overdue')` }).from(studentFees);
  const [ticketStats] = await db.select({ total: sql<number>`count(*)`, open: sql<number>`count(*) filter (where ${supportTickets.status} = 'open')`, inProgress: sql<number>`count(*) filter (where ${supportTickets.status} = 'in_progress')` }).from(supportTickets);
  const recentApplications = await db.select().from(admissionApplications).orderBy(desc(admissionApplications.createdAt)).limit(5);
  const recentAnnouncements = await db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(5);
  return { studentStats, applicationStats, feeStats, ticketStats, recentApplications, recentAnnouncements };
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');
  const { studentStats, applicationStats, feeStats, ticketStats, recentApplications, recentAnnouncements } = await getAdminDashboardData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-extrabold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 font-medium">Welcome back, {session.firstName || session.email}. Here&apos;s your institution overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: studentStats.total, sub: `${studentStats.active} active`, subColor: 'text-emerald-500', icon: Users, gradient: 'from-indigo-500 to-blue-500' },
          { label: 'Applications', value: applicationStats.total, sub: `${applicationStats.pending} pending`, subColor: 'text-amber-500', icon: FileText, gradient: 'from-violet-500 to-purple-500' },
          { label: 'Fee Collection', value: formatCurrency(feeStats.totalCollected), sub: `${formatCurrency(feeStats.totalPending)} pending`, subColor: 'text-rose-500', icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
          { label: 'Support Tickets', value: ticketStats.total, sub: `${ticketStats.open} open`, subColor: 'text-amber-500', icon: HelpCircle, gradient: 'from-amber-500 to-orange-500' },
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
                  <p className={`text-xs font-semibold ${stat.subColor}`}>{stat.sub}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Application Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 animate-fade-in-up animate-delay-200">
          <CardTitle className="flex items-center justify-between mb-6">
            <span>Application Overview</span>
            <Link href="/admin/admissions" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </CardTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Pending', value: applicationStats.pending, icon: Clock, bg: 'bg-amber-50/70 border-amber-200/40', iconBg: 'from-amber-500 to-orange-500' },
              { label: 'Under Review', value: applicationStats.underReview, icon: FileText, bg: 'bg-indigo-50/70 border-indigo-200/40', iconBg: 'from-indigo-500 to-blue-500' },
              { label: 'Accepted', value: applicationStats.accepted, icon: CheckCircle, bg: 'bg-emerald-50/70 border-emerald-200/40', iconBg: 'from-emerald-500 to-teal-500' },
              { label: 'Total', value: applicationStats.total, icon: TrendingUp, bg: 'bg-violet-50/70 border-violet-200/40', iconBg: 'from-violet-500 to-purple-500' },
            ].map((s) => {
              const I = s.icon;
              return (
                <div key={s.label} className={`text-center p-4 rounded-2xl border ${s.bg}`}>
                  <div className={`w-9 h-9 mx-auto mb-2 rounded-xl bg-gradient-to-br ${s.iconBg} flex items-center justify-center`}>
                    <I className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="animate-fade-in-up animate-delay-300">
          <CardTitle className="mb-4">Quick Actions</CardTitle>
          <div className="space-y-2.5">
            {[
              { href: '/admin/students/new', label: 'Add New Student', icon: UserPlus, gradient: 'from-indigo-500 to-blue-500' },
              { href: '/admin/announcements/new', label: 'Create Announcement', icon: FileText, gradient: 'from-emerald-500 to-teal-500' },
              { href: '/admin/fees/record', label: 'Record Payment', icon: CreditCard, gradient: 'from-violet-500 to-purple-500' },
              { href: '/admin/support', label: 'View Support Tickets', icon: HelpCircle, gradient: 'from-amber-500 to-orange-500' },
            ].map((action) => {
              const I = action.icon;
              return (
                <Link key={action.label} href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-200">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-md`}>
                    <I className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-fade-in-up animate-delay-300">
          <CardTitle className="flex items-center justify-between mb-4">
            <span>Recent Applications</span>
            <Link href="/admin/admissions" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View All</Link>
          </CardTitle>
          <div className="space-y-2.5">
            {recentApplications.length > 0 ? recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-white/30">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{app.firstName || 'N/A'} {app.lastName || ''}</p>
                  <p className="text-xs text-slate-400">{app.applicationNumber}</p>
                </div>
                <div className="text-right">
                  <Badge status={app.status}>{app.status.replace('_', ' ')}</Badge>
                  <p className="text-xs text-slate-400 mt-0.5">{formatDate(app.createdAt)}</p>
                </div>
              </div>
            )) : <p className="text-slate-400 text-center py-6 text-sm">No applications yet</p>}
          </div>
        </Card>

        <Card className="animate-fade-in-up animate-delay-400">
          <CardTitle className="flex items-center justify-between mb-4">
            <span>Recent Announcements</span>
            <Link href="/admin/announcements" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">View All</Link>
          </CardTitle>
          <div className="space-y-2.5">
            {recentAnnouncements.length > 0 ? recentAnnouncements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-white/30">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-1">{a.content}</p>
                  </div>
                  {a.isPinned && <Badge variant="info">Pinned</Badge>}
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{formatDate(a.createdAt)}</p>
              </div>
            )) : <p className="text-slate-400 text-center py-6 text-sm">No announcements yet</p>}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {(feeStats.overdueCount > 0 || ticketStats.open > 0) && (
        <Card className="!bg-amber-50/60 !border-amber-200/50 animate-fade-in-up animate-delay-400">
          <CardTitle className="text-amber-800 mb-4">Action Required</CardTitle>
          <div className="space-y-2">
            {feeStats.overdueCount > 0 && (
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <span className="text-amber-800 text-sm font-medium">{feeStats.overdueCount} student(s) have overdue fee payments</span>
                <Link href="/admin/fees" className="ml-auto text-sm text-amber-700 underline font-semibold">Review</Link>
              </div>
            )}
            {ticketStats.open > 0 && (
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <span className="text-amber-800 text-sm font-medium">{ticketStats.open} support ticket(s) awaiting response</span>
                <Link href="/admin/support" className="ml-auto text-sm text-amber-700 underline font-semibold">Review</Link>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
