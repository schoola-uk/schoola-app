import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Gamepad2,
  Gift,
  Home,
  Play,
  Sparkles,
  Star,
  Trophy,
  Volume2,
} from 'lucide-react';
import { HubStage, LearnerProgress, Subject, Topic } from '../types';
import { CURATED_YOUTUBE_VIDEOS } from '../data/youtubeVideos';
import { getWorldForSubject, SURPRISE_FUN_FACTS } from '../data/learningWorlds';
import { PlayActivityStage } from './PlayActivityStage';
import { InteractiveQuiz } from './InteractiveQuiz';
import { WorldBannerIllustration } from './WorldIllustrations';
import { FairyGuide } from './FairyGuide';
import { speakText } from '../utils/speech';

interface LearningHubProps {
  topic: Topic;
  subject: Subject;
  nextTopicInWorld: Topic | null;
  progress: LearnerProgress;
  onBackToDashboard: () => void;
  onBackToWorld: () => void;
  onToggleFavourite: (topicId: string) => void;
  onStageWatchDone: (topicId: string) => void;
  onStagePlayDone: (topicId: string) => void;
  onTopicQuizDone: (topicId: string, score: number, total: number, starsEarned: number) => void;
  onSelectTopic: (topic: Topic) => void;
  onOpenCertificate: (title: string) => void;
  onMascotUpdate: (expr: 'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited', msg: string) => void;
  mascotExpression?: 'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited';
  mascotMessage?: string;
  onCycleMascot?: () => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({
  topic,
  subject,
  nextTopicInWorld,
  progress,
  onBackToDashboard,
  onBackToWorld,
  onToggleFavourite,
  onStageWatchDone,
  onStagePlayDone,
  onTopicQuizDone,
  onSelectTopic,
  onOpenCertificate,
  onMascotUpdate,
  mascotExpression = 'excited',
  mascotMessage = 'Tap the mystery cards to unlock today’s clues, or jump into a resource!',
  onCycleMascot,
}) => {
  const [stage, setStage] = useState<HubStage>('watch');
  const [revealedGoals, setRevealedGoals] = useState<number[]>([]);
  const [factRevealed, setFactRevealed] = useState(false);

  // Reset interactive mystery cards when switching topics
  useEffect(() => {
    setRevealedGoals([]);
    setFactRevealed(false);
    setStage('watch');
  }, [topic.id]);

  const world = useMemo(() => getWorldForSubject(topic.subjectId), [topic.subjectId]);
  const isFavourite = progress.favouriteTopics.includes(topic.id);
  const isWatched = progress.watchedTopics.includes(topic.id);
  const isPlayed = progress.playedTopics.includes(topic.id);
  const isCompleted = progress.completedTopics.includes(topic.id);

  const cleanTopicKeyword = useMemo(
    () => topic.title.replace(/^[^:—]+[:—]\s*/, '').trim(),
    [topic.title]
  );

  // Match a curated YouTube video link (external link only, no iframe)
  const matchedVideo = useMemo(() => {
    const exact = CURATED_YOUTUBE_VIDEOS.find(
      (v) =>
        v.subjectId === topic.subjectId &&
        cleanTopicKeyword
          .toLowerCase()
          .split(/\s+/)
          .some((word) => word.length > 4 && v.title.toLowerCase().includes(word))
    );
    if (exact) return exact;
    return CURATED_YOUTUBE_VIDEOS.find((v) => v.subjectId === topic.subjectId) || null;
  }, [topic.subjectId, cleanTopicKeyword]);

  const subjectFunFact = useMemo(() => {
    return (
      SURPRISE_FUN_FACTS.find((f) => f.subjectId === topic.subjectId) || SURPRISE_FUN_FACTS[0]
    );
  }, [topic.subjectId]);

  const stages: { key: HubStage; num: string; label: string; icon: React.ReactNode; done: boolean }[] = [
    { key: 'watch', num: '1', label: 'Discover', icon: <Play className="w-4 h-4" />, done: isWatched },
    { key: 'play', num: '2', label: 'Play', icon: <Gamepad2 className="w-4 h-4" />, done: isPlayed },
    { key: 'test', num: '3', label: 'Quiz', icon: <Trophy className="w-4 h-4" />, done: isCompleted },
    { key: 'celebrate', num: '4', label: 'Rewards', icon: <Sparkles className="w-4 h-4" />, done: isCompleted },
  ];

  const videoResourceUrl = matchedVideo
    ? `https://www.youtube.com/watch?v=${matchedVideo.youtubeId}`
    : `https://www.youtube.com/@schoolauk`;

  const handleRevealGoal = (idx: number, text: string) => {
    if (!revealedGoals.includes(idx)) {
      const next = [...revealedGoals, idx];
      setRevealedGoals(next);
      if (next.length === topic.objectives.length) {
        onStageWatchDone(topic.id);
        onMascotUpdate('sparkle', 'Woohoo! You unlocked every clue! Ready to play?');
      } else {
        onMascotUpdate('excited', `Clue ${idx + 1} unlocked! Tap the next mystery card!`);
      }
    }
    speakText(text);
  };

  const outsourcedLinks = [
    {
      id: 'video',
      label: 'Video',
      emoji: '🎬',
      href: videoResourceUrl,
      style: 'bg-rose-500 hover:bg-rose-600 border-rose-700 text-white',
    },
    {
      id: 'bbc',
      label: 'BBC',
      emoji: '📺',
      href: `https://www.bbc.co.uk/search?q=%22${encodeURIComponent(cleanTopicKeyword)}%22&d=search_ps`,
      style: 'bg-indigo-500 hover:bg-indigo-600 border-indigo-700 text-white',
    },
    {
      id: 'twinkl',
      label: 'Twinkl',
      emoji: '✏️',
      href: `https://www.twinkl.co.uk/search?term=${encodeURIComponent(cleanTopicKeyword)}`,
      style: 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white',
    },
    {
      id: 'oak',
      label: 'Oak',
      emoji: '🌳',
      href: `https://www.thenational.academy/search?q=${encodeURIComponent(cleanTopicKeyword)}`,
      style: 'bg-amber-400 hover:bg-amber-500 border-amber-600 text-slate-950',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5 text-left">
      {/* Top Playful Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onBackToDashboard}
            className="min-h-[42px] px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 border-b-4 hover:border-sky-300 text-xs font-extrabold text-slate-800 flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-sky-600" />
            Hub
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onBackToWorld}
            className="min-h-[42px] px-4 py-2 rounded-2xl bg-white border-2 border-slate-200 border-b-4 hover:border-sky-300 text-xs font-extrabold text-slate-800 cursor-pointer whitespace-nowrap shrink-0"
          >
            {world.worldTitle}
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onToggleFavourite(topic.id)}
            className={`min-h-[42px] px-4 py-2 rounded-2xl border-2 border-b-4 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              isFavourite
                ? 'bg-amber-400 border-amber-600 text-slate-950'
                : 'bg-white border-slate-200 hover:bg-amber-50 text-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavourite ? 'fill-slate-950' : ''}`} />
            {isFavourite ? 'Saved!' : 'Save'}
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() =>
              speakText(
                `${cleanTopicKeyword}. ${topic.objectives.join(' ')}`
              )
            }
            className="min-h-[42px] px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 border-2 border-sky-700 border-b-4 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            Listen
          </motion.button>
        </div>
      </div>

      {/* Topic Header & Playful 4-Stage Stepper */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
              <span>{world.worldTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{topic.year}</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {cleanTopicKeyword}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-extrabold text-amber-600 shrink-0 tabular-nums">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>{progress.stars}</span>
          </div>
        </div>

        {/* Continuous 4-Stage Playful Stepper */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" role="tablist" aria-label="Learning stages">
          {stages.map((s) => {
            const active = stage === s.key;
            return (
              <motion.button
                key={s.key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStage(s.key)}
                className={`min-h-[50px] px-4 py-2.5 rounded-2xl border-2 border-b-4 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  active
                    ? 'bg-sky-500 text-white border-sky-700 shadow-sm'
                    : s.done
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200/70'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs font-extrabold shrink-0">{s.num}.</span>
                  <span className="text-sm font-extrabold truncate">{s.label}</span>
                </div>
                {s.done && !active ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : (
                  <span className="shrink-0">{s.icon}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: WATCH & DISCOVER — No iframe, interactive clue cards, live mascot & playful outsourced buttons */}
      {stage === 'watch' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm">
          {/* Left: World Graphic + Interactive Tap-to-Unlock Mystery Clue Cards */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-sky-100 bg-sky-50">
              <WorldBannerIllustration
                worldKey={world.illustrationKey}
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl border border-sky-200 text-xs font-extrabold text-sky-800 shadow-xs">
                Stage 1 · Watch &amp; Discover
              </div>
              <div className="absolute bottom-3 right-3 bg-amber-400 px-3 py-1 rounded-xl border-2 border-amber-600 text-xs font-extrabold text-slate-950 shadow-xs tabular-nums">
                Clues: {revealedGoals.length}/{topic.objectives.length}
              </div>
            </div>

            {/* Interactive Tap-to-Reveal Clue Cards */}
            <div className="space-y-2.5">
              <p className="text-xs font-extrabold text-slate-600">
                Tap each clue card to unlock &amp; hear it:
              </p>
              <div className="space-y-2.5">
                {topic.objectives.map((obj, idx) => {
                  const unlocked = revealedGoals.includes(idx);
                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRevealGoal(idx, obj)}
                      className={`w-full min-h-[54px] px-4 py-3 rounded-2xl border-2 border-b-4 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        unlocked
                          ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                          : 'bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200 hover:border-sky-400 text-sky-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-xl font-heading font-extrabold text-sm flex items-center justify-center shrink-0 ${
                            unlocked
                              ? 'bg-emerald-500 text-white'
                              : 'bg-sky-500 text-white'
                          }`}
                        >
                          {unlocked ? '✓' : idx + 1}
                        </span>
                        <span className="text-sm font-bold leading-snug">
                          {unlocked ? obj : `Mystery Clue #${idx + 1} — Tap to reveal!`}
                        </span>
                      </div>
                      <Volume2 className="w-4 h-4 shrink-0 text-sky-600" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Playful Outsourced Resource Launch Tiles (Zero iframes) */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {outsourcedLinks.map((res) => (
                  <motion.a
                    key={res.id}
                    whileHover={{ y: -3, rotate: -1 }}
                    whileTap={{ scale: 0.94 }}
                    href={res.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      onStageWatchDone(topic.id);
                      onMascotUpdate('sparkle', `Have fun exploring ${res.label}! Come right back to Play!`);
                    }}
                    className={`min-h-[54px] px-3.5 py-2.5 rounded-2xl border-2 border-b-4 font-heading font-extrabold text-sm flex items-center justify-between gap-1.5 shadow-xs ${res.style}`}
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <span aria-hidden="true">{res.emoji}</span>
                      <span className="truncate">{res.label}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-90" />
                  </motion.a>
                ))}
              </div>
              <p className="text-[11px] font-semibold text-slate-400">
                External links open safely in a new tab.
              </p>
            </div>
          </div>

          {/* Right: Interactive Mascot Buddy + Mystery Fact + Big Playful CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 bg-gradient-to-b from-sky-50/70 to-indigo-50/50 border border-sky-200 rounded-3xl p-4 sm:p-5">
            <div className="space-y-3">
              <div className="-my-4">
                <FairyGuide
                  expression={mascotExpression}
                  message={mascotMessage}
                  companionId={progress.mascotId}
                  onCompanionClick={onCycleMascot}
                />
              </div>

              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setFactRevealed(true);
                  onMascotUpdate('sparkle', `Did you know? ${subjectFunFact.fact}`);
                  speakText(subjectFunFact.fact);
                }}
                className={`w-full p-4 rounded-2xl border-2 border-b-4 text-left cursor-pointer transition-colors ${
                  factRevealed
                    ? 'bg-amber-50 border-amber-300 text-slate-900'
                    : 'bg-white border-amber-300 hover:bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-extrabold text-sm flex items-center gap-2">
                    <Gift className="w-4 h-4 text-amber-600" />
                    {factRevealed ? subjectFunFact.title : 'Mystery Fun Fact!'}
                  </span>
                  <span className="text-xs font-extrabold text-amber-700">
                    {factRevealed ? '🔊' : 'Tap!'}
                  </span>
                </div>
                {factRevealed && (
                  <p className="text-xs font-medium text-slate-700 mt-1.5 leading-relaxed">
                    {subjectFunFact.fact}
                  </p>
                )}
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => {
                onStageWatchDone(topic.id);
                setStage('play');
                onMascotUpdate('excited', 'Time to play and practise!');
              }}
              className="min-h-[56px] w-full px-6 py-3.5 bg-gradient-to-r from-[#F97316] to-[#F59E0B] hover:from-[#EA580C] hover:to-[#D97706] border-2 border-orange-700 border-b-4 text-white font-heading font-extrabold text-base rounded-2xl shadow-md flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Play Activity!</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}

      {/* STAGE 2: PLAY – PRACTISE */}
      {stage === 'play' && (
        <PlayActivityStage
          topic={topic}
          isAlreadyPlayed={isPlayed}
          onCompletePlay={() => {
            onStagePlayDone(topic.id);
            onMascotUpdate('sparkle', 'Great practising! You earned Effort Stars!');
          }}
          onContinueToQuiz={() => setStage('test')}
        />
      )}

      {/* STAGE 3: TEST – CHALLENGE YOURSELF */}
      {stage === 'test' && (
        <InteractiveQuiz
          topic={topic}
          subject={subject}
          onClose={() => setStage('celebrate')}
          onQuizComplete={(score, total, starsEarned) => {
            onTopicQuizDone(topic.id, score, total, starsEarned);
          }}
          onOpenCertificate={() => onOpenCertificate(topic.title)}
          onExpressionChange={onMascotUpdate}
        />
      )}

      {/* STAGE 4: CELEBRATE & WHAT NEXT? */}
      {stage === 'celebrate' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center space-y-6">
          <motion.div
            animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto"
          >
            <Award className="w-9 h-9 text-amber-600" />
          </motion.div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Well done, {progress.explorerName || 'Explorer'}!
            </h2>
            <p className="text-sm text-slate-600">
              You explored, played and grew stronger today.
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-sky-50 border border-sky-200 rounded-2xl p-4 text-left space-y-1">
            <p className="text-xs font-extrabold text-sky-800">
              Fun Fact · {subjectFunFact.title}
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">{subjectFunFact.fact}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onOpenCertificate(topic.title)}
              className="min-h-[50px] px-5 py-3 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Certificate
            </motion.button>

            {nextTopicInWorld && (
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  onSelectTopic(nextTopicInWorld);
                  setStage('watch');
                }}
                className="min-h-[50px] px-5 py-3 bg-sky-500 hover:bg-sky-600 border-2 border-sky-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl flex items-center gap-2 cursor-pointer"
              >
                <span>Next Topic</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onBackToDashboard}
              className="min-h-[50px] px-5 py-3 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 border-b-4 text-slate-800 font-heading font-extrabold text-sm rounded-2xl flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              My Hub
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
