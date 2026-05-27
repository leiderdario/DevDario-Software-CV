'use client';

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';

export function useGsap(
  factory: (ctx: gsap.Context) => void | (() => void),
  scope?: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
): void {
  const cleanupRef = useRef<(() => void) | void>(undefined);

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      cleanupRef.current = factory(self);
    }, scope?.current ?? undefined);

    return () => {
      if (typeof cleanupRef.current === 'function') cleanupRef.current();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
