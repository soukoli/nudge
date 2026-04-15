'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Copy, Check, Share2, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button } from '@/components/ui';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareCode: string;
  familyName: string;
}

export function ShareModal({
  isOpen,
  onClose,
  shareCode,
  familyName,
}: ShareModalProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/join/${shareCode}`
    : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${familyName} on Keep Close`,
          text: `Use this code to join our family: ${shareCode}`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Family"
      size="sm"
      footer={
        <Button variant="secondary" onClick={onClose} className="w-full">
          Done
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
            <Share2 size={36} className="text-[var(--color-primary)]" />
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-[var(--color-foreground-muted)]">
          Share this code with family members so they can view and participate in <strong>{familyName}</strong>.
        </p>

        {/* Share Code Display */}
        <div className="relative">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center">
            <p className="text-3xl font-mono font-bold tracking-widest text-[var(--color-foreground)]">
              {shareCode.toUpperCase()}
            </p>
          </div>
          
          {/* Copy Button */}
          <motion.button
            onClick={handleCopy}
            className="absolute top-1/2 right-3 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Copied feedback */}
        <AnimatePresence>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center text-sm text-[var(--color-success)] font-medium"
            >
              Copied to clipboard!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Native Share Button (if supported) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="primary"
            onClick={handleShare}
            icon={Share2}
            className="w-full"
          >
            Share via...
          </Button>
        )}

        {/* Instructions */}
        <div className="text-sm text-[var(--color-foreground-muted)] space-y-2">
          <p className="font-medium">How to join:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open Keep Close app</li>
            <li>Select "Join Family"</li>
            <li>Enter the code above</li>
          </ol>
        </div>
      </div>
    </Modal>
  );
}
