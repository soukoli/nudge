'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, Calendar, Repeat, Tag, User, Home, Eye, EyeOff } from 'lucide-react';
import { Modal, Input, Select, Button } from '@/components/ui';
import type { CreateNudgeInput, NudgeCategory, NudgeFrequency, NudgeVisibility } from '@/lib/types';

export interface AddNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNudgeInput) => Promise<void>;
  members?: Array<{ id: string; name: string }>;
  assets?: Array<{ id: string; name: string }>;
  preselectedMemberId?: string;
  preselectedAssetId?: string;
}

// Nudge categories - warm, family-focused
const categoryOptions: { value: NudgeCategory; label: string; emoji: string }[] = [
  { value: 'QUALITY_TIME', label: 'Quality Time', emoji: '💕' },
  { value: 'CALL', label: 'Call / Video Chat', emoji: '📞' },
  { value: 'CHECK_IN', label: 'Check In', emoji: '👋' },
  { value: 'APPRECIATION', label: 'Show Appreciation', emoji: '🙏' },
  { value: 'HEALTH', label: 'Health & Wellness', emoji: '💪' },
  { value: 'SELF_CARE', label: 'Self Care', emoji: '🧘' },
  { value: 'PET_CARE', label: 'Pet Care', emoji: '🐾' },
  { value: 'HOME', label: 'Home', emoji: '🏠' },
  { value: 'BILLS', label: 'Bills & Payments', emoji: '💳' },
  { value: 'CELEBRATION', label: 'Celebration', emoji: '🎉' },
  { value: 'MEMORY', label: 'Create Memory', emoji: '📸' },
];

const frequencyOptions: { value: NudgeFrequency | ''; label: string }[] = [
  { value: 'DAILY', label: 'Every day' },
  { value: 'WEEKLY', label: 'Every week' },
  { value: 'MONTHLY', label: 'Every month' },
  { value: 'ONCE', label: 'One-time only' },
];

const visibilityOptions: { value: NudgeVisibility; label: string; description: string }[] = [
  { value: 'SHARED', label: 'Everyone sees it', description: 'The whole family can see and complete this nudge' },
  { value: 'PERSONAL', label: 'Just for one person', description: 'Only the selected person will see this nudge' },
];

