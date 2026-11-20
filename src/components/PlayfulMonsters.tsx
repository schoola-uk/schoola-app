import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { playChimeSound } from './CorridorWidgets';
import { speakText, stopSpeaking, VoicePresetId } from '../utils/speech';

interface MonsterDef {
  id: string;
  name: string;
  emoji: string;
  voiceId: VoicePresetId;
  quips: string[];
  nameColor: string;
  ringColor: string;
  subjectId: string;
}

const MONSTERS: MonsterDef[] = [
  {
    id: 'bloop',
    name: 'Bloop',
    emoji: '🧮',
    voiceId: 'leo',
    quips: [
      'Boing! Slide my golden abacus beads to win bright Stars!',
      'Count with Bloop! Ten shiny beads waiting on the brass rods!',
      'Maths is magic! Match the sum puzzle for a golden star coin!',
    ],
    nameColor: 'text-sky-700',
    ringColor: 'drop-shadow-[0_12px_18px_rgba(14,165,233,0.35)]',
    subjectId: 'Maths',
  },
  {
    id: 'pip',
    name: 'Pip',
    emoji: '🔬',
    voiceId: 'maya',
    quips: [
      'Bubbles! Spin the Speaking Globe to discover amazing UK wonders!',
      'Explore rivers, mountains and oceans with Pip to win Stars!',
      'Curious minds shine! Spin the Earth and pick a map clue!',
    ],
    nameColor: 'text-emerald-700',
    ringColor: 'drop-shadow-[0_12px_18px_rgba(16,185,129,0.35)]',
    subjectId: 'Science',
  },
  {
    id: 'zuzu',
    name: 'Zuzu',
    emoji: '📖',
    voiceId: 'lily',
    quips: [
      'Ooh! Cast a glowing spelling rune in the Ancient Spellbook!',
      'Tap the right letters in order to unlock Wizard Stars!',
      'Words are superpowers! Can Zuzu help you solve this spell?',
    ],
    nameColor: 'text-rose-600',
    ringColor: 'drop-shadow-[0_12px_18px_rgba(244,63,94,0.35)]',
    subjectId: 'English',
  },
  {
    id: 'bramble',
    name: 'Bramble',
    emoji: '⭐',
    voiceId: 'toby',
    quips: [
      'Ding-dong! Tap the Glowing Path or chime the golden School Bell!',
      'Follow the rainbow stepping stones and win sparkling Stars!',
      'Ring the golden bell five times for a surprise Headteacher star!',
    ],
    nameColor: 'text-amber-700',
    ringColor: 'drop-shadow-[0_12px_18px_rgba(245,158,11,0.38)]',
    subjectId: 'Geography',
  },
];

const ACCENT_WORD_COLORS: Record<string, string> = {
  star: 'text-amber-500',
  stars: 'text-amber-500',
  gold: 'text-amber-600',
  golden: 'text-amber-600',
  abacus: 'text-orange-600',
  beads: 'text-rose-500',
  maths: 'text-sky-600',
  math: 'text-sky-600',
  magic: 'text-violet-600',
  magical: 'text-violet-600',
  globe: 'text-sky-600',
  earth: 'text-emerald-600',
  uk: 'text-blue-600',
  map: 'text-teal-600',
  maps: 'text-teal-600',
  spell: 'text-violet-600',
  spellbook: 'text-purple-600',
  letters: 'text-rose-500',
  words: 'text-pink-600',
  wizard: 'text-indigo-600',
  glowing: 'text-emerald-600',
  path: 'text-teal-600',
  pathway: 'text-emerald-600',
  rainbow: 'text-pink-500',
  bell: 'text-amber-600',
  chime: 'text-indigo-600',
  boing: 'text-sky-600',
  bubbles: 'text-emerald-600',
  ooh: 'text-rose-500',
  ding: 'text-amber-600',
  bloop: 'text-sky-600',
  pip: 'text-emerald-600',
  zuzu: 'text-rose-600',
  bramble: 'text-amber-600',
  win: 'text-emerald-600',
  puzzle: 'text-indigo-600',
  play: 'text-sky-600',
  explore: 'text-teal-600',
  discover: 'text-emerald-600',
};

