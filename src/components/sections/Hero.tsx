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
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40"
    >
      <Image
        src="/assets/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover opacity-15"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />

      <div className="container-x relative flex w-full flex-col gap-10">
        <p className="eyebrow">{t('hero.eyebrow')}</p>

        <h1
          key={`title-${revealKey}`}
          className="font-medium tracking-[-0.03em] text-[clamp(48px,9vw,140px)] leading-[0.92]"
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

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <SplitTextReveal
            as="p"
            type="words"
            delay={0.55}
            stagger={0.02}
            className="text-[clamp(16px,1.3vw,20px)] leading-[1.55] text-[var(--color-text-dim)] md:col-span-7 md:col-start-6"
          >
            {t('hero.lead')}
          </SplitTextReveal>
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
