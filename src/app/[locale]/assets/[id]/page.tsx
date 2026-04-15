'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Trash2,
  Plus,
  Car,
  Home,
  TreePine,
  Building,
  Package
} from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { NudgesList } from '@/components/nudges';
import { AddNudgeModal } from '@/components/modals';
import { useFamily, useNudges, type Asset } from '@/hooks';
import type { CreateNudgeInput } from '@/lib/types';

const assetTypeConfig: Record<string, { icon: typeof Car; label: string; color: string }> = {
  CAR: { icon: Car, label: 'Car', color: 'text-blue-500' },
  HOUSE: { icon: Home, label: 'House', color: 'text-green-500' },
  APARTMENT: { icon: Building, label: 'Apartment', color: 'text-purple-500' },
  COTTAGE: { icon: TreePine, label: 'Cottage', color: 'text-orange-500' },
  OTHER: { icon: Package, label: 'Other', color: 'text-gray-500' },
};

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { family } = useFamily();
  const { nudges, addNudge, completeNudge, updateNudge, deleteNudge } = useNudges(family?.id);
  
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddNudgeOpen, setIsAddNudgeOpen] = useState(false);

  // Fetch asset details
  useEffect(() => {
    async function fetchAsset() {
      try {
        const res = await fetch(`/api/assets?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setAsset(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch asset:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAsset();
  }, [id]);

  // Filter nudges for this asset
  const assetNudges = nudges.filter(n => n.assetId === id);

  const handleAddNudge = async (data: CreateNudgeInput) => {
    await addNudge({ ...data, assetId: id });
    setIsAddNudgeOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset? All its nudges will also be deleted.')) {
      return;
    }
    try {
      await fetch(`/api/assets?id=${id}`, { method: 'DELETE' });
      router.push('/assets');
    } catch (error) {
      console.error('Failed to delete asset:', error);
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

  if (!asset) {
    return (
      <AppShell familyName={family?.name}>
        <div className="text-center py-12">
          <p className="text-[var(--color-foreground-muted)]">Asset not found</p>
          <Button variant="secondary" className="mt-4" onClick={() => router.push('/assets')}>
            Back to Assets
          </Button>
        </div>
      </AppShell>
    );
  }

  const config = assetTypeConfig[asset.assetType] || assetTypeConfig.OTHER;
  const IconComponent = config.icon;
  const activeNudges = assetNudges.filter(n => n.isActive);

  return (
    <AppShell familyName={family?.name}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          icon={ArrowLeft}
          onClick={() => router.push('/assets')}
          className="mb-4"
        >
          Back to Assets
        </Button>

        {/* Asset Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`w-24 h-24 rounded-full bg-[var(--color-surface)] flex items-center justify-center ${config.color}`}>
                <IconComponent size={48} />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{asset.name}</h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  <Badge variant="accent">{config.label}</Badge>
                  {activeNudges.length > 0 && (
                    <Badge variant="primary">{activeNudges.length} nudges</Badge>
                  )}
                </div>

                {asset.description && (
                  <p className="text-[var(--color-foreground-muted)] mt-3">
                    {asset.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
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
            nudges={assetNudges}
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
        preselectedAssetId={id}
      />
    </AppShell>
  );
}
