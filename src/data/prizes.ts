import type { VoicePresetId } from '../utils/speech';

export interface PrizeItem {
  id: string;
  name: string;
  category: 'creature' | 'collectible';
  cost: number;
  shortTag: string;
  voiceId: VoicePresetId;
  panelGradient: string;
  borderColor: string;
  accentHex: string;
  synthNotes: number[];
  waveType: OscillatorType;
  accomplishmentText: string;
}

export const REWARD_PRIZES: PrizeItem[] = [
  {
    id: 'creature-pip-sprout',
    name: 'Pip Sprout',
    category: 'creature',
    cost: 2,
    shortTag: 'Starter Pal',
    voiceId: 'amy',
    panelGradient: 'from-emerald-400 to-teal-500',
    borderColor: 'border-emerald-700',
    accentHex: '#10B981',
    synthNotes: [523.25, 659.25, 783.99, 1046.5],
    waveType: 'sine',
    accomplishmentText:
      'Pip the Sprout Buddy! Awarded for beginning your Activity Land adventure and keeping curiosity growing every day.',
  },
  {
    id: 'creature-starlight-dragon',
    name: 'Starlight Dragon',
    category: 'creature',
    cost: 4,
    shortTag: 'Sky Creature',
    voiceId: 'leo',
    panelGradient: 'from-violet-500 to-purple-600',
    borderColor: 'border-purple-800',
    accentHex: '#7C3AED',
    synthNotes: [440, 554.37, 659.25, 880, 1108.73],
    waveType: 'triangle',
    accomplishmentText:
      'Starlight Dragon! This friendly winged dragon loves flying across Activity Land whenever you earn stars in quizzes.',
  },
  {
    id: 'creature-pocket-panda',
    name: 'Pocket Panda',
    category: 'creature',
    cost: 5,
    shortTag: 'Bamboo Pal',
    voiceId: 'toby',
    panelGradient: 'from-sky-400 to-blue-600',
    borderColor: 'border-blue-800',
    accentHex: '#0284C7',
    synthNotes: [392.0, 493.88, 587.33, 783.99],
    waveType: 'sine',
    accomplishmentText:
      'Pocket Panda! A clever number-counting companion who cheers you on through every tricky puzzle.',
  },
  {
    id: 'creature-nimbus-owl',
    name: 'Nimbus Owl',
    category: 'creature',
    cost: 6,
    shortTag: 'Cloud Watcher',
    voiceId: 'lily',
    panelGradient: 'from-amber-400 to-orange-500',
    borderColor: 'border-orange-700',
    accentHex: '#EA580C',
    synthNotes: [587.33, 739.99, 880, 1174.66],
    waveType: 'triangle',
    accomplishmentText:
      'Nimbus Owl! Perched high in the clouds, Nimbus spots brilliant reading, spelling and storytellers.',
  },
  {
    id: 'creature-bubble-axolotl',
    name: 'Bubble Axolotl',
    category: 'creature',
    cost: 8,
    shortTag: 'Ocean Buddy',
    voiceId: 'amy',
    panelGradient: 'from-pink-400 to-rose-500',
    borderColor: 'border-rose-700',
    accentHex: '#E11D48',
    synthNotes: [659.25, 783.99, 987.77, 1318.51],
    waveType: 'sine',
    accomplishmentText:
      'Bubble Axolotl! A cheerful aquatic creature earned by exploring science labs and ocean mysteries.',
  },
  {
    id: 'collectible-golden-abacus',
    name: 'Golden Abacus',
    category: 'collectible',
    cost: 3,
    shortTag: 'Maths Relic',
    voiceId: 'leo',
    panelGradient: 'from-yellow-400 to-amber-500',
    borderColor: 'border-amber-700',
    accentHex: '#D97706',
    synthNotes: [523.25, 587.33, 659.25, 783.99, 1046.5],
    waveType: 'triangle',
    accomplishmentText:
      'The Golden Abacus! A sparkling maths treasure celebrating sharp counting, times tables and problem solving.',
  },
  {
    id: 'collectible-crystal-globe',
    name: 'Crystal Globe',
    category: 'collectible',
    cost: 5,
    shortTag: 'World Relic',
    voiceId: 'toby',
    panelGradient: 'from-teal-400 to-cyan-600',
    borderColor: 'border-cyan-800',
    accentHex: '#0D9488',
    synthNotes: [493.88, 659.25, 739.99, 987.77],
    waveType: 'sine',
    accomplishmentText:
      'The Crystal Globe! Unlocked by brave explorers who chart countries, oceans and ancient worlds.',
  },
  {
    id: 'collectible-wizard-quill',
    name: 'Wizard Quill',
    category: 'collectible',
    cost: 6,
    shortTag: 'Story Relic',
    voiceId: 'lily',
    panelGradient: 'from-fuchsia-500 to-pink-600',
    borderColor: 'border-pink-800',
    accentHex: '#C026D3',
    synthNotes: [554.37, 698.46, 830.61, 1108.73],
    waveType: 'triangle',
    accomplishmentText:
      'The Enchanted Wizard Quill! Celebrates creative storytelling, phonics mastery and brilliant punctuation.',
  },
  {
    id: 'collectible-rainbow-compass',
    name: 'Rainbow Compass',
    category: 'collectible',
    cost: 7,
    shortTag: 'Pathfinder',
    voiceId: 'toby',
    panelGradient: 'from-indigo-500 to-blue-600',
    borderColor: 'border-indigo-800',
    accentHex: '#4F46E5',
    synthNotes: [440, 523.25, 659.25, 783.99, 1046.5],
    waveType: 'sine',
    accomplishmentText:
      'The Rainbow Compass! Guides curious minds safely across every colourful subject house in Activity Land.',
  },
  {
    id: 'collectible-crown-curiosity',
    name: 'Crown of Curiosity',
    category: 'collectible',
    cost: 12,
    shortTag: 'Grand Prize',
    voiceId: 'lily',
    panelGradient: 'from-rose-500 via-amber-500 to-orange-500',
    borderColor: 'border-rose-800',
    accentHex: '#F59E0B',
    synthNotes: [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98],
    waveType: 'triangle',
    accomplishmentText:
      'The Legendary Crown of Curiosity! The highest honour in Activity Land for dedicated stars and explorers.',
  },
];

export function playPrizeNotes(notes: number[], waveType: OscillatorType = 'sine'): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.11;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.42);
    });
  } catch {
    // Ignore audio context restriction errors
  }
}
