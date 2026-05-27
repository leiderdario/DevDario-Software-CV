'use client';

import { TRUSTED } from '@/lib/data/trusted';
import { useTranslation } from '@/lib/i18n';
import { Marquee } from '@/components/ui/Marquee';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function TrustedBy() {
  const { t } = useTranslation();
  return (
    <section
      id="trusted"
      data-section="trusted"
      data-bg="#131313"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg)] py-20"
    >
      <div className="container-x mb-10 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">{t('trusted.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(28px,3.5vw,52px)]">
              {t('trusted.title')}
            </h2>
          </MaskReveal>
        </div>
      </div>

      <Marquee speed={50}>
        {TRUSTED.map((it) => (
          <span
            key={it.id}
            data-wordmark
            className="whitespace-nowrap font-serif text-[clamp(28px,4vw,56px)] tracking-tight text-[var(--color-text-dim)] transition-colors duration-300 hover:text-[var(--color-accent)]"
          >
            {it.name}
            <span className="ml-[clamp(40px,6vw,96px)] text-[var(--color-border)]">•</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
