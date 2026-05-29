'use client';

import { ACHIEVEMENTS } from '@/lib/data/achievements';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Achievements() {
  const { lang, t } = useTranslation();
  return (
    <section
      id="achievements"
      data-section="achievements"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-8">
          <p className="eyebrow mb-3">{t('achievements.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(32px,4vw,64px)] leading-[1.0]">
              {t('achievements.title')}
            </h2>
          </MaskReveal>
        </div>

        <ol className="flex flex-col">
          {ACHIEVEMENTS.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-[var(--color-border)] py-5 transition-colors hover:text-[var(--color-accent)]"
              data-cursor="open"
            >
              <span className="col-span-2 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                {item.index}
              </span>
              <div className="col-span-7">
                <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {item.label[lang]}
                </p>
                <h3 className="font-serif text-[clamp(18px,1.8vw,28px)] leading-tight">
                  {item.title[lang]}
                </h3>
              </div>
              <span className="col-span-3 text-right text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                {item.meta[lang]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
