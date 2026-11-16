import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  LayoutGrid,
  Lock,
  Play,
  Printer,
  RotateCcw,
  Search,
  ShieldCheck,
  Table2,
  Trash2,
  Youtube,
} from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { CURATED_YOUTUBE_VIDEOS, EDUCATION_CHANNELS } from '../data/youtubeVideos';
import {
  downloadSchoolTermsCalendar,
  downloadTopicRevisionEvent,
  getGoogleCalendarLink,
  UK_SCHOOL_TERMS_2026_2027,
} from '../utils/calendarSync';
import { CustomRevisionEvent, LearnerProgress, ParentView, Topic } from '../types';
import { NewsletterSubscription } from './NewsletterSubscription';
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
    rowBg: 'bg-[#FFF5F5]',
    border: 'border-[#FECACA]',
    pillBg: 'bg-[#FEE2E2]',
    text: 'text-[#991B1B]',
  },
  'Year 1–2': {
    rowBg: 'bg-[#FFF5F5]',
    border: 'border-[#FECACA]',
    pillBg: 'bg-[#FEE2E2]',
    text: 'text-[#991B1B]',
  },
  'Year 2': {
    rowBg: 'bg-[#FFF8EF]',
    border: 'border-[#FED7AA]',
    pillBg: 'bg-[#FFEDD5]',
    text: 'text-[#9A3412]',
  },
  'Year 3': {
    rowBg: 'bg-[#FFFDF0]',
    border: 'border-[#FEF08A]',
    pillBg: 'bg-[#FEF9C3]',
    text: 'text-[#854D0E]',
  },
  'Year 3–4': {
    rowBg: 'bg-[#FFFDF0]',
    border: 'border-[#FEF08A]',
    pillBg: 'bg-[#FEF9C3]',
    text: 'text-[#854D0E]',
  },
  'Year 4': {
    rowBg: 'bg-[#F2FBF5]',
    border: 'border-[#BBF7D0]',
    pillBg: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
  },
  'Year 5': {
    rowBg: 'bg-[#F2F7FF]',
    border: 'border-[#BFDBFE]',
    pillBg: 'bg-[#DBEAFE]',
    text: 'text-[#1E40AF]',
  },
  'Year 5–6': {
    rowBg: 'bg-[#F2F7FF]',
    border: 'border-[#BFDBFE]',
    pillBg: 'bg-[#DBEAFE]',
    text: 'text-[#1E40AF]',
  },
  'Year 6': {
    rowBg: 'bg-[#F8F5FF]',
    border: 'border-[#DDD6FE]',
    pillBg: 'bg-[#EDE9FE]',
    text: 'text-[#5B21B6]',
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
  const [theaterVideo, setTheaterVideo] = useState<{ id: string; title: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Custom revision scheduler state
  const [schedulerTopicId, setSchedulerTopicId] = useState('');
  const [schedulerDate, setSchedulerDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [schedulerTime, setSchedulerTime] = useState('16:00');
  const [schedulerNotice, setSchedulerNotice] = useState<string | null>(null);

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

  const tabs: { id: ParentView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Progress & Overview', icon: <Award className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum Directory', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'calendar', label: 'Term Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'videos', label: 'Video Classroom', icon: <Youtube className="w-4 h-4" /> },
    { id: 'safeguarding', label: 'Privacy & Safeguarding', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  const unlockedBadgesCount = BADGES.filter((b) => b.checkUnlocked(progress)).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-700">
            <span>Parent &amp; Teacher Hub</span>
            <span aria-hidden="true">·</span>
            <span>Aligned to England&apos;s National Curriculum (KS1 &amp; KS2)</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Support learning with clarity and trust
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Track your child&apos;s progress saved locally on this device, search all 64 curriculum topics across 12 subjects, sync UK school terms, and review external resources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenCertificate(`${progress.selectedYear} Learning Milestone`)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>
          <button
            type="button"
            onClick={onSwitchToChild}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
          >
            Switch to Child View
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROGRESS & OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Progress Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-xs font-bold text-slate-500 block">Selected Year</span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 mt-1 block">
                {progress.selectedYear}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-xs font-bold text-slate-500 block">Topics Completed</span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 mt-1 block tabular-nums">
                {progress.completedTopics.length} / {TOPICS.length}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-xs font-bold text-slate-500 block">Stars &amp; Badges</span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 mt-1 block tabular-nums">
                {progress.stars} ★ · {unlockedBadgesCount} badges
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <span className="text-xs font-bold text-slate-500 block">Learning Streak</span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 mt-1 block tabular-nums">
                {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Home Learning Routine Checklist */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  Home Learning Routine Checklist
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Short, calm 10–15 minute sessions work best for primary learners aged 5–11.
                </p>
              </div>
              <div className="space-y-2.5">
                {[
                  { key: 'read_15', label: '15 minutes of reading or phonics together' },
                  { key: 'watch_video', label: 'Watch one curriculum video in the Learning Hub' },
                  { key: 'do_quiz', label: 'Complete one Play & Test interactive challenge' },
                  { key: 'maths_10', label: '10 minutes of number bonds or times tables practice' },
                ].map((item) => {
                  const checked = Boolean(weeklyChecklist[item.key]);
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onToggleChecklist(item.key)}
                      className={`w-full min-h-[48px] p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        checked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span className="text-sm font-semibold">{item.label}</span>
                      <CheckCircle2
                        className={`w-5 h-5 shrink-0 ${
                          checked ? 'text-emerald-600' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Completed Topics & Quick Launch */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Completed Topics ({progress.completedTopics.length})
              </h2>
              {progress.completedTopics.length === 0 ? (
                <p className="text-sm text-slate-500 leading-relaxed">
                  No topics completed yet. Switch to Child View or launch any topic from the Curriculum Directory to get started.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {progress.completedTopics.map((tid) => {
                    const topic = TOPICS.find((t) => t.id === tid);
                    if (!topic) return null;
                    return (
                      <div
                        key={tid}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{topic.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {topic.year} · Quiz best: {progress.quizScores[tid] ?? 0}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenTopicInHub(topic)}
                          className="text-xs font-bold text-sky-700 hover:underline shrink-0 cursor-pointer"
                        >
                          Open
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* UK Curriculum Trust & YouTube @schoolauk Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-rose-300">
                <Youtube className="w-4 h-4" />
                <span>@schoolauk</span>
                <span aria-hidden="true">·</span>
                <span>200+ Free Curriculum Videos (KS1–KS2)</span>
              </div>
              <h2 className="font-heading font-extrabold text-xl">
                Schoola on YouTube &amp; National Curriculum Directory
              </h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Explore the full colour-coded KS1 &amp; KS2 curriculum table with instant links to interactive Schoola Learning Hubs, BBC Teach, Twinkl, and Oak National Academy.
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
              <a
                href="https://www.youtube.com/@schoolauk"
                target="_blank"
                rel="noreferrer"
                className="min-h-[42px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                Visit @schoolauk <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <NewsletterSubscription
            onSubscribeSuccess={() => {
              // Handled inside NewsletterSubscription state
            }}
          />
        </div>
      )}

      {/* TAB 2: FULL CURRICULUM DIRECTORY (Rainbow Year-Coded KS1/KS2 Table + Cards) */}
      {tab === 'curriculum' && (
        <div className="space-y-5">
          {/* Key Stage Tabs + View Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
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
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ks.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setCurriculumViewMode('table')}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  curriculumViewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
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
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Cards
              </button>
            </div>
          </div>

          {/* Search & Dropdown Filters */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic, subject, or learning objective..."
                  className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:outline-none text-sm font-medium text-slate-800"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  aria-label="Filter by Year"
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
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
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
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
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
                        ? 'bg-sky-600 text-white border-sky-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
              <span className="text-slate-500 mr-1">Year colour key:</span>
              {(['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'] as const).map((yr) => {
                const style = YEAR_RAINBOW_STYLES[yr];
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setYearFilter(yearFilter === yr ? 'All' : yr)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-transform hover:-translate-y-0.5 ${style.pillBg} ${style.border} ${style.text} ${
                      yearFilter === yr ? 'ring-2 ring-slate-900/25' : ''
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-bold text-slate-600 tabular-nums shrink-0">
              Showing {filteredTopics.length} England National Curriculum topics
            </p>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-2">
              <p className="font-heading font-bold text-base text-slate-900">
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
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[780px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs font-bold">
                      <th className="py-3.5 px-4 w-28">Year</th>
                      <th className="py-3.5 px-4 w-40">Subject</th>
                      <th className="py-3.5 px-4">Curriculum Topic &amp; Objectives</th>
                      <th className="py-3.5 px-4 w-72 text-right">Explore &amp; External Links</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 text-sm">
                    {filteredTopics.map((topic) => {
                      const cleanKeyword = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();
                      const style = YEAR_RAINBOW_STYLES[topic.year] || YEAR_RAINBOW_STYLES['Year 1'];
                      const subj = SUBJECTS.find((s) => s.id === topic.subjectId);
                      const isCompleted = progress.completedTopics.includes(topic.id);
                      return (
                        <tr
                          key={topic.id}
                          className={`${style.rowBg} hover:brightness-[0.98] transition-all`}
                        >
                          <td className="py-3.5 px-4 align-top">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg border text-xs font-extrabold whitespace-nowrap ${style.pillBg} ${style.border} ${style.text}`}
                            >
                              {topic.year}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 whitespace-nowrap">
                              <span aria-hidden="true">{subj?.emoji}</span>
                              {topic.subjectId}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 align-top space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => onOpenTopicInHub(topic)}
                                className="font-heading font-bold text-sm text-slate-900 hover:text-sky-700 hover:underline text-left cursor-pointer"
                              >
                                {topic.title}
                              </button>
                              {isCompleted && (
                                <span className="text-[11px] font-bold text-emerald-700 whitespace-nowrap">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {topic.objectives[0]}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 align-top">
                            <div className="flex flex-wrap items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => onOpenTopicInHub(topic)}
                                className="min-h-[34px] px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap"
                              >
                                Launch Hub
                              </button>
                              <a
                                href={`https://www.bbc.co.uk/search?q=%22${encodeURIComponent(cleanKeyword)}%22&d=search_ps`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-400 text-xs font-bold text-slate-700 inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                BBC <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://www.twinkl.co.uk/search?term=${encodeURIComponent(cleanKeyword)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 text-xs font-bold text-slate-700 inline-flex items-center gap-1 whitespace-nowrap"
                              >
                                Twinkl <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://www.thenational.academy/search?q=${encodeURIComponent(cleanKeyword)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-amber-400 text-xs font-bold text-slate-700 inline-flex items-center gap-1 whitespace-nowrap"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => {
                const cleanKeyword = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();
                const style = YEAR_RAINBOW_STYLES[topic.year] || YEAR_RAINBOW_STYLES['Year 1'];
                return (
                  <div
                    key={topic.id}
                    className={`${style.rowBg} border ${style.border} rounded-2xl p-5 flex flex-col justify-between gap-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>
                          {topic.subjectId} · {topic.year}
                        </span>
                        {progress.completedTopics.includes(topic.id) && (
                          <span className="text-emerald-700 font-bold">✓ Completed</span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-base text-slate-900">
                        {topic.title}
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-700">
                        {topic.objectives.slice(0, 2).map((o, i) => (
                          <li key={i}>• {o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenTopicInHub(topic)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Launch in Learning Hub
                      </button>

                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
                        <a
                          href={`https://www.bbc.co.uk/search?q=%22${encodeURIComponent(cleanKeyword)}%22&d=search_ps`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-sky-700 inline-flex items-center gap-1"
                        >
                          BBC <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://www.twinkl.co.uk/search?term=${encodeURIComponent(cleanKeyword)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-emerald-700 inline-flex items-center gap-1"
                        >
                          Twinkl <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://www.thenational.academy/search?q=${encodeURIComponent(cleanKeyword)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-700 inline-flex items-center gap-1"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  England Primary Term Dates 2026/2027
                </h2>
                <p className="text-xs text-slate-500">
                  Download all term dates and school holidays as a standard .ics calendar file.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadSchoolTermsCalendar}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
              >
                Download All Terms (.ics)
              </button>
            </div>

            <div className="space-y-3">
              {UK_SCHOOL_TERMS_2026_2027.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">{evt.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-600 flex items-center gap-1 shrink-0 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    {formatICSDateString(evt.startDate)} – {formatICSDateString(evt.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Schedule a Study Block
              </h2>
              <div className="space-y-3">
                <div>
                  <label htmlFor="sched-topic" className="block text-xs font-bold text-slate-700 mb-1">
                    Topic
                  </label>
                  <select
                    id="sched-topic"
                    value={schedulerTopicId}
                    onChange={(e) => setSchedulerTopicId(e.target.value)}
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
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
                    <label htmlFor="sched-date" className="block text-xs font-bold text-slate-700 mb-1">
                      Date
                    </label>
                    <input
                      id="sched-date"
                      type="date"
                      value={schedulerDate}
                      onChange={(e) => setSchedulerDate(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="sched-time" className="block text-xs font-bold text-slate-700 mb-1">
                      Time
                    </label>
                    <input
                      id="sched-time"
                      type="time"
                      value={schedulerTime}
                      onChange={(e) => setSchedulerTime(e.target.value)}
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleScheduleEvent}
                  className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer"
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
                    className="min-h-[40px] w-full px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
                  >
                    Add to Google Calendar <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {schedulerNotice && (
                  <p className="text-xs font-semibold text-emerald-700">{schedulerNotice}</p>
                )}
              </div>
            </div>

            {customEvents.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  Saved Study Blocks
                </h3>
                {customEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{evt.topicTitle}</p>
                      <p className="text-[11px] font-mono text-slate-500">
                        {evt.date} · {evt.time}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveCustomEvent(evt.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      aria-label="Remove scheduled study block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CURATED VIDEO CLASSROOM */}
      {tab === 'videos' && (
        <div className="space-y-6">
          {/* @schoolauk Official YouTube Showcase */}
          <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#312E81] text-white rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Youtube className="w-4 h-4" />
                Schoola on YouTube · @schoolauk · 200+ Free Videos (KS1–KS2)
              </p>
              <h2 className="font-heading font-extrabold text-xl">
                Curated UK Primary Video Classroom
              </h2>
              <p className="text-xs text-slate-300">
                Watch ad-conscious, curriculum-matched primary lessons in-app or visit the official Schoola channel.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@schoolauk"
              target="_blank"
              rel="noreferrer"
              className="min-h-[42px] px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            >
              Visit @schoolauk <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Maths', 'English', 'Science', 'History', 'Geography'].map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setVideoSubject(subj)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  videoSubject === subj
                    ? 'bg-sky-600 text-white border-sky-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {theaterVideo && (
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-heading font-bold text-lg">{theaterVideo.title}</h3>
                <button
                  type="button"
                  onClick={() => setTheaterVideo(null)}
                  className="min-h-[38px] px-4 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold cursor-pointer"
                >
                  Close Player
                </button>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${theaterVideo.id}?autoplay=1&rel=0`}
                  title={theaterVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CURATED_YOUTUBE_VIDEOS.filter(
              (v) => videoSubject === 'All' || v.subjectId === videoSubject
            ).map((video) => (
              <div
                key={video.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500">
                      {video.subjectId} · {video.channelName} · {video.duration}
                    </p>
                    <h3 className="font-heading font-bold text-sm text-slate-900">{video.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{video.description}</p>
                  </div>
                </div>
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTheaterVideo({ id: video.youtubeId, title: video.title })}
                    className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Watch In-App
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[40px] px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center"
                    aria-label="Watch on YouTube (external website)"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Trusted UK Primary Educational Channels
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {EDUCATION_CHANNELS.map((ch) => (
                <div key={ch.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <p className="font-bold text-sm text-slate-900">
                    {ch.logo} {ch.name}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">{ch.handle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{ch.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SAFEGUARDING, PRIVACY & CURRICULUM STANDARDS */}
      {tab === 'safeguarding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-700" />
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                Children&apos;s Privacy &amp; Safeguarding Charter
              </h2>
            </div>

            <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
              <li>
                <strong>No personal data collection:</strong> Children can use every learning world, game, and quiz without registering an account or entering personal details.
              </li>
              <li>
                <strong>Zero advertising or behavioural tracking:</strong> Schoola displays no third-party ads, profiling cookies, or cross-site trackers.
              </li>
              <li>
                <strong>No public profiles or open chat:</strong> Children cannot message strangers or share public profiles.
              </li>
              <li>
                <strong>ICO Age Appropriate Design Code alignment:</strong> Progress, stars, and badges are stored strictly locally in your browser&apos;s storage.
              </li>
              <li>
                <strong>Clear external link separation:</strong> Links to BBC Teach, Twinkl, and Oak National Academy are clearly marked as opening external websites and placed inside adult-oriented panels.
              </li>
              <li>
                <strong>England National Curriculum clarity:</strong> All 64 topic sequences align specifically to England&apos;s Key Stage 1 (Years 1–2) and Key Stage 2 (Years 3–6) statutory frameworks.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Manage Local Device Data
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All stars, completed topics, badges, and study reminders are stored only on this device. You can reset local progress at any time.
              </p>
            </div>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Local Progress
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <p className="text-xs font-bold text-rose-900">
                  Are you sure you want to clear all saved stars, completed topics, and checklist items on this device?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setConfirmReset(false);
                    }}
                    className="min-h-[38px] px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-[38px] px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
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
