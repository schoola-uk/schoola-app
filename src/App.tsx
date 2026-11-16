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
import { LEARNING_WORLDS, matchesYearFilter } from './data/learningWorlds';
import { WelcomeGateway } from './components/WelcomeGateway';
import { ChildDashboard } from './components/ChildDashboard';
import { ActivityLandMap } from './components/ActivityLandMap';
import { LearningHub } from './components/LearningHub';
import { ParentTeacherHub } from './components/ParentTeacherHub';
import { PrintableCertificateModal } from './components/PrintableCertificateModal';
import { DarkCloudsSkyBackdrop, RedOrangeDoorIcon } from './components/WorldIllustrations';
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
      {/* Dark Clouds Scrollable Top Panel with Red-Orange Door Parent Portal (stripped in Activity Land Map view) */}
      {!isMapFocus && (
      <header className="sticky top-0 z-40 relative overflow-hidden bg-[#090D16] text-white border-b border-slate-800 shadow-md no-print">
        <div className="absolute inset-0 pointer-events-none opacity-95">
          <DarkCloudsSkyBackdrop className="w-full h-full" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-2.5 space-y-2">
          {/* Top Row: Brand, Quick Nav, and Red-Orange Door Parent Portal */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
              }}
              className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              Schoola
            </button>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsA11yOpen(true)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                aria-label="Open accessibility options"
              >
                <Accessibility className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Accessibility</span>
              </button>

              {/* Red-Orange Door Button for Parents & Teachers */}
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setActiveTopic(null);
                  setRole(role === 'parent' ? 'child' : 'parent');
                }}
                className={`min-h-[44px] pl-2.5 pr-4 py-1.5 rounded-2xl border transition-all flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer shadow-md ${
                  role === 'parent'
                    ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 text-white'
                    : 'bg-gradient-to-r from-[#EA580C] to-[#DC2626] hover:from-[#C2410C] hover:to-[#B91C1C] border-orange-300/60 text-white'
                }`}
              >
                <RedOrangeDoorIcon className="w-7 h-8 shrink-0" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-semibold text-orange-100">
                    {role === 'parent' ? 'Back to kids' : 'Parents & Teachers'}
                  </span>
                  <span className="block text-xs font-extrabold">
                    {role === 'parent' ? 'Child Explorer Hub' : 'Parent Portal'}
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Dark Cloud Strip */}
          <nav
            aria-label="Scrollable Learning Worlds and Journey Strip"
            className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5"
          >
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                setActiveTopic(null);
                setActiveWorldSubjectId(null);
                setRole('welcome');
              }}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                role === 'welcome'
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-slate-900/75 text-slate-200 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              Home Stage
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
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                role === 'child' && !activeWorldSubjectId && !activeTopic && childViewMode === 'map'
                  ? 'bg-emerald-500 text-white border-emerald-400'
                  : 'bg-slate-900/75 text-slate-200 border-slate-700/80 hover:bg-slate-800'
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
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                role === 'child' && !activeWorldSubjectId && !activeTopic && childViewMode === 'dashboard'
                  ? 'bg-sky-500 text-white border-sky-400'
                  : 'bg-slate-900/75 text-slate-200 border-slate-700/80 hover:bg-slate-800'
              }`}
            >
              Child Dashboard
            </button>

            {LEARNING_WORLDS.slice(0, 6).map((w) => {
              const isSelected = role === 'child' && activeWorldSubjectId === w.subjectId;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setActiveTopic(null);
                    setActiveWorldSubjectId(w.subjectId);
                    setRole('child');
                  }}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer border transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-slate-900/75 text-slate-200 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {w.worldTitle}
                </button>
              );
            })}
          </nav>
        </div>
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
