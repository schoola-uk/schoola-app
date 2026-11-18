import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  LayoutGrid,
  Mail,
  Play,
  Printer,
  RotateCcw,
  Search,
  Share2,
  ShoppingBag,
  Table2,
  Trash2,
  Tv,
  Youtube,
} from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { CURATED_YOUTUBE_VIDEOS, EDUCATION_CHANNELS, findMatchingYouTubeVideo } from '../data/youtubeVideos';
import {
  downloadSchoolTermsCalendar,
  downloadTopicRevisionEvent,
  getGoogleCalendarLink,
  UK_SCHOOL_TERMS_2026_2027,
} from '../utils/calendarSync';
import { CustomRevisionEvent, LearnerProgress, ParentView, Topic } from '../types';
import { NewsletterSubscription } from './NewsletterSubscription';
import { ParentSeasonalShopHub } from './ParentSeasonalShopHub';
import { ParentLeatherWalletNotebook } from './ParentLeatherWalletNotebook';
import { BADGES } from '../data/learningWorlds';

interface ParentTeacherHubProps {
  progress: LearnerProgress;
  weeklyChecklist: Record<string, boolean>;
  customEvents: CustomRevisionEvent[];
  onToggleChecklist: (key: string) => void;
  onAddCustomEvent: (evt: CustomRevisionEvent) => void;
  onRemoveCustomEvent: (id: string) => void;
  onOpenTopicInHub: (topic: Topic) => void;
  onOpenCertificate: (title: string) => void;
  onResetProgress: () => void;
  onSwitchToChild: () => void;
}

const YEAR_RAINBOW_STYLES: Record<
  string,
  { rowBg: string; border: string; pillBg: string; text: string }
> = {
  'Year 1': {
    rowBg: 'bg-rose-950/35',
    border: 'border-rose-800/60',
    pillBg: 'bg-rose-900/70',
    text: 'text-rose-200',
  },
  'Year 1–2': {
    rowBg: 'bg-rose-950/35',
    border: 'border-rose-800/60',
    pillBg: 'bg-rose-900/70',
    text: 'text-rose-200',
  },
  'Year 2': {
    rowBg: 'bg-amber-950/35',
    border: 'border-amber-800/60',
    pillBg: 'bg-amber-900/70',
    text: 'text-amber-200',
  },
  'Year 3': {
    rowBg: 'bg-yellow-950/35',
    border: 'border-yellow-800/60',
    pillBg: 'bg-yellow-900/70',
    text: 'text-yellow-200',
  },
  'Year 3–4': {
    rowBg: 'bg-yellow-950/35',
    border: 'border-yellow-800/60',
    pillBg: 'bg-yellow-900/70',
    text: 'text-yellow-200',
  },
  'Year 4': {
    rowBg: 'bg-emerald-950/35',
    border: 'border-emerald-800/60',
    pillBg: 'bg-emerald-900/70',
    text: 'text-emerald-200',
  },
  'Year 5': {
    rowBg: 'bg-sky-950/40',
    border: 'border-sky-800/60',
    pillBg: 'bg-sky-900/70',
    text: 'text-sky-200',
  },
  'Year 5–6': {
    rowBg: 'bg-sky-950/40',
    border: 'border-sky-800/60',
    pillBg: 'bg-sky-900/70',
    text: 'text-sky-200',
  },
  'Year 6': {
    rowBg: 'bg-violet-950/40',
    border: 'border-violet-800/60',
    pillBg: 'bg-violet-900/70',
    text: 'text-violet-200',
  },
};

