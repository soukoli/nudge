'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  MoreVertical,
  Filter,
  ChevronDown,
  User,
  Home,
  XCircle,
} from 'lucide-react';
import { Badge, Button, Avatar, Card } from '@/components/ui';
import { useIsMobile } from '@/hooks';

export interface CheckItem {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'DISABLED';
  nextDueAt?: string | null;
  lastCompletedAt?: string | null;
  repeatInterval?: string | null;
  repeatValue?: number | null;
  member?: { id: string; name: string } | null;
  asset?: { id: string; name: string } | null;
}

export interface ChecksTableProps {
  checks: CheckItem[];
  onComplete: (checkId: string) => Promise<void>;
  onDisable: (checkId: string) => Promise<void>;
  onEnable: (checkId: string) => Promise<void>;
  onDelete: (checkId: string) => Promise<void>;
  loading?: boolean;
}

type FilterType = 'all' | 'overdue' | 'pending' | 'completed' | 'disabled';
type SortType = 'dueDate' | 'name' | 'status';

const statusConfig = {
  OVERDUE: { 
    icon: AlertCircle, 
    color: 'text-[var(--color-error)]', 
    bgColor: 'bg-[var(--color-error-light)]',
    label: 'Overdue' 
  },
  PENDING: { 
    icon: Clock, 
    color: 'text-[var(--color-warning)]', 
    bgColor: 'bg-[var(--color-warning-light)]',
    label: 'Pending' 
  },
  COMPLETED: { 
    icon: CheckCircle, 
    color: 'text-[var(--color-success)]', 
    bgColor: 'bg-[var(--color-success-light)]',
    label: 'Completed' 
  },
  DISABLED: { 
    icon: XCircle, 
    color: 'text-[var(--color-foreground-muted)]', 
    bgColor: 'bg-[var(--color-surface)]',
    label: 'Disabled' 
  },
};

const categoryLabels: Record<string, string> = {
  HEALTH_CHECKUP: 'Health',
  HEALTH_DENTAL: 'Dental',
  HEALTH_VISION: 'Vision',
  HEALTH_VACCINATION: 'Vaccination',
  DOCUMENTS: 'Documents',
  CLOTHING: 'Clothing',
  EDUCATION: 'Education',
  BILLS: 'Bills',
  SUPPLIES: 'Supplies',
  CLEANING: 'Cleaning',
  CAR_SERVICE: 'Car Service',
  CAR_INSURANCE: 'Car Insurance',
  CAR_INSPECTION: 'Inspection',
  HOME_MAINTENANCE: 'Maintenance',
  HOME_UTILITIES: 'Utilities',
  BIRTHDAY: 'Birthday',
  ANNIVERSARY: 'Anniversary',
  FAMILY_EVENT: 'Event',
  OTHER: 'Other',
};

