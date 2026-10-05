import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-14 px-4 text-center', className)}>
      <div className="w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center">
        {icon || <Inbox className="w-8 h-8 text-indigo-400" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-bold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-400 max-w-sm mb-4">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
