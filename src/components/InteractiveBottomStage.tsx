import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BellRing,
  BookOpen,
  Calendar,
  CalendarPlus,
  Check,
  Download,
  ExternalLink,
  Pin,
  Play,
  Sparkles,
  Trash2,
  Volume2,
} from 'lucide-react';
import { TOPICS } from '../data/curriculum';
import { SURPRISE_FUN_FACTS } from '../data/learningWorlds';
import { CustomRevisionEvent, Topic } from '../types';
import {
  downloadSchoolTermsCalendar,
  downloadTopicRevisionEvent,
  getGoogleCalendarLink,
  UK_SCHOOL_TERMS_2026_2027,
} from '../utils/calendarSync';
import { speakText } from '../utils/speech';
import { InterestIllustration, WorldBannerIllustration } from './WorldIllustrations';
import { playChimeSound } from './CorridorWidgets';
import { NewsletterSubscription } from './NewsletterSubscription';

interface InteractiveBottomStageProps {
  onOpenTopic: (topic: Topic) => void;
  onEarnStar: () => void;
}

interface BookPageItem {
  id: string;
  pageNumber: number;
  shelfTitle: string;
  spineColor: string;
  spineBorder: string;
  chapter: string;
  title: string;
  description: string;
  fact: string;
  illustrationType: 'world' | 'interest';
  illustrationKey: string;
  topicId: string;
  accentBg: string;
  accentBorder: string;
}

const BOOK_PAGES: BookPageItem[] = [
  {
    id: 'page-maths',
    pageNumber: 1,
    shelfTitle: 'Maths',
    spineColor: 'from-sky-500 to-blue-700',
    spineBorder: 'border-sky-300',
    chapter: 'Chapter 1 · Magical Maths',
    title: 'Number Bonds & Times Tables Explorer',
    description:
      'Count in steps, spot number patterns, and master 2×, 5×, and 10× tables with interactive visual puzzles.',
    fact: SURPRISE_FUN_FACTS[1]?.fact || 'Zero was one of the greatest inventions in mathematics history!',
    illustrationType: 'world',
    illustrationKey: 'maths',
    topicId: 'm-y2-multiplication',
    accentBg: 'from-sky-50 to-indigo-50',
    accentBorder: 'border-sky-300',
  },
  {
    id: 'page-science',
    pageNumber: 2,
    shelfTitle: 'Science',
    spineColor: 'from-emerald-500 to-teal-700',
    spineBorder: 'border-emerald-300',
    chapter: 'Chapter 2 · Science Discovery',
    title: 'Everyday Materials & How Plants Grow',
    description:
      'Investigate wood, glass, metal, plastic, and discover how sunshine and rain help tiny seeds blossom.',
    fact: SURPRISE_FUN_FACTS[0]?.fact || 'Materials have amazing properties like waterproof, stretchy, and rigid!',
    illustrationType: 'world',
    illustrationKey: 'science',
    topicId: 's-y2-materials',
    accentBg: 'from-emerald-50 to-teal-50',
    accentBorder: 'border-emerald-300',
  },
  {
    id: 'page-space',
    pageNumber: 3,
    shelfTitle: 'Space',
    spineColor: 'from-indigo-500 to-purple-700',
    spineBorder: 'border-indigo-300',
    chapter: 'Chapter 3 · Space Adventure',
    title: 'Journey Across the Solar System',
    description:
      'Orbit the Sun, explore rocky inner planets and gas giants, and discover why the Moon changes shape.',
    fact: 'One day on Venus is longer than an entire year on Venus because it spins so slowly!',
    illustrationType: 'interest',
    illustrationKey: 'space',
    topicId: 's-y5-space',
    accentBg: 'from-indigo-50 to-purple-50',
    accentBorder: 'border-indigo-300',
  },
  {
    id: 'page-history',
    pageNumber: 4,
    shelfTitle: 'History',
    spineColor: 'from-amber-500 to-orange-700',
    spineBorder: 'border-amber-300',
    chapter: 'Chapter 4 · Time Travel',
    title: 'The Great Fire of London 1666',
    description:
      'Step back into 17th-century Pudding Lane and uncover eyewitness diaries from Samuel Pepys.',
    fact: SURPRISE_FUN_FACTS[3]?.fact || 'Historians piece together the past using letters, objects, and diaries!',
    illustrationType: 'world',
    illustrationKey: 'history',
    topicId: 'h-london-1666',
    accentBg: 'from-amber-50 to-orange-50',
    accentBorder: 'border-amber-300',
  },
  {
    id: 'page-dinosaurs',
    pageNumber: 5,
    shelfTitle: 'Fossils',
    spineColor: 'from-rose-500 to-pink-700',
    spineBorder: 'border-rose-300',
    chapter: 'Chapter 5 · Earth & Fossils',
    title: 'Rocks, Fossils & Living Habitats',
    description:
      'Uncover ancient footprints preserved in sedimentary rock and explore food chains across habitats.',
    fact: 'Ammonite fossils are over 66 million years old and used to swim in ancient UK seas!',
    illustrationType: 'interest',
    illustrationKey: 'dinosaurs',
    topicId: 's-y2-habitats',
    accentBg: 'from-rose-50 to-amber-50',
    accentBorder: 'border-rose-300',
  },
];

