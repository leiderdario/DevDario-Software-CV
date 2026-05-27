'use client';

import { EDUCATION } from '@/lib/data/education';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Education() {
  const { lang, t } = useTranslation();
  return (
    <section
      id="education"
      data-section="education"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">{t('education.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
              {t('education.title')}
            </h2>
          </MaskReveal>
        </div>

        <ul className="flex flex-col md:col-span-8">
          {EDUCATION.map((edu) => (
            <li
              key={edu.id}
              className="border-t border-[var(--color-border)] py-8 first:border-t-0"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <h3 className="font-serif text-[clamp(20px,2.2vw,32px)] leading-tight">
                  {edu.institution}
                </h3>
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                  {edu.period[lang]}
                </span>
              </div>
              <p className="mt-2 text-sm text-[var(--color-text)]">{edu.program[lang]}</p>
              {edu.details && (
                <p className="mt-2 text-sm text-[var(--color-text-dim)]">{edu.details[lang]}</p>
              )}
              <p className="mt-1 text-xs text-[var(--color-text-dim)]">{edu.location}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
