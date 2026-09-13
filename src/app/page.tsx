'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Settings, Download, Trash2, Edit3, LayoutDashboard, ArrowLeft, Globe } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useTranslation } from '@/hooks/useTranslation';
import { PositiveCard } from '@/components/habits/PositiveCard';
import { NegativeCard } from '@/components/habits/NegativeCard';
import { CountCard } from '@/components/habits/CountCard';
import { HabitCreator } from '@/components/HabitCreator';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';
import { BackupModal } from '@/components/modals/BackupModal';
import { HistoryHeatmap } from '@/components/viz/HistoryHeatmap';
import { db } from '@/lib/db';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'General', 'Health', 'Mindset', 'Work', 'Social', 'Finance'];

export default function Dashboard() {
  const { habits, createHabit, editHabit, deleteHabit, toggleHabit, updateCount, calculateStreak, exportData, importData } = useHabits();
  const { t, lang, setLang } = useTranslation();

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [deletingHabit, setDeletingHabit] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusMap, setStatusMap] = useState<Record<string, { completed: boolean; value: number; streak: number }>>({});

  const [focusedHabit, setFocusedHabit] = useState<any>(null);

  useEffect(() => {
    async function updateAllStatuses() {
      const today = format(new Date(), 'yyyy-MM-dd');
      const newStatuses: Record<string, any> = {};

      for (const habit of habits) {
        const completion = await db.completions.where({ habitId: habit.id, date: today }).first();
        const streak = await calculateStreak(habit.id, habit.type, habit.goalValue);
        newStatuses[habit.id] = {
          completed: !!completion,
          value: completion?.value || 0,
          streak,
        };
      }
      setStatusMap(newStatuses);
    }
    updateAllStatuses();
  }, [habits, calculateStreak]);

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'All') return habits;
    return habits.filter(h => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const handleToggle = async (id: string, type: any) => {
    await toggleHabit(id, type);
    const today = format(new Date(), 'yyyy-MM-dd');
    const completion = await db.completions.where({ habitId: id, date: today }).first();
    const streak = await calculateStreak(id, type);
    setStatusMap(prev => ({
      ...prev,
      [id]: { ...prev[id], completed: !!completion, streak }
    }));
  };

  const handleUpdateCount = async (id: string, value: number, type: any) => {
    await updateCount(id, value);
    const streak = await calculateStreak(id, type);
    setStatusMap(prev => ({
      ...prev,
      [id]: { ...prev[id], value, streak }
    }));
  };

  const handleConfirmDelete = async () => {
    if (deletingHabit) {
      await deleteHabit(deletingHabit.id);
      setIsDeleting(false);
      setDeletingHabit(null);
    }
  };

  return (
    <main className="min-h-screen p-6 lg:p-12 max-w-7xl mx-auto font-sans">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          {focusedHabit && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setFocusedHabit(null)}
              className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:text-zinc-100 transition-all flex items-center gap-2 text-xs font-mono"
            >
              <ArrowLeft size={14} />
              {t('dashboard.backToGlobal')}
            </motion.button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard size={20} className="text-habit-growth" />
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{t('dashboard.commandCenter')}</span>
            </div>
            <h1 className="text-6xl font-black text-zinc-100 tracking-tighter">
              {t('dashboard.title')}
            </h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">{t('dashboard.systemStatus')}: <span className="text-emerald-400">{t('dashboard.optimal')}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:text-zinc-100 transition-all flex items-center gap-2"
            title="Change Language"
          >
            <Globe size={20} />
            <span className="text-xs font-mono uppercase">{lang}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsBackupOpen(true)}
            className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:text-zinc-100 transition-all"
            title="Backup & Restore"
          >
            <Settings size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-zinc-100 text-zinc-950 rounded-lg font-bold shadow-lg flex items-center gap-2 hover:bg-zinc-300 transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{t('dashboard.initializeHabit')}</span>
          </motion.button>
        </div>
      </header>

      {/* Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="cyber-card p-6 border-zinc-800 bg-zinc-900/50">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{t('dashboard.activeNodes')}</p>
          <p className="text-3xl font-mono font-bold text-zinc-100">{habits.length}</p>
        </div>
        <div className="cyber-card p-6 border-zinc-800 bg-zinc-900/50">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{t('dashboard.globalConsistency')}</p>
          <p className="text-3xl font-mono font-bold text-zinc-100">
            {habits.length > 0
              ? `${Math.round((Object.values(statusMap).filter(s => s.completed).length / habits.length) * 100)}%`
              : '0%'}
          </p>
        </div>
        <div className="cyber-card p-6 border-zinc-800 bg-zinc-900/50">
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{t('dashboard.topStreak')}</p>
          <p className="text-3xl font-mono font-bold text-zinc-100">
            {Math.max(0, ...Object.values(statusMap).map(s => s.streak))} <span className="text-sm text-zinc-500">{t('dashboard.days')}</span>
          </p>
        </div>
      </section>

      {/* History Heatmap */}
      <section className="cyber-card p-6 mb-12 border-zinc-800 bg-zinc-900/30">
        <HistoryHeatmap
          focusedHabitId={focusedHabit?.id}
          focusedHabitName={focusedHabit?.name}
        />
      </section>

      {/* Filters */}
      <section className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-zinc-100 text-zinc-950'
                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Habit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit) => {
            const status = statusMap[habit.id] || { completed: false, value: 0, streak: 0 };
            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer"
                onClick={() => setFocusedHabit(habit)}
              >
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 z-20">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingHabit(habit); setIsEditing(true); }}
                    className="p-1.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700 hover:text-zinc-100"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeletingHabit(habit); setIsDeleting(true); }}
                    className="p-1.5 bg-zinc-800 text-zinc-400 rounded border border-zinc-700 hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {habit.type === 'POSITIVE' && (
                  <PositiveCard
                    habit={habit}
                    isCompleted={status.completed}
                    streak={status.streak}
                    onToggle={(e) => { e.stopPropagation(); handleToggle(habit.id, 'POSITIVE'); }}
                  />
                )}
                {habit.type === 'NEGATIVE' && (
                  <NegativeCard
                    habit={habit}
                    isCompleted={status.completed}
                    streak={status.streak}
                    onToggle={(e) => { e.stopPropagation(); handleToggle(habit.id, 'NEGATIVE'); }}
                  />
                )}
                {habit.type === 'COUNT' && (
                  <CountCard
                    habit={habit}
                    currentValue={status.value}
                    streak={status.streak}
                    goalValue={habit.goalValue || 0}
                    unit={habit.unit || 'units'}
                    onUpdate={(e, val) => { e.stopPropagation(); handleUpdateCount(habit.id, val, 'COUNT'); }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredHabits.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-600 font-mono text-sm">
          <Flame size={48} className="mb-4 opacity-20" />
          <p>{t('dashboard.noHabits')}</p>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isAdding && (
          <HabitCreator
            onClose={() => setIsAdding(false)}
            onCreate={async (habitData) => {
              await createHabit(habitData);
            }}
          />
        )}
        {isEditing && editingHabit && (
          <HabitCreator
            isEditing
            initialData={editingHabit}
            onClose={() => { setIsEditing(false); setEditingHabit(null); }}
            onCreate={async (updates) => {
              await editHabit(editingHabit.id, updates);
            }}
          />
        )}
        {isDeleting && deletingHabit && (
          <ConfirmationModal
            isOpen={isDeleting}
            title={t('modals.deleteTitle')}
            message={t('modals.deleteMsg', { name: deletingHabit.name })}
            confirmLabel={t('modals.deleteConfirm')}
            confirmColor="#ef4444"
            onClose={() => { setIsDeleting(false); setDeletingHabit(null); }}
            onConfirm={handleConfirmDelete}
          />
        )}
        {isBackupOpen && (
          <BackupModal
            isOpen={isBackupOpen}
            onClose={() => setIsBackupOpen(false)}
            onExport={exportData}
            onImport={importData}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
