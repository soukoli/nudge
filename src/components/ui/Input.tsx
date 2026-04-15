'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      iconPosition = 'left',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || Math.random().toString(36).slice(2);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <Icon
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none"
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={`input ${Icon && iconPosition === 'left' ? 'input-with-icon-left' : ''} ${
              Icon && iconPosition === 'right' ? 'input-with-icon-right' : ''
            } ${error ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-none' : ''} ${className}`}
            {...props}
          />
          {Icon && iconPosition === 'right' && (
            <Icon
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)] pointer-events-none"
            />
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
