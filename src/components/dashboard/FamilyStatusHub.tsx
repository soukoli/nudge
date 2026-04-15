'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Sun, Coffee } from 'lucide-react';

export interface FamilyStatusHubProps {
  familyName: string;
  overallStatus: 'excellent' | 'good' | 'needsAttention';
  todayNudges?: string[];
}

const statusConfig = {
  excellent: {
    className: 'excellent',
    color: 'var(--color-success)',
    message: 'All is well',
    Icon: Heart,
  },
  good: {
    className: 'good',
    color: 'var(--color-warning)',
    message: 'Stay connected',
    Icon: Sun,
  },
  needsAttention: {
    className: 'needs-attention',
    color: 'var(--color-error)',
    message: 'Reach out today',
    Icon: Coffee,
  },
};

export function FamilyStatusHub({
  familyName,
  overallStatus,
  todayNudges = [],
}: FamilyStatusHubProps) {
  const { className, color, message, Icon } = statusConfig[overallStatus];

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
          src="/images/logo.png"
          alt="Nudge"
          width={48}
          height={48}
          className="mb-1"
        />
        
        {/* Status icon */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Icon size={24} style={{ color }} />
        </motion.div>
        
        {/* Gentle message */}
        <motion.div 
          className="text-sm text-[var(--color-foreground-muted)] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
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
        {todayNudges.length > 0 && (
          <p className="text-sm text-[var(--color-foreground-muted)]">
            {todayNudges.length} gentle {todayNudges.length === 1 ? 'reminder' : 'reminders'} today
          </p>
        )}
      </motion.div>
    </div>
  );
}
