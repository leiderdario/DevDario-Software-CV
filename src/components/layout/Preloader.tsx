'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/components/effects/useReducedMotion';

const STORAGE_KEY = 'leider.preloader.ts';
const ONE_HOUR = 60 * 60 * 1000;
const MIN_DISPLAY_MS = 1800;
const MAX_WAIT_MS = 4800;
const LIFT_MS = 1100;

// Smooth ease that visually matches cubic-bezier(0.65, 0, 0.35, 1) closely.
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function Preloader() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const barFillRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(true);
  const [lifting, setLifting] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const last = window.sessionStorage.getItem(STORAGE_KEY);
      if (last && Date.now() - Number(last) < ONE_HOUR) {
        setShow(false);
        window.dispatchEvent(new CustomEvent('preloader:done'));
        return;
      }
    } catch (e) {
      void e;
    }

    if (reduced) {
      setShow(false);
      window.dispatchEvent(new CustomEvent('preloader:done'));
      return;
    }

    const fill = fillRef.current;
    const barFill = barFillRef.current;
    if (!fill || !barFill) return;

    // Start state.
    fill.style.clipPath = 'inset(0 100% 0 0)';
    barFill.style.transform = 'scaleX(0)';
    barFill.style.transformOrigin = 'left center';

    document.body.style.overflow = 'hidden';
    const startedAt = performance.now();
    let lifted = false;
    let raf = 0;
    let unmountTimer = 0;
    let liftTimer = 0;

    // Drive the fill + bar with requestAnimationFrame so Chrome cannot
    // freeze the animation under OS-level prefers-reduced-motion.
    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const t = Math.min(1, elapsed / MIN_DISPLAY_MS);
      const eased = easeInOut(t);
      const insetRight = (1 - eased) * 100;
      fill.style.clipPath = `inset(0 ${insetRight}% 0 0)`;
      barFill.style.transform = `scaleX(${eased})`;
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    const closeCurtain = () => {
      if (lifted) return;
      lifted = true;
      try {
        window.sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch (e) {
        void e;
      }
      setLifting(true);
      unmountTimer = window.setTimeout(() => {
        setShow(false);
        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('preloader:done'));
      }, LIFT_MS + 40);
    };

    const onReady = () => {
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, MIN_DISPLAY_MS - elapsed);
      liftTimer = window.setTimeout(closeCurtain, wait);
    };

    if (document.readyState === 'complete') {
      onReady();
    } else {
      window.addEventListener('load', onReady, { once: true });
    }
    const ceiling = window.setTimeout(closeCurtain, MAX_WAIT_MS);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(ceiling);
      window.clearTimeout(unmountTimer);
      window.clearTimeout(liftTimer);
      document.body.style.overflow = '';
    };
  }, [reduced]);

  if (!show) return null;

  // Apply the lift via inline transform (also RAF-friendly, bypasses any
  // OS-level CSS transition throttling).
  const liftStyle: React.CSSProperties = {
    transform: lifting ? 'translateY(-100%)' : 'translateY(0)',
    transition: `transform ${LIFT_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  };

  return (
    <div
      ref={containerRef}
      style={liftStyle}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]"
      aria-hidden
    >
      <div className="relative font-serif leading-none">
        <span className="block text-[clamp(80px,16vw,220px)] tracking-tight text-[var(--color-text-dim)] opacity-25">
          LD
        </span>
        <span
          ref={fillRef}
          className="pointer-events-none absolute inset-0 block text-[clamp(80px,16vw,220px)] tracking-tight text-[var(--color-text)]"
          style={{ clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' }}
        >
          LD
        </span>
      </div>

      <span className="absolute bottom-10 font-mono text-xs uppercase tracking-[0.4em] text-[var(--color-text-dim)]">
        Hi there
      </span>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[var(--color-border)]">
        <div
          ref={barFillRef}
          className="h-full w-full bg-[var(--color-accent)]"
          style={{
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
}
