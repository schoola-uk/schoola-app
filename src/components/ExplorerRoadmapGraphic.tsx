import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  CheckCircle2,
  Flame,
  Lock,
  Sparkles,
  Star,
  Target,
  Volume2,
} from 'lucide-react';
import { DailyChallengeItem } from '../data/learningWorlds';
import { LearnerProgress } from '../types';
import {
  getSelectedVoicePreset,
  setSelectedVoicePreset,
  speakText,
  VOICE_PRESETS,
  VoicePresetId,
} from '../utils/speech';
import { playCheerfulTing } from '../utils/soundEffects';

interface ExplorerRoadmapSectionProps {
  progress: LearnerProgress;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  weeklyPercent: number;
}

interface RoadStarMilestone {
  id: string;
  title: string;
  badgeEmoji: string;
  requirementText: string;
  description: string;
  xPct: string;
  yPct: string;
  pathD: string;
  targetCount: number;
  getCurrentCount: (p: LearnerProgress) => number;
  unitLabel: string;
}

const ROAD_STAR_MILESTONES: RoadStarMilestone[] = [
  {
    id: 'star-first-steps',
    title: 'First Steps Explorer',
    badgeEmoji: '🌱',
    requirementText: 'Complete 1 learning stage or topic',
    description: 'Every big learning journey starts with your very first Watch, Play, or Quiz adventure!',
    xPct: '18.3%',
    yPct: '46%',
    pathD: 'M 36 152 C 82 148, 118 110, 165 102',
    targetCount: 1,
    getCurrentCount: (p) =>
      Math.max(
        p.completedTopics.length,
        p.watchedTopics.length + p.playedTopics.length > 0 ? 1 : 0
      ),
    unitLabel: 'activities started',
  },
  {
    id: 'star-steady-builder',
    title: 'Steady Trail Builder',
    badgeEmoji: '🧭',
    requirementText: 'Complete 2 curriculum topics',
    description: 'Two full topics mastered — you are building real confidence across KS1 and KS2!',
    xPct: '38.3%',
    yPct: '34%',
    pathD: 'M 165 102 C 228 92, 282 82, 345 76',
    targetCount: 2,
    getCurrentCount: (p) => p.completedTopics.length,
    unitLabel: 'topics completed',
  },
  {
    id: 'star-curious-mind',
    title: 'Curious Mind',
    badgeEmoji: '🔍',
    requirementText: 'Complete 3 tasks or Play stages',
    description: 'Unlocks the Curious Mind badge for practising interactive games and puzzles.',
    xPct: '58.3%',
    yPct: '51%',
    pathD: 'M 345 76 C 415 70, 462 108, 525 112',
    targetCount: 3,
    getCurrentCount: (p) => Math.max(p.completedTopics.length, p.playedTopics.length),
    unitLabel: 'tasks & games done',
  },
  {
    id: 'star-all-round',
    title: 'All-Round Explorer',
    badgeEmoji: '🏆',
    requirementText: 'Complete 5 topics (Weekly Goal!)',
    description: 'Halfway across the meadow — earns the shining All-Round Explorer trophy badge!',
    xPct: '78.3%',
    yPct: '37%',
    pathD: 'M 525 112 C 590 116, 642 86, 705 82',
    targetCount: 5,
    getCurrentCount: (p) => p.completedTopics.length,
    unitLabel: 'topics completed',
  },
  {
    id: 'star-collector',
    title: 'Shining Star Collector',
    badgeEmoji: '⭐',
    requirementText: 'Collect 25 Stars on your trail',
    description: 'Illuminates the entire golden trail and awards the glittering Star Collector badge!',
    xPct: '93.8%',
    yPct: '44%',
    pathD: 'M 705 82 C 760 78, 804 92, 845 98',
    targetCount: 25,
    getCurrentCount: (p) => p.stars,
    unitLabel: 'stars collected',
  },
];

