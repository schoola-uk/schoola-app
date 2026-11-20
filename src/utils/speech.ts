// Browser Web Speech API helper with child-friendly UK English RP voice profiles

export type VoicePresetId =
  | 'teacher'
  | 'pixie'
  | 'gentle'
  | 'daisy'
  | 'oliver'
  | 'barnaby'
  | 'leo'
  | 'maya'
  | 'toby'
  | 'lily';

export interface VoicePreset {
  id: VoicePresetId;
  label: string;
  subtitle: string;
  sampleLine: string;
  pitch: number;
  rate: number;
  preferredGender: 'female' | 'male';
  preferredNames: string[];
  isKidVoice?: boolean;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'teacher',
    label: 'Miss Clara',
    subtitle: 'Warm UK Storyteller',
    sampleLine: 'Hello explorer! I am Miss Clara, and I would love to read today’s story with you.',
    pitch: 1.07,
    rate: 0.89,
    preferredGender: 'female',
    preferredNames: [
      'Libby',
      'Sonia',
      'Google UK English Female',
      'Martha',
      'Serena',
      'Kate',
      'Stephanie',
      'Samantha',
    ],
  },
  {
    id: 'pixie',
    label: 'Pip',
    subtitle: 'Cheerful Story Fairy',
    sampleLine: 'Hi there! I am Pip the fairy, ready to sprinkle stars on your learning adventure!',
    pitch: 1.15,
    rate: 0.94,
    preferredGender: 'female',
    preferredNames: [
      'Maisie',
      'Libby',
      'Google UK English Female',
      'Martha',
      'Serena',
      'Kate',
      'Samantha',
    ],
  },
  {
    id: 'gentle',
    label: 'Willow',
    subtitle: 'Gentle Bedtime Calm',
    sampleLine: 'Take a calm breath, little explorer. Let us read this page slowly and gently together.',
    pitch: 1.04,
    rate: 0.83,
    preferredGender: 'female',
    preferredNames: [
      'Serena',
      'Kate',
      'Sonia',
      'Hazel',
      'Libby',
      'Google UK English Female',
      'Stephanie',
    ],
  },
  {
    id: 'daisy',
    label: 'Daisy',
    subtitle: 'Sweet Younger Friend',
    sampleLine: 'Yay! I am Daisy! Let us discover something fun and magical today!',
    pitch: 1.18,
    rate: 0.92,
    preferredGender: 'female',
    preferredNames: [
      'Maisie',
      'Libby',
      'Google UK English Female',
      'Samantha',
      'Ava',
      'Zoe',
    ],
  },
  {
    id: 'oliver',
    label: 'Oliver',
    subtitle: 'Kind Adventure Guide',
    sampleLine: 'Hello adventurer! I am Oliver. Ready to unlock a brand new star badge together?',
    pitch: 1.01,
    rate: 0.91,
    preferredGender: 'male',
    preferredNames: [
      'Oliver',
      'Arthur',
      'Ryan',
      'Google UK English Male',
      'Daniel',
      'Jamie',
    ],
  },
  {
    id: 'barnaby',
    label: 'Grandad Barnaby',
    subtitle: 'Cosy Classic Narrator',
    sampleLine: 'Gather round, young explorer! I am Grandad Barnaby, and I have a wonderful tale for you.',
    pitch: 0.94,
    rate: 0.87,
    preferredGender: 'male',
    preferredNames: [
      'George',
      'Arthur',
      'Daniel',
      'Google UK English Male',
      'Oliver',
    ],
  },
  {
    id: 'leo',
    label: 'Leo',
    subtitle: 'Energetic Kid Explorer',
    sampleLine: "Hey everyone! I'm Leo! Let's zoom through today's quiz and win heaps of shiny stars!",
    pitch: 1.48,
    rate: 1.12,
    preferredGender: 'male',
    preferredNames: [
      'Oliver',
      'Arthur',
      'Ryan',
      'Google UK English Male',
      'Daniel',
      'Jamie',
    ],
    isKidVoice: true,
  },
  {
    id: 'maya',
    label: 'Maya',
    subtitle: 'Bubbly Kid Scientist',
    sampleLine: "Woohoo! I'm Maya! Grab your magnifying glass and let's discover something super cool!",
    pitch: 1.56,
    rate: 1.14,
    preferredGender: 'female',
    preferredNames: [
      'Maisie',
      'Libby',
      'Google UK English Female',
      'Martha',
      'Serena',
      'Samantha',
    ],
    isKidVoice: true,
  },
  {
    id: 'toby',
    label: 'Toby',
    subtitle: 'Bouncy Puzzle Buddy',
    sampleLine: "Hiya pal! I'm Toby! Ready to crack tricky puzzles and beat our best score together?",
    pitch: 1.4,
    rate: 1.08,
    preferredGender: 'male',
    preferredNames: [
      'Jamie',
      'Ryan',
      'Oliver',
      'Arthur',
      'Google UK English Male',
      'Daniel',
    ],
    isKidVoice: true,
  },
  {
    id: 'lily',
    label: 'Lily',
    subtitle: 'Sparkly Story Kid',
    sampleLine: "Yippee! I'm Lily! Pick a fun adventure with me and let's jump straight into today's story!",
    pitch: 1.68,
    rate: 1.16,
    preferredGender: 'female',
    preferredNames: [
      'Maisie',
      'Libby',
      'Google UK English Female',
      'Samantha',
      'Ava',
      'Zoe',
    ],
    isKidVoice: true,
  },
];

