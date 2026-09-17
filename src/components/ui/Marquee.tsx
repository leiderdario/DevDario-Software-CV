'use client';

import { useEffect, useRef, type ReactNode } from 'react';
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
  draggable = true,
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

    // Ensure we have two copies so there's always a seamless loop buffer
    if (track.children.length === 1) {
      const clone = original.cloneNode(true) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }

    let width = original.getBoundingClientRect().width;
    const onResize = () => {
      width = original.getBoundingClientRect().width;
    };
    window.addEventListener('resize', onResize);

    let currentX = direction < 0 ? 0 : -width;
    let isDragging = false;
    let dragVelocity = 0;
    let lastPointerX = 0;
    let lastPointerTime = performance.now();
    let isHovered = false;
    let hoverScale = 1;
    let scrollScale = 1;

    // Pointer events for dragging
    const onPointerDown = (e: PointerEvent) => {
      if (!draggable || e.button !== 0) return;
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerTime = performance.now();
      dragVelocity = 0;
      track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const now = performance.now();
      const deltaX = e.clientX - lastPointerX;
      const dt = Math.max(1, now - lastPointerTime) / 1000;

      // Smoothed pointer velocity
      const instantVelocity = deltaX / dt;
      dragVelocity = instantVelocity * 0.4 + dragVelocity * 0.6;

      currentX += deltaX;
      lastPointerX = e.clientX;
      lastPointerTime = now;

      // Wrap immediately during drag
      while (currentX <= -width && width > 0) currentX += width;
      while (currentX > 0 && width > 0) currentX -= width;

      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        // pointer was already released
      }
      // Cap release inertia
      dragVelocity = Math.max(-1500, Math.min(1500, dragVelocity));
    };

    if (draggable) {
      track.addEventListener('pointerdown', onPointerDown);
      track.addEventListener('pointermove', onPointerMove);
      track.addEventListener('pointerup', onPointerUp);
      track.addEventListener('pointercancel', onPointerUp);
    }

    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    let raf = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (!isDragging) {
        // Target hover scale
        const targetHover = hoverPause && isHovered ? 0.15 : 1;
        hoverScale += (targetHover - hoverScale) * 0.1;

        // Target scroll reactivity
        const v = velocity.current;
        const targetScroll = isHovered ? 1 : Math.max(0.6, Math.min(1.8, 1 + Math.abs(v) * 0.015));
        scrollScale += (targetScroll - scrollScale) * 0.15;

        // Apply drag inertia / release momentum
        if (Math.abs(dragVelocity) > 2) {
          currentX += dragVelocity * dt;
          dragVelocity *= Math.pow(0.92, dt * 60);
        } else {
          dragVelocity = 0;
        }

        // Base continuous marquee movement
        currentX += speed * direction * dt * hoverScale * scrollScale;

        // Wrap around seamlessly
        while (currentX <= -width && width > 0) currentX += width;
        while (currentX > 0 && width > 0) currentX -= width;

        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      if (draggable) {
        track.removeEventListener('pointerdown', onPointerDown);
        track.removeEventListener('pointermove', onPointerMove);
        track.removeEventListener('pointerup', onPointerUp);
        track.removeEventListener('pointercancel', onPointerUp);
      }
    };
  }, [speed, direction, hoverPause, draggable, reduced, velocity]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'marquee select-none overflow-hidden touch-pan-y',
        draggable && 'cursor-grab active:cursor-grabbing',
        className,
      )}
    >
      <div ref={trackRef} className="marquee-track will-change-transform">
        <div className="flex shrink-0 items-center gap-[clamp(40px,6vw,96px)] pr-[clamp(40px,6vw,96px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
