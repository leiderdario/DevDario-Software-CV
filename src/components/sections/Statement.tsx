'use client';

import type { CSSProperties } from 'react';
import { useTranslation } from '@/lib/i18n';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { MagneticLink } from '@/components/ui/MagneticLink';

export function Statement() {
  const { t } = useTranslation();
  return (
    <section
      id="statement"
      data-section="statement"
      data-bg="#1a1410"
      style={{ '--stack-index': 0, zIndex: 1 } as CSSProperties}
      className="sticky-stack border-y border-[var(--color-border)] bg-[#1a1410] py-[var(--section-pad-y,96px)]"
    >
      <div className="container-x flex flex-col items-start gap-8">
        <SplitTextReveal
          as="h2"
          type="lines"
          stagger={0.12}
          className="max-w-[18ch] font-serif text-[clamp(40px,7vw,120px)] leading-[1.02] tracking-[-0.02em]"
        >
          {t('statement.title')}
        </SplitTextReveal>

        <MagneticLink
          href="#contact"
          strength={0.35}
          data-cursor="open"
          className="inline-flex items-center gap-3 rounded-full bg-[var(--color-accent)] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[var(--color-bg)]"
        >
          {t('statement.cta')} →
        </MagneticLink>
      </div>
    </section>
  );
}
