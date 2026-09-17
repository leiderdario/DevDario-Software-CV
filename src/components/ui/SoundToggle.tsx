'use client';

import { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2, Activity } from 'lucide-react';
import { getSoundMode, cycleSoundMode, setSoundMode, playClickSound } from '@/lib/sound';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function SoundToggle({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const [mode, setMode] = useState<'mute' | 'soft' | 'boosted'>('soft');
  const [showToast, setShowToast] = useState(false);
  const lastClickRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('cv_sound_mode') as 'mute' | 'soft' | 'boosted' | null;
    if (saved) {
      setMode(saved);
      setSoundMode(saved);
    }
  }, []);

  // Global tactile click sound on ANY user click across the whole webpage
  useEffect(() => {
    const handleGlobalPointerDown = (e: MouseEvent) => {
      if (getSoundMode() === 'mute') return;

      // Don't double trigger if clicking this toggle directly
      if ((e.target as HTMLElement)?.closest?.('[data-sound-toggle]')) {
        return;
      }

      const now = Date.now();
      if (now - lastClickRef.current < 45) return; // Prevent double trigger
      lastClickRef.current = now;

      playClickSound();
    };

    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => window.removeEventListener('pointerdown', handleGlobalPointerDown);
  }, []);

  const handleToggle = () => {
    const next = cycleSoundMode();
    setMode(next);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const getLabel = () => {
    if (mode === 'mute') return lang === 'es' ? 'Silencio' : 'Muted';
    if (mode === 'soft') return lang === 'es' ? 'Modo sonido' : 'Sound mode';
    return lang === 'es' ? 'Modo elevado' : 'Elevated mode';
  };

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        data-sound-toggle="true"
        onClick={handleToggle}
        data-cursor="open"
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono transition-all duration-200',
          mode === 'mute'
            ? 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text)]'
            : mode === 'soft'
              ? 'border-emerald-500/50 text-emerald-400 bg-emerald-950/30 hover:bg-emerald-900/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
              : 'border-emerald-400 text-emerald-300 bg-emerald-900/50 shadow-[0_0_14px_rgba(16,185,129,0.3)]',
        )}
        title={lang === 'es' ? 'Efectos de sonido' : 'Sound effects'}
        aria-label="Toggle sound"
      >
        {mode === 'mute' && <VolumeX size={13} />}
        {mode === 'soft' && <Volume2 size={13} className="text-emerald-400" />}
        {mode === 'boosted' && <Activity size={13} className="text-emerald-300 animate-pulse" />}
        <span className="hidden sm:inline text-[11px] font-medium">{getLabel()}</span>
      </button>

      {showToast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/95 px-2.5 py-1 text-[10px] font-mono text-emerald-300 shadow-xl border border-emerald-500/30 animate-in fade-in zoom-in-95 pointer-events-none">
          {getLabel()}
        </div>
      )}
    </div>
  );
}
