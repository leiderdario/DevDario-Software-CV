'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { Counter } from '@/components/ui/Counter';

const STATS = [
  { target: 3, suffix: '+', key: 'about.stats.years' },
  { target: 5, suffix: '', key: 'about.stats.projects' },
  { target: 7, suffix: '', key: 'about.stats.team' },
];

export function About() {
  const { lang, t } = useTranslation();
  void lang;
  return (
    <section
      id="about"
      data-section="about"
      data-bg="#131313"
      style={{ '--stack-index': 1, zIndex: 2 } as CSSProperties}
      className="sticky-stack bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-4">
          <MaskReveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
              <Image
                src="/assets/profile.jpg"
                alt="Leider Dario Bolaño Agámez"
                fill
                sizes="(min-width:768px) 32vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </MaskReveal>
        </div>

        <div className="md:col-span-8">
          <p className="eyebrow mb-3">{t('about.eyebrow')}</p>
          <SplitTextReveal
            as="h2"
            type="lines"
            stagger={0.1}
            className="mb-6 font-medium tracking-tight text-[clamp(32px,4vw,64px)] leading-[1.0]"
          >
            {t('about.title')}
          </SplitTextReveal>
          <SplitTextReveal
            as="p"
            type="words"
            stagger={0.012}
            className="max-w-prose text-[16px] leading-[1.55] text-[var(--color-text-dim)]"
          >
            {t('about.bio')}
          </SplitTextReveal>

          <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-6">
            {STATS.map((s) => (
              <div key={s.key}>
                <dt className="mb-2 font-serif text-[clamp(24px,3vw,40px)] leading-none text-[var(--color-accent)]">
                  <Counter target={s.target} suffix={s.suffix} />
                </dt>
                <dd className="text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                  {t(s.key)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
