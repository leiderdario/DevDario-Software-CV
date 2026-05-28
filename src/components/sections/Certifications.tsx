'use client';

import { CERTIFICATIONS } from '@/lib/data/certifications';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Certifications() {
  const { lang, t } = useTranslation();
  return (
    <section
      id="certifications"
      data-section="certifications"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">{t('certifications.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
              {t('certifications.title')}
            </h2>
          </MaskReveal>
        </div>

        <ul className="flex flex-col md:col-span-8">
          {CERTIFICATIONS.map((cert) => (
            <li
              key={cert.id}
              className="grid grid-cols-1 gap-2 border-t border-[var(--color-border)] py-6 transition-colors hover:bg-white/[0.015] md:grid-cols-12 md:items-baseline md:gap-6"
            >
              <h3 className="font-serif text-[clamp(18px,1.6vw,24px)] leading-tight md:col-span-7">
                {cert.title[lang]}
              </h3>
              <span className="text-sm text-[var(--color-text-dim)] md:col-span-3">
                {cert.issuer}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)] md:col-span-2 md:text-right">
                {cert.period[lang]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
