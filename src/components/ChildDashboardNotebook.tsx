import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckSquare,
  Lock,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Volume2,
} from 'lucide-react';
import { TOPICS } from '../data/curriculum';
import { SURPRISE_FUN_FACTS } from '../data/learningWorlds';
import { Topic, YearGroup } from '../types';
import { speakText } from '../utils/speech';

interface ChildDashboardNotebookProps {
  selectedYear: YearGroup;
  stars: number;
  favouriteTopicIds: string[];
  onOpenTopic: (topic: Topic) => void;
}

type NotebookTabId = 'planner' | 'notes' | 'vault' | 'todo' | 'stars';

interface NotebookTodo {
  id: string;
  text: string;
  done: boolean;
}

interface NotebookSavedState {
  weeklyPlan: Record<string, string>;
  studyNote: string;
  selectedSubject: string;
  unlockedWords: string[];
  todos: NotebookTodo[];
}

const STORAGE_KEY = 'schoola_child_notebook_v1';

const PASTEL_TABS: {
  id: NotebookTabId;
  shortLabel: string;
  title: string;
  tabBg: string;
  tabBorder: string;
  activeText: string;
  headerBg: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'planner',
    shortLabel: 'Plan',
    title: 'Weekly Study Plan',
    tabBg: 'bg-[#7DD3FC]',
    tabBorder: 'border-[#38BDF8]',
    activeText: 'text-sky-950',
    headerBg: 'from-[#E0F2FE] to-[#F0F9FF]',
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    id: 'notes',
    shortLabel: 'Notes',
    title: 'Subject Study Notes',
    tabBg: 'bg-[#F9A8D4]',
    tabBorder: 'border-[#F472B6]',
    activeText: 'text-rose-950',
    headerBg: 'from-[#FCE7F3] to-[#FFF1F2]',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 'vault',
    shortLabel: 'A–Z',
    title: 'Word Vault',
    tabBg: 'bg-[#FDE047]',
    tabBorder: 'border-[#FACC15]',
    activeText: 'text-amber-950',
    headerBg: 'from-[#FEF9C3] to-[#FFFBEB]',
    icon: <Lock className="w-4 h-4" />,
  },
  {
    id: 'todo',
    shortLabel: 'Tasks',
    title: 'Daily Checklist',
    tabBg: 'bg-[#86EFAC]',
    tabBorder: 'border-[#4ADE80]',
    activeText: 'text-emerald-950',
    headerBg: 'from-[#DCFCE7] to-[#F0FDF4]',
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    id: 'stars',
    shortLabel: 'Stars',
    title: 'Saved & Facts',
    tabBg: 'bg-[#D8B4FE]',
    tabBorder: 'border-[#C084FC]',
    activeText: 'text-purple-950',
    headerBg: 'from-[#F3E8FF] to-[#FAF5FF]',
    icon: <Star className="w-4 h-4" />,
  },
];

const WEEKDAYS_PASTEL = [
  { key: 'Mon', label: 'Mon', pill: 'bg-[#DDD6FE] text-[#4C1D95] border-[#C4B5FD]' },
  { key: 'Tue', label: 'Tue', pill: 'bg-[#FEF08A] text-[#713F12] border-[#FDE047]' },
  { key: 'Wed', label: 'Wed', pill: 'bg-[#FECDD3] text-[#881337] border-[#FDA4AF]' },
  { key: 'Thu', label: 'Thu', pill: 'bg-[#99F6E4] text-[#134E4A] border-[#5EEAD4]' },
  { key: 'Fri', label: 'Fri', pill: 'bg-[#BAE6FD] text-[#0C4A6E] border-[#7DD3FC]' },
  { key: 'Sat', label: 'Sat', pill: 'bg-[#FBCFE8] text-[#831843] border-[#F9A8D4]' },
  { key: 'Sun', label: 'Sun', pill: 'bg-[#BBF7D0] text-[#14532D] border-[#86EFAC]' },
];

const SHELF_SUBJECTS = [
  { id: 'Maths', bg: 'from-sky-400 to-blue-600' },
  { id: 'Science', bg: 'from-emerald-400 to-teal-600' },
  { id: 'English', bg: 'from-rose-400 to-pink-600' },
  { id: 'History', bg: 'from-amber-400 to-orange-600' },
  { id: 'Geography', bg: 'from-violet-400 to-purple-600' },
];

