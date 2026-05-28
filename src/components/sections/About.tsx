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
        <div className="md:col-span-5">
          <MaskReveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
              <Image
                src="/assets/profile.jpg"
                alt="Leider Dario Bolaño Agámez"
                fill
                sizes="(min-width:768px) 40vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </MaskReveal>
        </div>

        <div className="md:col-span-7">
          <p className="eyebrow mb-3">{t('about.eyebrow')}</p>
          <SplitTextReveal
            as="h2"
            type="lines"
            stagger={0.1}
            className="mb-8 font-medium tracking-tight text-[clamp(36px,5vw,80px)] leading-[1.0]"
          >
            {t('about.title')}
          </SplitTextReveal>
          <SplitTextReveal
            as="p"
            type="words"
            stagger={0.012}
            className="max-w-prose text-[18px] leading-[1.55] text-[var(--color-text-dim)]"
          >
            {t('about.bio')}
          </SplitTextReveal>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-8">
            {STATS.map((s) => (
              <div key={s.key}>
                <dt className="mb-2 font-serif text-[clamp(32px,4vw,56px)] leading-none text-[var(--color-accent)]">
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