const BUSH_MONSTERS: Array<{
  id: string;
  name: string;
  trait: string;
  voiceId: VoicePresetId;
  color: string;
  belly: string;
  spot: string;
  bushX: string;
  minStars: number;
  greeting: string;
}> = [
  {
    id: 'fern',
    name: 'Fern',
    trait: 'Leafy Bush Explorer',
    voiceId: 'maya',
    color: '#34D399',
    belly: '#A7F3D0',
    spot: '#059669',
    bushX: '10%',
    minStars: 0,
    greeting: 'Hello! I am Fern hiding in the clover bush!',
  },
  {
    id: 'pebble',
    name: 'Pebble',
    trait: 'Berry Bush Thinker',
    voiceId: 'leo',
    color: '#38BDF8',
    belly: '#BAE6FD',
    spot: '#0284C7',
    bushX: '31%',
    minStars: 5,
    greeting: 'Peekaboo! Pebble loves watching you earn stars!',
  },
  {
    id: 'sunny',
    name: 'Sunny',
    trait: 'Blossom Bush Hopper',
    voiceId: 'toby',
    color: '#FB923C',
    belly: '#FED7AA',
    spot: '#EA580C',
    bushX: '68%',
    minStars: 15,
    greeting: 'Hurray! Sunny spotted your wonderful badge collection!',
  },
  {
    id: 'pippin',
    name: 'Pippin',
    trait: 'Starry Hedge Dreamer',
    voiceId: 'lily',
    color: '#C084FC',
    belly: '#E9D5FF',
    spot: '#7E22CE',
    bushX: '88%',
    minStars: 30,
    greeting: 'Magical! Pippin cheers for every task you complete!',
  },
];

