export interface ResourceLinks {
  watch: string;
  print: string;
  quiz: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  visualHint?: 'plants' | 'space' | 'numbers' | 'shapes' | 'story' | 'globe' | 'history';
}

export interface Topic {
  id: string;
  title: string;
  year: string;
  subjectId: string;
  objectives: string[];
  quiz?: QuizQuestion[];
}

export interface Subject {
  id: string;
  label: string;
  emoji: string;
  color: string;
  borderColor: string;
  bg: string;
  textColor: string;
  description: string;
}

export type YearGroup = 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5' | 'Year 6';

export type UserRole = 'welcome' | 'child' | 'parent';

export type ChildView = 'map' | 'dashboard' | 'worlds' | 'world-topics' | 'hub';

export type ParentView = 'overview' | 'curriculum' | 'calendar' | 'videos' | 'safeguarding';

export type HubStage = 'watch' | 'play' | 'test' | 'celebrate';

export type MascotId = 'sparkle' | 'jack' | 'celeste' | 'pippa';

export interface LearningWorld {
  id: string;
  subjectId: string;
  worldTitle: string;
  subtitle: string;
  accentHex: string;
  surfaceTint: string;
  borderHex: string;
  textHex: string;
  illustrationKey: 'maths' | 'science' | 'english' | 'geography' | 'history' | 'creative';
  featured?: boolean;
}

export interface InterestQuest {
  id: string;
  title: string;
  subjectsLabel: string;
  subjectId: string;
  description: string;
  illustrationKey: 'dinosaurs' | 'space' | 'treasure' | 'storyland' | 'volcano' | 'code';
  accentHex: string;
  bgTint: string;
  keywords: string[];
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirementLabel: string;
  checkUnlocked: (progress: LearnerProgress) => boolean;
}

export interface FunFact {
  id: string;
  title: string;
  fact: string;
  subjectId: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  dyslexiaFont: boolean;
  autoReadAloud: boolean;
}

export interface LearnerProgress {
  explorerName: string;
  selectedYear: YearGroup;
  mascotId: MascotId;
  stars: number;
  streakDays: number;
  lastActiveDate: string | null;
  dailyChallengeCompletedDate: string | null;
  watchedTopics: string[];
  playedTopics: string[];
  completedTopics: string[];
  favouriteTopics: string[];
  quizScores: Record<string, number>;
  recentTopicIds: string[];
  unlockedFactIds: string[];
  adoptedPrizes: string[];
  weeklyGoalTarget: number;
}

export interface CustomRevisionEvent {
  id: string;
  topicId: string;
  topicTitle: string;
  date: string;
  time: string;
}
