import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PositiveCardProps {
  habit: {
    id: string;
    name: string;
    color: string;
  };
  isCompleted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  streak: number;
}

export const PositiveCard = ({ habit, isCompleted, onToggle, streak }: PositiveCardProps) => {
  const { t } = useTranslation();
  return (
    <div
      className="cyber-card p-5 group relative overflow-hidden"
      style={{
        boxShadow: isCompleted ? `inset 0 0 12px ${habit.color}33` : 'none',
        borderColor: isCompleted ? habit.color : '#27272a'
      }}
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">{habit.name}</h3>
          <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            {t('habits.streak')}: <span className="text-zinc-100">{streak}d</span>
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => onToggle(e)}
          className={`p-3 rounded-md transition-all duration-200 ${
            isCompleted
              ? 'bg-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.5)]'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <CheckCircle2 size={20} />
        </motion.button>
      </div>
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: habit.color }}
        />
      )}
    </div>
  );
};
