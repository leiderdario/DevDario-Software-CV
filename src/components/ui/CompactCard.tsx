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

export function CompactCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { lang } = useTranslation();
  const reduced = useReducedMotion();
  const isExternal = project.url.startsWith('http');

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { clipPath: 'inset(0 0 0% 0)', y: 0, opacity: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)', y: 80, opacity: 0 },
        {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
      return () => ScrollTrigger.refresh();
    },
    ref,
    [reduced],
  );

  return (
    <div
      ref={ref}
      onClick={() => triggerExit(project.url, isExternal ? '_blank' : '_self')}
      data-cursor={isExternal ? 'external' : 'open'}
      data-work-card
      className="work-card group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] transition-colors hover:border-[var(--color-accent)]/60"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width:1024px) 30vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(135deg, ${project.placeholder?.gradient[0] ?? '#222'} 0%, ${project.placeholder?.gradient[1] ?? '#000'} 100%)`,
            }}
          >
            <span className="font-serif text-[clamp(56px,9vw,120px)] leading-none text-white/90" aria-hidden>
              {project.placeholder?.glyph ?? project.title.slice(0, 2)}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]">
            {project.index} · {project.year}
          </p>
          <h3 className={cn('font-serif text-[clamp(20px,2vw,28px)] leading-tight tracking-tight')}>
            {project.title}
          </h3>
        </div>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-[var(--color-text-dim)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
        />
      </div>
      <p className="px-5 pb-5 text-sm text-[var(--color-text-dim)]">{project.category[lang]}</p>
    </div>
  );
}
