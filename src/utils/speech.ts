// Browser Web Speech API helper with child-friendly UK English RP voice profiles

export type VoicePresetId = 'leo' | 'amy' | 'toby' | 'lily';

export interface VoicePreset {
  id: VoicePresetId;
  label: string;
  monsterId: 'bloop' | 'pip' | 'bramble' | 'zuzu';
  sampleLine: string;
  pitch: number;
  rate: number;
  preferredGender: 'female' | 'male';
  preferredNames: string[];
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'leo',
    label: 'Leo',
    monsterId: 'bloop',
    sampleLine: "Hey explorer! I'm Leo. Take a steady breath and let's solve today's challenge together.",
    pitch: 0.88,
    rate: 0.86,
    preferredGender: 'male',
    preferredNames: [
      'Daniel',
      'Arthur',
      'Oliver',
      'Ryan',
      'George',
      'Google UK English Male',
      'Jamie',
    ],
  },
  {
    id: 'amy',
    label: 'Amy',
    monsterId: 'pip',
    sampleLine: "Hello friend! I'm Amy. Let's read today's story slowly and discover something wonderful together.",
    pitch: 1.52,
    rate: 0.86,
    preferredGender: 'female',
    preferredNames: [
      'Libby',
      'Maisie',
      'Hazel',
      'Sonia',
      'Google UK English Female',
      'Martha',
      'Serena',
      'Kate',
    ],
  },
  {
    id: 'toby',
    label: 'Toby',
    monsterId: 'bramble',
    sampleLine: "Hiya pal, I'm Toby! Och, let's crack some braw puzzles and win plenty of shiny stars today!",
    pitch: 1.18,
    rate: 0.97,
    preferredGender: 'male',
    preferredNames: [
      'Fiona',
      'Malcolm',
      'Stuart',
      'Jamie',
      'Scottish',
      'Arthur',
      'Oliver',
      'Ryan',
      'Google UK English Male',
      'Daniel',
    ],
  },
  {
    id: 'lily',
    label: 'Lily',
    monsterId: 'zuzu',
    sampleLine: "Goodness me, hello darling explorer! I'm Lily. Shall we have a rather splendid adventure today?",
    pitch: 1.38,
    rate: 0.93,
    preferredGender: 'female',
    preferredNames: [
      'Kate',
      'Serena',
      'Stephanie',
      'Martha',
      'Sonia',
      'Google UK English Female',
      'Libby',
    ],
  },
];

const VOICE_STORAGE_KEY = 'schoola_rp_voice_preset_v2';
const SYSTEM_VOICE_STORAGE_KEY = 'schoola_system_voice_uri_v1';

// Apple/OS novelty & retro Eloquence voices that sound robotic for children
const ROBOTIC_VOICE_BLOCKLIST = [
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'deranged',
  'eddy',
  'flo',
  'fred',
  'good news',
  'grandma',
  'grandpa',
  'hysterical',
  'jester',
  'junior',
  'kathy',
  'organ',
  'ralph',
  'reed',
  'rocko',
  'sandy',
  'shelley',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
];

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getSelectedVoicePreset(): VoicePresetId {
  if (typeof window === 'undefined') return 'lily';
  try {
    const saved = localStorage.getItem(VOICE_STORAGE_KEY) as VoicePresetId | null;
    if (saved && VOICE_PRESETS.some((p) => p.id === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'lily';
}

export function setSelectedVoicePreset(id: VoicePresetId): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VOICE_STORAGE_KEY, id);
  } catch {
    // Ignore storage write errors
  }
}

export function getSelectedSystemVoiceURI(): string {
  if (typeof window === 'undefined') return 'auto';
  try {
    return localStorage.getItem(SYSTEM_VOICE_STORAGE_KEY) || 'auto';
  } catch {
    return 'auto';
  }
}

export function setSelectedSystemVoiceURI(voiceURI: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SYSTEM_VOICE_STORAGE_KEY, voiceURI);
  } catch {
    // Ignore storage write errors
  }
}

// Pre-warm Chrome/Edge voice list as soon as possible so UK voices are ready on first click
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.('voiceschanged', () => {
      window.speechSynthesis.getVoices();
    });
  } catch {
    // Ignore restricted synthesis init
  }
}

function isFriendlyVoice(v: SpeechSynthesisVoice): boolean {
  const lower = v.name.toLowerCase();
  return !ROBOTIC_VOICE_BLOCKLIST.some((bad) => lower.includes(bad));
}

const BRITISH_VOICE_NAME_HINTS = [
  'libby',
  'maisie',
  'sonia',
  'ryan',
  'george',
  'thomas',
  'alfie',
  'elliot',
  'hollie',
  'mia',
  'noah',
  'daniel',
  'arthur',
  'oliver',
  'kate',
  'serena',
  'martha',
  'stephanie',
  'hazel',
  'susan',
  'fiona',
  'malcolm',
  'stuart',
  'jamie',
  'british',
  'scottish',
  'england',
  'london',
  'united kingdom',
  'uk english',
  'great britain',
];

function isBritishOrScottishVoice(v: SpeechSynthesisVoice): boolean {
  const lang = v.lang.toLowerCase().replace(/_/g, '-');
  const name = v.name.toLowerCase();
  if (lang.startsWith('en-gb') || lang.startsWith('en-sc')) return true;
  if (!lang.startsWith('en')) return false;
  return (
    /\buk\b/i.test(name) ||
    BRITISH_VOICE_NAME_HINTS.some((hint) => name.includes(hint))
  );
}

function voiceQualityScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  let score = 0;
  if (lang.startsWith('en-gb') || lang.startsWith('en-sc')) score += 60;
  else if (isBritishOrScottishVoice(v)) score += 50;
  else if (lang.startsWith('en-ie')) score += 20;
  else if (lang.startsWith('en')) score += 5;

  if (name.includes('natural') || name.includes('online')) score += 35;
  if (name.includes('enhanced') || name.includes('premium') || name.includes('siri')) score += 25;
  if (name.includes('google')) score += 20;
  if (name.includes('libby') || name.includes('maisie') || name.includes('sonia')) score += 22;
  if (name.includes('kate') || name.includes('serena') || name.includes('martha')) score += 20;
  return score;
}

export function getLovelySystemVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return [];

  const friendlyBritish = voices.filter(
    (v) => isBritishOrScottishVoice(v) && isFriendlyVoice(v)
  );
  const allBritish = voices.filter(isBritishOrScottishVoice);
  const pool =
    friendlyBritish.length > 0
      ? friendlyBritish
      : allBritish;

  return [...pool].sort((a, b) => voiceQualityScore(b) - voiceQualityScore(a));
}

export function subscribeVoicesLoaded(callback: () => void): () => void {
  if (!isSpeechSupported()) return () => {};
  const synth = window.speechSynthesis;
  const handler = () => callback();
  synth.addEventListener?.('voiceschanged', handler);
  return () => {
    synth.removeEventListener?.('voiceschanged', handler);
  };
}

function pickVoiceFromPool(
  preferredNames: string[],
  britishPool: SpeechSynthesisVoice[],
  usedURIs: Set<string>,
  genderHint: 'female' | 'male'
): SpeechSynthesisVoice | null {
  // 1. Prefer an unused British voice matching character name priority
  for (const name of preferredNames) {
    const unusedMatch = britishPool.find(
      (v) => !usedURIs.has(v.voiceURI) && v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (unusedMatch) return unusedMatch;
  }

  // 2. Otherwise pick any unused British voice matching gender hint
  const femaleHints = ['female', 'libby', 'maisie', 'sonia', 'kate', 'serena', 'martha', 'stephanie', 'hazel', 'fiona', 'woman'];
  const maleHints = ['male', 'daniel', 'arthur', 'oliver', 'ryan', 'george', 'jamie', 'malcolm', 'stuart', 'man'];
  const hints = genderHint === 'female' ? femaleHints : maleHints;

  const unusedGenderMatch = britishPool.find(
    (v) =>
      !usedURIs.has(v.voiceURI) &&
      hints.some((h) => v.name.toLowerCase().includes(h))
  );
  if (unusedGenderMatch) return unusedGenderMatch;

  // 3. Otherwise allow reuse of a matching British preferred voice (e.g. Chrome desktop has only 2 UK voices)
  for (const name of preferredNames) {
    const match = britishPool.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }

  return britishPool.find((v) => !usedURIs.has(v.voiceURI)) || britishPool[0] || null;
}

function findBestBritishVoice(preset: VoicePreset): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const allVoices = window.speechSynthesis.getVoices();
  if (!allVoices.length) return null;

  // Respect explicit user-chosen system voice ONLY if it is genuinely British/Scottish UK
  const customURI = getSelectedSystemVoiceURI();
  if (customURI && customURI !== 'auto') {
    const picked = allVoices.find((v) => v.voiceURI === customURI);
    if (picked && isBritishOrScottishVoice(picked)) return picked;
  }

  // Strictly restrict to friendly British/Scottish voices — never pick en-US voices
  const britishPool = getLovelySystemVoices();
  if (britishPool.length === 0) {
    // Returning null keeps utterance.lang = 'en-GB' instead of forcing an American voice
    return null;
  }

  // Assign distinct British voices across all 4 presets when multiple UK voices exist
  const usedURIs = new Set<string>();
  const resolved: Partial<Record<VoicePresetId, SpeechSynthesisVoice | null>> = {};
  for (const p of VOICE_PRESETS) {
    const picked = pickVoiceFromPool(p.preferredNames, britishPool, usedURIs, p.preferredGender);
    resolved[p.id] = picked;
    if (picked) usedURIs.add(picked.voiceURI);
  }

  return resolved[preset.id] || britishPool[0] || null;
}

function cleanTextForChildSpeech(raw: string): string {
  return raw
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s*[·•|—]\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // Ignore speech synthesis errors in restricted environments
  }
}

export function speakText(
  text: string,
  onEnd?: () => void,
  presetOverride?: VoicePresetId
): void {
  if (!isSpeechSupported()) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const activeId = presetOverride || getSelectedVoicePreset();
    const preset = VOICE_PRESETS.find((p) => p.id === activeId) || VOICE_PRESETS[0];

    const spokenText = cleanTextForChildSpeech(text);
    const utterance = new SpeechSynthesisUtterance(spokenText || text);
    utterance.lang = 'en-GB';
    utterance.rate = preset.rate;
    utterance.pitch = preset.pitch;

    const chosenVoice = findBestBritishVoice(preset);
    if (chosenVoice && isBritishOrScottishVoice(chosenVoice)) {
      utterance.voice = chosenVoice;
      const normalizedLang = (chosenVoice.lang || 'en-GB').replace(/_/g, '-');
      utterance.lang = normalizedLang.toLowerCase().startsWith('en-sc') ? normalizedLang : 'en-GB';
      if (preset.id === 'toby' && chosenVoice.name.toLowerCase().includes('fiona')) {
        utterance.pitch = 0.96;
      }
    } else {
      utterance.lang = 'en-GB';
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}