const VOICE_STORAGE_KEY = 'schoola_rp_voice_preset_v1';
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
  if (typeof window === 'undefined') return 'teacher';
  try {
    const saved = localStorage.getItem(VOICE_STORAGE_KEY) as VoicePresetId | null;
    if (saved && VOICE_PRESETS.some((p) => p.id === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'teacher';
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

function isFriendlyVoice(v: SpeechSynthesisVoice): boolean {
  const lower = v.name.toLowerCase();
  return !ROBOTIC_VOICE_BLOCKLIST.some((bad) => lower.includes(bad));
}

function voiceQualityScore(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  const lang = v.lang.toLowerCase();
  let score = 0;
  if (lang.startsWith('en-gb')) score += 40;
  else if (lang.startsWith('en-au') || lang.startsWith('en-ie')) score += 20;
  else if (lang.startsWith('en')) score += 10;

  if (name.includes('natural') || name.includes('online')) score += 35;
  if (name.includes('enhanced') || name.includes('premium') || name.includes('siri')) score += 25;
  if (name.includes('google')) score += 20;
  if (name.includes('libby') || name.includes('maisie') || name.includes('sonia')) score += 22;
  if (name.includes('martha') || name.includes('serena') || name.includes('kate')) score += 18;
  return score;
}

export function getLovelySystemVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return [];

  const englishFriendly = voices.filter(
    (v) => v.lang.toLowerCase().startsWith('en') && isFriendlyVoice(v)
  );
  const pool = englishFriendly.length > 0 ? englishFriendly : voices.filter(isFriendlyVoice);

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

function findBestBritishVoice(preset: VoicePreset): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const allVoices = window.speechSynthesis.getVoices();
  if (!allVoices.length) return null;

  // Respect explicit user-chosen system voice if present on this device
  const customURI = getSelectedSystemVoiceURI();
  if (customURI && customURI !== 'auto') {
    const picked = allVoices.find((v) => v.voiceURI === customURI);
    if (picked) return picked;
  }

  const friendlyVoices = getLovelySystemVoices();
  const pool = friendlyVoices.length > 0 ? friendlyVoices : allVoices;

  const britishVoices = pool.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('en-gb') ||
      v.name.toLowerCase().includes('uk') ||
      v.name.toLowerCase().includes('british')
  );

  const preferredPool = britishVoices.length > 0 ? britishVoices : pool;

  for (const preferredName of preset.preferredNames) {
    const match = preferredPool.find((v) =>
      v.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (match) return match;
  }

  return preferredPool[0] || pool[0] || null;
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
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang || 'en-GB';
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
