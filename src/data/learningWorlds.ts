import {
  BadgeDefinition,
  FunFact,
  InterestQuest,
  LearnerProgress,
  LearningWorld,
  Topic,
  YearGroup,
} from '../types';

export const YEAR_GROUPS: { year: YearGroup; ageLabel: string; keyStage: string; shortNote: string }[] = [
  { year: 'Year 1', ageLabel: 'Ages 5–6', keyStage: 'Key Stage 1', shortNote: 'Phonics, counting & first discoveries' },
  { year: 'Year 2', ageLabel: 'Ages 6–7', keyStage: 'Key Stage 1', shortNote: 'Times tables, stories & habitats' },
  { year: 'Year 3', ageLabel: 'Ages 7–8', keyStage: 'Key Stage 2', shortNote: 'Fractions, plants & ancient worlds' },
  { year: 'Year 4', ageLabel: 'Ages 8–9', keyStage: 'Key Stage 2', shortNote: 'Decimals, electricity & Romans' },
  { year: 'Year 5', ageLabel: 'Ages 9–10', keyStage: 'Key Stage 2', shortNote: 'Space, prime numbers & coding' },
  { year: 'Year 6', ageLabel: 'Ages 10–11', keyStage: 'Key Stage 2', shortNote: 'Algebra, evolution & leadership' },
];

export const LEARNING_WORLDS: LearningWorld[] = [
  {
    id: 'world-maths',
    subjectId: 'Maths',
    worldTitle: 'Maths World',
    subtitle: 'Numbers, puzzles and challenges',
    accentHex: '#0284C7',
    surfaceTint: '#F0F9FF',
    borderHex: '#BAE6FD',
    textHex: '#075985',
    illustrationKey: 'maths',
    featured: true,
  },
  {
    id: 'world-science',
    subjectId: 'Science',
    worldTitle: 'Science World',
    subtitle: 'Experiments and discoveries',
    accentHex: '#059669',
    surfaceTint: '#ECFDF5',
    borderHex: '#A7F3D0',
    textHex: '#065F46',
    illustrationKey: 'science',
    featured: true,
  },
  {
    id: 'world-english',
    subjectId: 'English',
    worldTitle: 'English World',
    subtitle: 'Stories, words and spelling',
    accentHex: '#E11D48',
    surfaceTint: '#FFF1F2',
    borderHex: '#FECDD3',
    textHex: '#9F1239',
    illustrationKey: 'english',
    featured: true,
  },
  {
    id: 'world-geography',
    subjectId: 'Geography',
    worldTitle: 'Geography World',
    subtitle: 'Explore countries and places',
    accentHex: '#0D9488',
    surfaceTint: '#F0FDFA',
    borderHex: '#99F6E4',
    textHex: '#115E59',
    illustrationKey: 'geography',
    featured: true,
  },
  {
    id: 'world-history',
    subjectId: 'History',
    worldTitle: 'History World',
    subtitle: 'Time travel and ancient stories',
    accentHex: '#D97706',
    surfaceTint: '#FFFBEB',
    borderHex: '#FDE68A',
    textHex: '#92400E',
    illustrationKey: 'history',
    featured: false,
  },
  {
    id: 'world-computing',
    subjectId: 'Computing',
    worldTitle: 'Code World',
    subtitle: 'Algorithms, logic and digital safety',
    accentHex: '#4F46E5',
    surfaceTint: '#EEF2FF',
    borderHex: '#C7D2FE',
    textHex: '#3730A3',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-art',
    subjectId: 'Art',
    worldTitle: 'Art Studio',
    subtitle: 'Colour, sketching and famous makers',
    accentHex: '#EA580C',
    surfaceTint: '#FFF7ED',
    borderHex: '#FED7AA',
    textHex: '#9A3412',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-dt',
    subjectId: 'DT',
    worldTitle: 'Workshop World',
    subtitle: 'Build bridges, sliders and meals',
    accentHex: '#BE185D',
    surfaceTint: '#FDF2F8',
    borderHex: '#FBCFE8',
    textHex: '#831843',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-music',
    subjectId: 'Music',
    worldTitle: 'Music Meadow',
    subtitle: 'Rhythm, melody and singing',
    accentHex: '#7C3AED',
    surfaceTint: '#F5F3FF',
    borderHex: '#DDD6FE',
    textHex: '#5B21B6',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-pe',
    subjectId: 'PE',
    worldTitle: 'Active Arena',
    subtitle: 'Balance, teamwork and movement',
    accentHex: '#16A34A',
    surfaceTint: '#F0FDF4',
    borderHex: '#BBF7D0',
    textHex: '#166534',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-re',
    subjectId: 'RE',
    worldTitle: 'World Festivals',
    subtitle: 'Stories, kindness and celebrations',
    accentHex: '#0284C7',
    surfaceTint: '#F0F9FF',
    borderHex: '#BAE6FD',
    textHex: '#075985',
    illustrationKey: 'creative',
    featured: false,
  },
  {
    id: 'world-pshe',
    subjectId: 'PSHE',
    worldTitle: 'Harmony Village',
    subtitle: 'Wellbeing, safety and friendship',
    accentHex: '#E11D48',
    surfaceTint: '#FFF1F2',
    borderHex: '#FECDD3',
    textHex: '#9F1239',
    illustrationKey: 'creative',
    featured: false,
  },
];

