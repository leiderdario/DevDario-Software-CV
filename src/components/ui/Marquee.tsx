'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { useReducedMotion } from '@/components/effects/useReducedMotion';
import { useLenisVelocity } from '@/components/effects/useLenisVelocity';
import { cn } from '@/lib/cn';

type Props = {
  speed?: number; // pixels per second
  direction?: 1 | -1;
  hoverPause?: boolean;
  draggable?: boolean;
  className?: string;
  children: ReactNode;
};

export function Marquee({
  speed = 60,
  direction = -1,
  hoverPause = true,
  draggable = false,
  className,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const velocity = useLenisVelocity();

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    if (reduced) return;

    const original = track.firstElementChild as HTMLElement | null;
    if (!original) return;
    if (track.children.length === 1) {
      const clone = original.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    const getWidth = () => original.getBoundingClientRect().width;
    const wrap = (w: number) => gsap.utils.wrap(-w, 0);

    let width = getWidth();
    gsap.set(track, { x: 0 });
    const tween = gsap.to(track, {
      x: direction < 0 ? -width : width,
      duration: width / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x) => {
          const n = parseFloat(x);
          if (direction < 0) {
            return `${wrap(width)(n)}px`;
          }
          // direction = 1, mirror behaviour
          return `${gsap.utils.wrap(0, width)(n)}px`;
        },
      },
    });

    let drag: Draggable | undefined;
    if (draggable) {
      gsap.registerPlugin(Draggable, InertiaPlugin);
      drag = Draggable.create(track, {
        type: 'x',
        inertia: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress: () => {
          tween.pause();
        },
        onRelease: () => {
          tween.resume();
        },
      })[0];
    }

    let enter: (() => void) | undefined;
    let leave: (() => void) | undefined;
    if (hoverPause) {
      enter = () => gsap.to(tween, { timeScale: 0.15, duration: 0.4 });
      leave = () => gsap.to(tween, { timeScale: 1, duration: 0.4 });
      container.addEventListener('mouseenter', enter);
      container.addEventListener('mouseleave', leave);
    }

    const onResize = () => {
      width = getWidth();
      tween.duration(width / speed);
    };
    window.addEventListener('resize', onResize);

    // Scroll-velocity reactivity: speed up with scroll, reverse on scroll-up.
    let raf = 0;
    let hovering = false;
    const onEnterV = () => (hovering = true);
    const onLeaveV = () => (hovering = false);
    container.addEventListener('mouseenter', onEnterV);
    container.addEventListener('mouseleave', onLeaveV);
    const reactToVelocity = () => {
      const v = velocity.current;
      if (!hovering) {
        const scale = gsap.utils.clamp(0.5, 3.5, 1 + Math.abs(v) * 0.05);
        tween.timeScale(scale);
        tween.reversed(v < -0.1);
      }
      raf = requestAnimationFrame(reactToVelocity);
    };
    raf = requestAnimationFrame(reactToVelocity);

    return () => {
      tween.kill();
      drag?.kill();
      cancelAnimationFrame(raf);
      container.removeEventListener('mouseenter', onEnterV);
      container.removeEventListener('mouseleave', onLeaveV);
      if (enter) container.removeEventListener('mouseenter', enter);
      if (leave) container.removeEventListener('mouseleave', leave);
      window.removeEventListener('resize', onResize);
    };
  }, [speed, direction, hoverPause, draggable, reduced, velocity]);

  return (
    <div ref={containerRef} className={cn('marquee overflow-hidden', className)}>
      <div ref={trackRef} className="marquee-track">
        <div className="flex shrink-0 items-center gap-[clamp(40px,6vw,96px)] pr-[clamp(40px,6vw,96px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
