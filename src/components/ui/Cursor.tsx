'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from '@/lib/i18n';

type CursorState = 'default' | 'open' | 'external' | 'play' | 'drag' | 'copy';

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<SVGSVGElement | null>(null);
  const [state, setState] = useState<CursorState>('default');
  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      // Liquid ring: a fresh power3 tween each move, overwriting the last.
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power3.out', overwrite: true });
    };

    let lastMarquee: HTMLElement | null = null;
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const marquee = target?.closest?.('.marquee') as HTMLElement | null;

      if (lastMarquee && lastMarquee !== marquee) {
        lastMarquee.classList.remove('marquee-desaturate');
        lastMarquee = null;
      }
      if (marquee) {
        marquee.classList.add('marquee-desaturate');
        lastMarquee = marquee;
        setState('drag');
        return;
      }

      const el = target?.closest?.('[data-cursor]') as HTMLElement | null;
      setState(el ? ((el.dataset.cursor as CursorState) ?? 'default') : 'default');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      lastMarquee?.classList.remove('marquee-desaturate');
    };
  }, []);

  // Animate the arrow rotation when entering an "open/external" target.
  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;
    const showArrow = state === 'open' || state === 'external';
    gsap.to(arrow, {
      rotate: showArrow ? 45 : 0,
      opacity: showArrow ? 1 : 0,
      scale: showArrow ? 1 : 0.5,
      duration: 0.4,
      ease: 'back.out(1.7)',
    });
  }, [state]);

  const textLabel =
    state === 'drag' ? t('cursor.drag') : state === 'copy' ? t('cursor.copy') : '';

  const ringSize = state === 'default' ? 36 : state === 'play' ? 72 : 80;
  const ringBg =
    state === 'play'
      ? 'rgba(255,255,255,0.85)'
      : state !== 'default'
        ? 'rgba(255,107,53,0.16)'
        : 'transparent';

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
      </div>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden items-center justify-center rounded-full border border-[var(--color-text)]/40 backdrop-blur-sm md:flex"
        style={{
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          transition: 'width 0.35s var(--ease-expo), height 0.35s var(--ease-expo), margin 0.35s var(--ease-expo), background-color 0.3s',
          backgroundColor: ringBg,
        }}
      >
        {/* 45° arrow for open/external */}
        <svg
          ref={arrowRef}
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
          style={{ opacity: 0, transform: 'scale(0.5)' }}
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>

        {/* play triangle for video */}
        {state === 'play' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#111" aria-hidden>
            <polygon points="6 4 20 12 6 20" />
          </svg>
        )}

        {/* text label for drag/copy */}
        {textLabel && (
          <span className="select-none text-[10px] font-medium uppercase tracking-wider text-[var(--color-text)]">
            {textLabel}
          </span>
        )}
      </div>
    </>
  );
}
