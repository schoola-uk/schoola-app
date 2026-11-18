import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bookmark,
  Compass,
  Printer,
  Search,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  BADGES,
  DAILY_CHALLENGES,
  INTEREST_QUESTS,
  LEARNING_WORLDS,
  matchesYearFilter,
  SURPRISE_FUN_FACTS,
  YEAR_GROUPS,
} from '../data/learningWorlds';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { LearnerProgress, Topic, YearGroup } from '../types';
import {
  InterestIllustration,
  QuizVisualIllustration,
  WorldBannerIllustration,
} from './WorldIllustrations';
import { FairyGuide } from './FairyGuide';
import { FeaturedVideoLessonsPanel } from './FeaturedVideoLessonsPanel';
import { ChildDashboardNotebook } from './ChildDashboardNotebook';
import {
  CosmicDailyChallengeCard,
  ExplorerRoadmapSection,
} from './ExplorerRoadmapGraphic';
import {
  getSelectedVoicePreset,
  setSelectedVoicePreset,
  speakText,
  VOICE_PRESETS,
  VoicePresetId,
} from '../utils/speech';

interface ChildDashboardProps {
  progress: LearnerProgress;
  activeWorldSubjectId: string | null;
  onSelectYear: (year: YearGroup) => void;
  onSelectWorld: (subjectId: string | null) => void;
  onOpenTopic: (topic: Topic) => void;
  onCompleteDailyChallenge: (starsEarned: number) => void;
  onCycleMascot: () => void;
  onToggleFavourite: (topicId: string) => void;
  onOpenCertificate: (title: string) => void;
  mascotExpression: 'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited';
  mascotMessage: string;
}

