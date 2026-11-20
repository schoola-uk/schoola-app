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

function triggerGiggleSyllable(
  ctx: AudioContext,
  startHz: number,
  endHz: number,
  startOffsetSec: number,
  durationSec: number,
  peakGain: number
) {
  const now = ctx.currentTime + startOffsetSec;

  const bodyOsc = ctx.createOscillator();
  const harmonicOsc = ctx.createOscillator();
  const formantFilter = ctx.createBiquadFilter();
  const envGain = ctx.createGain();

  // Warm voice-like triangle + sine pair with bouncy upward pitch glide ("ha-ha-hee!")
  bodyOsc.type = 'triangle';
  bodyOsc.frequency.setValueAtTime(startHz, now);
  bodyOsc.frequency.exponentialRampToValueAtTime(endHz, now + durationSec * 0.72);
  bodyOsc.frequency.exponentialRampToValueAtTime(endHz * 0.94, now + durationSec);

  harmonicOsc.type = 'sine';
  harmonicOsc.frequency.setValueAtTime(startHz * 1.98, now);
  harmonicOsc.frequency.exponentialRampToValueAtTime(endHz * 2.0, now + durationSec * 0.75);

  // Soft vowel-like bandpass/lowpass warmth so it sounds playful, never harsh
  formantFilter.type = 'lowpass';
  formantFilter.frequency.setValueAtTime(1650, now);
  formantFilter.Q.setValueAtTime(2.2, now);

  envGain.gain.setValueAtTime(0.0001, now);
  envGain.gain.linearRampToValueAtTime(peakGain, now + 0.018);
  envGain.gain.exponentialRampToValueAtTime(peakGain * 0.55, now + durationSec * 0.55);
  envGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0.32, now);

  bodyOsc.connect(formantFilter);
  harmonicOsc.connect(subGain);
  subGain.connect(formantFilter);
  formantFilter.connect(envGain);
  envGain.connect(ctx.destination);

  bodyOsc.start(now);
  harmonicOsc.start(now);
  bodyOsc.stop(now + durationSec + 0.02);
  harmonicOsc.stop(now + durationSec + 0.02);
}

/**
 * Plays a cheerful, bouncy happy giggle/laugh melody when welcoming a learner
 * (no spoken words — purely happy musical laughter).
 */
export function playHappyLaugh(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    // 5 joyful rising giggle bursts ("he-he-he-ha-ha!")
    triggerGiggleSyllable(ctx, 430, 540, 0.0, 0.11, 0.13);
    triggerGiggleSyllable(ctx, 490, 610, 0.13, 0.11, 0.14);
    triggerGiggleSyllable(ctx, 560, 690, 0.26, 0.11, 0.14);
    triggerGiggleSyllable(ctx, 640, 790, 0.39, 0.12, 0.15);
    triggerGiggleSyllable(ctx, 590, 860, 0.53, 0.22, 0.15);
    triggerBellNote(ctx, 1318.51, 0.56, 0.28, 0.06);
  } catch {
    // Gracefully ignore audio errors on restricted devices
  }
}

/**
 * Plays the happy welcome laugh once when the website opens.
 * If browser autoplay policy suspends AudioContext until first interaction,
 * automatically unlocks and plays once on the visitor's first tap/key press.
 */
export function playWelcomeLaughOnOpen(): () => void {
  if (typeof window === 'undefined') return () => {};
  let played = false;

  const tryPlayNow = () => {
    if (played) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'running') {
      played = true;
      cleanup();
      playHappyLaugh();
      return;
    }

    ctx
      .resume()
      .then(() => {
        if (!played && ctx.state === 'running') {
          played = true;
          cleanup();
          playHappyLaugh();
        }
      })
      .catch(() => {
        // Still waiting for first user interaction
      });
  };

  const onFirstGesture = () => {
    tryPlayNow();
  };

  const cleanup = () => {
    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('keydown', onFirstGesture);
    window.removeEventListener('touchstart', onFirstGesture);
  };

  window.addEventListener('pointerdown', onFirstGesture, { passive: true });
  window.addEventListener('keydown', onFirstGesture, { passive: true });
  window.addEventListener('touchstart', onFirstGesture, { passive: true });

  // Attempt immediately on open in case browser permits audio
  tryPlayNow();

  return cleanup;
}
