import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
  Youtube,
} from 'lucide-react';
import {
  buildAmazonAllDiscountsUrl,
  DEFAULT_AMAZON_TAG,
} from '../data/seasonalShop';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { findMatchingYouTubeVideo } from '../data/youtubeVideos';
import {
  downloadSchoolTermsCalendar,
  getGoogleCalendarLink,
  UK_SCHOOL_TERMS_2026_2027,
} from '../utils/calendarSync';
import { LearnerProgress, ParentView, Topic } from '../types';

type WalletNotepadMode = 'overview' | 'curriculum' | 'calendar' | 'shopping';

interface ShoppingChecklistItem {
  id: string;
  label: string;
  bagName?: string;
  checked: boolean;
}

interface ParentLeatherWalletNotebookProps {
  progress: LearnerProgress;
  unlockedBadgesCount: number;
  weeklyChecklist: Record<string, boolean>;
  onSelectTab: (tab: ParentView) => void;
  onOpenTopicInHub: (topic: Topic) => void;
  onToggleChecklist: (key: string) => void;
}

const SHOPPING_BAG_OPTIONS = [
  'School',
  'Clothing',
  'Teacher',
  'Friends Gifts',
  'Christmas',
] as const;

const LEGACY_BAG_NAME_MAP: Record<string, string> = {
  'School Prep Bag': 'School',
  'Winter Kit Bag': 'Clothing',
  'Teacher Gift Bag': 'Teacher',
  'Party Bag': 'Friends Gifts',
  'Christmas Bag': 'Christmas',
};

const DEFAULT_SHOPPING_LIST: ShoppingChecklistItem[] = [
  {
    id: 'shop-1',
    label: 'Leakproof bento lunchbox & flip bottle',
    bagName: 'School',
    checked: false,
  },
  {
    id: 'shop-2',
    label: 'Class signing card + under-£5 teacher gift',
    bagName: 'Teacher',
    checked: false,
  },
  {
    id: 'shop-3',
    label: 'Under-£15 girls birthday party gift stash',
    bagName: 'Friends Gifts',
    checked: false,
  },
  {
    id: 'shop-4',
    label: 'Winter wellies / puddle suit check',
    bagName: 'Clothing',
    checked: false,
  },
];

