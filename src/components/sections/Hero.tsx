'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';

const AUDIENCES_ES = ['startups', 'el gobierno', 'EdTech', 'fintech', 'innovadores en IA', 'plataformas SaaS', 'industrias'];
const AUDIENCES_EN = ['startups', 'government', 'EdTech', 'fintech', 'AI innovators', 'SaaS platforms', 'industries'];

export function Hero() {
  const { lang, t } = useTranslation();
  const audiences = lang === 'es' ? AUDIENCES_ES : AUDIENCES_EN;
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const [revealKey, setRevealKey] = useState(0);

  useEffect(() => {
    const cb = () => setRevealKey((k) => k + 1);
    window.addEventListener('preloader:done', cb);
    return () => window.removeEventListener('preloader:done', cb);
  }, []);

  useEffect(() => {
    if (reduced) return;
    // Exit the current word (rotate up), then advance — the entrance effect rotates the next in.
    const interval = setInterval(() => {
      const el = wordRef.current;
      const advance = () => setIdx((i) => (i + 1) % audiences.length);
      if (!el) return advance();
      gsap.to(el, { rotateX: -90, opacity: 0, duration: 0.5, ease: 'snap', onComplete: advance });
    }, 2300);
    return () => clearInterval(interval);
  }, [reduced, audiences.length]);

  useEffect(() => {
    if (reduced) return;
    const el = wordRef.current;
    if (!el) return;
    // 3D vertical carousel: each word rotates in around the X axis.
    gsap.fromTo(
      el,
      { rotateX: 90, opacity: 0 },
      { rotateX: 0, opacity: 1, duration: 0.7, ease: 'snap' },
    );
  }, [idx, reduced]);

  return (
    <section
      id="top"
      data-section="hero"
      data-bg="#131313"
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden pb-12 pt-32 md:pb-20 md:pt-40"
    >
      <div className="container-x relative flex w-full flex-col gap-10">
        <p className="eyebrow">{t('hero.eyebrow')}</p>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Image
              src="/assets/profile.jpg"
              alt={t('hero.photoAlt')}
              width={896}
              height={1152}
              priority
              sizes="(min-width:1024px) 45vw, 100vw"
              className="aspect-[4/5] w-full rounded-2xl object-cover object-center"
            />
          </div>

          <div className="flex flex-col gap-8 lg:col-span-7">
            <h1
              key={`title-${revealKey}`}
              className="font-medium leading-[0.95] tracking-[-0.03em] text-[clamp(40px,6vw,96px)]"
            >
              <SplitTextReveal as="span" type="lines" stagger={0.1} className="block">
                {t('hero.title.line1')}
              </SplitTextReveal>
              <SplitTextReveal
                as="span"
                type="lines"
                delay={0.15}
                stagger={0.1}
                className="block font-serif italic text-[var(--color-text)]"
              >
                {t('hero.title.line2')}
              </SplitTextReveal>
              <span className="mt-2 flex flex-wrap items-baseline gap-x-4">
                <SplitTextReveal as="span" type="lines" delay={0.3} stagger={0.1}>
                  {t('hero.title.line3')}
                </SplitTextReveal>
                <span
                  className="relative inline-block align-baseline"
                  style={{ perspective: '600px' }}
                >
                  <span
                    ref={wordRef}
                    className="inline-block font-serif italic text-[var(--color-accent)]"
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
                  >
                    {audiences[idx]}
                  </span>
                </span>
                <span aria-hidden>.</span>
              </span>
            </h1>

            <SplitTextReveal
              as="p"
              type="words"
              delay={0.55}
              stagger={0.02}
              className="max-w-prose text-[clamp(16px,1.2vw,19px)] leading-[1.6] text-[var(--color-text-dim)]"
            >
              {t('hero.lead')}
            </SplitTextReveal>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
            {t('hero.scroll')}
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
            Cartagena · COL
          </span>
        </div>
      </div>
    </section>
  );
}
