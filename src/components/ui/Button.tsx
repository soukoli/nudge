'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      loading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'btn';
    
    const variantStyles = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
    };

    const sizeStyles = {
      sm: 'text-sm px-4 py-2',
      md: 'text-sm px-6 py-3',
      lg: 'text-base px-8 py-4',
      icon: 'btn-icon',
    };

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        {...(props as any)}
      >
        {loading ? (
          <motion.span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : 20} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : 20} />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
