'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { TOOLBOX } from '@/lib/data/toolbox';

export function Toolbox() {
  const ref = useRef<HTMLElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const cols = Array.from(el.querySelectorAll<HTMLElement>('[data-toolbox-col]'));
      if (!cols.length) return;

      // Cascade by column (not by row): each column's chips animate in sequence.
      cols.forEach((col, colIndex) => {
        const chips = col.querySelectorAll<HTMLElement>('[data-chip]');
        gsap.from(chips, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.06,
          delay: colIndex * 0.12,
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        });
      });

      return () => ScrollTrigger.refresh();
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, lang],
  );

  return (
    <section
      ref={ref}
      id="toolbox"
      data-section="toolbox"
      data-bg="#0e0e0e"
      className="bg-[#0e0e0e] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">{t('toolbox.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
                {t('toolbox.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[18px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-5 md:col-start-8">
            {t('toolbox.lead')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLBOX.map((group) => (
            <div key={group.id} data-toolbox-col>
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                {group.title[lang]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.tools.map((tool) => (
                  <span
                    key={tool}
                    data-chip
                    className="rounded-md border border-[var(--color-border)] px-3 py-2 font-mono text-sm text-[var(--color-text)] transition-all duration-300 hover:scale-105 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
