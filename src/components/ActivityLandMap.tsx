import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Home,
  LayoutGrid,
  Lock,
  Music2,
  Play,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { matchesYearFilter, YEAR_GROUPS } from '../data/learningWorlds';
import { playPrizeNotes, PrizeItem, REWARD_PRIZES } from '../data/prizes';
import { LearnerProgress, MascotId, Subject, Topic, YearGroup } from '../types';
import { playChimeSound } from './CorridorWidgets';
import { RedOrangeDoorIcon } from './WorldIllustrations';
import { speakText, stopSpeaking } from '../utils/speech';

interface ActivityLandMapProps {
  progress: LearnerProgress;
  onSelectYear: (year: YearGroup) => void;
  onOpenTopic: (topic: Topic) => void;
  onCycleMascot: () => void;
  onAdoptPrize: (prizeId: string, cost: number) => void;
  onOpenParentPortal: () => void;
  onOpenHome: () => void;
  onSwitchToDashboard: () => void;
}

interface HouseTheme {
  shortName: string;
  roofBg: string;
  bodyBg: string;
  border: string;
  doorBg: string;
  badgeBg: string;
  text: string;
  buttonBg: string;
}

const HOUSE_THEMES: Record<string, HouseTheme> = {
  English: {
    shortName: 'English',
    roofBg: 'bg-rose-500',
    bodyBg: 'bg-rose-50',
    border: 'border-rose-400',
    doorBg: 'bg-rose-600',
    badgeBg: 'bg-rose-500',
    text: 'text-rose-950',
    buttonBg: 'bg-rose-500 hover:bg-rose-600 border-rose-700',
  },
  Maths: {
    shortName: 'Maths',
    roofBg: 'bg-sky-500',
    bodyBg: 'bg-sky-50',
    border: 'border-sky-400',
    doorBg: 'bg-sky-600',
    badgeBg: 'bg-sky-500',
    text: 'text-sky-950',
    buttonBg: 'bg-sky-500 hover:bg-sky-600 border-sky-700',
  },
  Science: {
    shortName: 'Science',
    roofBg: 'bg-emerald-500',
    bodyBg: 'bg-emerald-50',
    border: 'border-emerald-400',
    doorBg: 'bg-emerald-600',
    badgeBg: 'bg-emerald-500',
    text: 'text-emerald-950',
    buttonBg: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700',
  },
  History: {
    shortName: 'History',
    roofBg: 'bg-amber-500',
    bodyBg: 'bg-amber-50',
    border: 'border-amber-400',
    doorBg: 'bg-amber-600',
    badgeBg: 'bg-amber-500',
    text: 'text-amber-950',
    buttonBg: 'bg-amber-500 hover:bg-amber-600 border-amber-700',
  },
  Geography: {
    shortName: 'Geography',
    roofBg: 'bg-teal-500',
    bodyBg: 'bg-teal-50',
    border: 'border-teal-400',
    doorBg: 'bg-teal-600',
    badgeBg: 'bg-teal-500',
    text: 'text-teal-950',
    buttonBg: 'bg-teal-500 hover:bg-teal-600 border-teal-700',
  },
  Art: {
    shortName: 'Art',
    roofBg: 'bg-orange-500',
    bodyBg: 'bg-orange-50',
    border: 'border-orange-400',
    doorBg: 'bg-orange-600',
    badgeBg: 'bg-orange-500',
    text: 'text-orange-950',
    buttonBg: 'bg-orange-500 hover:bg-orange-600 border-orange-700',
  },
  DT: {
    shortName: 'Design & Tech',
    roofBg: 'bg-pink-500',
    bodyBg: 'bg-pink-50',
    border: 'border-pink-400',
    doorBg: 'bg-pink-600',
    badgeBg: 'bg-pink-500',
    text: 'text-pink-950',
    buttonBg: 'bg-pink-500 hover:bg-pink-600 border-pink-700',
  },
  Computing: {
    shortName: 'Computing',
    roofBg: 'bg-indigo-500',
    bodyBg: 'bg-indigo-50',
    border: 'border-indigo-400',
    doorBg: 'bg-indigo-600',
    badgeBg: 'bg-indigo-500',
    text: 'text-indigo-950',
    buttonBg: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-700',
  },
  Music: {
    shortName: 'Music',
    roofBg: 'bg-violet-500',
    bodyBg: 'bg-violet-50',
    border: 'border-violet-400',
    doorBg: 'bg-violet-600',
    badgeBg: 'bg-violet-500',
    text: 'text-violet-950',
    buttonBg: 'bg-violet-500 hover:bg-violet-600 border-violet-700',
  },
  PE: {
    shortName: 'Sports & PE',
    roofBg: 'bg-lime-500',
    bodyBg: 'bg-lime-50',
    border: 'border-lime-400',
    doorBg: 'bg-lime-600',
    badgeBg: 'bg-lime-600',
    text: 'text-lime-950',
    buttonBg: 'bg-lime-500 hover:bg-lime-600 border-lime-700',
  },
  RE: {
    shortName: 'Beliefs & RE',
    roofBg: 'bg-fuchsia-500',
    bodyBg: 'bg-fuchsia-50',
    border: 'border-fuchsia-400',
    doorBg: 'bg-fuchsia-600',
    badgeBg: 'bg-fuchsia-500',
    text: 'text-fuchsia-950',
    buttonBg: 'bg-fuchsia-500 hover:bg-fuchsia-600 border-fuchsia-700',
  },
  PSHE: {
    shortName: 'Wellbeing',
    roofBg: 'bg-cyan-500',
    bodyBg: 'bg-cyan-50',
    border: 'border-cyan-400',
    doorBg: 'bg-cyan-600',
    badgeBg: 'bg-cyan-500',
    text: 'text-cyan-950',
    buttonBg: 'bg-cyan-500 hover:bg-cyan-600 border-cyan-700',
  },
};

