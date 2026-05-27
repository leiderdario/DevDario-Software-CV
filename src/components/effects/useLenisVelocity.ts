'use client';

import { useEffect, useRef } from 'react';
import type Lenis from 'lenis';

declare global {
  // Exposed by LenisProvider so non-provider components can read scroll velocity.
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Returns a ref whose `.current` holds the latest Lenis scroll velocity.
 * Falls back to a wheel-derived estimate when Lenis is absent (reduced motion).
 * Reading from a ref avoids re-rendering on every scroll frame.
 */
export function useLenisVelocity(): React.RefObject<number> {
  const velocity = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let raf = 0;
    const tick = () => {
      const v = window.__lenis?.velocity;
      if (typeof v === 'number') velocity.current = v;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fallback for environments without Lenis (e.g. reduced motion disables it).
    let decay = 0;
    const onWheel = (e: WheelEvent) => {
      if (window.__lenis) return;
      velocity.current = -e.deltaY * 0.25;
      clearTimeout(decay);
      decay = window.setTimeout(() => (velocity.current = 0), 120);
    };
    window.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(decay);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return velocity;
}
