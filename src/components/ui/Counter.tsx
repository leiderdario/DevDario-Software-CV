'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
};

/** Counts 0 → target when it enters the viewport. Reduced motion renders the target. */
export function Counter({
  target,
  prefix = '',
  suffix = '',
  duration = 1.5,
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`;

  useGsap(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        el.textContent = format(target);
        return;
      }
      const obj = { val: 0 };
      el.textContent = format(0);
      const tween = gsap.to(obj, {
        val: target,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(obj.val);
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });
      return () => {
        tween.kill();
        ScrollTrigger.refresh();
      };
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, target, duration, decimals, prefix, suffix],
  );

  return (
    <span ref={ref} className={cn(className)}>
      {format(target)}
    </span>
  );
}
