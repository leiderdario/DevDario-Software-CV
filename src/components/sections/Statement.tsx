'use client';

import type { CSSProperties } from 'react';
import { useTranslation } from '@/lib/i18n';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { RolesShowcase } from '@/components/ui/RolesShowcase';

export function Statement() {
  const { t } = useTranslation();
  return (
    <section
      id="statement"
      data-section="statement"
      data-bg="#1a1410"
      className="relative border-y border-[var(--color-border)] bg-[#1a1410] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x flex flex-col items-start gap-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full">
          <SplitTextReveal
            as="h2"
            type="lines"
            stagger={0.12}
            className="max-w-[18ch] font-serif text-[clamp(36px,5vw,72px)] leading-[1.02] tracking-[-0.02em]"
          >
            {t('statement.title')}
          </SplitTextReveal>

          <MagneticLink
            href="#contact"
            strength={0.35}
            data-cursor="open"
            className="inline-flex items-center gap-3 shrink-0 rounded-full bg-[var(--color-accent)] px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-white hover:text-[var(--color-bg)]"
          >
            {t('statement.cta')} →
          </MagneticLink>
        </div>

        <RolesShowcase />
      </div>
    </section>
  );
}
