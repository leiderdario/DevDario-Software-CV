'use client';

import { EXPERIENCE } from '@/lib/data/experience';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Experience() {
  const { lang, t } = useTranslation();
  return (
    <section
      id="experience"
      data-section="experience"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-10">
          <p className="eyebrow mb-3">{t('experience.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(32px,4vw,64px)] leading-[1.0]">
              {t('experience.title')}
            </h2>
          </MaskReveal>
        </div>

        <ol className="flex flex-col">
          {EXPERIENCE.map((exp, i) => (
            <li
              key={exp.id}
              className="group grid grid-cols-1 gap-6 border-t border-[var(--color-border)] py-6 transition-colors hover:bg-white/[0.015] md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm text-[var(--color-text-dim)]">{exp.period[lang]}</p>
                <p className="mt-1 text-xs text-[var(--color-text-dim)]">{exp.location}</p>
              </div>
              <div className="md:col-span-5">
                <h3 className="font-serif text-[clamp(20px,2vw,28px)] leading-tight transition-colors group-hover:text-[var(--color-accent)]">
                  {exp.company}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-dim)]">{exp.role[lang]}</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-[var(--color-text)] md:col-span-5">
                {exp.bullets[lang].map((b, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="text-[var(--color-accent)]">/</span>
                    <span className="text-[var(--color-text-dim)]">{b}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
