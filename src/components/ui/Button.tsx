'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:brightness-110 focus:ring-indigo-400',
      secondary:
        'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20 hover:shadow-lg hover:brightness-110 focus:ring-violet-400',
      outline:
        'border border-indigo-300/60 text-indigo-700 glass hover:bg-indigo-50/50 focus:ring-indigo-400',
      ghost:
        'text-slate-700 hover:bg-white/50 focus:ring-indigo-400',
      danger:
        'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25 hover:shadow-lg hover:brightness-110 focus:ring-rose-400',
    };

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