const NOTEPAD_EVENTS_KEY = 'schoola_desk_notepad_events';

function formatTermDate(ics: string): string {
  if (ics.length !== 8) return ics;
  const y = ics.slice(0, 4);
  const m = Number(ics.slice(4, 6)) - 1;
  const d = Number(ics.slice(6, 8));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m] ?? ''} ${y}`;
}

export const InteractiveBottomStage: React.FC<InteractiveBottomStageProps> = ({
  onOpenTopic,
  onEarnStar,
}) => {
  // Flipbook / Bookshelf state
  const [pageIdx, setPageIdx] = useState(0);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [flippedRewardGiven, setFlippedRewardGiven] = useState<Record<number, boolean>>({});

  // Live Wall Clock state
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calendar flip & sync state
  const [termPage, setTermPage] = useState(0);
  const [schedTopicId, setSchedTopicId] = useState(TOPICS[0]?.id || '');
  const [customNote, setCustomNote] = useState('');
  const [schedDate, setSchedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [schedTime, setSchedTime] = useState('16:00');
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Notification permission state
  const [notifStatus, setNotifStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  // Saved notepad events
  const [savedEvents, setSavedEvents] = useState<CustomRevisionEvent[]>(() => {
    try {
      const raw = localStorage.getItem(NOTEPAD_EVENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NOTEPAD_EVENTS_KEY, JSON.stringify(savedEvents));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [savedEvents]);

  const currentPage = BOOK_PAGES[pageIdx];
  const matchedBookTopic = useMemo(
    () => TOPICS.find((t) => t.id === currentPage.topicId) || TOPICS[0],
    [currentPage.topicId]
  );

  const totalTermPages = Math.ceil(UK_SCHOOL_TERMS_2026_2027.length / 4);
  const visibleTerms = UK_SCHOOL_TERMS_2026_2027.slice(termPage * 4, termPage * 4 + 4);

  const selectedTopicObj = useMemo(
    () => TOPICS.find((t) => t.id === schedTopicId) || TOPICS[0],
    [schedTopicId]
  );

  const activeEventTitle = customNote.trim()
    ? customNote.trim()
    : selectedTopicObj?.title || 'Schoola Study Session';

  const handleTurnPage = (nextIdx: number) => {
    const bounded = (nextIdx + BOOK_PAGES.length) % BOOK_PAGES.length;
    setFlipDirection(nextIdx > pageIdx || (pageIdx === BOOK_PAGES.length - 1 && nextIdx === 0) ? 1 : -1);
    setPageIdx(bounded);
    playChimeSound('step');

    if (!flippedRewardGiven[bounded] && bounded !== 0) {
      setFlippedRewardGiven((prev) => ({ ...prev, [bounded]: true }));
      if (Object.keys(flippedRewardGiven).length === 2) {
        onEarnStar();
      }
    }
  };

  const handleDownloadAllTerms = () => {
    downloadSchoolTermsCalendar();
    playChimeSound('success');
    setSyncNotice('Downloaded 2026/2027 UK School Terms (.ics) — open to add to Apple, Google, or Outlook Calendar!');
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const handleDownloadStudyReminder = () => {
    downloadTopicRevisionEvent(activeEventTitle, schedDate, schedTime);
    playChimeSound('success');
    setSyncNotice(`Downloaded .ics reminder for "${activeEventTitle.replace(/^[^:—]+[:—]\s*/, '')}"!`);
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const handlePinEventToNotepad = () => {
    const newEvt: CustomRevisionEvent = {
      id: `evt-${Date.now()}`,
      topicId: schedTopicId,
      topicTitle: activeEventTitle,
      date: schedDate,
      time: schedTime,
    };
    setSavedEvents((prev) => [newEvt, ...prev].slice(0, 6));
    setCustomNote('');
    playChimeSound('success');
    setSyncNotice(`Pinned "${newEvt.topicTitle.replace(/^[^:—]+[:—]\s*/, '')}" onto your study notepad!`);
    setTimeout(() => setSyncNotice(null), 5000);
  };

  const handleAllowNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotifStatus('unsupported');
      setSyncNotice('Browser notifications are unavailable here — use Download Reminder (.ics) or Google Calendar sync instead!');
      setTimeout(() => setSyncNotice(null), 5000);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotifStatus(permission);
      if (permission === 'granted') {
        playChimeSound('success');
        new Notification('Schoola Study Bell Enabled!', {
          body: 'You will get helpful reminders for scheduled UK curriculum sessions.',
        });
        setSyncNotice('Notifications enabled! Study reminders will chime right on time.');
      } else {
        setSyncNotice('Notifications blocked by browser — you can still sync events via .ics or Google Calendar.');
      }
      setTimeout(() => setSyncNotice(null), 5000);
    } catch {
      setSyncNotice('Could not open notification prompt in embedded preview — use .ics or Google Calendar sync.');
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const googleCalHref = getGoogleCalendarLink(activeEventTitle, schedDate, schedTime);

  // Clock hand angles
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  const secDeg = seconds * 6;
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = hours * 30 + minutes * 0.5;
  const digitalTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <section
      aria-label="Interactive Library Bookshelf, Wall Clock, Calendar, Notepad and Newsletter"
      className="w-full bg-gradient-to-b from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] text-white border-b-4 border-amber-800"
    >
      {/* BLUE STUDY ROOM WALL + DESK SCENE */}
      <div className="relative w-full px-6 sm:px-10 lg:px-16 pt-14 pb-16 sm:pt-18 sm:pb-20 space-y-12 overflow-hidden">
        {/* Subtle Starry Wallpaper Accents */}
        <div className="pointer-events-none absolute top-6 left-[12%] text-sky-300/30 text-2xl">✦</div>
        <div className="pointer-events-none absolute top-14 right-[18%] text-amber-300/30 text-xl">✦</div>
        <div className="pointer-events-none absolute top-40 left-[48%] text-sky-200/20 text-3xl">✦</div>

        {/* Section Heading */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-playful font-bold text-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Blue Library &amp; Study Desk
            </span>
            <h2 className="font-playful font-bold text-2xl sm:text-3xl text-white">
              Choose a Book, Flip the Pages &amp; Plan Your Term
            </h2>
          </div>

          {/* Allow Notifications Button on Top Right */}
          <button
            type="button"
            onClick={handleAllowNotifications}
            className={`min-h-[42px] px-4 py-2 rounded-2xl border-2 border-b-4 font-playful font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap shrink-0 ${
              notifStatus === 'granted'
                ? 'bg-emerald-400 border-emerald-700 text-slate-950'
                : 'bg-amber-400 hover:bg-amber-300 border-amber-700 text-slate-950'
            }`}
          >
            {notifStatus === 'granted' ? (
              <>
                <BellRing className="w-4 h-4" />
                Notifications Allowed
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Allow Study Notifications
              </>
            )}
          </button>
        </div>

        {/* MAIN 2-COLUMN ROOM LAYOUT: LEFT = BOOKSHELF + OPEN STORYBOOK | RIGHT = WALL CLOCK + WALL CALENDAR + DESK NOTEPAD */}
        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
          {/* LEFT WALL + DESK: CHOOSE A BOOK FROM THE SHELF + FLIP THE PAGES! */}
          <div className="xl:col-span-6 space-y-8">
            {/* 1. WOODEN BOOKSHELF ON THE BLUE WALL */}
            <div className="bg-slate-950/25 border-2 border-sky-300/30 rounded-3xl p-6 sm:p-7 shadow-lg">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-playful font-bold text-base sm:text-lg text-amber-200 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Choose a book from the shelf</span>
                </h3>
                <span className="text-xs font-bold text-sky-100">Tap any spine to open!</span>
              </div>

              {/* Upright Colourful Books Standing on Wooden Plank */}
              <div className="flex items-end gap-3 sm:gap-4 pt-3 px-2 overflow-x-auto">
                {BOOK_PAGES.map((book, idx) => {
                  const isActive = idx === pageIdx;
                  return (
                    <motion.button
                      key={book.id}
                      type="button"
                      whileHover={{ y: -8 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleTurnPage(idx)}
                      className={`relative flex-1 min-w-[68px] rounded-t-xl border-2 border-b-0 px-2.5 py-3.5 text-center transition-all cursor-pointer bg-gradient-to-b ${book.spineColor} ${book.spineBorder} shadow-md ${
                        isActive
                          ? 'h-28 -translate-y-2 ring-3 ring-amber-300 shadow-xl'
                          : 'h-24 opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full h-1.5 bg-white/35 rounded-full mb-2" />
                      <span className="block font-playful font-extrabold text-xs sm:text-sm text-white leading-tight">
                        {book.shelfTitle}
                      </span>
                      <span className="block text-[10px] font-mono font-bold text-white/85 mt-1">
                        Book {book.pageNumber}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {/* Wooden Shelf Plank */}
              <div className="h-4 w-full rounded-xl bg-gradient-to-b from-[#D97706] to-[#78350F] border-b-4 border-[#451A03] shadow-md" />
            </div>

            {/* 2. OPEN STORYBOOK ON THE DESK — FLIP THE PAGES! */}
            <div className="bg-[#FFFBEB] text-slate-900 border-4 border-amber-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200">
                <div>
                  <h3 className="font-playful font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                    <span>📖</span>
                    <span>Flip the Pages!</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Reading: <strong className="text-indigo-700">{currentPage.shelfTitle} Explorer</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTurnPage(pageIdx - 1)}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-playful font-bold text-xs flex items-center gap-1 cursor-pointer"
                    aria-label="Previous book page"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-600 px-1.5 tabular-nums">
                    {pageIdx + 1}/{BOOK_PAGES.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTurnPage(pageIdx + 1)}
                    className="min-h-[38px] px-3.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-playful font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                    aria-label="Flip to next book page"
                  >
                    Flip Page
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Animated Two-Page Spread */}
              <div className="relative overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentPage.id}
                    initial={{ opacity: 0, x: flipDirection * 48, rotateY: flipDirection * 10 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: flipDirection * -48, rotateY: flipDirection * -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className={`bg-gradient-to-br ${currentPage.accentBg} border-2 ${currentPage.accentBorder} rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-left`}
                  >
                    <div className="md:col-span-5 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                      {currentPage.illustrationType === 'world' ? (
                        <WorldBannerIllustration
                          worldKey={currentPage.illustrationKey as 'maths' | 'science' | 'english' | 'geography' | 'history' | 'creative'}
                          className="w-full h-44 object-cover"
                        />
                      ) : (
                        <InterestIllustration
                          interestKey={currentPage.illustrationKey as 'dinosaurs' | 'space' | 'treasure' | 'storyland' | 'volcano' | 'code'}
                          className="w-full h-44 object-cover"
                        />
                      )}
                    </div>

                    <div className="md:col-span-7 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-indigo-800">{currentPage.chapter}</span>
                        <button
                          type="button"
                          onClick={() => speakText(`${currentPage.title}. ${currentPage.fact}`)}
                          className="min-h-[32px] px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          Read aloud
                        </button>
                      </div>

                      <h4 className="font-playful font-bold text-lg text-slate-900 leading-snug">
                        {currentPage.title}
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">{currentPage.description}</p>

                      <div className="bg-white/90 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
                        <strong className="text-indigo-700">Fun Fact: </strong>
                        {currentPage.fact}
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenTopic(matchedBookTopic)}
                          className="min-h-[40px] px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-playful font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Open Activity
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT WALL & DESK: WALL CLOCK + WALL CALENDAR + DESK SPIRAL NOTEPAD */}
          <div className="xl:col-span-6 space-y-8">
            {/* ON THE WALL: ANALOG CLOCK + HANGING UK SCHOOL CALENDAR */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
              {/* Live Wall Clock */}
              <div className="sm:col-span-4 bg-slate-950/25 border-2 border-sky-300/30 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 shadow-lg">
                <div className="relative w-28 h-28">
                  <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" role="img" aria-label={`Study clock showing ${digitalTime}`}>
                    {/* Brass Clock Frame */}
                    <circle cx="60" cy="60" r="56" fill="#F59E0B" stroke="#78350F" strokeWidth="4" />
                    <circle cx="60" cy="60" r="48" fill="#FFFEF7" stroke="#FDE68A" strokeWidth="2" />
                    {/* Hour ticks */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                      <line
                        key={deg}
                        x1="60"
                        y1="16"
                        x2="60"
                        y2={deg % 90 === 0 ? '23' : '20'}
                        stroke="#1E293B"
                        strokeWidth={deg % 90 === 0 ? '3' : '1.5'}
                        strokeLinecap="round"
                        transform={`rotate(${deg} 60 60)`}
                      />
                    ))}
                    {/* Hour hand */}
                    <line
                      x1="60"
                      y1="60"
                      x2="60"
                      y2="34"
                      stroke="#0F172A"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                      transform={`rotate(${hourDeg} 60 60)`}
                    />
                    {/* Minute hand */}
                    <line
                      x1="60"
                      y1="60"
                      x2="60"
                      y2="24"
                      stroke="#1D4ED8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform={`rotate(${minDeg} 60 60)`}
                    />
                    {/* Second hand */}
                    <line
                      x1="60"
                      y1="66"
                      x2="60"
                      y2="20"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      transform={`rotate(${secDeg} 60 60)`}
                    />
                    <circle cx="60" cy="60" r="4" fill="#EF4444" />
                  </svg>
                </div>
                <div className="text-center">
                  <span className="font-mono font-extrabold text-lg text-amber-300 tabular-nums block leading-none">
                    {digitalTime}
                  </span>
                  <span className="text-[11px] font-bold text-sky-100 mt-1 block">Wall Study Clock</span>
                </div>
              </div>

              {/* Hanging Wall Calendar */}
              <div className="sm:col-span-8 bg-white text-slate-900 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl flex flex-col">
                {/* Red Calendar Wall Header with Metallic Loops */}
                <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <h3 className="font-playful font-bold text-sm sm:text-base leading-tight">
                        UK School Calendar 2026/2027
                      </h3>
                      <p className="text-[10px] text-rose-100 font-semibold">Pinned on the classroom wall</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadAllTerms}
                    className="min-h-[34px] px-3 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-playful font-extrabold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Sync All Terms (.ics)
                  </button>
                </div>

                {/* Term Dates Page Flipper */}
                <div className="p-5 space-y-3.5 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>England Primary Term Dates</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTermPage((p) => (p - 1 + totalTermPages) % totalTermPages)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        aria-label="Previous calendar terms"
                      >
                        ←
                      </button>
                      <span className="font-mono tabular-nums">
                        {termPage + 1}/{totalTermPages}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTermPage((p) => (p + 1) % totalTermPages)}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        aria-label="Next calendar terms"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visibleTerms.map((term) => (
                      <div
                        key={term.title}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-left space-y-1"
                      >
                        <p className="text-[11px] font-bold text-slate-900 line-clamp-1">{term.title}</p>
                        <p className="text-[10px] font-mono text-rose-700 font-bold tabular-nums">
                          {formatTermDate(term.startDate)} – {formatTermDate(term.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ON THE WOODEN DESK: SPIRAL NOTEPAD FOR EVENTS, SYNC & REMINDERS */}
            <div className="relative bg-[#FEF9C3] text-slate-900 rounded-3xl border-2 border-amber-400 border-b-4 shadow-2xl overflow-hidden">
              {/* Notepad Metallic Spiral Coils */}
              <div className="flex items-center justify-around bg-amber-300/70 py-2.5 px-4 border-b-2 border-rose-400/70">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="w-3 h-3 rounded-full bg-slate-700 ring-2 ring-slate-200 shadow-xs"
                  />
                ))}
              </div>

              <div className="p-6 sm:p-7 pl-7 sm:pl-9 border-l-4 border-rose-300 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-playful font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5 text-rose-600" />
                    <span>Desk Study Notepad · Events &amp; Calendar Sync</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                    Schedule &amp; Notify
                  </span>
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <select
                    value={schedTopicId}
                    onChange={(e) => setSchedTopicId(e.target.value)}
                    aria-label="Choose UK topic for study session"
                    className="sm:col-span-6 min-h-[40px] px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    {TOPICS.slice(0, 36).map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.year}] {t.title}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    aria-label="Event date"
                    className="sm:col-span-3 min-h-[40px] px-2.5 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-slate-800"
                  />
                  <input
                    type="time"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    aria-label="Event time"
                    className="sm:col-span-3 min-h-[40px] px-2.5 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-slate-800"
                  />
                </div>

                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Optional note or custom event (e.g., Times Tables practice or School Assembly)..."
                  aria-label="Custom study note or event title"
                  className="w-full min-h-[38px] px-3 py-1.5 rounded-xl border border-amber-300 bg-white/95 text-xs font-medium text-slate-800 placeholder:text-slate-400"
                />

                {/* Notepad Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePinEventToNotepad}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-playful font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Pin className="w-3.5 h-3.5" />
                    Pin to Notepad
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadStudyReminder}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Reminder (.ics)
                  </button>

                  <a
                    href={googleCalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-400 text-sky-900 text-xs font-bold flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Sync to Google Calendar
                  </a>
                </div>

                {/* Pinned Notepad Events List */}
                {savedEvents.length > 0 && (
                  <div className="pt-2 border-t border-amber-300/70 space-y-1.5">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900">
                      Pinned Study Notes &amp; Events
                    </p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {savedEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between gap-2 bg-white/85 border border-amber-200 rounded-xl px-3 py-1.5 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{ev.topicTitle}</p>
                            <p className="text-[10px] font-mono text-slate-600 tabular-nums">
                              {ev.date} · {ev.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => downloadTopicRevisionEvent(ev.topicTitle, ev.date, ev.time)}
                              className="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[10px] font-bold cursor-pointer"
                              aria-label={`Download calendar file for ${ev.topicTitle}`}
                            >
                              .ics
                            </button>
                            <button
                              type="button"
                              onClick={() => setSavedEvents((prev) => prev.filter((item) => item.id !== ev.id))}
                              className="p-1 rounded-lg hover:bg-rose-100 text-rose-700 cursor-pointer"
                              aria-label={`Remove ${ev.topicTitle}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {syncNotice && (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-xl px-3 py-2 flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{syncNotice}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WARM WOODEN DESK EDGE DIVIDER */}
      <div className="w-full h-5 bg-gradient-to-b from-[#B45309] via-[#92400E] to-[#78350F] border-t-2 border-amber-400/50 shadow-inner" />

      {/* WEEKLY EMAIL NEWSLETTER BAND */}
      <div className="w-full bg-[#0F172A] px-6 sm:px-10 lg:px-16 py-14 sm:py-16">
        <NewsletterSubscription
          onSubscribeSuccess={() => {
            playChimeSound('success');
            onEarnStar();
          }}
        />
      </div>
    </section>
  );
};