export function AddNudgeModal({
  isOpen,
  onClose,
  onSubmit,
  members = [],
  assets = [],
  preselectedMemberId,
  preselectedAssetId,
}: AddNudgeModalProps) {
  const t = useTranslations();
  
  const [formData, setFormData] = useState<CreateNudgeInput>({
    title: '',
    category: 'CHECK_IN',
    description: '',
    emoji: '👋',
    memberId: preselectedMemberId,
    assetId: preselectedAssetId,
    visibility: 'SHARED',
    targetMemberId: undefined,
    frequency: 'WEEKLY',
  });
  
  const [assignTo, setAssignTo] = useState<'member' | 'asset' | 'none'>(
    preselectedMemberId ? 'member' : preselectedAssetId ? 'asset' : 'none'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update emoji when category changes
  const handleCategoryChange = (value: NudgeCategory) => {
    const category = categoryOptions.find(c => c.value === value);
    setFormData(prev => ({ 
      ...prev, 
      category: value,
      emoji: category?.emoji || prev.emoji 
    }));
  };

  // Reset when preselected changes
  useEffect(() => {
    if (preselectedMemberId) {
      setAssignTo('member');
      setFormData(prev => ({ ...prev, memberId: preselectedMemberId, assetId: undefined }));
    } else if (preselectedAssetId) {
      setAssignTo('asset');
      setFormData(prev => ({ ...prev, assetId: preselectedAssetId, memberId: undefined }));
    }
  }, [preselectedMemberId, preselectedAssetId]);

  const handleChange = (field: keyof CreateNudgeInput, value: string | number | undefined | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleAssignToChange = (value: 'member' | 'asset' | 'none') => {
    setAssignTo(value);
    if (value === 'none') {
      setFormData(prev => ({ ...prev, memberId: undefined, assetId: undefined }));
    } else if (value === 'member') {
      setFormData(prev => ({ ...prev, assetId: undefined }));
    } else {
      setFormData(prev => ({ ...prev, memberId: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Give your nudge a name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
      });
      
      // Reset form
      setFormData({
        title: '',
        category: 'CHECK_IN',
        description: '',
        emoji: '👋',
        memberId: undefined,
        assetId: undefined,
        visibility: 'SHARED',
        targetMemberId: undefined,
        frequency: 'WEEKLY',
      });
      setAssignTo('none');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create nudge');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: 'CHECK_IN',
      description: '',
      emoji: '👋',
      memberId: undefined,
      assetId: undefined,
      visibility: 'SHARED',
      targetMemberId: undefined,
      frequency: 'WEEKLY',
    });
    setAssignTo('none');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create a Nudge"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Create Nudge
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Title with emoji */}
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-14">
            <label className="label">Emoji</label>
            <input
              type="text"
              className="input text-center text-2xl p-2"
              value={formData.emoji || ''}
              onChange={(e) => handleChange('emoji', e.target.value)}
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <Input
              label="What's the nudge?"
              placeholder="e.g., Call Mom, Take a walk together..."
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              icon={Heart}
              error={error && !formData.title.trim() ? error : undefined}
            />
          </div>
        </div>

        {/* Category */}
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleCategoryChange(e.target.value as NudgeCategory)}
          options={categoryOptions.map(c => ({ value: c.value, label: `${c.emoji} ${c.label}` }))}
        />

        {/* Visibility */}
        <div className="w-full">
          <label className="label">Who should see this?</label>
          <div className="flex gap-2">
            {visibilityOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange('visibility', opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[var(--radius-md)] border transition-all ${
                  formData.visibility === opt.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                {opt.value === 'SHARED' ? <Eye size={20} /> : <EyeOff size={20} />}
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Target Member (for PERSONAL visibility) */}
        {formData.visibility === 'PERSONAL' && members.length > 0 && (
          <Select
            label="Who is this for?"
            value={formData.targetMemberId || ''}
            onChange={(e) => handleChange('targetMemberId', e.target.value || undefined)}
            options={members.map(m => ({ value: m.id, label: m.name }))}
            placeholder="Select a family member..."
          />
        )}

        {/* Assign To (optional - for context) */}
        <div className="w-full">
          <label className="label">Related to (optional)</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleAssignToChange('none')}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] border transition-all ${
                assignTo === 'none'
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
              }`}
            >
              <Tag size={18} />
              <span className="text-sm font-medium">General</span>
            </button>
            {members.length > 0 && (
              <button
                type="button"
                onClick={() => handleAssignToChange('member')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] border transition-all ${
                  assignTo === 'member'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <User size={18} />
                <span className="text-sm font-medium">Person</span>
              </button>
            )}
            {assets.length > 0 && (
              <button
                type="button"
                onClick={() => handleAssignToChange('asset')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] border transition-all ${
                  assignTo === 'asset'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <Home size={18} />
                <span className="text-sm font-medium">Asset</span>
              </button>
            )}
          </div>
        </div>

        {/* Member/Asset Select */}
        {assignTo === 'member' && members.length > 0 && (
          <Select
            label="Select Person"
            value={formData.memberId || ''}
            onChange={(e) => handleChange('memberId', e.target.value || undefined)}
            options={members.map(m => ({ value: m.id, label: m.name }))}
            placeholder="Choose a family member..."
          />
        )}
        {assignTo === 'asset' && assets.length > 0 && (
          <Select
            label="Select Asset"
            value={formData.assetId || ''}
            onChange={(e) => handleChange('assetId', e.target.value || undefined)}
            options={assets.map(a => ({ value: a.id, label: a.name }))}
            placeholder="Choose an asset..."
          />
        )}

        {/* Frequency */}
        <Select
          label="How often?"
          value={formData.frequency || 'WEEKLY'}
          onChange={(e) => handleChange('frequency', e.target.value as NudgeFrequency)}
          options={frequencyOptions}
        />

        {/* Description */}
        <div className="w-full">
          <label className="label">Notes (optional)</label>
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="Any extra details or reminders..."
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Error message */}
        {error && formData.title.trim() && (
          <p className="text-sm text-[var(--color-error)] text-center">{error}</p>
        )}
      </div>
    </Modal>
  );
}

// Legacy alias for backwards compatibility
export { AddNudgeModal as AddCheckModal };
export type { AddNudgeModalProps as AddCheckModalProps };