// Page 12: "What would you like to learn today?" interest-led discovery
export const INTEREST_QUESTS: InterestQuest[] = [
  {
    id: 'interest-dinosaurs',
    title: 'Discover dinosaurs & fossils',
    subjectsLabel: 'Science · History',
    subjectId: 'Science',
    description: 'Uncover how plants, animals and ancient creatures lived and evolved.',
    illustrationKey: 'dinosaurs',
    accentHex: '#059669',
    bgTint: '#ECFDF5',
    keywords: ['animal', 'plant', 'evolution', 'fossil', 'living', 'fire'],
  },
  {
    id: 'interest-space',
    title: 'Explore space & planets',
    subjectsLabel: 'Science',
    subjectId: 'Science',
    description: 'Blast off to discover Earth, our Solar System, light and forces.',
    illustrationKey: 'space',
    accentHex: '#0284C7',
    bgTint: '#F0F9FF',
    keywords: ['space', 'earth', 'light', 'electricity', 'planet', 'force'],
  },
  {
    id: 'interest-treasure',
    title: 'Solve treasure puzzles',
    subjectsLabel: 'Maths',
    subjectId: 'Maths',
    description: 'Follow number trails, crack fraction codes and unlock shapes.',
    illustrationKey: 'treasure',
    accentHex: '#D97706',
    bgTint: '#FFFBEB',
    keywords: ['number', 'fraction', 'multiplication', 'algebra', 'place', 'add'],
  },
  {
    id: 'interest-storyland',
    title: 'Enter storyland',
    subjectsLabel: 'English',
    subjectId: 'English',
    description: 'Meet dragons, fairies and punctuation wizards in magical tales.',
    illustrationKey: 'storyland',
    accentHex: '#E11D48',
    bgTint: '#FFF1F2',
    keywords: ['story', 'phonics', 'fairy', 'grammar', 'speech', 'reading'],
  },
];

