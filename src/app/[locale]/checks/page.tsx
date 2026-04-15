'use client';

import { useState } from 'react';
import { Plus, Heart } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Button } from '@/components/ui';
import { NudgesList } from '@/components/nudges';
import { AddNudgeModal } from '@/components/modals';
import { useFamily, useMembers, useAssets, useNudges } from '@/hooks';
import type { CreateNudgeInput } from '@/lib/types';

export default function NudgesPage() {
  const { family, loading: familyLoading } = useFamily();
  const { members } = useMembers(family?.id);
  const { assets } = useAssets(family?.id);
  const { 
    nudges, 
    loading: nudgesLoading, 
    addNudge, 
    completeNudge, 
    updateNudge, 
    deleteNudge 
  } = useNudges(family?.id);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddNudge = async (data: CreateNudgeInput) => {
    await addNudge(data);
    setIsAddModalOpen(false);
  };

  const handleDisable = async (nudgeId: string) => {
    await updateNudge(nudgeId, { isActive: false });
  };

  const handleEnable = async (nudgeId: string) => {
    await updateNudge(nudgeId, { isActive: true });
  };

  const loading = familyLoading || nudgesLoading;

  return (
    <AppShell familyName={family?.name} onAddNew={() => setIsAddModalOpen(true)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="text-[var(--color-primary)]" />
              Nudges
            </h1>
            <p className="text-[var(--color-foreground-muted)]">
              {nudges.length} {nudges.length === 1 ? 'nudge' : 'nudges'}
            </p>
          </div>
          <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Nudge
          </Button>
        </div>

        {/* Nudges List */}
        <NudgesList
          nudges={nudges}
          loading={loading}
          onComplete={completeNudge}
          onDisable={handleDisable}
          onEnable={handleEnable}
          onDelete={deleteNudge}
          showVisibility={true}
        />
      </div>

      {/* Add Nudge Modal */}
      <AddNudgeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNudge}
        members={members.map(m => ({ id: m.id, name: m.name }))}
        assets={assets.map(a => ({ id: a.id, name: a.name }))}
      />
    </AppShell>
  );
}
