'use client';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'progress-bar-fill-primary',
  success: 'progress-bar-fill-success',
  warning: 'progress-bar-fill-warning',
  error: 'progress-bar-fill-error',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[var(--color-foreground-muted)]">Progress</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-bar-fill ${variantClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
