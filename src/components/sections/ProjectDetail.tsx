'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Play, FileDown, Presentation } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { SplitTextReveal } from '@/components/ui/SplitTextReveal';
import { MaskReveal } from '@/components/ui/MaskReveal';
import type { Project } from '@/lib/types';

export function ProjectDetail({ project }: { project: Project }) {
  const { lang, t } = useTranslation();
  const long = project.longDescription?.[lang] ?? project.description[lang];
  const video = project.videoEmbed;

  return (
    <article className="bg-[var(--color-bg)]">
      <section
        data-section="project-hero"
        data-bg="#131313"
        className="border-b border-[var(--color-border)] py-[var(--section-pad-y,96px)] pt-32 md:pt-40"
      >
        <div className="container-x">
          <Link
            href="/#work"
            data-cursor="open"
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)] transition-colors hover:text-[var(--color-accent)]"
          >
            {t('work.detail.back')}
          </Link>

          <p className="eyebrow mb-3">
            {project.index} · {project.category[lang]} · {project.year}
          </p>

          <h1 className="font-medium leading-[0.95] tracking-[-0.03em] text-[clamp(48px,8vw,128px)]">
            <SplitTextReveal as="span" type="lines" stagger={0.1} className="block">
              {project.title}
            </SplitTextReveal>
          </h1>

          <p className="mt-6 max-w-prose text-[clamp(17px,1.3vw,22px)] leading-[1.55] text-[var(--color-text-dim)]">
            {project.description[lang]}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-dim)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {video && (
        <section
          data-section="project-video"
          data-bg="#0a0a0a"
          className="border-b border-[var(--color-border)] bg-black py-[var(--section-pad-y,96px)]"
        >
          <div className="container-x">
            <MaskReveal>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
                <iframe
                  src={`https://www.youtube.com/embed/${video}?modestbranding=1&rel=0`}
                  title={project.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </MaskReveal>
            <a
              href={`https://youtu.be/${video}`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Play size={14} />
              {t('work.detail.watch')}
            </a>
          </div>
        </section>
      )}

      {!video && project.image && (
        <section
          data-section="project-image"
          data-bg="#0a0a0a"
          className="border-b border-[var(--color-border)] py-[var(--section-pad-y,96px)]"
        >
          <div className="container-x">
            <MaskReveal>
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[var(--color-border)]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              </div>
            </MaskReveal>
          </div>
        </section>
      )}

      <section
        data-section="project-story"
        data-bg="#131313"
        className="border-b border-[var(--color-border)] py-[var(--section-pad-y,96px)]"
      >
        <div className="container-x grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow mb-3">{t('work.detail.story')}</p>
            <MaskReveal>
              <h2 className="font-medium leading-[1.0] tracking-tight text-[clamp(36px,5vw,72px)]">
                {project.title}
              </h2>
            </MaskReveal>
          </div>
          <div className="md:col-span-7">
            <p className="max-w-prose text-[clamp(16px,1.2vw,19px)] leading-[1.7] text-[var(--color-text-dim)]">
              {long}
            </p>
          </div>
        </div>
      </section>

      {project.tradeOff && (
        <section
          data-section="project-tradeoff"
          data-bg="#1a1410"
          className="border-b border-[var(--color-border)] bg-[#1a1410] py-[var(--section-pad-y,96px)]"
        >
          <div className="container-x">
            <p className="eyebrow mb-6">{t('work.detail.tradeOff')}</p>
            <blockquote className="font-serif text-[clamp(28px,4vw,56px)] italic leading-[1.15] tracking-tight">
              <SplitTextReveal as="span" type="lines" stagger={0.1}>
                {project.tradeOff[lang]}
              </SplitTextReveal>
            </blockquote>
          </div>
        </section>
      )}

      <section
        data-section="project-stack"
        data-bg="#131313"
        className="border-b border-[var(--color-border)] py-[var(--section-pad-y,96px)]"
      >
        <div className="container-x">
          <p className="eyebrow mb-6">{t('work.detail.stack')}</p>
          <div className="flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--color-text-dim)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        data-section="project-cta"
        data-bg="#131313"
        className="py-[var(--section-pad-y,96px)]"
      >
        <div className="container-x flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <Link
            href="/#work"
            data-cursor="open"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {t('work.detail.more')}
          </Link>
          {project.slidesUrl && (
            <a
              href={project.slidesUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <Presentation size={14} />
              {t('work.detail.slides')}
            </a>
          )}
          {project.docPdf && (
            <a
              href={project.docPdf}
              download
              data-cursor="external"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              <FileDown size={14} />
              {t('work.detail.doc')}
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
            >
              {project.title} <ArrowUpRight size={14} />
            </a>
          )}
        </div>
      </section>
    </article>
  );
}
