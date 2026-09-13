import Dexie, { Table } from 'dexie';

export type HabitType = 'POSITIVE' | 'NEGATIVE' | 'COUNT';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  goalValue?: number;
  unit?: string;
  createdAt: number;
  color: string;
  category: string;
  lastEdited: number;
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // ISO date YYYY-MM-DD
  value: number;
  isFail: boolean;
}

export class HabitDB extends Dexie {
  habits!: Table<Habit>;
  completions!: Table<Completion>;

  constructor() {
    super('HabitFlowDB');
    this.version(2).stores({
      habits: 'id, name, type, category',
      completions: 'id, habitId, date',
    });
  }
}

export const db = new HabitDB();
