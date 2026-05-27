'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { triggerExit } from '@/components/effects/PageTransition';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/types';

/** Full-width featured card with zig-zag entrance. Used for non-compact layouts. */
export function WorkCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  const layout = project.layout;
  const imageLeft = layout === 'featured-left';
  const isVertical = layout === 'featured-vertical';
  const isExternal = project.url.startsWith('http');

  useGsap(
    () => {
      const el = ref.current;
      const img = imgRef.current;
      const text = textRef.current;
      if (!el || !img) return;

      if (reduced) {
        gsap.set([img, text].filter(Boolean), { x: 0, y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' });
        return;
      }

      // Image enters from the side opposite to where it sits; text follows 0.2s later.
      const fromX = isVertical ? 0 : imageLeft ? 60 : -60;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      if (layout === 'featured-right') {
        gsap.set(img, { clipPath: 'inset(0 100% 0 0)' });
        tl.to(img, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.out' }, 0);
      }
      tl.from(img, { x: fromX, y: 60, opacity: 0, duration: 1, ease: 'expo.out' }, 0);
      if (text) tl.from(text, { x: -fromX * 0.5, y: 40, opacity: 0, duration: 1, ease: 'expo.out' }, 0.2);

      // Subtle parallax while crossing the viewport.
      const inner = img.querySelector<HTMLElement>('[data-parallax]');
      if (inner) {
        gsap.fromTo(
          inner,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          },
        );
      }

      return () => {
        tl.kill();
        ScrollTrigger.refresh();
      };
    },
    ref,
    [reduced, layout],
  );

  const media = (
    <div
      ref={imgRef}
      data-cursor={isExternal ? 'external' : 'open'}
      data-work-card
      onClick={() => triggerExit(project.url, isExternal ? '_blank' : '_self')}
      className={cn(
        'work-card group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]',
        isVertical ? 'aspect-[16/8]' : 'aspect-[16/10]',
      )}
    >
      <div data-parallax className="absolute inset-[-8%]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width:1024px) 65vw, 100vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${project.placeholder?.gradient[0] ?? '#222'} 0%, ${project.placeholder?.gradient[1] ?? '#000'} 100%)`,
            }}
          >
            <span className="font-serif text-[clamp(80px,14vw,220px)] leading-none text-white/90" aria-hidden>
              {project.placeholder?.glyph ?? project.title.slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      <span className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-bg)]/70 backdrop-blur transition-transform group-hover:scale-110">
        <ArrowUpRight size={18} />
      </span>
    </div>
  );

  const copy = (
    <div ref={textRef} className="flex flex-col gap-4">
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
        <span>{project.index}</span>
        <span>·</span>
        <span>{project.category[lang]}</span>
        <span>·</span>
        <span>{project.year}</span>
      </div>
      <h3
        className={cn(
          'font-serif tracking-tight',
          isVertical ? 'text-[clamp(48px,8vw,128px)] leading-[0.95]' : 'text-[clamp(32px,4vw,64px)] leading-[1.0]',
        )}
      >
        {project.title}
      </h3>
      <p className="max-w-prose text-[18px] leading-[1.5] text-[var(--color-text-dim)]">
        {project.description[lang]}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => triggerExit(project.url, isExternal ? '_blank' : '_self')}
        data-cursor={isExternal ? 'external' : 'open'}
        className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
      >
        {t('work.view')} <ArrowUpRight size={14} />
      </button>
    </div>
  );

  if (isVertical) {
    return (
      <div ref={ref} className="flex flex-col gap-10">
        {copy}
        {media}
      </div>
    );
  }

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-5 lg:gap-16">
      <div className={cn('lg:col-span-3', !imageLeft && 'lg:order-2')}>{media}</div>
      <div className={cn('lg:col-span-2', !imageLeft && 'lg:order-1')}>{copy}</div>
    </div>
  );
}