export const ChildDashboard: React.FC<ChildDashboardProps> = ({
  progress,
  activeWorldSubjectId,
  onSelectYear,
  onSelectWorld,
  onOpenTopic,
  onCompleteDailyChallenge,
  onCycleMascot,
  onToggleFavourite,
  onOpenCertificate,
  mascotExpression,
  mascotMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllWorlds, setShowAllWorlds] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyIdx, setDailyIdx] = useState(() => new Date().getDate() % DAILY_CHALLENGES.length);
  const [dailyChoice, setDailyChoice] = useState<number | null>(null);
  const [activeVoice, setActiveVoice] = useState<VoicePresetId>(() => getSelectedVoicePreset());

  const handleSelectVoice = (id: VoicePresetId) => {
    setActiveVoice(id);
    setSelectedVoicePreset(id);
    const chosen = VOICE_PRESETS.find((v) => v.id === id);
    speakText(
      `Hello ${progress.explorerName || 'Explorer'}! This is ${chosen?.label}, your ${chosen?.subtitle}.`,
      undefined,
      id
    );
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const dailyDoneToday = progress.dailyChallengeCompletedDate === todayKey;
  const activeDaily = DAILY_CHALLENGES[dailyIdx];

  const unlockedBadges = useMemo(
    () => BADGES.filter((b) => b.checkUnlocked(progress)),
    [progress]
  );

  // Topics matching selected year
  const yearTopics = useMemo(
    () => TOPICS.filter((t) => matchesYearFilter(t, progress.selectedYear)),
    [progress.selectedYear]
  );

  // Continue where you left off
  const continueTopic = useMemo(() => {
    for (const tid of progress.recentTopicIds) {
      const found = TOPICS.find((t) => t.id === tid);
      if (found) return found;
    }
    return yearTopics[0] || TOPICS[0];
  }, [progress.recentTopicIds, yearTopics]);

  // Recommended next topic (not yet completed in child's year)
  const recommendedTopic = useMemo(() => {
    const uncompleted = yearTopics.find(
      (t) => !progress.completedTopics.includes(t.id) && t.id !== continueTopic?.id
    );
    return uncompleted || yearTopics[1] || TOPICS[1];
  }, [yearTopics, progress.completedTopics, continueTopic]);

  // Search results across all topics when user types in search bar
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subjectId.toLowerCase().includes(q) ||
        t.objectives.some((o) => o.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery]);

  // Topics inside active Learning World view
  const worldTopics = useMemo(() => {
    if (!activeWorldSubjectId) return [];
    const matchingYear = TOPICS.filter(
      (t) => t.subjectId === activeWorldSubjectId && matchesYearFilter(t, progress.selectedYear)
    );
    // If a subject only has cross-year topics or few topics in that year, also show other topics in the subject clearly grouped
    if (matchingYear.length > 0) return matchingYear;
    return TOPICS.filter((t) => t.subjectId === activeWorldSubjectId);
  }, [activeWorldSubjectId, progress.selectedYear]);

  const activeWorld = useMemo(
    () => LEARNING_WORLDS.find((w) => w.subjectId === activeWorldSubjectId) || null,
    [activeWorldSubjectId]
  );

  const activeSubjectMeta = useMemo(
    () => SUBJECTS.find((s) => s.id === activeWorldSubjectId) || null,
    [activeWorldSubjectId]
  );

  // If a Learning World is selected, show its Illustrated Topic Learning Map!
  if (activeWorld && activeSubjectMeta) {
    const completedInWorld = worldTopics.filter((t) =>
      progress.completedTopics.includes(t.id)
    ).length;

    return (
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-14 space-y-12 sm:space-y-16 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelectWorld(null)}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-800 cursor-pointer"
          >
            ← Back to My Dashboard
          </button>

          <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Change year group">
            {YEAR_GROUPS.map((yg) => (
              <button
                key={yg.year}
                type="button"
                onClick={() => onSelectYear(yg.year)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  progress.selectedYear === yg.year
                    ? 'bg-sky-600 text-white border-sky-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {yg.year}
              </button>
            ))}
          </div>
        </div>

        {/* World Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>{progress.selectedYear}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {completedInWorld} of {worldTopics.length} topics completed
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-3xl text-slate-900">
                {activeWorld.worldTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeWorld.subtitle}. {activeSubjectMeta.description}
              </p>
            </div>

            <div className="w-full max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 tabular-nums">
                <span>World Progress</span>
                <span>
                  {worldTopics.length > 0
                    ? Math.round((completedInWorld / worldTopics.length) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{
                    width: `${
                      worldTopics.length > 0
                        ? Math.round((completedInWorld / worldTopics.length) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200">
            <WorldBannerIllustration
              worldKey={activeWorld.illustrationKey}
              className="w-full h-full min-h-[160px] object-cover"
            />
          </div>
        </div>

        {/* Topics as Illustrated Activity Cards */}
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-xl text-slate-900">
            Choose a topic adventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {worldTopics.map((topic, index) => {
              const done = progress.completedTopics.includes(topic.id);
              const inProgress =
                !done &&
                (progress.watchedTopics.includes(topic.id) ||
                  progress.playedTopics.includes(topic.id));
              const saved = progress.favouriteTopics.includes(topic.id);
              const cleanTitle = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();

              return (
                <div
                  key={topic.id}
                  className="bg-white border border-slate-200 hover:border-sky-400 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between gap-5 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                      <span className="tabular-nums">
                        Activity {index + 1} · {topic.year}
                      </span>
                      <button
                        type="button"
                        onClick={() => onToggleFavourite(topic.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                        aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${saved ? 'fill-amber-500 text-amber-500' : ''}`}
                        />
                      </button>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {cleanTitle}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {topic.objectives[0]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <span
                      className={`text-xs font-bold ${
                        done
                          ? 'text-emerald-700'
                          : inProgress
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {done ? '✓ Completed' : inProgress ? 'In progress' : 'Ready to start'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenTopic(topic)}
                      className="min-h-[40px] px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
                    >
                      {done ? 'Replay' : 'Start learning'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Curated Featured Video Lessons for this Learning World */}
        <FeaturedVideoLessonsPanel
          subjectId={activeSubjectMeta.id}
          onOpenTopic={onOpenTopic}
        />
      </div>
    );
  }

  // MAIN CHILD PERSONAL LEARNING DASHBOARD
  const visibleWorlds = showAllWorlds
    ? LEARNING_WORLDS
    : LEARNING_WORLDS.slice(0, 6);

  const weeklyPercent = Math.min(
    100,
    Math.round((progress.completedTopics.length / progress.weeklyGoalTarget) * 100)
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-14 py-8 sm:py-14 space-y-12 sm:space-y-16 lg:space-y-20 text-left">
      {/* 1. COMPACT FRAMED PASTEL NOTEBOOK AT THE TOP BEFORE WELCOME BACK */}
      <div className="max-w-5xl mx-auto mb-2 sm:mb-4">
        <ChildDashboardNotebook
          selectedYear={progress.selectedYear}
          stars={progress.stars}
          favouriteTopicIds={progress.favouriteTopics}
          onOpenTopic={onOpenTopic}
        />
      </div>

      {/* 2. LIGHT BLUE WELCOME BACK, YOUNG EXPLORER! + GRAPHIC ROADMAP WITH BUSH MONSTERS */}
      <section
        aria-label="Welcome back Explorer & Roadmap"
        className="bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD]/65 to-[#EFF6FF] border-2 border-sky-300 rounded-3xl p-5 sm:p-10 lg:p-12 shadow-sm space-y-10 sm:space-y-12"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
              <span>{progress.selectedYear}</span>
              <span aria-hidden="true">·</span>
              <span>
                {YEAR_GROUPS.find((y) => y.year === progress.selectedYear)?.ageLabel}
              </span>
              <span aria-hidden="true">·</span>
              <span>England National Curriculum</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
                Welcome back, {progress.explorerName || 'Young Explorer'}!
              </h1>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    `Welcome back, ${progress.explorerName || 'Young Explorer'}! You have earned ${progress.stars} stars on your learning road map. Tap a bush to meet a monster friend!`
                  )
                }
                className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white border border-sky-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                aria-label="Read welcome greeting aloud"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                Read aloud
              </button>
            </div>
            <p className="text-sm text-slate-700">
              Follow your winding explorer road map, tap bushes to discover friendly monsters, and collect shining stars!
            </p>

            {/* English RP & Soft Teacher Voice Selector */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-sky-950">English RP Voice:</span>
              {VOICE_PRESETS.map((v) => {
                const active = activeVoice === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectVoice(v.id)}
                    className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                        : 'bg-white/90 text-slate-800 border-sky-200 hover:bg-sky-50'
                    }`}
                    title={v.subtitle}
                  >
                    {v.label} · {v.subtitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search by topic */}
          <div className="w-full lg:w-80 relative shrink-0">
            <label htmlFor="child-topic-search" className="sr-only">
              Search topics
            </label>
            <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="child-topic-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. plants, fractions)..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-2xl border border-sky-300 bg-white/95 focus:bg-white focus:border-sky-600 focus:outline-none text-sm font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Quick Search Results */}
        {searchResults.length > 0 && (
          <div className="border-t border-sky-200 pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-sky-950">
                Matching activities ({searchResults.length})
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-sky-800 hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {searchResults.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onOpenTopic(t);
                  }}
                  className="p-3.5 rounded-2xl border border-sky-200 bg-white/95 hover:border-sky-500 text-left transition-all cursor-pointer"
                >
                  <span className="text-[11px] font-bold text-sky-700 block">
                    {t.subjectId} · {t.year}
                  </span>
                  <span className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 block">
                    {t.title.replace(/^[^:—]+[:—]\s*/, '')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Year Group Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 pt-5 border-t border-sky-200/80">
          <span className="text-xs font-bold text-sky-950 mr-1">My Year:</span>
          {YEAR_GROUPS.map((yg) => {
            const active = progress.selectedYear === yg.year;
            return (
              <button
                key={yg.year}
                type="button"
                onClick={() => onSelectYear(yg.year)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                    : 'bg-white/90 text-slate-800 border-sky-200 hover:bg-white'
                }`}
              >
                {yg.year}
              </button>
            );
          })}
        </div>

        {/* Graphic Adventure Road Map with Stars, Bush-Hiding Monsters, Tasks & Badges */}
        <ExplorerRoadmapSection
          progress={progress}
          unlockedBadgesCount={unlockedBadges.length}
          totalBadgesCount={BADGES.length}
          weeklyPercent={weeklyPercent}
        />
      </section>

      {/* 3. TODAY'S DAILY CHALLENGE: EXPANDED COSMIC GRAPHIC WITH MOVING CLICKABLE PLANETS & SHINE */}
      <div className="space-y-12">
        <CosmicDailyChallengeCard
          challenges={DAILY_CHALLENGES}
          selectedIndex={dailyIdx}
          onSelectIndex={(idx) => setDailyIdx(idx)}
          dailyDoneToday={dailyDoneToday}
          onLaunchChallenge={() => {
            setDailyChoice(null);
            setShowDailyModal(true);
          }}
        />

        {/* Quick Launch Trio: Continue Learning + Recommended Next + Mascot Buddy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {continueTopic && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-700">Continue learning</span>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {continueTopic.title.replace(/^[^:—]+[:—]\s*/, '')}
                </h3>
                <p className="text-xs text-slate-500">
                  {continueTopic.subjectId} · {continueTopic.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenTopic(continueTopic)}
                className="min-h-[44px] w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 border-2 border-sky-700 border-b-4 text-white font-heading font-extrabold text-xs rounded-2xl transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Jump In!
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {recommendedTopic && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700">Recommended next</span>
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {recommendedTopic.title.replace(/^[^:—]+[:—]\s*/, '')}
                </h3>
                <p className="text-xs text-slate-500">
                  {recommendedTopic.subjectId} · {recommendedTopic.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenTopic(recommendedTopic)}
                className="min-h-[44px] w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 border-b-4 text-white font-heading font-extrabold text-xs rounded-2xl transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Try Next!
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center">
            <FairyGuide
              expression={mascotExpression}
              message={mascotMessage}
              companionId={progress.mascotId}
              onCompanionClick={onCycleMascot}
            />
          </div>
        </div>
      </div>

      {/* 4. "What would you like to learn today?" — EXPANDED & ANIMATED GRAPHICS */}
      <section aria-labelledby="interest-heading" className="space-y-10">
        <div className="space-y-2">
          <h2 id="interest-heading" className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
            What would you like to learn today?
          </h2>
          <p className="text-sm text-slate-600">
            Tap any animated adventure scene — we connect your curiosity straight to curriculum quests!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {INTEREST_QUESTS.map((quest) => {
            const matchedTopic =
              yearTopics.find(
                (t) =>
                  t.subjectId === quest.subjectId &&
                  quest.keywords.some((k) => t.title.toLowerCase().includes(k))
              ) ||
              TOPICS.find((t) => t.subjectId === quest.subjectId && matchesYearFilter(t, progress.selectedYear)) ||
              TOPICS.find((t) => t.subjectId === quest.subjectId)!;

            return (
              <motion.button
                key={quest.id}
                type="button"
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onOpenTopic(matchedTopic)}
                className="text-left bg-white border-2 border-slate-200 hover:border-sky-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-52 sm:h-56 overflow-hidden border-b border-slate-100 relative">
                    <InterestIllustration
                      interestKey={quest.illustrationKey}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-7 sm:p-8 space-y-2.5">
                    <span className="text-xs font-bold text-sky-700 block">
                      {quest.subjectsLabel}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{quest.description}</p>
                  </div>
                </div>
                <div className="px-7 sm:px-8 pb-6 text-xs sm:text-sm font-extrabold text-sky-700 flex items-center gap-1.5">
                  Explore animated quest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 5. MY LEARNING WORLDS — EXPANDED & ANIMATED GRAPHICS */}
      <section aria-labelledby="worlds-heading" className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 id="worlds-heading" className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
              My Learning Worlds
            </h2>
            <p className="text-sm text-slate-600">
              Step inside animated worlds for {progress.selectedYear} with Watch, Play &amp; Test adventures.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAllWorlds((v) => !v)}
            className="min-h-[42px] px-5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {showAllWorlds ? 'Show featured worlds' : `Show all ${LEARNING_WORLDS.length} subjects`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {visibleWorlds.map((world) => {
            const worldTopicList = TOPICS.filter(
              (t) => t.subjectId === world.subjectId && matchesYearFilter(t, progress.selectedYear)
            );
            const fallbackList =
              worldTopicList.length > 0
                ? worldTopicList
                : TOPICS.filter((t) => t.subjectId === world.subjectId);
            const doneCount = fallbackList.filter((t) =>
              progress.completedTopics.includes(t.id)
            ).length;

            return (
              <motion.button
                key={world.id}
                type="button"
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectWorld(world.subjectId)}
                className="text-left bg-white border-2 border-slate-200 hover:border-sky-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-48 sm:h-52 overflow-hidden border-b border-slate-100 relative">
                    <WorldBannerIllustration
                      worldKey={world.illustrationKey}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 sm:p-7 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 tabular-nums">
                      <span>{fallbackList.length} activities</span>
                      <span className="text-emerald-700">
                        {doneCount}/{fallbackList.length} done
                      </span>
                    </div>
                    <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-900">
                      {world.worldTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{world.subtitle}</p>
                  </div>
                </div>
                <div className="px-6 sm:px-7 pb-6 flex items-center justify-between text-xs sm:text-sm font-extrabold text-sky-700">
                  <span>Enter {world.worldTitle}</span>
                  <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* 6. MY ACHIEVEMENTS & BADGES — SHINING WITH DAZZLING GLITTER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Glittering Badges Cabinet */}
        <div
          aria-label="My Achievements & Glitter Badges"
          data-light-card="true"
          className="lg:col-span-7 relative overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/85 to-[#FCE7F3]/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-10 shadow-lg space-y-8"
        >
          {/* Animated Dazzling Glitter Sweeps & Floating Diamond Twinkles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-2/3 bg-gradient-to-r from-transparent via-white/55 to-transparent animate-shine-sweep"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <Sparkles className="w-5 h-5 text-amber-400 absolute top-5 right-1/3 animate-glitter-twinkle" />
            <Sparkles className="w-4 h-4 text-pink-400 absolute bottom-6 left-12 animate-glitter-twinkle" />
            <Sparkles className="w-5 h-5 text-yellow-400 absolute top-1/2 right-8 animate-glitter-twinkle" />
            <span className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-amber-300 animate-glitter-twinkle" />
            <span className="absolute bottom-14 right-1/4 w-2.5 h-2.5 rounded-full bg-rose-300 animate-glitter-twinkle" />
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-heading font-extrabold text-xl text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                My Achievements &amp; Badges
              </h2>
              <p className="text-xs sm:text-sm text-slate-700">
                Shining glitter rewards celebrating your effort, curiosity and steady progress!
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenCertificate(`${progress.selectedYear} Learning Journey`)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Certificate
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {BADGES.map((badge, bIdx) => {
              const unlocked = badge.checkUnlocked(progress);
              return (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -3, scale: 1.04 }}
                  className={`relative overflow-hidden p-4 sm:p-5 rounded-2xl border-2 text-center space-y-2 transition-all ${
                    unlocked
                      ? 'bg-gradient-to-b from-white via-[#FEF9C3]/90 to-[#FDE68A]/70 border-amber-400 text-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.38)]'
                      : 'bg-white/70 border-amber-200/70 text-slate-600 opacity-80'
                  }`}
                >
                  {unlocked && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-3/4 bg-gradient-to-r from-transparent via-white/75 to-transparent animate-shine-sweep"
                      style={{ animationDelay: `${bIdx * 0.45}s` }}
                    />
                  )}
                  <div className="relative inline-flex items-center justify-center">
                    {unlocked && (
                      <span
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-full bg-amber-300/45 blur-xs animate-glitter-twinkle"
                      />
                    )}
                    <span className={`relative text-3xl block ${unlocked ? 'drop-shadow-sm' : 'grayscale'}`}>
                      {badge.emoji}
                    </span>
                  </div>
                  <p className="relative text-xs font-extrabold leading-tight text-slate-900">{badge.name}</p>
                  <p className="relative text-[11px] leading-snug text-slate-700 font-medium">
                    {unlocked ? '✦ Shining Unlocked!' : badge.requirementLabel}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Saved Favourites & Surprise Fun Facts */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading font-extrabold text-lg text-slate-900">
              Saved Favourites ({progress.favouriteTopics.length})
            </h2>
            {progress.favouriteTopics.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tap &quot;Save topic&quot; inside any activity to keep your favourite adventures handy here.
              </p>
            ) : (
              <div className="space-y-3">
                {progress.favouriteTopics.slice(0, 3).map((tid) => {
                  const t = TOPICS.find((item) => item.id === tid);
                  if (!t) return null;
                  return (
                    <button
                      key={tid}
                      type="button"
                      onClick={() => onOpenTopic(t)}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-400 text-left flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {t.title.replace(/^[^:—]+[:—]\s*/, '')}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-playful font-extrabold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
              <span aria-hidden="true">✨</span>
              <span>Surprise Fun Fact!</span>
            </h3>
            <div
              data-light-card="true"
              className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 border-2 border-amber-300 shadow-xs space-y-2.5"
            >
              <strong className="font-playful font-extrabold text-base sm:text-lg text-indigo-900 block">
                {SURPRISE_FUN_FACTS[progress.completedTopics.length % SURPRISE_FUN_FACTS.length].title}
              </strong>
              <p className="font-playful font-medium text-sm sm:text-base text-slate-800 leading-relaxed">
                {SURPRISE_FUN_FACTS[progress.completedTopics.length % SURPRISE_FUN_FACTS.length].fact}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-left max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700">
                Daily Mini Challenge · {activeDaily.ageHint}
              </span>
              <button
                type="button"
                onClick={() => setShowDailyModal(false)}
                className="min-h-[36px] px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>

            <h3 className="font-heading font-extrabold text-xl text-slate-900">
              {activeDaily.title}
            </h3>

            <QuizVisualIllustration hint={activeDaily.visualHint} />

            <p className="font-heading font-bold text-base sm:text-lg text-slate-900">
              {activeDaily.question}
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {activeDaily.options.map((opt, idx) => {
                const isPicked = dailyChoice === idx;
                const isCorrect = idx === activeDaily.correctIndex;
                let cls = 'bg-slate-50 border-slate-200 hover:border-sky-400 text-slate-900';
                if (dailyChoice !== null) {
                  if (isCorrect) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                  else if (isPicked) cls = 'bg-rose-50 border-rose-400 text-rose-950';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={dailyChoice !== null}
                    onClick={() => {
                      setDailyChoice(idx);
                      onCompleteDailyChallenge(idx === activeDaily.correctIndex ? 5 : 3);
                    }}
                    className={`min-h-[48px] p-3.5 rounded-2xl border-2 text-left text-sm font-bold flex items-center gap-3 cursor-pointer ${cls}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-extrabold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {dailyChoice !== null && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-sm text-emerald-950">
                <p className="font-bold">
                  {dailyChoice === activeDaily.correctIndex
                    ? 'Spot on! +5 Stars earned!'
                    : 'Great effort trying today’s challenge! +3 Curiosity Stars earned!'}
                </p>
                <p>{activeDaily.encouragement}</p>
                <p className="font-playful text-sm text-emerald-900 pt-1">
                  <strong className="font-extrabold text-base text-rose-600">✨ Fun Fact: </strong>
                  {activeDaily.funFact}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDailyChoice(null);
                      setDailyIdx((i) => (i + 1) % DAILY_CHALLENGES.length);
                    }}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Try Another Challenge
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDailyModal(false)}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold cursor-pointer"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
