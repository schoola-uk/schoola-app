import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Dices, Flame, Play, Sparkles, Star } from 'lucide-react';
import {
  BlueStageCharactersIllustration,
  WorldBannerIllustration,
} from './WorldIllustrations';
import { LEARNING_WORLDS, matchesYearFilter } from '../data/learningWorlds';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { Topic, YearGroup } from '../types';
import { PlayfulMonstersBar } from './PlayfulMonsters';
import { BitesizeSearchSection } from './BitesizeSearchSection';
import {
  AbacusMath,
  AncientSpellbook,
  GlobeTrivia,
  PatternPath,
  VintageClockAndBell,
} from './CorridorWidgets';

interface WelcomeGatewayProps {
  selectedYear: YearGroup;
  onSelectYear: (year: YearGroup) => void;
  onEnterChild: () => void;
  onOpenWorld: (subjectId: string) => void;
  onOpenTopic: (topic: Topic) => void;
  onEarnStar: () => void;
  stars: number;
  streakDays: number;
}

interface AdventureCardItem {
  id: string;
  tag: string;
  title: string;
  emoji: string;
  gradientClass: string;
  topicId: string;
}

const UPCOMING_ADVENTURES: AdventureCardItem[] = [
  {
    id: 'env-day',
    tag: 'Science · Earth',
    title: 'Climate & Biomes',
    emoji: '🌍',
    gradientClass: 'from-emerald-500 to-teal-600 border-teal-800',
    topicId: 'g-biomes',
  },
  {
    id: 'space-day',
    tag: 'Science · Space',
    title: 'Earth & Planets',
    emoji: '🪐',
    gradientClass: 'from-amber-400 to-orange-500 border-orange-700',
    topicId: 's-y5-space',
  },
  {
    id: 'empathy-week',
    tag: 'PSHE · Kindness',
    title: 'Feelings & Friends',
    emoji: '🤝',
    gradientClass: 'from-rose-500 to-pink-600 border-pink-800',
    topicId: 'pshe-feelings',
  },
  {
    id: 'sports-maths',
    tag: 'Maths · Puzzles',
    title: 'Times Tables Dash',
    emoji: '🏆',
    gradientClass: 'from-blue-500 to-indigo-600 border-indigo-800',
    topicId: 'm-y2-multiplication',
  },
  {
    id: 'history-trail',
    tag: 'History · Time',
    title: 'Great Fire 1666',
    emoji: '🏛️',
    gradientClass: 'from-violet-500 to-purple-600 border-purple-800',
    topicId: 'h-london-1666',
  },
];

