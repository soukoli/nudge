'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Palette, Bell, Shield, Trash2, LogOut, Pencil, Check, X } from 'lucide-react';
import { AppShell } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '@/components/ui';
import { ShareModal } from '@/components/modals';
import { useFamily, clearFamilyId } from '@/hooks';

export default function SettingsPage() {
  const { family, updateFamily } = useFamily();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Family name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edited name when family loads
  useEffect(() => {
    if (family?.name) {
      setEditedName(family.name);
    }
  }, [family?.name]);

  const handleStartEditing = () => {
    setEditedName(family?.name || '');
    setIsEditingName(true);
  };

  const handleCancelEditing = () => {
    setEditedName(family?.name || '');
    setIsEditingName(false);
  };

  const handleSaveName = async () => {
    if (!editedName.trim() || editedName.trim() === family?.name) {
      handleCancelEditing();
      return;
    }

    setIsSaving(true);
    try {
      await updateFamily({ name: editedName.trim() });
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update family name:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLeaveFamily = () => {
    if (confirm('Are you sure you want to leave this family? You can rejoin using the share code.')) {
      clearFamilyId();
      window.location.href = '/';
    }
  };

  return (
    <AppShell familyName={family?.name}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Family Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Family</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="label">Family Name</label>
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <Input 
                        value={editedName} 
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') handleCancelEditing();
                        }}
                        autoFocus
                        disabled={isSaving}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleSaveName}
                        disabled={isSaving}
                        title="Save"
                      >
                        <Check size={18} className="text-[var(--color-success)]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleCancelEditing}
                        disabled={isSaving}
                        title="Cancel"
                      >
                        <X size={18} className="text-[var(--color-error)]" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input value={family?.name || ''} readOnly />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleStartEditing}
                        title="Edit family name"
                      >
                        <Pencil size={18} />
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="label">Share Code</label>
                  <div className="flex gap-2">
                    <Input value={family?.shareCode || ''} readOnly className="font-mono" />
                    <Button variant="secondary" onClick={() => setIsShareModalOpen(true)}>
                      Share
                    </Button>
                  </div>
                  <p className="text-sm text-[var(--color-foreground-muted)] mt-1">
                    Share this code with family members to let them join
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette size={20} />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Theme</div>
                    <div className="text-sm text-[var(--color-foreground-muted)]">
                      Follows your system preference
                    </div>
                  </div>
                  <Badge>System</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Display Language</div>
                    <div className="text-sm text-[var(--color-foreground-muted)]">
                      Change language via header toggle
                    </div>
                  </div>
                  <Badge>English</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell size={20} />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-[var(--color-foreground-muted)]">
                      Gentle daily reminders about your family
                    </div>
                  </div>
                  <Badge variant="default">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  Your family data is stored securely and is only accessible to those with your share code.
                </p>
                <p className="text-sm text-[var(--color-foreground-muted)]">
                  We don't track behavior, measure performance, or sell your personal information. 
                  Keep Close simply shows what matters — nothing more.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-[var(--color-error)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--color-error)]">
                  <Trash2 size={20} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Leave Family</div>
                    <div className="text-sm text-[var(--color-foreground-muted)]">
                      Remove yourself from this family view
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-[var(--color-error)]"
                    icon={LogOut}
                    onClick={handleLeaveFamily}
                  >
                    Leave
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-[var(--color-foreground-muted)]">
          <p>Keep Close v1.0.0</p>
          <p>Made with love for families</p>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareCode={family?.shareCode || ''}
        familyName={family?.name || ''}
      />
    </AppShell>
  );
}
