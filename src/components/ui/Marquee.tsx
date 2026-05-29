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
    // Always keep exactly TWO copies so the loop has buffer on both sides.
    // Direction matters: for left-scroll, clone is appended (fills the right).
    // For right-scroll, clone is PREPENDED (fills the left) and we start at -width.
    if (track.children.length === 1) {
      const clone = original.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      if (direction < 0) {
        track.appendChild(clone);
      } else {
        track.insertBefore(clone, original);
      }
    }

    const getWidth = () => original.getBoundingClientRect().width;

    let width = getWidth();
    const startX = direction < 0 ? 0 : -width;
    const endX = direction < 0 ? -width : 0;
    gsap.set(track, { x: startX });
    const tween = gsap.to(track, {
      x: endX,
      duration: width / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x) => `${gsap.utils.wrap(-width, 0)(parseFloat(x))}px`,
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

    // Scroll-velocity reactivity: gently speed up with scroll. No reversal —
    // flipping play direction every frame causes visible "freezing" jank.
    let raf = 0;
    let hovering = false;
    const onEnterV = () => (hovering = true);
    const onLeaveV = () => (hovering = false);
    container.addEventListener('mouseenter', onEnterV);
    container.addEventListener('mouseleave', onLeaveV);
    let currentScale = 1;
    const reactToVelocity = () => {
      const v = velocity.current;
      if (!hovering) {
        const target = gsap.utils.clamp(0.6, 1.8, 1 + Math.abs(v) * 0.015);
        // Smooth toward target to avoid frame-by-frame thrash.
        currentScale += (target - currentScale) * 0.15;
        tween.timeScale(currentScale);
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