const HighlightedAccentText: React.FC<{ text: string }> = ({ text }) => {
  const tokens = text.split(/(\s+)/);
  return (
    <>
      {tokens.map((token, idx) => {
        const clean = token.toLowerCase().replace(/[^a-z]/g, '');
        const accentClass = ACCENT_WORD_COLORS[clean];
        if (accentClass) {
          return (
            <span key={idx} className={`${accentClass} font-bold`}>
              {token}
            </span>
          );
        }
        return <React.Fragment key={idx}>{token}</React.Fragment>;
      })}
    </>
  );
};

export const MonsterSvg: React.FC<{ id: string; jumping?: boolean; className?: string }> = ({
  id,
  jumping = false,
  className = 'w-20 h-20 sm:w-24 sm:h-24',
}) => {
  switch (id) {
    case 'bloop':
      return (
        <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden="true">
          <polygon points="24,22 18,6 34,16" fill="#FDE047" />
          <polygon points="66,22 72,6 56,16" fill="#FDE047" />
          <polygon points="45,16 45,2 52,15" fill="#FBBF24" />
          <rect x="16" y="16" width="58" height="62" rx="28" fill="#38BDF8" stroke="#0369A1" strokeWidth="3" />
          <ellipse cx="45" cy="56" rx="20" ry="16" fill="#BAE6FD" />
          <circle cx="34" cy="36" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx="56" cy="36" r="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
          <circle cx={jumping ? 36 : 34} cy="36" r="4" fill="#0F172A" />
          <circle cx={jumping ? 58 : 56} cy="36" r="4" fill="#0F172A" />
          <circle cx="32" cy="34" r="1.5" fill="#FFFFFF" />
          <circle cx="54" cy="34" r="1.5" fill="#FFFFFF" />
          <path d="M31 50 Q45 62 59 50 Z" fill="#0F172A" />
          <polygon points="37,51 40,56 43,51" fill="#FFFFFF" />
          <polygon points="47,51 50,56 53,51" fill="#FFFFFF" />
          <ellipse cx="32" cy="80" rx="10" ry="5" fill="#0284C7" />
          <ellipse cx="58" cy="80" rx="10" ry="5" fill="#0284C7" />
        </svg>
      );
    case 'pip':
      return (
        <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden="true">
          <path d="M45 18 V6" stroke="#065F46" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="38" cy="8" rx="8" ry="4" transform="rotate(-25 38 8)" fill="#A7F3D0" />
          <ellipse cx="52" cy="8" rx="8" ry="4" transform="rotate(25 52 8)" fill="#6EE7B7" />
          <path d="M20 50 C20 24 30 16 45 16 C60 16 70 24 70 50 C70 72 60 78 45 78 C30 78 20 72 20 50 Z" fill="#34D399" stroke="#047857" strokeWidth="3" />
          <circle cx="28" cy="58" r="4" fill="#10B981" />
          <circle cx="62" cy="54" r="5" fill="#10B981" />
          <circle cx="45" cy="37" r="13" fill="#FFFFFF" stroke="#064E3B" strokeWidth="2.5" />
          <circle cx="45" cy="37" r="6.5" fill="#0F172A" />
          <circle cx="42.5" cy="34.5" r="2.5" fill="#FFFFFF" />
          <ellipse cx="29" cy="48" rx="4" ry="2.5" fill="#FB7185" opacity="0.6" />
          <ellipse cx="61" cy="48" rx="4" ry="2.5" fill="#FB7185" opacity="0.6" />
          <path d="M36 54 Q45 63 54 54" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="33" cy="80" rx="9" ry="5" fill="#059669" />
          <ellipse cx="57" cy="80" rx="9" ry="5" fill="#059669" />
        </svg>
      );
    case 'zuzu':
      return (
        <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden="true">
          <circle cx="22" cy="24" r="10" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
          <circle cx="68" cy="24" r="10" fill="#FB7185" stroke="#9F1239" strokeWidth="2.5" />
          <circle cx="22" cy="24" r="5" fill="#FECDD3" />
          <circle cx="68" cy="24" r="5" fill="#FECDD3" />
          <circle cx="45" cy="48" r="30" fill="#F43F5E" stroke="#9F1239" strokeWidth="3" />
          <path d="M45 55 L48 61 L55 62 L50 66 L51 73 L45 69 L39 73 L40 66 L35 62 L42 61 Z" fill="#FDE047" />
          <circle cx="34" cy="39" r="7.5" fill="#FFFFFF" />
          <circle cx="56" cy="39" r="7.5" fill="#FFFFFF" />
          <circle cx="35" cy="39" r="4" fill="#0F172A" />
          <circle cx="55" cy="39" r="4" fill="#0F172A" />
          <circle cx="33" cy="37" r="1.5" fill="#FFFFFF" />
          <circle cx="53" cy="37" r="1.5" fill="#FFFFFF" />
          <path d="M38 48 Q45 54 52 48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="33" cy="80" rx="9" ry="5" fill="#BE123C" />
          <ellipse cx="57" cy="80" rx="9" ry="5" fill="#BE123C" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 90 90" className={className} fill="none" aria-hidden="true">
          <ellipse cx="14" cy="46" rx="10" ry="6" transform="rotate(-20 14 46)" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="76" cy="46" rx="10" ry="6" transform="rotate(20 76 46)" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
          <rect x="18" y="18" width="54" height="60" rx="24" fill="#FBBF24" stroke="#B45309" strokeWidth="3" />
          <path d="M38 18 Q45 6 52 18" fill="#F97316" />
          <circle cx="34" cy="38" r="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
          <circle cx="56" cy="38" r="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
          <circle cx="35" cy="38" r="4" fill="#0F172A" />
          <circle cx="55" cy="38" r="4" fill="#0F172A" />
          <path d="M34 52 Q45 64 56 52 Z" fill="#991B1B" />
          <ellipse cx="33" cy="80" rx="9" ry="5" fill="#D97706" />
          <ellipse cx="57" cy="80" rx="9" ry="5" fill="#D97706" />
        </svg>
      );
  }
};

