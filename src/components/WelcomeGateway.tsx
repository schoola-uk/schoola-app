import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Dices, Flame, Play, Sparkles, Star } from 'lucide-react';
import { WorldBannerIllustration } from './WorldIllustrations';
import { LEARNING_WORLDS, matchesYearFilter } from '../data/learningWorlds';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { Topic, YearGroup } from '../types';
import { PlayfulMonstersBar } from './PlayfulMonsters';
import { SubjectDoor } from './SubjectDoor';
import { InteractiveBottomStage } from './InteractiveBottomStage';
import { CurriculumDirectorySection } from './CurriculumDirectorySection';
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
  directoryKS?: 'ks1' | 'ks2';
  onSelectDirectoryKS?: (ks: 'ks1' | 'ks2') => void;
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
  directoryKS,
  onSelectDirectoryKS,
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
      {/* 1. HERO HEADER PHOTO BANNER (bubble-show-card.jpg) — PLUM / MAGENTA / ROSE PALETTE */}
      <section
        aria-label="Schoola UK Primary Curriculum Hero"
        className="relative w-full overflow-hidden bg-[#241122] text-white"
      >
        {/* Background Header Photo from schoola-uk/curriculum */}
        <img
          src="./bubble-show-card.jpg"
          alt="Children enjoying a bright bubble science show"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset.fallbackApplied) {
              img.dataset.fallbackApplied = '1';
              img.src = 'https://raw.githubusercontent.com/schoola-uk/curriculum/main/bubble-show-card.jpg';
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-[center_24%] sm:object-[68%_22%] select-none"
        />
        {/* Warm deep plum → royal magenta → rose glow scrim matching editorial header palette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#231021]/92 via-[#4E1B47]/62 to-[#B53D69]/22 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#231021]/78 via-[#2E132B]/10 to-[#231021]/30 pointer-events-none" />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pt-12 pb-12 sm:pt-16 sm:pb-16 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            {/* Left: Curriculum Headline + Subcopy + Key Stage & Year Controls */}
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#F5C994] tracking-wide">
                <span className="h-[2px] w-7 bg-[#F5C994]/85 rounded-full" aria-hidden="true" />
                <span className="uppercase tracking-[0.14em]">England National Curriculum · 100% Free</span>
                <span className="text-white/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#FCE7EE] normal-case">
                  <svg viewBox="0 0 24 16" className="w-4 h-3 rounded-[2px] shrink-0" aria-hidden="true">
                    <rect width="24" height="16" fill="#012169" />
                    <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
                    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.4" />
                    <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="4.5" />
                    <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.5" />
                  </svg>
                  <span>Ages 5–11</span>
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums text-[#F5C994]">
                  <Star className="w-3.5 h-3.5 text-[#F5C994] fill-[#F5C994]" />
                  {stars}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums text-[#F9B49B]">
                  <Flame className="w-3.5 h-3.5 text-[#F28C6A]" />
                  {streakDays}d
                </span>
              </div>

              <h1 className="font-playful font-bold text-3xl sm:text-4xl xl:text-5xl leading-[1.08] tracking-tight [text-wrap:balance] drop-shadow-sm">
                <span className="block text-white">Your child&apos;s complete</span>
                <span className="block text-[#F5C994] italic">UK primary curriculum</span>
                <span className="block text-white">in one place</span>
              </h1>

              <p className="text-sm sm:text-base text-[#F7E8EF] leading-relaxed max-w-xl font-medium drop-shadow-xs">
                Every subject, every topic for Years 1–6 — mapped to the National Curriculum with free videos, printables, and quizzes.
              </p>

              {/* Key Stage Quick-Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-0.5" role="group" aria-label="Choose Key Stage">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    onSelectYear(selectedYear === 'Year 1' ? 'Year 2' : 'Year 1');
                    onSelectDirectoryKS?.('ks1');
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer border-2 border-b-4 transition-colors flex items-center gap-2 ${
                    selectedYear === 'Year 1' || selectedYear === 'Year 2'
                      ? 'bg-[#F5C994] text-[#2B1224] border-[#C98B4B] shadow-md'
                      : 'bg-[#3A1731]/55 text-white border-white/30 hover:bg-[#4D1E41]/75 backdrop-blur-md'
                  }`}
                >
                  <span aria-hidden="true">📗</span>
                  <span>Key Stage 1 · Years 1–2</span>
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => {
                    onSelectYear(selectedYear === 'Year 3' ? 'Year 4' : 'Year 3');
                    onSelectDirectoryKS?.('ks2');
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer border-2 border-b-4 transition-colors flex items-center gap-2 ${
                    selectedYear !== 'Year 1' && selectedYear !== 'Year 2'
                      ? 'bg-[#FAD7E2] text-[#2B1224] border-[#C77D96] shadow-md'
                      : 'bg-[#3A1731]/55 text-white border-white/30 hover:bg-[#4D1E41]/75 backdrop-blur-md'
                  }`}
                >
                  <span aria-hidden="true">📘</span>
                  <span>Key Stage 2 · Years 3–6</span>
                </motion.button>
              </div>

              {/* Playful Quick Year-Group Selector */}
              <div className="flex flex-wrap gap-2 pt-0.5" role="group" aria-label="Choose your year group">
                {years.map((yr) => {
                  const active = selectedYear === yr;
                  return (
                    <motion.button
                      key={yr}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      type="button"
                      onClick={() => onSelectYear(yr)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-2xl text-xs font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer border-2 border-b-4 transition-colors ${
                        active
                          ? 'bg-[#DC5A38] text-white border-[#9C351B] shadow-sm'
                          : 'bg-[#3A1731]/50 text-[#FDF4F7] border-white/25 hover:bg-[#522044]/75 backdrop-blur-md'
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
                  className="min-h-[50px] px-7 py-2.5 bg-[#DC5A38] hover:bg-[#C94D2D] border-2 border-[#9A341A] border-b-4 text-white font-playful font-bold text-base sm:text-lg rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
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
                  className="min-h-[50px] px-5 py-2.5 bg-white/15 hover:bg-white/25 border-2 border-white/35 border-b-4 backdrop-blur-md text-white font-playful font-bold text-sm sm:text-base rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Dices className="w-5 h-5 text-[#F5C994]" />
                  Surprise Me!
                </motion.button>
              </div>

              {/* Inline Curriculum Trust Stats */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-[#F7E8EF]">
                <span className="text-xs font-semibold">
                  <strong className="font-playful text-base text-[#F5C994] tabular-nums">200+</strong> Curriculum topics
                </span>
                <span className="text-white/30" aria-hidden="true">|</span>
                <span className="text-xs font-semibold">
                  <strong className="font-playful text-base text-[#FAD7E2] tabular-nums">12</strong> Subjects covered
                </span>
                <span className="text-white/30" aria-hidden="true">|</span>
                <span className="text-xs font-semibold">
                  <strong className="font-playful text-base text-white tabular-nums">£0</strong> Always free
                </span>
              </div>
            </div>

            {/* Right: Frosted Warm Plum Glass Parent Testimonial Card */}
            <div className="lg:col-span-5 flex lg:justify-end">
              <div className="max-w-sm rounded-2xl bg-[#4E203C]/60 backdrop-blur-md border border-white/25 p-5 sm:p-6 text-left shadow-xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#F5C994] mb-2">
                  From a parent
                </p>
                <blockquote className="text-sm sm:text-base italic font-semibold text-white leading-snug">
                  “My girls ask to do their Schoola topics before I&apos;ve even had my coffee.”
                </blockquote>
                <p className="text-xs text-[#F2D5DF] mt-2.5 font-medium">
                  — A Schoola parent, Year 2 &amp; Reception
                </p>
              </div>
            </div>
          </div>

          {/* Bottom of Header: 4 Featured Learning Worlds Cards for Selected Year */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-playful font-bold text-sm sm:text-base text-white/95 drop-shadow-xs">
                Featured <span className="text-[#F5C994]">Learning Worlds</span> for {selectedYear}
              </h2>
              <span className="text-xs font-bold text-[#FAD7E2]">Tap any card to enter</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    className={`text-left bg-[#FFFDF9]/95 hover:bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border-2 border-[#F5C994]/80 border-b-4 transition-all cursor-pointer flex flex-col gap-2.5 ${tiltClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B53D69] text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-playful font-bold text-base text-slate-900 truncate">
                        {world.worldTitle}
                      </span>
                    </div>
                    <div className="w-full h-24 rounded-xl overflow-hidden border border-[#F4E6EC]">
                      <WorldBannerIllustration
                        worldKey={world.illustrationKey}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LITTLE MONSTERS & INTERACTIVE PLAYGROUND — 100% FULL WIDTH LIGHT BLUE SKY */}
      <section
        aria-labelledby="monster-arcade-heading"
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#F0F9FF] border-b-2 border-sky-200 py-14 sm:py-20 px-6 sm:px-10 lg:px-16 space-y-10"
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
        <div className="relative z-10 w-full pt-2">
          {panelPack === 'pack1' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
              <AbacusMath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <GlobeTrivia onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <AncientSpellbook onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-start">
              <PatternPath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <VintageClockAndBell onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          )}
        </div>
      </section>

      {/* 3. PICK A WORLD — RICH ILLUSTRATED SUBJECT DOORS */}
      <section aria-labelledby="subject-strip-heading" className="w-full bg-white py-14 sm:py-20 px-6 sm:px-10 lg:px-16 border-b border-slate-200 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 id="subject-strip-heading" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900">
              <span className="text-violet-600">Pick</span> a{' '}
              <span className="text-sky-600">world!</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              Unlock any Learning World gate to explore videos, games, and curriculum quests.
            </p>
          </div>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onEnterChild}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 border-b-2 border-sky-300 text-xs sm:text-sm font-playful font-bold text-sky-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Activity Land Map →
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7 pt-2">
          {SUBJECTS.map((subj) => (
            <SubjectDoor
              key={subj.id}
              subject={subj}
              onClick={() => onOpenWorld(subj.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. FLIP THE PAGES STORYBOOK + INTERACTIVE UK SCHOOL CALENDAR & SYNC */}
      <InteractiveBottomStage onOpenTopic={onOpenTopic} onEarnStar={onEarnStar} />

      {/* 4. TODAY & FEATURED ADVENTURES — 100% FULL WIDTH */}
      <section aria-labelledby="adventures-strip-heading" className="w-full bg-[#F8FAFC] py-14 sm:py-20 px-6 sm:px-10 lg:px-16 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h2 id="adventures-strip-heading" className="font-playful font-bold text-xl sm:text-2xl text-slate-900">
            <span className="text-rose-500">Today&apos;s</span>{' '}
            <span className="text-amber-600">adventures</span>
          </h2>
          <span className="text-xs sm:text-sm font-playful font-bold text-sky-700 whitespace-nowrap">
            Tap to play!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 pb-2 pt-1">
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

      {/* 5. FEATURED VIDEO LESSONS & FULL NATIONAL CURRICULUM DIRECTORY */}
      <CurriculumDirectorySection
        onOpenTopic={onOpenTopic}
        onOpenWorld={onOpenWorld}
        activeKS={directoryKS}
        onSelectKS={onSelectDirectoryKS}
      />
    </div>
  );
};
