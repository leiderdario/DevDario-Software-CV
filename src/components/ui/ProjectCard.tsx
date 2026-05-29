'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight, Code2, Lock, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/types';

const MAX_VISIBLE_TAGS = 4;

type Kind = 'demo' | 'source' | 'video' | 'private';

function detectKind(project: Project): Kind {
  if (project.isPrivate) return 'private';
  const url = project.url ?? '';
  if (/youtu\.be|youtube\.com/.test(url)) return 'video';
  if (/github\.com/.test(url)) return 'source';
  return 'demo';
}

function extractDomain(href: string | null | undefined): string | null {
  if (!href) return null;
  try {
    const u = new URL(href, 'http://x');
    if (!u.hostname) return null;
    return u.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

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

  const kind = detectKind(project);
  const visibleTags = project.tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenTagCount = project.tags.length - visibleTags.length;

  // Click target precedence: detailHref > external url > nothing (private)
  const href = project.detailHref || project.url || undefined;
  const isExternal = !!href && href.startsWith('http');
  const isInteractive = !!href;

  const domain = isExternal ? extractDomain(href) : project.detailHref ?? null;
  const hoverHint =
    kind === 'private'
      ? t('work.private')
      : kind === 'video'
        ? `${t('work.video')} ${domain ?? ''}`
        : domain ?? t('work.view');

  const badgeIcon =
    kind === 'video' ? (
      <Play size={11} />
    ) : kind === 'source' ? (
      <Code2 size={11} />
    ) : kind === 'private' ? (
      <Lock size={11} />
    ) : (
      <span className="inline-block size-1.5 rounded-full bg-emerald-400" aria-hidden />
    );

  const badgeLabel =
    kind === 'video'
      ? t('work.badge.video')
      : kind === 'source'
        ? t('work.badge.source')
        : kind === 'private'
          ? t('work.badge.private')
          : t('work.badge.live');

  const badgeColor =
    kind === 'demo'
      ? 'border-emerald-400/40 text-emerald-300/90'
      : kind === 'video'
        ? 'border-red-400/40 text-red-300/90'
        : kind === 'source'
          ? 'border-zinc-400/40 text-zinc-300/90'
          : 'border-amber-400/40 text-amber-300/90';

  const cardClasses = cn(
    'work-card project-card group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] transition-colors',
    isInteractive
      ? 'cursor-pointer hover:border-[var(--color-accent)]/60'
      : 'cursor-default opacity-95',
  );

  const cardBody = (
    <>
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

        <span
          className={cn(
            'absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm',
            badgeColor,
          )}
        >
          {badgeIcon}
          {badgeLabel}
        </span>
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
          {isInteractive && (
            <ArrowUpRight
              className="mt-1 shrink-0 text-[var(--color-text-dim)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
              size={18}
            />
          )}
        </div>
        <p className="line-clamp-2 text-sm text-[var(--color-text-dim)]">
          {project.description[lang]}
        </p>
        {project.tradeOff && (
          <p className="border-l-2 border-[var(--color-accent)]/40 pl-3 text-[12px] italic leading-relaxed text-[var(--color-text-dim)]/85">
            {project.tradeOff[lang]}
          </p>
        )}
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
        <span
          className={cn(
            'mt-auto truncate text-right font-mono text-[10px] uppercase tracking-wider text-[var(--color-text)] transition-opacity duration-300',
            isInteractive ? 'opacity-0 group-hover:opacity-100' : 'opacity-60',
          )}
        >
          {hoverHint} {isInteractive && '→'}
        </span>
      </div>
    </>
  );

  if (!isInteractive) {
    return (
      <div ref={ref as unknown as React.Ref<HTMLDivElement>} className={cardClasses}>
        {cardBody}
      </div>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      data-cursor={isExternal ? 'external' : 'open'}
      data-work-card
      className={cardClasses}
    >
      {cardBody}
    </a>
  );
}
