'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/components/effects/useReducedMotion';

const STORAGE_KEY = 'leider.preloader.ts';
const ONE_HOUR = 60 * 60 * 1000;

export function Preloader() {
  const ref = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    try {
      const last = window.sessionStorage.getItem(STORAGE_KEY);
      if (last && Date.now() - Number(last) < ONE_HOUR) {
        setShow(false);
        window.dispatchEvent(new CustomEvent('preloader:done'));
        return;
      }
    } catch {
      /* ignore */
    }

    const el = ref.current;
    const logo = logoRef.current;
    if (!el || !logo) return;

    if (reduced) {
      el.style.display = 'none';
      setShow(false);
      window.dispatchEvent(new CustomEvent('preloader:done'));
      return;
    }

    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          /* ignore */
        }
        setShow(false);
        document.body.style.overflow = '';
        window.dispatchEvent(new CustomEvent('preloader:done'));
      },
    });

    tl.fromTo(
      logo,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
    )
      .to(logo, { duration: 0.3 }, '+=0.3')
      .to(
        logo,
        {
          scale: 0.35,
          xPercent: -260,
          yPercent: -340,
          duration: 0.9,
          ease: 'expo.inOut',
        },
        '+=0.05',
      )
      .to(
        el,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.0,
          ease: 'expo.inOut',
        },
        '-=0.7',
      );
  }, [reduced]);

  if (!show) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[var(--color-bg)]"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      aria-hidden
    >
      <div ref={logoRef} className="font-serif text-[clamp(80px,16vw,220px)] leading-none text-[var(--color-text)]">
        LD
      </div>
    </div>
  );
}
