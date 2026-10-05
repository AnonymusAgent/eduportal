import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  ariaLabel?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  variant = 'default',
  className,
  ariaLabel,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const variantGradient = {
    default: 'bg-gradient-to-r from-indigo-500 to-cyan-400',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-400',
    danger: 'bg-gradient-to-r from-rose-500 to-pink-400',
  };

  // Auto-select variant based on percentage
  const getAutoVariant = () => {
    if (percentage >= 75) return 'success';
    if (percentage >= 50) return 'warning';
    return 'danger';
  };

  const actualVariant = variant === 'default' ? getAutoVariant() : variant;

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-slate-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full overflow-hidden bg-slate-200/60',
          sizeStyles[size],
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || `Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantGradient[actualVariant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
