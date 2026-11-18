// Web Audio API sound effect synthesizer (no external audio assets required)

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioCtx) return null;

  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    sharedAudioCtx = new AudioCtx();
  }

  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {
      // Ignore autoplay resume rejection if triggered outside a user gesture
    });
  }

  return sharedAudioCtx;
}

function triggerBellNote(
  ctx: AudioContext,
  frequency: number,
  startOffsetSec: number,
  durationSec: number,
  peakGain: number
) {
  const now = ctx.currentTime + startOffsetSec;

  // Primary bright bell tone
  const primaryOsc = ctx.createOscillator();
  const primaryGain = ctx.createGain();
  primaryOsc.type = 'sine';
  primaryOsc.frequency.setValueAtTime(frequency, now);

  primaryGain.gain.setValueAtTime(0.0001, now);
  primaryGain.gain.linearRampToValueAtTime(peakGain, now + 0.012);
  primaryGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  primaryOsc.connect(primaryGain);
  primaryGain.connect(ctx.destination);

  primaryOsc.start(now);
  primaryOsc.stop(now + durationSec + 0.02);

  // Subtle octave harmonic overtone for a crisp crystal 'ting'
  const overtoneOsc = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  overtoneOsc.type = 'triangle';
  overtoneOsc.frequency.setValueAtTime(frequency * 2, now);

  overtoneGain.gain.setValueAtTime(0.0001, now);
  overtoneGain.gain.linearRampToValueAtTime(peakGain * 0.28, now + 0.008);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.55);

  overtoneOsc.connect(overtoneGain);
  overtoneGain.connect(ctx.destination);

  overtoneOsc.start(now);
  overtoneOsc.stop(now + durationSec * 0.55 + 0.02);
}

/**
 * Plays a cheerful crystal 'ting' chime using the Web Audio API.
 * - 'star': crisp single bright 'ting' (E6 + E7 harmonic shimmer)
 * - 'challenge': cheerful rising two-note 'ting-ting!' (E6 -> B6) for daily challenges
 */
export function playCheerfulTing(variant: 'star' | 'challenge' = 'star'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (variant === 'challenge') {
      triggerBellNote(ctx, 1318.51, 0, 0.34, 0.16);
      triggerBellNote(ctx, 1975.53, 0.095, 0.48, 0.18);
    } else {
      triggerBellNote(ctx, 1567.98, 0, 0.42, 0.17);
    }
  } catch {
    // Gracefully ignore audio errors on restricted devices
  }
}
