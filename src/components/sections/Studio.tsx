'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { useTranslation } from '@/lib/i18n';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { ArrowUpRight } from 'lucide-react';

export function Studio() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const card = cardRef.current;
    if (!card) return;
    e.preventDefault();
    const href = (e.currentTarget as HTMLAnchorElement).href;

    gsap.registerPlugin(Flip);
    const state = Flip.getState(card);
    card.classList.add('studio-fullscreen');
    Flip.from(state, {
      duration: 0.9,
      ease: 'expo.inOut',
      absolute: true,
      onComplete: () => {
        window.open(href, '_blank', 'noopener,noreferrer');
        setTimeout(() => {
          card.classList.remove('studio-fullscreen');
        }, 500);
      },
    });
  };

  return (
    <section
      id="studio"
      data-section="studio"
      data-bg="#1a1410"
      className="relative border-y border-[var(--color-border)] bg-[#1a1410] py-[var(--section-pad-y,120px)]"
    >
      <style jsx global>{`
        .studio-fullscreen {
          position: fixed !important;
          inset: 0 !important;
          z-index: 9999;
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      <div className="container-x">
        <p className="eyebrow mb-3">{t('studio.eyebrow')}</p>
        <MaskReveal>
          <h2 className="mb-6 font-serif text-[clamp(36px,5vw,72px)] leading-[1.0] tracking-[-0.02em]">
            {t('studio.title')}
          </h2>
        </MaskReveal>

        <div
          ref={cardRef}
          className="relative grid grid-cols-1 gap-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 md:grid-cols-2 md:p-8"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, rgba(255,107,53,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(124,77,255,0.18), transparent 55%)',
            }}
          />
          <p className="max-w-prose text-[16px] leading-[1.55] text-[var(--color-text)]">
            {t('studio.lead')}
          </p>
          <div className="flex items-end justify-end">
            <MagneticLink
              href="https://3digitallfactory.com/"
              onClick={handleClick}
              data-cursor="external"
              strength={0.4}
              className="inline-flex items-center gap-3 rounded-full bg-[var(--color-text)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              {t('studio.cta')}
              <ArrowUpRight size={16} />
            </MagneticLink>
          </div>
        </div>
      </div>
    </section>
  );
}