// Page 7: Reward effort, curiosity and progress (not only getting every answer right)
export const BADGES: BadgeDefinition[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Started your very first Schoola topic adventure.',
    emoji: '🌱',
    requirementLabel: 'Complete 1 stage or topic',
    checkUnlocked: (p: LearnerProgress) =>
      p.watchedTopics.length + p.playedTopics.length + p.completedTopics.length >= 1,
  },
  {
    id: 'curious-explorer',
    name: 'Curious Mind',
    description: 'Tried at least 3 interactive Play & Practise activities.',
    emoji: '🔍',
    requirementLabel: 'Complete 3 Play stages',
    checkUnlocked: (p: LearnerProgress) => p.playedTopics.length >= 3,
  },
  {
    id: 'maths-explorer',
    name: 'Maths Explorer',
    description: 'Completed 2 or more Maths World challenges.',
    emoji: '🧭',
    requirementLabel: '2 Maths topics completed',
    checkUnlocked: (p: LearnerProgress) =>
      p.completedTopics.filter((id) => id.startsWith('m-')).length >= 2,
  },
  {
    id: 'science-star',
    name: 'Science Star',
    description: 'Completed 2 or more Science World discoveries.',
    emoji: '🔬',
    requirementLabel: '2 Science topics completed',
    checkUnlocked: (p: LearnerProgress) =>
      p.completedTopics.filter((id) => id.startsWith('s-')).length >= 2,
  },
  {
    id: 'story-lover',
    name: 'Story Lover',
    description: 'Completed 2 or more English World adventures.',
    emoji: '📖',
    requirementLabel: '2 English topics completed',
    checkUnlocked: (p: LearnerProgress) =>
      p.completedTopics.filter((id) => id.startsWith('e-')).length >= 2,
  },
  {
    id: 'daily-challenger',
    name: 'Daily Challenger',
    description: 'Completed a Daily Mini Challenge!',
    emoji: '🎯',
    requirementLabel: 'Finish 1 Daily Challenge',
    checkUnlocked: (p: LearnerProgress) => Boolean(p.dailyChallengeCompletedDate),
  },
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Earned 25 or more Stars through effort and curiosity.',
    emoji: '⭐',
    requirementLabel: 'Earn 25 Stars',
    checkUnlocked: (p: LearnerProgress) => p.stars >= 25,
  },
  {
    id: 'super-scholar',
    name: 'All-Round Explorer',
    description: 'Completed 5 topics across your learning worlds.',
    emoji: '🏆',
    requirementLabel: 'Complete 5 topics',
    checkUnlocked: (p: LearnerProgress) => p.completedTopics.length >= 5,
  },
];

export const SURPRISE_FUN_FACTS: FunFact[] = [
  {
    id: 'fact-plants',
    title: 'Thirsty Sunflowers',
    fact: 'Young sunflowers track the sun from east to west each day to soak up extra light energy!',
    subjectId: 'Science',
  },
  {
    id: 'fact-zero',
    title: 'The Hero Zero',
    fact: 'Before the number zero was invented in ancient India, people had to leave an empty gap on counting boards!',
    subjectId: 'Maths',
  },
  {
    id: 'fact-words',
    title: 'Story Inventors',
    fact: 'William Shakespeare invented over 1,700 English words, including "eyeball", "bedroom", and "uncomfortable"!',
    subjectId: 'English',
  },
  {
    id: 'fact-volcano',
    title: 'Ocean Mountains',
    fact: 'More than 75% of Earth’s volcanoes are hidden deep beneath the ocean waves.',
    subjectId: 'Geography',
  },
  {
    id: 'fact-romans',
    title: 'Roman Fast Food',
    fact: 'Ancient Roman cities had street-side hot food counters called thermopolia — just like ancient takeaways!',
    subjectId: 'History',
  },
  {
    id: 'fact-octopus',
    title: 'Three Hearts!',
    fact: 'An octopus has three hearts and blue blood to help it survive in deep cold ocean water.',
    subjectId: 'Science',
  },
];

export interface DailyChallengeItem {
  id: string;
  subjectId: string;
  title: string;
  ageHint: string;
  question: string;
  visualHint: 'plants' | 'space' | 'numbers' | 'shapes' | 'story' | 'globe';
  options: string[];
  correctIndex: number;
  encouragement: string;
  funFact: string;
}

