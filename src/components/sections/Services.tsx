'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { SERVICES } from '@/lib/data/services';
import { useTranslation } from '@/lib/i18n';
import { ServiceLine } from '@/components/ui/ServiceLine';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Services() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const { lang, t } = useTranslation();

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const lines = el.querySelectorAll<HTMLElement>('.service-line');
      if (!lines.length) return;
      if (window.matchMedia('(max-width: 768px)').matches) {
        gsap.from(lines, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        });
        return;
      }
      gsap.from(lines, {
        opacity: 0,
        x: -60,
        ease: 'none',
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=1200',
          pin: true,
          scrub: 0.6,
        },
      });
      return () => ScrollTrigger.refresh();
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, lang],
  );

  return (
    <section
      ref={ref}
      id="services"
      data-section="services"
      data-bg="#0e0e0e"
      className="relative bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x mb-10 grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow mb-3">{t('services.eyebrow')}</p>
          <MaskReveal>
            <h2 className="font-medium tracking-tight text-[clamp(32px,4vw,64px)] leading-[1.0]">
              {t('services.title')}
            </h2>
          </MaskReveal>
        </div>
        <p className="text-[var(--color-text-dim)] text-[16px] leading-[1.5] md:col-span-6 md:col-start-7">
          {t('services.lead')}
        </p>
      </div>

      <div>
        {SERVICES.map((s, i) => (
          <ServiceLine key={s.id} service={s} index={i} />
        ))}
      </div>
    </section>
  );
}
