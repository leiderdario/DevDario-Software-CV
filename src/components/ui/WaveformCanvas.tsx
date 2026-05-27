'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  bars?: number;
  color?: string;
  playing?: boolean;
  className?: string;
};

export function WaveformCanvas({
  bars = 80,
  color = 'rgba(226, 225, 223, 0.75)',
  playing = true,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);
      const barW = w / bars;
      const gap = Math.max(1, barW * 0.35);
      const wBar = barW - gap;
      for (let i = 0; i < bars; i++) {
        const phase = i * 0.18;
        const a = (Math.sin(t * 0.05 + phase) + 1) * 0.5;
        const b = (Math.sin(t * 0.11 + phase * 1.7) + 1) * 0.5;
        const amp = (a * 0.6 + b * 0.4) * (0.4 + 0.6 * Math.sin(i / bars * Math.PI));
        const hBar = Math.max(2, amp * h * 0.9);
        const x = i * barW + gap / 2;
        const y = (h - hBar) / 2;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, wBar, hBar);
      }
      if (playing) t += 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [bars, color, playing]);

  return <canvas ref={ref} aria-hidden className={cn('h-12 w-full', className)} />;
}