export const DAILY_CHALLENGES: DailyChallengeItem[] = [
  {
    id: 'dc-plants',
    subjectId: 'Science',
    title: "Let's learn about plants!",
    ageHint: 'Science · Ages 5–11',
    question: 'What does a plant need to grow strong and healthy?',
    visualHint: 'plants',
    options: ['Only water', 'Water, light and nutrients', 'Only sunlight', 'Only dark soil'],
    correctIndex: 1,
    encouragement: 'Plants are like solar-powered kitchens! Their leaves use sunlight, water and nutrients from the soil to make food.',
    funFact: 'Some giant bamboo plants can grow up to 90 centimetres in a single day!',
  },
  {
    id: 'dc-shapes',
    subjectId: 'Maths',
    title: 'Bridge of Shapes Puzzle',
    ageHint: 'Maths · Ages 5–11',
    question: 'An explorer crosses a bridge with 3 + ? = 10 stepping stones. Which number completes the bridge?',
    visualHint: 'numbers',
    options: ['5 stones', '6 stones', '7 stones', '8 stones'],
    correctIndex: 2,
    encouragement: 'Brilliant number bond work! 3 + 7 makes 10 — a key building block for mental maths.',
    funFact: 'Honeybees build hexagon cells because 6-sided shapes fit together with zero wasted space!',
  },
  {
    id: 'dc-story',
    subjectId: 'English',
    title: 'Storyland Sentence Rescue',
    ageHint: 'English · Ages 5–11',
    question: 'Which sentence uses a capital letter and punctuation mark correctly?',
    visualHint: 'story',
    options: [
      'the friendly dragon flew over london',
      'The friendly dragon flew over London.',
      'the friendly dragon flew over London',
      'The friendly dragon Flew over london?',
    ],
    correctIndex: 1,
    encouragement: 'Spot on! Sentences start with a capital letter, proper names like London get capitals too, and statements end with a full stop.',
    funFact: 'The shortest complete English sentence is "Go!" — just two letters and an exclamation mark!',
  },
  {
    id: 'dc-space',
    subjectId: 'Science',
    title: 'Cosmic Explorer Mission',
    ageHint: 'Science · Ages 5–11',
    question: 'Which planet in our Solar System is famous for its bright rings made of ice and rock?',
    visualHint: 'space',
    options: ['Mars', 'Mercury', 'Saturn', 'Venus'],
    correctIndex: 2,
    encouragement: 'Touchdown on Saturn! Saturn’s rings stretch hundreds of thousands of kilometres wide, yet can be as thin as a house.',
    funFact: 'A single day on Venus is longer than a whole year on Venus because it spins so slowly!',
  },
  {
    id: 'dc-globe',
    subjectId: 'Geography',
    title: 'UK Islands Compass Check',
    ageHint: 'Geography · Ages 5–11',
    question: 'How many countries make up the United Kingdom?',
    visualHint: 'globe',
    options: ['Two countries', 'Three countries', 'Four countries', 'Five countries'],
    correctIndex: 2,
    encouragement: 'Great map skills! The UK is made up of England, Scotland, Wales and Northern Ireland.',
    funFact: 'No point anywhere in the UK is more than about 70 miles (113 km) from the sea!',
  },
];

export function matchesYearFilter(topic: Topic, selectedYear: YearGroup): boolean {
  if (topic.year === selectedYear) return true;
  if (topic.year === 'Year 1–2' && (selectedYear === 'Year 1' || selectedYear === 'Year 2')) return true;
  if (topic.year === 'Year 3–4' && (selectedYear === 'Year 3' || selectedYear === 'Year 4')) return true;
  if (topic.year === 'Year 5–6' && (selectedYear === 'Year 5' || selectedYear === 'Year 6')) return true;
  return false;
}

export function getWorldForSubject(subjectId: string): LearningWorld {
  return LEARNING_WORLDS.find((w) => w.subjectId === subjectId) || LEARNING_WORLDS[0];
}
