'use client';

import { TRUSTED } from '@/lib/data/trusted';
import { useTranslation } from '@/lib/i18n';
import { Marquee } from '@/components/ui/Marquee';
import { MaskReveal } from '@/components/ui/MaskReveal';

function LogoCard({ name }: { name: string }) {
  return (
    <div
      data-trusted-card
      className="flex h-28 w-[clamp(220px,22vw,320px)] shrink-0 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]/60 px-6 text-center transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-alt)] md:h-36"
    >
      <span className="font-serif text-[clamp(20px,1.8vw,28px)] leading-tight tracking-tight text-[var(--color-text)]">
        {name}
      </span>
    </div>
  );
}

export function TrustedBy() {
  const { t } = useTranslation();
  const mid = Math.ceil(TRUSTED.length / 2);
  const rowOne = TRUSTED.slice(0, mid);
  const rowTwo = TRUSTED.slice(mid).concat(TRUSTED.slice(0, mid));

  return (
    <section
      id="trusted"
      data-section="trusted"
      data-bg="#131313"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg)] py-20"
    >
      <div className="container-x mb-12 flex items-end justify-between">
        <div>
          <p className="eyebrow mb-3">{t('trusted.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(28px,3.5vw,52px)]">
              {t('trusted.title')}
            </h2>
          </MaskReveal>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Marquee speed={45} direction={-1} hoverPause className="py-1">
          {rowOne.map((it) => (
            <LogoCard key={`a-${it.id}`} name={it.name} />
          ))}
        </Marquee>
        <Marquee speed={55} direction={1} hoverPause className="py-1">
          {rowTwo.map((it, i) => (
            <LogoCard key={`b-${it.id}-${i}`} name={it.name} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
