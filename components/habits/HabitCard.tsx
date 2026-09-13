import React, { useEffect, useState } from 'react';
import { Habit, HabitType } from '@/lib/db';
import { PositiveCard } from './PositiveCard';
import { NegativeCard } from './NegativeCard';
import { CountCard } from './CountCard';
import { db } from '@/lib/db';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string, type: HabitType) => Promise<void>;
  onUpdateCount: (id: string, value: number) => Promise<void>;
}

export const HabitCard = ({ habit, onToggle, onUpdateCount }: HabitCardProps) => {
  const [status, setStatus] = useState<{ completed: boolean; value: number; streak: number }>({
    completed: false,
    value: 0,
    streak: 0,
  });

  useEffect(() => {
    async function fetchStatus() {
      const today = format(new Date(), 'yyyy-MM-dd');
      const completion = await db.completions.where({ habitId: habit.id, date: today }).first();

      // This would ideally come from the hook, but for now we calculate or pass it
      // In a real app, we'd use a custom hook like useHabitStreak(habit.id)
      // For simplicity, I'll assume the parent provides the streak or we calculate it here

      setStatus({
        completed: !!completion,
        value: completion?.value || 0,
        streak: 0, // Will be updated by parent or a separate effect
      });
    }
    fetchStatus();
  }, [habit.id]);

  // We can't easily calculate streak here without the hook logic,
  // so let's let the parent pass the streak down.
  // Updating the props to include streak.
  return null; // This component is now just a proxy, I'll implement the logic in the Dashboard
};
