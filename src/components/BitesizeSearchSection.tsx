import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Gamepad2,
  HelpCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { Topic } from '../types';
import { playChimeSound } from './CorridorWidgets';

interface BitesizeSearchSectionProps {
  onOpenTopic: (topic: Topic) => void;
  onEarnStar: () => void;
}

type StageFilter = 'all' | 'KS1' | 'KS2';
type FormatFilter = 'all' | 'guide' | 'quiz' | 'game' | 'bbc';

const QUICK_BITESIZE_CHIPS = [
  { label: 'Everyday Materials', query: 'everyday materials', emoji: '🧱' },
  { label: 'Plants', query: 'plants', emoji: '🌱' },
  { label: 'Times Tables', query: 'multiplication', emoji: '✖️' },
  { label: 'Phonics', query: 'phonics', emoji: '📖' },
  { label: 'Romans', query: 'romans', emoji: '🏛️' },
  { label: 'Space', query: 'space', emoji: '🪐' },
];

interface MaterialChallenge {
  id: string;
  objectEmoji: string;
  objectName: string;
  options: string[];
  correctMaterial: string;
  propertyTag: string;
}

const MATERIAL_CARDS: MaterialChallenge[] = [
  {
    id: 'window',
    objectEmoji: '🪟',
    objectName: 'Window',
    options: ['Glass', 'Wood', 'Fabric'],
    correctMaterial: 'Glass',
    propertyTag: 'Transparent',
  },
  {
    id: 'umbrella',
    objectEmoji: '☂️',
    objectName: 'Umbrella',
    options: ['Paper', 'Waterproof Plastic', 'Chalk'],
    correctMaterial: 'Waterproof Plastic',
    propertyTag: 'Waterproof',
  },
  {
    id: 'spoon',
    objectEmoji: '🥄',
    objectName: 'Spoon',
    options: ['Metal', 'Wool', 'Ice'],
    correctMaterial: 'Metal',
    propertyTag: 'Strong & Rigid',
  },
  {
    id: 'table',
    objectEmoji: '🪑',
    objectName: 'Classroom Chair',
    options: ['Water', 'Wood', 'Air'],
    correctMaterial: 'Wood',
    propertyTag: 'Hard & Sturdy',
  },
];

function getKeyStage(year: string): 'KS1' | 'KS2' {
  if (year.includes('1') || year.includes('2')) return 'KS1';
  return 'KS2';
}

