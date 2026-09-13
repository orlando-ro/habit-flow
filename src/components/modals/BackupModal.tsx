import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => Promise<string>;
  onImport: (json: string) => Promise<void>;
}

export const BackupModal = ({ isOpen, onClose, onExport, onImport }: BackupModalProps) => {
  const { t } = useTranslation();
  const [importText, setImportText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    const data = await onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-flow-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      await onImport(importText);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (e) {
      alert('Invalid backup file');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card w-full max-w-md p-6 relative border-zinc-800"
      >
        <h2 className="text-xl font-bold text-zinc-100 mb-6">{t('modals.backupTitle')}</h2>

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div>
              <p className="text-sm font-medium text-zinc-100">{t('modals.backupExport')}</p>
              <p className="text-xs text-zinc-400">{t('modals.backupExportMsg')}</p>
            </div>
            <button
              onClick={handleExport}
              className="p-2 bg-zinc-100 text-zinc-950 rounded-md hover:bg-zinc-300 transition-all"
            >
              <Download size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-zinc-100">{t('modals.backupImport')}</p>
            <textarea
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-400 outline-none focus:ring-1 ring-zinc-700"
              placeholder={t('modals.backupImportPlaceholder')}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button
              onClick={handleImport}
              disabled={!importText}
              className={`w-full py-2 rounded-md font-bold transition-all flex items-center justify-center gap-2 ${
                isSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 text-zinc-950 hover:bg-zinc-300 disabled:opacity-50'
              }`}
            >
              {isSuccess ? (
                <><CheckCircle size={18} /> {t('modals.backupSuccess')}</>
              ) : (
                <><Upload size={18} /> {t('modals.backupImportBtn')}</>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {t('modals.cancel')}
        </button>
      </motion.div>
    </div>
  );
};
