'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Users, Calendar, Camera } from 'lucide-react';
import { Modal, Input, Select, Button, Avatar } from '@/components/ui';
import type { CreateMemberInput } from '@/lib/types';

export interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemberInput) => Promise<void>;
  familyId: string;
}

const memberTypeOptions = [
  { value: 'ADULT', label: 'Adult' },
  { value: 'CHILD_BABY', label: 'Baby (0-1)' },
  { value: 'CHILD_TODDLER', label: 'Toddler (1-3)' },
  { value: 'CHILD_PRESCHOOL', label: 'Preschooler (3-6)' },
  { value: 'CHILD_SCHOOL', label: 'School Age (6-12)' },
  { value: 'CHILD_TEEN', label: 'Teenager (13-18)' },
];

export function AddMemberModal({
  isOpen,
  onClose,
  onSubmit,
  familyId,
}: AddMemberModalProps) {
  const t = useTranslations();
  
  const [formData, setFormData] = useState<CreateMemberInput>({
    name: '',
    nickname: '',
    memberType: 'ADULT',
    birthDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateMemberInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        nickname: formData.nickname?.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        memberType: formData.memberType as any,
      });
      
      // Reset form
      setFormData({
        name: '',
        nickname: '',
        memberType: 'ADULT',
        birthDate: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      nickname: '',
      memberType: 'ADULT',
      birthDate: '',
    });
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Family Member"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Add Member
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Avatar Preview */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar
              size="xl"
              fallback={formData.name || 'New'}
              className="w-24 h-24"
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--color-accent-hover)] transition-colors"
              title="Upload photo"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name *"
          placeholder="Enter member's name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={User}
          error={error && !formData.name.trim() ? error : undefined}
        />

        {/* Nickname */}
        <Input
          label="Nickname (optional)"
          placeholder="e.g., Dad, Mom, Grandma..."
          value={formData.nickname || ''}
          onChange={(e) => handleChange('nickname', e.target.value)}
          icon={Users}
        />

        {/* Member Type */}
        <Select
          label="Member Type"
          value={formData.memberType || 'ADULT'}
          onChange={(e) => handleChange('memberType', e.target.value)}
          options={memberTypeOptions}
        />

        {/* Birth Date */}
        <Input
          label="Birth Date (optional)"
          type="date"
          value={formData.birthDate || ''}
          onChange={(e) => handleChange('birthDate', e.target.value)}
          icon={Calendar}
        />

        {/* Error message */}
        {error && formData.name.trim() && (
          <p className="text-sm text-[var(--color-error)] text-center">{error}</p>
        )}

        {/* Info note */}
        <p className="text-sm text-[var(--color-foreground-muted)] text-center">
          Add family members to keep everyone close.
        </p>
      </div>
    </Modal>
  );
}
