'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';

const LINES = ['manifesto.line1', 'manifesto.line2', 'manifesto.line3'] as const;

export function Manifesto() {
  const ref = useRef<HTMLElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;
      const lineEls = Array.from(el.querySelectorAll<HTMLElement>('[data-manifesto-line]'));
      if (!lineEls.length) return;

      if (reduced) {
        gsap.set(lineEls, { opacity: 1 });
        return;
      }

      const splits = lineEls.map((line) => new SplitText(line, { type: 'chars' }));
      const allChars = splits.flatMap((s) => s.chars);
      gsap.set(allChars, { opacity: 0.12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      });

      splits.forEach((split, i) => {
        tl.to(
          split.chars,
          { opacity: 1, duration: 1, ease: 'none', stagger: 0.5 / split.chars.length },
          i,
        );
      });

      return () => {
        tl.kill();
        splits.forEach((s) => s.revert());
        ScrollTrigger.refresh();
      };
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, lang],
  );

  return (
    <section
      ref={ref}
      id="manifesto"
      data-section="manifesto"
      data-bg="#0e0e0e"
      className="flex min-h-[100svh] items-center bg-[var(--color-bg)]"
    >
      <div className="container-x">
        <p className="eyebrow mb-10">{t('manifesto.eyebrow')}</p>
        <div className="flex max-w-[24ch] flex-col gap-8 font-medium leading-[1.08] tracking-[-0.02em] text-[clamp(32px,5vw,72px)]">
          {LINES.map((key) => (
            <p key={key} data-manifesto-line>
              {t(key)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