export const ParentLeatherWalletNotebook: React.FC<ParentLeatherWalletNotebookProps> = ({
  progress,
  unlockedBadgesCount,
  weeklyChecklist,
  onSelectTab,
  onOpenTopicInHub,
  onToggleChecklist,
}) => {
  const [notepadMode, setNotepadMode] = useState<WalletNotepadMode>('overview');

  // Curriculum expandable directory state inside notepad
  const [dirSearch, setDirSearch] = useState('');
  const [dirKeyStage, setDirKeyStage] = useState<'all' | 'ks1' | 'ks2'>('all');
  const [expandedTopicIds, setExpandedTopicIds] = useState<Record<string, boolean>>({});

  // Calendar subscription & sync state inside notepad
  const [calSubEmail, setCalSubEmail] = useState('');
  const [calSubscribed, setCalSubscribed] = useState(false);
  const [calFeedCopied, setCalFeedCopied] = useState(false);

  // Shopping list & custom bag builder
  const [customBags, setCustomBags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('schoola_custom_shopping_bags_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage access errors
    }
    return [];
  });
  const allBags = useMemo(
    () => [...SHOPPING_BAG_OPTIONS, ...customBags],
    [customBags]
  );
  const [selectedBag, setSelectedBag] = useState<string>(SHOPPING_BAG_OPTIONS[0]);
  const [showNewBagInput, setShowNewBagInput] = useState(false);
  const [newBagName, setNewBagName] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('schoola_family_shopping_bag_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((item: ShoppingChecklistItem) => ({
            ...item,
            bagName: item.bagName ? LEGACY_BAG_NAME_MAP[item.bagName] || item.bagName : undefined,
          }));
        }
      }
    } catch {
      // Ignore storage access errors
    }
    return DEFAULT_SHOPPING_LIST;
  });
  const [emptySlotValues, setEmptySlotValues] = useState<string[]>(['', '', '']);
  const [newShopItem, setNewShopItem] = useState('');

  const routineItems = [
    { key: 'read_15', label: '15 minutes of reading or phonics together' },
    { key: 'watch_video', label: 'Watch one curriculum video in the Learning Hub' },
    { key: 'do_quiz', label: 'Complete one Play & Test interactive challenge' },
    { key: 'maths_10', label: '10 minutes of number bonds or times tables practice' },
  ];

  const filteredDirectoryTopics = useMemo(() => {
    const q = dirSearch.trim().toLowerCase();
    return TOPICS.filter((t) => {
      const isKs1 = t.year.includes('1') || t.year.includes('2');
      const isKs2 =
        t.year.includes('3') ||
        t.year.includes('4') ||
        t.year.includes('5') ||
        t.year.includes('6');
      const matchKs =
        dirKeyStage === 'all' ||
        (dirKeyStage === 'ks1' && isKs1) ||
        (dirKeyStage === 'ks2' && isKs2);
      const matchQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.subjectId.toLowerCase().includes(q) ||
        t.year.toLowerCase().includes(q) ||
        t.objectives.some((o) => o.toLowerCase().includes(q));
      return matchKs && matchQuery;
    });
  }, [dirKeyStage, dirSearch]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopicIds((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const formatICSDateString = (dateStr: string) => {
    try {
      const year = dateStr.substring(0, 4);
      const monthIndex = parseInt(dateStr.substring(4, 6), 10) - 1;
      const day = parseInt(dateStr.substring(6, 8), 10);
      const MONTHS = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${day} ${MONTHS[monthIndex]} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleCopyCalendarFeed = async () => {
    const feedUrl = 'webcal://schoola.uk/calendars/uk-primary-terms-2026-2027.ics';
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(feedUrl);
      }
      setCalFeedCopied(true);
      window.setTimeout(() => setCalFeedCopied(false), 2500);
    } catch {
      setCalFeedCopied(true);
    }
  };

  const handleCalendarSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calSubEmail.trim() || !calSubEmail.includes('@')) return;
    setCalSubscribed(true);
  };

  const updateAndSaveShoppingList = (updater: (prev: ShoppingChecklistItem[]) => ShoppingChecklistItem[]) => {
    setShoppingList((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem('schoola_family_shopping_bag_v3', JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const handleAddShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newShopItem.trim();
    if (!trimmed) return;
    updateAndSaveShoppingList((prev) => [
      ...prev,
      { id: `shop-${Date.now()}`, label: trimmed, bagName: selectedBag, checked: false },
    ]);
    setNewShopItem('');
  };

  const handleSaveEmptySlot = (slotIdx: number) => {
    const trimmed = (emptySlotValues[slotIdx] || '').trim();
    if (!trimmed) return;
    updateAndSaveShoppingList((prev) => [
      ...prev,
      {
        id: `shop-${Date.now()}-${slotIdx}`,
        label: trimmed,
        bagName: selectedBag,
        checked: false,
      },
    ]);
    setEmptySlotValues((prev) => prev.map((v, i) => (i === slotIdx ? '' : v)));
  };

  const handleAddCustomBag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBagName.trim();
    if (!trimmed) return;
    if (!allBags.some((b) => b.toLowerCase() === trimmed.toLowerCase())) {
      const next = [...customBags, trimmed];
      setCustomBags(next);
      try {
        localStorage.setItem('schoola_custom_shopping_bags_v1', JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
    }
    setSelectedBag(trimmed);
    setNewBagName('');
    setShowNewBagInput(false);
  };

  const handleResetShoppingDefaults = () => {
    updateAndSaveShoppingList(() => DEFAULT_SHOPPING_LIST);
  };

  const toggleShoppingItem = (id: string) => {
    updateAndSaveShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeShoppingItem = (id: string) => {
    updateAndSaveShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section
      aria-label="Parents Dark Blue Leather Wallet Notebook"
      className="relative rounded-[28px] sm:rounded-[34px] bg-gradient-to-br from-[#132957] via-[#0D1E42] to-[#08122B] p-2.5 sm:p-4 shadow-[0_24px_60px_rgba(2,6,23,0.75)] border-2 border-[#264687]"
    >
      {/* Outer Leather Double-Stitch Perimeter */}
      <div className="relative rounded-[22px] sm:rounded-[26px] border border-dashed border-[#93C5FD]/40 p-3 sm:p-6 lg:p-7 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(30,58,138,0.22),transparent_55%)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-stretch">
          {/* ==============================================================
              LEFT SIDE OF DARK BLUE LEATHER WALLET
              Top: Gold-Engraved Folio Stamp on Leather Skin
              Lower: 4 Stitched Leather Card Pockets (Red Card = Shopping List)
              ============================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between lg:pr-7 space-y-8">
            {/* TOP LEFT: ENGRAVED IN GOLD ON THE DARK NAVY LEATHER SKIN JUST BEFORE CARDS */}
            <div className="pt-3 pb-4 px-2 border-b border-dashed border-[#F59E0B]/30 space-y-3">
              <div className="space-y-1">
                <p className="font-heading font-extrabold text-[11px] uppercase tracking-[0.26em] text-transparent bg-clip-text bg-gradient-to-b from-[#FEF08A] via-[#F59E0B] to-[#B45309] drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]">
                  Parent &amp; Teacher Hub
                </p>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl leading-snug text-transparent bg-clip-text bg-gradient-to-b from-[#FEF3C7] via-[#FBBF24] to-[#D97706] drop-shadow-[0_2px_2px_rgba(2,6,23,0.9)]">
                  Support learning with clarity and trust
                </h2>
                <p className="text-[11px] font-semibold tracking-wide text-[#FDE68A]/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  Aligned to England&apos;s National Curriculum (KS1 &amp; KS2)
                </p>
              </div>

              {/* Gold-debossed mini leather seal */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[#FCD34D]/90">
                <span className="px-2.5 py-1 rounded border border-[#F59E0B]/40 bg-[#071127]/60 shadow-inner">
                  {progress.selectedYear}
                </span>
                <span className="px-2.5 py-1 rounded border border-[#F59E0B]/40 bg-[#071127]/60 shadow-inner">
                  {progress.completedTopics.length}/{TOPICS.length} Topics
                </span>
                <span className="px-2.5 py-1 rounded border border-[#F59E0B]/40 bg-[#071127]/60 shadow-inner">
                  {progress.stars} ★ · {unlockedBadgesCount} Badges
                </span>
              </div>
            </div>

            {/* LOWER LEFT: TUCK-IN LEATHER POCKET CARDS */}
            <div className="mt-auto pt-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#FCD34D]/80 font-bold">
                  Schoola · Leather Pockets
                </span>
                <span className="text-[10px] font-semibold text-amber-200/80">
                  Tap card to flip notes
                </span>
              </div>

              {/* CARD POCKET 1: Progress & Overview */}
              <div className="relative pt-1">
                <button
                  type="button"
                  onClick={() => setNotepadMode('overview')}
                  className={`w-full text-left rounded-t-2xl rounded-b-lg p-3.5 sm:p-4 border transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                    notepadMode === 'overview'
                      ? 'bg-gradient-to-r from-[#FDE68A] via-[#FCD34D] to-[#F59E0B] border-amber-200 text-slate-950 -translate-y-1 ring-2 ring-amber-300/70'
                      : 'bg-gradient-to-r from-[#E2CFA3] to-[#C9AF76] border-amber-200/70 text-slate-950 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-6 rounded bg-gradient-to-br from-amber-100 to-amber-300 border border-amber-700/30 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-amber-900" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-heading font-extrabold text-sm block truncate text-slate-950">
                        Progress &amp; Overview
                      </span>
                      <span className="text-[10px] font-bold text-amber-950/80 block">
                        Year tracker · Routine Checklist
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/15 text-slate-950 shrink-0">
                    {notepadMode === 'overview' ? 'Active' : 'Open'}
                  </span>
                </button>
                <div
                  aria-hidden="true"
                  className="h-3.5 -mt-1.5 rounded-b-lg bg-gradient-to-b from-[#0E2048] to-[#0A1736] border-t-2 border-[#2E5094] shadow-inner"
                />
              </div>

              {/* CARD POCKET 2: Curriculum Directory */}
              <div className="relative pt-1">
                <button
                  type="button"
                  onClick={() => setNotepadMode('curriculum')}
                  className={`w-full text-left rounded-t-2xl rounded-b-lg p-3.5 sm:p-4 border transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                    notepadMode === 'curriculum'
                      ? 'bg-gradient-to-r from-[#A7F3D0] via-[#6EE7B7] to-[#34D399] border-emerald-200 text-slate-950 -translate-y-1 ring-2 ring-emerald-300/70'
                      : 'bg-gradient-to-r from-[#BCE3D4] to-[#8BC7B2] border-emerald-200/70 text-slate-950 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-6 rounded bg-white/60 border border-emerald-800/25 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-emerald-900" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-heading font-extrabold text-sm block truncate text-slate-950">
                        Curriculum Directory
                      </span>
                      <span className="text-[10px] font-bold text-emerald-950/80 block">
                        Expandable resource links · 64 Topics
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/15 text-slate-950 shrink-0">
                    {notepadMode === 'curriculum' ? 'Active' : 'Links ↓'}
                  </span>
                </button>
                <div
                  aria-hidden="true"
                  className="h-3.5 -mt-1.5 rounded-b-lg bg-gradient-to-b from-[#0E2048] to-[#0A1736] border-t-2 border-[#2E5094] shadow-inner"
                />
              </div>

              {/* CARD POCKET 3: Term Calendar */}
              <div className="relative pt-1">
                <button
                  type="button"
                  onClick={() => setNotepadMode('calendar')}
                  className={`w-full text-left rounded-t-2xl rounded-b-lg p-3.5 sm:p-4 border transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                    notepadMode === 'calendar'
                      ? 'bg-gradient-to-r from-[#BAE6FD] via-[#7DD3FC] to-[#38BDF8] border-sky-200 text-slate-950 -translate-y-1 ring-2 ring-sky-300/70'
                      : 'bg-gradient-to-r from-[#C7DFEF] to-[#98C3DF] border-sky-200/70 text-slate-950 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-6 rounded bg-white/65 border border-sky-800/25 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-sky-900" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-heading font-extrabold text-sm block truncate text-slate-950">
                        Term Calendar
                      </span>
                      <span className="text-[10px] font-bold text-sky-950/80 block">
                        UK 2026/27 Dates &amp; Calendar Sync
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/15 text-slate-950 shrink-0">
                    {notepadMode === 'calendar' ? 'Active' : 'Dates'}
                  </span>
                </button>
                <div
                  aria-hidden="true"
                  className="h-3.5 -mt-1.5 rounded-b-lg bg-gradient-to-b from-[#0E2048] to-[#0A1736] border-t-2 border-[#2E5094] shadow-inner"
                />
              </div>

              {/* CARD POCKET 4 (RED CARD): Shopping List & Mum Articles */}
              <div className="relative pt-1">
                <button
                  type="button"
                  onClick={() => setNotepadMode('shopping')}
                  className={`w-full text-left rounded-t-2xl rounded-b-lg p-3.5 sm:p-4 border transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                    notepadMode === 'shopping'
                      ? 'bg-gradient-to-r from-[#FDA4AF] via-[#FB7185] to-[#E11D48] border-rose-200 text-white -translate-y-1 ring-2 ring-rose-300/80'
                      : 'bg-gradient-to-r from-[#FECDD3] to-[#FDA4AF] border-rose-200/80 text-slate-950 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-6 rounded bg-white/80 border border-rose-800/25 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-4 h-4 text-rose-700" />
                    </span>
                    <div className="min-w-0">
                      <span
                        className={`font-heading font-extrabold text-sm block truncate ${
                          notepadMode === 'shopping' ? 'text-white' : 'text-slate-950'
                        }`}
                      >
                        Shopping List
                      </span>
                      <span
                        className={`text-[10px] font-bold block ${
                          notepadMode === 'shopping' ? 'text-rose-100' : 'text-rose-950/80'
                        }`}
                      >
                        Bags, checklist &amp; shop links
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                      notepadMode === 'shopping'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-950/15 text-slate-950'
                    }`}
                  >
                    {notepadMode === 'shopping' ? 'Active' : 'Bags'}
                  </span>
                </button>
                <div
                  aria-hidden="true"
                  className="h-3.5 -mt-1.5 rounded-b-lg bg-gradient-to-b from-[#0E2048] to-[#0A1736] border-t-2 border-[#2E5094] shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* ==============================================================
              CENTER FOLIO LEATHER SPINE SEAM (DESKTOP/IPAD)
              ============================================================== */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="w-7 h-full rounded-xl bg-gradient-to-r from-[#060E21] via-[#10244E] to-[#060E21] border-x border-[#254484]/70 shadow-inner relative flex flex-col items-center justify-between py-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
              <div className="w-px flex-1 my-3 border-l border-dashed border-[#93C5FD]/35" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
            </div>
          </div>

          {/* ==============================================================
              RIGHT SIDE OF WALLET NOTEBOOK: CRISP WHITE NOTEPAD IN CORNER SLOTS
              Dynamically displays Overview / Expandable Curriculum Links / Calendar / Shopping Articles
              ============================================================== */}
          <div className="lg:col-span-6 relative">
            <div
              data-light-card="true"
              className="relative bg-[#FFFEF9] text-[#0F172A] rounded-xl border border-[#CBD5E1] shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden flex flex-col justify-between min-h-[600px]"
            >
              {/* 4 Diagonal Stitched Dark-Blue Leather Corner Pockets Holding Notepad */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-0 w-10 h-10 bg-[#0D1E42] border-r border-b border-[#3B82F6]/40 [clip-path:polygon(0_0,100%_0,0_100%)] shadow-sm"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 w-10 h-10 bg-[#0D1E42] border-l border-b border-[#3B82F6]/40 [clip-path:polygon(0_0,100%_0,100%_100%)] shadow-sm"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 w-10 h-10 bg-[#0D1E42] border-r border-t border-[#3B82F6]/40 [clip-path:polygon(0_0,0_100%,100%_100%)] shadow-sm"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 right-0 w-10 h-10 bg-[#0D1E42] border-l border-t border-[#3B82F6]/40 [clip-path:polygon(100%_0,0_100%,100%_100%)] shadow-sm"
              />

              <div className="space-y-5 flex-1">
                {/* Clean Brand Notepad Top Stamp */}
                <div className="text-center border-b border-slate-200 pb-3 pt-1 flex flex-col items-center gap-1">
                  <p className="font-heading font-extrabold text-xs tracking-[0.26em] text-[#0F2147] uppercase">
                    SCHOOLA · PARENT NOTES
                  </p>
                  <p className="text-[11px] font-bold text-slate-500">
                    {notepadMode === 'overview' && 'Progress Tracker & Home Learning Routine'}
                    {notepadMode === 'curriculum' && 'Curriculum Directory · Expandable Links'}
                    {notepadMode === 'calendar' && 'UK School Term Calendar & Sync'}
                    {notepadMode === 'shopping' && 'Family Shopping Bag & Quick Links'}
                  </p>
                </div>

                {/* ==========================================================
                    NOTEPAD VIEW 1: PROGRESS & OVERVIEW
                    ========================================================== */}
                {notepadMode === 'overview' && (
                  <div className="space-y-6">
                    {/* 4 Exact Metrics */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3.5">
                        <span className="text-[11px] font-bold text-slate-600 block">
                          Selected Year
                        </span>
                        <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 mt-0.5 block">
                          {progress.selectedYear}
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#F8FAFC] border border-slate-200 p-3.5">
                        <span className="text-[11px] font-bold text-slate-600 block">
                          Topics Completed
                        </span>
                        <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 mt-0.5 block tabular-nums">
                          {progress.completedTopics.length} / {TOPICS.length}
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#FFFBEB] border border-amber-200 p-3.5">
                        <span className="text-[11px] font-bold text-amber-900 block">
                          Stars &amp; Badges
                        </span>
                        <span className="font-heading font-extrabold text-lg sm:text-xl text-amber-950 mt-0.5 block tabular-nums">
                          {progress.stars} ★ · {unlockedBadgesCount} badges
                        </span>
                      </div>
                      <div className="rounded-xl bg-[#ECFDF5] border border-emerald-200 p-3.5">
                        <span className="text-[11px] font-bold text-emerald-900 block">
                          Learning Streak
                        </span>
                        <span className="font-heading font-extrabold text-lg sm:text-xl text-emerald-950 mt-0.5 block tabular-nums">
                          {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                    </div>

                    {/* Home Learning Routine Checklist */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                          Home Learning Routine Checklist
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Short, calm 10–15 minute sessions work best for primary learners aged
                          5–11.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {routineItems.map((item) => {
                          const checked = Boolean(weeklyChecklist[item.key]);
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => onToggleChecklist(item.key)}
                              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                checked
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900'
                              }`}
                            >
                              <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
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

                    {/* Quick Jump Reminder to Red Shopping Card */}
                    <div className="rounded-2xl bg-[#FFFBEB] border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold text-[#B45309] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF9900]" />
                          Family Shopping Bag &amp; Quick Links
                        </p>
                        <p className="text-[11px] text-slate-700 mt-0.5">
                          Tap the red Shopping List pocket card to manage bags, add items &amp; shop.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotepadMode('shopping')}
                        className="px-3.5 py-2 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] border border-[#F59E0B] text-slate-950 text-xs font-extrabold whitespace-nowrap cursor-pointer shrink-0"
                      >
                        Open Shopping List →
                      </button>
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    NOTEPAD VIEW 2: CURRICULUM DIRECTORY (EXPANDABLE SCROLL LIST)
                    ========================================================== */}
                {notepadMode === 'curriculum' && (
                  <div className="space-y-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          [
                            { id: 'all', label: 'All (64)' },
                            { id: 'ks1', label: 'KS1 (Y1–2)' },
                            { id: 'ks2', label: 'KS2 (Y3–6)' },
                          ] as const
                        ).map((ks) => (
                          <button
                            key={ks.id}
                            type="button"
                            onClick={() => setDirKeyStage(ks.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                              dirKeyStage === ks.id
                                ? 'bg-emerald-600 border-emerald-700 text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-emerald-50'
                            }`}
                          >
                            {ks.label}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTab('curriculum')}
                        className="text-[11px] font-extrabold text-[#007185] hover:underline cursor-pointer text-left"
                      >
                        Full Rainbow Table →
                      </button>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={dirSearch}
                        onChange={(e) => setDirSearch(e.target.value)}
                        placeholder="Search by keyword (e.g. phonics, fractions, romans, plants)..."
                        className="w-full min-h-[38px] pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Subtle Keyword Filter Chips */}
                    <div className="flex flex-wrap items-center gap-1">
                      {['phonics', 'fractions', 'plants', 'space', 'romans', 'electricity', 'coding'].map((kw) => {
                        const active = dirSearch.toLowerCase() === kw;
                        return (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => setDirSearch(active ? '' : kw)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize cursor-pointer transition-colors ${
                              active
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                            }`}
                          >
                            #{kw}
                          </button>
                        );
                      })}
                    </div>

                    {/* Scrollable Expandable Curriculum Resource List */}
                    <div className="max-h-[365px] overflow-y-auto pr-1.5 space-y-1.5 border-y border-slate-200 py-2">
                      {filteredDirectoryTopics.map((topic) => {
                        const isOpen = Boolean(expandedTopicIds[topic.id]);
                        const cleanKeyword = topic.title.replace(/^[^:—]+[:—]\s*/, '').trim();
                        const subj = SUBJECTS.find((s) => s.id === topic.subjectId);
                        const matchedVid = findMatchingYouTubeVideo(
                          topic.subjectId,
                          topic.id,
                          cleanKeyword
                        );
                        const completed = progress.completedTopics.includes(topic.id);

                        return (
                          <div
                            key={topic.id}
                            className="rounded-xl border border-slate-200/90 bg-white overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleTopicExpand(topic.id)}
                              className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 cursor-pointer"
                            >
                              <div className="min-w-0 flex items-center gap-2">
                                <span aria-hidden="true" className="text-sm shrink-0">
                                  {subj?.emoji || '📘'}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-xs font-extrabold text-slate-900 truncate">
                                    {topic.title}
                                  </p>
                                  <p className="text-[10px] font-semibold text-slate-500">
                                    {topic.year} · {topic.subjectId}
                                    {completed ? ' · ✓ Completed' : ''}
                                  </p>
                                </div>
                              </div>
                              {isOpen ? (
                                <ChevronDown className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="px-3.5 pb-3 pt-2 bg-[#F8FAFC] border-t border-slate-200 space-y-2.5">
                                <p className="text-[11px] text-slate-700 leading-relaxed">
                                  {topic.objectives[0]}
                                </p>
                                <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] font-semibold">
                                  <button
                                    type="button"
                                    onClick={() => onOpenTopicInHub(topic)}
                                    className="px-2.5 py-1 rounded-lg bg-[#0F2147] text-white text-[11px] font-bold cursor-pointer"
                                  >
                                    Launch Activity
                                  </button>
                                  {matchedVid && (
                                    <a
                                      href={`https://www.youtube.com/watch?v=${matchedVid.youtubeId}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-rose-700 hover:text-rose-900 hover:underline inline-flex items-center gap-1"
                                    >
                                      <Youtube className="w-3 h-3" />
                                      Video
                                    </a>
                                  )}
                                  <a
                                    href={`https://www.bbc.co.uk/bitesize/search?q=${encodeURIComponent(
                                      cleanKeyword
                                    )}&d=BITESIZE`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-600 hover:text-sky-700 hover:underline inline-flex items-center gap-1"
                                  >
                                    BBC Bitesize <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <a
                                    href={`https://www.twinkl.co.uk/search?term=${encodeURIComponent(
                                      cleanKeyword
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                                  >
                                    Twinkl <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <a
                                    href={`https://www.thenational.academy/teachers/search?term=${encodeURIComponent(
                                      cleanKeyword
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1"
                                  >
                                    Oak <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {filteredDirectoryTopics.length === 0 && (
                        <p className="text-xs text-center text-slate-500 py-6">
                          No curriculum topics match &ldquo;{dirSearch}&rdquo;.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    NOTEPAD VIEW 3: TERM CALENDAR & SUBSCRIPTION / SYNC FIELD
                    ========================================================== */}
                {notepadMode === 'calendar' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                          England Primary Term Dates 2026/27
                        </h3>
                        <p className="text-[11px] text-slate-600">
                          Scroll dates below or subscribe &amp; sync your family calendar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTab('calendar')}
                        className="text-[11px] font-extrabold text-[#007185] hover:underline cursor-pointer"
                      >
                        Study Scheduler Tab →
                      </button>
                    </div>

                    {/* Scrollable Term Dates Sheet */}
                    <div className="max-h-[255px] overflow-y-auto pr-1.5 space-y-2 border-y border-slate-200 py-2">
                      {UK_SCHOOL_TERMS_2026_2027.map((evt, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-extrabold text-slate-900 truncate">
                              {evt.title}
                            </p>
                            <p className="text-[10px] text-slate-600 truncate">{evt.description}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1 shrink-0 tabular-nums">
                            <Clock className="w-3 h-3" />
                            {formatICSDateString(evt.startDate)} –{' '}
                            {formatICSDateString(evt.endDate)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Calendar Subscription & Sync Our Calendars Field */}
                    <div className="rounded-2xl bg-[#F0F9FF] border border-sky-200 p-4 space-y-3">
                      <div>
                        <p className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-sky-700" />
                          Calendar Subscription &amp; Sync Our Calendars
                        </p>
                        <p className="text-[11px] text-slate-700 mt-0.5">
                          Get term-date updates by email or sync straight to Apple, Google &amp;
                          Outlook calendars.
                        </p>
                      </div>

                      {!calSubscribed ? (
                        <form onSubmit={handleCalendarSubscribe} className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              value={calSubEmail}
                              onChange={(e) => setCalSubEmail(e.target.value)}
                              placeholder="Parent email for calendar alerts..."
                              className="w-full min-h-[38px] pl-8 pr-3 py-1.5 rounded-xl border border-sky-300 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600"
                            />
                          </div>
                          <button
                            type="submit"
                            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold cursor-pointer whitespace-nowrap"
                          >
                            Subscribe Calendar
                          </button>
                        </form>
                      ) : (
                        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          Subscribed {calSubEmail} to UK School Term &amp; Study Calendar updates!
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={downloadSchoolTermsCalendar}
                          className="px-3 py-1.5 rounded-lg bg-[#0F2147] text-white text-[11px] font-bold cursor-pointer"
                        >
                          Download .ics (Apple / Outlook)
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyCalendarFeed}
                          className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-950 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          {calFeedCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              Feed URL Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy webcal:// Sync Link
                            </>
                          )}
                        </button>
                        <a
                          href={getGoogleCalendarLink('UK Autumn Term & Home Study Routine')}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sky-950 text-[11px] font-bold inline-flex items-center gap-1"
                        >
                          Google Calendar <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* ==========================================================
                    NOTEPAD VIEW 4 (RED CARD): BLANK SHOPPING BAG PAGE & ARTICLES WITH LINKS
                    ========================================================== */}
                {notepadMode === 'shopping' && (
                  <div className="space-y-4">
                    {/* Interactive Blank Ruled Shopping Bag Page with Live Amazon Search Links */}
                    <div className="rounded-2xl bg-[#FFF1F2] border border-rose-200 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Custom Colourful 3D Family Shopping Bag Graphic */}
                          <svg
                            viewBox="0 0 48 52"
                            className="w-10 h-11 shrink-0 drop-shadow-xs"
                            aria-hidden="true"
                          >
                            <path
                              d="M15 16 C15 7 33 7 33 16"
                              fill="none"
                              stroke="#BE123C"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                            <path d="M7 16 L35 16 L38 46 L4 46 Z" fill="#F43F5E" rx="4" />
                            <path d="M35 16 L43 19 L45 43 L38 46 Z" fill="#BE123C" />
                            <path
                              d="M19 17 C19 9 35 9 35 17"
                              fill="none"
                              stroke="#881337"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                            />
                            <circle cx="21" cy="30" r="6.5" fill="#FFD814" />
                            <path
                              d="M17.5 31 Q21 34 24.5 31"
                              fill="none"
                              stroke="#1E293B"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-extrabold text-rose-950">
                              Family Shopping Bag ({shoppingList.length})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            onClick={handleResetShoppingDefaults}
                            className="text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
                          >
                            Reset List
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectTab('shopping')}
                            className="text-[11px] font-extrabold text-[#007185] hover:underline cursor-pointer"
                          >
                            All Bags →
                          </button>
                        </div>
                      </div>

                      {/* Bag Picker Row + Add a Custom Bag to Shop */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-rose-900 uppercase tracking-wider mr-0.5">
                            Bag:
                          </span>
                          {allBags.map((bag) => {
                            const active = selectedBag === bag;
                            return (
                              <button
                                key={bag}
                                type="button"
                                onClick={() => setSelectedBag(bag)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border cursor-pointer transition-colors ${
                                  active
                                    ? 'bg-rose-600 border-rose-700 text-white'
                                    : 'bg-white/85 border-rose-200 text-rose-900 hover:bg-white'
                                }`}
                              >
                                {bag}
                              </button>
                            );
                          })}
                          <button
                            type="button"
                            onClick={() => setShowNewBagInput((prev) => !prev)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-dashed border-rose-400 bg-rose-50 hover:bg-rose-100 text-rose-800 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                            New Bag
                          </button>
                        </div>

                        {showNewBagInput && (
                          <form onSubmit={handleAddCustomBag} className="flex gap-1.5">
                            <input
                              type="text"
                              value={newBagName}
                              onChange={(e) => setNewBagName(e.target.value)}
                              placeholder="Name new bag (e.g. PE Kit Bag)..."
                              className="flex-1 min-h-[32px] px-2.5 py-1 rounded-lg border border-rose-300 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
                            />
                            <button
                              type="submit"
                              className="min-h-[32px] px-3 py-1 rounded-lg bg-[#0F2147] text-white text-[11px] font-bold cursor-pointer shrink-0"
                            >
                              Create Bag
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Shopping List Items + 3 Empty Slots Directly Below to Add New Items */}
                      <div className="space-y-2">
                        {shoppingList.map((item) => {
                          const amazonSearchUrl = buildAmazonAllDiscountsUrl(
                            item.label,
                            DEFAULT_AMAZON_TAG
                          );
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between gap-2 bg-white px-2.5 py-2 rounded-xl border border-rose-200/80 shadow-2xs"
                            >
                              <button
                                type="button"
                                onClick={() => toggleShoppingItem(item.id)}
                                className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                              >
                                <CheckCircle2
                                  className={`w-4 h-4 shrink-0 ${
                                    item.checked ? 'text-emerald-600' : 'text-slate-300'
                                  }`}
                                />
                                <div className="min-w-0">
                                  <span
                                    className={`text-xs font-semibold block truncate ${
                                      item.checked
                                        ? 'line-through text-slate-400'
                                        : 'text-slate-900'
                                    }`}
                                  >
                                    {item.label}
                                  </span>
                                  {item.bagName && (
                                    <span className="text-[10px] font-bold text-rose-700 block truncate">
                                      {item.bagName}
                                    </span>
                                  )}
                                </div>
                              </button>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={amazonSearchUrl}
                                  target="_blank"
                                  rel="nofollow sponsored noopener noreferrer"
                                  title={`Shop "${item.label}" on Amazon UK`}
                                  className="px-3 py-1.5 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#F59E0B] text-[#0F1111] text-[11px] font-extrabold inline-flex items-center gap-1 whitespace-nowrap"
                                >
                                  <ShoppingBag className="w-3 h-3 text-[#C45500]" />
                                  Shop
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => removeShoppingItem(item.id)}
                                  aria-label={`Remove ${item.label}`}
                                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* 3 Empty Blank Lined Slots Ready to Type & Add Directly */}
                        {emptySlotValues.map((slotVal, slotIdx) => {
                          const trimmedVal = slotVal.trim();
                          const slotShopUrl = trimmedVal
                            ? buildAmazonAllDiscountsUrl(trimmedVal, DEFAULT_AMAZON_TAG)
                            : undefined;

                          return (
                            <form
                              key={`empty-slot-${slotIdx}`}
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEmptySlot(slotIdx);
                              }}
                              className="flex items-center justify-between gap-2 bg-white/85 px-2.5 py-1.5 rounded-xl border border-dashed border-rose-300 focus-within:border-rose-500 focus-within:bg-white transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span
                                  aria-hidden="true"
                                  className="w-4 h-4 rounded-full border-2 border-dashed border-rose-300 shrink-0"
                                />
                                <input
                                  type="text"
                                  value={slotVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setEmptySlotValues((prev) =>
                                      prev.map((v, i) => (i === slotIdx ? val : v))
                                    );
                                  }}
                                  placeholder={`Empty slot ${slotIdx + 1} — write item for ${selectedBag}...`}
                                  className="w-full min-h-[30px] bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                />
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {slotShopUrl && (
                                  <a
                                    href={slotShopUrl}
                                    target="_blank"
                                    rel="nofollow sponsored noopener noreferrer"
                                    onClick={() => handleSaveEmptySlot(slotIdx)}
                                    title={`Shop "${trimmedVal}" on Amazon UK`}
                                    className="px-2.5 py-1 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#F59E0B] text-[#0F1111] text-[10px] font-extrabold inline-flex items-center gap-1 whitespace-nowrap"
                                  >
                                    <ShoppingBag className="w-3 h-3 text-[#C45500]" />
                                    Shop
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                                <button
                                  type="submit"
                                  disabled={!trimmedVal}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold inline-flex items-center gap-1 whitespace-nowrap transition-colors ${
                                    trimmedVal
                                      ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                                      : 'bg-rose-100 text-rose-400 cursor-default'
                                  }`}
                                >
                                  <Plus className="w-3 h-3" />
                                  Add
                                </button>
                              </div>
                            </form>
                          );
                        })}
                      </div>

                      {/* Quick Bottom Add Bar */}
                      <form onSubmit={handleAddShoppingItem} className="flex gap-2 pt-0.5">
                        <input
                          type="text"
                          value={newShopItem}
                          onChange={(e) => setNewShopItem(e.target.value)}
                          placeholder={`Quick add to ${selectedBag}...`}
                          className="flex-1 min-h-[36px] px-3 py-1.5 rounded-xl border border-rose-200 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="submit"
                          className="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Bag
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
