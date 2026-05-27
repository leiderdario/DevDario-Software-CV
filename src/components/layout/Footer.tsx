'use client';

import { useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { FOOTER_COLUMNS } from '@/lib/data/nav';
import { useMagnetic } from '@/components/effects/useMagnetic';

export function Footer() {
  const { lang, t } = useTranslation();
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(emailRef, 0.4);

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)] pb-10 pt-24">
      <div className="container-x">
        <h2 className="mb-12 max-w-[18ch] font-serif text-[clamp(56px,10vw,180px)] leading-[0.92] tracking-[-0.02em]">
          {t('footer.cta.line1')} <span className="text-[var(--color-accent)]">{t('footer.cta.line2')}</span>
        </h2>

        <a
          ref={emailRef}
          href="mailto:lbolanoa1@unicartagena.edu.co"
          data-cursor="copy"
          className="magnetic mb-16 inline-block break-words font-serif text-[clamp(28px,5vw,72px)] leading-[1.05] underline decoration-[var(--color-border)] underline-offset-8 transition-colors hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
        >
          lbolanoa1@unicartagena.edu.co
        </a>

        <div className="grid grid-cols-1 gap-12 border-t border-[var(--color-border)] pt-12 md:grid-cols-3">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col gap-3">
              <h3 className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
                {col.title[lang]}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.items.map((item, i) => {
                  const label =
                    typeof item.label === 'string' ? item.label : item.label[lang];
                  return (
                    <li key={i}>
                      <MagneticLink
                        href={item.href}
                        strength={0.2}
                        className="text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
                        data-cursor="open"
                      >
                        {label}
                      </MagneticLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-text-dim)] md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} Leider Dario Bolaño Agámez · {t('footer.role')}
          </span>
          <span>{t('footer.tagline')}</span>
        </div>
      </div>
    </footer>
  );
}
