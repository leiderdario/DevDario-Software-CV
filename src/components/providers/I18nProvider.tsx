'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '@/lib/i18n/types';

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const I18nContext = createContext<I18nContextValue>({
  lang: 'es',
  setLang: () => {},
});

const STORAGE_KEY = 'leider.lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        setLangState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* noop */
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      /* noop */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
