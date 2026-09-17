'use client';

import { useState, useEffect } from 'react';
import { VolumeX, Volume1, Volume2 } from 'lucide-react';
import { getSoundMode, cycleSoundMode, setSoundMode } from '@/lib/sound';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function SoundToggle({ className }: { className?: string }) {
  const { lang } = useTranslation();
  const [mode, setMode] = useState<'mute' | 'soft' | 'boosted'>('soft');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cv_sound_mode') as 'mute' | 'soft' | 'boosted' | null;
    if (saved) {
      setMode(saved);
      setSoundMode(saved);
    }
  }, []);

  const handleToggle = () => {
    const next = cycleSoundMode();
    setMode(next);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
  };

  const getLabel = () => {
    if (mode === 'mute') return lang === 'es' ? 'Silencio' : 'Muted';
    if (mode === 'soft') return lang === 'es' ? 'Sonido suave' : 'Soft sound';
    return lang === 'es' ? '¡Modo curioso 🔊!' : 'Curious mode 🔊!';
  };

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        onClick={handleToggle}
        data-cursor="open"
        className={cn(
          'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono transition-all duration-200',
          mode === 'mute'
            ? 'border-[var(--color-border)] text-[var(--color-text-dim)] hover:border-[var(--color-text)]'
            : mode === 'soft'
              ? 'border-[var(--color-accent)]/50 text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20'
              : 'border-emerald-400 text-emerald-400 bg-emerald-950/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse',
        )}
        title={lang === 'es' ? 'Alternar efectos de sonido' : 'Toggle sound effects'}
        aria-label="Toggle sound"
      >
        {mode === 'mute' && <VolumeX size={13} />}
        {mode === 'soft' && <Volume1 size={13} />}
        {mode === 'boosted' && <Volume2 size={13} />}
        <span className="hidden sm:inline text-[11px]">{getLabel()}</span>
      </button>

      {showToast && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/90 px-2.5 py-1 text-[10px] font-mono text-white shadow-lg border border-white/20 animate-in fade-in zoom-in-95 pointer-events-none">
          {getLabel()}
        </div>
      )}
    </div>
  );
}
