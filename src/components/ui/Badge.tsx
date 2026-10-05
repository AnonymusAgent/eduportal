import { cn, getStatusColor } from '@/lib/utils';
import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  status?: string;
  className?: string;
}

export default function Badge({ children, variant, status, className }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-100/80 text-slate-700 border-slate-200/60',
    success: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50/80 text-rose-700 border-rose-200/60',
    info: 'bg-indigo-50/80 text-indigo-700 border-indigo-200/60',
  };

  const colorClass = status ? getStatusColor(status) : variantStyles[variant || 'default'];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm',
        colorClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
