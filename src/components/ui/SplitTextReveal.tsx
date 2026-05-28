'use client';

import { createElement, useRef, type ReactNode, type Ref } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGsap } from '@/components/effects/useGsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { cn } from '@/lib/cn';

type Props = {
  as?: keyof React.JSX.IntrinsicElements;
  type?: 'lines' | 'words' | 'chars';
  delay?: number;
  stagger?: number;
  trigger?: boolean;
  start?: string;
  /** Char-by-char "dissolve" as the element scrolls up out of view. Defaults on for lines. */
  dissolveOnExit?: boolean;
  className?: string;
  children: ReactNode;
};

export function SplitTextReveal({
  as: Tag = 'div',
  type = 'lines',
  delay = 0,
  stagger = 0.08,
  trigger = true,
  start = 'top 85%',
  dissolveOnExit,
  className,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const wantsDissolve = dissolveOnExit ?? type === 'lines';

  useGsap(
    () => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const split = new SplitText(el, {
        type: type === 'lines' && wantsDissolve ? 'lines,chars' : type,
        linesClass: 'mask-line',
        mask: type === 'lines' ? 'lines' : undefined,
      });
      const targets =
        type === 'lines' ? split.lines : type === 'words' ? split.words : split.chars;
      const tween = gsap.from(targets, {
        yPercent: 110,
        opacity: 0,
        immediateRender: false,
        duration: 1.0,
        ease: 'expo-out',
        stagger,
        delay,
        scrollTrigger: trigger ? { trigger: el, start, once: true } : undefined,
      });

      // Char-by-char dissolve (left → right) as the heading exits the top.
      let dissolve: gsap.core.Tween | undefined;
      if (wantsDissolve && split.chars.length) {
        dissolve = gsap.fromTo(
          split.chars,
          { opacity: 1 },
          {
            opacity: 0.15,
            ease: 'none',
            stagger: 0.008,
            scrollTrigger: {
              trigger: el,
              start: 'top 18%',
              end: 'top -10%',
              scrub: true,
            },
          },
        );
      }

      return () => {
        tween.kill();
        dissolve?.kill();
        split.revert();
        ScrollTrigger.refresh();
      };
    },
    ref as React.RefObject<HTMLElement | null>,
    [reduced, type, delay, stagger, trigger, start, wantsDissolve],
  );

  // Generic intrinsic tag — createElement keeps the union from blowing up TS.
  // data-split-handled signals to the global ScrollFX module that this element
  // already owns its scroll-driven heading animation, so it must be skipped there.
  return createElement(
    Tag,
    {
      ref: ref as Ref<HTMLElement>,
      className: cn(className),
      'data-split-handled': '',
    },
    children,
  );
}
