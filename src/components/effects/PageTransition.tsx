'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

let curtainEl: HTMLDivElement | null = null;
let reducedMotion = false;

/**
 * Mounts a full-screen curtain used for outbound link transitions.
 * Call `triggerExit(url)` to raise the curtain, open the link, then lower it.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    curtainEl = el;
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(el, { clipPath: 'inset(100% 0 0 0)' });

    // When the user returns via the back/forward cache, drop the curtain.
    const onShow = () => {
      if (!curtainEl) return;
      gsap.to(curtainEl, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' });
    };
    window.addEventListener('pageshow', onShow);

    return () => {
      window.removeEventListener('pageshow', onShow);
      curtainEl = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9997] bg-[var(--color-bg)]"
      style={{ clipPath: 'inset(100% 0 0 0)' }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-[var(--color-accent)]" />
    </div>
  );
}

/** Raise the curtain from the bottom, open the URL, then lower it. */
export function triggerExit(url: string, target: '_blank' | '_self' = '_blank') {
  if (!curtainEl || reducedMotion) {
    window.open(url, target, 'noopener,noreferrer');
    return;
  }
  gsap.to(curtainEl, {
    clipPath: 'inset(0 0 0 0)',
    duration: 0.6,
    ease: 'expo.inOut',
    onComplete: () => {
      window.open(url, target, 'noopener,noreferrer');
      gsap.to(curtainEl, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        delay: 0.1,
        ease: 'expo.inOut',
      });
    },
  });
}
