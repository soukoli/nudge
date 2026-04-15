'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, isToday, format } from 'date-fns';
import {
  CheckCircle,
  Circle,
  MoreVertical,
  User,
  Home,
  Heart,
  Phone,
  HandHeart,
  Sparkles,
  PawPrint,
  CreditCard,
  PartyPopper,
  Camera,
  Activity,
  Pause,
  Play,
} from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';
import { useIsMobile } from '@/hooks';
import type { Nudge } from '@/hooks';

export interface NudgesListProps {
  nudges: Nudge[];
  onComplete: (nudgeId: string, note?: string) => Promise<void>;
  onDisable: (nudgeId: string) => Promise<void>;
  onEnable: (nudgeId: string) => Promise<void>;
  onDelete: (nudgeId: string) => Promise<void>;
  loading?: boolean;
  showVisibility?: boolean;
}

type FilterType = 'all' | 'active' | 'done' | 'paused';

const categoryConfig: Record<string, { icon: typeof Heart; color: string; label: string }> = {
  QUALITY_TIME: { icon: Heart, color: 'text-pink-500', label: 'Quality Time' },
  CALL: { icon: Phone, color: 'text-blue-500', label: 'Call' },
  CHECK_IN: { icon: HandHeart, color: 'text-purple-500', label: 'Check In' },
  APPRECIATION: { icon: Sparkles, color: 'text-amber-500', label: 'Appreciation' },
  HEALTH: { icon: Activity, color: 'text-green-500', label: 'Health' },
  SELF_CARE: { icon: Sparkles, color: 'text-teal-500', label: 'Self Care' },
  PET_CARE: { icon: PawPrint, color: 'text-orange-500', label: 'Pet Care' },
  HOME: { icon: Home, color: 'text-indigo-500', label: 'Home' },
  BILLS: { icon: CreditCard, color: 'text-slate-500', label: 'Bills' },
  CELEBRATION: { icon: PartyPopper, color: 'text-yellow-500', label: 'Celebration' },
  MEMORY: { icon: Camera, color: 'text-rose-500', label: 'Memory' },
};

const frequencyLabels: Record<string, string> = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  CUSTOM: 'Custom',
  ONCE: 'One-time',
};