const WORD_VAULT_GROUPS: {
  id: string;
  range: string;
  chipColor: string;
  words: { word: string; clue: string }[];
}[] = [
  {
    id: 'af',
    range: 'A–F',
    chipColor: 'bg-[#FECDD3] text-[#881337]',
    words: [
      { word: 'Adjective', clue: 'A describing word like sparkling or gigantic.' },
      { word: 'Chronology', clue: 'Putting historical events in time order.' },
      { word: 'Denominator', clue: 'The bottom number of a fraction showing total equal parts.' },
    ],
  },
  {
    id: 'gm',
    range: 'G–M',
    chipColor: 'bg-[#FEF08A] text-[#713F12]',
    words: [
      { word: 'Gravity', clue: 'The invisible force pulling objects towards Earth.' },
      { word: 'Habitat', clue: 'The natural home of a plant or animal.' },
      { word: 'Metaphor', clue: 'Saying something IS something else to paint a picture.' },
    ],
  },
  {
    id: 'ns',
    range: 'N–S',
    chipColor: 'bg-[#BAE6FD] text-[#0C4A6E]',
    words: [
      { word: 'Orbit', clue: 'The curved path a planet takes around the Sun.' },
      { word: 'Perimeter', clue: 'The total distance right around the outside edge of a shape.' },
      { word: 'Seedling', clue: 'A young plant sprouting from a seed.' },
    ],
  },
  {
    id: 'tz',
    range: 'T–Z',
    chipColor: 'bg-[#BBF7D0] text-[#14532D]',
    words: [
      { word: 'Tectonic', clue: 'Giant rocky plates slowly moving under Earth’s surface.' },
      { word: 'Transparent', clue: 'Material like clear glass that lets light pass straight through.' },
      { word: 'Volcano', clue: 'An opening in Earth’s crust where magma can erupt.' },
    ],
  },
];

const DEFAULT_NOTEBOOK_STATE: NotebookSavedState = {
  weeklyPlan: {
    Mon: 'Phonics & Reading (10 mins)',
    Tue: 'Number Bonds & Shapes',
    Wed: 'Materials Science Quest',
    Thu: 'Great Fire History Story',
    Fri: 'Times Tables Quiz',
    Sat: 'Nature Walk Fact Hunt',
    Sun: 'Rest & Storytime',
  },
  studyNote: 'Today I discovered how light reflects off mirrors and shiny spoons!',
  selectedSubject: 'Maths',
  unlockedWords: ['Adjective', 'Gravity', 'Orbit'],
  todos: [
    { id: 't1', text: 'Finish 1 Daily Challenge', done: false },
    { id: 't2', text: 'Read a chapter book (10 mins)', done: true },
    { id: 't3', text: 'Practise 2s, 5s & 10s tables', done: false },
  ],
};

