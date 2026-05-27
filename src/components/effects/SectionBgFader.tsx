'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

// Local accent palette per section id — interpolated into --accent-current.
const ACCENTS: Record<string, string> = {
  statement: '#ff6b35',
  studio: '#a855f7',
  manifesto: '#ff6b35',
  toolbox: '#3a8dde',
  'behind-the-scenes': '#f06292',
  archives: '#26c281',
  process: '#ff9f43',
};

export function SectionBgFader() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-bg]'));
    const triggers: ScrollTrigger[] = [];

    sections.forEach((sec) => {
      const color = sec.getAttribute('data-bg');
      if (!color) return;
      const accent = ACCENTS[sec.id] ?? '#ff6b35';

      // Continuously interpolate the body color across the section boundary.
      const bgTween = gsap.to(document.body, {
        backgroundColor: color,
        ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top center', scrub: 1.2 },
      });
      const accentTween = gsap.to(root, {
        '--accent-current': accent,
        ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top center', scrub: 1.2 },
      });
      if (bgTween.scrollTrigger) triggers.push(bgTween.scrollTrigger);
      if (accentTween.scrollTrigger) triggers.push(accentTween.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  return null;
}
