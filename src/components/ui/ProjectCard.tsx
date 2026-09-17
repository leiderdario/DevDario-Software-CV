'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Code2, Lock, Play, ShieldAlert, Terminal } from 'lucide-react';
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
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);
  const { lang, t } = useTranslation();
  const reduced = useReducedMotion();

  // 3D Tilt state
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });
  // Kamuli typewriter effect state
  const isKamuli = project.id === 'kamuli';
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (!isKamuli || !tilt.isHovered) {
      setTypedChars(0);
      return;
    }
    const fullText = project.description[lang];
    const timer = setInterval(() => {
      setTypedChars((prev) => {
        if (prev >= fullText.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 3;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [isKamuli, tilt.isHovered, project.description, lang]);

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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rotX: -y * 12,
      rotY: x * 12,
      glareX: (x + 0.5) * 100,
      glareY: (y + 0.5) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, isHovered: false });
  };

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
    'work-card project-card group relative flex min-h-[280px] flex-col overflow-hidden rounded-xl border bg-[var(--color-bg-alt)] transition-all duration-300 will-change-transform',
    isKamuli
      ? 'border-emerald-500/30 hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]'
      : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/60',
    isInteractive ? 'cursor-pointer' : 'cursor-default opacity-95',
  );

  const cardTransformStyle = {
    transform: `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(${
      tilt.isHovered ? 1.02 : 1
    }, ${tilt.isHovered ? 1.02 : 1}, 1)`,
    transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };

  const cardBody = (
    <>
      {/* Glare specular reflection layer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          opacity: tilt.isHovered ? (isKamuli ? 0.25 : 0.15) : 0,
          background: isKamuli
            ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(16,185,129,0.6), transparent 70%)`
            : `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.4), transparent 60%)`,
        }}
      />

      {/* Kamuli Scanline HUD effect */}
      {isKamuli && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent animate-[scan_3s_ease-in-out_infinite]" />
          <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400 border border-emerald-500/40">
            <Terminal size={10} />
            <span>KALI // RED_TEAM</span>
          </div>
        </div>
      )}

      {/* Image / Mockup preview */}
      <div ref={imgRef} className="relative aspect-[4/3] max-h-[260px] w-full overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="project-image object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="project-image flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(135deg, ${project.placeholder?.gradient[0] ?? '#222'} 0%, ${
                project.placeholder?.gradient[1] ?? '#000'
              } 100%)`,
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

        {/* Kind badge */}
        <div className="absolute left-3 top-3 z-10">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border bg-black/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur-md',
              badgeColor,
            )}
          >
            {badgeIcon}
            {badgeLabel}
          </span>
        </div>

        {/* Metric badge */}
        {project.metric && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-baseline gap-1 rounded-full border border-white/10 bg-black/75 px-3 py-1 font-mono backdrop-blur-md">
              <span className="text-xs font-semibold text-[var(--color-accent)]">
                {project.metric.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-dim)]">
                {project.metric.label[lang]}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[var(--color-text-dim)]">
          <span className="text-[var(--color-accent)]">
            {project.index} · {project.category[lang]}
          </span>
          <span>{project.year}</span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className={cn("font-serif text-[clamp(20px,1.8vw,26px)] leading-tight tracking-tight", isKamuli && "text-emerald-300 font-mono")}>
            {project.title}
          </h3>
          {isInteractive && (
            <ArrowUpRight
              className={cn(
                "mt-1 shrink-0 text-[var(--color-text-dim)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                isKamuli ? "group-hover:text-emerald-400" : "group-hover:text-[var(--color-accent)]",
              )}
              size={18}
            />
          )}
        </div>

        {/* Description: typewriter effect for Kamuli on hover */}
        {isKamuli && tilt.isHovered ? (
          <p className="line-clamp-2 text-sm font-mono text-emerald-400/90 leading-relaxed">
            <span className="text-emerald-500 mr-1">&gt;</span>
            {project.description[lang].slice(0, typedChars)}
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-emerald-400 animate-pulse" />
          </p>
        ) : (
          <p className="line-clamp-2 text-sm text-[var(--color-text-dim)]">
            {project.description[lang]}
          </p>
        )}

        {project.tradeOff && (
          <p className={cn(
            "border-l-2 pl-3 text-[12px] italic leading-relaxed",
            isKamuli
              ? "border-emerald-400/50 text-emerald-300/80 font-mono text-[11px]"
              : "border-[var(--color-accent)]/40 text-[var(--color-text-dim)]/85",
          )}>
            {project.tradeOff[lang]}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-1.5 pb-1">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                isKamuli
                  ? "border-emerald-500/30 text-emerald-300/80 bg-emerald-950/20"
                  : "border-[var(--color-border)] text-[var(--color-text-dim)]",
              )}
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
            'mt-auto truncate text-right font-mono text-[10px] uppercase tracking-wider transition-opacity duration-300',
            isKamuli ? 'text-emerald-400' : 'text-[var(--color-text)]',
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
      <div
        ref={cardContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={cardTransformStyle}
        className={cardClasses}
      >
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={cardTransformStyle}
      className={cardClasses}
    >
      {cardBody}
    </a>
  );
}
