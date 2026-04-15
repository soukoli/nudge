'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, User, ChevronRight, PawPrint } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, Avatar, Badge, Button, Input } from '@/components/ui';
import { AddMemberModal } from '@/components/modals';
import { useFamily, useMembers, useNudges } from '@/hooks';
import type { CreateMemberInput } from '@/lib/types';

const memberTypeLabels: Record<string, string> = {
  ADULT: 'Adult',
  CHILD_BABY: 'Baby',
  CHILD_TODDLER: 'Toddler',
  CHILD_PRESCHOOL: 'Preschooler',
  CHILD_SCHOOL: 'School Age',
  CHILD_TEEN: 'Teenager',
  PET: 'Pet',
};

const memberTypeColors: Record<string, string> = {
  ADULT: 'border-blue-400',
  CHILD_BABY: 'border-pink-300',
  CHILD_TODDLER: 'border-pink-400',
  CHILD_PRESCHOOL: 'border-purple-400',
  CHILD_SCHOOL: 'border-indigo-400',
  CHILD_TEEN: 'border-violet-400',
  PET: 'border-orange-400',
};

export default function MembersPage() {
  const router = useRouter();
  const { family, loading: familyLoading } = useFamily();
  const { members, loading: membersLoading, addMember } = useMembers(family?.id);
  const { nudges } = useNudges(family?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMemberNudgeCount = (memberId: string) => {
    const memberNudges = nudges.filter(n => n.memberId === memberId && n.isActive);
    return memberNudges.length;
  };

  const handleAddMember = async (data: CreateMemberInput) => {
    await addMember(data);
    setIsAddModalOpen(false);
  };

  const loading = familyLoading || membersLoading;

  // Separate humans and pets
  const humans = filteredMembers.filter(m => m.memberType !== 'PET');
  const pets = filteredMembers.filter(m => m.memberType === 'PET');

  return (
    <AppShell familyName={family?.name} onAddNew={() => setIsAddModalOpen(true)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-headline mb-1">Family</h1>
            <p className="text-[var(--color-text-secondary)]">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Member
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="Search family..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div 
              className="w-8 h-8 border-3 border-[var(--color-accent)] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : filteredMembers.length === 0 ? (
          <Card className="text-center py-16">
            <User size={48} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-30" />
            <p className="text-lg text-[var(--color-text-secondary)] mb-1">
              {searchQuery ? 'No members found' : 'No family members yet'}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {searchQuery ? 'Try a different search term' : 'Start by adding your first family member'}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                className="mt-6"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Member
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Humans */}
            {humans.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {humans.map((member, index) => {
                  const nudgeCount = getMemberNudgeCount(member.id);
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        variant="interactive"
                        className="cursor-pointer"
                        onClick={() => router.push(`/members/${member.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar
                            src={member.avatarUrl}
                            fallback={member.name}
                            size="lg"
                            className={`border-2 ${memberTypeColors[member.memberType] || 'border-gray-400'}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{member.name}</h3>
                            {member.nickname && (
                              <p className="text-sm text-[var(--color-text-muted)] truncate">
                                "{member.nickname}"
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="default">
                                {memberTypeLabels[member.memberType] || member.memberType}
                              </Badge>
                              {nudgeCount > 0 && (
                                <Badge variant="primary">{nudgeCount} nudges</Badge>
                              )}
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pets */}
            {pets.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PawPrint size={20} />
                  Pets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pets.map((pet, index) => {
                    const nudgeCount = getMemberNudgeCount(pet.id);
                    
                    return (
                      <motion.div
                        key={pet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (humans.length + index) * 0.05 }}
                      >
                        <Card
                          variant="interactive"
                          className="cursor-pointer"
                          onClick={() => router.push(`/members/${pet.id}`)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl border-2 border-orange-400">
                              🐾
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{pet.name}</h3>
                              {nudgeCount > 0 && (
                                <Badge variant="primary" className="mt-1">{nudgeCount} nudges</Badge>
                              )}
                            </div>
                            <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
        familyId={family?.id || ''}
      />
    </AppShell>
  );
}
