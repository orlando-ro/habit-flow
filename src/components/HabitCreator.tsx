import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { HabitType } from '@/lib/db';

const PRESET_COLORS = [
  { name: 'Emerald', value: '#34d399' },
  { name: 'Rose', value: '#fb7185' },
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Amber', value: '#fbbf24' },
  { name: 'Violet', value: '#a78bfa' },
  { name: 'Cyan', value: '#22d3ee' },
  { name: 'Lime', value: '#a3e635' },
  { name: 'Orange', value: '#fb923c' },
];

const CATEGORIES = ['General', 'Health', 'Mindset', 'Work', 'Social', 'Finance'];

interface HabitCreatorProps {
  onClose: () => void;
  onCreate: (habit: any) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export const HabitCreator = ({ onClose, onCreate, initialData, isEditing }: HabitCreatorProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<HabitType>(initialData?.type || 'POSITIVE');
  const [goalValue, setGoalValue] = useState(initialData?.goalValue || 0);
  const [unit, setUnit] = useState(initialData?.unit || '');
  const [category, setCategory] = useState(initialData?.category || 'General');
  const [color, setColor] = useState(initialData?.color || '#34d399');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({ name, type, goalValue, unit, category, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="cyber-card w-full max-w-md relative border-zinc-800 p-6"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-zinc-100 mb-6 tracking-tighter">
          {isEditing ? t('creator.editTitle') : t('creator.title')}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.identity')}</label>
            <input
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:ring-1 ring-zinc-700 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('creator.placeholder')}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.type')}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['POSITIVE', 'NEGATIVE', 'COUNT'] as HabitType[]).map((tType) => (
                <button
                  key={tType}
                  type="button"
                  onClick={() => setType(tType)}
                  className={`p-2 rounded-lg text-xs font-mono transition-all ${
                    type === tType ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {tType === 'POSITIVE' ? t('habits.growth') : tType === 'NEGATIVE' ? t('habits.eliminate') : t('habits.count')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.category')}</label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.color')}</label>
              <div className="flex gap-1 flex-wrap p-1 bg-zinc-950 border border-zinc-800 rounded-lg h-[42px] overflow-y-auto">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-6 h-6 rounded-full transition-transform ${color === c.value ? 'scale-125 ring-2 ring-zinc-100' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {type === 'COUNT' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.goal')}</label>
                <input
                  type="number"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                  value={goalValue}
                  onChange={(e) => setGoalValue(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-widest">{t('creator.unit')}</label>
                <input
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 outline-none"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder={t('creator.placeholder')}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-zinc-100 text-zinc-950 rounded-lg font-bold hover:bg-zinc-300 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isEditing ? t('creator.update') : t('creator.commit')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
