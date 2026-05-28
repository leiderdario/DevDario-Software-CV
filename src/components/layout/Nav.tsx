'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { NAV_LINKS, CV_PDF_HREF } from '@/lib/data/nav';
import { useTranslation } from '@/lib/i18n';
import { LangToggle } from '@/components/ui/LangToggle';
import { cn } from '@/lib/cn';
import { Download } from 'lucide-react';

export function Nav() {
  const { lang, t } = useTranslation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      data-state={solid ? 'solid' : 'top'}
      className={cn(
        'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
        solid
          ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="container-x flex h-[68px] items-center justify-between gap-6">
        <Link
          href="#top"
          className="font-serif text-[20px] tracking-tight transition-all"
          data-cursor="open"
        >
          <span className={cn(solid ? 'hidden' : 'inline')}>Leider Dario</span>
          <span className={cn(solid ? 'inline' : 'hidden')}>/LD</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.href}
                className="text-sm text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-text)]"
                data-cursor="open"
              >
                {l.label[lang]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LangToggle />
          <a
            href={CV_PDF_HREF}
            download
            className="hidden items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] md:inline-flex"
            data-cursor="open"
          >
            <Download size={14} />
            {t('nav.cv')}
          </a>
          <a
            href="#contact"
            className="hidden rounded-full bg-[var(--color-text)] px-4 py-2 text-xs font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent)] md:inline-block"
            data-cursor="open"
          >
            {t('nav.cta')}
          </a>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden"
            data-cursor="open"
          >
            <div className="flex flex-col gap-1.5">
              <span className="h-px w-6 bg-[var(--color-text)]" />
              <span className="h-px w-6 bg-[var(--color-text)]" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden">
          <ul className="container-x flex flex-col gap-4 py-6">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  className="block font-serif text-2xl"
                  onClick={() => setOpen(false)}
                >
                  {l.label[lang]}
                </a>
              </li>
            ))}
            <li>
              <a
                href={CV_PDF_HREF}
                download
                className="inline-flex items-center gap-2 font-serif text-2xl text-[var(--color-accent)]"
                onClick={() => setOpen(false)}
              >
                <Download size={20} />
                {t('nav.cv')}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
