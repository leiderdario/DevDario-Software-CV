'use client';

import { useEffect, useRef, useState } from 'react';
import { WaveformCanvas } from './WaveformCanvas';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useTranslation } from '@/lib/i18n';

type Props = {
  gradient: [string, string];
  duration?: string;
  className?: string;
};

export function ProceduralVideo({ gradient, duration = '00:42', className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let t = 0;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, gradient[0]);
      grad.addColorStop(1, gradient[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // floating blobs
      for (let i = 0; i < 3; i++) {
        const x = w * 0.5 + Math.cos(t * 0.008 + i * 2) * w * 0.3;
        const y = h * 0.5 + Math.sin(t * 0.011 + i * 2.3) * h * 0.3;
        const r = Math.min(w, h) * (0.22 + 0.08 * Math.sin(t * 0.013 + i));
        const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
        radial.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (playing) t += 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // Pause when off-screen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setPlaying(e.isIntersecting));
      },
      { threshold: 0.1 },
    );
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, [gradient, playing]);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative isolate overflow-hidden rounded-xl border border-[var(--color-border)]',
        className,
      )}
      data-cursor="play"
    >
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
        <button
          type="button"
          aria-label={playing ? t('testimonials.pause') : t('testimonials.play')}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black transition-transform hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying((p) => !p);
          }}
        >
          {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>
        <WaveformCanvas playing={playing} className="h-10 flex-1" color="rgba(255,255,255,0.85)" />
        <span className="font-mono text-[11px] text-white/80">{duration}</span>
      </div>
    </div>
  );
}
