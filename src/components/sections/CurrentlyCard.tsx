'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Music, BookOpen, Wrench, MapPin, type LucideIcon } from 'lucide-react';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { CURRENTLY } from '@/lib/data/currently';
import type { CurrentlyItem } from '@/lib/types';

const ICONS: Record<CurrentlyItem['icon'], LucideIcon> = {
  music: Music,
  book: BookOpen,
  wrench: Wrench,
  pin: MapPin,
};

export function CurrentlyCard() {
  const { lang, t } = useTranslation();
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const values = Array.from(el.querySelectorAll<HTMLElement>('[data-typewriter]'));
      if (!values.length) return;

      values.forEach((node) => {
        const full = node.dataset.full ?? node.textContent ?? '';
        node.dataset.full = full;
        node.textContent = '';
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      values.forEach((node, i) => {
        const full = node.dataset.full ?? '';
        const state = { n: 0 };
        tl.to(
          state,
          {
            n: full.length,
            duration: Math.min(1.1, 0.25 + full.length * 0.02),
            ease: 'none',
            onUpdate: () => {
              node.textContent = full.slice(0, Math.round(state.n));
            },
          },
          i === 0 ? 0 : '>-0.05',
        );
      });

      return () => {
        tl.kill();
        values.forEach((node) => {
          if (node.dataset.full) node.textContent = node.dataset.full;
        });
        ScrollTrigger.refresh();
      };
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, lang],
  );

  return (
    <section
      ref={ref}
      id="currently"
      data-section="currently"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-12 md:py-16"
    >
      <div className="container-x">
        <p className="eyebrow mb-6">{t('currently.eyebrow')}</p>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {CURRENTLY.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.id} className="flex items-start gap-3 bg-[var(--color-bg)] p-6">
                <Icon size={18} className="mt-0.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                <div className="min-w-0">
                  <p className="mb-1 text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]">
                    {item.label[lang]}
                  </p>
                  <p
                    data-typewriter
                    data-full={item.value}
                    className="font-mono text-sm leading-snug text-[var(--color-text)]"
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
