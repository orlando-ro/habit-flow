import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/lib/translations';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'habit-flow-language',
    }
  )
);
