'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForceLayout, ForceNode } from '@/hooks/useForceLayout';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { FloatingAvatar, FloatingAvatarProps } from './FloatingAvatar';
import { FamilyStatusHub, FamilyStatusHubProps } from './FamilyStatusHub';

export interface FamilyMemberNode extends ForceNode {
  name: string;
  avatar?: string | null;
  role?: string;
  status: 'good' | 'warning' | 'overdue';
}

export interface FamilyCanvasProps {
  members: FamilyMemberNode[];
  familyStatus: Omit<FamilyStatusHubProps, 'familyName'>;
  familyName: string;
  todayNudges?: string[];
  onMemberSelect?: (id: string) => void;
  onQuickAction?: (memberId: string, action: 'call' | 'message' | 'schedule') => void;
}

export function FamilyCanvas({
  members,
  familyStatus,
  familyName,
  todayNudges = [],
  onMemberSelect,
  onQuickAction,
}: FamilyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prepare nodes with proper radius
  const nodes: FamilyMemberNode[] = members.map((member) => ({
    ...member,
    radius: 40, // Avatar radius
  }));

  const { positions } = useForceLayout(nodes, {
    width: dimensions.width,
    height: dimensions.height,
    centerRadius: 80,
    nodeRadius: 40,
    padding: 30,
  });

  // Mobile: Show list view instead of canvas
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {/* Status Card */}
        <motion.div
          className="glass-card p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-semibold mb-2">{familyName}</h2>
          <div className="text-lg text-[var(--color-foreground-muted)] mb-2">
            {todayNudges.length > 0 
              ? `${todayNudges.length} gentle ${todayNudges.length === 1 ? 'reminder' : 'reminders'} today`
              : 'All is well today'
            }
          </div>
        </motion.div>

        {/* Members List */}
        <div className="flex flex-col gap-3">
          {members.map((member, index) => (
            <motion.button
              key={member.id}
              className="glass-card-sm p-4 flex items-center gap-4 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onMemberSelect?.(member.id)}
            >
              <div
                className={`w-12 h-12 rounded-full overflow-hidden border-3 ${
                  member.status === 'good'
                    ? 'border-[var(--color-success)]'
                    : member.status === 'warning'
                    ? 'border-[var(--color-warning)]'
                    : 'border-[var(--color-error)]'
                }`}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] font-semibold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">{member.name}</div>
                {member.role && (
                  <div className="text-sm text-[var(--color-foreground-muted)]">
                    {member.role}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Show floating canvas
  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-var(--header-height)-64px)] min-h-[500px]"
    >
      {/* Central Status Hub */}
      <FamilyStatusHub
        familyName={familyName}
        overallStatus={familyStatus.overallStatus}
        todayNudges={todayNudges}
      />

      {/* Floating Avatars */}
      {members.map((member) => {
        const pos = positions.get(member.id);
        if (!pos) return null;

        return (
          <FloatingAvatar
            key={member.id}
            id={member.id}
            name={member.name}
            avatar={member.avatar}
            role={member.role}
            status={member.status}
            position={pos}
            onSelect={onMemberSelect}
            onQuickAction={onQuickAction}
          />
        );
      })}

      {/* Empty state */}
      {members.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <p className="text-lg text-[var(--color-foreground-muted)] mb-4">
              No family members yet
            </p>
            <p className="text-sm text-[var(--color-foreground-muted)]">
              Add your first family member to get started
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
