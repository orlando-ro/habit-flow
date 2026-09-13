import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CountCardProps {
  habit: {
    id: string;
    name: string;
    color: string;
  };
  currentValue: number;
  onUpdate: (e: React.MouseEvent, val: number) => void;
  streak: number;
  goalValue: number;
  unit: string;
}

export const CountCard = ({ habit, currentValue, onUpdate, streak, goalValue, unit }: CountCardProps) => {
  const { t } = useTranslation();
  const progress = Math.min((currentValue / goalValue) * 100, 100);

  return (
    <div
      className="cyber-card p-5 group relative overflow-hidden"
      style={{
        boxShadow: progress >= 100 ? `inset 0 0 12px ${habit.color}33` : 'none',
        borderColor: progress >= 100 ? habit.color : '#27272a'
      }}
    >
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-zinc-100 group-hover:text-white transition-colors">{habit.name}</h3>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {t('habits.streak')}: <span className="text-zinc-100">{streak}d</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-zinc-100">{currentValue}</span>
            <span className="text-xs font-mono text-zinc-400 ml-1 uppercase">{unit}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full transition-all duration-500"
              style={{ backgroundColor: habit.color, boxShadow: `0 0 10px ${habit.color}` }}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => onUpdate(e, Math.max(0, currentValue - 1))}
              className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 text-zinc-400 transition-colors"
            >
              <Minus size={14} />
            </button>
            <button
              onClick={(e) => onUpdate(e, currentValue + 1)}
              className="p-1 bg-zinc-800 rounded-md hover:bg-zinc-700 text-zinc-400 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        <p className="text-[10px] font-mono text-center text-zinc-500 uppercase tracking-tighter">
          {t('habits.target')}: {goalValue} {unit}
        </p>
      </div>
      {progress >= 100 && (
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
