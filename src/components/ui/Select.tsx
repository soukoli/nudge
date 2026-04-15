'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name || Math.random().toString(36).slice(2);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`input appearance-none pr-10 cursor-pointer ${
              error ? 'border-[var(--color-error)]' : ''
            } ${className}`}
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
          <ChevronDown
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
