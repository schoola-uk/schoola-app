import { Subject, Topic } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'English',
    label: 'English & Phonics',
    emoji: '📖',
    color: '#FFB7C5', // Pastel Pink
    borderColor: '#FFA4B4',
    bg: '#FFF0F3',
    textColor: '#8C3B4A',
    description: 'Word reading, phonics, grammar, direct speech punctuation, figurative devices, and passive voice!'
  },
  {
    id: 'Maths',
    label: 'Magical Maths',
    emoji: '🔢',
    color: '#B5E2FA', // Pastel Blue
    borderColor: '#90D4F7',
    bg: '#EBF6FF',
    textColor: '#1E5370',
    description: 'Solve number puzzles, shapes, fractions, and count sparkling treasures!'
  },
  {
    id: 'Science',
    label: 'Science Lab',
    emoji: '🔬',
    color: '#D8F3DC', // Pastel Mint Green
    borderColor: '#B7E4C7',
    bg: '#F2FFF5',
    textColor: '#2D6A4F',
    description: 'Discover floating seeds, weather cycles, materials magic, and space physics!'
  },
  {
    id: 'History',
    label: 'History Scrolls',
    emoji: '🏛️',
    color: '#FDE2E4', // Soft Peach
    borderColor: '#F9C7CB',
    bg: '#FFF5F6',
    textColor: '#8A5A5D',
    description: 'Travel through time to meet Roman soldiers, ancient pharaohs, and castle knights!'
  },
  {
    id: 'Geography',
    label: 'World Maps',
    emoji: '🌍',
    color: '#E2ECE9', // Soft Aqua Gray
    borderColor: '#C7DCD6',
    bg: '#F3FAF7',
    textColor: '#3A5C56',
    description: 'Explore world maps, volcanic peaks, winding rivers, and global climates!'
  },
  {
    id: 'Art',
    label: 'Art & Design',
    emoji: '🎨',
    color: '#FFDAC1', // Pastel Apricot
    borderColor: '#FFC8A2',
    bg: '#FFFDF9',
    textColor: '#87512F',
    description: 'Mix color pigments, sketch realistic portraits, and design grand sculptures!'
  },
  {
    id: 'DT',
    label: 'Design & Tech',
    emoji: '⚙️',
    color: '#FFE5EC', // Light Pink
    borderColor: '#FFC2D1',
    bg: '#FFF0F5',
    textColor: '#9E3752',
    description: 'Assemble moving vehicles, design healthy meals, and build strong bridges!'
  },
  {
    id: 'Computing',
    label: 'Digital Code',
    emoji: '💻',
    color: '#E8E8E4', // Soft Lavender-Gray
    borderColor: '#D8D8D0',
    bg: '#F6F6F4',
    textColor: '#585854',
    description: 'Program Scratch code, design websites, and master safe internet search!'
  },
  {
    id: 'Music',
    label: 'Harmonic Beats',
    emoji: '🎵',
    color: '#E2D1F9', // Soft Pastel Purple
    borderColor: '#D2B9F6',
    bg: '#FAF7FF',
    textColor: '#603B91',
    description: 'Read stave notation, sing sweet choruses, and compose rhythmic melodies!'
  },
  {
    id: 'PE',
    label: 'Super Sports',
    emoji: '⚽',
    color: '#EAF4F4', // Light Sage Green
    borderColor: '#CCE3DE',
    bg: '#F5FAF9',
    textColor: '#335C57',
    description: 'Perfect gymnastic balances, run athletic relays, and pass soccer balls!'
  },
  {
    id: 'RE',
    label: 'Beliefs & Festivals',
    emoji: '🕊️',
    color: '#F4ACB7', // Pastel Rose
    borderColor: '#EA8C9C',
    bg: '#FFF3F5',
    textColor: '#8F3443',
    description: 'Learn about stories, celebrations, and world-wide light festivals!'
  },
  {
    id: 'PSHE',
    label: 'Heart & Harmony',
    emoji: '❤️',
    color: '#FFCAD4', // Soft Pink
    borderColor: '#FFB3C1',
    bg: '#FFF5F7',
    textColor: '#963D4E',
    description: 'Be kind to classmates, protect our environment, and stay healthy!'
  }
];