export const ParentTeacherHub: React.FC<ParentTeacherHubProps> = ({
  progress,
  weeklyChecklist,
  customEvents,
  onToggleChecklist,
  onAddCustomEvent,
  onRemoveCustomEvent,
  onOpenTopicInHub,
  onOpenCertificate,
  onResetProgress,
  onSwitchToChild,
}) => {
  const [tab, setTab] = useState<ParentView>('overview');
  const [keyStageTab, setKeyStageTab] = useState<'all' | 'ks1' | 'ks2'>('all');
  const [curriculumViewMode, setCurriculumViewMode] = useState<'table' | 'cards'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [videoSubject, setVideoSubject] = useState<string>('All');
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);

  // Custom revision scheduler state
  const [schedulerTopicId, setSchedulerTopicId] = useState('');
  const [schedulerDate, setSchedulerDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [schedulerTime, setSchedulerTime] = useState('16:00');
  const [schedulerNotice, setSchedulerNotice] = useState<string | null>(null);

  // Calendar subscription & sync state (bottom of Calendar tab)
  const [calendarSubEmail, setCalendarSubEmail] = useState('');
  const [calendarSubSaved, setCalendarSubSaved] = useState(false);
  const [calendarFeedCopied, setCalendarFeedCopied] = useState(false);

  // End-of-page Reset Local Progress confirmation
  const [confirmReset, setConfirmReset] = useState(false);

  const filteredTopics = useMemo(() => {
    return TOPICS.filter((t) => {
      const isKs1 = t.year.includes('1') || t.year.includes('2');
      const isKs2 =
        t.year.includes('3') || t.year.includes('4') || t.year.includes('5') || t.year.includes('6');
      const matchKs =
        keyStageTab === 'all' || (keyStageTab === 'ks1' && isKs1) || (keyStageTab === 'ks2' && isKs2);
      const matchYear = yearFilter === 'All' || t.year.includes(yearFilter);
      const matchSubj = subjectFilter === 'All' || t.subjectId === subjectFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.subjectId.toLowerCase().includes(q) ||
        t.objectives.some((o) => o.toLowerCase().includes(q));
      return matchKs && matchYear && matchSubj && matchSearch;
    });
  }, [keyStageTab, yearFilter, subjectFilter, searchQuery]);

  const formatICSDateString = (dateStr: string) => {
    try {
      const year = dateStr.substring(0, 4);
      const monthIndex = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${day} ${MONTHS[monthIndex]} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleScheduleEvent = () => {
    if (!schedulerTopicId) {
      setSchedulerNotice('Please choose a topic from the list first.');
      return;
    }
    const topic = TOPICS.find((t) => t.id === schedulerTopicId);
    if (!topic) return;
    downloadTopicRevisionEvent(topic.title, schedulerDate, schedulerTime);
    onAddCustomEvent({
      id: `evt-${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      date: schedulerDate,
      time: schedulerTime,
    });
    setSchedulerNotice(`Saved study block for "${topic.title}" and downloaded .ics calendar file.`);
  };

  const handleShareOrCopyVideo = async (videoId: string, youtubeId: string, title: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share unavailable; fall back to copying link
      }
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedVideoId(videoId);
        window.setTimeout(() => {
          setCopiedVideoId((curr) => (curr === videoId ? null : curr));
        }, 2200);
      }
    } catch {
      // Ignore clipboard failures
    }
  };

  const tabs: { id: ParentView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Progress & Overview', icon: <Award className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum Directory', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Term Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'videos', label: 'Video Classroom', icon: <Youtube className="w-4 h-4" /> },
    { id: 'shopping', label: 'Seasonal Shop Picks', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  const unlockedBadgesCount = BADGES.filter((b) => b.checkUnlocked(progress)).length;

  return (
    <div className="w-full bg-[#090E1A] text-slate-100 min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-14 py-12 sm:py-16 space-y-16 text-left">
      {/* Compact Top Utility Bar (Main Folio Title is Gold-Engraved on Left Leather Wallet) */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400">
          <span className="font-heading font-extrabold text-sm text-white">
            Parent &amp; Teacher Hub
          </span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>UK National Curriculum (KS1 &amp; KS2)</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCertificate(`${progress.selectedYear} Learning Milestone`)}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>
          <button
            type="button"
            onClick={onSwitchToChild}
            className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            Switch to Child View
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2.5 p-2 bg-[#0F172A] border border-slate-800 rounded-2xl w-fit">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROGRESS & OVERVIEW — LARGE DARK BLUE LEATHER WALLET NOTEBOOK */}
      {tab === 'overview' && (
        <div className="space-y-14">
          <ParentLeatherWalletNotebook
            progress={progress}
            unlockedBadgesCount={unlockedBadgesCount}
            weeklyChecklist={weeklyChecklist}
            onSelectTab={setTab}
            onOpenTopicInHub={onOpenTopicInHub}
            onToggleChecklist={onToggleChecklist}
          />

          {/* Completed Topics Quick Review */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-7 sm:p-9 space-y-5">
            <h2 className="font-heading font-bold text-lg text-white">
              Completed Topics ({progress.completedTopics.length})
            </h2>
            {progress.completedTopics.length === 0 ? (
              <p className="text-sm text-slate-400 leading-relaxed">
                No topics completed yet. Switch to Child View or open the Curriculum Directory pocket card above to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-64 overflow-y-auto pr-1">
                {progress.completedTopics.map((tid) => {
                  const topic = TOPICS.find((t) => t.id === tid);
                  if (!topic) return null;
                  return (
                    <div
                      key={tid}
                      className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{topic.title}</p>
                        <p className="text-[11px] text-slate-400">
                          {topic.year} · Quiz best: {progress.quizScores[tid] ?? 0}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenTopicInHub(topic)}
                        className="text-xs font-bold text-sky-400 hover:underline shrink-0 cursor-pointer"
                      >
                        Open
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* UK Curriculum Trust & Video Classroom Banner */}
          <div className="bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#1E1B4B] border border-indigo-900/60 text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-rose-300">
                <Youtube className="w-4 h-4" />
                <span>Verified UK Video Lessons</span>
                <span aria-hidden="true">·</span>
                <span>All 12 Primary Subjects (KS1–KS2)</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl">
                Curated Video Classroom &amp; National Curriculum Directory
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Explore the full colour-coded KS1 &amp; KS2 curriculum table with instant topic-matched videos, BBC Bitesize guides, Twinkl worksheets, and Oak National Academy lessons.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setTab('curriculum')}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs cursor-pointer whitespace-nowrap"
              >
                Open KS1–KS2 Rainbow Table →
              </button>
              <button
                type="button"
                onClick={() => setTab('videos')}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                Open Video Classroom ({CURATED_YOUTUBE_VIDEOS.length}) →
              </button>
            </div>
          </div>

          {/* Upcoming Seasonal Shopping & Amazon Associates Teaser Banner */}
          <div
            data-amazon-panel="true"
            className="bg-white border-2 border-[#FF9900] text-[#0F1111] rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                <span className="px-2.5 py-0.5 rounded bg-[#232F3E] text-[#FFD814] inline-flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FF9900]" />
                  Amazon.co.uk Parents Shop
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#CC0C39] text-white">
                  Special All-Discounts Filter Inside
                </span>
                <span className="text-[#565959] font-semibold">
                  As an Amazon Associate I earn from qualifying purchases.
                </span>
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#0F1111]">
                Seasonal Shopping Bags, Christmas &amp; Gift Guides
              </h2>
              <p className="text-xs sm:text-sm text-[#565959] max-w-xl">
                Winter wear, teacher gifts, girls party picks, lunchboxes, sport bikes &amp; tablets — with live All-Discounts links.
              </p>
            </div>
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setTab('shopping')}
                className="min-h-[46px] px-6 py-2.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-extrabold text-xs inline-flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#C45500]" />
                Open Seasonal Bags &amp; Discounts →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FULL CURRICULUM DIRECTORY (Dark-Adapted Rainbow Year-Coded KS1/KS2 Table + Cards) */}
      {tab === 'curriculum' && (
        <div className="space-y-12">
          {/* Key Stage Tabs + View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 p-1 bg-[#0F172A] border border-slate-800 rounded-xl w-fit">
              {[
                { id: 'all' as const, label: 'All Years (1–6)' },
                { id: 'ks1' as const, label: 'Key Stage 1 (Years 1–2)' },
                { id: 'ks2' as const, label: 'Key Stage 2 (Years 3–6)' },
              ].map((ks) => (
                <button
                  key={ks.id}
                  type="button"
                  onClick={() => setKeyStageTab(ks.id)}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer whitespace-nowrap transition-colors ${
                    keyStageTab === ks.id
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ks.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#0F172A] border border-slate-800 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setCurriculumViewMode('table')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  curriculumViewMode === 'table'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                Rainbow Table
              </button>
              <button
                type="button"
                onClick={() => setCurriculumViewMode('cards')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  curriculumViewMode === 'cards'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
            </div>
          </div>

          {/* Search & Dropdown Filters */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, subject, or learning objective..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900 focus:bg-slate-950 focus:border-sky-500 focus:outline-none text-sm font-medium text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  aria-label="Filter by Year"
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200"
                >
                  <option value="All">All Years (1–6)</option>
                  {['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  aria-label="Filter by Subject"
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200"
                >
                  <option value="All">All 12 Subjects</option>
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Subject Filter Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSubjectFilter('All')}
                className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 border cursor-pointer ${
                  subjectFilter === 'All'
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                All Subjects
              </button>
              {SUBJECTS.map((s) => {
                const active = subjectFilter === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubjectFilter(s.id)}
                    className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 border cursor-pointer inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-sky-600 text-white border-sky-500'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span aria-hidden="true">{s.emoji}</span>
                    {s.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year Colour Key Legend + Count */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-slate-400 mr-1">Year colour key:</span>
              {(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'] as const).map((yr) => {
                const style = YEAR_RAINBOW_STYLES[yr];
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setYearFilter(yearFilter === yr ? 'All' : yr)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-transform hover:-translate-y-0.5 ${style.pillBg} ${style.border} ${style.text} ${
                      yearFilter === yr ? 'ring-2 ring-white/40' : ''
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-bold text-slate-400 tabular-nums shrink-0">
              Showing {filteredTopics.length} England National Curriculum topics
            </p>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 text-center space-y-2">
              <p className="font-heading font-bold text-base text-white">
                No topics matched your current filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setKeyStageTab('all');
                  setYearFilter('All');
                  setSubjectFilter('All');
                  setSearchQuery('');
                }}
                className="min-h-[38px] px-4 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : curriculumViewMode === 'table' ? (
            /* RAINBOW YEAR-CODED CURRICULUM TABLE */
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[780px]">
                  <thead>
                    <tr className="bg-slate-950 text-slate-200 text-xs font-bold border-b border-slate-800">
                      <th className="py-4 px-5 w-28">Year</th>
                      <th className="py-4 px-5 w-40">Subject</th>
                      <th className="py-4 px-5">Curriculum Topic &amp; Objectives</th>
                      <th className="py-4 px-5 w-72 text-right">Explore &amp; External Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-sm">
                    {filteredTopics.map((topic) => {
                      const cleanKeyword = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();
                      const style = YEAR_RAINBOW_STYLES[topic.year] || YEAR_RAINBOW_STYLES['Year 1'];
                      const subj = SUBJECTS.find((s) => s.id === topic.subjectId);
                      const isCompleted = progress.completedTopics.includes(topic.id);
                      const matchedVid = findMatchingYouTubeVideo(topic.subjectId, topic.id, cleanKeyword);
                      return (
                        <tr
                          key={topic.id}
                          className={`${style.rowBg} hover:bg-slate-800/70 transition-all`}
                        >
                          <td className="py-4 px-5 align-top">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-extrabold whitespace-nowrap ${style.pillBg} ${style.border} ${style.text}`}
                            >
                              {topic.year}
                            </span>
                          </td>
                          <td className="py-4 px-5 align-top">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 whitespace-nowrap">
                              <span aria-hidden="true">{subj?.emoji}</span>
                              {topic.subjectId}
                            </span>
                          </td>
                          <td className="py-4 px-5 align-top space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => onOpenTopicInHub(topic)}
                                className="font-heading font-bold text-sm text-white hover:text-sky-300 hover:underline text-left cursor-pointer"
                              >
                                {topic.title}
                              </button>
                              {isCompleted && (
                                <span className="text-[11px] font-bold text-emerald-400 whitespace-nowrap">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {topic.objectives[0]}
                            </p>
                          </td>
                          <td className="py-4 px-5 align-top">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onOpenTopicInHub(topic)}
                                className="min-h-[34px] px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                              >
                                Launch Hub
                              </button>
                              {matchedVid && (
                                <a
                                  href={`https://www.youtube.com/watch?v=${matchedVid.youtubeId}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={matchedVid.title}
                                  className="min-h-[34px] px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-700/60 hover:border-rose-400 text-xs font-bold text-rose-200 inline-flex items-center gap-1 whitespace-nowrap"
                                >
                                  Video <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <a
                                href={`https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(cleanKeyword)}&d=BITESIZE`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-sky-400 text-xs font-bold text-slate-200 inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                BBC <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://www.twinkl.co.uk/search?term=${encodeURIComponent(cleanKeyword)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-400 text-xs font-bold text-slate-200 inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                Twinkl <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://www.thenational.academy/teachers/search?term=${encodeURIComponent(cleanKeyword)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-xs font-bold text-slate-200 inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                Oak <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CARD VIEW OPTION */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredTopics.map((topic) => {
                const cleanKeyword = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();
                const style = YEAR_RAINBOW_STYLES[topic.year] || YEAR_RAINBOW_STYLES['Year 1'];
                const matchedVid = findMatchingYouTubeVideo(topic.subjectId, topic.id, cleanKeyword);
                return (
                  <div
                    key={topic.id}
                    className={`${style.rowBg} border ${style.border} rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span>
                          {topic.subjectId} · {topic.year}
                        </span>
                        {progress.completedTopics.includes(topic.id) && (
                          <span className="text-emerald-400 font-bold">✓ Completed</span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {topic.title}
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {topic.objectives.slice(0, 2).map((o, i) => (
                          <li key={i}>• {o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTopicInHub(topic)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Launch in Learning Hub
                      </button>

                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-300 flex-wrap">
                        {matchedVid && (
                          <a
                            href={`https://www.youtube.com/watch?v=${matchedVid.youtubeId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-rose-300 hover:underline inline-flex items-center gap-1"
                          >
                            Video <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <a
                          href={`https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(cleanKeyword)}&d=BITESIZE`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-sky-300 inline-flex items-center gap-1"
                        >
                          BBC <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://www.twinkl.co.uk/search?term=${encodeURIComponent(cleanKeyword)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-300 inline-flex items-center gap-1"
                        >
                          Twinkl <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://www.thenational.academy/teachers/search?term=${encodeURIComponent(cleanKeyword)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-300 inline-flex items-center gap-1"
                        >
                          Oak <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TERM CALENDAR & SCHEDULER */}
      {tab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800 rounded-3xl p-7 sm:p-9 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="font-heading font-bold text-lg text-white">
                  England Primary Term Dates 2026/2027
                </h2>
                <p className="text-xs text-slate-400">
                  Download all term dates and school holidays as a standard .ics calendar file.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSchoolTermsCalendar}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                Download All Terms (.ics)
              </button>
            </div>

            <div className="space-y-4">
              {UK_SCHOOL_TERMS_2026_2027.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{evt.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{evt.description}</p>
                  </div>
                  <span className="text-xs font-mono text-sky-300 flex items-center gap-1 shrink-0 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {formatICSDateString(evt.startDate)} – {formatICSDateString(evt.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8 lg:space-y-10">
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-7 sm:p-9 space-y-5">
              <h2 className="font-heading font-bold text-lg text-white">
                Schedule a Study Block
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="sched-topic" className="block text-xs font-bold text-slate-300 mb-1">
                    Topic
                  </label>
                  <select
                    id="sched-topic"
                    value={schedulerTopicId}
                    onChange={(e) => setSchedulerTopicId(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white"
                  >
                    <option value="">Choose a topic...</option>
                    {TOPICS.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.year}] {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="sched-date" className="block text-xs font-bold text-slate-300 mb-1">
                      Date
                    </label>
                    <input
                      id="sched-date"
                      type="date"
                      value={schedulerDate}
                      onChange={(e) => setSchedulerDate(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="sched-time" className="block text-xs font-bold text-slate-300 mb-1">
                      Time
                    </label>
                    <input
                      id="sched-time"
                      type="time"
                      value={schedulerTime}
                      onChange={(e) => setSchedulerTime(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScheduleEvent}
                  className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save &amp; Download Reminder (.ics)
                </button>

                {schedulerTopicId && (
                  <a
                    href={getGoogleCalendarLink(
                      TOPICS.find((t) => t.id === schedulerTopicId)?.title || '',
                      schedulerDate,
                      schedulerTime
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[40px] w-full px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5"
                  >
                    Add to Google Calendar <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {schedulerNotice && (
                  <p className="text-xs font-semibold text-emerald-400">{schedulerNotice}</p>
                )}
              </div>
            </div>

            {customEvents.length > 0 && (
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-7 sm:p-8 space-y-4">
                <h3 className="font-heading font-bold text-base text-white">
                  Saved Study Blocks
                </h3>
                {customEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{evt.topicTitle}</p>
                      <p className="text-[11px] font-mono text-slate-400">
                        {evt.date} · {evt.time}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomEvent(evt.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 cursor-pointer"
                      aria-label="Remove scheduled study block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Full-Width Calendar Subscription & Sync Our Calendars Field */}
          <div className="lg:col-span-12 bg-gradient-to-br from-[#0F172A] via-[#13223D] to-[#0F172A] border border-sky-800/60 rounded-3xl p-7 sm:p-9 space-y-5 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Calendar Subscription &amp; Sync Our Calendars
                </p>
                <h3 className="font-heading font-extrabold text-xl text-white">
                  Sync UK School Term Dates &amp; Weekly Study Reminders
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Subscribe with your email for half-term and holiday alerts, or sync the 2026/2027 academic calendar directly into Apple Calendar, Google Calendar, or Outlook.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={downloadSchoolTermsCalendar}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  Download .ics Calendar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const feedUrl = 'webcal://schoola.uk/calendars/uk-primary-terms-2026-2027.ics';
                    try {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        await navigator.clipboard.writeText(feedUrl);
                      }
                    } catch {
                      // Ignore clipboard failures
                    }
                    setCalendarFeedCopied(true);
                    window.setTimeout(() => setCalendarFeedCopied(false), 2500);
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {calendarFeedCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied webcal:// Sync URL
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sky-400" />
                      Copy Sync URL (webcal://)
                    </>
                  )}
                </button>
                <a
                  href={getGoogleCalendarLink('UK School Term & Weekly Revision Check-in')}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  Sync Google Calendar <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {!calendarSubSaved ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!calendarSubEmail.trim() || !calendarSubEmail.includes('@')) return;
                  setCalendarSubSaved(true);
                }}
                className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-800"
              >
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={calendarSubEmail}
                    onChange={(e) => setCalendarSubEmail(e.target.value)}
                    placeholder="Enter parent email for calendar updates & half-term reminders..."
                    className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-slate-700 bg-slate-900 focus:border-sky-500 focus:outline-none text-sm font-medium text-white placeholder:text-slate-500"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                >
                  Subscribe to Calendar Alerts
                </button>
              </form>
            ) : (
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>
                  Calendar subscription saved for {calendarSubEmail} — UK school terms &amp; half-term reminders are synced.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CURATED VIDEO CLASSROOM */}
      {tab === 'videos' && (
        <div className="space-y-12">
          {/* Verified Video Classroom Banner */}
          <div className="bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#312E81] border border-indigo-900/50 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 lg:gap-10">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Youtube className="w-4 h-4" />
                Verified UK Primary Video Links · {CURATED_YOUTUBE_VIDEOS.length} Lessons (KS1–KS2)
              </p>
              <h2 className="font-heading font-extrabold text-xl">
                Curated UK Primary Video Classroom
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Videos open in your external player or YouTube app instead of playing on this website — ideal for watching on a phone or casting and screen-sharing to your TV.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700 text-xs font-semibold text-sky-300">
                <Tv className="w-3.5 h-3.5" />
                External Player &amp; TV Ready
              </span>
              <a
                href="https://www.youtube.com/@bbcteach"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                Browse @bbcteach <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {['All', ...SUBJECTS.map((s) => s.id)].map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setVideoSubject(subj)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  videoSubject === subj
                    ? 'bg-sky-500 text-slate-950 border-sky-400'
                    : 'bg-[#0F172A] text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
            {CURATED_YOUTUBE_VIDEOS.filter(
              (v) => videoSubject === 'All' || v.subjectId === videoSubject
            ).map((video) => {
              const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
              const isCopied = copiedVideoId === video.id;
              return (
                <div
                  key={video.id}
                  className="bg-[#0F172A] border border-slate-800 hover:border-sky-500/60 transition-colors rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open "${video.title}" in external video player`}
                      className="block aspect-video bg-slate-950 relative overflow-hidden group"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/85 text-[10px] font-bold text-sky-300 border border-slate-700/80 inline-flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" />
                        External Player
                      </span>
                    </a>
                    <div className="p-5 sm:p-6 space-y-2">
                      <p className="text-xs font-semibold text-sky-400">
                        {video.subjectId} · {video.channelName} · {video.duration}
                      </p>
                      <h3 className="font-heading font-bold text-sm text-white">{video.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{video.description}</p>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 pt-0 flex items-center gap-3">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-h-[42px] px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open in External Player
                    </a>
                    <button
                      type="button"
                      onClick={() => handleShareOrCopyVideo(video.id, video.youtubeId, video.title)}
                      className={`min-h-[42px] px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isCopied
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200'
                      }`}
                      aria-label={`Share or copy link for ${video.title} to cast to TV`}
                      title="Share link to phone player or copy for TV casting"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          Cast
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-7 sm:p-9 space-y-6">
            <h3 className="font-heading font-bold text-base text-white">
              Trusted UK Primary Educational Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {EDUCATION_CHANNELS.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500 hover:bg-slate-800/80 transition-colors space-y-1.5 block"
                >
                  <p className="font-bold text-sm text-white flex items-center justify-between gap-2">
                    <span>
                      {ch.logo} {ch.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </p>
                  <p className="text-xs text-sky-400 font-mono">{ch.handle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{ch.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: UPCOMING SEASONAL SHOPPING & AMAZON ASSOCIATES HUB */}
      {tab === 'shopping' && <ParentSeasonalShopHub />}

      {/* FREE WEEKLY NEWSLETTER SECTION — PROMINENTLY INSIDE DARK PARENTS PORTAL */}
      <div className="pt-8">
        <NewsletterSubscription
          onSubscribeSuccess={() => {
            // Handled inside NewsletterSubscription state
          }}
        />
      </div>

      {/* END-OF-PAGE LOCAL PROGRESS RESET (Used only when needed to erase local data) */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            Reset Local Progress
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            All stars, badges, completed topics, and study blocks are stored only on this device. Use this only if you need to erase saved data and start fresh.
          </p>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Local Progress
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="text-xs font-bold text-rose-300">Erase all saved data?</span>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold cursor-pointer"
            >
              Yes, Erase Data
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
