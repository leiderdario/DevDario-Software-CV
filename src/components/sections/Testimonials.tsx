'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import { useTranslation } from '@/lib/i18n';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';

export function Testimonials() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mobile: native scroll-snap with a progress bar.
  useEffect(() => {
    if (!isMobile || reduced) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return setProgress(0);
      setProgress(Math.min(1, Math.max(0, track.scrollLeft / max)));
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    return () => track.removeEventListener('scroll', update);
  }, [isMobile, reduced]);

  // Desktop: pin the section and advance the carousel on scrub.
  useGsap(
    () => {
      if (isMobile || reduced) return;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const n = TESTIMONIALS.length;

      const tween = gsap.to(track, {
        xPercent: -100 * ((n - 1) / n),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${n * 60}%`,
          pin: true,
          scrub: 1,
          onUpdate: (self) => setProgress(self.progress),
        },
      });

      return () => {
        tween.kill();
        ScrollTrigger.refresh();
      };
    },
    sectionRef as React.RefObject<HTMLElement | null>,
    [isMobile, reduced],
  );

  const scrollBy = (dir: 1 | -1) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const card = track.querySelector('article');
    const w = card ? (card as HTMLElement).offsetWidth + 24 : track.clientWidth * 0.9;
    track.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      data-section="testimonials"
      data-bg="#0e0e0e"
      className="overflow-hidden bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">{t('testimonials.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
                {t('testimonials.title')}
              </h2>
            </MaskReveal>
          </div>
          {isMobile && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => scrollBy(-1)}
                data-cursor="drag"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={() => scrollBy(1)}
                data-cursor="drag"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobile ? (
        <div className="container-x">
          <div
            ref={mobileTrackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none]"
            data-cursor="drag"
          >
            {TESTIMONIALS.map((tt) => (
              <div key={tt.id} className="w-[85vw] shrink-0 snap-center md:w-[60vw]">
                <TestimonialCard testimonial={tt} />
              </div>
            ))}
          </div>
          <div className="mt-6 h-px w-full bg-[var(--color-border)]">
            <div
              className="h-px bg-[var(--color-accent)] transition-[width] duration-200"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div ref={trackRef} className="flex w-[700%]">
            {TESTIMONIALS.map((tt) => (
              <div key={tt.id} className="flex w-[calc(100%/7)] shrink-0 items-center px-[6vw]">
                <div className="mx-auto w-full max-w-3xl">
                  <TestimonialCard testimonial={tt} />
                </div>
              </div>
            ))}
          </div>
          <div className="container-x mt-12 h-px w-full bg-[var(--color-border)]">
            <div className="h-px bg-[var(--color-accent)]" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}
    </section>
  );
}
