import { useEffect, useCallback } from 'react';
import { db, Habit, Completion, HabitType } from '@/lib/db';
import { useHabitStore } from '@/store/useHabitStore';
import { format, subDays, isSameDay } from 'date-fns';

export function useHabits() {
  const { habits, setHabits, addHabit, removeHabit } = useHabitStore();

  useEffect(() => {
    async function loadHabits() {
      const allHabits = await db.habits.toArray();
      setHabits(allHabits);
    }
    loadHabits();
  }, [setHabits]);

  const createHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'createdAt' | 'lastEdited'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastEdited: Date.now(),
    };
    await db.habits.add(newHabit);
    addHabit(newHabit);
    return newHabit;
  }, [addHabit]);

  const editHabit = useCallback(async (id: string, updates: Partial<Habit>) => {
    await db.habits.update(id, {
      ...updates,
      lastEdited: Date.now(),
    });
    const updatedHabit = await db.habits.get(id);
    if (updatedHabit) {
      setHabits(habits.map(h => h.id === id ? updatedHabit : h));
    }
  }, [habits, setHabits]);

  const deleteHabit = useCallback(async (id: string) => {
    await db.habits.delete(id);
    await db.completions.where('habitId').equals(id).delete();
    removeHabit(id);
  }, [removeHabit]);

  const toggleHabit = useCallback(async (habitId: string, type: HabitType) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = await db.completions
      .where({ habitId, date: today })
      .first();

    if (existing) {
      await db.completions.delete(existing.id);
    } else {
      await db.completions.add({
        id: crypto.randomUUID(),
        habitId,
        date: today,
        value: 1,
        isFail: type === 'NEGATIVE',
      });
    }
  }, []);

  const updateCount = useCallback(async (habitId: string, value: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = await db.completions
      .where({ habitId, date: today })
      .first();

    if (existing) {
      await db.completions.update(existing.id, { value });
    } else {
      await db.completions.add({
        id: crypto.randomUUID(),
        habitId,
        date: today,
        value,
        isFail: false,
      });
    }
  }, []);

  const calculateStreak = useCallback(async (habitId: string, type: HabitType, goalValue?: number) => {
    let streak = 0;
    let currentDate = new Date();

    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const completion = await db.completions
        .where({ habitId, date: dateStr })
        .first();

      let success = false;
      if (type === 'POSITIVE') {
        success = !!completion;
      } else if (type === 'NEGATIVE') {
        success = !completion;
      } else if (type === 'COUNT' && goalValue) {
        success = !!(completion && completion.value >= goalValue);
      }

      if (success) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        if (isSameDay(new Date(), currentDate)) {
          currentDate = subDays(currentDate, 1);
          continue;
        }
        break;
      }
    }
    return streak;
  }, []);

  const exportData = useCallback(async () => {
    const allHabits = await db.habits.toArray();
    const allCompletions = await db.completions.toArray();
    return JSON.stringify({ habits: allHabits, completions: allCompletions }, null, 2);
  }, []);

  const importData = useCallback(async (jsonString: string) => {
    const data = JSON.parse(jsonString);
    await db.transaction('rw', ['habits', 'completions'], async () => {
      await db.habits.clear();
      await db.completions.clear();
      await db.habits.bulkAdd(data.habits);
      await db.completions.bulkAdd(data.completions);
    });
    const allHabits = await db.habits.toArray();
    setHabits(allHabits);
  }, [setHabits]);

  return {
    habits,
    createHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
    updateCount,
    calculateStreak,
    exportData,
    importData,
  };
}
