'use client';

import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useTranslation();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
      aria-label={t('lang.aria')}
      data-cursor="open"
      className={cn(
        'group inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
        className,
      )}
    >
      <span className={cn(lang === 'es' && 'text-[var(--color-accent)]')}>ES</span>
      <span className="text-[var(--color-text-dim)]">/</span>
      <span className={cn(lang === 'en' && 'text-[var(--color-accent)]')}>EN</span>
    </button>
  );
}
