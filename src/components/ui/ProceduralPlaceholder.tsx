'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/components/effects/useReducedMotion';

export type ProceduralVariant = 'glyph' | 'tablet' | 'laptop' | 'monitor' | 'polaroid';

type Props = {
  gradient: [string, string];
  variant?: ProceduralVariant;
  glyph?: string;
  label?: string;
  accent?: string;
  seed?: number;
  className?: string;
};

/**
 * Canvas gradient + animated blobs with a procedural device/glyph SVG overlay.
 * No external image services — everything is drawn at runtime.
 * Pauses off-screen and respects reduced motion (single static frame).
 */
export function ProceduralPlaceholder({
  gradient,
  variant = 'glyph',
  glyph,
  label,
  accent = '#ff6b35',
  seed = 0,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width) * dpr;
      canvas.height = Math.max(1, rect.height) * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let t = seed * 120;
    let visible = true;

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gradient[0]);
      grad.addColorStop(1, gradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 3; i++) {
        const x = w * 0.5 + Math.cos(t * 0.006 + i * 2 + seed) * w * 0.32;
        const y = h * 0.5 + Math.sin(t * 0.009 + i * 2.3 + seed) * h * 0.32;
        const r = Math.min(w, h) * (0.24 + 0.08 * Math.sin(t * 0.011 + i));
        const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
        radial.addColorStop(0, 'rgba(255,255,255,0.22)');
        radial.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (visible && !reduced) t += 1;
      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // single static frame
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gradient[0]);
      grad.addColorStop(1, gradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (visible = e.isIntersecting)),
      { threshold: 0.05 },
    );
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [gradient, seed, reduced]);

  return (
    <div ref={wrapRef} className={cn('relative isolate h-full w-full overflow-hidden', className)}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <DeviceOverlay variant={variant} glyph={glyph} label={label} accent={accent} />
    </div>
  );
}

function DeviceOverlay({
  variant,
  glyph,
  label,
  accent,
}: {
  variant: ProceduralVariant;
  glyph?: string;
  label?: string;
  accent: string;
}) {
  if (variant === 'glyph') {
    return (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none font-serif text-[clamp(72px,16vw,240px)] leading-none text-white/90">
          {glyph ?? '✦'}
        </span>
      </div>
    );
  }

  if (variant === 'polaroid') {
    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect x="6" y="6" width="88" height="88" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
        {glyph && (
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="Instrument Serif, Georgia, serif"
            fontSize="34"
            fill="rgba(255,255,255,0.92)"
          >
            {glyph}
          </text>
        )}
      </svg>
    );
  }

  // tablet / laptop / monitor — drawn as scalable SVG chrome with a glyph on screen
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 200 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {variant === 'tablet' && (
        <>
          <rect x="58" y="18" width="84" height="104" rx="8" fill="rgba(0,0,0,0.32)" stroke={accent} strokeWidth="1.4" />
          <rect x="64" y="26" width="72" height="88" rx="3" fill="rgba(255,255,255,0.06)" />
          <circle cx="100" cy="118" r="1.6" fill={accent} />
        </>
      )}
      {variant === 'laptop' && (
        <>
          <rect x="42" y="20" width="116" height="74" rx="4" fill="rgba(0,0,0,0.32)" stroke={accent} strokeWidth="1.4" />
          <rect x="48" y="26" width="104" height="62" rx="2" fill="rgba(255,255,255,0.06)" />
          <path d="M30 100 L170 100 L160 110 L40 110 Z" fill="rgba(0,0,0,0.4)" stroke={accent} strokeWidth="1.2" />
          <rect x="92" y="100" width="16" height="2.5" rx="1" fill={accent} opacity="0.7" />
        </>
      )}
      {variant === 'monitor' && (
        <>
          <rect x="40" y="16" width="120" height="78" rx="5" fill="rgba(0,0,0,0.34)" stroke={accent} strokeWidth="1.4" />
          <rect x="46" y="22" width="108" height="66" rx="2" fill="rgba(255,255,255,0.06)" />
          <rect x="94" y="94" width="12" height="14" fill="rgba(0,0,0,0.4)" stroke={accent} strokeWidth="1" />
          <rect x="78" y="108" width="44" height="4" rx="2" fill="rgba(0,0,0,0.45)" stroke={accent} strokeWidth="1" />
        </>
      )}
      {glyph && (
        <text
          x="100"
          y={variant === 'tablet' ? 78 : 62}
          textAnchor="middle"
          fontFamily="Instrument Serif, Georgia, serif"
          fontSize="26"
          fill="rgba(255,255,255,0.92)"
        >
          {glyph}
        </text>
      )}
      {label && (
        <text
          x="100"
          y={variant === 'tablet' ? 96 : 80}
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="5.5"
          letterSpacing="0.5"
          fill="rgba(255,255,255,0.6)"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
