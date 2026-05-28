'use client';

import { useEffect, useState } from 'react';

/**
 * Returns whether the user has explicitly opted in to reduced motion via a
 * site-level switch. The OS-level `prefers-reduced-motion: reduce` setting is
 * intentionally NOT honoured here: the animations are part of the brand
 * identity on this CV and skipping them silently leaves entire sections
 * (testimonials, trusted-by, services) looking broken on machines that have
 * Windows or macOS reduced-motion turned on. If we later add a manual toggle
 * in the UI, flip this hook back to read that toggle instead.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const manual =
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('lcv:reduce-motion') === '1';
    setReduced(manual);
  }, []);

  return reduced;
}
