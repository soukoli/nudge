'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, Car, Home, TreePine, Building, Package } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, Badge, Button, Input } from '@/components/ui';
import { AddAssetModal } from '@/components/modals';
import { useFamily, useAssets, useNudges } from '@/hooks';
import type { CreateAssetInput } from '@/lib/types';

const assetTypeConfig: Record<string, { icon: typeof Car; label: string; color: string }> = {
  CAR: { icon: Car, label: 'Car', color: 'text-blue-500' },
  HOUSE: { icon: Home, label: 'House', color: 'text-green-500' },
  APARTMENT: { icon: Building, label: 'Apartment', color: 'text-purple-500' },
  COTTAGE: { icon: TreePine, label: 'Cottage', color: 'text-orange-500' },
  OTHER: { icon: Package, label: 'Other', color: 'text-gray-500' },
};

export default function AssetsPage() {
  const router = useRouter();
  const { family, loading: familyLoading } = useFamily();
  const { assets, loading: assetsLoading, addAsset } = useAssets(family?.id);
  const { nudges } = useNudges(family?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssetNudgeCount = (assetId: string) => {
    const assetNudges = nudges.filter(n => n.assetId === assetId && n.isActive);
    return assetNudges.length;
  };

  const handleAddAsset = async (data: CreateAssetInput) => {
    await addAsset(data);
    setIsAddModalOpen(false);
  };

  const loading = familyLoading || assetsLoading;

  return (
    <AppShell familyName={family?.name} onAddNew={() => setIsAddModalOpen(true)}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Assets</h1>
            <p className="text-[var(--color-foreground-muted)]">
              {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
            </p>
          </div>
          <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add Asset
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAssets.length === 0 ? (
          <Card className="text-center py-12">
            <Home size={48} className="mx-auto mb-4 text-[var(--color-foreground-muted)] opacity-30" />
            <p className="text-[var(--color-foreground-muted)]">
              {searchQuery ? 'No assets found' : 'No assets yet'}
            </p>
            {!searchQuery && (
              <Button 
                variant="primary" 
                className="mt-4"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Asset
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset, index) => {
              const config = assetTypeConfig[asset.assetType] || assetTypeConfig.OTHER;
              const IconComponent = config.icon;
              const nudgeCount = getAssetNudgeCount(asset.id);
              
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    variant="interactive"
                    className="cursor-pointer"
                    onClick={() => router.push(`/assets/${asset.id}`)}
                  >
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-4 ${config.color}`}>
                      <IconComponent size={28} />
                    </div>
                    
                    {/* Info */}
                    <h3 className="font-semibold truncate">{asset.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="default">{config.label}</Badge>
                      {nudgeCount > 0 && (
                        <Badge variant="primary">{nudgeCount} nudges</Badge>
                      )}
                    </div>
                    
                    {asset.description && (
                      <p className="text-sm text-[var(--color-foreground-muted)] mt-2 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAsset}
        familyId={family?.id || ''}
      />
    </AppShell>
  );
}
