'use client';

import { useTranslation } from '@/lib/i18n';
import { ProceduralVideo } from './ProceduralVideo';
import { cn } from '@/lib/cn';
import type { Testimonial } from '@/lib/types';

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { lang } = useTranslation();
  return (
    <article
      data-testimonial
      className={cn(
        'flex flex-col gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]/60 p-6 backdrop-blur-sm transition-colors hover:border-[var(--color-accent)]/40 md:p-8',
      )}
    >
      {testimonial.procedural && (
        <ProceduralVideo
          gradient={testimonial.gradient}
          duration={testimonial.duration ?? '00:42'}
          className="aspect-[4/3] w-full"
        />
      )}
      <blockquote className="font-serif text-[clamp(18px,1.6vw,24px)] leading-[1.35] text-[var(--color-text)]">
        “{testimonial.quote[lang]}”
      </blockquote>
      <footer className="mt-auto flex items-center gap-4">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{
            backgroundImage: `linear-gradient(135deg, ${testimonial.gradient[0]} 0%, ${testimonial.gradient[1]} 100%)`,
          }}
        >
          {testimonial.initials}
        </span>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{testimonial.name}</span>
          <span className="text-xs text-[var(--color-text-dim)]">
            {testimonial.role[lang]} · {testimonial.company}
          </span>
        </div>
      </footer>
    </article>
  );
}