export const TOPICS: Topic[] = [
  // ==========================================
  // YEAR 1 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y1-spoken-listen',
    title: 'English: Spoken language — listening and responding',
    year: 'Year 1',
    subjectId: 'English',
    objectives: [
      'Listen carefully to educational stories and classroom conversations.',
      'Respond with kind words and ask creative questions about books.',
      'Take turns speaking politely in small circles.'
    ],
    quiz: [
      {
        id: 'q-e-y1-1',
        question: 'When someone else is talking to us in the classroom, what is the best thing to do?',
        options: ['Shout out loud', 'Listen carefully with our ears and eyes', 'Start dancing and singing'],
        correctAnswer: 1,
        explanation: 'Listening carefully shows respect and helps us learn the story perfectly!'
      }
    ]
  },
  {
    id: 'e-y1-phonics',
    title: 'English: Phonics — sounds and common exception words',
    year: 'Year 1',
    subjectId: 'English',
    objectives: [
      'Learn 40+ synthetic sounds (phonemes) and blend them to read new words.',
      'Practice reading common exception words that do not follow standard rules (e.g. "the", "said", "was").',
      'Identify grapheme-phoneme correspondences (GPCs) in early readers.'
    ],
    quiz: [
      {
        id: 'q-e-y1-phonics-1',
        question: 'How do you read the common exception word "said"?',
        options: ['S-A-I-D (rhymes with raid)', 'S-E-D (rhymes with red)', 'S-A-Y-D'],
        correctAnswer: 1,
        explanation: '"Said" is a tricky exception word! It sounds like "sed" and rhymes with "red".'
      }
    ]
  },
  {
    id: 'e-y1-plurals',
    title: 'English: Spelling — plural nouns "s" and "es"',
    year: 'Year 1',
    subjectId: 'English',
    objectives: [
      'Turn singular nouns into plurals by adding an "s" or "es".',
      'Understand when to use "es" (for words ending in s, x, z, ch, sh) and "s" for others.',
      'Apply spelling conventions when writing simple sentences.'
    ],
    quiz: [
      {
        id: 'q-e-y1-plurals-1',
        question: 'What is the correct plural spelling of the word "box"?',
        options: ['boxs', 'boxes', 'boxies'],
        correctAnswer: 1,
        explanation: 'For words ending in "x", we add "es" to make them plural!'
      }
    ]
  },
  {
    id: 'e-y1-punctuation',
    title: 'English: Punctuation — capital letters and full stops',
    year: 'Year 1',
    subjectId: 'English',
    objectives: [
      'Begin every sentence with a capital letter and end with a full stop.',
      'Use capital letters for names of people, places, days of the week, and the personal pronoun "I".',
      'Read sentences aloud to check if they flow correctly.'
    ],
    quiz: [
      {
        id: 'q-e-y1-punctuation-1',
        question: 'Which of these sentences uses capitals and full stops perfectly?',
        options: ['on monday i went to the park', 'On Monday I went to the park.', 'On monday i went to the park.'],
        correctAnswer: 1,
        explanation: 'We capitalize "On" (start of sentence), "Monday" (day of week), and "I" (personal pronoun), plus we end with a full stop!'
      }
    ]
  },
  {
    id: 'm-y1-count-100',
    title: 'Maths: Number — counting to and across 100',
    year: 'Year 1',
    subjectId: 'Maths',
    objectives: [
      'Count forwards and backwards up to 100 starting from any number.',
      'Identify 1 more and 1 less than any given number.',
      'Read and write numbers from 1 to 100 in numerals.'
    ],
    quiz: [
      {
        id: 'q-m-y1-1',
        question: 'What is 1 more than 49?',
        options: ['48', '50', '60'],
        correctAnswer: 1,
        explanation: 'Counting up one step from 49 brings us to 50!'
      }
    ]
  },
  {
    id: 's-y1-materials',
    title: 'Science: Biology — everyday materials and properties',
    year: 'Year 1',
    subjectId: 'Science',
    objectives: [
      'Identify common materials like wood, plastic, glass, metal, and water.',
      'Describe simple properties such as hard, soft, transparent, or stretchy.'
    ],
    quiz: [
      {
        id: 'q-s-y1-1',
        question: 'Why is glass used to make classroom windows?',
        options: ['Because it is stretchy', 'Because it is transparent (see-through)', 'Because it is soft'],
        correctAnswer: 1,
        explanation: 'Glass is transparent, which lets bright sunlight pour into our classrooms!'
      }
    ]
  },

  // ==========================================
  // YEAR 2 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y2-inference',
    title: 'English: Comprehension — inference and prediction',
    year: 'Year 2',
    subjectId: 'English',
    objectives: [
      'Find clues in illustrations and texts to explain how characters feel.',
      'Predict what will happen next in an exciting story.',
      'Answer "how" and "why" questions based on simple clues.'
    ],
    quiz: [
      {
        id: 'q-e-y2-1',
        question: 'If a story says "Luna smiled brightly and skipped down the lane," how does Luna feel?',
        options: ['Angry and cross', 'Happy and excited', 'Tired and sleepy'],
        correctAnswer: 1,
        explanation: 'Smiling and skipping are clear clues showing Luna is very happy and excited!'
      }
    ]
  },
  {
    id: 'e-y2-word-classes',
    title: 'English: Grammar — word classes (nouns, verbs, adjectives)',
    year: 'Year 2',
    subjectId: 'English',
    objectives: [
      'Identify nouns (naming words), verbs (action words), and adjectives (describing words).',
      'Select colorful adjectives to make writing exciting.',
      'Write sentences with consistent past and present tense.'
    ],
    quiz: [
      {
        id: 'q-e-y2-word-classes-1',
        question: 'In the sentence "The golden dragon flew high," which word is the ADJECTIVE?',
        options: ['dragon', 'flew', 'golden'],
        correctAnswer: 2,
        explanation: '"Golden" is the adjective because it describes what the dragon looks like!'
      }
    ]
  },
  {
    id: 'e-y2-punctuation-lists',
    title: 'English: Punctuation — question marks and list commas',
    year: 'Year 2',
    subjectId: 'English',
    objectives: [
      'Use question marks at the end of asking sentences.',
      'Add commas to separate items in a list, ending with "and" for the last item.',
      'Apply exclamation marks for exciting or surprising sentences.'
    ],
    quiz: [
      {
        id: 'q-e-y2-punctuation-lists-1',
        question: 'Which sentence uses commas correctly for a list of items?',
        options: ['I bought apples, bananas, cherries and pears.', 'I bought apples bananas cherries and pears.', 'I bought apples, bananas, cherries, and, pears.'],
        correctAnswer: 0,
        explanation: 'Commas are used to separate items in a list, with the final item joined by "and".'
      }
    ]
  },
  {
    id: 'e-y2-suffixes',
    title: 'English: Spelling — suffixes and homophones',
    year: 'Year 2',
    subjectId: 'English',
    objectives: [
      'Add suffixes like -ful, -less, -ly, and -ness to root words.',
      'Distinguish between common homophones like there, their, and they\'re.',
      'Spell common exception words for Year 2 accurately.'
    ],
    quiz: [
      {
        id: 'q-e-y2-suffixes-1',
        question: 'Which words complete the sentence: "The children played ___ over ___"?',
        options: ['happily / there', 'happy / their', 'happily / they\'re'],
        correctAnswer: 0,
        explanation: '"Happily" is the adverb describing how they played, and "there" indicates the place!'
      }
    ]
  },
  {
    id: 'm-y2-multiplication',
    title: 'Maths: Multiplication — 2, 5, and 10 times tables',
    year: 'Year 2',
    subjectId: 'Maths',
    objectives: [
      'Recall multiplication facts for the 2, 5, and 10 times tables.',
      'Solve simple multiplication word problems.',
      'Understand division as the inverse of multiplication.'
    ],
    quiz: [
      {
        id: 'q-m-y2-1',
        question: 'What is 5 times 4 (5 x 4)?',
        options: ['15', '20', '25'],
        correctAnswer: 1,
        explanation: 'Excellent! Counting in 5s four times (5, 10, 15, 20) equals 20.'
      }
    ]
  },
  {
    id: 's-y2-habitats',
    title: 'Science: Biology — living things and their habitats',
    year: 'Year 2',
    subjectId: 'Science',
    objectives: [
      'Understand how micro-habitats (like logs or ponds) provide food and shelter.',
      'Compare living, dead, and non-living objects.'
    ],
    quiz: [
      {
        id: 'q-s-y2-1',
        question: 'Where would you find woodlice and worms living?',
        options: ['High up in the hot sky', 'Deep in the sandy desert', 'Under a damp, rot-filled wood log'],
        correctAnswer: 2,
        explanation: 'Under a damp, rot-filled log is a perfect micro-habitat with water and food for mini-beasts!'
      }
    ]
  },
  {
    id: 's-y2-materials',
    title: 'Science: Chemistry — uses of everyday materials',
    year: 'Year 2',
    subjectId: 'Science',
    objectives: [
      'Compare why everyday materials like wood, metal, plastic, glass, brick and paper are suited to different uses.',
      'Investigate how solid materials change shape by squashing, bending, twisting and stretching.'
    ],
    quiz: [
      {
        id: 'q-s-y2-materials-1',
        question: 'Which property makes plastic a great material for making a raincoat or umbrella?',
        options: ['It is waterproof', 'It dissolves in rain', 'It breaks like thin glass'],
        correctAnswer: 0,
        explanation: 'Waterproof materials keep rain out so you stay dry inside your coat or under your umbrella!'
      }
    ]
  },

  // ==========================================
  // YEAR 3 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y3-conjunctions',
    title: 'English: Grammar — coordinating and subordinating conjunctions',
    year: 'Year 3',
    subjectId: 'English',
    objectives: [
      'Identify coordinating conjunctions (and, but, or, so).',
      'Use subordinating conjunctions (because, if, when, although) to extend sentences.',
      'Write complex sentences with clear meaning.'
    ],
    quiz: [
      {
        id: 'q-e-y3-1',
        question: 'Which subordinating conjunction fits best: "We went inside ___ it started to rain"?',
        options: ['but', 'because', 'or'],
        correctAnswer: 1,
        explanation: '"Because" explains the cause or reason why we decided to go inside!'
      }
    ]
  },
  {
    id: 'e-y3-prepositions',
    title: 'English: Grammar — prepositions and adverbs of time and place',
    year: 'Year 3',
    subjectId: 'English',
    objectives: [
      'Express time, place, and cause using prepositions (before, during, in, because of).',
      'Add cohesive adverbs like "then", "next", "soon", and "therefore".',
      'Organize simple paragraphs to group related ideas together.'
    ],
    quiz: [
      {
        id: 'q-e-y3-prepositions-1',
        question: 'Which preposition of time fits best: "We must finish our painting ___ the school bell rings"?',
        options: ['before', 'under', 'between'],
        correctAnswer: 0,
        explanation: '"Before" is a preposition of time that explains when the painting must be completed!'
      }
    ]
  },
  {
    id: 'e-y3-speech',
    title: 'English: Punctuation — inverted commas (speech marks)',
    year: 'Year 3',
    subjectId: 'English',
    objectives: [
      'Identify when a character is speaking and enclose their spoken words in speech marks (inverted commas).',
      'Ensure the first spoken word starts with a capital letter.',
      'Place punctuation marks (like commas, question marks, or full stops) inside speech marks.'
    ],
    quiz: [
      {
        id: 'q-e-y3-speech-1',
        question: 'Which sentence is punctuated correctly for direct speech?',
        options: ['Go to bed, said mother.', '"Go to bed," said mother.', '"Go to bed" said mother.'],
        correctAnswer: 1,
        explanation: 'The spoken words are inside inverted commas, and the comma sits inside the closing quote!'
      }
    ]
  },
  {
    id: 'e-y3-prefixes',
    title: 'English: Spelling — negative prefixes (dis-, mis-, un-)',
    year: 'Year 3',
    subjectId: 'English',
    objectives: [
      'Form antonyms (opposites) using prefixes like dis-, mis-, and un-.',
      'Understand how prefixes alter the meaning of base verbs and nouns.',
      'Recognize spellings of high-frequency words for Lower Key Stage 2.'
    ],
    quiz: [
      {
        id: 'q-e-y3-prefixes-1',
        question: 'If you add the prefix "mis-" to the word "behave", what does the new word mean?',
        options: ['To behave very well', 'To behave badly or incorrectly', 'To stop behaving'],
        correctAnswer: 1,
        explanation: 'The prefix "mis-" means badly or wrongly, so "misbehave" means behaving badly!'
      }
    ]
  },
  {
    id: 'm-y3-column-add',
    title: 'Maths: Addition & Subtraction — 3-digit column addition',
    year: 'Year 3',
    subjectId: 'Maths',
    objectives: [
      'Align hundreds, tens, and ones columns accurately.',
      'Add three-digit numbers with carrying/regrouping over 10.',
      'Check answers using the inverse subtraction operations.'
    ],
    quiz: [
      {
        id: 'q-m-y3-1',
        question: 'What is 245 + 138?',
        options: ['373', '383', '283'],
        correctAnswer: 1,
        explanation: 'Add the ones: 5+8=13 (carry 1). Add the tens: 4+3+1=8. Add the hundreds: 2+1=3. The answer is 383!'
      }
    ]
  },
  {
    id: 's-y3-light',
    title: 'Science: Physics — light, reflections, and dark shadows',
    year: 'Year 3',
    subjectId: 'Science',
    objectives: [
      'Understand that dark is the complete absence of light.',
      'Explain how shadows are formed when an opaque object blocks light.',
      'Recognise that light reflects off bright surfaces.'
    ],
    quiz: [
      {
        id: 'q-s-y3-1',
        question: 'What happens when light hits an OPAQUE object?',
        options: ['The light shines straight through', 'The light is blocked and forms a shadow', 'The object turns invisible'],
        correctAnswer: 1,
        explanation: 'Opaque materials block light completely, creating a dark shape behind them called a shadow!'
      }
    ]
  },

  // ==========================================
  // YEAR 4 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y4-retrieval',
    title: 'English: Reading comprehension — retrieval and fact-finding',
    year: 'Year 4',
    subjectId: 'English',
    objectives: [
      'Skim and scan pages quickly to find key nouns, numbers, and facts.',
      'Retrieve and record information from non-fiction scrolls and books.',
      'Provide evidence answers to prove historical or scientific facts.'
    ],
    quiz: [
      {
        id: 'q-e-y4-1',
        question: 'If a text says "The Roman army marched 20 miles a day carrying heavy shields," how far did they march?',
        options: ['10 miles', '20 miles', '5 miles'],
        correctAnswer: 1,
        explanation: 'The text explicitly says "20 miles a day", which we can retrieve directly!'
      }
    ]
  },
  {
    id: 'e-y4-fronted-adverbials',
    title: 'English: Grammar — fronted adverbials and commas',
    year: 'Year 4',
    subjectId: 'English',
    objectives: [
      'Start sentences with fronted adverbials describing when, where, or how an action happens.',
      'Always place a comma directly after the fronted adverbial phrase.',
      'Improve flow and variety of sentence openings in creative writing.'
    ],
    quiz: [
      {
        id: 'q-e-y4-fronted-adverbials-1',
        question: 'Which sentence has a correctly punctuated fronted adverbial?',
        options: ['Without warning, the dragon roared.', 'Without warning the dragon roared.', 'Suddenly the, dragon roared.'],
        correctAnswer: 0,
        explanation: '"Without warning" is the fronted adverbial describing how the action happened, followed by a mandatory comma!'
      }
    ]
  },
  {
    id: 'e-y4-expanded-nouns',
    title: 'English: Grammar — expanded noun phrases for detail',
    year: 'Year 4',
    subjectId: 'English',
    objectives: [
      'Expand nouns with qualifying adjectives and prepositional phrases for descriptive detail.',
      'Use expanded noun phrases to paint a vivid, sensory picture for the reader.',
      'Avoid noun repetition to keep sentences professional.'
    ],
    quiz: [
      {
        id: 'q-e-y4-expanded-nouns-1',
        question: 'Which of these is an expanded noun phrase?',
        options: ['The dog barked loudly.', 'The fluffy, black puppy with a shiny red collar', 'A cute dog'],
        correctAnswer: 1,
        explanation: 'This is an expanded noun phrase because it adds adjectives ("fluffy, black") and a prepositional phrase ("with a shiny red collar") to describe the puppy!'
      }
    ]
  },
  {
    id: 'e-y4-pronouns',
    title: 'English: Grammar — pronouns for cohesion and possession',
    year: 'Year 4',
    subjectId: 'English',
    objectives: [
      'Use personal and possessive pronouns to avoid repeating nouns within paragraphs.',
      'Identify possessive pronouns like "mine", "yours", "his", "hers", "ours", "theirs".',
      'Check standard agreement between singular/plural nouns and pronouns.'
    ],
    quiz: [
      {
        id: 'q-e-y4-pronouns-1',
        question: 'Which word is a possessive pronoun that avoids repetition in: "The book belongs to us; it is ___"?',
        options: ['we', 'our', 'ours'],
        correctAnswer: 2,
        explanation: '"Ours" is the possessive pronoun that shows ownership and avoids saying "our book" again!'
      }
    ]
  },
  {
    id: 'm-y4-decimals',
    title: 'Maths: Fractions & Decimals — hundredths and tenths',
    year: 'Year 4',
    subjectId: 'Maths',
    objectives: [
      'Recognise that hundredths arise when dividing an object into one hundred equal parts.',
      'Convert simple fractions (like 1/10 or 1/2) into decimal values.',
      'Order decimal numbers with up to two decimal places.'
    ],
    quiz: [
      {
        id: 'q-m-y4-1',
        question: 'What is the decimal equivalent of the fraction 1/2 (one half)?',
        options: ['0.2', '0.5', '0.05'],
        correctAnswer: 1,
        explanation: 'One half is exactly halfway to 1.0, which is represented as 0.5!'
      }
    ]
  },
  {
    id: 's-y4-matter',
    title: 'Science: Chemistry — states of matter (solids, liquids, gases)',
    year: 'Year 4',
    subjectId: 'Science',
    objectives: [
      'Group everyday materials as solids, liquids, or gases.',
      'Understand how heating and cooling can cause melting and freezing.',
      'Explore the water cycle phases: evaporation and condensation.'
    ],
    quiz: [
      {
        id: 'q-s-y4-1',
        question: 'What is it called when water vapor cools down and turns back into liquid water?',
        options: ['Evaporation', 'Condensation', 'Melting'],
        correctAnswer: 1,
        explanation: 'Condensation happens when warm gas cools down and transforms back into liquid water droplets!'
      }
    ]
  },

  // ==========================================
  // YEAR 5 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y5-figurative',
    title: 'English: Literary techniques — metaphors and similes',
    year: 'Year 5',
    subjectId: 'English',
    objectives: [
      'Compare things using "like" or "as" in creative similes.',
      'Create bold metaphors by saying something IS something else.',
      'Describe settings using poetic, figurative language to capture specific mood.'
    ],
    quiz: [
      {
        id: 'q-e-y5-1',
        question: 'Which of the following phrases is a creative METAPHOR?',
        options: ['The lake was as smooth as glass', 'The lake was a shiny, silver mirror', 'The lake looked cold and deep'],
        correctAnswer: 1,
        explanation: 'Saying the lake "was a mirror" is a metaphor because it says the lake is the mirror itself, rather than using "as" or "like"!'
      }
    ]
  },
  {
    id: 'e-y5-relative-clauses',
    title: 'English: Grammar — relative clauses and relative pronouns',
    year: 'Year 5',
    subjectId: 'English',
    objectives: [
      'Create complex sentences with relative clauses starting with who, which, where, when, whose, or that.',
      'Use relative clauses to add extra detail about a noun smoothly.',
      'Distinguish between restrictive and non-restrictive relative clauses.'
    ],
    quiz: [
      {
        id: 'q-e-y5-relative-clauses-1',
        question: 'Which relative pronoun correctly joins the clauses: "This is the astronaut ___ walked on the Moon"?',
        options: ['which', 'who', 'where'],
        correctAnswer: 1,
        explanation: 'We use "who" as the relative pronoun when referring to people (like astronauts)!'
      }
    ]
  },
  {
    id: 'e-y5-parenthesis',
    title: 'English: Punctuation — parenthesis (brackets, dashes, commas)',
    year: 'Year 5',
    subjectId: 'English',
    objectives: [
      'Identify parenthesis as extra, non-essential information added to a sentence.',
      'Enclose parenthesis with double brackets, dashes, or commas.',
      'Verify that the remaining sentence makes complete sense when the parenthesis is removed.'
    ],
    quiz: [
      {
        id: 'q-e-y5-parenthesis-1',
        question: 'Which sentence correctly uses parenthesis?',
        options: ['The Sun, which is a massive star, heats our Earth.', 'The Sun which is, a massive star heats our Earth.', 'The Sun which is a massive star (heats) our Earth.'],
        correctAnswer: 0,
        explanation: 'The extra information "which is a massive star" is enclosed by double commas as a parenthetical clause!'
      }
    ]
  },
  {
    id: 'e-y5-synonyms',
    title: 'English: Vocabulary — synonyms and antonyms for description',
    year: 'Year 5',
    subjectId: 'English',
    objectives: [
      'Expand writing vocabulary by replacing common words with descriptive synonyms.',
      'Use antonyms to create dramatic contrast in story characters and settings.',
      'Enhance cohesiveness in writing using rich lexical choices.'
    ],
    quiz: [
      {
        id: 'q-e-y5-synonyms-1',
        question: 'What is a strong synonym for the word "huge" in creative writing?',
        options: ['microscopic', 'colossal', 'ordinary'],
        correctAnswer: 1,
        explanation: '"Colossal" is a powerful synonym that means extremely huge or grand!'
      }
    ]
  },
  {
    id: 'm-y5-primes',
    title: 'Maths: Number — prime numbers and common factors',
    year: 'Year 5',
    subjectId: 'Maths',
    objectives: [
      'Define a prime number as having exactly two distinct factors: 1 and itself.',
      'Identify all prime numbers up to 50.',
      'Find common factors of two different numbers.'
    ],
    quiz: [
      {
        id: 'q-m-y5-1',
        question: 'Which of these numbers is a prime number?',
        options: ['9', '15', '17'],
        correctAnswer: 2,
        explanation: '17 is a prime number because it can only be divided evenly by 1 and 17!'
      }
    ]
  },
  {
    id: 's-y5-space',
    title: 'Science: Physics — Earth and space (planetary systems)',
    year: 'Year 5',
    subjectId: 'Science',
    objectives: [
      'Describe the movement of the Earth and other planets relative to the Sun.',
      'Explain Earth\'s rotation to show how night and day occur.',
      'Understand the spherical shape of the Sun, Earth, and Moon.'
    ],
    quiz: [
      {
        id: 'q-s-y5-1',
        question: 'How long does it take for the Earth to make one complete orbit around the Sun?',
        options: ['24 Hours', '28 Days', '365 Days (1 Year)'],
        correctAnswer: 2,
        explanation: 'It takes the Earth approximately 365 and a quarter days (one full year) to travel around the Sun!'
      }
    ]
  },

  // ==========================================
  // YEAR 6 CHRONOLOGICAL TOPICS
  // ==========================================
  {
    id: 'e-y6-voice',
    title: 'English: Grammar — active and passive voice constructions',
    year: 'Year 6',
    subjectId: 'English',
    objectives: [
      'Understand how active voice focuses on the person or thing doing the action.',
      'Construct passive voice sentences where the subject receives the action.',
      'Select active or passive voice to change the formality of writing.'
    ],
    quiz: [
      {
        id: 'q-e-y6-1',
        question: 'Which sentence is written in the PASSIVE voice?',
        options: ['The boy threw the red ball.', 'The red ball was thrown by the boy.', 'The ball bounced into the pond.'],
        correctAnswer: 1,
        explanation: '"The red ball was thrown by the boy" is passive because the subject (the ball) is having the action done to it!'
      }
    ]
  },
  {
    id: 'e-y6-colons-semicolons',
    title: 'English: Punctuation — colons and semi-colons',
    year: 'Year 6',
    subjectId: 'English',
    objectives: [
      'Use a colon to introduce lists or to separate two independent clauses where the second explains the first.',
      'Use a semi-colon to link two closely related independent clauses without needing a conjunction.',
      'Format bullet points consistently with correct punctuation boundaries.'
    ],
    quiz: [
      {
        id: 'q-e-y6-colons-semicolons-1',
        question: 'Which sentence uses a semi-colon correctly to connect two related thoughts?',
        options: ['The storm raged; the waves crashed against the rocks.', 'The storm raged; and the waves crashed.', 'The storm raged,; the waves crashed.'],
        correctAnswer: 0,
        explanation: 'The semi-colon links two complete, closely related clauses without needing a coordinating conjunction like "and"!'
      }
    ]
  },
  {
    id: 'e-y6-subjunctive',
    title: 'English: Grammar — formal subjunctive mood',
    year: 'Year 6',
    subjectId: 'English',
    objectives: [
      'Recognise and use the subjunctive verb form for formal advice, commands, or hypothetical conditions.',
      'Use words like "were" instead of "was" in conditional statements (e.g. "If I were you...").',
      'Differentiate between formal writing structures and informal spoken speech.'
    ],
    quiz: [
      {
        id: 'q-e-y6-subjunctive-1',
        question: 'Which sentence is written in the formal SUBJUNCTIVE mood?',
        options: ['If I was a bird, I would fly away.', 'If I were a bird, I would fly away.', 'I wish I was a bird.'],
        correctAnswer: 1,
        explanation: '"If I were..." is the subjunctive form used for hypothetical, imaginary conditions.'
      }
    ]
  },
  {
    id: 'e-y6-cohesive-devices',
    title: 'English: Grammar — cohesive devices and transition adverbs',
    year: 'Year 6',
    subjectId: 'English',
    objectives: [
      'Structure writing paragraphs beautifully using formal transition devices.',
      'Apply adverbs of contrast, addition, and consequence (e.g., consequently, furthermore, conversely).',
      'Select vocabulary and grammatical structures based on the target level of formality.'
    ],
    quiz: [
      {
        id: 'q-e-y6-cohesive-devices-1',
        question: 'Which cohesive adverb shows a CONSEQUENCE or result?',
        options: ['Furthermore', 'Consequently', 'Conversely'],
        correctAnswer: 1,
        explanation: '"Consequently" means "as a result of this", which highlights the consequence of an action!'
      }
    ]
  },
  {
    id: 'm-y6-algebra',
    title: 'Maths: Algebra — simple formula equations',
    year: 'Year 6',
    subjectId: 'Maths',
    objectives: [
      'Express missing number problems algebraically using variables.',
      'Find pairs of numbers that satisfy an equation with two unknowns.',
      'Solve linear equations step by step.'
    ],
    quiz: [
      {
        id: 'q-m-y6-1',
        question: 'If the algebraic equation is 3x + 5 = 20, what is the value of x?',
        options: ['3', '5', '15'],
        correctAnswer: 1,
        explanation: 'Subtract 5 from both sides: 3x = 15. Divide by 3: x = 5. Excellent algebra!'
      }
    ]
  },
  {
    id: 's-y6-electricity',
    title: 'Science: Physics — electricity and circuit symbols',
    year: 'Year 6',
    subjectId: 'Science',
    objectives: [
      'Represent electrical circuits using standard schematic symbols.',
      'Explain how the brightness of a bulb or volume of a buzzer depends on battery voltage.',
      'Identify electrical conductors and insulators.'
    ],
    quiz: [
      {
        id: 'q-s-y6-1',
        question: 'What happens to a bulb in a circuit if you add a second identical cell/battery in series?',
        options: ['The bulb shines brighter', 'The bulb shines dimmer', 'The bulb turns off completely'],
        correctAnswer: 0,
        explanation: 'Adding more batteries increases the electrical energy pushing through the circuit, making the bulb glow brighter!'
      }
    ]
  },

  // ==========================================
  // MULTI-YEAR CURRICULUM TOPICS (KEY STAGES)
  // ==========================================
  {
    id: 'h-london-1666',
    title: 'History: Events beyond living memory — Great Fire of London 1666',
    year: 'Year 1–2',
    subjectId: 'History',
    objectives: [
      'Understand why the Great Fire started in Thomas Farriner\'s bakery in Pudding Lane.',
      'Describe why the wooden houses burnt so quickly and how the fire was stopped.',
      'Explore Samuel Pepys\' famous diary as a primary source of history.'
    ],
    quiz: [
      {
        id: 'q-h-1',
        question: 'In which street of London did the Great Fire of 1666 start?',
        options: ['Baker Street', 'Pudding Lane', 'Park Lane'],
        correctAnswer: 1,
        explanation: 'The fire started at a bakery in Pudding Lane early on a Sunday morning!'
      }
    ]
  },
  {
    id: 'h-romans',
    title: 'History: Invasion history — The Roman Empire & Boudicca',
    year: 'Year 3–4',
    subjectId: 'History',
    objectives: [
      'Describe the power of the Roman army and their invasion of Britain in AD 43.',
      'Learn about Queen Boudicca\'s rebellion against Roman rule.',
      'Identify lasting Roman legacies like straight roads, villas, and baths.'
    ],
    quiz: [
      {
        id: 'q-h-romans',
        question: 'Who was Queen Boudicca?',
        options: ['The Roman Empress of Britain', 'The fierce Celtic queen who fought the Romans', 'A famous Roman gladiator'],
        correctAnswer: 1,
        explanation: 'Boudicca was the powerful queen of the Iceni tribe who led a brave rebellion against Roman forces!'
      }
    ]
  },
  {
    id: 'h-egyptians',
    title: 'History: Ancient World — Egypt and the Valley of the Kings',
    year: 'Year 5–6',
    subjectId: 'History',
    objectives: [
      'Understand the vital importance of the River Nile to Egyptian farming.',
      'Explore the structure of the pyramids, pharaohs, and mummification.',
      'Learn how Howard Carter discovered King Tutankhamun\'s tomb.'
    ],
    quiz: [
      {
        id: 'q-h-egyptians',
        question: 'Which river was essential for farming and travel in Ancient Egypt?',
        options: ['The Amazon', 'The Nile', 'The Thames'],
        correctAnswer: 1,
        explanation: 'The River Nile flooded every year, leaving rich black soil that was perfect for growing crops!'
      }
    ]
  },
  {
    id: 'g-uk-capitals',
    title: 'Geography: Locational knowledge — four countries of the UK and capitals',
    year: 'Year 1–2',
    subjectId: 'Geography',
    objectives: [
      'Name the four countries of the United Kingdom: England, Scotland, Wales, and Northern Ireland.',
      'Identify their capital cities: London, Edinburgh, Cardiff, and Belfast.'
    ],
    quiz: [
      {
        id: 'q-g-1',
        question: 'What is the capital city of Wales?',
        options: ['Cardiff', 'Edinburgh', 'London'],
        correctAnswer: 0,
        explanation: 'Cardiff is the vibrant capital city of Wales, surrounded by beautiful Welsh mountains and castles!'
      }
    ]
  },
  {
    id: 'g-volcanoes',
    title: 'Geography: Physical geography — tectonic plates, volcanoes, & earthquakes',
    year: 'Year 3–4',
    subjectId: 'Geography',
    objectives: [
      'Understand how tectonic plates move on the mantle of the Earth.',
      'Explain how magma bursts through crust vents to form active volcanoes.',
      'Locate the Ring of Fire on a physical world map.'
    ],
    quiz: [
      {
        id: 'q-g-volcanoes',
        question: 'What is liquid rock called BEFORE it erupts onto Earth\'s surface?',
        options: ['Lava', 'Magma', 'Granite'],
        correctAnswer: 1,
        explanation: 'Deep underground it is called magma, but once it erupts into the open air, we call it lava!'
      }
    ]
  },
  {
    id: 'g-biomes',
    title: 'Geography: Environmental geography — global climate zones & biomes',
    year: 'Year 5–6',
    subjectId: 'Geography',
    objectives: [
      'Differentiate between polar, temperate, tropical, and desert climate zones.',
      'Describe physical features of rainforest, savannah, and tundra biomes.',
      'Analyze how human activity impacts fragile climate systems.'
    ],
    quiz: [
      {
        id: 'q-g-biomes',
        question: 'Which biome has extremely dry climates, sparse plants, and hot daytime temperatures?',
        options: ['Tropical Rainforest', 'Desert', 'Deciduous Forest'],
        correctAnswer: 1,
        explanation: 'Deserts are defined by receiving very little rainfall and having extreme temperatures!'
      }
    ]
  },
  {
    id: 'a-colors',
    title: 'Art: Painting — mixing primary and secondary colours',
    year: 'Year 1–2',
    subjectId: 'Art',
    objectives: [
      'Identify primary paint colors: Red, Blue, and Yellow.',
      'Blend primary colors to create secondary tones: Green, Orange, and Purple.'
    ],
    quiz: [
      {
        id: 'q-a-1',
        question: 'What secondary color do you get when you mix Red and Blue paint?',
        options: ['Green', 'Orange', 'Purple'],
        correctAnswer: 2,
        explanation: 'Mixing warm red and cool blue yields a royal purple!'
      }
    ]
  },
  {
    id: 'a-sketching',
    title: 'Art: Sketching — light, shade, and 3D shapes',
    year: 'Year 3–4',
    subjectId: 'Art',
    objectives: [
      'Use shading pencils (2B, 4B) to create tones and shadows.',
      'Sketch 3D spheres and cylinders on paper using light directions.',
      'Understand perspective lines in simple landscape drawings.'
    ],
    quiz: [
      {
        id: 'q-a-sketching',
        question: 'To make a sketch look 3D, what do you add to the side opposite the light source?',
        options: ['A bright highlight', 'Dark shading and a cast shadow', 'Neon watercolors'],
        correctAnswer: 1,
        explanation: 'Adding dark shading and a cast shadow on the opposite side of light creates a realistic 3D appearance!'
      }
    ]
  },
  {
    id: 'a-impressionism',
    title: 'Art: Painting styles — Impressionism and Monet',
    year: 'Year 5–6',
    subjectId: 'Art',
    objectives: [
      'Learn about the Impressionist movement in France in the 1870s.',
      'Explore Claude Monet\'s use of quick brushstrokes to paint light and reflection.',
      'Paint a personal landscape using dabs and strokes of pure color.'
    ],
    quiz: [
      {
        id: 'q-a-monet',
        question: 'Which Impressionist artist is famous for his painting of Water Lilies?',
        options: ['Claude Monet', 'Leonardo da Vinci', 'Pablo Picasso'],
        correctAnswer: 0,
        explanation: 'Claude Monet spent years painting water lilies in his beautiful gardens in Giverny, France!'
      }
    ]
  },
  {
    id: 'dt-mechanisms',
    title: 'DT: Mechanisms — wheels and axles — making a moving vehicle',
    year: 'Year 1–2',
    subjectId: 'DT',
    objectives: [
      'Understand how a wheel spins around a central stick called an axle.',
      'Design and assemble a toy vehicle with moving wheels.'
    ],
    quiz: [
      {
        id: 'q-dt-1',
        question: 'What is the name of the central rod that holds wheels in place and lets them spin?',
        options: ['Axle', 'Lever', 'Bridge'],
        correctAnswer: 0,
        explanation: 'The axle supports the spinning wheels and holds them to the vehicle body!'
      }
    ]
  },
  {
    id: 'dt-pneumatics',
    title: 'DT: Pneumatics — creating mechanisms with air pressure',
    year: 'Year 3–4',
    subjectId: 'DT',
    objectives: [
      'Understand that air pressure can be used to make things move.',
      'Design a moving monster mouth using syringes and plastic tubing.',
      'Assemble secure hinges that pivot smoothly.'
    ],
    quiz: [
      {
        id: 'q-dt-pneumatics',
        question: 'What gas do we push through syringes and tubes in a classroom pneumatic system?',
        options: ['Water', 'Air', 'Electricity'],
        correctAnswer: 1,
        explanation: 'Pneumatics uses compressed air to transmit energy and create mechanical movement!'
      }
    ]
  },
  {
    id: 'dt-bridges',
    title: 'DT: Structures — designing truss and arch bridges',
    year: 'Year 5–6',
    subjectId: 'DT',
    objectives: [
      'Compare beam, arch, and suspension bridge designs.',
      'Understand how triangular braces (trusses) distribute heavy weight.',
      'Construct a scale bridge model using wood dowels or cardboard.'
    ],
    quiz: [
      {
        id: 'q-dt-bridges',
        question: 'Which geometric shape is the strongest for structural bridge frames because it distributes weight evenly?',
        options: ['Square', 'Triangle', 'Circle'],
        correctAnswer: 1,
        explanation: 'Triangles do not bend or deform easily, making them the strongest shape for truss bridges!'
      }
    ]
  },
  {
    id: 'c-scratch',
    title: 'Computing: Programming — Scratch Jr and algorithms',
    year: 'Year 1–2',
    subjectId: 'Computing',
    objectives: [
      'Build step-by-step logic scripts using Scratch blocks.',
      'Control digital characters to run and interact on screen.'
    ],
    quiz: [
      {
        id: 'q-c-1',
        question: 'What is a list of step-by-step instructions given to a computer called?',
        options: ['Scratch', 'An Algorithm', 'A Keyboard'],
        correctAnswer: 1,
        explanation: 'An algorithm is a step-by-step instruction list that computers execute!'
      }
    ]
  },
  {
    id: 'c-loops',
    title: 'Computing: Programming — variables, loops, & conditionals',
    year: 'Year 3–4',
    subjectId: 'Computing',
    objectives: [
      'Use repeat blocks (loops) to make code run multiple times.',
      'Create and update variables to store game scores.',
      'Apply "if...then" conditionals to control sprite events.'
    ],
    quiz: [
      {
        id: 'q-c-loops',
        question: 'In computer programming, what does a LOOP do?',
        options: ['It turns the computer off', 'It repeats a block of instructions multiple times', 'It plays a loud sound'],
        correctAnswer: 1,
        explanation: 'A loop runs the same code block repeatedly, which saves programmers from rewriting code!'
      }
    ]
  },
  {
    id: 'c-cyber',
    title: 'Computing: Web search — safety and digital footprints',
    year: 'Year 5–6',
    subjectId: 'Computing',
    objectives: [
      'Perform effective searches using search engine keywords.',
      'Understand that anything shared online forms a permanent digital footprint.',
      'Identify reliable sources of information on the internet.'
    ],
    quiz: [
      {
        id: 'q-c-footprint',
        question: 'What is your "digital footprint" online?',
        options: ['A virtual drawing of your foot', 'The trail of information you leave behind when browsing the internet', 'A lock password'],
        correctAnswer: 1,
        explanation: 'Every search, click, and post you make contributes to your permanent digital footprint!'
      }
    ]
  },
  {
    id: 'mu-elements',
    title: 'Music: Music theory — pulse, rhythm, pitch, and dynamics',
    year: 'Year 1–2',
    subjectId: 'Music',
    objectives: [
      'Identify the pulse as the steady heartbeat of any musical tune.',
      'Differentiate between high and low pitch, and loud and soft dynamics.'
    ],
    quiz: [
      {
        id: 'q-mu-1',
        question: 'In music, what do we call the volume of sound (how loud or soft it is)?',
        options: ['Pitch', 'Dynamics', 'Tempo'],
        correctAnswer: 1,
        explanation: 'Dynamics refers to the loud (forte) and soft (piano) volume levels in music!'
      }
    ]
  },
  {
    id: 'mu-notation',
    title: 'Music: Notation — reading stave notation and notes',
    year: 'Year 3–4',
    subjectId: 'Music',
    objectives: [
      'Recognise the treble clef and stave lines.',
      'Read and play notes on the stave (E, G, B, D, F and F, A, C, E).',
      'Understand note values like crotchets, minims, and semibreves.'
    ],
    quiz: [
      {
        id: 'q-mu-notation',
        question: 'What are the names of the notes that sit inside the spaces of a treble clef stave?',
        options: ['F - A - C - E', 'E - G - B - D', 'A - B - C - D'],
        correctAnswer: 0,
        explanation: 'The spaces in a treble clef stave spell out the word FACE (F, A, C, E) from bottom to top!'
      }
    ]
  },
  {
    id: 'mu-history',
    title: 'Music: Appreciation — Orchestral instruments & famous composers',
    year: 'Year 5–6',
    subjectId: 'Music',
    objectives: [
      'Group instruments into string, woodwind, brass, and percussion families.',
      'Identify famous classical composers like Mozart and Beethoven.',
      'Analyze the emotional impact of tempos and orchestration.'
    ],
    quiz: [
      {
        id: 'q-mu-composers',
        question: 'Which instrument family does the Oboe and Clarinet belong to?',
        options: ['String family', 'Woodwind family', 'Percussion family'],
        correctAnswer: 1,
        explanation: 'The oboe and clarinet are woodwind instruments because they use wooden reeds and air pressure!'
      }
    ]
  },
  {
    id: 'pe-gymnastics',
    title: 'PE: Gymnastics — travelling, rolling, and balancing',
    year: 'Year 1–2',
    subjectId: 'PE',
    objectives: [
      'Perform steady body balances using different contact points.',
      'Roll safely on physical gym mats (pencil rolls and tuck rolls).'
    ],
    quiz: [
      {
        id: 'q-pe-1',
        question: 'When balancing on one foot, what is the best way to stay steady?',
        options: ['Spin around quickly', 'Look at a still spot and stretch out your arms', 'Close your eyes'],
        correctAnswer: 1,
        explanation: 'Looking at a stationary point and extending your arms helps keep your balance steady!'
      }
    ]
  },
  {
    id: 'pe-athletics',
    title: 'PE: Athletics — sprinting forms and relay handovers',
    year: 'Year 3–4',
    subjectId: 'PE',
    objectives: [
      'Demonstrate efficient running form with high knees and arm drives.',
      'Perform a smooth, non-visual relay baton handover in lanes.',
      'Set off cleanly from standard running starts.'
    ],
    quiz: [
      {
        id: 'q-pe-athletics',
        question: 'What is the stick called that runners pass to each other in a relay race?',
        options: ['Javelin', 'Baton', 'Racket'],
        correctAnswer: 1,
        explanation: 'A baton is the hollow tube that runners must pass within the exchange zone during a relay race!'
      }
    ]
  },
  {
    id: 'pe-tactics',
    title: 'PE: Invasion games — team tactics & positions',
    year: 'Year 5–6',
    subjectId: 'PE',
    objectives: [
      'Understand attacker and defender roles in games like football and netball.',
      'Communicate to mark opponents and create space on courts.',
      'Develop warm-up drills to prevent muscle strain.'
    ],
    quiz: [
      {
        id: 'q-pe-tactics',
        question: 'In team sports, what does "marking" an opponent mean?',
        options: ['Drawing a line around them', 'Staying close to prevent them receiving a pass', 'Cheering for them'],
        correctAnswer: 1,
        explanation: 'Marking means staying close to an opposing player so they cannot easily receive or pass the ball!'
      }
    ]
  },
  {
    id: 're-diwali',
    title: 'RE: Hinduism — Diwali — the festival of lights',
    year: 'Year 1–2',
    subjectId: 'RE',
    objectives: [
      'Hear the story of Prince Rama and Princess Sita defeating the demon Ravana.',
      'Discover how families light small clay lamps called "diyas" to celebrate.'
    ],
    quiz: [
      {
        id: 'q-re-1',
        question: 'What are the tiny clay oil lamps called that people light during Diwali?',
        options: ['Candles', 'Lanterns', 'Diyas'],
        correctAnswer: 2,
        explanation: 'Diyas are lit during Diwali to symbolise the victory of light and wisdom over darkness!'
      }
    ]
  },
  {
    id: 're-ramadan',
    title: 'RE: Islam — fasting during the holy month of Ramadan',
    year: 'Year 3–4',
    subjectId: 'RE',
    objectives: [
      'Understand that Ramadan is the holy month of prayer and fasting for Muslims.',
      'Describe how fasting helps focus on charity, empathy, and gratitude.',
      'Learn about the joyful celebration of Eid al-Fitr at the end of Ramadan.'
    ],
    quiz: [
      {
        id: 'q-re-ramadan',
        question: 'What is the festival called that marks the end of Ramadan fasting?',
        options: ['Hanukkah', 'Eid al-Fitr', 'Christmas'],
        correctAnswer: 1,
        explanation: 'Eid al-Fitr is a beautiful festival of feasting, giving, and celebrating the completion of Ramadan!'
      }
    ]
  },
  {
    id: 're-buddhism',
    title: 'RE: Buddhism — Siddhartha Gautama and the Eightfold Path',
    year: 'Year 5–6',
    subjectId: 'RE',
    objectives: [
      'Explore the life story of Prince Siddhartha Gautama becoming the Buddha.',
      'Understand the core values of meditation, kindness, and mindfulness.',
      'Examine the Eightfold Path as a guide to living a peaceful life.'
    ],
    quiz: [
      {
        id: 'q-re-buddha',
        question: 'Under which type of tree did Siddhartha Gautama achieve enlightenment and become the Buddha?',
        options: ['The Bodhi tree', 'An Oak tree', 'A Maple tree'],
        correctAnswer: 0,
        explanation: 'Siddhartha Gautama sat under the Bodhi tree in deep meditation until he achieved enlightenment!'
      }
    ]
  },
  {
    id: 'pshe-feelings',
    title: 'PSHE: Feelings — exploring and naming our emotions',
    year: 'Year 1–2',
    subjectId: 'PSHE',
    objectives: [
      'Identify and name core emotions: happy, sad, worried, and excited.',
      'Learn breathing techniques to stay calm when feeling anxious.'
    ],
    quiz: [
      {
        id: 'q-ps-1',
        question: 'If a classmate is feeling sad, what is a kind thing you can do?',
        options: ['Ignore them', 'Ask if they are okay and invite them to play', 'Take their toy'],
        correctAnswer: 1,
        explanation: 'Asking if they are okay and sharing your games is a wonderful way to show kindness!'
      }
    ]
  },
  {
    id: 'pshe-safety',
    title: 'PSHE: Health & Safety — internet safety and screen balance',
    year: 'Year 3–4',
    subjectId: 'PSHE',
    objectives: [
      'Create safe passwords that protect private details.',
      'Identify who to speak to if you see something unkind online.',
      'Balance screen hours with physical outdoors play.'
    ],
    quiz: [
      {
        id: 'q-ps-safety',
        question: 'If you see something that makes you worried or uncomfortable online, what should you do?',
        options: ['Keep it a secret', 'Tell a trusted adult immediately', 'Delete the computer app'],
        correctAnswer: 1,
        explanation: 'Telling a trusted adult, like a parent or teacher, is the safest way to handle online worries!'
      }
    ]
  },
  {
    id: 'pshe-decisions',
    title: 'PSHE: Growth mindsets — setting goals & high school transition',
    year: 'Year 5–6',
    subjectId: 'PSHE',
    objectives: [
      'Set academic goals and track your personal strengths.',
      'Learn strategies to manage change when transitioning to high school.',
      'Discuss how peer influence impacts personal decision making.'
    ],
    quiz: [
      {
        id: 'q-ps-growth',
        question: 'What is a "growth mindset"?',
        options: ['Believing that you cannot learn anything new', 'Believing that you can improve your abilities with practice and effort', 'A medical name for height'],
        correctAnswer: 1,
        explanation: 'A growth mindset means knowing that practice, patience, and effort make your brain stronger and smarter!'
      }
    ]
  }
];

export function getTopicsForYearAndSubject(
  year: 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5' | 'Year 6',
  subjectId: string
): Topic[] {
  return TOPICS.filter(t => {
    const isSubject = t.subjectId === subjectId;
    const isYearMatch =
      t.year === year ||
      (year === 'Year 1' && t.year === 'Year 1–2') ||
      (year === 'Year 2' && t.year === 'Year 1–2') ||
      (year === 'Year 3' && t.year === 'Year 3–4') ||
      (year === 'Year 4' && t.year === 'Year 3–4') ||
      (year === 'Year 5' && t.year === 'Year 5–6') ||
      (year === 'Year 6' && t.year === 'Year 5–6') ||
      t.year === 'Year 1–6';
    return isSubject && isYearMatch;
  });
}
