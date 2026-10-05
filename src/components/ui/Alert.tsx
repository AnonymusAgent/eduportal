import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export default function Alert({ children, variant = 'info', title, onDismiss, className }: AlertProps) {
  const styles = {
    info:    { bg: 'bg-indigo-50/70 border-indigo-200/60 text-indigo-800', icon: <Info className="w-5 h-5 text-indigo-500" aria-hidden="true" /> },
    success: { bg: 'bg-emerald-50/70 border-emerald-200/60 text-emerald-800', icon: <CheckCircle className="w-5 h-5 text-emerald-500" aria-hidden="true" /> },
    warning: { bg: 'bg-amber-50/70 border-amber-200/60 text-amber-800', icon: <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" /> },
    error:   { bg: 'bg-rose-50/70 border-rose-200/60 text-rose-800', icon: <AlertCircle className="w-5 h-5 text-rose-500" aria-hidden="true" /> },
  };
  return (
    <div role="alert" className={cn('flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-sm', styles[variant].bg, className)}>
      <div className="flex-shrink-0">{styles[variant].icon}</div>
      <div className="flex-1">
        {title && <h4 className="font-bold mb-0.5">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors" aria-label="Dismiss">
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
