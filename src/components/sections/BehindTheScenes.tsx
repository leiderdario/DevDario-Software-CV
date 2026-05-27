'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { ProceduralPlaceholder } from '@/components/ui/ProceduralPlaceholder';
import { POLAROIDS } from '@/lib/data/behindTheScenes';

// Asymmetric column spans for a scrapbook feel (lg grid is 12 cols).
const SPANS = ['lg:col-span-5', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-3', 'lg:col-span-5'];

export function BehindTheScenes() {
  const ref = useRef<HTMLElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-polaroid]'));
      if (!cards.length) return;

      if (reduced) {
        gsap.set(cards, { rotate: 0, scale: 1 });
        return;
      }

      cards.forEach((card) => {
        const from = parseFloat(card.dataset.rotate ?? '0');
        gsap.fromTo(
          card,
          { rotate: from, scale: 0.94 },
          {
            rotate: 0,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 45%',
              scrub: 1,
            },
          },
        );
      });

      return () => ScrollTrigger.refresh();
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced],
  );

  return (
    <section
      ref={ref}
      id="behind-the-scenes"
      data-section="behind"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-3">{t('behindscenes.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
                {t('behindscenes.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[18px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-4 md:col-start-9">
            {t('behindscenes.lead')}
          </p>
        </div>

        <div className="grid grid-cols-2 items-start gap-6 md:gap-10 lg:grid-cols-12">
          {POLAROIDS.map((p, i) => (
            <figure
              key={p.id}
              data-polaroid
              data-rotate={p.rotate}
              className={`${SPANS[i] ?? 'lg:col-span-4'} rounded-sm bg-[#f4f3ef] p-3 pb-4 shadow-2xl shadow-black/40`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <ProceduralPlaceholder
                  gradient={p.gradient}
                  variant="polaroid"
                  glyph={p.glyph}
                  seed={i}
                />
              </div>
              <figcaption className="mt-3 px-1">
                <p className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
                  {p.place} · {p.date}
                </p>
                <p className="mt-1 font-serif text-base italic text-neutral-800">{p.caption[lang]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
