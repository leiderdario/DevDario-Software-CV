'use client';
import { useContext } from 'react';
import { I18nContext } from '@/components/providers/I18nProvider';
import { DICT } from './dictionary';
import type { Lang } from './types';

export function useTranslation() {
  const ctx = useContext(I18nContext);
  const t = (key: string): string => {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[ctx.lang];
  };
  return { lang: ctx.lang as Lang, setLang: ctx.setLang, t };
}

export type { Lang } from './types';
