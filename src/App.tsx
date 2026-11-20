import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Lock, Moon, Palette, ShieldCheck, Sparkles, Star, Sun, Volume2, X } from 'lucide-react';
import {
  CustomRevisionEvent,
  LearnerProgress,
  MascotId,
  Topic,
  UserRole,
  YearGroup,
} from './types';
import { SUBJECTS, TOPICS } from './data/curriculum';
import { matchesYearFilter } from './data/learningWorlds';
import { WelcomeGateway } from './components/WelcomeGateway';
import { ChildDashboard } from './components/ChildDashboard';
import { ActivityLandMap } from './components/ActivityLandMap';
import { LearningHub } from './components/LearningHub';
import { ParentTeacherHub } from './components/ParentTeacherHub';
import { PrintableCertificateModal } from './components/PrintableCertificateModal';
import { VoicePickerModal } from './components/VoicePickerControl';
import { RedOrangeDoorIcon } from './components/WorldIllustrations';
import { stopSpeaking } from './utils/speech';
import { playCheerfulTing, playWelcomeLaughOnOpen } from './utils/soundEffects';
import { useDeviceProfile } from './utils/deviceDetection';

const PROGRESS_STORAGE_KEY = 'schoola_v2_progress';
const THEME_STORAGE_KEY = 'schoola_v2_theme';
const CHECKLIST_STORAGE_KEY = 'schoola_weekly_checklist';
const EVENTS_STORAGE_KEY = 'schoola_custom_events';

type ThemeMode = 'light' | 'dark' | 'pastel';

const DEFAULT_PROGRESS: LearnerProgress = {
  explorerName: 'Young Explorer',
  selectedYear: 'Year 2',
  mascotId: 'sparkle',
  stars: 0,
  streakDays: 1,
  lastActiveDate: null,
  dailyChallengeCompletedDate: null,
  watchedTopics: [],
  playedTopics: [],
  completedTopics: [],
  favouriteTopics: [],
  quizScores: {},
  recentTopicIds: [],
  unlockedFactIds: [],
  adoptedPrizes: ['creature-pip-sprout'],
  weeklyGoalTarget: 5,
};