const MASCOT_META: Record<
  MascotId,
  { name: string; ring: string; bg: string; hair: string; skin: string; accent: string }
> = {
  sparkle: {
    name: 'Sparkle',
    ring: 'from-pink-400 to-sky-400',
    bg: 'bg-pink-50 border-pink-300',
    hair: '#FF6B9D',
    skin: '#FFE5EC',
    accent: '#FBBF24',
  },
  jack: {
    name: 'Jack',
    ring: 'from-sky-400 to-amber-400',
    bg: 'bg-sky-50 border-sky-300',
    hair: '#0284C7',
    skin: '#E0F2FE',
    accent: '#F59E0B',
  },
  celeste: {
    name: 'Celeste',
    ring: 'from-violet-400 to-orange-400',
    bg: 'bg-violet-50 border-violet-300',
    hair: '#8B5CF6',
    skin: '#F5F3FF',
    accent: '#FB923C',
  },
  pippa: {
    name: 'Pippa',
    ring: 'from-emerald-400 to-pink-400',
    bg: 'bg-emerald-50 border-emerald-300',
    hair: '#059669',
    skin: '#ECFDF5',
    accent: '#F472B6',
  },
};

// S-curve board game visual order on large 4-column desktop screens:
// Row 1 (L->R): 1, 2, 3, 4
// Row 2 (R->L): 8, 7, 6, 5
// Row 3 (L->R): 9, 10, 11, 12
const LG_ORDER_CLASSES = [
  'lg:order-1',
  'lg:order-2',
  'lg:order-3',
  'lg:order-4',
  'lg:order-8',
  'lg:order-7',
  'lg:order-6',
  'lg:order-5',
  'lg:order-9',
  'lg:order-10',
  'lg:order-11',
  'lg:order-12',
];

const MiniCompanionSvg: React.FC<{ mascotId: MascotId }> = ({ mascotId }) => {
  const m = MASCOT_META[mascotId] || MASCOT_META.sparkle;
  return (
    <svg viewBox="0 0 40 40" className="w-10 h-10 shrink-0 drop-shadow-xs" fill="none">
      <path d="M5 14 Q-1 17 4 25 Q7 27 10 21 Z" fill={m.accent} opacity="0.7" />
      <path d="M35 14 Q41 17 36 25 Q33 27 30 21 Z" fill={m.accent} opacity="0.7" />
      <circle cx="20" cy="20" r="12" fill={m.skin} stroke={m.hair} strokeWidth="1.5" />
      <path d="M8 18 Q14 10 20 13 Q26 10 32 18 Q26 15 20 16 Q14 15 8 18 Z" fill={m.hair} />
      <circle cx="15" cy="21" r="2.2" fill="#1E293B" />
      <circle cx="25" cy="21" r="2.2" fill="#1E293B" />
      <circle cx="14.2" cy="20.2" r="0.8" fill="#FFFFFF" />
      <circle cx="24.2" cy="20.2" r="0.8" fill="#FFFFFF" />
      <path d="M16.5 25.5 Q20 29 23.5 25.5" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
      <polygon points="20,4 22.5,8 20,11 17.5,8" fill={m.accent} />
    </svg>
  );
};

