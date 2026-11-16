import { Topic } from '../types';

export interface SortingItem {
  id: string;
  label: string;
  bucketId: string;
}

export interface SortingActivityData {
  kind: 'sorting';
  title: string;
  instructions: string;
  buckets: { id: string; label: string; colorClass: string }[];
  items: SortingItem[];
}

export interface SequenceActivityData {
  kind: 'sequence';
  title: string;
  instructions: string;
  steps: { id: string; label: string; order: number }[];
}

export interface NumberBuilderActivityData {
  kind: 'number-puzzle';
  title: string;
  instructions: string;
  puzzles: {
    id: string;
    prompt: string;
    choices: string[];
    answerIndex: number;
    hint: string;
  }[];
}

export type PlayActivity = SortingActivityData | SequenceActivityData | NumberBuilderActivityData;

export function getPlayActivityForTopic(topic: Topic): PlayActivity {
  const titleLower = topic.title.toLowerCase();

  // Science specific interactive activities
  if (topic.subjectId === 'Science') {
    if (titleLower.includes('plant')) {
      return {
        kind: 'sorting',
        title: 'Plant Lab: What Helps Plants Grow?',
        instructions: 'Sort each item into "Plants NEED this" or "Plants do NOT need this" to grow healthy.',
        buckets: [
          { id: 'need', label: 'Plants NEED This', colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
          { id: 'not-need', label: 'Not Needed', colorClass: 'bg-slate-50 border-slate-300 text-slate-800' },
        ],
        items: [
          { id: 'i1', label: 'Sunlight', bucketId: 'need' },
          { id: 'i2', label: 'Water', bucketId: 'need' },
          { id: 'i3', label: 'Soil nutrients', bucketId: 'need' },
          { id: 'i4', label: 'Plastic toys', bucketId: 'not-need' },
          { id: 'i5', label: 'Lemonade', bucketId: 'not-need' },
        ],
      };
    }

    if (titleLower.includes('matter') || titleLower.includes('material') || titleLower.includes('solid')) {
      return {
        kind: 'sorting',
        title: 'States of Matter Sorter',
        instructions: 'Place each everyday material into Solid, Liquid, or Gas.',
        buckets: [
          { id: 'solid', label: 'Solid', colorClass: 'bg-sky-50 border-sky-300 text-sky-900' },
          { id: 'liquid', label: 'Liquid', colorClass: 'bg-cyan-50 border-cyan-300 text-cyan-900' },
          { id: 'gas', label: 'Gas', colorClass: 'bg-amber-50 border-amber-300 text-amber-900' },
        ],
        items: [
          { id: 'm1', label: 'Ice cube', bucketId: 'solid' },
          { id: 'm2', label: 'Wooden block', bucketId: 'solid' },
          { id: 'm3', label: 'Orange juice', bucketId: 'liquid' },
          { id: 'm4', label: 'Rainwater', bucketId: 'liquid' },
          { id: 'm5', label: 'Steam vapour', bucketId: 'gas' },
          { id: 'm6', label: 'Oxygen in air', bucketId: 'gas' },
        ],
      };
    }

    if (titleLower.includes('space') || titleLower.includes('earth')) {
      return {
        kind: 'sequence',
        title: 'Solar System Distance Order',
        instructions: 'Click the planets in order starting closest to the Sun!',
        steps: [
          { id: 'p1', label: 'Mercury (Closest to Sun)', order: 1 },
          { id: 'p2', label: 'Venus', order: 2 },
          { id: 'p3', label: 'Earth (Our Home)', order: 3 },
          { id: 'p4', label: 'Mars (The Red Planet)', order: 4 },
        ],
      };
    }

    return {
      kind: 'sorting',
      title: 'Living vs Non-Living Discovery',
      instructions: 'Decide which things are living organisms and which are non-living objects.',
      buckets: [
        { id: 'living', label: 'Living Things', colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
        { id: 'non', label: 'Non-Living Objects', colorClass: 'bg-slate-50 border-slate-300 text-slate-800' },
      ],
      items: [
        { id: 'l1', label: 'Oak tree', bucketId: 'living' },
        { id: 'l2', label: 'Garden beetle', bucketId: 'living' },
        { id: 'l3', label: 'Granite rock', bucketId: 'non' },
        { id: 'l4', label: 'Metal spoon', bucketId: 'non' },
      ],
    };
  }

  // Maths interactive number puzzles
  if (topic.subjectId === 'Maths') {
    if (titleLower.includes('multiplication') || titleLower.includes('division') || titleLower.includes('times')) {
      return {
        kind: 'number-puzzle',
        title: 'Multiplication Bridge Builder',
        instructions: 'Solve each stepping-stone equation to cross the river!',
        puzzles: [
          { id: 'mp1', prompt: '5 × 4 = ?', choices: ['15', '20', '25', '9'], answerIndex: 1, hint: 'Count in 5s four times: 5, 10, 15, 20.' },
          { id: 'mp2', prompt: '3 × 6 = ?', choices: ['12', '16', '18', '21'], answerIndex: 2, hint: 'Three groups of 6 equals 6 + 6 + 6.' },
          { id: 'mp3', prompt: '24 ÷ 4 = ?', choices: ['4', '6', '8', '12'], answerIndex: 1, hint: 'How many 4s fit into 24?' },
        ],
      };
    }
    if (titleLower.includes('fraction') || titleLower.includes('decimal') || titleLower.includes('percentage')) {
      return {
        kind: 'number-puzzle',
        title: 'Fraction & Decimal Explorer',
        instructions: 'Match the equivalent fraction or decimal puzzle!',
        puzzles: [
          { id: 'fp1', prompt: 'Which fraction is the same as half (1/2)?', choices: ['2/4', '1/3', '3/4', '1/5'], answerIndex: 0, hint: '2 out of 4 equal pieces is exactly half!' },
          { id: 'fp2', prompt: 'What is 1/2 written as a decimal?', choices: ['0.2', '0.25', '0.5', '1.2'], answerIndex: 2, hint: 'Half of 1.0 is five tenths (0.5).' },
          { id: 'fp3', prompt: 'What is 1/4 as a percentage?', choices: ['10%', '25%', '50%', '75%'], answerIndex: 1, hint: 'Divide 100% into 4 equal quarters!' },
        ],
      };
    }
    return {
      kind: 'number-puzzle',
      title: 'Number Treasure Trail',
      instructions: 'Unlock all 3 treasure chests by finding the missing numbers!',
      puzzles: [
        { id: 'np1', prompt: '7 + ? = 10', choices: ['2', '3', '4', '5'], answerIndex: 1, hint: 'Start at 7 and count up to 10.' },
        { id: 'np2', prompt: '14 + 6 = ?', choices: ['18', '19', '20', '22'], answerIndex: 2, hint: '4 + 6 makes 10, plus 10 more!' },
        { id: 'np3', prompt: '30 − 8 = ?', choices: ['20', '22', '24', '28'], answerIndex: 1, hint: 'Count back 8 steps from 30.' },
      ],
    };
  }

  // English word & grammar activities
  if (topic.subjectId === 'English') {
    if (titleLower.includes('phonics') || titleLower.includes('spelling') || titleLower.includes('plural')) {
      return {
        kind: 'sorting',
        title: 'Word Workshop: Plurals Sorter',
        instructions: 'Sort each word by whether its plural adds "-s" or "-es"!',
        buckets: [
          { id: 'add-s', label: 'Add -s', colorClass: 'bg-rose-50 border-rose-300 text-rose-900' },
          { id: 'add-es', label: 'Add -es', colorClass: 'bg-amber-50 border-amber-300 text-amber-900' },
        ],
        items: [
          { id: 'w1', label: 'cat → cats', bucketId: 'add-s' },
          { id: 'w2', label: 'book → books', bucketId: 'add-s' },
          { id: 'w3', label: 'box → boxes', bucketId: 'add-es' },
          { id: 'w4', label: 'wish → wishes', bucketId: 'add-es' },
        ],
      };
    }
    return {
      kind: 'sorting',
      title: 'Grammar Detective: Word Classes',
      instructions: 'Sort each word into Noun (naming word), Verb (doing word), or Adjective (describing word).',
      buckets: [
        { id: 'noun', label: 'Noun (Person/Thing)', colorClass: 'bg-sky-50 border-sky-300 text-sky-900' },
        { id: 'verb', label: 'Verb (Action)', colorClass: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
        { id: 'adj', label: 'Adjective (Describing)', colorClass: 'bg-rose-50 border-rose-300 text-rose-900' },
      ],
      items: [
        { id: 'g1', label: 'castle', bucketId: 'noun' },
        { id: 'g2', label: 'dragon', bucketId: 'noun' },
        { id: 'g3', label: 'soared', bucketId: 'verb' },
        { id: 'g4', label: 'whispered', bucketId: 'verb' },
        { id: 'g5', label: 'sparkling', bucketId: 'adj' },
        { id: 'g6', label: 'enormous', bucketId: 'adj' },
      ],
    };
  }

  // History timeline sequencing
  if (topic.subjectId === 'History') {
    return {
      kind: 'sequence',
      title: 'Time-Traveller Timeline Builder',
      instructions: 'Click these periods of history in order from earliest to most recent!',
      steps: [
        { id: 'h1', label: 'Stone Age Britain', order: 1 },
        { id: 'h2', label: 'Roman Britain', order: 2 },
        { id: 'h3', label: 'Great Fire of London (1666)', order: 3 },
        { id: 'h4', label: 'Victorian Era', order: 4 },
      ],
    };
  }

  // Geography explorer sorter
  if (topic.subjectId === 'Geography') {
    return {
      kind: 'sorting',
      title: 'Physical vs Human Geography Sorter',
      instructions: 'Sort natural features (Physical) from human-built features (Human)!',
      buckets: [
        { id: 'physical', label: 'Physical (Natural)', colorClass: 'bg-teal-50 border-teal-300 text-teal-900' },
        { id: 'human', label: 'Human (Built by People)', colorClass: 'bg-amber-50 border-amber-300 text-amber-900' },
      ],
      items: [
        { id: 'geo1', label: 'River Thames', bucketId: 'physical' },
        { id: 'geo2', label: 'Volcano crater', bucketId: 'physical' },
        { id: 'geo3', label: 'Harbour bridge', bucketId: 'human' },
        { id: 'geo4', label: 'Train station', bucketId: 'human' },
      ],
    };
  }

  // General curriculum-derived sequence activity for Art, DT, Computing, Music, PE, RE, PSHE
  const objSteps = topic.objectives.slice(0, 3).map((obj, idx) => ({
    id: `step-${idx}`,
    label: obj.length > 72 ? `${obj.slice(0, 69)}...` : obj,
    order: idx + 1,
  }));

  return {
    kind: 'sequence',
    title: 'Learning Path Builder',
    instructions: 'Follow your learning journey steps in order from Step 1 to Step 3!',
    steps:
      objSteps.length >= 2
        ? objSteps
        : [
            { id: 's1', label: 'Discover the big idea', order: 1 },
            { id: 's2', label: 'Practise with examples', order: 2 },
            { id: 's3', label: 'Test what you learned', order: 3 },
          ],
  };
}
