import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/db';
import { format, startOfYear, eachDayOfInterval, isSameDay, getDay } from 'date-fns';

interface HistoryHeatmapProps {
  focusedHabitId?: string | null;
  focusedHabitName?: string | null;
}

export const HistoryHeatmap = ({ focusedHabitId, focusedHabitName }: HistoryHeatmapProps) => {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHeatmap() {
      setLoading(true);
      const yearStart = startOfYear(new Date());
      const yearEnd = new Date();

      const completions = await db.completions.toArray();
      const habits = await db.habits.toArray();

      const dayStats: Record<string, number> = {};

      completions.forEach(c => {
        if (focusedHabitId && c.habitId !== focusedHabitId) return;
        const dateStr = format(new Date(c.date), 'yyyy-MM-dd');
        dayStats[dateStr] = (dayStats[dateStr] || 0) + 1;
      });

      setData(dayStats);
      setLoading(false);
    }
    loadHeatmap();
  }, [focusedHabitId]);

  const heatmapGrid = useMemo(() => {
    const yearStart = startOfYear(new Date());
    const yearEnd = new Date();
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

    // Group by weeks
    const weeks: Record<number, any[]> = {};
    days.forEach(day => {
      const weekNum = Math.floor(
        (day.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      if (!weeks[weekNum]) weeks[weekNum] = [];
      weeks[weekNum].push(day);
    });

    return weeks;
  }, []);

  if (loading) return <div className="text-zinc-500 font-mono text-xs animate-pulse">Analyzing consistency...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-sm font-mono uppercase text-zinc-400 tracking-widest">
            {focusedHabitId ? `Timeline: ${focusedHabitName}` : 'Global Consistency'}
          </h3>
          <p className="text-[10px] font-mono text-zinc-600 uppercase">Active nodes per day</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <span className="mr-1">Intensity:</span>
          <div className="w-2 h-2 bg-zinc-800 rounded-sm" />
          <div className="w-2 h-2 bg-zinc-700 rounded-sm" />
          <div className="w-2 h-2 bg-zinc-500 rounded-sm" />
          <div className="w-2 h-2 bg-zinc-200 rounded-sm" />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {Object.values(heatmapGrid).map((weekDays, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {weekDays.map((day, dayIdx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const count = data[dateStr] || 0;

              // Intensity mapping
              let intensity = 'bg-zinc-800';
              if (count > 0) intensity = 'bg-zinc-700';
              if (count > 2) intensity = 'bg-zinc-500';
              if (count > 5) intensity = 'bg-zinc-200';

              return (
                <div
                  key={dayIdx}
                  title={`${dateStr}: ${count} habits`}
                  className={`w-2.5 h-2.5 rounded-sm ${intensity} transition-all hover:scale-150 hover:z-10 cursor-help`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