export const WelcomeGateway: React.FC<WelcomeGatewayProps> = ({
  selectedYear,
  onSelectYear,
  onEnterChild,
  onOpenWorld,
  onOpenTopic,
  onEarnStar,
  stars,
  streakDays,
}) => {
  const featuredWorlds = LEARNING_WORLDS.filter((w) => w.featured);
  const years: YearGroup[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

  const [monsterMessage, setMonsterMessage] = useState(
    'Tap any little monster or play the interactive panels below to win Stars!'
  );
  const [panelPack, setPanelPack] = useState<'pack1' | 'pack2'>('pack1');

  const todayDisplay = useMemo(() => {
    const now = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      weekday: weekdays[now.getDay()],
      day: now.getDate(),
      month: months[now.getMonth()],
    };
  }, []);

  const handleLaunchAdventureTopic = (topicId: string) => {
    const found = TOPICS.find((t) => t.id === topicId) || TOPICS[0];
    if (found) {
      onOpenTopic(found);
    }
  };

  const handleSurpriseAdventure = () => {
    const matching = TOPICS.filter((t) => matchesYearFilter(t, selectedYear));
    const pool = matching.length > 0 ? matching : TOPICS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) onOpenTopic(pick);
  };

  return (
    <div className="w-full">
      {/* 1. LARGE COLOURFUL BLUE MAIN STAGE — 100% FULL WIDTH */}
      <section
        aria-label="Schoola Child Adventure Stage"
        className="relative w-full overflow-hidden bg-gradient-to-br from-[#2575FC] via-[#1D5BF2] to-[#0284C7] text-white py-8 sm:py-11 px-4 sm:px-8 lg:px-12 border-b-4 border-sky-300/40"
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-sky-300/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-indigo-900/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Punchy headline + bouncy Year selector + Playful CTAs */}
          <div className="lg:col-span-5 text-left space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-100">
              <svg viewBox="0 0 24 16" className="w-5 h-3.5 rounded-[2px] shrink-0" aria-hidden="true">
                <rect width="24" height="16" fill="#012169" />
                <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
                <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.4" />
                <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="4.5" />
                <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.5" />
              </svg>
              <span>UK Primary</span>
              <span aria-hidden="true">·</span>
              <span>Ages 5–11</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                {stars}
              </span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Flame className="w-3.5 h-3.5 text-orange-300" />
                {streakDays}d
              </span>
            </div>

            <h1 className="font-playful font-bold text-4xl sm:text-5xl xl:text-6xl leading-[1.06] tracking-tight [text-wrap:balance]">
              <span className="text-white">Discover.</span>{' '}
              <span className="text-amber-300">Play.</span>{' '}
              <span className="text-emerald-300">Learn.</span>
            </h1>

            {/* Playful Quick Year-Group Selector */}
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Choose your year group">
              {years.map((yr) => {
                const active = selectedYear === yr;
                return (
                  <motion.button
                    key={yr}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    type="button"
                    onClick={() => onSelectYear(yr)}
                    className={`min-h-[42px] px-3.5 py-1.5 rounded-2xl text-xs font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer border-2 border-b-4 transition-colors ${
                      active
                        ? 'bg-amber-400 text-slate-950 border-amber-600 shadow-sm'
                        : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                    }`}
                  >
                    {yr}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onEnterChild}
                className="min-h-[54px] px-7 py-3.5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] hover:from-[#EA580C] hover:to-[#D97706] border-2 border-orange-700 border-b-4 text-white font-playful font-bold text-lg rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-5 h-5" />
                Let&apos;s Learn!
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2, rotate: -2 }}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleSurpriseAdventure}
                className="min-h-[54px] px-5 py-3.5 bg-emerald-400 hover:bg-emerald-300 border-2 border-emerald-700 border-b-4 text-slate-950 font-playful font-bold text-base rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Dices className="w-5 h-5" />
                Surprise Me!
              </motion.button>
            </div>
          </div>

          {/* Right: Large Colourful Illustrated Character Trio */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="lg:col-span-7 flex justify-center"
          >
            <BlueStageCharactersIllustration className="w-full max-w-2xl h-auto drop-shadow-xl" />
          </motion.div>
        </div>

        {/* Bottom Row: Tilted Colourful Illustrated Subject World Cards */}
        <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-7 pt-2">
          {featuredWorlds.map((world, idx) => {
            const tiltClass =
              idx === 0
                ? 'lg:-rotate-2'
                : idx === 1
                ? 'lg:rotate-1'
                : idx === 2
                ? 'lg:-rotate-1'
                : 'lg:rotate-2';
            return (
              <motion.button
                key={world.id}
                type="button"
                whileHover={{ y: -7, rotate: 0, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenWorld(world.subjectId)}
                className={`text-left bg-white text-slate-900 rounded-2xl p-3.5 shadow-lg border-2 border-sky-200 border-b-4 transition-shadow cursor-pointer flex flex-col gap-2.5 ${tiltClass}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-playful font-bold text-base text-slate-900 truncate">
                    {world.worldTitle}
                  </span>
                </div>
                <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-100">
                  <WorldBannerIllustration
                    worldKey={world.illustrationKey}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 2. LITTLE MONSTERS & INTERACTIVE PLAYGROUND — 100% FULL WIDTH LIGHT BLUE SKY */}
      <section
        aria-labelledby="monster-arcade-heading"
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#F0F9FF] border-b-2 border-sky-200 py-8 sm:py-10 px-4 sm:px-8 lg:px-12 space-y-6"
      >
        {/* Soft Sky Sunbeam & Floating Clouds */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full bg-amber-200/45 blur-xl" />
        <motion.svg
          animate={{ x: [0, 22, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 220 90"
          className="pointer-events-none absolute top-4 left-[4%] w-40 opacity-75"
          fill="none"
        >
          <path
            d="M34 72 H178 C196 72 208 60 208 46 C208 32 195 22 180 24 C174 8 156 2 138 6 C126 -2 102 0 92 14 C74 10 56 20 52 34 C34 34 22 44 22 56 C22 66 28 72 34 72 Z"
            fill="#FFFFFF"
          />
        </motion.svg>
        <motion.svg
          animate={{ x: [0, -24, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          viewBox="0 0 220 90"
          className="pointer-events-none hidden sm:block absolute top-8 right-[8%] w-44 opacity-70"
          fill="none"
        >
          <path
            d="M34 72 H178 C196 72 208 60 208 46 C208 32 195 22 180 24 C174 8 156 2 138 6 C126 -2 102 0 92 14 C74 10 56 20 52 34 C34 34 22 44 22 56 C22 66 28 72 34 72 Z"
            fill="#FFFFFF"
          />
        </motion.svg>

        <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 id="monster-arcade-heading" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900">
            <span className="text-sky-700">Monster</span>{' '}
            <span className="text-rose-500">Playground</span>{' '}
            <span className="text-slate-700 text-lg sm:text-xl">·</span>{' '}
            <span className="text-emerald-600">Play</span> &amp;{' '}
            <span className="text-amber-500">Win Stars!</span>
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setPanelPack('pack1')}
              className={`min-h-[42px] px-4 py-1.5 rounded-2xl border-2 border-b-4 text-xs sm:text-sm font-playful font-bold cursor-pointer whitespace-nowrap transition-colors ${
                panelPack === 'pack1'
                  ? 'bg-sky-600 border-sky-800 text-white shadow-sm'
                  : 'bg-white/95 border-sky-200 text-sky-900 hover:bg-white'
              }`}
            >
              🧮 Abacus · 🌍 Globe · 📖 Spellbook
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setPanelPack('pack2')}
              className={`min-h-[42px] px-4 py-1.5 rounded-2xl border-2 border-b-4 text-xs sm:text-sm font-playful font-bold cursor-pointer whitespace-nowrap transition-colors ${
                panelPack === 'pack2'
                  ? 'bg-emerald-500 border-emerald-700 text-white shadow-sm'
                  : 'bg-white/95 border-sky-200 text-sky-900 hover:bg-white'
              }`}
            >
              ✨ Glowing Path · 🔔 Bell
            </motion.button>
          </div>
        </div>

        {/* Tappable Frameless Speaking Little Learning Monsters */}
        <div className="relative z-10 w-full">
          <PlayfulMonstersBar
            activeMessage={monsterMessage}
            onMonsterTap={(_subj, _name, quip) => {
              setMonsterMessage(quip);
              if (_subj === 'Geography' || _subj === 'History') {
                setPanelPack('pack2');
              } else {
                setPanelPack('pack1');
              }
            }}
          />
        </div>

        {/* Interactive Panels Grid */}
        <div className="relative z-10 w-full">
          {panelPack === 'pack1' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
              <AbacusMath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <GlobeTrivia onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <AncientSpellbook onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
              <PatternPath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <VintageClockAndBell onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          )}
        </div>
      </section>

      {/* BBC BITESIZE-INSPIRED TOPIC SEARCH & EVERYDAY MATERIALS MINI-LAB */}
      <BitesizeSearchSection onOpenTopic={onOpenTopic} onEarnStar={onEarnStar} />

      {/* 3. JUMP STRAIGHT TO A SUBJECT — 100% FULL WIDTH */}
      <section aria-labelledby="subject-strip-heading" className="w-full bg-white py-8 px-4 sm:px-8 lg:px-12 border-b border-slate-200 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="subject-strip-heading" className="font-playful font-bold text-xl sm:text-2xl text-slate-900">
            <span className="text-violet-600">Pick</span> a{' '}
            <span className="text-sky-600">world!</span>
          </h2>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onEnterChild}
            className="min-h-[38px] px-4 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 border-b-2 border-sky-300 text-xs sm:text-sm font-playful font-bold text-sky-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            All 12 →
          </motion.button>
        </div>

        <div className="flex items-stretch justify-between gap-3 overflow-x-auto pb-2 pt-1">
          {SUBJECTS.map((subj) => (
            <motion.button
              key={subj.id}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={() => onOpenWorld(subj.id)}
              className="min-w-[84px] flex flex-col items-center gap-1.5 text-center cursor-pointer shrink-0 rounded-2xl p-1"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 border-b-4"
                style={{
                  backgroundColor: subj.bg,
                  borderColor: subj.borderColor,
                }}
              >
                <span aria-hidden="true">{subj.emoji}</span>
              </div>
              <span className="text-xs font-playful font-bold text-slate-800 whitespace-nowrap">
                {subj.id}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 4. TODAY & FEATURED ADVENTURES — 100% FULL WIDTH */}
      <section aria-labelledby="adventures-strip-heading" className="w-full bg-[#F8FAFC] py-8 px-4 sm:px-8 lg:px-12 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 id="adventures-strip-heading" className="font-playful font-bold text-xl sm:text-2xl text-slate-900">
            <span className="text-rose-500">Today&apos;s</span>{' '}
            <span className="text-amber-600">adventures</span>
          </h2>
          <span className="text-xs sm:text-sm font-playful font-bold text-sky-700 whitespace-nowrap">
            Tap to play!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-2 pt-1">
          {/* Dynamic Today Card → Daily Challenge */}
          <motion.button
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onEnterChild}
            className="rounded-2xl p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-indigo-700 border-b-4 text-white text-left flex flex-col justify-between gap-3 shadow-sm cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-sky-300 block">
                {todayDisplay.weekday}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-playful font-bold text-3xl leading-none tabular-nums">
                  {todayDisplay.day}
                </span>
                <span className="text-sm font-bold text-slate-200">{todayDisplay.month}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-playful font-bold text-amber-300">
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              Daily Quest
            </span>
          </motion.button>

          {/* Clickable Curriculum Adventure Cards */}
          {UPCOMING_ADVENTURES.map((evt) => (
            <motion.button
              key={evt.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => handleLaunchAdventureTopic(evt.topicId)}
              className={`rounded-2xl p-4 bg-gradient-to-br ${evt.gradientClass} border-2 border-b-4 text-white text-left flex flex-col justify-between gap-3 shadow-sm cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold text-white/90">{evt.tag}</span>
                <span className="text-xl leading-none" aria-hidden="true">
                  {evt.emoji}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-playful font-bold text-base leading-snug">{evt.title}</p>
                <span className="inline-flex items-center gap-1 text-xs font-playful font-bold text-white/95">
                  Play <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
};
