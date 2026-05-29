'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { NAV_LINKS, CV_PDF_HREF, CONTACT_EMAIL } from '@/lib/data/nav';
import { useTranslation } from '@/lib/i18n';
import { LangToggle } from '@/components/ui/LangToggle';
import { cn } from '@/lib/cn';
import { Download, X } from 'lucide-react';

const SOCIALS: { label: string; href: string; external?: boolean }[] = [
  { label: 'GitHub', href: 'https://github.com/leiderdario', external: true },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
  { label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
];

export function Nav() {
  const { lang, t } = useTranslation();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const socialsRef = useRef<HTMLDivElement | null>(null);

  // Solid background after scroll.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track which section is closest to viewport top so we can highlight it.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const onScroll = () => {
      let current = '';
      const offset = window.innerHeight * 0.35;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Open / close — panel slide handled by CSS transition (more reliable than
  // GSAP fighting React inline style). GSAP only handles the item stagger.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-menu-item]') ?? [];
    const socials = socialsRef.current;
    if (items.length) {
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'expo.out', stagger: 0.06, delay: 0.25 },
      );
    }
    if (socials) {
      gsap.fromTo(
        socials,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out', delay: 0.5 },
      );
    }
  }, [open]);

  const close = () => setOpen(false);

  const goTo = (href: string) => {
    close();
    // Defer the hash jump until the panel finishes sliding out so the underlying
    // page transition feels smooth.
    setTimeout(() => {
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.hash = href;
    }, 350);
  };

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <nav
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

          <div className="flex items-center gap-3">
            <LangToggle />
            <a
              href={CV_PDF_HREF}
              download
              className="hidden items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:inline-flex"
              data-cursor="open"
            >
              <Download size={14} />
              {t('nav.cv')}
            </a>
            <button
              type="button"
              aria-label={lang === 'es' ? 'Abrir menú' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              data-cursor="open"
            >
              <span>{lang === 'es' ? 'Menú' : 'Menu'}</span>
              <div className="flex flex-col gap-1">
                <span className="h-px w-5 bg-current transition-transform group-hover:translate-x-0.5" />
                <span className="h-px w-5 bg-current transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay menu — full-screen on mobile, side panel ~40% on desktop */}
      <div
        ref={overlayRef}
        className={cn(
          'fixed inset-0 z-[200]',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        {/* Backdrop (only visible on md+ where panel doesn't cover screen) */}
        <button
          type="button"
          aria-label={lang === 'es' ? 'Cerrar menú' : 'Close menu'}
          onClick={close}
          tabIndex={open ? 0 : -1}
          className={cn(
            'absolute inset-0 hidden bg-black/55 backdrop-blur-[2px] transition-opacity duration-[650ms] md:block',
            open ? 'opacity-100' : 'opacity-0',
          )}
          data-cursor="open"
        />

        {/* Panel */}
        <div
          ref={panelRef}
          className={cn(
            'absolute inset-y-0 right-0 flex h-full w-full flex-col bg-[var(--color-text)] text-[var(--color-bg)] transition-transform duration-[650ms]',
            'md:w-[42%] md:min-w-[460px] md:max-w-[640px] md:shadow-[0_0_60px_rgba(0,0,0,0.6)]',
            open ? 'translate-x-0' : 'translate-x-full',
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
        >
          {/* Top bar with logo + close */}
          <div className="flex h-[68px] shrink-0 items-center justify-between px-6 md:px-10">
            <span className="font-serif text-[20px] tracking-tight">Leider Dario</span>
            <button
              type="button"
              onClick={close}
              aria-label={lang === 'es' ? 'Cerrar menú' : 'Close menu'}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:text-[var(--color-accent)]"
              data-cursor="open"
            >
              <span>{lang === 'es' ? 'Cerrar' : 'Close'}</span>
              <X size={18} />
            </button>
          </div>

          {/* Numbered nav list */}
          <div className="flex flex-1 items-center overflow-y-auto px-6 py-4 md:px-10">
            <ul ref={listRef} className="flex w-full flex-col">
              {NAV_LINKS.map((l, i) => {
                const id = l.href.replace('#', '');
                const isActive = activeId === id;
                return (
                  <li key={l.id} data-menu-item className="relative">
                    <button
                      type="button"
                      onClick={() => goTo(l.href)}
                      data-cursor="open"
                      className={cn(
                        'group/item flex w-full items-baseline gap-3 py-0.5 text-left font-medium uppercase leading-[1.05] tracking-[-0.02em] transition-colors',
                        'text-[clamp(34px,8vw,84px)] md:text-[clamp(28px,3.4vw,60px)]',
                        isActive
                          ? 'text-[var(--color-accent)]'
                          : 'text-[var(--color-bg)] hover:text-[var(--color-accent)]',
                      )}
                    >
                      <span>{l.label[lang]}</span>
                      <sup className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] md:text-[11px]">
                        {String(i + 1).padStart(2, '0')}
                      </sup>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Socials + CV at the bottom */}
          <div
            ref={socialsRef}
            className="flex shrink-0 flex-col gap-4 border-t border-[var(--color-bg)]/15 px-6 pb-8 pt-6 md:px-10"
          >
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {lang === 'es' ? 'Redes' : 'Socials'}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.external ? '_blank' : undefined}
                    rel={s.external ? 'noopener noreferrer' : undefined}
                    onClick={() => !s.external && close()}
                    className="transition-colors hover:text-[var(--color-accent)]"
                    data-cursor={s.external ? 'external' : 'open'}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
            <a
              href={CV_PDF_HREF}
              download
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-bg)]/25 px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              data-cursor="open"
            >
              <Download size={14} />
              {t('nav.cv')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
