import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string; // We will now use the key if passed or the string
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmColor = '#ef4444'
}: ConfirmationModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card w-full max-w-md p-6 relative border-zinc-800"
      >
        <h2 className="text-xl font-bold text-zinc-100 mb-2">{title}</h2>
        <p className="text-zinc-400 mb-8 text-sm leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            {t('modals.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white rounded-md transition-all"
            style={{ backgroundColor: confirmColor, boxShadow: `0 0 10px ${confirmColor}44` }}
          >
            {confirmLabel || t('modals.deleteConfirm')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
