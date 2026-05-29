'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { PROJECTS } from '@/lib/data/projects';
import { useTranslation } from '@/lib/i18n';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { triggerExit } from '@/components/effects/PageTransition';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

const INITIAL_VISIBLE = 4;

export function Work() {
  const { lang, t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const extraRef = useRef<HTMLDivElement | null>(null);
  const hiddenCount = PROJECTS.length - INITIAL_VISIBLE;

  // Fade the extra batch in when it mounts on expand. React handles unmount on collapse.
  useEffect(() => {
    if (!expanded) return;
    const wrap = extraRef.current;
    if (!wrap) return;
    const cards = wrap.querySelectorAll<HTMLElement>('[data-extra-card]');
    if (!cards.length) return;
    gsap.from(cards, {
      y: 30,
      opacity: 0,
      duration: 0.55,
      ease: 'expo.out',
      stagger: 0.06,
    });
  }, [expanded]);

  const initial = PROJECTS.slice(0, INITIAL_VISIBLE);
  const extra = PROJECTS.slice(INITIAL_VISIBLE);

  return (
    <section
      id="work"
      data-section="work"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,96px)]"
    >
      <div className="container-x">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-3">{t('work.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium leading-[1.0] tracking-tight text-[clamp(32px,4vw,64px)]">
                {t('work.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[16px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-4 md:col-start-9">
            {t('work.lead')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {initial.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {expanded && (
          <div
            ref={extraRef}
            id="work-extra"
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {extra.map((p) => (
              <div key={p.id} data-extra-card>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {hiddenCount > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              data-cursor="open"
              aria-expanded={expanded}
              aria-controls="work-extra"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              {expanded
                ? lang === 'es'
                  ? 'Ver menos'
                  : 'Show less'
                : lang === 'es'
                  ? `Ver más proyectos (+${hiddenCount})`
                  : `Show more projects (+${hiddenCount})`}
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
          <button
            type="button"
            onClick={() => triggerExit('https://github.com/leiderdario')}
            data-cursor="external"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {t('work.all')} <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
