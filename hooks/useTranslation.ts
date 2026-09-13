import { useLanguageStore } from '@/store/useLanguageStore';
import { translations } from '@/lib/translations';

export function useTranslation() {
  const { lang, setLang } = useLanguageStore();

  const t = (path: string, variables?: Record<string, string>) => {
    const keys = path.split('.');
    let value: any = translations[lang];

    for (const key of keys) {
      if (value[key]) {
        value = value[key];
      } else {
        return path; // Fallback to key
      }
    }

    if (typeof value === 'string' && variables) {
      Object.entries(variables).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }

    return value;
  };

  return {
    t,
    lang,
    setLang,
  };
}