export const BitesizeSearchSection: React.FC<BitesizeSearchSectionProps> = ({
  onOpenTopic,
  onEarnStar,
}) => {
  const [query, setQuery] = useState('everyday materials');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
  const [matchedMaterials, setMatchedMaterials] = useState<Record<string, boolean>>({});
  const [labRewarded, setLabRewarded] = useState(false);

  const bbcSearchUrl = `https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(
    query.trim() || 'everyday materials'
  )}&d=BITESIZE`;

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    const list = TOPICS.filter((topic) => {
      const ks = getKeyStage(topic.year);
      if (stageFilter !== 'all' && ks !== stageFilter) return false;

      if (formatFilter === 'quiz' && (!topic.quiz || topic.quiz.length === 0)) {
        return false;
      }

      if (tokens.length === 0) return true;

      const haystack = `${topic.title} ${topic.subjectId} ${topic.year} ${topic.objectives.join(' ')}`.toLowerCase();
      // Match all words OR fallback to any meaningful keyword match for friendly Bitesize search
      return (
        tokens.every((tok) => haystack.includes(tok)) ||
        tokens.some((tok) => tok.length > 3 && haystack.includes(tok))
      );
    });

    // Prioritize exact full-phrase matches first (e.g. "everyday materials")
    return list
      .sort((a, b) => {
        const aText = `${a.title} ${a.objectives.join(' ')}`.toLowerCase();
        const bText = `${b.title} ${b.objectives.join(' ')}`.toLowerCase();
        const aExact = q && aText.includes(q) ? 1 : 0;
        const bExact = q && bText.includes(q) ? 1 : 0;
        return bExact - aExact;
      })
      .slice(0, 6);
  }, [query, stageFilter, formatFilter]);

  const handleMaterialPick = (card: MaterialChallenge, picked: string) => {
    if (matchedMaterials[card.id]) return;
    if (picked === card.correctMaterial) {
      playChimeSound('success');
      const next = { ...matchedMaterials, [card.id]: true };
      setMatchedMaterials(next);
      if (Object.keys(next).length === MATERIAL_CARDS.length && !labRewarded) {
        setLabRewarded(true);
        onEarnStar();
      }
    } else {
      playChimeSound('fail');
    }
  };

  const matchedCount = Object.keys(matchedMaterials).length;

  return (
    <section
      aria-labelledby="bitesize-search-heading"
      className="w-full bg-gradient-to-b from-[#FEF3C7]/65 via-[#FFFBEB] to-white py-8 sm:py-10 px-4 sm:px-8 lg:px-12 border-b border-amber-200 space-y-6"
    >
      {/* Title + Direct BBC Bitesize Search Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200/70 text-amber-950 text-xs font-playful font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>UK Curriculum Topic Finder</span>
          </div>
          <h2 id="bitesize-search-heading" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900">
            <span className="text-amber-600">Search</span>{' '}
            <span className="text-sky-600">Topics</span> &amp;{' '}
            <span className="text-emerald-600">Everyday Materials</span>
          </h2>
        </div>

        <a
          href={bbcSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] px-5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border-b-4 border-slate-700 text-white font-playful font-bold text-sm inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start md:self-auto shadow-sm transition-transform active:translate-y-0.5"
        >
          <span>Open on BBC Bitesize</span>
          <ExternalLink className="w-4 h-4 text-amber-300" />
        </a>
      </div>

      {/* Bitesize-Style Search Bar + Stage & Format Filters */}
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search UK topics (e.g. "everyday materials", "fractions", "phonics")...'
              aria-label="Search curriculum topics"
              className="w-full min-h-[48px] pl-12 pr-11 py-2.5 rounded-2xl bg-amber-50/70 border-2 border-amber-200 focus:border-sky-500 focus:bg-white focus:outline-none font-playful font-semibold text-base text-slate-900"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="w-8 h-8 rounded-full bg-amber-200/70 hover:bg-amber-300 text-amber-900 flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Key Stage Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                { id: 'all', label: 'All Years' },
                { id: 'KS1', label: 'KS1 · Y1–2' },
                { id: 'KS2', label: 'KS2 · Y3–6' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStageFilter(st.id)}
                className={`min-h-[44px] px-4 py-1.5 rounded-2xl border-2 border-b-4 text-xs sm:text-sm font-playful font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  stageFilter === st.id
                    ? 'bg-sky-600 border-sky-800 text-white'
                    : 'bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Topic Chips + Format Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mr-1">
              Popular:
            </span>
            {QUICK_BITESIZE_CHIPS.map((chip) => {
              const active = query.trim().toLowerCase() === chip.query;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setQuery(chip.query)}
                  className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-playful font-bold border-2 cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  <span aria-hidden="true">{chip.emoji}</span>
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(
              [
                { id: 'all', label: 'All Types' },
                { id: 'guide', label: 'Guides' },
                { id: 'game', label: 'Games' },
                { id: 'quiz', label: 'Quizzes' },
                { id: 'bbc', label: 'BBC Links' },
              ] as const
            ).map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setFormatFilter(fmt.id)}
                className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  formatFilter === fmt.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Split: Search Result Cards + Interactive Everyday Materials Mini-Lab */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left/Main: Bitesize-Style Search Result Cards */}
        <div className="xl:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-bold text-slate-600 text-left">
              Showing <span className="text-slate-900 font-extrabold">{searchResults.length}</span>{' '}
              curriculum guides{query ? ` for "${query}"` : ''}
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-amber-300 rounded-3xl p-8 text-center space-y-3">
              <p className="font-playful font-bold text-lg text-slate-800">
                No local guides matched &ldquo;{query}&rdquo; — try searching BBC Bitesize directly!
              </p>
              <a
                href={bbcSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 text-white font-playful font-bold text-sm"
              >
                Search &ldquo;{query}&rdquo; on BBC Bitesize
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchResults.map((topic) => {
                const subj = SUBJECTS.find((s) => s.id === topic.subjectId) || SUBJECTS[0];
                const ks = getKeyStage(topic.year);
                const cleanTitle = topic.title.replace(/^[^:—]+[:—]\s*/, '');
                const topicBbcUrl = `https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(
                  cleanTitle
                )}&d=BITESIZE`;

                return (
                  <motion.div
                    key={topic.id}
                    whileHover={{ y: -3 }}
                    className="bg-white border-2 border-slate-200 hover:border-sky-400 rounded-3xl p-4 shadow-sm flex flex-col justify-between gap-3 text-left transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg border"
                            style={{ backgroundColor: subj.bg, borderColor: subj.borderColor }}
                          >
                            {subj.emoji}
                          </span>
                          <span className="text-xs font-extrabold text-slate-700">
                            {topic.subjectId}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                              ks === 'KS1'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {ks} · {topic.year}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-playful font-bold text-lg text-slate-900 leading-snug">
                        {cleanTitle}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {topic.objectives[0]}
                      </p>

                      {/* Bitesize Resource Format Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 text-[10px] font-extrabold">
                          <BookOpen className="w-3 h-3" /> Guide
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                          <Gamepad2 className="w-3 h-3" /> Game
                        </span>
                        {topic.quiz && topic.quiz.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 text-[10px] font-extrabold">
                            <HelpCircle className="w-3 h-3" /> Quiz
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onOpenTopic(topic)}
                        className="flex-1 min-h-[40px] px-3.5 py-1.5 rounded-2xl bg-sky-500 hover:bg-sky-600 border-b-3 border-sky-700 text-white font-playful font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                      >
                        <span>Learn &amp; Play</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={topicBbcUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[40px] px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-b-3 border-amber-300 text-amber-950 font-playful font-bold text-xs inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        title="Open related guides on BBC Bitesize"
                      >
                        <span>BBC</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Interactive Everyday Materials Quick-Lab (inspired by BBC Bitesize KS1 Science) */}
        <div className="xl:col-span-4 bg-white border-2 border-emerald-300 border-b-4 rounded-3xl p-5 shadow-md space-y-4 text-left">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                KS1 Science Mini-Lab
              </span>
              <h3 className="font-playful font-bold text-xl text-slate-900">
                🧱 Everyday Materials Match
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-playful font-bold text-xs tabular-nums">
              {matchedCount}/{MATERIAL_CARDS.length}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-600">
            Tap what each everyday object is made from — match all 4 to win a Star!
          </p>

          <div className="space-y-3">
            {MATERIAL_CARDS.map((card) => {
              const solved = matchedMaterials[card.id];
              return (
                <div
                  key={card.id}
                  className={`rounded-2xl p-3 border-2 transition-colors ${
                    solved
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-playful font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="text-lg">{card.objectEmoji}</span>
                      <span>{card.objectName}</span>
                    </span>
                    {solved && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {card.propertyTag}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {card.options.map((opt) => {
                      const isCorrectOpt = solved && opt === card.correctMaterial;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={solved}
                          onClick={() => handleMaterialPick(card, opt)}
                          className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-playful font-bold border-2 cursor-pointer transition-all ${
                            isCorrectOpt
                              ? 'bg-emerald-500 border-emerald-700 text-white'
                              : solved
                              ? 'bg-white/60 border-slate-200 text-slate-400 cursor-default'
                              : 'bg-white border-slate-300 hover:border-sky-400 hover:bg-sky-50 text-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {labRewarded && (
            <div className="rounded-2xl bg-amber-100 border-2 border-amber-300 px-4 py-2.5 text-center font-playful font-bold text-sm text-amber-950">
              ⭐ Brilliant material scientist! +1 Star earned!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