export default function App() {
  const [role, setRole] = useState<UserRole>('welcome');
  const [childViewMode, setChildViewMode] = useState<'map' | 'dashboard'>('map');
  const [activeWorldSubjectId, setActiveWorldSubjectId] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  const [progress, setProgress] = useState<LearnerProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
      // Migrate existing mastered topics or stars from earlier session if present
      const legacyMastered = localStorage.getItem('schoola_mastered_topics');
      const legacyCoins = localStorage.getItem('schoola_star_coins');
      return {
        ...DEFAULT_PROGRESS,
        completedTopics: legacyMastered ? JSON.parse(legacyMastered) : [],
        stars: legacyCoins ? parseInt(legacyCoins, 10) || 0 : 0,
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'pastel') {
        return saved;
      }
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  // Automatically detect iPhone, iPad, mobile, tablet, or desktop & keep HTML device classes synced
  useDeviceProfile();

  const [weeklyChecklist, setWeeklyChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : { read_15: false, watch_video: false, do_quiz: false, maths_10: false };
    } catch {
      return { read_15: false, watch_video: false, do_quiz: false, maths_10: false };
    }
  });

  const [customEvents, setCustomEvents] = useState<CustomRevisionEvent[]>(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [directoryKS, setDirectoryKS] = useState<'ks1' | 'ks2'>('ks1');
  const [certTitle, setCertTitle] = useState<string | null>(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [mascotExpression, setMascotExpression] = useState<
    'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited'
  >('happy');
  const [mascotMessage, setMascotMessage] = useState(
    'Hi Explorer! Pick a daily challenge or enter a Learning World to start your adventure!'
  );

  // On initial website open: stay silent (no spoken words) and play a gentle happy laugh sound
  useEffect(() => {
    stopSpeaking();
    const cancelWelcomeSound = playWelcomeLaughOnOpen();
    return () => {
      cancelWelcomeSound();
    };
  }, []);

  // Persist locally (privacy-first, no personal data leaves the device)
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#090E1A' : '#001E62');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(weeklyChecklist));
  }, [weeklyChecklist]);

  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(customEvents));
  }, [customEvents]);

  // Update daily learning streak cleanly when engaging
  const touchStreak = (prev: LearnerProgress): Pick<LearnerProgress, 'streakDays' | 'lastActiveDate'> => {
    const today = new Date().toISOString().split('T')[0];
    if (prev.lastActiveDate === today) {
      return { streakDays: prev.streakDays, lastActiveDate: today };
    }
    if (!prev.lastActiveDate) {
      return { streakDays: 1, lastActiveDate: today };
    }
    const prevDate = new Date(prev.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      streakDays: diffDays === 1 ? prev.streakDays + 1 : 1,
      lastActiveDate: today,
    };
  };

  const handleOpenTopic = (topic: Topic) => {
    stopSpeaking();
    setActiveTopic(topic);
    setActiveWorldSubjectId(topic.subjectId);
    setRole('child');
    setProgress((prev) => ({
      ...prev,
      recentTopicIds: [topic.id, ...prev.recentTopicIds.filter((id) => id !== topic.id)].slice(0, 6),
    }));
    setMascotExpression('excited');
    setMascotMessage(`Let's explore "${topic.title.replace(/^[^:—]+[:—]\s*/, '')}" together!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStageWatchDone = (topicId: string) => {
    if (!progress.watchedTopics.includes(topicId)) {
      playCheerfulTing('star');
    }
    setProgress((prev) => {
      const already = prev.watchedTopics.includes(topicId);
      const streak = touchStreak(prev);
      return {
        ...prev,
        ...streak,
        watchedTopics: already ? prev.watchedTopics : [...prev.watchedTopics, topicId],
        stars: already ? prev.stars : prev.stars + 2,
      };
    });
  };

  const handleStagePlayDone = (topicId: string) => {
    if (!progress.playedTopics.includes(topicId)) {
      playCheerfulTing('star');
    }
    setProgress((prev) => {
      const already = prev.playedTopics.includes(topicId);
      const streak = touchStreak(prev);
      return {
        ...prev,
        ...streak,
        playedTopics: already ? prev.playedTopics : [...prev.playedTopics, topicId],
        stars: already ? prev.stars : prev.stars + 2,
      };
    });
  };

  const handleTopicQuizDone = (topicId: string, score: number, _total: number, starsEarned: number) => {
    const awardedStars = progress.completedTopics.includes(topicId) ? 1 : starsEarned;
    if (awardedStars > 0) {
      playCheerfulTing('star');
    }
    setProgress((prev) => {
      const alreadyCompleted = prev.completedTopics.includes(topicId);
      const bestScore = Math.max(prev.quizScores[topicId] ?? 0, score);
      const streak = touchStreak(prev);
      return {
        ...prev,
        ...streak,
        completedTopics: alreadyCompleted
          ? prev.completedTopics
          : [...prev.completedTopics, topicId],
        quizScores: { ...prev.quizScores, [topicId]: bestScore },
        stars: prev.stars + (alreadyCompleted ? 1 : starsEarned),
      };
    });
  };

  const handleCompleteDailyChallenge = (starsEarned: number) => {
    playCheerfulTing('challenge');
    const today = new Date().toISOString().split('T')[0];
    setProgress((prev) => {
      const streak = touchStreak(prev);
      return {
        ...prev,
        ...streak,
        dailyChallengeCompletedDate: today,
        stars: prev.stars + starsEarned,
      };
    });
  };

  const handleToggleFavourite = (topicId: string) => {
    setProgress((prev) => {
      const exists = prev.favouriteTopics.includes(topicId);
      return {
        ...prev,
        favouriteTopics: exists
          ? prev.favouriteTopics.filter((id) => id !== topicId)
          : [topicId, ...prev.favouriteTopics],
      };
    });
  };

  const handleCycleMascot = () => {
    const order: MascotId[] = ['sparkle', 'jack', 'celeste', 'pippa'];
    const next = order[(order.indexOf(progress.mascotId) + 1) % order.length];
    setProgress((prev) => ({ ...prev, mascotId: next }));
    const intros: Record<MascotId, string> = {
      sparkle: 'Hi! I am Sparkle! Tap any Learning World to discover stories, sums and stars!',
      jack: 'Abacus Jack reporting in! Ready for number trails and treasure puzzles?',
      celeste: 'Celeste here! Let’s travel through history scrolls and magical words!',
      pippa: 'Pippa ready for action! Let’s explore science experiments and world maps!',
    };
    setMascotExpression('excited');
    setMascotMessage(intros[next]);
  };

  const handleAdoptPrize = (prizeId: string, cost: number) => {
    setProgress((prev) => {
      if (prev.adoptedPrizes.includes(prizeId) || prev.stars < cost) return prev;
      return {
        ...prev,
        stars: prev.stars - cost,
        adoptedPrizes: [...prev.adoptedPrizes, prizeId],
      };
    });
  };

  const handleResetProgress = () => {
    stopSpeaking();
    setProgress(DEFAULT_PROGRESS);
    setWeeklyChecklist({ read_15: false, watch_video: false, do_quiz: false, maths_10: false });
    setCustomEvents([]);
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem('schoola_mastered_topics');
    localStorage.removeItem('schoola_star_coins');
  };

  const activeSubject = useMemo(
    () => (activeTopic ? SUBJECTS.find((s) => s.id === activeTopic.subjectId) || SUBJECTS[0] : null),
    [activeTopic]
  );

  const nextTopicInWorld = useMemo(() => {
    if (!activeTopic) return null;
    const worldList = TOPICS.filter(
      (t) =>
        t.subjectId === activeTopic.subjectId &&
        matchesYearFilter(t, progress.selectedYear)
    );
    const list = worldList.length > 0 ? worldList : TOPICS.filter((t) => t.subjectId === activeTopic.subjectId);
    const idx = list.findIndex((t) => t.id === activeTopic.id);
    if (idx === -1 || idx + 1 >= list.length) return list[0]?.id !== activeTopic.id ? list[0] : null;
    return list[idx + 1];
  }, [activeTopic, progress.selectedYear]);

  const rootThemeClass = `theme-${theme}`;
  const isMapFocus = role === 'child' && !activeTopic && childViewMode === 'map';

  const childFaceIcon = (
    <svg viewBox="0 0 28 28" className="w-6 h-6 shrink-0" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
      <path d="M5 12 C6 5 12 3 18 4 C22 5 24 8 23 12 C20 9 16 8 11 9 C8 10 6 11 5 12 Z" fill="#92400E" />
      <circle cx="10.2" cy="14" r="1.4" fill="#1E293B" />
      <circle cx="17.8" cy="14" r="1.4" fill="#1E293B" />
      <circle cx="8" cy="16.5" r="1.6" fill="#FB7185" opacity="0.55" />
      <circle cx="20" cy="16.5" r="1.6" fill="#FB7185" opacity="0.55" />
      <path d="M10.5 18 Q14 21 17.5 18" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );

  return (
    <div className={`min-h-screen w-full overflow-x-clip flex flex-col transition-colors duration-300 ${rootThemeClass}`}>
      {/* Always-Visible LBS Royal Navy Blue Sticky Top Navigation Header (#001E62) */}
      <header className="sticky top-0 z-40 w-full bg-[#001E62]/98 backdrop-blur-md text-white border-b border-[#25458E] shadow-lg no-print">
        <div className="w-full px-3 sm:px-10 lg:px-16 h-13 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Schoola Wordmark with LBS Crimson Accent Line + UK Companion Strapline */}
          <div className="flex items-center gap-5 min-w-0 shrink-0">
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-start text-left shrink-0 cursor-pointer group"
            >
              <span className="font-playful font-extrabold text-xl sm:text-[1.75rem] leading-none tracking-tight text-white whitespace-nowrap">
                Schoola
              </span>
              <span className="w-full h-[2.5px] bg-[#C8102E] rounded-full mt-1" aria-hidden="true" />
            </button>

            <span className="hidden xl:inline-flex items-center gap-2 text-xs font-medium text-white/80 whitespace-nowrap">
              <svg viewBox="0 0 60 40" className="w-4 h-3 rounded-[2px] shrink-0" aria-hidden="true">
                <rect width="60" height="40" fill="#012169" />
                <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
                <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="5" />
                <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13" />
                <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8" />
              </svg>
              <span>Your free UK curriculum companion</span>
            </span>
          </div>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-2 overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                role === 'welcome'
                  ? 'bg-white/20 text-white'
                  : 'text-sky-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
                setDirectoryKS('ks1');
                setDirectoryOpen(true);
                setProgress((prev) => ({
                  ...prev,
                  selectedYear: prev.selectedYear === 'Year 2' ? 'Year 2' : 'Year 1',
                }));
                setTimeout(() => {
                  document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold bg-[#FFE4E0] hover:bg-[#FFD0C8] text-[#9A2E1B] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              KS1
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
                setDirectoryKS('ks2');
                setDirectoryOpen(true);
                setProgress((prev) => ({
                  ...prev,
                  selectedYear:
                    prev.selectedYear === 'Year 1' || prev.selectedYear === 'Year 2'
                      ? 'Year 3'
                      : prev.selectedYear,
                }));
                setTimeout(() => {
                  document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold bg-[#DBEAFE] hover:bg-[#BFDBFE] text-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              KS2
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setChildViewMode('map');
                setRole('child');
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                role === 'child' && !activeWorldSubjectId && !activeTopic && childViewMode === 'map'
                  ? 'bg-emerald-400/25 text-emerald-200'
                  : 'text-sky-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Activity Land
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setChildViewMode('dashboard');
                setRole('child');
              }}
              aria-label="Child Profile"
              title="Child Profile"
              className={`min-h-[38px] w-10 h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all border ${
                role === 'child' && !activeWorldSubjectId && !activeTopic && childViewMode === 'dashboard'
                  ? 'bg-amber-400/30 border-amber-300 shadow-sm'
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              {childFaceIcon}
            </button>
          </nav>

          {/* Zone 3: Voice Chooser, Theme Switcher & Parent Portal */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsVoiceOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              aria-label="Choose child-friendly storyteller voice"
              title="Choose lovely storyteller voice"
            >
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200" />
            </button>

            <button
              type="button"
              onClick={() => setIsThemeOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              aria-label="Switch colour theme"
              title="Switch colour theme"
            >
              <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setRole(role === 'parent' ? 'child' : 'parent');
              }}
              className={`min-h-[36px] sm:min-h-[40px] pl-2 pr-2.5 sm:pr-3.5 py-1 rounded-xl border transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                role === 'parent'
                  ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 text-white'
                  : 'bg-gradient-to-r from-[#EA580C] to-[#DC2626] hover:from-[#C2410C] hover:to-[#B91C1C] border-orange-300 text-white'
              }`}
            >
              <RedOrangeDoorIcon className="w-4 h-5 sm:w-5 sm:h-6 shrink-0" />
              <span className="text-[11px] sm:text-xs font-extrabold whitespace-nowrap">
                {role === 'parent' ? 'Kids Hub' : 'Parent Portal'}
              </span>
            </button>
          </div>
        </div>

        {/* High-Visibility Easy-to-See Mobile Navigation Strip (360px+ iPhone/iPad/Mobile) */}
        <nav
          aria-label="Mobile navigation"
          className="grid grid-cols-5 md:hidden items-center gap-1.5 px-2.5 pb-2.5 pt-0.5"
        >
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setRole('welcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-h-[36px] px-1.5 py-1 rounded-xl text-xs font-playful font-bold text-center cursor-pointer transition-colors ${
              role === 'welcome'
                ? 'bg-white text-[#001E62] shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setRole('welcome');
              setDirectoryKS('ks1');
              setDirectoryOpen(true);
              setTimeout(() => {
                document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="min-h-[36px] px-1.5 py-1 rounded-xl text-xs font-playful font-bold bg-[#FFE4E0] text-[#9A2E1B] text-center cursor-pointer shadow-xs"
          >
            KS1
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setRole('welcome');
              setDirectoryKS('ks2');
              setDirectoryOpen(true);
              setTimeout(() => {
                document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="min-h-[36px] px-1.5 py-1 rounded-xl text-xs font-playful font-bold bg-[#DBEAFE] text-[#1E3A8A] text-center cursor-pointer shadow-xs"
          >
            KS2
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setChildViewMode('map');
              setRole('child');
            }}
            className={`min-h-[36px] px-1 py-1 rounded-xl text-xs font-playful font-bold text-center cursor-pointer ${
              role === 'child' && childViewMode === 'map'
                ? 'bg-emerald-400 text-slate-950 shadow-xs'
                : 'text-emerald-100 bg-emerald-500/30 border border-emerald-400/40'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setChildViewMode('dashboard');
              setRole('child');
            }}
            aria-label="Child Profile"
            title="Child Profile"
            className={`min-h-[36px] px-1.5 py-1 rounded-xl border flex items-center justify-center gap-1 cursor-pointer ${
              role === 'child' && childViewMode === 'dashboard'
                ? 'bg-amber-400/40 border-amber-300 text-white shadow-xs'
                : 'bg-white/15 border-white/30 text-white'
            }`}
          >
            {childFaceIcon}
            <span className="text-[11px] font-playful font-bold">Kids</span>
          </button>
        </nav>
      </header>

      {/* Main Stage */}
      <main className="flex-1">
        {role === 'welcome' && (
          <WelcomeGateway
            selectedYear={progress.selectedYear}
            onSelectYear={(yr: YearGroup) => setProgress((prev) => ({ ...prev, selectedYear: yr }))}
            onEnterChild={() => {
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setChildViewMode('map');
              setRole('child');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenWorld={(subjectId: string) => {
              setActiveTopic(null);
              setActiveWorldSubjectId(subjectId);
              setRole('child');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTopic={handleOpenTopic}
            onEarnStar={() => {
              playCheerfulTing('star');
              setProgress((prev) => ({
                ...prev,
                ...touchStreak(prev),
                stars: prev.stars + 1,
              }));
            }}
            stars={progress.stars}
            streakDays={progress.streakDays}
            directoryKS={directoryKS}
            onSelectDirectoryKS={setDirectoryKS}
            directoryOpen={directoryOpen}
            onToggleDirectory={() => setDirectoryOpen((prev) => !prev)}
          />
        )}

        {role === 'child' && activeTopic && activeSubject && (
          <LearningHub
            topic={activeTopic}
            subject={activeSubject}
            nextTopicInWorld={nextTopicInWorld}
            progress={progress}
            onBackToDashboard={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setChildViewMode('map');
            }}
            onBackToWorld={() => {
              stopSpeaking();
              setActiveTopic(null);
            }}
            onToggleFavourite={handleToggleFavourite}
            onStageWatchDone={handleStageWatchDone}
            onStagePlayDone={handleStagePlayDone}
            onTopicQuizDone={handleTopicQuizDone}
            onSelectTopic={handleOpenTopic}
            onOpenCertificate={(title) => setCertTitle(title)}
            onMascotUpdate={(expr, msg) => {
              setMascotExpression(expr);
              setMascotMessage(msg);
            }}
            mascotExpression={mascotExpression}
            mascotMessage={mascotMessage}
            onCycleMascot={handleCycleMascot}
          />
        )}

        {isMapFocus && (
          <ActivityLandMap
            progress={progress}
            onSelectYear={(yr) => setProgress((prev) => ({ ...prev, selectedYear: yr }))}
            onOpenTopic={handleOpenTopic}
            onCycleMascot={handleCycleMascot}
            onAdoptPrize={handleAdoptPrize}
            onOpenParentPortal={() => {
              stopSpeaking();
              setActiveTopic(null);
              setRole('parent');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenHome={() => {
              stopSpeaking();
              setActiveTopic(null);
              setActiveWorldSubjectId(null);
              setRole('welcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToDashboard={() => {
              setChildViewMode('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {role === 'child' && !activeTopic && !isMapFocus && (
          <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setActiveWorldSubjectId(null);
                  setChildViewMode('map');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="min-h-[40px] px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white border-b-3 border-emerald-700 font-heading font-extrabold text-xs shadow-sm cursor-pointer"
              >
                ← Back to Activity Land Map
              </button>
            </div>
            <ChildDashboard
              progress={progress}
              activeWorldSubjectId={activeWorldSubjectId}
              onSelectYear={(yr) => setProgress((prev) => ({ ...prev, selectedYear: yr }))}
              onSelectWorld={(subjectId) => {
                setActiveWorldSubjectId(subjectId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTopic={handleOpenTopic}
              onCompleteDailyChallenge={handleCompleteDailyChallenge}
              onCycleMascot={handleCycleMascot}
              onToggleFavourite={handleToggleFavourite}
              onOpenCertificate={(title) => setCertTitle(title)}
              mascotExpression={mascotExpression}
              mascotMessage={mascotMessage}
            />
          </>
        )}

        {role === 'parent' && (
          <ParentTeacherHub
            progress={progress}
            weeklyChecklist={weeklyChecklist}
            customEvents={customEvents}
            onToggleChecklist={(key) =>
              setWeeklyChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            onAddCustomEvent={(evt) => setCustomEvents((prev) => [evt, ...prev])}
            onRemoveCustomEvent={(id) =>
              setCustomEvents((prev) => prev.filter((e) => e.id !== id))
            }
            onOpenTopicInHub={handleOpenTopic}
            onOpenCertificate={(title) => setCertTitle(title)}
            onResetProgress={handleResetProgress}
            onSwitchToChild={() => {
              setActiveTopic(null);
              setRole('child');
            }}
          />
        )}
      </main>

      {/* Clean Grounded Footer (stripped in Activity Land Map view) */}
      {!isMapFocus && (
      <footer className="bg-slate-900 text-slate-300 py-14 sm:py-16 px-6 sm:px-12 lg:px-20 border-t border-slate-800 text-xs no-print">
        <div className="w-full space-y-8">
          <div className="w-full flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="space-y-2.5 max-w-sm text-left">
              <p className="font-heading font-extrabold text-white text-base">
                Schoola – Discover. Play. Learn.
              </p>
              <p className="text-slate-400 leading-relaxed">
                A free, independent UK primary curriculum learning hub &amp; signposting tool. Every subject, every topic — Years 1–6 across England&apos;s Primary National Curriculum.
              </p>
              <p className="text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4" />
                Privacy-first · No ads · No account required
              </p>
            </div>

            <div className="flex flex-wrap gap-10 text-left">
              <div className="space-y-2.5">
                <p className="font-bold text-white">Learning Paths</p>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTopic(null);
                        setActiveWorldSubjectId(null);
                        setChildViewMode('map');
                        setRole('child');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white cursor-pointer"
                    >
                      Activity Land Map
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTopic(null);
                        setRole('parent');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-white cursor-pointer"
                    >
                      Parent &amp; Teacher Hub
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsThemeOpen(true)}
                      className="hover:text-white cursor-pointer"
                    >
                      Colour Themes
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">Curriculum Partners</p>
                <ul className="space-y-1.5 text-slate-400">
                  <li>
                    <a href="https://www.bbc.co.uk/teach" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      BBC Teach
                    </a>
                  </li>
                  <li>
                    <a href="https://www.thenational.academy" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      Oak National Academy
                    </a>
                  </li>
                  <li>
                    <a href="https://www.bbc.co.uk/bitesize" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      BBC Bitesize
                    </a>
                  </li>
                  <li>
                    <a href="https://www.twinkl.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      Twinkl
                    </a>
                  </li>
                  <li>
                    <a href="https://www.gov.uk/national-curriculum" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      DfE Curriculum
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">Your Progress</p>
                <p className="text-slate-400 tabular-nums flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {progress.stars} Stars · {progress.completedTopics.length} Topics
                </p>
                <button
                  type="button"
                  onClick={() => setCertTitle(`${progress.selectedYear} Learning Journey`)}
                  className="text-sky-400 hover:text-sky-300 font-bold cursor-pointer"
                >
                  Print Certificate →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl overflow-hidden text-[11px] text-slate-400 leading-relaxed text-left">
            <button
              type="button"
              onClick={() => setDisclaimerOpen((prev) => !prev)}
              aria-expanded={disclaimerOpen}
              className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 font-bold text-slate-200">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                Disclaimer &amp; Children&apos;s Privacy &amp; Safeguarding Charter
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-400 shrink-0">
                {disclaimerOpen ? 'Hide' : 'Click to read'}
                {disclaimerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {disclaimerOpen && (
              <div className="px-4 pb-4 pt-3 border-t border-slate-700/70 space-y-4">
                <p>
                  <strong className="text-slate-200">Educational Signposting Disclaimer: </strong>
                  Schoola (schoola.uk) is an independent educational tool and signposting website. Parents and guardians are encouraged to review any linked third-party resources (BBC Teach, Oak National Academy, BBC Bitesize, Twinkl) before sharing with children. For statutory guidance visit{' '}
                  <a
                    href="https://www.gov.uk/national-curriculum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline"
                  >
                    gov.uk/national-curriculum
                  </a>
                  . Not affiliated with the UK Government, DfE, BBC, Twinkl, or Oak National Academy. As an Amazon Associate I earn from qualifying purchases.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <h3 className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Children&apos;s Privacy &amp; Safeguarding Charter
                  </h3>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                    <li>
                      <strong className="text-white">No personal data collection:</strong> Children can use every learning world, game, and quiz without registering an account or entering personal details.
                    </li>
                    <li>
                      <strong className="text-white">Zero advertising or behavioural tracking:</strong> Schoola displays no third-party ads, profiling cookies, or cross-site trackers.
                    </li>
                    <li>
                      <strong className="text-white">No public profiles or open chat:</strong> Children cannot message strangers or share public profiles.
                    </li>
                    <li>
                      <strong className="text-white">ICO Age Appropriate Design Code alignment:</strong> Progress, stars, and badges are stored strictly locally in your browser&apos;s storage.
                    </li>
                    <li>
                      <strong className="text-white">Clear external link separation:</strong> Links to BBC Teach, Twinkl, and Oak National Academy are clearly marked as opening external websites and placed inside adult-oriented panels.
                    </li>
                    <li>
                      <strong className="text-white">England National Curriculum clarity:</strong> All 64 topic sequences align specifically to England&apos;s Key Stage 1 (Years 1–2) and Key Stage 2 (Years 3–6) statutory frameworks.
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
      )}

      {/* Colour Theme Switcher Modal */}
      {isThemeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h2 className="font-playful font-extrabold text-xl text-slate-900">
                  Choose Colour Theme
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsThemeOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                aria-label="Close theme selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Pick the look that feels best for your study session — crisp daylight, cosy dark night, or bright multicolour pastels.
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'light' as const,
                  title: 'Light Daylight',
                  desc: 'Crisp cream and clean white cards for bright daytime study.',
                  icon: <Sun className="w-5 h-5 text-amber-500" />,
                  swatches: ['#FFFEF7', '#F8FAFC', '#E0F2FE', '#FEF3C7'],
                },
                {
                  id: 'dark' as const,
                  title: 'Night Dark',
                  desc: 'Deep midnight slate surfaces for comfortable evening reading.',
                  icon: <Moon className="w-5 h-5 text-indigo-500" />,
                  swatches: ['#090E1A', '#0F172A', '#1E293B', '#334155'],
                },
                {
                  id: 'pastel' as const,
                  title: 'Multicolour Pastels',
                  desc: 'Soft blush pink, buttercream, mint, sky and lavender washes.',
                  icon: <Sparkles className="w-5 h-5 text-pink-500" />,
                  swatches: ['#FFE4F1', '#FFF4D2', '#DCFCE7', '#E0F2FE', '#F3E8FF'],
                },
              ].map((opt) => {
                const selected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTheme(opt.id)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      selected
                        ? 'bg-indigo-50 border-indigo-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <p className="font-playful text-base font-bold">{opt.title}</p>
                      </div>
                      <p className="text-xs text-slate-600">{opt.desc}</p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {opt.swatches.map((hex) => (
                          <span
                            key={hex}
                            className="w-5 h-3 rounded-full border border-slate-300/80"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-indigo-600 border-indigo-700 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {selected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsThemeOpen(false)}
              className="min-h-[44px] w-full py-2.5 rounded-xl bg-[#001E62] hover:bg-[#0A2C7A] text-white font-playful text-sm font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Child-Friendly Storyteller Voice Chooser Modal */}
      <VoicePickerModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />

      {/* Printable Achievement Certificate Modal */}
      <PrintableCertificateModal
        isOpen={Boolean(certTitle)}
        onClose={() => setCertTitle(null)}
        explorerName={progress.explorerName}
        onUpdateName={(name) => setProgress((prev) => ({ ...prev, explorerName: name }))}
        achievementTitle={certTitle || `${progress.selectedYear} Learning Journey`}
        yearGroup={progress.selectedYear}
        starsEarned={progress.stars}
        completedCount={progress.completedTopics.length}
      />
    </div>
  );
}
