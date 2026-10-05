'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, User, TrendingUp, BookOpen, Calendar, ClipboardCheck,
  FileText, Award, CreditCard, Receipt, FolderOpen, Bell,
  HelpCircle, Settings, LogOut, Menu, X, GraduationCap,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/lib/auth';
import Avatar from '../ui/Avatar';

interface PortalSidebarProps { user: SessionUser }

const studentNavItems = [
  { label: 'Dashboard', href: '/portal', icon: Home },
  { label: 'My Profile', href: '/portal/profile', icon: User },
  { label: 'Academic Progress', href: '/portal/progress', icon: TrendingUp },
  { label: 'Courses', href: '/portal/courses', icon: BookOpen },
  { label: 'Timetable', href: '/portal/timetable', icon: Calendar },
  { label: 'Attendance', href: '/portal/attendance', icon: ClipboardCheck },
  { label: 'Examinations', href: '/portal/exams', icon: FileText },
  { label: 'Results', href: '/portal/results', icon: Award },
  { label: 'Fees', href: '/portal/fees', icon: CreditCard },
  { label: 'Receipts', href: '/portal/receipts', icon: Receipt },
  { label: 'Documents', href: '/portal/documents', icon: FolderOpen },
  { label: 'Notifications', href: '/portal/notifications', icon: Bell },
  { label: 'Support', href: '/portal/support', icon: HelpCircle },
  { label: 'Settings', href: '/portal/settings', icon: Settings },
];

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: Home },
  { label: 'Students', href: '/admin/students', icon: User },
  { label: 'Admissions', href: '/admin/admissions', icon: FileText },
  { label: 'Departments', href: '/admin/departments', icon: BookOpen },
  { label: 'Programs', href: '/admin/programs', icon: GraduationCap },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Fees', href: '/admin/fees', icon: CreditCard },
  { label: 'Examinations', href: '/admin/exams', icon: FileText },
  { label: 'Results', href: '/admin/results', icon: Award },
  { label: 'Attendance', href: '/admin/attendance', icon: ClipboardCheck },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell },
  { label: 'Support Tickets', href: '/admin/support', icon: HelpCircle },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function PortalSidebar({ user }: PortalSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdminUser = user.role !== 'student';
  const navItems = isAdminUser ? adminNavItems : studentNavItems;
  const basePath = isAdminUser ? '/admin' : '/portal';

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass-strong rounded-xl shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-expanded={isMobileOpen}
        aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-slate-700" aria-hidden="true" />
        ) : (
          <Menu className="w-5 h-5 text-slate-700" aria-hidden="true" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full transition-all duration-300',
          'glass-strong border-r border-white/30',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
            <Link
              href={basePath}
              className={cn('flex items-center gap-2.5', isCollapsed && 'justify-center')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/25 flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              {!isCollapsed && (
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  EduPortal
                </span>
              )}
            </Link>
            <button
              type="button"
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-indigo-50/50 transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-500" aria-hidden="true" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-500" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* User info */}
          <div className={cn('p-4 border-b border-white/20', isCollapsed && 'flex justify-center')}>
            <div className={cn('flex items-center gap-3', isCollapsed && 'flex-col')}>
              <Avatar
                firstName={user.firstName}
                lastName={user.lastName}
                src={user.photoUrl}
                size={isCollapsed ? 'md' : 'lg'}
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.studentId || user.staffId || user.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3">
            <ul className="space-y-0.5 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-700 shadow-sm'
                          : 'text-slate-600 hover:bg-indigo-50/40 hover:text-indigo-600',
                        isCollapsed && 'justify-center px-2',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px] flex-shrink-0',
                          isActive ? 'text-indigo-500' : '',
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50/50 transition-all duration-200',
                  isCollapsed && 'justify-center px-2',
                )}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-[18px] h-[18px] flex-shrink-0" aria-hidden="true" />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
