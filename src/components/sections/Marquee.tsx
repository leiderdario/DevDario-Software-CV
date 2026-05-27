'use client';

import type { CSSProperties } from 'react';
import { Marquee } from '@/components/ui/Marquee';
import { useTranslation } from '@/lib/i18n';

const TRACK_1 = ['Python', 'TypeScript', 'Next.js', 'FastAPI', 'Postgres', 'GSAP', 'LangGraph'];
const TRACK_2 = ['React', 'Node.js', 'Tailwind', 'Vercel', 'PHP', 'Docker', 'MySQL'];
const TRACK_3 = ['AI', 'Computer Vision', 'NLP', 'IoT', 'C++', 'Java', 'JavaScript'];

export function MarqueeSection() {
  const { t } = useTranslation();
  void t; // accessor to satisfy lint that i18n is wired
  const tracks = [TRACK_1, TRACK_2, TRACK_3];
  const speeds = [60, 80, 45] as const;
  const dirs = [-1, 1, -1] as const;
  return (
    <section
      id="marquees"
      data-section="marquee"
      data-bg="#131313"
      style={{ '--stack-index': 1, zIndex: 2 } as CSSProperties}
      className="sticky-stack overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg)] py-16"
    >
      <div className="flex flex-col gap-3">
        {tracks.map((track, i) => (
          <Marquee
            key={i}
            speed={speeds[i]}
            direction={dirs[i] as -1 | 1}
            draggable={i === 1}
            className="py-2"
          >
            {track.map((label, j) => (
              <span
                key={`${i}-${j}`}
                className="font-serif text-[clamp(48px,7vw,120px)] tracking-tight text-[var(--color-text-dim)] transition-colors duration-300 hover:text-[var(--color-accent)]"
              >
                {label}
                <span className="ml-[clamp(40px,6vw,96px)] text-[var(--color-accent)]">/</span>
              </span>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}
