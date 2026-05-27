'use client';

import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { PROCESS } from '@/lib/data/process';
import type { CSSProperties } from 'react';

const CARD_BG = ['#161616', '#191512', '#1a1410', '#14110d'];

export function Process() {
  const { lang, t } = useTranslation();

  return (
    <section
      id="process"
      data-section="process"
      data-bg="#0e0e0e"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-16">
          <p className="eyebrow mb-3">{t('process.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
              {t('process.title')}
            </h2>
          </MaskReveal>
        </div>

        <div className="flex flex-col gap-6">
          {PROCESS.map((step, i) => (
            <article
              key={step.id}
              className="sticky-stack"
              data-process-card
              style={{ '--stack-index': i, zIndex: i + 1 } as CSSProperties}
            >
              <div
                className="grid grid-cols-1 gap-6 rounded-2xl border border-[var(--color-border)] p-8 md:grid-cols-12 md:items-center md:p-12"
                style={{ backgroundColor: CARD_BG[i] ?? '#161616' }}
              >
                <span
                  aria-hidden
                  className="font-serif italic leading-none text-[var(--color-accent)] text-[clamp(56px,9vw,140px)] md:col-span-4"
                >
                  {step.index}
                </span>
                <div className="md:col-span-8">
                  <h3 className="mb-4 font-medium tracking-tight text-[clamp(28px,3.5vw,52px)] leading-[1.05]">
                    {step.title[lang]}
                  </h3>
                  <p className="max-w-prose text-[18px] leading-[1.55] text-[var(--color-text-dim)]">
                    {step.body[lang]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
