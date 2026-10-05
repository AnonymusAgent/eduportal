'use client';

import { cn } from '@/lib/utils';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, id, required, options, placeholder, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-400 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-required={required}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl transition-all duration-200 appearance-none',
            'bg-white/60 backdrop-blur-sm border',
            'focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400',
            'disabled:bg-slate-100/70 disabled:cursor-not-allowed',
            error
              ? 'border-rose-400 focus:ring-rose-400/50 focus:border-rose-400'
              : 'border-slate-200/80',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${selectId}-error`} className="mt-1.5 text-sm text-rose-500" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-slate-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

export default Select;
