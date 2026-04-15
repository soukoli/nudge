'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Share2, UserPlus, Home as HomeIcon, Heart } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { FamilyCanvas, FamilyMemberNode } from '@/components/dashboard';
import { Button, Modal, Input } from '@/components/ui';
import { AddMemberModal, AddAssetModal, ShareModal } from '@/components/modals';
import { useFamily, useMembers, useAssets, useNudges, getFamilyId, setFamilyId } from '@/hooks';
import type { CreateMemberInput, CreateAssetInput } from '@/lib/types';

type AddModalType = 'member' | 'asset' | 'menu' | null;

export default function DashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  
  // Data hooks
  const { family, loading: familyLoading, createFamily, fetchFamily } = useFamily();
  const { members, addMember } = useMembers(family?.id);
  const { assets, addAsset } = useAssets(family?.id);
  const { nudges, sharedNudges, todayNudges } = useNudges(family?.id);

  // Modal states
  const [addModalType, setAddModalType] = useState<AddModalType>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreateFamilyOpen, setIsCreateFamilyOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Check if we need to create a family
  useEffect(() => {
    if (!familyLoading && !family && !getFamilyId()) {
      setIsCreateFamilyOpen(true);
    }
  }, [familyLoading, family]);

  // Transform members to FamilyMemberNode format
  const memberNodes: FamilyMemberNode[] = useMemo(() => {
    return members.map(member => {
      // Calculate member status based on their nudges
      const memberNudges = nudges.filter(n => n.memberId === member.id && n.isActive);
      const completedToday = memberNudges.filter(n => {
        if (!n.lastDoneAt) return false;
        const today = new Date();
        const lastDone = new Date(n.lastDoneAt);
        return lastDone.toDateString() === today.toDateString();
      }).length;
      
      // Status based on completion rate
      const completionRate = memberNudges.length > 0 ? completedToday / memberNudges.length : 1;
      let status: 'good' | 'warning' | 'overdue' = 'good';
      if (completionRate < 0.3) status = 'overdue';
      else if (completionRate < 0.7) status = 'warning';

      return {
        id: member.id,
        name: member.nickname || member.name,
        avatar: member.avatarUrl,
        role: member.memberType,
        status,
        radius: 40,
      };
    });
  }, [members, nudges]);

  // Calculate family status - gentle, no scores
  const familyStatus = useMemo(() => {
    // Just determine general "vibe" - no percentages
    const hasOverdueNudges = todayNudges.length > 3;
    const hasSomeNudges = todayNudges.length > 0;
    
    let overallStatus: 'excellent' | 'good' | 'needsAttention' = 'excellent';
    if (hasOverdueNudges) overallStatus = 'needsAttention';
    else if (hasSomeNudges) overallStatus = 'good';

    return {
      overallStatus,
    };
  }, [todayNudges]);

  // Handlers
  const handleCreateFamily = async () => {
    if (!newFamilyName.trim()) return;
    
    setIsCreating(true);
    try {
      const newFamily = await createFamily(newFamilyName.trim());
      if (newFamily) {
        setIsCreateFamilyOpen(false);
        setNewFamilyName('');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMember = async (data: CreateMemberInput) => {
    await addMember(data);
    setAddModalType(null);
  };

  const handleAddAsset = async (data: CreateAssetInput) => {
    await addAsset(data);
    setAddModalType(null);
  };

  const handleMemberSelect = (id: string) => {
    router.push(`/members/${id}`);
  };

  const handleQuickAction = (memberId: string, action: 'call' | 'message' | 'schedule') => {
    // TODO: Implement quick actions
    console.log('Quick action:', action, 'for member:', memberId);
  };

  // Loading state
  if (familyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--color-foreground-muted)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppShell
        familyName={family?.name || 'My Family'}
        userName="User"
        onAddNew={() => setAddModalType('menu')}
      >
        <FamilyCanvas
          members={memberNodes}
          familyName={family?.name || 'My Family'}
          familyStatus={familyStatus}
          todayNudges={todayNudges.map(n => n.title)}
          onMemberSelect={handleMemberSelect}
          onQuickAction={handleQuickAction}
        />

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg"
            onClick={() => setIsShareModalOpen(true)}
            title="Share family"
          >
            <Share2 size={20} />
          </Button>
        </div>
      </AppShell>

      {/* Create Family Modal */}
      <Modal
        isOpen={isCreateFamilyOpen}
        onClose={() => {}}
        title="Welcome to Nudge"
        size="sm"
        footer={
          <Button 
            onClick={handleCreateFamily} 
            loading={isCreating}
            className="w-full"
          >
            Create Family
          </Button>
        }
      >
        <div className="space-y-4 text-center">
          <p className="text-[var(--color-foreground-muted)]">
            Let's start by creating your family. You can add members afterwards.
          </p>
          <Input
            label="Family Name"
            placeholder="e.g., The Smiths, Our Family..."
            value={newFamilyName}
            onChange={(e) => setNewFamilyName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFamily()}
          />
        </div>
      </Modal>

      {/* Add Menu Modal */}
      <Modal
        isOpen={addModalType === 'menu'}
        onClose={() => setAddModalType(null)}
        title="What would you like to add?"
        size="sm"
      >
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => setAddModalType('member')}
            className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
              <UserPlus size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="font-medium">Family Member</div>
              <div className="text-sm text-[var(--color-foreground-muted)]">Add a person or pet to your family</div>
            </div>
          </button>
          <button
            onClick={() => setAddModalType('asset')}
            className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
              <HomeIcon size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="font-medium">Asset</div>
              <div className="text-sm text-[var(--color-foreground-muted)]">Add a car, house, or other property</div>
            </div>
          </button>
          <button
            onClick={() => router.push('/nudges')}
            className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
              <Heart size={24} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="font-medium">Nudge</div>
              <div className="text-sm text-[var(--color-foreground-muted)]">Create a gentle reminder for your family</div>
            </div>
          </button>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addModalType === 'member'}
        onClose={() => setAddModalType(null)}
        onSubmit={handleAddMember}
        familyId={family?.id || ''}
      />

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={addModalType === 'asset'}
        onClose={() => setAddModalType(null)}
        onSubmit={handleAddAsset}
        familyId={family?.id || ''}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareCode={family?.shareCode || ''}
        familyName={family?.name || 'My Family'}
      />
    </>
  );
}
