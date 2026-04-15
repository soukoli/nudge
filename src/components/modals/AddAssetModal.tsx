'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, FileText, Car, Home, TreePine, Building } from 'lucide-react';
import { Modal, Input, Select, Button } from '@/components/ui';
import type { CreateAssetInput } from '@/lib/types';

export interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssetInput) => Promise<void>;
  familyId: string;
}

const assetTypeOptions = [
  { value: 'CAR', label: 'Car' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'COTTAGE', label: 'Cottage / Vacation Home' },
  { value: 'OTHER', label: 'Other' },
];

const assetTypeIcons: Record<string, typeof Car> = {
  CAR: Car,
  HOUSE: Home,
  APARTMENT: Building,
  COTTAGE: TreePine,
  OTHER: Package,
};

export function AddAssetModal({
  isOpen,
  onClose,
  onSubmit,
  familyId,
}: AddAssetModalProps) {
  const t = useTranslations();
  
  const [formData, setFormData] = useState<CreateAssetInput>({
    name: '',
    assetType: 'CAR',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CreateAssetInput, value: string) => {
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
        description: formData.description?.trim() || undefined,
        assetType: formData.assetType as any,
      });
      
      // Reset form
      setFormData({
        name: '',
        assetType: 'CAR',
        description: '',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      assetType: 'CAR',
      description: '',
    });
    setError(null);
    onClose();
  };

  const IconComponent = assetTypeIcons[formData.assetType] || Package;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Asset"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Add Asset
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Asset Icon Preview */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
            <IconComponent size={40} className="text-[var(--color-primary)]" />
          </div>
        </div>

        {/* Asset Type */}
        <Select
          label="Asset Type *"
          value={formData.assetType}
          onChange={(e) => handleChange('assetType', e.target.value)}
          options={assetTypeOptions}
        />

        {/* Name */}
        <Input
          label="Name *"
          placeholder={
            formData.assetType === 'CAR' ? 'e.g., Family Car, BMW X5...' :
            formData.assetType === 'HOUSE' ? 'e.g., Our Home, Beach House...' :
            formData.assetType === 'COTTAGE' ? 'e.g., Mountain Cottage...' :
            'Enter asset name'
          }
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          icon={Package}
          error={error && !formData.name.trim() ? error : undefined}
        />

        {/* Description */}
        <div className="w-full">
          <label className="label">Description (optional)</label>
          <textarea
            className="input min-h-[80px] resize-none"
            placeholder="Add any notes about this asset..."
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        {/* Error message */}
        {error && formData.name.trim() && (
          <p className="text-sm text-[var(--color-error)] text-center">{error}</p>
        )}

        {/* Info note */}
        <p className="text-sm text-[var(--color-foreground-muted)] text-center">
          Maintenance reminders will be automatically created based on asset type.
        </p>
      </div>
    </Modal>
  );
}
