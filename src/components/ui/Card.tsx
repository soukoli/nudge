'use client';

import { ReactNode, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'small' | 'highlight';
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  variant = 'default',
  children,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const variantClasses = {
    default: 'glass-card',
    interactive: 'glass-card-interactive',
    small: 'glass-card-sm',
    highlight: 'card-highlight',
  };

  const Component = variant === 'interactive' ? motion.div : 'div';
  const motionProps = variant === 'interactive' ? { whileHover: { y: -4 } } : {};

  return (
    <Component
      className={`${variantClasses[variant]} ${paddingStyles[padding]} ${className}`}
      {...motionProps}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-[var(--color-foreground)] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-[var(--color-foreground-muted)] ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 mt-4 pt-4 border-t border-[var(--color-border)] ${className}`}>
      {children}
    </div>
  );
}