const PrizeArtwork: React.FC<{ prizeId: string; locked?: boolean }> = ({ prizeId, locked }) => {
  const dim = locked ? 'opacity-45 grayscale' : '';
  switch (prizeId) {
    case 'creature-pip-sprout':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M40 22 C40 12 52 8 54 16 C48 18 42 20 40 22 Z" fill="#4ADE80" />
          <path d="M40 22 C40 12 28 8 26 16 C32 18 38 20 40 22 Z" fill="#22C55E" />
          <ellipse cx="40" cy="48" rx="22" ry="20" fill="#ECFDF5" stroke="#10B981" strokeWidth="3" />
          <circle cx="32" cy="45" r="3.5" fill="#064E3B" />
          <circle cx="48" cy="45" r="3.5" fill="#064E3B" />
          <circle cx="27" cy="51" r="3.5" fill="#FCA5A5" opacity="0.8" />
          <circle cx="53" cy="51" r="3.5" fill="#FCA5A5" opacity="0.8" />
          <path d="M35 53 Q40 58 45 53" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'creature-starlight-dragon':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M14 40 Q4 24 22 28 L28 42 Z" fill="#FDE047" />
          <path d="M66 40 Q76 24 58 28 L52 42 Z" fill="#FDE047" />
          <ellipse cx="40" cy="46" rx="19" ry="20" fill="#A855F7" />
          <ellipse cx="40" cy="52" rx="11" ry="12" fill="#FDE68A" />
          <polygon points="28,26 23,14 34,22" fill="#FBBF24" />
          <polygon points="52,26 57,14 46,22" fill="#FBBF24" />
          <circle cx="33" cy="39" r="3.2" fill="#1E1B4B" />
          <circle cx="47" cy="39" r="3.2" fill="#1E1B4B" />
          <path d="M36 46 Q40 50 44 46" stroke="#1E1B4B" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
    case 'creature-pocket-panda':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <circle cx="23" cy="24" r="8" fill="#1E293B" />
          <circle cx="57" cy="24" r="8" fill="#1E293B" />
          <circle cx="40" cy="44" r="22" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <ellipse cx="31" cy="42" rx="6" ry="7" transform="rotate(-15 31 42)" fill="#1E293B" />
          <ellipse cx="49" cy="42" rx="6" ry="7" transform="rotate(15 49 42)" fill="#1E293B" />
          <circle cx="31" cy="41" r="2.2" fill="#FFFFFF" />
          <circle cx="49" cy="41" r="2.2" fill="#FFFFFF" />
          <ellipse cx="40" cy="49" rx="3.5" ry="2.5" fill="#1E293B" />
          <path d="M35 54 Q40 58 45 54" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'creature-nimbus-owl':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M22 28 L16 14 L32 22 Z" fill="#F97316" />
          <path d="M58 28 L64 14 L48 22 Z" fill="#F97316" />
          <ellipse cx="40" cy="46" rx="21" ry="22" fill="#FB923C" />
          <ellipse cx="40" cy="54" rx="13" ry="12" fill="#FEF3C7" />
          <circle cx="32" cy="39" r="7" fill="#FFFFFF" />
          <circle cx="48" cy="39" r="7" fill="#FFFFFF" />
          <circle cx="32" cy="39" r="3.2" fill="#1E293B" />
          <circle cx="48" cy="39" r="3.2" fill="#1E293B" />
          <polygon points="40,42 36,48 44,48" fill="#FACC15" />
        </svg>
      );
    case 'creature-bubble-axolotl':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M18 36 L8 30 M18 44 L6 44 M18 52 L9 58" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
          <path d="M62 36 L72 30 M62 44 L74 44 M62 52 L71 58" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="40" cy="46" rx="22" ry="18" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2.5" />
          <circle cx="32" cy="44" r="3" fill="#881337" />
          <circle cx="48" cy="44" r="3" fill="#881337" />
          <path d="M33 52 Q40 57 47 52" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="62" cy="20" r="4" fill="#BAE6FD" opacity="0.8" />
          <circle cx="69" cy="14" r="2.5" fill="#BAE6FD" opacity="0.8" />
        </svg>
      );
    case 'collectible-golden-abacus':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <rect x="14" y="18" width="52" height="44" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="4" />
          <line x1="16" y1="30" x2="64" y2="30" stroke="#92400E" strokeWidth="2.5" />
          <line x1="16" y1="42" x2="64" y2="42" stroke="#92400E" strokeWidth="2.5" />
          <line x1="16" y1="53" x2="64" y2="53" stroke="#92400E" strokeWidth="2.5" />
          <circle cx="28" cy="30" r="4.5" fill="#EF4444" />
          <circle cx="40" cy="30" r="4.5" fill="#F59E0B" />
          <circle cx="34" cy="42" r="4.5" fill="#10B981" />
          <circle cx="49" cy="42" r="4.5" fill="#3B82F6" />
          <circle cx="29" cy="53" r="4.5" fill="#8B5CF6" />
          <circle cx="52" cy="53" r="4.5" fill="#EC4899" />
        </svg>
      );
    case 'collectible-crystal-globe':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <circle cx="40" cy="36" r="22" fill="#2DD4BF" stroke="#0F766E" strokeWidth="3" />
          <path d="M29 28 Q36 24 41 32 Q37 42 30 40 Z" fill="#10B981" />
          <path d="M46 31 Q54 33 52 44 Q46 47 43 39 Z" fill="#34D399" />
          <path d="M28 60 L52 60 L47 68 L33 68 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <line x1="40" y1="58" x2="40" y2="60" stroke="#92400E" strokeWidth="4" />
          <circle cx="31" cy="25" r="3" fill="#FFFFFF" opacity="0.8" />
        </svg>
      );
    case 'collectible-wizard-quill':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M22 60 Q28 24 62 14 Q56 44 30 56 Z" fill="#F0ABFC" stroke="#A21CAF" strokeWidth="2.5" />
          <path d="M22 60 L60 16" stroke="#701A75" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="44" y="48" width="18" height="16" rx="4" fill="#312E81" />
          <circle cx="53" cy="48" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'collectible-rainbow-compass':
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <circle cx="40" cy="42" r="23" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="4" />
          <circle cx="40" cy="15" r="5" stroke="#F59E0B" strokeWidth="3" fill="none" />
          <polygon points="40,24 46,42 40,40 34,42" fill="#EF4444" />
          <polygon points="40,60 46,42 40,44 34,42" fill="#3B82F6" />
          <circle cx="40" cy="42" r="3.5" fill="#FBBF24" />
        </svg>
      );
    case 'collectible-crown-curiosity':
    default:
      return (
        <svg viewBox="0 0 80 80" className={`w-16 h-16 ${dim}`} fill="none">
          <path d="M14 56 L18 26 L31 40 L40 18 L49 40 L62 26 L66 56 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
          <rect x="14" y="54" width="52" height="9" rx="4" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
          <circle cx="40" cy="16" r="4" fill="#F43F5E" />
          <circle cx="18" cy="24" r="3.5" fill="#38BDF8" />
          <circle cx="62" cy="24" r="3.5" fill="#34D399" />
          <circle cx="40" cy="44" r="4" fill="#A855F7" />
        </svg>
      );
  }
};