export function ChecksTable({
  checks,
  onComplete,
  onDisable,
  onEnable,
  onDelete,
  loading = false,
}: ChecksTableProps) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const [loadingCheckId, setLoadingCheckId] = useState<string | null>(null);

  // Calculate actual status based on due date
  const getActualStatus = (check: CheckItem): CheckItem['status'] => {
    if (check.status === 'DISABLED') return 'DISABLED';
    if (check.status === 'COMPLETED' && !check.repeatInterval) return 'COMPLETED';
    if (check.nextDueAt && isPast(new Date(check.nextDueAt))) return 'OVERDUE';
    return check.status;
  };

  // Filter and sort checks
  const filteredChecks = useMemo(() => {
    let result = checks.map(check => ({
      ...check,
      actualStatus: getActualStatus(check),
    }));

    // Apply filter
    if (filter !== 'all') {
      result = result.filter(check => check.actualStatus.toLowerCase() === filter);
    }

    // Sort: overdue first, then pending, then completed, then disabled
    const statusOrder = { OVERDUE: 0, PENDING: 1, COMPLETED: 2, DISABLED: 3 };
    result.sort((a, b) => {
      const statusDiff = statusOrder[a.actualStatus] - statusOrder[b.actualStatus];
      if (statusDiff !== 0) return statusDiff;
      
      // Within same status, sort by due date
      if (a.nextDueAt && b.nextDueAt) {
        return new Date(a.nextDueAt).getTime() - new Date(b.nextDueAt).getTime();
      }
      return 0;
    });

    return result;
  }, [checks, filter]);

  const handleAction = async (
    checkId: string, 
    action: 'complete' | 'disable' | 'enable' | 'delete'
  ) => {
    setLoadingCheckId(checkId);
    try {
      switch (action) {
        case 'complete':
          await onComplete(checkId);
          break;
        case 'disable':
          await onDisable(checkId);
          break;
        case 'enable':
          await onEnable(checkId);
          break;
        case 'delete':
          await onDelete(checkId);
          break;
      }
    } finally {
      setLoadingCheckId(null);
      setExpandedCheckId(null);
    }
  };

  const formatDueDate = (date: string | null | undefined) => {
    if (!date) return 'No due date';
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isPast(d)) return `${formatDistanceToNow(d)} ago`;
    return `in ${formatDistanceToNow(d)}`;
  };

  // Filter counts
  const counts = useMemo(() => {
    const c = { all: checks.length, overdue: 0, pending: 0, completed: 0, disabled: 0 };
    checks.forEach(check => {
      const status = getActualStatus(check).toLowerCase() as Exclude<FilterType, 'all'>;
      c[status]++;
    });
    return c;
  }, [checks]);

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
        {(['all', 'overdue', 'pending', 'completed', 'disabled'] as FilterType[]).map((f) => (
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

      {/* Checks List */}
      {filteredChecks.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-foreground-muted)]">
          <Circle size={48} className="mx-auto mb-4 opacity-30" />
          <p>No checks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredChecks.map((check, index) => {
              const config = statusConfig[check.actualStatus];
              const StatusIcon = config.icon;
              const isExpanded = expandedCheckId === check.id;
              const isLoading = loadingCheckId === check.id;

              return (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card
                    padding="sm"
                    className={`overflow-hidden ${
                      check.actualStatus === 'DISABLED' ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <button
                          onClick={() => check.actualStatus !== 'DISABLED' && handleAction(check.id, 'complete')}
                          disabled={isLoading || check.actualStatus === 'DISABLED'}
                          className={`mt-0.5 ${config.color} hover:scale-110 transition-transform disabled:cursor-not-allowed`}
                        >
                          {isLoading ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <StatusIcon size={20} />
                          )}
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium truncate ${
                                check.actualStatus === 'COMPLETED' ? 'line-through opacity-60' : ''
                              }`}>
                                {check.title}
                              </h4>
                              
                              {/* Meta info */}
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[var(--color-foreground-muted)]">
                                {/* Category */}
                                <Badge variant="default" className="text-xs">
                                  {categoryLabels[check.category] || check.category}
                                </Badge>
                                
                                {/* Due date */}
                                {check.nextDueAt && (
                                  <span className={check.actualStatus === 'OVERDUE' ? 'text-[var(--color-error)]' : ''}>
                                    {formatDueDate(check.nextDueAt)}
                                  </span>
                                )}

                                {/* Assigned to */}
                                {check.member && (
                                  <span className="flex items-center gap-1">
                                    <User size={12} />
                                    {check.member.name}
                                  </span>
                                )}
                                {check.asset && (
                                  <span className="flex items-center gap-1">
                                    <Home size={12} />
                                    {check.asset.name}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <button
                              onClick={() => setExpandedCheckId(isExpanded ? null : check.id)}
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
                              {check.actualStatus !== 'DISABLED' && check.actualStatus !== 'COMPLETED' && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleAction(check.id, 'complete')}
                                  loading={isLoading}
                                >
                                  Mark Complete
                                </Button>
                              )}
                              {check.actualStatus === 'DISABLED' ? (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleAction(check.id, 'enable')}
                                  loading={isLoading}
                                >
                                  Enable
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleAction(check.id, 'disable')}
                                  loading={isLoading}
                                >
                                  Disable
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-[var(--color-error)]"
                                onClick={() => handleAction(check.id, 'delete')}
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
