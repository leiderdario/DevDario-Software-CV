// Pure Web Audio API synthetic sound engine — zero external audio files needed

type SoundMode = 'mute' | 'soft' | 'boosted';

let audioCtx: AudioContext | null = null;
let currentMode: SoundMode = 'soft';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getSoundMode(): SoundMode {
  return currentMode;
}

export function setSoundMode(mode: SoundMode) {
  currentMode = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem('cv_sound_mode', mode);
  }
}

export function cycleSoundMode(): SoundMode {
  const next: SoundMode = currentMode === 'mute' ? 'soft' : currentMode === 'soft' ? 'boosted' : 'mute';
  setSoundMode(next);
  if (next !== 'mute') {
    playClickSound(true);
  }
  return next;
}

function getGainMultiplier(): number {
  if (currentMode === 'mute') return 0;
  if (currentMode === 'soft') return 0.08;
  return 0.35; // Boosted mode
}

/** Soft tactile mechanical click for navigation */
export function playClickSound(force = false) {
  if (currentMode === 'mute' && !force) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const gainVal = force ? (currentMode === 'boosted' ? 0.35 : 0.1) : getGainMultiplier();
  if (gainVal <= 0) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Low subtle pop frequency
  const baseFreq = currentMode === 'boosted' ? 880 : 440;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035);

  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/** Melodic chime for successful actions (e.g. form submission) */
export function playSuccessSound() {
  if (currentMode === 'mute') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const gainVal = getGainMultiplier();
  const notes = currentMode === 'boosted' ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25];

  notes.forEach((freq, index) => {
    const startTime = ctx.currentTime + index * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal * 1.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.26);
  });
}

/** Terminal keyboard beep for the hacker terminal easter egg */
export function playTerminalKeySound() {
  if (currentMode === 'mute') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const gainVal = getGainMultiplier() * 0.7;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'square';
  osc.frequency.setValueAtTime(currentMode === 'boosted' ? 950 : 600, ctx.currentTime);

  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.025);
}
