'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import { useTranslation } from '@/lib/i18n';
import { TestimonialCard } from '@/components/ui/TestimonialCard';
import { MaskReveal } from '@/components/ui/MaskReveal';

export function Testimonials() {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return setProgress(0);
      setProgress(Math.min(1, Math.max(0, track.scrollLeft / max)));
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('article');
    const w = card ? (card as HTMLElement).offsetWidth + 24 : track.clientWidth * 0.9;
    track.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  return (
    <section
      id="testimonials"
      data-section="testimonials"
      data-bg="#0e0e0e"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">{t('testimonials.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(32px,4vw,64px)] leading-[1.0]">
                {t('testimonials.title')}
              </h2>
            </MaskReveal>
          </div>
          <div className="flex items-center gap-2 lg:hidden">
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
        </div>

        <div className="hidden lg:block">
          <div className="columns-2 gap-6 xl:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
            {TESTIMONIALS.map((tt) => (
              <TestimonialCard key={tt.id} testimonial={tt} />
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none]"
            data-cursor="drag"
          >
            {TESTIMONIALS.map((tt) => (
              <div key={tt.id} className="w-[85vw] shrink-0 snap-center sm:w-[60vw]">
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
      </div>
    </section>
  );
}
