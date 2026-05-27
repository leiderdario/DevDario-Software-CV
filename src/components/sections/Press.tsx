'use client';

import { PRESS } from '@/lib/data/press';
import { useTranslation } from '@/lib/i18n';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Press() {
  const { lang, t } = useTranslation();
  return (
    <section
      id="press"
      data-section="press"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-12">
          <p className="eyebrow mb-3">{t('press.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
              {t('press.title')}
            </h2>
          </MaskReveal>
        </div>

        <ol className="flex flex-col">
          {PRESS.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-12 items-baseline gap-4 border-t border-[var(--color-border)] py-8 transition-colors hover:text-[var(--color-accent)]"
              data-cursor="open"
              data-press-item
            >
              <span className="col-span-2 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                {p.index}
              </span>
              <h3 className="col-span-7 font-serif text-[clamp(20px,2.4vw,40px)] leading-tight">
                {p.title[lang]}
              </h3>
              <span className="col-span-3 text-right text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                {p.meta[lang]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
