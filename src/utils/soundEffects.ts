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

let cachedNoiseBuffer: AudioBuffer | null = null;

function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedNoiseBuffer && cachedNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedNoiseBuffer;
  }
  const length = Math.floor(ctx.sampleRate * 0.5);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  cachedNoiseBuffer = buffer;
  return buffer;
}

function triggerChildGiggleSyllable(
  ctx: AudioContext,
  opts: {
    startOffsetSec: number;
    durationSec: number;
    f0Start: number;
    f0Peak: number;
    f0End: number;
    f1: number;
    f2: number;
    f3: number;
    gain: number;
  }
) {
  const {
    startOffsetSec,
    durationSec,
    f0Start,
    f0Peak,
    f0End,
    f1,
    f2,
    f3,
    gain,
  } = opts;
  const now = ctx.currentTime + startOffsetSec;

  // 1. Child vocal-cord harmonic source (warm sawtooth + natural jitter vibrato)
  const glottalOsc = ctx.createOscillator();
  glottalOsc.type = 'sawtooth';
  glottalOsc.frequency.setValueAtTime(f0Start, now);
  glottalOsc.frequency.exponentialRampToValueAtTime(f0Peak, now + durationSec * 0.42);
  glottalOsc.frequency.exponentialRampToValueAtTime(f0End, now + durationSec);

  const vibratoOsc = ctx.createOscillator();
  const vibratoDepth = ctx.createGain();
  vibratoOsc.type = 'sine';
  vibratoOsc.frequency.setValueAtTime(6.8, now);
  vibratoDepth.gain.setValueAtTime(7.5, now);
  vibratoOsc.connect(vibratoDepth);
  vibratoDepth.connect(glottalOsc.frequency);

  // Soft glottal spectral tilt so harmonics sound warm and human, not buzzy
  const glottalTilt = ctx.createBiquadFilter();
  glottalTilt.type = 'lowpass';
  glottalTilt.frequency.setValueAtTime(2900, now);
  glottalTilt.Q.setValueAtTime(0.6, now);
  glottalOsc.connect(glottalTilt);

  // 2. Soft "hh" breathy aspiration noise at each syllable onset
  const noiseSrc = ctx.createBufferSource();
  noiseSrc.buffer = getNoiseBuffer(ctx);
  const breathFilter = ctx.createBiquadFilter();
  breathFilter.type = 'bandpass';
  breathFilter.frequency.setValueAtTime(2100, now);
  breathFilter.Q.setValueAtTime(1.1, now);
  const breathGain = ctx.createGain();
  breathGain.gain.setValueAtTime(0.0001, now);
  breathGain.gain.linearRampToValueAtTime(gain * 0.48, now + 0.015);
  breathGain.gain.exponentialRampToValueAtTime(gain * 0.14, now + durationSec * 0.55);
  breathGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  noiseSrc.connect(breathFilter);
  breathFilter.connect(breathGain);

  // 3. Parallel child vocal-tract formants (F1, F2, F3) shaping "heh / hee / ha"
  const vocalMix = ctx.createGain();
  const formants: Array<{ freq: number; q: number; weight: number }> = [
    { freq: f1, q: 5.5, weight: 1.0 },
    { freq: f2, q: 7.5, weight: 0.68 },
    { freq: f3, q: 9.0, weight: 0.24 },
  ];

  formants.forEach(({ freq, q, weight }) => {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(freq * 0.96, now);
    bp.frequency.linearRampToValueAtTime(freq * 1.04, now + durationSec * 0.65);
    bp.Q.setValueAtTime(q, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(weight * 2.2, now);

    glottalTilt.connect(bp);
    breathGain.connect(bp);
    bp.connect(g);
    g.connect(vocalMix);
  });

  // Gentle voiced syllable amplitude envelope
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, now);
  env.gain.linearRampToValueAtTime(gain, now + 0.022);
  env.gain.exponentialRampToValueAtTime(gain * 0.72, now + durationSec * 0.52);
  env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  // Soft outer air warmth
  const warmthLowpass = ctx.createBiquadFilter();
  warmthLowpass.type = 'lowpass';
  warmthLowpass.frequency.setValueAtTime(3600, now);

  vocalMix.connect(env);
  env.connect(warmthLowpass);
  warmthLowpass.connect(ctx.destination);

  glottalOsc.start(now);
  vibratoOsc.start(now);
  noiseSrc.start(now);
  glottalOsc.stop(now + durationSec + 0.03);
  vibratoOsc.stop(now + durationSec + 0.03);
  noiseSrc.stop(now + durationSec + 0.03);
}

/**
 * Plays a warm, cheerful natural-sounding child giggling laugh ("heh-heh-hee-ha-ha!")
 * using formant-filtered vocal synthesis + breathy aspiration (no spoken words).
 */
export function playHappyLaugh(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;

    // 5 natural uneven child giggle bursts ("h-heh, heh, hee, haa, ha!")
    const syllables = [
      { startOffsetSec: 0.0, durationSec: 0.105, f0Start: 305, f0Peak: 350, f0End: 315, f1: 700, f2: 1950, f3: 3250, gain: 0.16 },
      { startOffsetSec: 0.13, durationSec: 0.10, f0Start: 340, f0Peak: 398, f0End: 355, f1: 620, f2: 2300, f3: 3350, gain: 0.18 },
      { startOffsetSec: 0.255, durationSec: 0.105, f0Start: 375, f0Peak: 440, f0End: 382, f1: 590, f2: 2450, f3: 3420, gain: 0.19 },
      { startOffsetSec: 0.385, durationSec: 0.125, f0Start: 348, f0Peak: 410, f0End: 332, f1: 870, f2: 1750, f3: 3200, gain: 0.18 },
      { startOffsetSec: 0.535, durationSec: 0.155, f0Start: 325, f0Peak: 380, f0End: 298, f1: 850, f2: 1680, f3: 3150, gain: 0.15 },
    ];

    syllables.forEach((s) => triggerChildGiggleSyllable(ctx, s));
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
