'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { triggerExit } from '@/components/effects/PageTransition';
import { ARCHIVES } from '@/lib/data/archives';

export function Archives() {
  const ref = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const rows = el.querySelectorAll<HTMLElement>('[data-archive-row]');
      gsap.from(rows, {
        x: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      });
      return () => ScrollTrigger.refresh();
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced],
  );

  const onMove = (e: React.MouseEvent) => {
    const node = previewRef.current;
    if (!node) return;
    node.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 40}px)`;
  };

  const active = ARCHIVES.find((r) => r.id === hovered) ?? null;

  return (
    <section
      ref={ref}
      id="archives"
      data-section="archives"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
      onMouseMove={onMove}
    >
      <div className="container-x">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-3">{t('archives.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
                {t('archives.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[18px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-4 md:col-start-9">
            {t('archives.lead')}
          </p>
        </div>

        <div className="hidden grid-cols-12 gap-4 border-b border-[var(--color-border)] pb-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)] md:grid">
          <span className="col-span-1">{t('archives.col.year')}</span>
          <span className="col-span-6">{t('archives.col.project')}</span>
          <span className="col-span-3">{t('archives.col.lang')}</span>
          <span className="col-span-2 text-right">{t('archives.col.stars')}</span>
        </div>

        <ul onMouseLeave={() => setHovered(null)}>
          {ARCHIVES.map((row) => (
            <li
              key={row.id}
              data-archive-row
              onMouseEnter={() => setHovered(row.id)}
              onClick={() => triggerExit(row.url)}
              data-cursor="external"
              className="group grid cursor-pointer grid-cols-12 items-center gap-4 border-b border-[var(--color-border)] py-5 transition-all duration-300"
              style={{
                opacity: hovered && hovered !== row.id ? 0.3 : 1,
                paddingLeft: hovered === row.id ? '0.75rem' : '0',
              }}
            >
              <span className="col-span-3 font-mono text-sm text-[var(--color-text-dim)] md:col-span-1">
                {row.year}
              </span>
              <span className="col-span-9 font-serif text-[clamp(20px,2.4vw,34px)] leading-tight tracking-tight transition-colors group-hover:text-[var(--color-accent)] md:col-span-6">
                {row.name}
              </span>
              <span className="col-span-3 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)] md:col-span-3">
                {row.language}
              </span>
              <span className="col-span-2 hidden items-center justify-end gap-2 font-mono text-sm text-[var(--color-text-dim)] md:flex">
                ★ {row.stars}
                <ArrowUpRight
                  size={16}
                  className="text-[var(--color-text-dim)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                />
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor-following preview */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-4 shadow-2xl md:block"
        style={{ opacity: active ? 1 : 0, transition: 'opacity 0.25s' }}
      >
        {active && (
          <>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
              {active.language} · ★ {active.stars}
            </p>
            <p className="text-sm leading-snug text-[var(--color-text)]">{active.description[lang]}</p>
          </>
        )}
      </div>
    </section>
  );
}
