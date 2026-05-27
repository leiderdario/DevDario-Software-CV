'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { ProceduralPlaceholder } from '@/components/ui/ProceduralPlaceholder';
import { triggerExit } from '@/components/effects/PageTransition';
import { cn } from '@/lib/cn';
import type { Showcase } from '@/lib/types';

export function FeaturedShowcase({ showcase }: { showcase: Showcase }) {
  const ref = useRef<HTMLElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();
  const vertical = showcase.side === 'vertical';

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;
      const mockup = el.querySelector<HTMLElement>('[data-mockup]');
      const features = Array.from(el.querySelectorAll<HTMLElement>('[data-feature]'));
      if (!mockup) return;

      if (reduced) {
        gsap.set(mockup, { clipPath: 'inset(0 0 0% 0)', scale: 1, autoAlpha: 1 });
        gsap.set(features, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(mockup, { clipPath: 'inset(0 0 100% 0)', scale: 1.1 });
      gsap.set(features, { autoAlpha: 0, y: 30 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      });

      // 0–33%: mockup reveal + settle
      tl.to(mockup, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1, ease: 'none' }, 0);
      // 33–66%: feature 1
      tl.to(features[0] ?? {}, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1);
      // 66–100%: features 2 & 3
      tl.to(features[1] ?? {}, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2);
      tl.to(features[2] ?? {}, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2.4);

      return () => {
        tl.kill();
        ScrollTrigger.refresh();
      };
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, lang, showcase.id],
  );

  const Mockup = (
    <div data-mockup className="mask-reveal relative w-full overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <div className="aspect-[16/11] w-full">
        <ProceduralPlaceholder
          gradient={showcase.gradient}
          variant={showcase.mockup}
          glyph={showcase.glyph}
          accent={showcase.accent}
        />
      </div>
    </div>
  );

  const Text = (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow mb-3">{showcase.eyebrow[lang]}</p>
        <h2 className="mb-4 font-medium tracking-tight text-[clamp(36px,5vw,80px)] leading-[0.98]">
          {showcase.title}
        </h2>
        <p className="max-w-prose text-[18px] leading-[1.5] text-[var(--color-text-dim)]">
          {showcase.blurb[lang]}
        </p>
      </div>

      <ul className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-6">
        <li className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
          {t('showcase.highlights')}
        </li>
        {showcase.features.map((f) => (
          <li
            key={f.id}
            data-feature
            className="flex items-start gap-3 text-[clamp(16px,1.5vw,22px)] leading-snug text-[var(--color-text)]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: showcase.accent }} />
            {f.text[lang]}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => showcase.badgeUrl && triggerExit(showcase.badgeUrl)}
        data-cursor={showcase.badgeUrl ? 'external' : undefined}
        className={cn(
          'self-start font-serif text-base italic text-[var(--color-text-dim)]',
          showcase.badgeUrl && 'transition-colors hover:text-[var(--color-accent)]',
        )}
      >
        {showcase.badge[lang]}
      </button>
    </div>
  );

  return (
    <section
      ref={ref}
      id={`showcase-${showcase.id}`}
      data-section="showcase"
      data-bg="#0e0e0e"
      className="flex min-h-[100svh] items-center overflow-hidden bg-[var(--color-bg)] py-20"
    >
      <div className="container-x w-full">
        {vertical ? (
          <div className="flex flex-col gap-12">
            {Text}
            {Mockup}
          </div>
        ) : (
          <div
            className={cn(
              'grid grid-cols-1 items-center gap-12 lg:grid-cols-5 lg:gap-16',
            )}
          >
            <div className={cn('lg:col-span-3', showcase.side === 'right' && 'lg:order-2')}>{Mockup}</div>
            <div className={cn('lg:col-span-2', showcase.side === 'right' && 'lg:order-1')}>{Text}</div>
          </div>
        )}
      </div>
    </section>
  );
}