interface PlayfulMonstersBarProps {
  activeMessage?: string;
  onMonsterTap?: (subjectId: string, monsterName: string, quip: string) => void;
}

export const PlayfulMonstersBar: React.FC<PlayfulMonstersBarProps> = ({
  activeMessage,
  onMonsterTap,
}) => {
  const [selectedMonster, setSelectedMonster] = useState<MonsterDef>(MONSTERS[0]);
  const [quipIndexByMonster, setQuipIndexByMonster] = useState<Record<string, number>>({});
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const prevMessageRef = useRef<string | undefined>(activeMessage);

  const displayMessage = activeMessage || selectedMonster.quips[0];

  const speakBubble = (text: string, voiceId: VoicePresetId = selectedMonster.voiceId) => {
    if (!voiceEnabled) return;
    const clean = text.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
    setIsSpeaking(true);
    speakText(clean, () => setIsSpeaking(false), voiceId);
  };

  // Speak automatically whenever a playground widget or monster updates the bubble text
  useEffect(() => {
    if (activeMessage && activeMessage !== prevMessageRef.current) {
      prevMessageRef.current = activeMessage;
      if (voiceEnabled) {
        speakBubble(activeMessage, selectedMonster.voiceId);
      }
    }
  }, [activeMessage, voiceEnabled]);

  const handleTap = (m: MonsterDef) => {
    const nextIdx = ((quipIndexByMonster[m.id] ?? -1) + 1) % m.quips.length;
    const nextQuip = m.quips[nextIdx];
    setQuipIndexByMonster((prev) => ({ ...prev, [m.id]: nextIdx }));
    setSelectedMonster(m);
    setBouncingId(m.id);
    playChimeSound('spell');
    prevMessageRef.current = nextQuip;
    onMonsterTap?.(m.subjectId, m.name, nextQuip);
    speakBubble(nextQuip, m.voiceId);
    setTimeout(() => setBouncingId(null), 700);
  };

  return (
    <div className="w-full py-2">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Frameless Floating Little Monsters standing directly on the sky/clouds */}
        <div className="flex items-end justify-center gap-4 sm:gap-7 flex-wrap">
          {MONSTERS.map((m, idx) => {
            const isSelected = selectedMonster.id === m.id;
            const isBouncing = bouncingId === m.id;
            return (
              <motion.button
                key={m.id}
                type="button"
                animate={
                  isBouncing
                    ? { y: [0, -24, 0, -12, 0], rotate: [0, -12, 12, 0], scale: [1, 1.14, 1] }
                    : isSelected && isSpeaking
                    ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
                    : { y: [0, -6, 0] }
                }
                transition={
                  isBouncing
                    ? { duration: 0.65 }
                    : isSelected && isSpeaking
                    ? { duration: 0.45, repeat: Infinity }
                    : { duration: 2.8, repeat: Infinity, delay: idx * 0.35, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.14, y: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTap(m)}
                className="group relative cursor-pointer flex flex-col items-center focus:outline-none bg-transparent border-0 p-1"
                aria-label={`Tap ${m.name} the learning monster to hear them speak`}
              >
                {/* Active selection soft glow halo */}
                {isSelected && (
                  <span className="pointer-events-none absolute -inset-2 rounded-full bg-white/70 blur-md -z-10" />
                )}

                <div className={m.ringColor}>
                  <MonsterSvg id={m.id} jumping={isBouncing} />
                </div>

                {/* Soft ground shadow directly under monster feet */}
                <span className="w-14 h-2.5 -mt-1 rounded-full bg-sky-900/15 blur-[2px] group-hover:scale-110 transition-transform" />

                <span
                  className={`mt-1 font-playful font-bold text-sm tracking-wide transition-transform ${
                    isSelected ? `${m.nameColor} scale-110` : 'text-sky-900/85'
                  }`}
                >
                  {m.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Animated Speaking Comic Speech Bubble with Playful Font & Accent Colours */}
        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayMessage}
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ duration: 0.2 }}
              onClick={() => speakBubble(displayMessage, selectedMonster.voiceId)}
              className="relative bg-white/95 text-slate-900 rounded-[2rem] px-6 py-4 border-3 border-sky-300 shadow-lg text-left cursor-pointer"
            >
              {/* Speech Bubble Tail */}
              <div className="hidden lg:block absolute top-1/2 -left-3 -translate-y-1/2 w-5 h-5 bg-white border-l-3 border-b-3 border-sky-300 rotate-45" />
              <div className="lg:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-l-3 border-t-3 border-sky-300 rotate-45" />

              <div className="flex items-center justify-between gap-3 mb-1">
                <p className={`font-playful font-bold text-sm flex items-center gap-1.5 ${selectedMonster.nameColor}`}>
                  <span className="text-lg">{selectedMonster.emoji}</span>
                  <span>{selectedMonster.name} says:</span>
                  {isSpeaking && (
                    <span className="ml-1 inline-flex items-center gap-0.5 text-[11px] font-sans font-extrabold text-amber-600 animate-pulse">
                      Speaking...
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (voiceEnabled) {
                      stopSpeaking();
                      setIsSpeaking(false);
                      setVoiceEnabled(false);
                    } else {
                      setVoiceEnabled(true);
                      const clean = displayMessage.replace(/[\u{1F300}-\u{1FAFF}]/gu, '');
                      setIsSpeaking(true);
                      speakText(clean, () => setIsSpeaking(false), selectedMonster.voiceId);
                    }
                  }}
                  aria-label={voiceEnabled ? 'Mute monster voice' : 'Unmute monster voice'}
                  className={`min-h-[34px] px-3 py-1 rounded-full text-xs font-playful font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    voiceEnabled
                      ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{voiceEnabled ? 'Voice On' : 'Muted'}</span>
                </button>
              </div>

              <p className="font-playful text-lg sm:text-xl leading-snug text-slate-800">
                <HighlightedAccentText text={displayMessage} />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
