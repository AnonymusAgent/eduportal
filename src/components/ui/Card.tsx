import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export default function Card({
  children,
  className,
  padding = 'md',
  glass = true,
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-shadow duration-300',
        glass
          ? 'glass-strong hover:shadow-lg hover:shadow-indigo-500/5'
          : 'bg-white border border-gray-200 shadow-sm',
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-b border-white/30 pb-4 mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  as: Component = 'h3',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}) {
  return (
    <Component
      className={cn('text-lg font-semibold text-slate-900', className)}
    >
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)}>{children}</p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('', className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border-t border-white/30 pt-4 mt-4', className)}>
      {children}
    </div>
  );
}
