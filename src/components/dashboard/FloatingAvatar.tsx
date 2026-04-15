'use client';

import { motion } from 'framer-motion';
import { Avatar } from '@/components/ui';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

export interface FloatingAvatarProps {
  id: string;
  name: string;
  avatar?: string | null;
  role?: string;
  status?: 'good' | 'warning' | 'overdue';
  position: { x: number; y: number };
  onSelect?: (id: string) => void;
  onQuickAction?: (id: string, action: 'call' | 'message' | 'schedule') => void;
}

const statusClasses = {
  good: 'status-good',
  warning: 'status-warning',
  overdue: 'status-overdue',
};

export function FloatingAvatar({
  id,
  name,
  avatar,
  status = 'good',
  position,
  onSelect,
  onQuickAction,
}: FloatingAvatarProps) {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      className="floating-avatar group"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      whileHover={{ scale: 1.1 }}
      onClick={() => onSelect?.(id)}
    >
      {/* Avatar with status ring */}
      <div className={`floating-avatar-image ${statusClasses[status]}`}>
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xl font-semibold text-[var(--color-primary)]">
            {initials}
          </span>
        )}
      </div>

      {/* Name label */}
      <motion.div
        className="floating-avatar-label"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {name}
      </motion.div>

      {/* Quick actions on hover */}
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      >
        <motion.button
          className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction?.(id, 'call');
          }}
        >
          <Phone size={14} />
        </motion.button>
        <motion.button
          className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction?.(id, 'message');
          }}
        >
          <MessageCircle size={14} />
        </motion.button>
        <motion.button
          className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction?.(id, 'schedule');
          }}
        >
          <Calendar size={14} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
