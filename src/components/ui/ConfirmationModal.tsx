'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  bullets?: string[];
  confirmText?: string;
  cancelText?: string;
  /** If provided, user must type this text to confirm (for destructive actions) */
  confirmationWord?: string;
  /** Variant affects colors - 'danger' for destructive actions */
  variant?: 'default' | 'danger';
  /** Show loading state on confirm button */
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  bullets,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmationWord,
  variant = 'default',
  isLoading = false,
}: ConfirmationModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);

  // Reset input when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const isConfirmDisabled = confirmationWord 
    ? inputValue.toUpperCase() !== confirmationWord.toUpperCase()
    : false;

  const loading = isLoading || internalLoading;

  const handleConfirm = async () => {
    if (isConfirmDisabled || loading) return;
    
    setInternalLoading(true);
    try {
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content max-w-md"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <div className="flex items-center gap-3">
                {isDanger && (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-[var(--color-error)]" />
                  </div>
                )}
                <h2 className={`modal-title ${isDanger ? 'text-[var(--color-error)]' : ''}`}>
                  {title}
                </h2>
              </div>
              <motion.button
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface)] transition-colors"
                onClick={onClose}
                aria-label="Close modal"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="modal-body space-y-4">
              {description && (
                <p className="text-[var(--color-foreground-muted)]">
                  {description}
                </p>
              )}

              {bullets && bullets.length > 0 && (
                <ul className="space-y-2">
                  {bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-[var(--color-foreground-muted)]">
                      <span className="text-[var(--color-error)] mt-0.5">•</span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {isDanger && (
                <p className="text-sm font-medium text-[var(--color-error)]">
                  This action cannot be undone.
                </p>
              )}

              {confirmationWord && (
                <div className="pt-2">
                  <label className="label">
                    Type <span className="font-mono font-bold">{confirmationWord}</span> to confirm:
                  </label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={confirmationWord}
                    autoFocus
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                {cancelText}
              </Button>
              <Button
                variant={isDanger ? 'primary' : 'primary'}
                onClick={handleConfirm}
                disabled={isConfirmDisabled || loading}
                className={isDanger ? 'bg-[var(--color-error)] hover:bg-[var(--color-error)]/90' : ''}
              >
                {loading ? 'Please wait...' : confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
