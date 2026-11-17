import { useEffect, useMemo, useState } from 'react';
import { Accessibility, Check, ShieldCheck, Star, X } from 'lucide-react';
import {
  AccessibilitySettings,
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
import { RedOrangeDoorIcon } from './components/WorldIllustrations';
import { stopSpeaking } from './utils/speech';

const PROGRESS_STORAGE_KEY = 'schoola_v2_progress';
const A11Y_STORAGE_KEY = 'schoola_v2_a11y';
const CHECKLIST_STORAGE_KEY = 'schoola_weekly_checklist';
const EVENTS_STORAGE_KEY = 'schoola_custom_events';

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

const DEFAULT_A11Y: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  dyslexiaFont: false,
  autoReadAloud: false,
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

  const [a11y, setA11y] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(A11Y_STORAGE_KEY);
      return saved ? { ...DEFAULT_A11Y, ...JSON.parse(saved) } : DEFAULT_A11Y;
    } catch {
      return DEFAULT_A11Y;
    }
  });

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

  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [directoryKS, setDirectoryKS] = useState<'ks1' | 'ks2'>('ks1');
  const [certTitle, setCertTitle] = useState<string | null>(null);
  const [mascotExpression, setMascotExpression] = useState<
    'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited'
  >('happy');
  const [mascotMessage, setMascotMessage] = useState(
    'Hi Explorer! Pick a daily challenge or enter a Learning World to start your adventure!'
  );

  // Persist locally (privacy-first, no personal data leaves the device)
  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(a11y));
  }, [a11y]);

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

  const rootA11yClasses = [
    a11y.largeText ? 'a11y-large-text' : '',
    a11y.dyslexiaFont ? 'a11y-dyslexia' : '',
    a11y.highContrast ? 'a11y-high-contrast' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const isMapFocus =
    role === 'child' && !activeTopic && !activeWorldSubjectId && childViewMode === 'map';

  return (
    <div className={`min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 ${rootA11yClasses}`}>
      {/* Clean Schoola Cream Header (stripped in Activity Land Map view) */}
      {!isMapFocus && (
      <header className="sticky top-0 z-40 bg-[#FFFEF7]/95 backdrop-blur-sm text-slate-900 border-b border-[#E5E4DC] no-print">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Gradient Schoola Logo + UK Companion Strapline */}
          <div className="flex items-center gap-4 min-w-0 shrink-0">
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
              <span className="font-playful font-extrabold text-2xl sm:text-[1.7rem] leading-none tracking-tight bg-gradient-to-r from-[#5B4FCF] via-[#3B9FE0] to-[#2DC89A] bg-clip-text text-transparent whitespace-nowrap">
                Schoola
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 leading-tight mt-0.5 whitespace-nowrap">
                <Check className="w-2.5 h-2.5 shrink-0" />
                Aligned to England National Curriculum
              </span>
            </button>

            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 whitespace-nowrap">
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
            className="hidden md:flex items-center gap-1.5 overflow-x-auto"
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
                  ? 'bg-[#F5F4EC] text-slate-900'
                  : 'text-slate-600 hover:bg-[#F5F4EC] hover:text-slate-900'
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
                setProgress((prev) => ({
                  ...prev,
                  selectedYear: prev.selectedYear === 'Year 2' ? 'Year 2' : 'Year 1',
                }));
                setTimeout(() => {
                  document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
                }, 60);
              }}
              className="min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold bg-[#FFF0EE] hover:bg-[#FFE0DC] text-[#c4402e] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
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
              className="min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#1e40af] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
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
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:bg-[#F5F4EC] hover:text-slate-900'
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
              className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                role === 'child' && !activeWorldSubjectId && !activeTopic && childViewMode === 'dashboard'
                  ? 'bg-sky-50 text-sky-700'
                  : 'text-slate-600 hover:bg-[#F5F4EC] hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="min-h-[36px] px-3.5 py-1.5 rounded-full text-sm font-playful font-bold text-slate-600 hover:bg-[#F5F4EC] hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              About
            </button>
          </nav>

          {/* Zone 3: Accessibility & Parent Portal */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsA11yOpen(true)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#F5F4EC] hover:bg-[#EEEEE6] border border-[#E5E4DC] text-slate-700 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              aria-label="Open accessibility options"
            >
              <Accessibility className="w-4 h-4 text-[#5B4FCF]" />
              <span className="hidden sm:inline">Accessibility</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setRole(role === 'parent' ? 'child' : 'parent');
              }}
              className={`min-h-[40px] pl-2 pr-3.5 py-1 rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs ${
                role === 'parent'
                  ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white'
                  : 'bg-gradient-to-r from-[#EA580C] to-[#DC2626] hover:from-[#C2410C] hover:to-[#B91C1C] border-orange-300 text-white'
              }`}
            >
              <RedOrangeDoorIcon className="w-5 h-6 shrink-0" />
              <span className="text-xs font-extrabold whitespace-nowrap">
                {role === 'parent' ? 'Kids Hub' : 'Parent Portal'}
              </span>
            </button>
          </div>
        </div>

        {/* Compact Mobile Navigation Strip */}
        <nav
          aria-label="Mobile navigation"
          className="flex md:hidden items-center gap-1.5 px-4 pb-2 overflow-x-auto"
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
            className={`px-3 py-1 rounded-full text-xs font-playful font-bold whitespace-nowrap shrink-0 cursor-pointer ${
              role === 'welcome' ? 'bg-[#F5F4EC] text-slate-900' : 'text-slate-600'
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
              setTimeout(() => {
                document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="px-3 py-1 rounded-full text-xs font-playful font-bold bg-[#FFF0EE] text-[#c4402e] whitespace-nowrap shrink-0 cursor-pointer"
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
              setTimeout(() => {
                document.getElementById('full-curriculum-directory')?.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            }}
            className="px-3 py-1 rounded-full text-xs font-playful font-bold bg-[#EEF2FF] text-[#1e40af] whitespace-nowrap shrink-0 cursor-pointer"
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
            className="px-3 py-1 rounded-full text-xs font-playful font-bold text-emerald-700 bg-emerald-50 whitespace-nowrap shrink-0 cursor-pointer"
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
            className="px-3 py-1 rounded-full text-xs font-playful font-bold text-slate-600 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="px-3 py-1 rounded-full text-xs font-playful font-bold text-slate-600 whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>
        </nav>
      </header>
      )}

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
      <footer className="bg-slate-900 text-slate-300 py-10 px-4 sm:px-8 lg:px-12 border-t border-slate-800 text-xs no-print">
        <div className="w-full space-y-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-2 max-w-sm text-left">
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

            <div className="flex flex-wrap gap-8 text-left">
              <div className="space-y-2">
                <p className="font-bold text-white">Learning Paths</p>
                <ul className="space-y-1.5 text-slate-400">
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
                      onClick={() => setIsA11yOpen(true)}
                      className="hover:text-white cursor-pointer"
                    >
                      Accessibility Options
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

          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4 text-[11px] text-slate-400 leading-relaxed text-left">
            <strong className="text-slate-200 block mb-1">Disclaimer</strong>
            Schoola (schoola.uk) is an independent educational tool and signposting website. Parents and guardians are encouraged to review any linked third-party resources (BBC Teach, Oak National Academy, BBC Bitesize, Twinkl) before sharing with children. For statutory guidance visit{' '}
            <a
              href="https://www.gov.uk/national-curriculum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:underline"
            >
              gov.uk/national-curriculum
            </a>
            . Not affiliated with the UK Government, DfE, BBC, Twinkl, or Oak National Academy.
          </div>
        </div>
      </footer>
      )}

      {/* Accessibility Options Modal */}
      {isA11yOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-sky-700" />
                <h2 className="font-heading font-extrabold text-lg text-slate-900">
                  Accessibility Options
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsA11yOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                aria-label="Close accessibility options"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Personalise reading comfort and contrast. You can also tap &quot;Read aloud&quot; inside activities and quizzes to hear instructions spoken out loud.
            </p>

            <div className="space-y-3">
              {[
                {
                  key: 'largeText' as const,
                  title: 'Larger Text Size',
                  desc: 'Increases font size across buttons, questions and reading cards.',
                },
                {
                  key: 'dyslexiaFont' as const,
                  title: 'Dyslexia-Friendly Reading Mode',
                  desc: 'Uses Lexend font with generous letter and line spacing.',
                },
                {
                  key: 'highContrast' as const,
                  title: 'High-Contrast Borders',
                  desc: 'Enhances contrast between text, cards and backgrounds.',
                },
              ].map((opt) => {
                const enabled = a11y[opt.key];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() =>
                      setA11y((prev) => ({ ...prev, [opt.key]: !prev[opt.key] }))
                    }
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      enabled
                        ? 'bg-sky-50 border-sky-400 text-slate-900'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold">{opt.title}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                        enabled
                          ? 'bg-sky-600 border-sky-700 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {enabled && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsA11yOpen(false)}
              className="min-h-[44px] w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* About Schoola Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-playful font-extrabold text-2xl bg-gradient-to-r from-[#5B4FCF] via-[#3B9FE0] to-[#2DC89A] bg-clip-text text-transparent">
                About Schoola
              </h2>
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                aria-label="Close about Schoola dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Schoola (schoola.uk) is a free, independent curriculum companion and interactive learning hub for UK primary school pupils aged 5–11 and their parents.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              We map the full statutory National Curriculum (Key Stage 1 and Key Stage 2) with interactive quests and curated links to trusted free resources — including BBC Teach, Oak National Academy, Twinkl, and BBC Bitesize.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Privacy-first: no login or personal account required. Learning progress stays strictly in your browser.
            </p>
            <button
              type="button"
              onClick={() => setIsAboutOpen(false)}
              className="min-h-[44px] w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold cursor-pointer"
            >
              Back to Schoola
            </button>
          </div>
        </div>
      )}

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
