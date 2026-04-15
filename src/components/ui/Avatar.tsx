'use client';

import { HTMLAttributes } from 'react';
import Image from 'next/image';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallback?: string;
  status?: 'good' | 'warning' | 'overdue';
}

const sizeClasses = {
  xs: 'avatar-xs',
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
  '2xl': 'avatar-2xl',
};

const sizePx = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 72,
  '2xl': 96,
};

const statusClasses = {
  good: 'avatar-ring-success',
  warning: 'avatar-ring-warning',
  overdue: 'avatar-ring-error',
};

export function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  status,
  className = '',
  ...props
}: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const avatarElement = (
    <div className={`avatar ${sizeClasses[size]} ${className}`} {...props}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={sizePx[size]}
          height={sizePx[size]}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );

  // Wrap with status ring if status is provided
  if (status) {
    return (
      <div className={`avatar-ring ${statusClasses[status]}`}>
        {avatarElement}
      </div>
    );
  }

  return avatarElement;
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ children, max = 4, size = 'sm' }: AvatarGroupProps) {
  const childrenArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleChildren}
      {remainingCount > 0 && (
        <div
          className={`avatar ${sizeClasses[size]} border-2 border-[var(--color-bg)] bg-[var(--color-accent-muted)] text-[var(--color-accent)] text-xs font-medium`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
