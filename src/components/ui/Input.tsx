'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-rose-400 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl transition-all duration-200',
            'bg-white/60 backdrop-blur-sm border',
            'focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400',
            'placeholder:text-slate-400',
            'disabled:bg-slate-100/70 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 focus:ring-rose-400/50 focus:border-rose-400'
              : 'border-slate-200/80',
            className,
          )}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-rose-500"
            role="alert"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
