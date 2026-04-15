'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Trash2,
  Plus,
  Cake,
  PawPrint
} from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { NudgesList } from '@/components/nudges';
import { AddNudgeModal } from '@/components/modals';
import { useFamily, useNudges, type FamilyMember } from '@/hooks';
import type { CreateNudgeInput } from '@/lib/types';

const memberTypeLabels: Record<string, string> = {
  ADULT: 'Adult',
  CHILD_BABY: 'Baby (0-1)',
  CHILD_TODDLER: 'Toddler (1-3)',
  CHILD_PRESCHOOL: 'Preschooler (3-6)',
  CHILD_SCHOOL: 'School Age (6-12)',
  CHILD_TEEN: 'Teenager (13-18)',
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

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { family } = useFamily();
  const { nudges, addNudge, completeNudge, updateNudge, deleteNudge } = useNudges(family?.id);
  
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddNudgeOpen, setIsAddNudgeOpen] = useState(false);

  // Fetch member details
  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/members?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setMember(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch member:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id]);

  // Filter nudges for this member
  const memberNudges = nudges.filter(n => n.memberId === id);

  const handleAddNudge = async (data: CreateNudgeInput) => {
    await addNudge({ ...data, memberId: id });
    setIsAddNudgeOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this family member? All their nudges will also be deleted.')) {
      return;
    }
    try {
      await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      router.push('/members');
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  };

  const handleDisable = async (nudgeId: string) => {
    await updateNudge(nudgeId, { isActive: false });
  };

  const handleEnable = async (nudgeId: string) => {
    await updateNudge(nudgeId, { isActive: true });
  };

  if (loading) {
    return (
      <AppShell familyName={family?.name}>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!member) {
    return (
      <AppShell familyName={family?.name}>
        <div className="text-center py-12">
          <p className="text-[var(--color-foreground-muted)]">Member not found</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.push('/members')}>
            Back to Members
          </Button>
        </div>
      </AppShell>
    );
  }

  const activeNudges = memberNudges.filter(n => n.isActive);
  const isPet = member.memberType === 'PET';

  return (
    <AppShell familyName={family?.name}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => router.push('/members')}
          className="mb-4"
        >
          Back to Family
        </Button>

        {/* Member Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar
                src={member.avatarUrl}
                fallback={isPet ? '🐾' : member.name}
                size="xl"
                className={`w-24 h-24 border-4 ${memberTypeColors[member.memberType] || 'border-gray-400'}`}
              />
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{member.name}</h1>
                {member.nickname && (
                  <p className="text-[var(--color-foreground-muted)]">"{member.nickname}"</p>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge variant="accent" className="flex items-center gap-1">
                    {isPet && <PawPrint size={12} />}
                    {memberTypeLabels[member.memberType] || member.memberType}
                  </Badge>
                  {member.birthDate && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Cake size={12} />
                      {format(new Date(member.birthDate), 'MMM d, yyyy')}
                    </Badge>
                  )}
                  {activeNudges.length > 0 && (
                    <Badge variant="primary">{activeNudges.length} nudges</Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!isPet && (
                  <>
                    <Button variant="secondary" size="icon" title="Call">
                      <Phone size={18} />
                    </Button>
                    <Button variant="secondary" size="icon" title="Message">
                      <MessageCircle size={18} />
                    </Button>
                    <Button variant="secondary" size="icon" title="Schedule">
                      <Calendar size={18} />
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Delete"
                  className="text-[var(--color-error)]"
                  onClick={handleDelete}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Nudges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Nudges</h2>
            <Button icon={Plus} size="sm" onClick={() => setIsAddNudgeOpen(true)}>
              Add Nudge
            </Button>
          </div>

          <NudgesList
            nudges={memberNudges}
            onComplete={completeNudge}
            onDisable={handleDisable}
            onEnable={handleEnable}
            onDelete={deleteNudge}
          />
        </motion.div>
      </div>

      {/* Add Nudge Modal */}
      <AddNudgeModal
        isOpen={isAddNudgeOpen}
        onClose={() => setIsAddNudgeOpen(false)}
        onSubmit={handleAddNudge}
        members={[]}
        assets={[]}
        preselectedMemberId={id}
      />
    </AppShell>
  );
}
