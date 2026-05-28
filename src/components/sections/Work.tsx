'use client';

import { PROJECTS } from '@/lib/data/projects';
import { useTranslation } from '@/lib/i18n';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { triggerExit } from '@/components/effects/PageTransition';
import { ArrowUpRight } from 'lucide-react';

export function Work() {
  const { t } = useTranslation();

  return (
    <section
      id="work"
      data-section="work"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,96px)]"
    >
      <div className="container-x">
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-3">{t('work.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium leading-[1.0] tracking-tight text-[clamp(40px,6vw,96px)]">
                {t('work.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[18px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-4 md:col-start-9">
            {t('work.lead')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
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
