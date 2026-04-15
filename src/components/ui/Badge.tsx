'use client';

import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent';
  children: React.ReactNode;
}

const variantClasses = {
  default: 'badge-neutral',
  primary: 'badge-accent', // Map primary to accent for consistency
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  accent: 'badge-accent',
};

export function Badge({
  variant = 'default',
  children,
  className = '',
  ...props
}: BadgeProps) {
  return (
    <span className={`badge ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