export const ActivityLandMap: React.FC<ActivityLandMapProps> = ({
  progress,
  onSelectYear,
  onOpenTopic,
  onCycleMascot,
  onAdoptPrize,
  onOpenParentPortal,
  onOpenHome,
  onSwitchToDashboard,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isChestOpen, setIsChestOpen] = useState(false);
  const [shopFilter, setShopFilter] = useState<'all' | 'creature' | 'collectible'>('all');
  const [buddyPulse, setBuddyPulse] = useState(false);
  const [playingPrizeId, setPlayingPrizeId] = useState<string | null>(null);
  const [justAdoptedId, setJustAdoptedId] = useState<string | null>(null);

  const mascotMeta = MASCOT_META[progress.mascotId] || MASCOT_META.sparkle;

  // Per-subject completion counts for badges & next-up highlight
  const subjectStats = useMemo(() => {
    const map: Record<string, { total: number; done: number; topics: Topic[] }> = {};
    SUBJECTS.forEach((subj) => {
      const matchingYear = TOPICS.filter(
        (t) => t.subjectId === subj.id && matchesYearFilter(t, progress.selectedYear)
      );
      const list =
        matchingYear.length > 0 ? matchingYear : TOPICS.filter((t) => t.subjectId === subj.id);
      const done = list.filter((t) => progress.completedTopics.includes(t.id)).length;
      map[subj.id] = { total: list.length, done, topics: list };
    });
    return map;
  }, [progress.selectedYear, progress.completedTopics]);

  // First house along 1..12 with remaining uncompleted topics gets a friendly "Next!" marker
  const nextFrontierSubjectId = useMemo(() => {
    const next = SUBJECTS.find((s) => {
      const stat = subjectStats[s.id];
      return stat && stat.done < stat.total;
    });
    return next?.id || SUBJECTS[0].id;
  }, [subjectStats]);

  const handleCycleCompanion = () => {
    playChimeSound('spell');
    setBuddyPulse(true);
    setTimeout(() => setBuddyPulse(false), 600);
    onCycleMascot();
  };

  const handleHouseClick = (subject: Subject) => {
    playChimeSound('step');
    setSelectedSubject(subject);
  };

  const handleTapAdoptedPrize = (prize: PrizeItem) => {
    playPrizeNotes(prize.synthNotes, prize.waveType);
    setPlayingPrizeId(prize.id);
    speakText(prize.accomplishmentText, () => {
      setPlayingPrizeId((curr) => (curr === prize.id ? null : curr));
    });
  };

  const handleAdopt = (prize: PrizeItem) => {
    if (progress.adoptedPrizes.includes(prize.id) || progress.stars < prize.cost) return;
    playChimeSound('success');
    onAdoptPrize(prize.id, prize.cost);
    setJustAdoptedId(prize.id);
    setTimeout(() => setJustAdoptedId(null), 1600);
  };

  const filteredShopPrizes = useMemo(() => {
    if (shopFilter === 'all') return REWARD_PRIZES;
    return REWARD_PRIZES.filter((p) => p.category === shopFilter);
  }, [shopFilter]);

  const adoptedPrizesList = useMemo(
    () => REWARD_PRIZES.filter((p) => progress.adoptedPrizes.includes(p.id)),
    [progress.adoptedPrizes]
  );

  const lockedPrizesList = useMemo(
    () => REWARD_PRIZES.filter((p) => !progress.adoptedPrizes.includes(p.id)),
    [progress.adoptedPrizes]
  );

  const selectedSubjectStats = selectedSubject ? subjectStats[selectedSubject.id] : null;
  const selectedTheme = selectedSubject ? HOUSE_THEMES[selectedSubject.id] || HOUSE_THEMES.Maths : null;

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-[#E0F2FE] via-[#F4FAFF] to-[#ECFDF5] pb-12">
      {/* Soft Drifting Cloud Graphics */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
        <motion.svg
          animate={{ x: [0, 26, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 220 90"
          className="absolute top-6 left-[4%] w-44 opacity-80"
          fill="none"
        >
          <path
            d="M34 72 H178 C196 72 208 60 208 46 C208 32 195 22 180 24 C174 8 156 2 138 6 C126 -2 102 0 92 14 C74 10 56 20 52 34 C34 34 22 44 22 56 C22 66 28 72 34 72 Z"
            fill="#FFFFFF"
          />
        </motion.svg>
        <motion.svg
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 220 90"
          className="absolute top-12 right-[6%] w-52 opacity-75"
          fill="none"
        >
          <path
            d="M34 72 H178 C196 72 208 60 208 46 C208 32 195 22 180 24 C174 8 156 2 138 6 C126 -2 102 0 92 14 C74 10 56 20 52 34 C34 34 22 44 22 56 C22 66 28 72 34 72 Z"
            fill="#FFFFFF"
          />
        </motion.svg>
        <motion.svg
          animate={{ x: [0, 18, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 200 80"
          className="hidden md:block absolute top-28 left-[44%] w-36 opacity-60"
          fill="none"
        >
          <path
            d="M30 64 H166 C182 64 192 54 192 42 C192 30 180 20 166 22 C160 8 144 2 128 6 C116 -2 94 0 84 12 C68 10 52 18 48 30 C32 30 22 40 22 50 C22 58 26 64 30 64 Z"
            fill="#FFFFFF"
          />
        </motion.svg>
      </div>

      {/* DUAL-HUD FLOATING BADGES */}
      <div className="relative z-30 w-full max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* TOP-LEFT HUD: Interactive Companion Buddy + Star Coins + Year Picker */}
        <div className="flex flex-wrap items-center gap-2.5">
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            animate={buddyPulse ? { scale: [1, 1.12, 1], rotate: [0, -6, 6, 0] } : {}}
            onClick={handleCycleCompanion}
            title="Tap to switch companion buddy"
            className={`min-h-[48px] pl-2 pr-4 py-1.5 rounded-full border-2 shadow-md flex items-center gap-2 cursor-pointer transition-colors ${mascotMeta.bg}`}
          >
            <div className={`p-0.5 rounded-full bg-gradient-to-br ${mascotMeta.ring}`}>
              <div className="bg-white rounded-full p-0.5">
                <MiniCompanionSvg mascotId={progress.mascotId} />
              </div>
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Buddy · Tap
              </span>
              <span className="block text-sm font-heading font-extrabold text-slate-900 whitespace-nowrap">
                {mascotMeta.name}
              </span>
            </div>
          </motion.button>

          {/* Star Coin Counter Badge */}
          <div className="min-h-[48px] px-4 py-2 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 border-2 border-amber-500 shadow-md flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-900 fill-amber-900" />
            <span className="font-heading font-extrabold text-base text-amber-950 tabular-nums whitespace-nowrap">
              {progress.stars}
            </span>
          </div>

          {/* Compact Year Dropdown Pill */}
          <div className="relative">
            <select
              aria-label="Choose Year Group"
              value={progress.selectedYear}
              onChange={(e) => {
                playChimeSound('step');
                onSelectYear(e.target.value as YearGroup);
              }}
              className="appearance-none min-h-[48px] pl-4 pr-9 py-2 rounded-full bg-white/95 hover:bg-white border-2 border-sky-300 shadow-md font-heading font-extrabold text-sm text-sky-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {YEAR_GROUPS.map((yg) => (
                <option key={yg.year} value={yg.year}>
                  {yg.year}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-sky-700 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* TOP-RIGHT HUD: Reward Bazaar Shop + Prize Chest + Discreet Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              playChimeSound('step');
              setIsShopOpen(true);
            }}
            className="min-h-[48px] px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-b-4 border-orange-700 shadow-md font-heading font-extrabold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-transform active:translate-y-0.5"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Reward Bazaar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playChimeSound('spell');
              setIsChestOpen(true);
            }}
            className="min-h-[48px] px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-b-4 border-indigo-800 shadow-md font-heading font-extrabold text-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer transition-transform active:translate-y-0.5"
          >
            <Trophy className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Prize Chest</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs tabular-nums">
              {adoptedPrizesList.length}/{REWARD_PRIZES.length}
            </span>
          </button>

          {/* Compact utility icons: List View, Home, Parent Portal */}
          <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-xs p-1 rounded-full border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={onSwitchToDashboard}
              title="Open Detailed Dashboard"
              aria-label="Open Detailed Dashboard"
              className="w-10 h-10 rounded-full hover:bg-sky-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenHome}
              title="Back to Home Stage"
              aria-label="Back to Home Stage"
              className="w-10 h-10 rounded-full hover:bg-sky-100 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenParentPortal}
              title="Parent & Teacher Portal"
              aria-label="Parent & Teacher Portal"
              className="h-10 px-2.5 rounded-full bg-gradient-to-r from-[#EA580C] to-[#DC2626] hover:from-[#C2410C] hover:to-[#B91C1C] text-white flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <RedOrangeDoorIcon className="w-5 h-6 shrink-0" />
              <span className="hidden sm:inline text-xs font-extrabold whitespace-nowrap">Parents</span>
            </button>
          </div>
        </div>
      </div>

      {/* AESTHETIC TYPOGRAPHY HEADER */}
      <div className="relative z-20 max-w-3xl mx-auto px-4 pt-5 pb-3 text-center">
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl tracking-tight text-slate-900">
          Activity{' '}
          <span className="bg-gradient-to-r from-sky-500 via-violet-500 to-rose-500 bg-clip-text text-transparent">
            Land
          </span>
        </h1>
        <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-600">
          Tap a colourful house door to play, learn &amp; win stars!
        </p>
      </div>

      {/* FULL-WIDTH BOARD GAME MAP CANVAS */}
      <div className="relative z-20 w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-[36px] bg-gradient-to-b from-white/80 via-[#F0FDF4]/85 to-[#DCFCE7]/90 border-4 border-white shadow-[0_20px_60px_rgba(14,116,144,0.12)] px-4 sm:px-8 py-8 sm:py-10 overflow-hidden">
          {/* Decorative Meadow Hills inside Board */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-emerald-200/45 to-transparent" />
          <div className="pointer-events-none absolute -top-12 -left-12 w-56 h-56 rounded-full bg-amber-200/30 blur-2xl" />
          <div className="pointer-events-none absolute top-1/3 -right-12 w-64 h-64 rounded-full bg-sky-200/35 blur-2xl" />

          {/* Desktop SVG Winding S-Curve Road + Ladders (visible on lg+ screens behind 4x3 grid) */}
          <svg
            viewBox="0 0 1200 720"
            preserveAspectRatio="none"
            className="hidden lg:block pointer-events-none absolute inset-0 w-full h-full z-0"
            fill="none"
            aria-hidden="true"
          >
            {/* Soft Shadow Under Road */}
            <path
              d="M 140 125 L 1040 125 Q 1135 125 1135 245 Q 1135 365 1040 365 L 160 365 Q 65 365 65 485 Q 65 605 160 605 L 1060 605"
              stroke="#CBD5E1"
              strokeWidth="58"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.45"
            />
            {/* Golden Board Game Track */}
            <path
              d="M 140 120 L 1040 120 Q 1135 120 1135 240 Q 1135 360 1040 360 L 160 360 Q 65 360 65 480 Q 65 600 160 600 L 1060 600"
              stroke="#FDE68A"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Crisp Dashed Center Trail */}
            <path
              d="M 140 120 L 1040 120 Q 1135 120 1135 240 Q 1135 360 1040 360 L 160 360 Q 65 360 65 480 Q 65 600 160 600 L 1060 600"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeDasharray="16 14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Wooden Ladder 1: House 2 (Row 1 Col 2) -> House 7 (Row 2 Col 2) */}
            <g opacity="0.85">
              <line x1="435" y1="150" x2="455" y2="335" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
              <line x1="468" y1="146" x2="488" y2="331" stroke="#B45309" strokeWidth="7" strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((step) => {
                const y = 175 + step * 35;
                const x = 438 + step * 4;
                return (
                  <line
                    key={step}
                    x1={x}
                    y1={y}
                    x2={x + 33}
                    y2={y - 4}
                    stroke="#D97706"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* Wooden Ladder 2: House 6 (Row 2 Col 3) -> House 11 (Row 3 Col 3) */}
            <g opacity="0.85">
              <line x1="735" y1="390" x2="715" y2="575" stroke="#0F766E" strokeWidth="7" strokeLinecap="round" />
              <line x1="768" y1="394" x2="748" y2="579" stroke="#0F766E" strokeWidth="7" strokeLinecap="round" />
              {[0, 1, 2, 3, 4].map((step) => {
                const y = 415 + step * 35;
                const x = 732 - step * 4;
                return (
                  <line
                    key={step}
                    x1={x}
                    y1={y}
                    x2={x + 33}
                    y2={y + 4}
                    stroke="#14B8A6"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          </svg>

          {/* 12 Multi-Coloured Subject Houses Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-x-7 lg:gap-y-10">
            {SUBJECTS.map((subject, idx) => {
              const theme = HOUSE_THEMES[subject.id] || HOUSE_THEMES.Maths;
              const stats = subjectStats[subject.id] || { total: 0, done: 0, topics: [] };
              const isNext = subject.id === nextFrontierSubjectId;
              const isAllDone = stats.total > 0 && stats.done >= stats.total;
              const orderClass = LG_ORDER_CLASSES[idx] || '';

              return (
                <motion.button
                  key={subject.id}
                  type="button"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHouseClick(subject)}
                  className={`group relative text-left flex flex-col items-center cursor-pointer focus:outline-none ${orderClass}`}
                >
                  {/* Floating Next Indicator */}
                  {isNext && (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-4 z-20 px-3 py-1 rounded-full bg-amber-400 border-2 border-white shadow-md text-[11px] font-heading font-extrabold text-amber-950 flex items-center gap-1 whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Next Door!</span>
                    </motion.div>
                  )}

                  {/* Pitched House Roof */}
                  <div className="relative w-full max-w-[260px] flex flex-col items-center">
                    <div
                      className={`w-[88%] h-7 ${theme.roofBg} rounded-t-3xl border-x-2 border-t-2 border-white/80 shadow-sm flex items-center justify-between px-4`}
                    >
                      <span className="w-6 h-6 -mt-3 rounded-full bg-white border-2 border-slate-200 shadow-xs text-[11px] font-heading font-extrabold text-slate-800 flex items-center justify-center tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="text-[11px] font-extrabold text-white/95 tabular-nums whitespace-nowrap">
                        {isAllDone ? '★ Complete!' : `${stats.done}/${stats.total} ★`}
                      </span>
                    </div>

                    {/* House Main Colourful Body */}
                    <div
                      className={`w-full rounded-3xl ${theme.bodyBg} border-3 ${theme.border} shadow-[0_10px_25px_rgba(15,23,42,0.08)] group-hover:shadow-[0_14px_30px_rgba(15,23,42,0.14)] p-4 pt-3 flex items-center justify-between gap-3 transition-shadow`}
                    >
                      {/* Left: Subject Emoji & Short Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                          <span aria-hidden="true">{subject.emoji}</span>
                        </div>
                        <div className="min-w-0">
                          <h2 className={`font-heading font-extrabold text-base sm:text-lg leading-tight truncate ${theme.text}`}>
                            {theme.shortName}
                          </h2>
                          <span className="inline-block mt-1 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                            {stats.topics.length} {stats.topics.length === 1 ? 'quest' : 'quests'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Interactive Arched Door */}
                      <div
                        className={`relative w-12 h-16 rounded-t-full ${theme.doorBg} border-2 border-white/90 shadow-inner shrink-0 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 ml-4 shadow-xs" />
                        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/15" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOUSE DOOR ACTIVITY DRAWER / MODAL */}
      <AnimatePresence>
        {selectedSubject && selectedSubjectStats && selectedTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSubject(null)}
            className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl rounded-[32px] ${selectedTheme.bodyBg} border-4 ${selectedTheme.border} shadow-2xl overflow-hidden`}
            >
              {/* Colourful House Roof Header */}
              <div className={`${selectedTheme.roofBg} text-white px-6 py-4 flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-2xl bg-white/95 text-2xl flex items-center justify-center shadow-sm">
                    {selectedSubject.emoji}
                  </span>
                  <div className="text-left">
                    <h3 className="font-heading font-extrabold text-xl leading-tight">
                      {selectedTheme.shortName} House
                    </h3>
                    <p className="text-xs font-bold text-white/90">
                      {progress.selectedYear} · Pick a door quest!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubject(null)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                  aria-label="Close house menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Topic Doors List (minimal text, instant Play!) */}
              <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-3">
                {selectedSubjectStats.topics.map((topic) => {
                  const isCompleted = progress.completedTopics.includes(topic.id);
                  const cleanTitle = topic.title.replace(/^[^:—]+[:—]\s*/, '');
                  return (
                    <div
                      key={topic.id}
                      className="rounded-2xl bg-white border-2 border-white shadow-sm p-4 flex items-center justify-between gap-3"
                    >
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {topic.year}
                          </span>
                          {isCompleted && (
                            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                              ✓ Done
                            </span>
                          )}
                        </div>
                        <p className="font-heading font-extrabold text-base text-slate-900 mt-1 truncate">
                          {cleanTitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubject(null);
                          onOpenTopic(topic);
                        }}
                        className={`min-h-[44px] px-5 py-2 rounded-2xl text-white border-b-4 font-heading font-extrabold text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-transform active:translate-y-0.5 ${selectedTheme.buttonBg}`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play!</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* REWARD BAZAAR SHOP MODAL */}
      <AnimatePresence>
        {isShopOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsShopOpen(false)}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-[32px] bg-[#FFFBEB] border-4 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* Shop Header */}
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading font-extrabold text-2xl leading-tight">
                      Reward Bazaar
                    </h3>
                    <p className="text-xs font-bold text-amber-100">
                      Spend stars to adopt creatures &amp; collectibles!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-white text-amber-900 font-heading font-extrabold text-sm flex items-center gap-1.5 shadow-sm">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="tabular-nums">{progress.stars} Stars</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsShopOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                    aria-label="Close Reward Bazaar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-6 pt-4 pb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all' as const, label: 'All Rewards' },
                    { id: 'creature' as const, label: 'Creatures' },
                    { id: 'collectible' as const, label: 'Collectibles' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setShopFilter(tab.id)}
                      className={`min-h-[40px] px-4 py-1.5 rounded-full text-xs font-heading font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
                        shopFilter === tab.id
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsShopOpen(false);
                    setIsChestOpen(true);
                  }}
                  className="min-h-[40px] px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-xs font-heading font-extrabold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Prize Chest</span>
                </button>
              </div>

              {/* Shop Grid */}
              <div className="p-6 pt-3 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShopPrizes.map((prize) => {
                  const isOwned = progress.adoptedPrizes.includes(prize.id);
                  const canAfford = progress.stars >= prize.cost;
                  const wasJustAdopted = justAdoptedId === prize.id;

                  return (
                    <div
                      key={prize.id}
                      className="rounded-3xl bg-white border-2 border-amber-200 shadow-sm p-4 flex flex-col items-center text-center gap-3"
                    >
                      <div
                        className={`w-full rounded-2xl bg-gradient-to-br ${prize.panelGradient} p-4 flex flex-col items-center justify-center relative overflow-hidden`}
                      >
                        <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-[10px] font-extrabold text-slate-800 uppercase tracking-wide">
                          {prize.shortTag}
                        </span>
                        <div className="w-20 h-20 rounded-full bg-white/95 shadow-md flex items-center justify-center mt-2">
                          <PrizeArtwork prizeId={prize.id} />
                        </div>
                      </div>

                      <h4 className="font-heading font-extrabold text-base text-slate-900">
                        {prize.name}
                      </h4>

                      {isOwned ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsShopOpen(false);
                            setIsChestOpen(true);
                            handleTapAdoptedPrize(prize);
                          }}
                          className="w-full min-h-[44px] px-4 py-2 rounded-2xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-heading font-extrabold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{wasJustAdopted ? 'Adopted! Tap to Hear' : 'In Chest ✓'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={!canAfford}
                          onClick={() => handleAdopt(prize)}
                          className={`w-full min-h-[44px] px-4 py-2 rounded-2xl font-heading font-extrabold text-sm flex items-center justify-center gap-1.5 border-b-4 transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-600 cursor-pointer active:translate-y-0.5'
                              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                          <span>
                            {canAfford ? `Adopt · ${prize.cost} Stars` : `Need ${prize.cost} Stars`}
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INTEGRATED OVERLAY PRIZE CHEST DRAWER */}
      <AnimatePresence>
        {isChestOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              stopSpeaking();
              setPlayingPrizeId(null);
              setIsChestOpen(false);
            }}
            className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl rounded-[32px] bg-[#F5F3FF] border-4 border-violet-300 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            >
              {/* Prize Chest Header */}
              <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-sm">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading font-extrabold text-2xl leading-tight">
                      Your Prize Chest
                    </h3>
                    <p className="text-xs font-bold text-violet-100">
                      Tap any adopted prize to hear its musical notes &amp; story!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {playingPrizeId && (
                    <button
                      type="button"
                      onClick={() => {
                        stopSpeaking();
                        setPlayingPrizeId(null);
                      }}
                      className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                    >
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Voice</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setPlayingPrizeId(null);
                      setIsChestOpen(false);
                      setIsShopOpen(true);
                    }}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bazaar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
                      setPlayingPrizeId(null);
                      setIsChestOpen(false);
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
                    aria-label="Close Prize Chest"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Active Speaking Accomplishment Banner */}
              <AnimatePresence>
                {playingPrizeId && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-100 border-b-2 border-amber-300 px-6 py-3 flex items-center gap-3 text-left"
                  >
                    <Volume2 className="w-5 h-5 text-amber-700 shrink-0 animate-pulse" />
                    <p className="text-sm font-bold text-amber-950">
                      {REWARD_PRIZES.find((p) => p.id === playingPrizeId)?.accomplishmentText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chest Contents */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Adopted Creatures & Collectibles */}
                <div>
                  <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-violet-800 mb-3 text-left">
                    Adopted Prizes ({adoptedPrizesList.length}) · Tap to Play Notes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adoptedPrizesList.map((prize) => {
                      const isPlaying = playingPrizeId === prize.id;
                      return (
                        <motion.button
                          key={prize.id}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          animate={isPlaying ? { y: [0, -6, 0] } : {}}
                          transition={isPlaying ? { duration: 0.6, repeat: Infinity } : {}}
                          onClick={() => handleTapAdoptedPrize(prize)}
                          className={`rounded-3xl bg-white p-4 border-3 text-center flex flex-col items-center gap-2.5 shadow-md cursor-pointer transition-all ${
                            isPlaying
                              ? 'border-amber-400 ring-4 ring-amber-200'
                              : 'border-violet-200 hover:border-violet-400'
                          }`}
                        >
                          <div
                            className={`w-full rounded-2xl bg-gradient-to-br ${prize.panelGradient} p-4 flex items-center justify-center relative`}
                          >
                            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">
                              <PrizeArtwork prizeId={prize.id} />
                            </div>
                            <span className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/95 text-violet-700 flex items-center justify-center shadow-xs">
                              <Music2 className="w-4 h-4" />
                            </span>
                          </div>
                          <h5 className="font-heading font-extrabold text-base text-slate-900">
                            {prize.name}
                          </h5>
                          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-extrabold">
                            {isPlaying ? 'Playing Sound & Story...' : 'Tap for Music & Story'}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Locked Collectibles Preview */}
                {lockedPrizesList.length > 0 && (
                  <div>
                    <h4 className="font-heading font-extrabold text-sm uppercase tracking-wider text-slate-500 mb-3 text-left">
                      Waiting in the Bazaar ({lockedPrizesList.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {lockedPrizesList.map((prize) => (
                        <button
                          key={prize.id}
                          type="button"
                          onClick={() => {
                            stopSpeaking();
                            setPlayingPrizeId(null);
                            setIsChestOpen(false);
                            setIsShopOpen(true);
                          }}
                          className="rounded-2xl bg-white/75 hover:bg-white border-2 border-dashed border-slate-300 p-3 flex flex-col items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <PrizeArtwork prizeId={prize.id} locked />
                          <span className="font-heading font-bold text-xs text-slate-600 truncate max-w-full">
                            {prize.name}
                          </span>
                          <span className="text-[11px] font-extrabold text-amber-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            {prize.cost} ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
