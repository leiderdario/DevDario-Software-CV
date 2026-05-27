'use client';

import { useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  className?: string;
  delay?: number;
  start?: string;
  children: ReactNode;
};

export function MaskReveal({ className, delay = 0, start = 'top 85%', children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { clipPath: 'inset(0 0 100% 0)', y: 60 });
      gsap.to(el, {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        duration: 1.3,
        ease: 'expo.out',
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    },
    ref,
    [reduced, delay, start],
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