export function NudgesList({
  nudges,
  onComplete,
  onDisable,
  onEnable,
  onDelete,
  loading = false,
  showVisibility = false,
}: NudgesListProps) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Determine if a nudge was done today
  const isDoneToday = (nudge: Nudge) => {
    if (!nudge.lastDoneAt) return false;
    return isToday(new Date(nudge.lastDoneAt));
  };

  // Filter nudges
  const filteredNudges = useMemo(() => {
    let result = [...nudges];

    switch (filter) {
      case 'active':
        result = result.filter(n => n.isActive && !isDoneToday(n));
        break;
      case 'done':
        result = result.filter(n => isDoneToday(n));
        break;
      case 'paused':
        result = result.filter(n => !n.isActive);
        break;
    }

    // Sort: active first, then by last done
    result.sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      if (isDoneToday(a) !== isDoneToday(b)) return isDoneToday(a) ? 1 : -1;
      return 0;
    });

    return result;
  }, [nudges, filter]);

  const handleAction = async (
    nudgeId: string,
    action: 'complete' | 'disable' | 'enable' | 'delete'
  ) => {
    setLoadingId(nudgeId);
    try {
      switch (action) {
        case 'complete':
          await onComplete(nudgeId);
          break;
        case 'disable':
          await onDisable(nudgeId);
          break;
        case 'enable':
          await onEnable(nudgeId);
          break;
        case 'delete':
          await onDelete(nudgeId);
          break;
      }
    } finally {
      setLoadingId(null);
      setExpandedId(null);
    }
  };

  // Filter counts
  const counts = useMemo(() => {
    return {
      all: nudges.length,
      active: nudges.filter(n => n.isActive && !isDoneToday(n)).length,
      done: nudges.filter(n => isDoneToday(n)).length,
      paused: nudges.filter(n => !n.isActive).length,
    };
  }, [nudges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'done', 'paused'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 opacity-70">({counts[f]})</span>
          </button>
        ))}
      </div>

      {/* Nudges List */}
      {filteredNudges.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-foreground-muted)]">
          <Heart size={48} className="mx-auto mb-4 opacity-30" />
          <p>No nudges yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredNudges.map((nudge, index) => {
              const config = categoryConfig[nudge.category] || categoryConfig.CHECK_IN;
              const CategoryIcon = config.icon;
              const isExpanded = expandedId === nudge.id;
              const isLoading = loadingId === nudge.id;
              const doneToday = isDoneToday(nudge);

              return (
                <motion.div
                  key={nudge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    padding="sm"
                    className={`overflow-hidden ${
                      !nudge.isActive ? 'opacity-60' : ''
                    } ${doneToday ? 'border-[var(--color-success)]/30' : ''}`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Completion button */}
                        <button
                          onClick={() => nudge.isActive && !doneToday && handleAction(nudge.id, 'complete')}
                          disabled={isLoading || !nudge.isActive || doneToday}
                          className={`mt-0.5 transition-all ${
                            doneToday 
                              ? 'text-[var(--color-success)]' 
                              : nudge.isActive 
                                ? 'text-[var(--color-foreground-muted)] hover:text-[var(--color-success)] hover:scale-110' 
                                : 'text-[var(--color-foreground-muted)]'
                          } disabled:cursor-not-allowed`}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : doneToday ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${
                                doneToday ? 'line-through opacity-60' : ''
                              }`}>
                                <span className="mr-2">{nudge.emoji}</span>
                                {nudge.title}
                              </h4>

                              {/* Meta info */}
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--color-foreground-muted)]">
                                {/* Category */}
                                <Badge variant="default" className={`text-xs ${config.color}`}>
                                  <CategoryIcon size={12} className="mr-1" />
                                  {config.label}
                                </Badge>

                                {/* Frequency */}
                                <span className="text-xs">
                                  {frequencyLabels[nudge.frequency] || nudge.frequency}
                                </span>

                                {/* Visibility */}
                                {showVisibility && (
                                  <Badge 
                                    variant={nudge.visibility === 'SHARED' ? 'accent' : 'default'} 
                                    className="text-xs"
                                  >
                                    {nudge.visibility === 'SHARED' ? 'Everyone' : 'Personal'}
                                  </Badge>
                                )}

                                {/* Related member/asset */}
                                {nudge.member && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <User size={12} />
                                    {nudge.member.name}
                                  </span>
                                )}
                                {nudge.asset && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <Home size={12} />
                                    {nudge.asset.name}
                                  </span>
                                )}

                                {/* Last done */}
                                {nudge.lastDoneAt && (
                                  <span className="text-xs opacity-70">
                                    Last: {doneToday ? 'Today' : formatDistanceToNow(new Date(nudge.lastDoneAt), { addSuffix: true })}
                                  </span>
                                )}
                              </div>

                              {/* Description */}
                              {nudge.description && (
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-2 line-clamp-2">
                                  {nudge.description}
                                </p>
                              )}
                            </div>

                            {/* Actions toggle */}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : nudge.id)}
                              className="p-1 rounded hover:bg-[var(--color-surface)] transition-colors"
                            >
                              <MoreVertical size={18} className="text-[var(--color-foreground-muted)]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Actions */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                              {nudge.isActive && !doneToday && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleAction(nudge.id, 'complete')}
                                  loading={isLoading}
                                >
                                  Done!
                                </Button>
                              )}
                              {nudge.isActive ? (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  icon={Pause}
                                  onClick={() => handleAction(nudge.id, 'disable')}
                                  loading={isLoading}
                                >
                                  Pause
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  icon={Play}
                                  onClick={() => handleAction(nudge.id, 'enable')}
                                  loading={isLoading}
                                >
                                  Resume
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[var(--color-error)]"
                                onClick={() => handleAction(nudge.id, 'delete')}
                                loading={isLoading}
                              >
                                Delete
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
