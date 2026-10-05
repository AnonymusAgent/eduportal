import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0%';
  return `${Math.round(value)}%`;
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${year}-${random}`;
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

export function generateRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REQ-${timestamp}-${random}`;
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const f = firstName?.charAt(0)?.toUpperCase() || '';
  const l = lastName?.charAt(0)?.toUpperCase() || '';
  return f + l || '??';
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Application statuses
    draft: 'bg-slate-100/80 text-slate-600 border-slate-200/60',
    submitted: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
    under_review: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    documents_verified: 'bg-violet-50/80 text-violet-700 border-violet-200/60',
    accepted: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    rejected: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    waitlisted: 'bg-orange-50/80 text-orange-700 border-orange-200/60',
    // Payment statuses
    pending: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    paid: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    partially_paid: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
    overdue: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    // Ticket statuses
    open: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
    in_progress: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    resolved: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    closed: 'bg-slate-100/80 text-slate-600 border-slate-200/60',
    // Attendance statuses
    present: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    absent: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    late: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    excused: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
    // Result statuses
    pass: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    fail: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    incomplete: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    withheld: 'bg-orange-50/80 text-orange-700 border-orange-200/60',
    // Enrollment status
    active: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    suspended: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    graduated: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
    withdrawn: 'bg-slate-100/80 text-slate-600 border-slate-200/60',
  };
  return statusColors[status.toLowerCase()] || 'bg-slate-100/80 text-slate-600 border-slate-200/60';
}

export function calculateAge(dateOfBirth: Date | string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function getDaysUntil(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  const diffTime = d.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const GRADE_SCALE: Record<string, { min: number; max: number; points: number }> = {
  'A+': { min: 90, max: 100, points: 4.0 },
  'A': { min: 85, max: 89, points: 4.0 },
  'A-': { min: 80, max: 84, points: 3.7 },
  'B+': { min: 75, max: 79, points: 3.3 },
  'B': { min: 70, max: 74, points: 3.0 },
  'B-': { min: 65, max: 69, points: 2.7 },
  'C+': { min: 60, max: 64, points: 2.3 },
  'C': { min: 55, max: 59, points: 2.0 },
  'C-': { min: 50, max: 54, points: 1.7 },
  'D': { min: 45, max: 49, points: 1.0 },
  'F': { min: 0, max: 44, points: 0.0 },
};

export function getGradeFromMarks(marks: number): string {
  for (const [grade, range] of Object.entries(GRADE_SCALE)) {
    if (marks >= range.min && marks <= range.max) {
      return grade;
    }
  }
  return 'F';
}

export function getGradePoints(grade: string): number {
  return GRADE_SCALE[grade]?.points || 0;
}
