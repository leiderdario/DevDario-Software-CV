'use client';

import { Fragment, type ReactNode } from 'react';
import { PROJECTS } from '@/lib/data/projects';
import { SHOWCASES } from '@/lib/data/showcases';
import { useTranslation } from '@/lib/i18n';
import { WorkCard } from '@/components/ui/WorkCard';
import { CompactCard } from '@/components/ui/CompactCard';
import { FeaturedShowcase } from '@/components/sections/FeaturedShowcase';
import { MaskReveal } from '@/components/ui/MaskReveal';
import { triggerExit } from '@/components/effects/PageTransition';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

// Showcases interleave after the 3rd, 6th and 9th project (1-based).
const SHOWCASE_AFTER: Record<number, string> = { 3: 'alira', 6: 'mahates', 9: '3digitall' };

type Block = { kind: 'flow'; node: ReactNode } | { kind: 'bleed'; node: ReactNode };

export function Work() {
  const { t } = useTranslation();

  const blocks: Block[] = [];
  let compactBuffer: Project[] = [];

  const flush = () => {
    if (!compactBuffer.length) return;
    const buffer = compactBuffer;
    compactBuffer = [];
    blocks.push({
      kind: 'flow',
      node: (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {buffer.map((p) => (
            <CompactCard key={p.id} project={p} />
          ))}
        </div>
      ),
    });
  };

  PROJECTS.forEach((project, i) => {
    if (project.layout === 'compact') {
      compactBuffer.push(project);
    } else {
      flush();
      blocks.push({ kind: 'flow', node: <WorkCard project={project} /> });
    }

    const showcaseId = SHOWCASE_AFTER[i + 1];
    if (showcaseId) {
      flush();
      const showcase = SHOWCASES.find((s) => s.id === showcaseId);
      if (showcase) blocks.push({ kind: 'bleed', node: <FeaturedShowcase showcase={showcase} /> });
    }
  });
  flush();

  return (
    <section
      id="work"
      data-section="work"
      data-bg="#131313"
      className="bg-[var(--color-bg)] py-[var(--section-pad-y,120px)]"
    >
      <div className="container-x">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-3">{t('work.eyebrow')}</p>
            <MaskReveal>
              <h2 className="font-medium tracking-tight text-[clamp(40px,6vw,96px)] leading-[1.0]">
                {t('work.title')}
              </h2>
            </MaskReveal>
          </div>
          <p className="text-[18px] leading-[1.5] text-[var(--color-text-dim)] md:col-span-4 md:col-start-9">
            {t('work.lead')}
          </p>
        </div>
      </div>

      {blocks.map((block, i) =>
        block.kind === 'bleed' ? (
          <Fragment key={i}>{block.node}</Fragment>
        ) : (
          <div key={i} className="container-x mb-20 md:mb-28">
            {block.node}
          </div>
        ),
      )}

      <div className="container-x mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => triggerExit('https://github.com/leiderdario')}
          data-cursor="external"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          {t('work.all')} <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}
