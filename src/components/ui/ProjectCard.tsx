'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import type { Project } from '@/lib/types';

const MAX_VISIBLE_TAGS = 4;

type Props = {
  project: Project;
};

export function ProjectCard({ project }: Props) {
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
        { yPercent: -4 },
        {
          yPercent: 4,
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
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  return (
    <a
      ref={ref}
      href={project.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      data-cursor={isExternal ? 'external' : 'open'}
      data-work-card
      className="work-card project-card group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] transition-colors hover:border-[var(--color-accent)]/60"
    >
      <div ref={imgRef} className="relative aspect-[4/3] max-h-[260px] w-full overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
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
              className="font-serif text-[clamp(56px,9vw,120px)] leading-none text-white/90"
              aria-hidden
            >
              {project.placeholder?.glyph ?? project.title.slice(0, 2)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5 pb-4 leading-snug">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
          <span>
            {project.index} · {project.category[lang]}
          </span>
          <span>{project.year}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-[clamp(20px,1.8vw,26px)] leading-tight tracking-tight">
            {project.title}
          </h3>
          <ArrowUpRight
            className="mt-1 shrink-0 text-[var(--color-text-dim)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
            size={18}
          />
        </div>
        <p className="line-clamp-2 text-sm text-[var(--color-text-dim)]">
          {project.description[lang]}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5 pb-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="rounded-full border border-[var(--color-border)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
              +{hiddenTagCount}
            </span>
          )}
        </div>
        <span className="mt-auto text-right font-mono text-[10px] uppercase tracking-wider text-[var(--color-text)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {t('work.view')} →
        </span>
      </div>
    </a>
  );
}
