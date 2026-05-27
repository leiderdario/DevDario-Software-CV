'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Check, Copy, Mail } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { MagneticLink } from '@/components/ui/MagneticLink';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { useMagnetic } from '@/components/effects/useMagnetic';

const EMAIL = 'lbolanoa1@unicartagena.edu.co';

export function Contact() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  useMagnetic(emailRef, 0.5);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      if (toastRef.current) {
        gsap.fromTo(
          toastRef.current,
          { clipPath: 'inset(0 100% 0 0)', y: 0 },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'expo.out' },
        );
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <section
      id="contact"
      data-section="contact"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,160px)]"
    >
      <div className="container-x">
        <p className="eyebrow mb-3">{t('contact.eyebrow')}</p>

        <h2 className="font-medium leading-[0.9] tracking-[-0.04em] text-[clamp(80px,18vw,360px)]">
          <SplitTextReveal as="span" type="words" stagger={0.1} className="block">
            {t('contact.title.line1')}
          </SplitTextReveal>
          <SplitTextReveal
            as="span"
            type="words"
            delay={0.15}
            stagger={0.1}
            className="block font-serif italic text-[var(--color-accent)]"
          >
            {t('contact.title.line2')}
          </SplitTextReveal>
        </h2>

        <p className="mt-8 max-w-prose text-[clamp(16px,1.4vw,22px)] leading-[1.5] text-[var(--color-text-dim)]">
          {t('contact.subline')}
        </p>

        <div className="mt-16 flex flex-col gap-8 border-t border-[var(--color-border)] pt-12 md:flex-row md:items-center md:justify-between">
          <a
            ref={emailRef}
            href={`mailto:${EMAIL}`}
            data-cursor="copy"
            className="magnetic inline-flex items-baseline gap-3 break-words font-serif text-[clamp(24px,4vw,56px)] leading-[1.1] tracking-tight underline decoration-[var(--color-border)] underline-offset-[10px] transition-colors hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
          >
            <Mail className="self-center text-[var(--color-text-dim)]" size={28} />
            {EMAIL}
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              data-cursor="copy"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t('contact.copied') : t('contact.copy')}
            </button>
            <MagneticLink
              href={`mailto:${EMAIL}`}
              data-cursor="open"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              {t('contact.write')} →
            </MagneticLink>
          </div>
        </div>

        <div
          ref={toastRef}
          aria-live="polite"
          className="pointer-events-none fixed bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-5 py-2 text-xs font-medium text-white"
          style={{ clipPath: 'inset(0 100% 0 0)' }}
        >
          {t('contact.copied')} · {EMAIL}
        </div>
      </div>
    </section>
  );
}
