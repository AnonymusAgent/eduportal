import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface TableProps { children: ReactNode; className?: string; ariaLabel?: string; }

export default function Table({ children, className, ariaLabel }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl">
      <table className={cn('w-full border-collapse', className)} aria-label={ariaLabel}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn('bg-white/40 border-b border-white/30', className)}>{children}</thead>;
}
export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn('divide-y divide-white/20', className)}>{children}</tbody>;
}
export function TableRow({ children, className, isClickable = false }: { children: ReactNode; className?: string; isClickable?: boolean }) {
  return <tr className={cn('bg-white/20', isClickable && 'hover:bg-indigo-50/30 cursor-pointer transition-colors', className)}>{children}</tr>;
}
export function TableHead({ children, className, scope = 'col' }: { children: ReactNode; className?: string; scope?: 'col' | 'row' }) {
  return <th scope={scope} className={cn('px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider', className)}>{children}</th>;
}
export function TableCell({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 text-sm text-slate-700 whitespace-nowrap', className)}>{children}</td>;
}

export function MobileTableCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('glass-strong rounded-2xl p-4 mb-3 md:hidden', className)}>{children}</div>;
}
export function MobileTableRow({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return <div className={cn('flex justify-between py-1', className)}>
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-sm text-slate-800 font-semibold">{value}</span>
  </div>;
}