export const ChildDashboardNotebook: React.FC<ChildDashboardNotebookProps> = ({
  selectedYear,
  stars,
  favouriteTopicIds,
  onOpenTopic,
}) => {
  const [activeTab, setActiveTab] = useState<NotebookTabId>('planner');
  const [activeDay, setActiveDay] = useState<string>('Mon');
  const [activeVaultRange, setActiveVaultRange] = useState<string>('af');
  const [newTodoText, setNewTodoText] = useState('');
  const [factIdx, setFactIdx] = useState(0);

  const [notebook, setNotebook] = useState<NotebookSavedState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_NOTEBOOK_STATE, ...JSON.parse(saved) };
      }
      return DEFAULT_NOTEBOOK_STATE;
    } catch {
      return DEFAULT_NOTEBOOK_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notebook));
    } catch {
      // Ignore storage quota errors
    }
  }, [notebook]);

  const currentTabMeta = PASTEL_TABS.find((t) => t.id === activeTab) || PASTEL_TABS[0];

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newTodoText.trim();
    if (!cleaned) return;
    setNotebook((prev) => ({
      ...prev,
      todos: [{ id: `todo-${Date.now()}`, text: cleaned, done: false }, ...prev.todos].slice(0, 8),
    }));
    setNewTodoText('');
  };

  const toggleTodo = (id: string) => {
    setNotebook((prev) => ({
      ...prev,
      todos: prev.todos.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    }));
  };

  const removeTodo = (id: string) => {
    setNotebook((prev) => ({
      ...prev,
      todos: prev.todos.filter((item) => item.id !== id),
    }));
  };

  const toggleUnlockWord = (word: string, clue: string) => {
    setNotebook((prev) => {
      const exists = prev.unlockedWords.includes(word);
      return {
        ...prev,
        unlockedWords: exists
          ? prev.unlockedWords
          : [...prev.unlockedWords, word],
      };
    });
    speakText(`${word}. ${clue}`);
  };

  return (
    <aside
      aria-label="My Compact Pastel Notebook"
      className="relative w-full"
    >
      {/* OUTER FRAMED NOTEBOOK CONTAINER (Soft Blush Cover + Brass Corners + Right-Side Pastel Tabs) */}
      <div className="relative bg-gradient-to-br from-[#F7D7D7] via-[#F4CACA] to-[#EFC0C3] border-2 border-[#D99B9E] rounded-[24px] sm:rounded-[30px] p-3.5 sm:p-7 pr-12 sm:pr-16 shadow-xl">
        {/* Metallic Gold Top-Right & Bottom-Right Corner Protectors */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2 right-12 sm:right-14 w-7 h-7 border-t-[5px] border-r-[5px] border-[#EAB308] rounded-tr-2xl opacity-90"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-12 sm:right-14 w-7 h-7 border-b-[5px] border-r-[5px] border-[#EAB308] rounded-br-2xl opacity-90"
        />

        {/* Vertical Elastic Band Accent on Left-Center */}
        <span
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute top-0 bottom-0 left-5 w-2 bg-gradient-to-b from-[#E5B0B4] via-[#D89A9F] to-[#E5B0B4] opacity-55"
        />

        {/* RIGHT-SIDE VERTICAL PASTEL DIVIDER TABS (Stacked cleanly down the right side!) */}
        <div
          role="tablist"
          aria-label="Notebook divider tabs"
          className="absolute right-1.5 top-8 bottom-8 flex flex-col justify-center gap-2.5 z-20"
        >
          {PASTEL_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                title={tab.title}
                className={`group flex flex-col items-center justify-center gap-0.5 py-2.5 px-1.5 rounded-r-xl border-2 border-l-0 transition-all cursor-pointer shadow-sm ${tab.tabBg} ${tab.tabBorder} ${tab.activeText} ${
                  isActive
                    ? 'translate-x-1.5 ring-2 ring-white font-extrabold shadow-md scale-105'
                    : 'opacity-85 hover:opacity-100 hover:translate-x-1 font-bold'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] leading-none font-playful tracking-tight">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* INNER SPIRAL-BOUND NOTEBOOK PAPER PAGE */}
        <div className="relative bg-[#FFFEF8] rounded-2xl border border-amber-200/80 shadow-inner flex overflow-hidden">
          {/* Brass Twin-Wire Spiral Binding Spine along the Left */}
          <div
            aria-hidden="true"
            className="w-6 sm:w-7 bg-gradient-to-r from-[#F3E8E2] to-[#FFFEF8] border-r border-rose-200/70 flex flex-col items-center justify-evenly py-4 shrink-0"
          >
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="relative w-full flex items-center justify-center">
                <span className="w-3 h-2.5 rounded-full bg-slate-200 border border-slate-300 mr-1" />
                <span className="absolute -left-1 w-5 h-1.5 rounded-full bg-gradient-to-b from-[#FDE047] via-[#CA8A04] to-[#854D0E] shadow-xs" />
              </div>
            ))}
          </div>

          {/* Notebook Paper Body */}
          <div className="relative flex-1 min-w-0 p-4 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6">
            {/* Header Strip matching active Pastel Divider Tab */}
            <div className={`rounded-2xl bg-gradient-to-r ${currentTabMeta.headerBg} border border-slate-200/80 px-5 py-3.5 flex items-center justify-between gap-3`}>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  My Study Notebook · {selectedYear}
                </p>
                <h2 className="font-playful font-bold text-base sm:text-lg text-slate-900 truncate flex items-center gap-1.5">
                  {currentTabMeta.icon}
                  <span>{currentTabMeta.title}</span>
                </h2>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-white border border-amber-200 text-xs font-extrabold text-amber-700 tabular-nums shrink-0 flex items-center gap-1 shadow-2xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                {stars}
              </span>
            </div>

            {/* Active Tab Content */}
            <AnimatePresence mode="wait">
              {/* PART 1: COMPACT PASTEL WEEKLY PLANNER (Inspired by Picture 2) */}
              {activeTab === 'planner' && (
                <motion.div
                  key="planner"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* 7 Pastel Weekday Headers */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                    {WEEKDAYS_PASTEL.map((d) => {
                      const active = activeDay === d.key;
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => setActiveDay(d.key)}
                          className={`py-2 rounded-lg border text-[11px] font-playful font-extrabold text-center cursor-pointer transition-all ${d.pill} ${
                            active ? 'ring-2 ring-slate-900/60 scale-105 shadow-xs' : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Day Lined Card */}
                  <div className="rounded-2xl border border-sky-200 bg-sky-50/40 p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>{activeDay} Study Plan</span>
                      <button
                        type="button"
                        onClick={() => speakText(`${activeDay}: ${notebook.weeklyPlan[activeDay] || 'Free study day!'}`)}
                        className="text-[11px] font-bold text-sky-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" /> Read
                      </button>
                    </div>
                    <input
                      type="text"
                      value={notebook.weeklyPlan[activeDay] || ''}
                      onChange={(e) =>
                        setNotebook((prev) => ({
                          ...prev,
                          weeklyPlan: { ...prev.weeklyPlan, [activeDay]: e.target.value },
                        }))
                      }
                      placeholder={`Write ${activeDay} focus...`}
                      aria-label={`${activeDay} study plan`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  {/* Mini Full-Week Overview Sheet */}
                  <div className="divide-y divide-sky-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    {WEEKDAYS_PASTEL.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setActiveDay(d.key)}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs transition-colors cursor-pointer ${
                          activeDay === d.key ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold shrink-0 ${d.pill}`}>
                          {d.label}
                        </span>
                        <span className="text-slate-700 font-medium truncate">
                          {notebook.weeklyPlan[d.key] || 'Tap to add goal...'}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PART 2: SUBJECT SHELF & LINED STUDY NOTES (Inspired by Pictures 1 & 4) */}
              {activeTab === 'notes' && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Mini Colourful Bookshelf Row */}
                  <div className="rounded-2xl bg-[#0F2868] p-3.5 space-y-2">
                    <div className="flex items-end gap-2">
                      {SHELF_SUBJECTS.map((book) => {
                        const active = notebook.selectedSubject === book.id;
                        return (
                          <button
                            key={book.id}
                            type="button"
                            onClick={() =>
                              setNotebook((prev) => ({ ...prev, selectedSubject: book.id }))
                            }
                            className={`flex-1 py-2 px-1 rounded-t-lg bg-gradient-to-b ${book.bg} text-white font-playful font-bold text-[10px] text-center cursor-pointer transition-transform ${
                              active ? '-translate-y-1 ring-2 ring-amber-300 shadow-sm' : 'opacity-85 hover:opacity-100'
                            }`}
                          >
                            {book.id}
                          </button>
                        );
                      })}
                    </div>
                    <div className="h-2 w-full rounded-full bg-gradient-to-b from-amber-500 to-amber-800" />
                  </div>

                  {/* Lined Pastel Pink Study Sheet */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                      <span>{notebook.selectedSubject} Jottings</span>
                      <button
                        type="button"
                        onClick={() => speakText(notebook.studyNote)}
                        className="inline-flex items-center gap-1 text-[11px] text-rose-700 hover:underline cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" /> Read aloud
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={notebook.studyNote}
                      onChange={(e) =>
                        setNotebook((prev) => ({ ...prev, studyNote: e.target.value }))
                      }
                      placeholder="Write a discovery, tricky spelling, or maths trick here..."
                      className="w-full rounded-2xl border-2 border-rose-200 bg-[repeating-linear-gradient(to_bottom,#FFFDF9_0px,#FFFDF9_27px,#FCE7F3_28px)] px-4 py-2.5 text-xs font-medium text-slate-800 leading-[28px] focus:outline-none focus:border-rose-400 resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* PART 3: INDEXED WORD VAULT WITH LOCK EMBLEM (Inspired by Picture 3) */}
              {activeTab === 'vault' && (
                <motion.div
                  key="vault"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      Tap a word to unlock &amp; hear it
                    </span>
                    <span className="tabular-nums text-[11px] bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {notebook.unlockedWords.length}/12
                    </span>
                  </div>

                  {/* Mini A-Z Coloured Index Tabs */}
                  <div className="grid grid-cols-4 gap-2">
                    {WORD_VAULT_GROUPS.map((grp) => (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => setActiveVaultRange(grp.id)}
                        className={`py-2 rounded-lg text-xs font-playful font-extrabold cursor-pointer transition-all ${grp.chipColor} ${
                          activeVaultRange === grp.id ? 'ring-2 ring-amber-500 shadow-xs' : 'opacity-75 hover:opacity-100'
                        }`}
                      >
                        {grp.range}
                      </button>
                    ))}
                  </div>

                  {/* Word Cards for Active Index */}
                  <div className="space-y-2.5">
                    {(WORD_VAULT_GROUPS.find((g) => g.id === activeVaultRange) || WORD_VAULT_GROUPS[0]).words.map(
                      (item) => {
                        const unlocked = notebook.unlockedWords.includes(item.word);
                        return (
                          <button
                            key={item.word}
                            type="button"
                            onClick={() => toggleUnlockWord(item.word, item.clue)}
                            className={`w-full p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                              unlocked
                                ? 'bg-amber-50/90 border-amber-300 text-slate-900'
                                : 'bg-white border-slate-200 hover:border-amber-300 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-playful font-bold text-xs sm:text-sm">
                                {item.word}
                              </span>
                              <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                                {unlocked ? (
                                  <>
                                    <Volume2 className="w-3 h-3" /> Saved
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" /> Tap
                                  </>
                                )}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                              {item.clue}
                            </p>
                          </button>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              )}

              {/* PART 4: MINT GREEN DAILY CHECKLIST */}
              {activeTab === 'todo' && (
                <motion.div
                  key="todo"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <form onSubmit={handleAddTodo} className="flex gap-2">
                    <input
                      type="text"
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      placeholder="Add a mini study goal..."
                      aria-label="Add new notebook checklist goal"
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </form>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {notebook.todos.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs ${
                          item.done
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTodo(item.id)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                              item.done
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'bg-white border-slate-300'
                            }`}
                          >
                            {item.done && <Check className="w-3 h-3" />}
                          </span>
                          <span className={`truncate font-semibold ${item.done ? 'line-through opacity-70' : ''}`}>
                            {item.text}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTodo(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                          aria-label={`Remove ${item.text}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PART 5: LAVENDER SAVED TOPICS & POCKET FUN FACT */}
              {activeTab === 'stars' && (
                <motion.div
                  key="stars"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-purple-900">
                      Saved Bookmarks ({favouriteTopicIds.length})
                    </p>
                    {favouriteTopicIds.length === 0 ? (
                      <p className="text-xs text-slate-500 bg-purple-50/50 border border-purple-200 rounded-2xl p-4 leading-relaxed">
                        Tap the bookmark icon on any topic card to pin favourite subjects right here in your pocket notebook.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {favouriteTopicIds.slice(0, 3).map((tid) => {
                          const found = TOPICS.find((t) => t.id === tid);
                          if (!found) return null;
                          return (
                            <button
                              key={tid}
                              type="button"
                              onClick={() => onOpenTopic(found)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-purple-50/70 hover:bg-purple-100 border border-purple-200 text-left flex items-center justify-between gap-2.5 cursor-pointer"
                            >
                              <span className="text-xs font-bold text-purple-950 truncate">
                                {found.title.replace(/^[^:—]+[:—]\s*/, '')}
                              </span>
                              <span className="text-[10px] font-extrabold text-purple-700 shrink-0">
                                Open →
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Pocket Fun Fact Card */}
                  <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 border-2 border-purple-200 p-4 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-playful font-extrabold text-sm text-purple-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        Pocket Fun Fact!
                      </span>
                      <button
                        type="button"
                        onClick={() => setFactIdx((i) => (i + 1) % SURPRISE_FUN_FACTS.length)}
                        className="text-[11px] font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                    <p className="font-playful text-xs font-medium text-slate-800 leading-relaxed">
                      {SURPRISE_FUN_FACTS[factIdx % SURPRISE_FUN_FACTS.length].fact}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decorative Curled Corner Peel at Bottom-Right (Inspired by Picture 2) */}
            <div className="flex items-center justify-between pt-3.5 border-t border-rose-100 text-[10px] font-bold text-slate-400">
              <span>Saved automatically on this device</span>
              <span aria-hidden="true" className="text-amber-500">✦ Pastel Notebook</span>
            </div>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-tl from-[#E2D9C8] via-[#F5EFE2] to-transparent rounded-tl-xl shadow-[-2px_-2px_5px_rgba(0,0,0,0.06)]"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
