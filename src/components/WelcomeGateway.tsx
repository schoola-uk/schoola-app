import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Dices, Flame, Sparkles, Star } from 'lucide-react';
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
  directoryOpen?: boolean;
  onToggleDirectory?: () => void;
}


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
  directoryOpen,
  onToggleDirectory,
}) => {
  const featuredWorlds = LEARNING_WORLDS.filter((w) => w.featured);
  const years: YearGroup[] = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'];

  const [monsterMessage, setMonsterMessage] = useState(
    'Tap any little monster or play the interactive panels below to win Stars!'
  );
  const [panelPack, setPanelPack] = useState<'pack1' | 'pack2'>('pack1');


  const handleSurpriseAdventure = () => {
    const matching = TOPICS.filter((t) => matchesYearFilter(t, selectedYear));
    const pool = matching.length > 0 ? matching : TOPICS;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) onOpenTopic(pick);
  };

  return (
    <div className="w-full">
      {/* 1. HERO HEADER PHOTO BANNER (bubble-show-card.jpg) — PRESERVES BRIGHT PINK & MAGENTA STAGE LIGHTING */}
      <section
        aria-label="Schoola UK Primary Curriculum Hero"
        className="relative w-full overflow-hidden bg-[#240928] text-white"
      >
        {/* Background Header Photo from schoola-uk/curriculum */}
        <img
          src="./bubble-show-card.jpg"
          alt="Children enjoying a bright pink bubble science show"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.dataset.fallbackApplied) {
              img.dataset.fallbackApplied = '1';
              img.src = 'https://raw.githubusercontent.com/schoola-uk/curriculum/main/bubble-show-card.jpg';
            }
          }}
          className="absolute inset-0 w-full h-full object-cover object-[center_24%] sm:object-[68%_22%] select-none"
        />
        {/* Soft left-edge plum/rose scrim so bright pink & magenta lights shine untouched across the photo */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#240928]/88 via-[#4B1443]/38 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#240928]/65 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 pt-16 pb-16 sm:pt-24 sm:pb-24 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            {/* Left: Curriculum Headline + Subcopy + Key Stage & Year Controls */}
            <div className="lg:col-span-7 text-left space-y-5">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold text-[#F5C994] tracking-wide">
                <span className="h-[2.5px] w-7 bg-[#E11D48] rounded-full" aria-hidden="true" />
                <span className="uppercase tracking-[0.14em]">England National Curriculum · 100% Free</span>
                <span className="text-white/40" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-rose-100 normal-case">
                  <svg viewBox="0 0 24 16" className="w-4 h-3 rounded-[2px] shrink-0" aria-hidden="true">
                    <rect width="24" height="16" fill="#012169" />
                    <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
                    <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.4" />
                    <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="4.5" />
                    <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.5" />
                  </svg>
                  <span>Ages 5–11</span>
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums text-[#FDE047]">
                  <Star className="w-3.5 h-3.5 text-[#FDE047] fill-[#FDE047]" />
                  {stars}
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums text-pink-200">
                  <Flame className="w-3.5 h-3.5 text-pink-300" />
                  {streakDays}d
                </span>
              </div>

              <h1 className="font-playful font-bold text-3xl sm:text-4xl xl:text-5xl leading-[1.08] tracking-tight [text-wrap:balance] drop-shadow-sm">
                <span className="block text-white">Your child&apos;s complete</span>
                <span className="block text-[#F5C994] italic">UK primary curriculum</span>
                <span className="block text-white">in one place</span>
              </h1>

              <p className="text-sm sm:text-base text-rose-50/95 leading-relaxed max-w-xl font-medium drop-shadow-xs">
                Every subject, every topic for Years 1–6 — mapped to the National Curriculum with free videos, printables, and quizzes.
              </p>

              {/* Key Stage Quick-Jump Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1" role="group" aria-label="Choose Key Stage">
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
                      ? 'bg-[#FFF4E0] text-[#3B1037] border-[#F5C994] shadow-md'
                      : 'bg-[#311036]/82 backdrop-blur-sm text-white border-rose-200/40 hover:bg-[#46174D]'
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
                      ? 'bg-[#FFF4E0] text-[#3B1037] border-[#F5C994] shadow-md'
                      : 'bg-[#311036]/82 backdrop-blur-sm text-white border-rose-200/40 hover:bg-[#46174D]'
                  }`}
                >
                  <span aria-hidden="true">📘</span>
                  <span>Key Stage 2 · Years 3–6</span>
                </motion.button>
              </div>

              {/* Playful Quick Year-Group Selector */}
              <div className="flex flex-wrap gap-2.5 pt-0.5" role="group" aria-label="Choose your year group">
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
                          ? 'bg-[#DC5A38] text-white border-[#9A3412] shadow-sm'
                          : 'bg-[#311036]/80 backdrop-blur-sm text-rose-100 border-rose-200/35 hover:bg-[#46174D] hover:text-white'
                      }`}
                    >
                      {yr}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onEnterChild}
                  className="min-h-[52px] px-7 py-2.5 bg-gradient-to-r from-[#DC5A38] to-[#E11D48] hover:from-[#C2410C] hover:to-[#BE123C] border-2 border-[#9F1239] border-b-4 text-white font-playful font-bold text-base sm:text-lg rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-5 h-5 text-[#FDE047]" />
                  Let&apos;s Learn!
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -2, rotate: -2 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={handleSurpriseAdventure}
                  className="min-h-[52px] px-5 py-2.5 bg-[#311036]/85 hover:bg-[#491952] backdrop-blur-md border-2 border-rose-200/50 border-b-4 text-white font-playful font-bold text-sm sm:text-base rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Dices className="w-5 h-5 text-[#F5C994]" />
                  Surprise Me!
                </motion.button>
              </div>
            </div>

            {/* Right: Crisp Frosted Rose-Plum Glass Parent Testimonial Card */}
            <div className="lg:col-span-5 flex lg:justify-end">
              <div className="max-w-sm rounded-2xl bg-[#341139]/68 backdrop-blur-md border border-rose-200/35 p-6 sm:p-7 text-left shadow-2xl">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#F5C994] mb-2">
                  From a parent
                </p>
                <blockquote className="text-sm sm:text-base italic font-semibold text-white leading-snug">
                  “My girls ask to do their Schoola topics before I&apos;ve even had my coffee.”
                </blockquote>
                <p className="text-xs text-rose-100/90 mt-3 font-medium">
                  — A Schoola parent, Year 2 &amp; Reception
                </p>
              </div>
            </div>
          </div>

          {/* Bottom of Header: 4 Featured Learning Worlds Cards for Selected Year */}
          <div className="pt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-playful font-bold text-sm sm:text-base text-white/95 drop-shadow-xs">
                Featured <span className="text-[#F5C994]">Learning Worlds</span> for {selectedYear}
              </h2>
              <span className="text-xs font-bold text-rose-100">Tap any card to enter</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
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
                    className={`text-left bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-3.5 shadow-xl border-2 border-rose-200 border-b-4 transition-all cursor-pointer flex flex-col gap-2.5 ${tiltClass}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#881337] text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-playful font-bold text-base text-slate-900 truncate">
                        {world.worldTitle}
                      </span>
                    </div>
                    <div className="w-full h-24 rounded-xl overflow-hidden border border-slate-200">
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
        className="relative w-full overflow-hidden bg-gradient-to-b from-[#BAE6FD] via-[#E0F2FE] to-[#F0F9FF] border-b-2 border-sky-200 py-20 sm:py-28 px-6 sm:px-12 lg:px-20 space-y-14"
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
        <div className="relative z-10 w-full pt-4">
          {panelPack === 'pack1' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
              <AbacusMath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <GlobeTrivia onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <AncientSpellbook onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 items-start">
              <PatternPath onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
              <VintageClockAndBell onEarnStar={onEarnStar} setFairyMessage={setMonsterMessage} />
            </div>
          )}
        </div>
      </section>

      {/* 3. PICK A WORLD — RICH ILLUSTRATED SUBJECT DOORS */}
      <section aria-labelledby="subject-strip-heading" className="w-full bg-white py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-b border-slate-200 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 id="subject-strip-heading" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900">
              <span className="text-violet-600">Pick</span> a{' '}
              <span className="text-sky-600">world!</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-9 pt-2">
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

      {/* 5. COLLAPSIBLE FULL NATIONAL CURRICULUM DIRECTORY */}
      <CurriculumDirectorySection
        onOpenTopic={onOpenTopic}
        onOpenWorld={onOpenWorld}
        activeKS={directoryKS}
        onSelectKS={onSelectDirectoryKS}
        isOpen={directoryOpen}
        onToggleOpen={onToggleDirectory}
      />
    </div>
  );
};
