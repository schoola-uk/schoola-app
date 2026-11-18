// Browser Web Speech API helper with selectable English RP & Soft Teacher voice profiles

export type VoicePresetId = 'teacher' | 'pixie' | 'barnaby' | 'gentle';

export interface VoicePreset {
  id: VoicePresetId;
  label: string;
  subtitle: string;
  pitch: number;
  rate: number;
  preferredGender: 'female' | 'male';
  preferredNames: string[];
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'teacher',
    label: 'Miss Clara',
    subtitle: 'Soft UK Teacher',
    pitch: 1.04,
    rate: 0.90,
    preferredGender: 'female',
    preferredNames: ['Google UK English Female', 'Martha', 'Serena', 'Libby', 'Sonia', 'Kate', 'Hazel'],
  },
  {
    id: 'pixie',
    label: 'Pip',
    subtitle: 'Cute RP Storyteller',
    pitch: 1.24,
    rate: 0.98,
    preferredGender: 'female',
    preferredNames: ['Maisie', 'Libby', 'Google UK English Female', 'Serena', 'Martha'],
  },
  {
    id: 'barnaby',
    label: 'Mr Barnaby',
    subtitle: 'Warm RP Explorer',
    pitch: 0.94,
    rate: 0.92,
    preferredGender: 'male',
    preferredNames: ['Google UK English Male', 'Daniel', 'Arthur', 'Oliver', 'Ryan', 'George'],
  },
  {
    id: 'gentle',
    label: 'Willow',
    subtitle: 'Calm Gentle RP',
    pitch: 1.12,
    rate: 0.84,
    preferredGender: 'female',
    preferredNames: ['Serena', 'Kate', 'Sonia', 'Hazel', 'Google UK English Female'],
  },
];

const VOICE_STORAGE_KEY = 'schoola_rp_voice_preset_v1';

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

function findBestBritishVoice(preset: VoicePreset): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const britishVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith('en-gb') ||
      v.name.toLowerCase().includes('uk') ||
      v.name.toLowerCase().includes('british')
  );

  const pool = britishVoices.length > 0 ? britishVoices : voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  if (!pool.length) return null;

  for (const preferredName of preset.preferredNames) {
    const exact = pool.find((v) => v.name.toLowerCase().includes(preferredName.toLowerCase()));
    if (exact) return exact;
  }

  return pool[0];
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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = preset.rate;
    utterance.pitch = preset.pitch;

    const chosenVoice = findBestBritishVoice(preset);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
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
