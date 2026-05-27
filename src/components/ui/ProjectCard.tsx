'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/types';

type Props = {
  project: Project;
  large?: boolean;
};

export function ProjectCard({ project, large = false }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      const img = imgRef.current;
      if (!el || !img) return;
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
      return () => ScrollTrigger.refresh();
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced],
  );

  const isExternal = project.url.startsWith('http');

  return (
    <a
      ref={ref}
      href={project.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      data-cursor={isExternal ? 'external' : 'open'}
      data-work-card
      className={cn(
        'work-card project-card group relative block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] transition-colors hover:border-[var(--color-accent)]/60',
        large ? 'md:col-span-2' : 'md:col-span-1',
      )}
    >
      <div
        ref={imgRef}
        className={cn(
          'relative w-full overflow-hidden',
          large ? 'aspect-[16/9]' : 'aspect-[4/3]',
        )}
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes={large ? '(min-width: 1024px) 80vw, 100vw' : '(min-width: 1024px) 40vw, 100vw'}
            className="project-image object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="project-image flex h-full w-full items-center justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${project.placeholder?.gradient[0] ?? '#222'} 0%, ${project.placeholder?.gradient[1] ?? '#000'} 100%)`,
            }}
          >
            <span
              className="font-serif text-[clamp(80px,14vw,220px)] leading-none text-white/90"
              aria-hidden
            >
              {project.placeholder?.glyph ?? project.title.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-6 md:p-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[var(--color-text-dim)]">
          <span className="font-mono">{project.index}</span>
          <span>{project.year}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={cn(
              'font-serif tracking-tight',
              large ? 'text-[clamp(32px,4vw,56px)]' : 'text-[clamp(24px,2.4vw,36px)]',
            )}
          >
            {project.title}
          </h3>
          <ArrowUpRight
            className="mt-2 shrink-0 text-[var(--color-text-dim)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
            size={large ? 28 : 22}
          />
        </div>
        <p className="max-w-prose text-sm text-[var(--color-text-dim)]">
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
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-wider">
          <span className="text-[var(--color-text-dim)]">{project.category[lang]}</span>
          <span className="text-[var(--color-text)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {t('work.view')} →
          </span>
        </div>
      </div>
    </a>
  );
}