export const ExplorerRoadmapSection: React.FC<ExplorerRoadmapSectionProps> = ({
  progress,
  unlockedBadgesCount,
  totalBadgesCount,
  weeklyPercent,
}) => {
  const [peekedMonsterId, setPeekedMonsterId] = useState<string>('fern');
  const [wigglingId, setWigglingId] = useState<string | null>(null);
  const [selectedStarId, setSelectedStarId] = useState<string>(ROAD_STAR_MILESTONES[0].id);
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);

  const unlockedMonsters = BUSH_MONSTERS.filter(
    (m) => progress.stars >= m.minStars || progress.completedTopics.length >= 1
  ).length;

  const activeMonster =
    BUSH_MONSTERS.find((m) => m.id === peekedMonsterId) || BUSH_MONSTERS[0];

  const litMilestonesCount = ROAD_STAR_MILESTONES.filter(
    (m) => m.getCurrentCount(progress) >= m.targetCount
  ).length;

  const activeStar =
    ROAD_STAR_MILESTONES.find((m) => m.id === selectedStarId) || ROAD_STAR_MILESTONES[0];
  const activeStarCurrent = activeStar.getCurrentCount(progress);
  const activeStarUnlocked = activeStarCurrent >= activeStar.targetCount;
  const activeStarPct = Math.min(100, Math.round((activeStarCurrent / activeStar.targetCount) * 100));

  const handleBushTap = (monster: (typeof BUSH_MONSTERS)[number]) => {
    setPeekedMonsterId(monster.id);
    setWigglingId(monster.id);
    window.setTimeout(() => setWigglingId(null), 550);
    speakText(monster.greeting, undefined, monster.voiceId);
  };

  const handleStarClick = (milestone: RoadStarMilestone) => {
    setSelectedStarId(milestone.id);
    const unlocked = milestone.getCurrentCount(progress) >= milestone.targetCount;
    if (unlocked) {
      playCheerfulTing('star');
    }
    speakText(
      `${milestone.title}. ${milestone.requirementText}. ${
        unlocked ? 'Unlocked!' : 'Keep going to illuminate this star!'
      }`
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* GRAPHIC ADVENTURE ROAD MAP WITH ILLUMINATED SEGMENTS, STAR NODES & BUSH MONSTERS */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-sky-300 bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#DCFCE7] p-4 sm:p-8 shadow-inner space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-sky-900">
              Your Learning Trail · Tap Stars for Achievements or Bushes to Peek!
            </p>
            <p className="text-xs sm:text-sm font-semibold text-sky-950/85 mt-0.5">
              {activeMonster.name} ({activeMonster.trait}): &ldquo;{activeMonster.greeting}&rdquo;
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-xs font-extrabold text-amber-900 tabular-nums">
              {litMilestonesCount} / {ROAD_STAR_MILESTONES.length} Trail Stars Lit
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-sky-200 text-xs font-extrabold text-sky-900 tabular-nums">
              {unlockedMonsters} / {BUSH_MONSTERS.length} Bush Monsters Found
            </span>
          </div>
        </div>

        {/* SVG Winding Road Line with Animated Illuminated Path Segments + Hoverable Star Nodes */}
        <div className="relative h-52 sm:h-60 w-full rounded-2xl overflow-hidden border border-sky-200/90 bg-gradient-to-b from-[#7DD3FC]/45 via-[#E0F2FE] to-[#86EFAC]/75">
          <svg
            viewBox="0 0 900 220"
            preserveAspectRatio="none"
            className="w-full h-full block"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Fluffy drifting clouds */}
            <path d="M90 36 H150 A12 12 0 0 0 144 14 A18 18 0 0 0 108 12 A12 12 0 0 0 90 36 Z" fill="#FFFFFF" opacity="0.88" />
            <path d="M410 30 H478 A13 13 0 0 0 471 8 A19 19 0 0 0 432 6 A13 13 0 0 0 410 30 Z" fill="#FFFFFF" opacity="0.82" />
            <path d="M720 38 H786 A12 12 0 0 0 780 16 A18 18 0 0 0 742 14 A12 12 0 0 0 720 38 Z" fill="#FFFFFF" opacity="0.85" />

            {/* Rolling green hills */}
            <path d="M0 155 Q190 112 380 148 Q610 185 900 128 L900 220 L0 220 Z" fill="#4ADE80" opacity="0.65" />
            <path d="M0 175 Q240 138 480 168 Q710 194 900 158 L900 220 L0 220 Z" fill="#22C55E" opacity="0.7" />

            {/* Continuous Cream Road Base */}
            <path
              d="M 36 152 C 82 148, 118 110, 165 102 C 228 92, 282 82, 345 76 C 415 70, 462 108, 525 112 C 590 116, 642 86, 705 82 C 760 78, 804 92, 845 98"
              stroke="#FEF3C7"
              strokeWidth="26"
              strokeLinecap="round"
              fill="none"
            />

            {/* Unlit Dotted Segments + Animated Illuminating Golden Path Segments */}
            {ROAD_STAR_MILESTONES.map((segment, idx) => {
              const isLit = segment.getCurrentCount(progress) >= segment.targetCount;
              return (
                <g key={segment.id}>
                  {/* Subtle Unlit Dashed Track */}
                  <path
                    d={segment.pathD}
                    stroke="#CBD5E1"
                    strokeWidth="4"
                    strokeDasharray="10 10"
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Soft Golden Glow Halo when Illuminated */}
                  <motion.path
                    d={segment.pathD}
                    stroke="#FDE047"
                    strokeWidth="15"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isLit ? 1 : 0,
                      opacity: isLit ? 0.52 : 0,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: idx * 0.14,
                      ease: 'easeOut',
                    }}
                  />

                  {/* Crisp Illuminated Amber Path Segment */}
                  <motion.path
                    d={segment.pathD}
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                      pathLength: isLit ? 1 : 0,
                      opacity: isLit ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.75,
                      delay: idx * 0.14,
                      ease: 'easeOut',
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* HOVERABLE & CLICKABLE STAR NODES ALONG THE ROAD */}
          {ROAD_STAR_MILESTONES.map((milestone, idx) => {
            const current = milestone.getCurrentCount(progress);
            const isUnlocked = current >= milestone.targetCount;
            const isSelected = selectedStarId === milestone.id;
            const isHovered = hoveredStarId === milestone.id;
            const tooltipAlign =
              idx === 0
                ? 'left-0'
                : idx === ROAD_STAR_MILESTONES.length - 1
                ? 'right-0'
                : 'left-1/2 -translate-x-1/2';

            return (
              <div
                key={milestone.id}
                style={{ left: milestone.xPct, top: milestone.yPct }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              >
                {/* Hover Tooltip Preview */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={{ duration: 0.15 }}
                      className={`pointer-events-none absolute bottom-full ${tooltipAlign} mb-2 px-2.5 py-1 rounded-xl bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap shadow-lg border border-amber-300/60`}
                    >
                      {milestone.badgeEmoji} {milestone.title} · {isUnlocked ? 'Unlocked!' : 'Click to view'}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={() => handleStarClick(milestone)}
                  onMouseEnter={() => setHoveredStarId(milestone.id)}
                  onMouseLeave={() => setHoveredStarId((curr) => (curr === milestone.id ? null : curr))}
                  onFocus={() => setHoveredStarId(milestone.id)}
                  onBlur={() => setHoveredStarId((curr) => (curr === milestone.id ? null : curr))}
                  whileHover={{ scale: 1.22, rotate: 8 }}
                  whileTap={{ scale: 0.92 }}
                  animate={
                    isUnlocked
                      ? { scale: [1, 1.08, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isUnlocked
                      ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                      : { duration: 0.2 }
                  }
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 cursor-pointer transition-shadow focus:outline-none ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border-white text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.85)]'
                      : 'bg-white/95 border-slate-300 text-slate-400 hover:border-sky-400 hover:text-sky-600 shadow-sm'
                  } ${isSelected ? 'ring-4 ring-sky-500/70' : ''}`}
                  aria-label={`${milestone.title} achievement milestone: ${milestone.requirementText}`}
                  aria-pressed={isSelected}
                >
                  {isUnlocked && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1.5 rounded-full bg-amber-300/45 blur-xs animate-glitter-twinkle"
                    />
                  )}
                  <Star
                    className={`relative w-5 h-5 sm:w-6 sm:h-6 ${
                      isUnlocked ? 'fill-white text-amber-700' : 'fill-slate-100 text-slate-400'
                    }`}
                  />
                </motion.button>
              </div>
            );
          })}

          {/* Interactive Monsters Hiding in Bushes Positioned Along the Bottom of the Meadow */}
          {BUSH_MONSTERS.map((monster, idx) => {
            const isSelected = peekedMonsterId === monster.id;
            const isUnlocked = progress.stars >= monster.minStars || progress.completedTopics.length >= idx;
            const isWiggling = wigglingId === monster.id;
            return (
              <motion.button
                key={monster.id}
                type="button"
                onClick={() => handleBushTap(monster)}
                animate={
                  isWiggling
                    ? { rotate: [-6, 7, -5, 4, 0], scale: [1, 1.12, 1] }
                    : isSelected
                    ? { y: [0, -4, 0] }
                    : { y: 0 }
                }
                transition={{
                  duration: isWiggling ? 0.45 : 2.4,
                  repeat: isSelected && !isWiggling ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                style={{ left: monster.bushX }}
                className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center cursor-pointer group focus:outline-none z-20"
                aria-label={`Peek at ${monster.name} hiding in the bush`}
              >
                {/* Peeking Cute Monster */}
                <motion.div
                  animate={{ y: isSelected ? -8 : 2 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className="relative -mb-4 z-10"
                >
                  <svg viewBox="0 0 64 56" className="w-11 h-10 sm:w-13 sm:h-11 drop-shadow-sm" fill="none">
                    {/* Little Ears / Horns */}
                    <circle cx="17" cy="14" r="7" fill={monster.color} />
                    <circle cx="47" cy="14" r="7" fill={monster.color} />
                    {/* Fuzzy Body */}
                    <ellipse cx="32" cy="34" rx="22" ry="20" fill={monster.color} />
                    <ellipse cx="32" cy="40" rx="13" ry="11" fill={monster.belly} />
                    {/* Cute Big Eyes */}
                    <circle cx="24" cy="27" r="6" fill="#FFFFFF" />
                    <circle cx="40" cy="27" r="6" fill="#FFFFFF" />
                    <circle cx="25" cy="27" r="3" fill="#0F172A" />
                    <circle cx="41" cy="27" r="3" fill="#0F172A" />
                    <circle cx="26" cy="26" r="1.2" fill="#FFFFFF" />
                    <circle cx="42" cy="26" r="1.2" fill="#FFFFFF" />
                    {/* Smile & Cheeks */}
                    <circle cx="17" cy="34" r="3" fill={monster.spot} opacity="0.4" />
                    <circle cx="47" cy="34" r="3" fill={monster.spot} opacity="0.4" />
                    <path d="M26 36 Q32 42 38 36" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </motion.div>

                {/* Leafy Bush Foreground */}
                <svg viewBox="0 0 88 46" className="w-18 h-9 sm:w-22 sm:h-11 relative z-20 drop-shadow-xs" fill="none">
                  <circle cx="24" cy="28" r="16" fill="#15803D" />
                  <circle cx="64" cy="28" r="16" fill="#15803D" />
                  <circle cx="44" cy="20" r="20" fill="#16A34A" />
                  <circle cx="32" cy="30" r="14" fill="#22C55E" />
                  <circle cx="56" cy="30" r="14" fill="#22C55E" />
                  {/* Little berries / flowers on the bush */}
                  <circle cx="28" cy="24" r="3" fill={isUnlocked ? '#FDE047' : '#CBD5E1'} />
                  <circle cx="54" cy="18" r="3" fill={isUnlocked ? '#FB7185' : '#CBD5E1'} />
                  <circle cx="62" cy="28" r="2.5" fill={isUnlocked ? '#FDE047' : '#CBD5E1'} />
                </svg>

                <span
                  className={`mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs transition-colors ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-700'
                      : 'bg-white/95 text-slate-800 border-emerald-300 group-hover:bg-emerald-50'
                  }`}
                >
                  {monster.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* CLICKED STAR NODE ACHIEVEMENT DETAILS PANEL */}
        <motion.div
          key={activeStar.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
          className={`rounded-2xl border-2 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 shadow-xs ${
            activeStarUnlocked ? 'border-amber-400' : 'border-sky-200'
          }`}
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-2xl shrink-0 ${
                activeStarUnlocked
                  ? 'bg-amber-100 border-amber-300'
                  : 'bg-slate-100 border-slate-200 grayscale'
              }`}
              aria-hidden="true"
            >
              {activeStar.badgeEmoji}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  {activeStar.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                    activeStarUnlocked
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-sky-50 text-sky-800 border border-sky-200'
                  }`}
                >
                  {activeStarUnlocked ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Unlocked &amp; Lit!
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-sky-700" />
                      {activeStar.requirementText}
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeStar.description}
              </p>
            </div>
          </div>

          <div className="sm:w-52 shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 tabular-nums">
              <span>{activeStar.unitLabel}</span>
              <span>
                {Math.min(activeStarCurrent, activeStar.targetCount)} / {activeStar.targetCount}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeStarPct}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  activeStarUnlocked
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                    : 'bg-sky-500'
                }`}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4-COLUMN MILESTONE METRICS ALONG THE ROAD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Explorer milestones summary">
        <div className="bg-white/95 border border-sky-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Stars Earned</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tabular-nums">
            {progress.stars}
          </p>
          <p className="text-xs text-slate-600">Collected on your trail</p>
        </div>

        <div className="bg-white/95 border border-sky-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Bush Monsters</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tabular-nums">
            {unlockedMonsters} / {BUSH_MONSTERS.length}
          </p>
          <p className="text-xs text-slate-600">Tap bushes to say hello</p>
        </div>

        <div className="bg-white/95 border border-sky-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tabular-nums">
            {progress.completedTopics.length}
          </p>
          <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden mt-1.5">
            <div className="h-full bg-emerald-500" style={{ width: `${weeklyPercent}%` }} />
          </div>
        </div>

        <div className="bg-white/95 border border-sky-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Badges Collected</span>
            <Award className="w-4 h-4 text-sky-600" />
          </div>
          <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tabular-nums">
            {unlockedBadgesCount} / {totalBadgesCount}
          </p>
          <p className="text-xs text-slate-600">Unlock shining trophies</p>
        </div>
      </div>
    </div>
  );
};

interface CosmicDailyChallengeCardProps {
  challenges: DailyChallengeItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  dailyDoneToday: boolean;
  onLaunchChallenge: () => void;
}

const PLANET_THEMES = [
  {
    name: 'Sprout',
    subject: 'Plants',
    orbGrad: 'from-[#4ADE80] via-[#10B981] to-[#047857]',
    ringColor: 'border-emerald-300',
    glow: 'shadow-[0_0_28px_rgba(52,211,153,0.75)]',
    floatY: [-6, 6, -6],
    duration: 4.2,
  },
  {
    name: 'Mathia',
    subject: 'Numbers',
    orbGrad: 'from-[#60A5FA] via-[#0284C7] to-[#1E40AF]',
    ringColor: 'border-sky-300',
    glow: 'shadow-[0_0_28px_rgba(56,189,248,0.75)]',
    floatY: [7, -7, 7],
    duration: 4.8,
  },
  {
    name: 'Storyia',
    subject: 'Stories',
    orbGrad: 'from-[#F472B6] via-[#E11D48] to-[#9F1239]',
    ringColor: 'border-rose-300',
    glow: 'shadow-[0_0_28px_rgba(251,113,133,0.75)]',
    floatY: [-8, 5, -8],
    duration: 3.9,
  },
  {
    name: 'Cosmo',
    subject: 'Saturn',
    orbGrad: 'from-[#FDE047] via-[#F59E0B] to-[#B45309]',
    ringColor: 'border-amber-300',
    glow: 'shadow-[0_0_28px_rgba(251,191,36,0.8)]',
    floatY: [5, -9, 5],
    duration: 5.1,
    hasRing: true,
  },
  {
    name: 'Atlas',
    subject: 'Earth',
    orbGrad: 'from-[#2DD4BF] via-[#0D9488] to-[#115E59]',
    ringColor: 'border-teal-300',
    glow: 'shadow-[0_0_28px_rgba(45,212,191,0.75)]',
    floatY: [-5, 7, -5],
    duration: 4.5,
  },
];

export const CosmicDailyChallengeCard: React.FC<CosmicDailyChallengeCardProps> = ({
  challenges,
  selectedIndex,
  onSelectIndex,
  dailyDoneToday,
  onLaunchChallenge,
}) => {
  const [voicePreset, setVoicePreset] = useState<VoicePresetId>(() => getSelectedVoicePreset());
  const activeChallenge = challenges[selectedIndex] || challenges[0];

  const handleVoicePick = (id: VoicePresetId) => {
    setVoicePreset(id);
    setSelectedVoicePreset(id);
    const chosen = VOICE_PRESETS.find((v) => v.id === id);
    speakText(
      chosen?.sampleLine || `Hello explorer! Ready for ${activeChallenge.title}?`,
      undefined,
      id
    );
  };

  return (
    <section
      aria-label="Today's Daily Challenge Cosmic Planet Picker"
      className="relative rounded-3xl overflow-hidden border-2 border-amber-300/80 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0C4A6E] text-white p-8 sm:p-10 lg:p-12 shadow-xl space-y-10"
    >
      {/* Glossy Diagonal Shine Sweep Across Whole Box */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine-sweep"
      />

      {/* Twinkling Starfield Dots */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute top-6 left-[12%] w-2 h-2 rounded-full bg-amber-200 animate-glitter-twinkle" />
        <span className="absolute top-14 right-[18%] w-2.5 h-2.5 rounded-full bg-sky-200 animate-glitter-twinkle" />
        <span className="absolute bottom-20 left-[28%] w-1.5 h-1.5 rounded-full bg-pink-200 animate-glitter-twinkle" />
        <span className="absolute top-1/2 right-[8%] w-2 h-2 rounded-full bg-amber-300 animate-glitter-twinkle" />
        <span className="absolute bottom-10 right-[34%] w-2 h-2 rounded-full bg-emerald-200 animate-glitter-twinkle" />
      </div>

      {/* Header Row + Voice Chooser */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold text-amber-300">
            <span className="inline-flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Today&apos;s Daily Challenge · Click Any Orbiting Planet!
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums text-emerald-300">+5 Stars Reward</span>
          </div>
          <h2 className="font-playful font-extrabold text-2xl sm:text-3xl text-white">
            {activeChallenge.title}
          </h2>
          <p className="text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
            {activeChallenge.ageHint} — Click any moving planet below to pick your mission, then choose your favourite UK English RP voice!
          </p>
        </div>

        {/* Cute English RP & Soft Teacher Voice Chooser */}
        <div className="bg-slate-950/60 border border-white/15 rounded-2xl p-3.5 space-y-2 shrink-0">
          <p className="text-[11px] font-bold text-amber-200 px-1 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            Choose UK English Voice:
          </p>
          <div className="flex flex-wrap gap-2">
            {VOICE_PRESETS.map((v) => {
              const active = voicePreset === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleVoicePick(v.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer transition-all ${
                    active
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EXPANDED MOVING PLANETS UNIVERSE STAGE */}
      <div className="relative z-10 rounded-3xl border border-white/15 bg-slate-950/45 backdrop-blur-xs px-6 py-12 sm:px-10 sm:py-12">
        {/* Subtle Orbital Dotted Arc */}
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute inset-x-10 top-1/2 -translate-y-1/2 h-24 rounded-[100%] border border-dashed border-sky-300/25"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10 items-center justify-items-center relative z-10">
          {challenges.map((ch, idx) => {
            const theme = PLANET_THEMES[idx % PLANET_THEMES.length];
            const isSelected = selectedIndex === idx;
            return (
              <motion.button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  speakText(`${theme.name} Planet: ${ch.title}`);
                }}
                animate={{ y: theme.floatY }}
                transition={{
                  duration: theme.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex flex-col items-center gap-3.5 p-4 rounded-2xl cursor-pointer transition-all w-full ${
                  isSelected
                    ? 'bg-white/12 ring-2 ring-amber-300 shadow-lg'
                    : 'hover:bg-white/8'
                }`}
                aria-pressed={isSelected}
              >
                <div className="relative flex items-center justify-center">
                  {/* Selection Halo */}
                  {isSelected && (
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute -inset-3 rounded-full border-2 border-dashed border-amber-300/90"
                    />
                  )}

                  {/* Rotating / Shimmering Planet Sphere */}
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${theme.orbGrad} ${theme.glow} border-2 ${theme.ringColor} flex items-center justify-center overflow-hidden`}
                  >
                    {/* Surface Atmospheric Bands */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-3 h-3 bg-white/20 rounded-full -rotate-12"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-4 h-2.5 bg-black/15 rounded-full -rotate-12"
                    />
                    <span
                      aria-hidden="true"
                      className="w-4 h-4 rounded-full bg-white/40 absolute top-2.5 left-3 blur-[1px]"
                    />
                  </div>

                  {/* Saturn Ring on Cosmo */}
                  {theme.hasRing && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute w-28 sm:w-32 h-7 rounded-full border-[5px] border-amber-200/85 -rotate-12"
                    />
                  )}
                </div>

                <div className="text-center space-y-0.5">
                  <p className="font-playful font-extrabold text-sm text-white">
                    {theme.name}
                  </p>
                  <p className="text-[11px] font-semibold text-sky-200">
                    {theme.subject}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Launch Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              speakText(
                `${activeChallenge.title}. ${activeChallenge.question}`
              )
            }
            className="min-h-[46px] px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            Listen to Question
          </button>
          <span className="text-xs text-sky-100/85 hidden md:inline">
            Selected: <strong>{activeChallenge.title}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onLaunchChallenge}
          className="min-h-[52px] px-7 py-3 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 hover:brightness-105 border-2 border-amber-600 border-b-4 text-slate-950 font-heading font-extrabold text-sm sm:text-base rounded-2xl transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          {dailyDoneToday ? 'Play Bonus Planet Challenge!' : 'Play Selected Planet Challenge!'}
        </button>
      </div>
    </section>
  );
};
