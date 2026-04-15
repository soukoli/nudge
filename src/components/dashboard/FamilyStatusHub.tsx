'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface FamilyStatusHubProps {
  familyName: string;
  overallStatus: 'excellent' | 'good' | 'needsAttention';
  completedChecks: number;
  totalChecks: number;
  trend?: 'up' | 'down' | 'stable';
}

const statusConfig = {
  excellent: {
    className: 'excellent',
    color: 'var(--color-success)',
    label: 'Excellent',
  },
  good: {
    className: 'good',
    color: 'var(--color-warning)',
    label: 'Good',
  },
  needsAttention: {
    className: 'needs-attention',
    color: 'var(--color-error)',
    label: 'Needs Attention',
  },
};

const TrendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function FamilyStatusHub({
  familyName,
  overallStatus,
  completedChecks,
  totalChecks,
  trend = 'stable',
}: FamilyStatusHubProps) {
  const { className, color, label } = statusConfig[overallStatus];
  const percentage = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;
  const Icon = TrendIcon[trend];

  return (
    <div className="status-hub">
      <motion.div
        className={`status-hub-circle ${className} animate-breathe`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Logo */}
        <Image
          src="/logo.png"
          alt="Keep Close"
          width={48}
          height={48}
          className="mb-1"
        />
        
        {/* Percentage */}
        <motion.div 
          className="text-3xl font-bold" 
          style={{ color }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {percentage}%
        </motion.div>
        
        {/* Status label */}
        <motion.div 
          className="flex items-center gap-1 text-sm text-[var(--color-foreground-muted)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Icon size={14} style={{ color }} />
          <span>{label}</span>
        </motion.div>
      </motion.div>

      {/* Family name below hub */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-1">{familyName}</h2>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          {completedChecks} of {totalChecks} checks completed
        </p>
      </motion.div>
    </div>
  );
}
