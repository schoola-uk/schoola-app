export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  subjectId: string;
  channelName: string;
  duration: string;
  description: string;
  topicIds?: string[];
  keywords: string[];
}

export interface EducationChannel {
  name: string;
  logo: string;
  handle: string;
  url: string;
  description: string;
  popularPlaylists: string[];
}

export const CURATED_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  // ==========================================
  // ENGLISH (All 20 Curriculum Topics Matched)
  // ==========================================
  {
    id: 'yt-e1-spoken',
    title: 'Listening and Following Directions',
    youtubeId: 'Z155TgEs8yA',
    subjectId: 'English',
    channelName: 'Twinkl',
    duration: '3:15',
    description: 'Practice active listening, asking clear questions, and taking turns in classroom discussions.',
    topicIds: ['e-y1-spoken-listen'],
    keywords: ['spoken language', 'listening', 'responding', 'asking', 'answering', 'directions'],
  },
  {
    id: 'yt-e1-phonics',
    title: 'Phonics Phase 2 & 3: Letter Sounds and Pronunciation',
    youtubeId: 'nBFnAcXHOUQ',
    subjectId: 'English',
    channelName: 'Oxford Owl',
    duration: '4:40',
    description: 'Master pure synthetic phonics sounds and blending for early UK primary reading.',
    topicIds: ['e-y1-phonics'],
    keywords: ['phonics', 'phase', 'sounds', 'phonemes', 'blending', 'exception words', 'decoding', 'word reading'],
  },
  {
    id: 'yt-e1-plurals',
    title: 'Plural Nouns: Adding -s and -es',
    youtubeId: 'lD1OaD4FBqM',
    subjectId: 'English',
    channelName: 'Nessy',
    duration: '3:30',
    description: 'Learn when to add -s or -es to turn singular nouns into plurals.',
    topicIds: ['e-y1-plurals'],
    keywords: ['plural', 'plurals', 's and es', 'spelling', 'nouns'],
  },
  {
    id: 'yt-e1-punctuation',
    title: 'The Sentence Song: Capital Letters and Full Stops',
    youtubeId: 'gghvLTSS-eQ',
    subjectId: 'English',
    channelName: 'Scratch Garden',
    duration: '2:45',
    description: 'Remember to start every sentence with a capital letter and finish with a full stop.',
    topicIds: ['e-y1-punctuation'],
    keywords: ['capital letters', 'full stops', 'sentence', 'sentences', 'punctuation'],
  },
  {
    id: 'yt-e2-inference',
    title: 'Making Inferences and Reading Comprehension for Kids',
    youtubeId: 'M3ZKbnBw7NY',
    subjectId: 'English',
    channelName: 'Learn Bright',
    duration: '6:10',
    description: 'Use story clues to infer how characters feel and predict what might happen next.',
    topicIds: ['e-y2-inference'],
    keywords: ['inference', 'prediction', 'comprehension', 'predicting', 'themes', 'fiction'],
  },
  {
    id: 'yt-e2-word-classes',
    title: 'Nouns, Verbs, and Adjectives for Kids',
    youtubeId: '_II6ySgUtWc',
    subjectId: 'English',
    channelName: 'StoryBots',
    duration: '4:30',
    description: 'Spot naming words (nouns), action words (verbs), and describing words (adjectives).',
    topicIds: ['e-y2-word-classes'],
    keywords: ['word classes', 'nouns', 'verbs', 'adjectives'],
  },
  {
    id: 'yt-e2-punctuation-lists',
    title: 'Commas and Punctuation Marks for Kids',
    youtubeId: 'KTvIGmD176o',
    subjectId: 'English',
    channelName: 'Smile and Learn',
    duration: '4:05',
    description: 'Learn how commas separate list items alongside question and exclamation marks.',
    topicIds: ['e-y2-punctuation-lists'],
    keywords: ['question marks', 'list commas', 'commas', 'apostrophes', 'punctuation'],
  },
  {
    id: 'yt-e2-suffixes',
    title: 'Homophones and Word Endings (Suffixes) for Kids',
    youtubeId: 'f9fy4NREF-E',
    subjectId: 'English',
    channelName: 'Tutoring Hour',
    duration: '5:15',
    description: 'Distinguish between common homophones (there, their, they’re) and word endings.',
    topicIds: ['e-y2-suffixes'],
    keywords: ['suffixes', 'homophones', 'word list', 'spelling'],
  },
  {
    id: 'yt-e3-conjunctions',
    title: 'Coordinating and Subordinating Conjunctions for Kids',
    youtubeId: 'ECiFApWcrDU',
    subjectId: 'English',
    channelName: 'Learn Bright',
    duration: '5:40',
    description: 'Join clauses cleanly using coordinating (and, but, or) and subordinating (because, if, when) conjunctions.',
    topicIds: ['e-y3-conjunctions'],
    keywords: ['conjunctions', 'coordinating', 'subordinating', 'coordination', 'subordination'],
  },
  {
    id: 'yt-e3-prepositions',
    title: 'Prepositions of Place and Time for Kids',
    youtubeId: 'niPyVnC6W5g',
    subjectId: 'English',
    channelName: 'Smile and Learn',
    duration: '4:15',
    description: 'Express where, when, and why actions happen using clear prepositions.',
    topicIds: ['e-y3-prepositions'],
    keywords: ['prepositions', 'adverbs', 'time and place'],
  },
  {
    id: 'yt-e3-speech',
    title: 'Inverted Commas (Speech Marks) Song',
    youtubeId: 'ukBuvObbAVE',
    subjectId: 'English',
    channelName: 'Grammarsaurus',
    duration: '3:20',
    description: 'Punctuate direct speech accurately with inverted commas, reporting clauses, and capitals.',
    topicIds: ['e-y3-speech'],
    keywords: ['inverted commas', 'speech marks', 'direct speech', 'quotation'],
  },
  {
    id: 'yt-e3-prefixes',
    title: 'Prefixes (un-, dis-, mis-, re-) for Kids',
    youtubeId: 'CgWj4e2AdLI',
    subjectId: 'English',
    channelName: 'Tutoring Hour',
    duration: '4:50',
    description: 'Discover how adding dis-, mis-, and un- transforms the meaning of root words.',
    topicIds: ['e-y3-prefixes'],
    keywords: ['prefixes', 'negative prefixes', 'dis-', 'mis-', 'un-', 'morphology'],
  },
  {
    id: 'yt-e4-retrieval',
    title: 'Reading Comprehension: Skimming and Scanning',
    youtubeId: 'F1wPYHa5nUg',
    subjectId: 'English',
    channelName: 'Reading Strategies',
    duration: '3:50',
    description: 'Retrieve key facts and evidence swiftly from fiction and non-fiction texts.',
    topicIds: ['e-y4-retrieval'],
    keywords: ['retrieval', 'fact-finding', 'skimming', 'scanning', 'summarising', 'non-fiction'],
  },
  {
    id: 'yt-e4-fronted-adverbials',
    title: 'What are Fronted Adverbials?',
    youtubeId: 'Lk-_LIc3dWA',
    subjectId: 'English',
    channelName: 'Oxford Owl',
    duration: '3:10',
    description: 'Open sentences with engaging fronted adverbials followed by a comma.',
    topicIds: ['e-y4-fronted-adverbials'],
    keywords: ['fronted adverbials', 'adverbial', 'comma'],
  },
  {
    id: 'yt-e4-expanded-nouns',
    title: 'What Is an Expanded Noun Phrase?',
    youtubeId: 'XhwjS4zEZDM',
    subjectId: 'English',
    channelName: 'Twinkl Kids TV',
    duration: '3:45',
    description: 'Add vivid adjectives and prepositional phrases to build rich expanded noun phrases.',
    topicIds: ['e-y4-expanded-nouns'],
    keywords: ['expanded noun', 'noun phrases', 'detail', 'descriptive'],
  },
  {
    id: 'yt-e4-pronouns',
    title: 'What is a Possessive Pronoun?',
    youtubeId: 'zXpufloDpS8',
    subjectId: 'English',
    channelName: 'Twinkl',
    duration: '3:25',
    description: 'Use personal and possessive pronouns cleanly to avoid repeating nouns.',
    topicIds: ['e-y4-pronouns'],
    keywords: ['pronouns', 'possessive', 'possession', 'cohesion'],
  },
  {
    id: 'yt-e5-figurative',
    title: 'Similes and Metaphors',
    youtubeId: 'uoSBVNUO2LU',
    subjectId: 'English',
    channelName: 'The Bazillions',
    duration: '3:05',
    description: 'Compare vivid images with similes and bold metaphors in poetry and stories.',
    topicIds: ['e-y5-figurative'],
    keywords: ['metaphors', 'similes', 'figurative', 'poetry', 'rhyme'],
  },
  {
    id: 'yt-e5-relative-clauses',
    title: 'Relative Clauses and Relative Pronouns',
    youtubeId: 'JEjYcRPxP_g',
    subjectId: 'English',
    channelName: 'Twinkl',
    duration: '4:10',
    description: 'Add extra noun detail smoothly using who, which, where, when, whose, and that.',
    topicIds: ['e-y5-relative-clauses'],
    keywords: ['relative clauses', 'relative pronouns'],
  },
  {
    id: 'yt-e5-parenthesis',
    title: 'Parenthesis: Brackets, Dashes, and Commas',
    youtubeId: 'AseBaZWID7w',
    subjectId: 'English',
    channelName: 'Grammarsaurus',
    duration: '3:15',
    description: 'Tuck extra information neatly into sentences using brackets, dashes, or commas.',
    topicIds: ['e-y5-parenthesis'],
    keywords: ['parenthesis', 'brackets', 'dashes'],
  },
  {
    id: 'yt-e5-synonyms',
    title: 'Synonyms and Antonyms for Kids',
    youtubeId: 'PDI2xlOBcM4',
    subjectId: 'English',
    channelName: 'Smile and Learn',
    duration: '4:35',
    description: 'Enrich your vocabulary using expressive synonyms, antonyms, and a thesaurus.',
    topicIds: ['e-y5-synonyms'],
    keywords: ['synonyms', 'antonyms', 'thesaurus', 'vocabulary', 'etymology'],
  },
  {
    id: 'yt-e6-voice',
    title: 'Active and Passive Voice (KS2 English)',
    youtubeId: 'UE-DfjI2IZg',
    subjectId: 'English',
    channelName: 'Twinkl',
    duration: '3:50',
    description: 'Spot who does the action and transform active sentences into formal passive voice.',
    topicIds: ['e-y6-voice'],
    keywords: ['active', 'passive', 'passive voice'],
  },
  {
    id: 'yt-e6-colons-semicolons',
    title: 'Colons and Semi-colons',
    youtubeId: '1FIfloC0t5A',
    subjectId: 'English',
    channelName: 'BBC Bitesize',
    duration: '3:40',
    description: 'Link closely related clauses with semi-colons and introduce lists with colons.',
    topicIds: ['e-y6-colons-semicolons'],
    keywords: ['colons', 'semi-colons', 'semicolons'],
  },
  {
    id: 'yt-e6-subjunctive',
    title: 'What Is the Subjunctive Verb Form?',
    youtubeId: 'jy33rxCQoRo',
    subjectId: 'English',
    channelName: 'Twinkl',
    duration: '3:35',
    description: 'Master formal hypothetical and wish structures such as "If I were...".',
    topicIds: ['e-y6-subjunctive'],
    keywords: ['subjunctive', 'mood', 'formal'],
  },
  {
    id: 'yt-e6-cohesive-devices',
    title: 'What are Cohesive Devices?',
    youtubeId: 'CQBcWXO_oVQ',
    subjectId: 'English',
    channelName: 'Oxford Owl',
    duration: '3:20',
    description: 'Connect paragraphs seamlessly with transition adverbs and formal links.',
    topicIds: ['e-y6-cohesive-devices'],
    keywords: ['cohesive', 'transition', 'paragraphs', 'balanced arguments', 'persuasive'],
  },

  // ==========================================
  // MATHS
  // ==========================================
  {
    id: 'yt-m1-count',
    title: 'Sing-along: Count to 100 with Numberblocks',
    youtubeId: 'l9-liPFndl8',
    subjectId: 'Maths',
    channelName: 'Numberblocks',
    duration: '3:45',
    description: 'Count forwards and backwards to 100 and spot tens and ones place-value patterns.',
    topicIds: ['m-y1-count-100'],
    keywords: ['counting to and across 100', 'count', '100', 'place value', 'numbers to 20', '10,000', '1,000,000'],
  },
  {
    id: 'yt-m2-mult',
    title: 'Multiplication Times Tables (2, 5, and 10)',
    youtubeId: 'H8lpZI3sU0w',
    subjectId: 'Maths',
    channelName: 'Jack Hartmann',
    duration: '3:30',
    description: 'Skip-count and master core primary multiplication facts with music.',
    topicIds: ['m-y2-multiplication'],
    keywords: ['multiplication', 'times tables', 'multiply', '2, 5, and 10', 'tables to 12', 'counting in 2s'],
  },
  {
    id: 'yt-m3-add',
    title: 'Multi-Digit Column Addition',
    youtubeId: 'mAvuom42NyY',
    subjectId: 'Maths',
    channelName: 'Math Antics',
    duration: '7:10',
    description: 'Align hundreds, tens, and ones columns carefully and regroup step by step.',
    topicIds: ['m-y3-column-add'],
    keywords: ['column addition', 'addition', 'subtraction', 'column methods', 'number bonds'],
  },
  {
    id: 'yt-m-fractions',
    title: 'What is a Fraction? (Halves, Quarters, and Parts)',
    youtubeId: 'DnFrOetuUKg',
    subjectId: 'Maths',
    channelName: 'Mr. R. Songs',
    duration: '3:55',
    description: 'Understand numerators, denominators, halves, quarters, and equivalent fractions.',
    keywords: ['fraction', 'fractions', 'halves', 'quarters', 'half and quarter', 'thirds', 'equivalent'],
  },
  {
    id: 'yt-m4-decimals',
    title: 'An Introduction to Decimals: Tenths & Hundredths',
    youtubeId: 'KrAQneGhyuE',
    subjectId: 'Maths',
    channelName: 'Doodles and Digits',
    duration: '5:20',
    description: 'Connect fractions like tenths and hundredths to decimal place value.',
    topicIds: ['m-y4-decimals'],
    keywords: ['decimals', 'hundredths', 'tenths', 'percentages', 'equivalence'],
  },
  {
    id: 'yt-m5-primes',
    title: 'Prime Numbers and Prime Factors',
    youtubeId: 'XGbOiYhHY2c',
    subjectId: 'Maths',
    channelName: 'Math Antics',
    duration: '7:40',
    description: 'Explore prime numbers, composite numbers, and common factors up to 50.',
    topicIds: ['m-y5-primes'],
    keywords: ['prime', 'primes', 'factors', 'common factors'],
  },
  {
    id: 'yt-m6-algebra',
    title: 'Algebra Basics: Solving Simple Equations',
    youtubeId: 'NybHckSEQBI',
    subjectId: 'Maths',
    channelName: 'Math Antics',
    duration: '12:05',
    description: 'Express missing-number puzzles with variables and balance simple equations.',
    topicIds: ['m-y6-algebra'],
    keywords: ['algebra', 'formula', 'equations', 'unknowns', 'bodmas'],
  },

  // ==========================================
  // SCIENCE
  // ==========================================
  {
    id: 'yt-s1-materials',
    title: 'Everyday Materials and Their Properties',
    youtubeId: 'eCNade4GFpY',
    subjectId: 'Science',
    channelName: 'Explore Planet English',
    duration: '4:45',
    description: 'Sort wood, metal, plastic, glass, and fabric by hardness, transparency, and waterproofing.',
    topicIds: ['s-y1-materials', 's-y2-materials'],
    keywords: ['materials', 'everyday materials', 'properties', 'waterproof', 'transparent', 'rocks', 'fossils'],
  },
  {
    id: 'yt-s-plants',
    title: 'How Does a Seed Become a Plant?',
    youtubeId: 'tkFPyue5X3Q',
    subjectId: 'Science',
    channelName: 'SciShow Kids',
    duration: '3:45',
    description: 'Explore plant parts, germination, and what plants need to grow strong.',
    keywords: ['plants', 'seed', 'seeds', 'grow', 'roots', 'life cycles'],
  },
  {
    id: 'yt-s2-habitats',
    title: 'Habitats for Kids: Forests, Ponds, and Deserts',
    youtubeId: '40B2IjLWfTQ',
    subjectId: 'Science',
    channelName: 'Learn Bright',
    duration: '6:50',
    description: 'Discover how habitats and food chains support animals and mini-beasts.',
    topicIds: ['s-y2-habitats'],
    keywords: ['habitats', 'living things', 'food chains', 'animals', 'classification', 'evolution'],
  },
  {
    id: 'yt-s3-light',
    title: 'What Makes a Shadow? Light and Reflections',
    youtubeId: 'SnR-nKdC_Lw',
    subjectId: 'Science',
    channelName: 'Kids Academy',
    duration: '3:55',
    description: 'See how light travels, reflects off shiny surfaces, and forms shadows behind opaque objects.',
    topicIds: ['s-y3-light'],
    keywords: ['light', 'shadows', 'reflection', 'reflections', 'refraction', 'eye', 'opaque'],
  },
  {
    id: 'yt-s4-matter',
    title: 'States of Matter: Solids, Liquids, and Gases',
    youtubeId: 'wclY8F-UoTE',
    subjectId: 'Science',
    channelName: 'FreeSchool',
    duration: '4:55',
    description: 'Explore melting, freezing, evaporation, and condensation in everyday matter.',
    topicIds: ['s-y4-matter'],
    keywords: ['states of matter', 'solids', 'liquids', 'gases', 'melting', 'evaporation', 'condensation'],
  },
  {
    id: 'yt-s5-space',
    title: 'Explore the Solar System and Rocky Planets',
    youtubeId: 'joq-IUFNkrw',
    subjectId: 'Science',
    channelName: 'SciShow Kids',
    duration: '5:10',
    description: 'Journey around the Sun to inspect Earth’s orbit, rotation, the Moon, and all 8 planets.',
    topicIds: ['s-y5-space'],
    keywords: ['space', 'solar system', 'planets', 'earth and space', 'moon', 'sun'],
  },
  {
    id: 'yt-s6-electricity',
    title: 'The Power of Circuits: Electricity for Kids',
    youtubeId: 'HOFp8bHTN30',
    subjectId: 'Science',
    channelName: 'SciShow Kids',
    duration: '4:40',
    description: 'Build simple circuits, test conductors and insulators, and see how voltage powers bulbs.',
    topicIds: ['s-y6-electricity'],
    keywords: ['electricity', 'circuit', 'circuits', 'voltage', 'conductors', 'symbols'],
  },
  {
    id: 'yt-s6-circulatory',
    title: 'The Circulatory System for Kids',
    youtubeId: 'Dw0WO2XZ5fM',
    subjectId: 'Science',
    channelName: 'Learn Bright',
    duration: '6:15',
    description: 'Follow how the heart pumps blood, oxygen, and nutrients through vessels around your body.',
    keywords: ['circulatory', 'heart', 'blood', 'vessels'],
  },
  {
    id: 'yt-s-respiratory',
    title: 'The Respiratory System for Kids',
    youtubeId: '67Jbbu7UZAA',
    subjectId: 'Science',
    channelName: 'Learn Bright',
    duration: '5:40',
    description: 'Learn how your lungs, diaphragm, and airways bring oxygen into the body.',
    keywords: ['respiratory', 'lungs', 'breathing'],
  },
  {
    id: 'yt-s3-forces',
    title: 'Forces and Magnetism for Kids',
    youtubeId: 'Kll5A6xX9cY',
    subjectId: 'Science',
    channelName: 'Miacademy Learning',
    duration: '5:05',
    description: 'Explore pushes, pulls, friction, gravity, and magnetic poles.',
    keywords: ['forces', 'magnets', 'magnetism', 'gravity', 'friction'],
  },

  // ==========================================
  // HISTORY
  // ==========================================
  {
    id: 'yt-h1-london',
    title: 'The Great Fire of London 1666 (Episode 1)',
    youtubeId: 'DSH81jl-uAk',
    subjectId: 'History',
    channelName: 'BBC Teach',
    duration: '5:30',
    description: 'Explore Samuel Pepys’ diary and how the 1666 Pudding Lane fire reshaped London.',
    topicIds: ['h-london-1666'],
    keywords: ['great fire of london', '1666', 'london', 'pepys', 'pudding lane'],
  },
  {
    id: 'yt-h2-romans',
    title: 'Boudicca & the Roman Invasion of Britain',
    youtubeId: 'eC7ONgTJGKw',
    subjectId: 'History',
    channelName: 'BBC Teach',
    duration: '4:45',
    description: 'Meet the Celtic Queen Boudicca and explore the Roman Army’s invasion of Britain.',
    topicIds: ['h-romans'],
    keywords: ['roman', 'romans', 'boudicca', 'empire', 'invasion'],
  },
  {
    id: 'yt-h3-egypt',
    title: 'Ancient Egypt and the Great Pyramids',
    youtubeId: 'qOlnIF6z2mA',
    subjectId: 'History',
    channelName: 'Peekaboo Kidz',
    duration: '5:50',
    description: 'Uncover how the pyramids were built beside the River Nile in Ancient Egypt.',
    topicIds: ['h-egyptians'],
    keywords: ['egypt', 'egyptians', 'pyramids', 'nile', 'pharaohs', 'valley of the kings'],
  },

  // ==========================================
  // GEOGRAPHY
  // ==========================================
  {
    id: 'yt-g1-uk',
    title: 'Countries and Capitals of the United Kingdom',
    youtubeId: 'RvDIZoQLgIE',
    subjectId: 'Geography',
    channelName: 'Silly School Education',
    duration: '3:15',
    description: 'Learn England, Scotland, Wales, Northern Ireland, and their capital cities.',
    topicIds: ['g-uk-capitals'],
    keywords: ['uk', 'united kingdom', 'countries', 'capitals', 'counties', 'london', 'edinburgh', 'cardiff', 'belfast'],
  },
  {
    id: 'yt-g-watercycle',
    title: 'Where Does Water Come From? (The Water Cycle)',
    youtubeId: 'R0K7VKkksyc',
    subjectId: 'Geography',
    channelName: 'SciShow Kids',
    duration: '4:15',
    description: 'Follow water from rivers and oceans up into clouds and back down as rain.',
    keywords: ['water cycle', 'rivers', 'precipitation', 'clouds', 'rain'],
  },
  {
    id: 'yt-g2-volcanoes',
    title: 'Introduction to Volcanoes & Earthquakes',
    youtubeId: 'Be7o6BYVOzA',
    subjectId: 'Geography',
    channelName: 'Earth Science',
    duration: '4:10',
    description: 'See how tectonic plates, magma chambers, and volcanic eruptions shape Earth.',
    topicIds: ['g-volcanoes'],
    keywords: ['volcanoes', 'volcano', 'tectonic', 'earthquakes', 'magma'],
  },
  {
    id: 'yt-g3-biomes',
    title: 'Global Climate Zones & Biomes',
    youtubeId: '5tC8OOxOFEk',
    subjectId: 'Geography',
    channelName: 'Peekaboo Kidz',
    duration: '5:05',
    description: 'Explore polar, temperate, tropical rainforest, savannah, and desert biomes.',
    topicIds: ['g-biomes'],
    keywords: ['biomes', 'climate', 'climate zones', 'equator', 'tropics', 'rainforest', 'desert'],
  },

  // ==========================================
  // ART & DESIGN
  // ==========================================
  {
    id: 'yt-a1-colors',
    title: 'Mixing Primary and Secondary Colours',
    youtubeId: 'V7gyW-KXYFQ',
    subjectId: 'Art',
    channelName: 'Art with Berry',
    duration: '4:20',
    description: 'Mix red, blue, and yellow primary paints to unlock green, orange, and purple.',
    topicIds: ['a-colors'],
    keywords: ['colour', 'colours', 'colors', 'primary', 'secondary', 'painting', 'mixing'],
  },
  {
    id: 'yt-a2-sketching',
    title: 'How to Shade Basic 3D Shapes Step by Step',
    youtubeId: 'DCyJ1LMTzxk',
    subjectId: 'Art',
    channelName: 'Drawing Academy',
    duration: '5:15',
    description: 'Use light, tone, and cast shadows to turn simple spheres and cylinders 3D.',
    topicIds: ['a-sketching'],
    keywords: ['sketching', 'drawing', 'shade', 'shading', '3d shapes', 'perspective', 'tone'],
  },
  {
    id: 'yt-a3-monet',
    title: 'Claude Monet & Impressionism for Kids',
    youtubeId: 'i5NVYbA2w44',
    subjectId: 'Art',
    channelName: 'Cozy Art Teacher',
    duration: '6:10',
    description: 'Discover Claude Monet’s water lilies and quick Impressionist brushstrokes.',
    topicIds: ['a-impressionism'],
    keywords: ['impressionism', 'monet', 'cezanne', 'water lilies', 'painting styles'],
  },

  // ==========================================
  // DESIGN & TECHNOLOGY (DT)
  // ==========================================
  {
    id: 'yt-dt1-wheels',
    title: 'Simple Machines: Wheels and Axles',
    youtubeId: 'ymvSy5vniCM',
    subjectId: 'DT',
    channelName: 'Little School',
    duration: '3:55',
    description: 'See how wheels spin around an axle to power moving toy vehicles.',
    topicIds: ['dt-mechanisms'],
    keywords: ['mechanisms', 'wheels', 'axles', 'vehicle', 'levers'],
  },
  {
    id: 'yt-dt2-pneumatics',
    title: 'Pneumatics & Air Pressure Experiments',
    youtubeId: 'HupOdYPT9PQ',
    subjectId: 'DT',
    channelName: 'World of Engineering',
    duration: '4:10',
    description: 'Discover how trapped air pressure pushes and moves everyday mechanisms.',
    topicIds: ['dt-pneumatics'],
    keywords: ['pneumatics', 'air pressure', 'syringes', 'hinges'],
  },
  {
    id: 'yt-dt3-bridges',
    title: 'What Makes Bridges So Strong? (Truss & Arch)',
    youtubeId: 'oVOnRPefcno',
    subjectId: 'DT',
    channelName: 'SciShow Kids',
    duration: '4:00',
    description: 'Explore beam, arch, suspension, and triangular truss structures in engineering.',
    topicIds: ['dt-bridges'],
    keywords: ['bridges', 'structures', 'truss', 'arch', 'frame'],
  },

  // ==========================================
  // COMPUTING
  // ==========================================
  {
    id: 'yt-c1-algorithms',
    title: 'What Are Algorithms? (Step-by-Step Coding)',
    youtubeId: '578hB0E6y4o',
    subjectId: 'Computing',
    channelName: 'CS for Kids',
    duration: '4:15',
    description: 'Write crystal-clear step-by-step instructions for robots and Scratch Jr sprites.',
    topicIds: ['c-scratch'],
    keywords: ['algorithms', 'algorithm', 'scratch', 'bee-bot', 'programming', 'instructions'],
  },
  {
    id: 'yt-c2-loops',
    title: 'Loops, Variables, and Conditionals in Scratch',
    youtubeId: 'ySOTId8c3KA',
    subjectId: 'Computing',
    channelName: 'Coding Classroom',
    duration: '4:30',
    description: 'Use repeat loops and logic blocks to build interactive coding games.',
    topicIds: ['c-loops'],
    keywords: ['loops', 'variables', 'conditionals', 'selection', 'python', 'repeat'],
  },
  {
    id: 'yt-c3-safety',
    title: 'Online Privacy & Safe Web Search for Kids',
    youtubeId: 'yiKeLOKc1tw',
    subjectId: 'Computing',
    channelName: 'Smile and Learn',
    duration: '4:25',
    description: 'Protect private information, build safe digital footprints, and browse safely.',
    topicIds: ['c-cyber'],
    keywords: ['web search', 'digital footprint', 'safety', 'online', 'internet', 'privacy', 'copyright'],
  },

  // ==========================================
  // MUSIC
  // ==========================================
  {
    id: 'yt-mu1-pulse',
    title: 'Pulse, Rhythm, Beat, and Steady Clapping',
    youtubeId: '_f4QbRRbTH0',
    subjectId: 'Music',
    channelName: 'Nindy Kids Music',
    duration: '3:50',
    description: 'Feel the steady heartbeat pulse, clap rhythmic patterns, and keep tempo.',
    topicIds: ['mu-elements'],
    keywords: ['pulse', 'rhythm', 'pitch', 'dynamics', 'tempo', 'music theory'],
  },
  {
    id: 'yt-mu2-notation',
    title: 'Reading Music: Treble Clef Lines & Spaces',
    youtubeId: 'a7K2JozRlFs',
    subjectId: 'Music',
    channelName: 'Music with Ms. Watson',
    duration: '4:40',
    description: 'Learn the stave lines (E-G-B-D-F) and spaces (F-A-C-E) on the treble clef.',
    topicIds: ['mu-notation'],
    keywords: ['notation', 'stave', 'treble clef', 'note', 'notes', 'melody'],
  },
  {
    id: 'yt-mu3-orchestra',
    title: 'George Meets the Orchestra: Instrument Families',
    youtubeId: 'M0Jc4sP0BEE',
    subjectId: 'Music',
    channelName: 'Sydney Opera House',
    duration: '4:20',
    description: 'Meet the strings, woodwind, brass, and percussion families in a live orchestra.',
    topicIds: ['mu-history'],
    keywords: ['orchestral', 'orchestra', 'instruments', 'composers', 'classical', 'mozart', 'beethoven', 'percussion'],
  },

  // ==========================================
  // PHYSICAL EDUCATION (PE)
  // ==========================================
  {
    id: 'yt-pe1-gymnastics',
    title: 'Kids Warm-Up, Balance & Movement Routine',
    youtubeId: 'gkw0JCdZO90',
    subjectId: 'PE',
    channelName: 'DJ Raphi',
    duration: '4:05',
    description: 'Practice balance, coordination, stretching, and controlled gymnastics movements.',
    topicIds: ['pe-gymnastics'],
    keywords: ['gymnastics', 'balancing', 'rolling', 'travelling', 'dance', 'warm up'],
  },
  {
    id: 'yt-pe2-athletics',
    title: 'Running Form, Sprinting & Athletics Mechanics',
    youtubeId: 'jVuHI5nGi2I',
    subjectId: 'PE',
    channelName: 'Kidz In Shape',
    duration: '3:45',
    description: 'Build strong arm drive, knee lift, and speed for sprints and relay handovers.',
    topicIds: ['pe-athletics'],
    keywords: ['athletics', 'sprinting', 'relay', 'running', 'jumping'],
  },
  {
    id: 'yt-pe3-tactics',
    title: 'Team Passing & Invasion Game Skills',
    youtubeId: 'Kb58F3r_TQM',
    subjectId: 'PE',
    channelName: 'MOJO Sports',
    duration: '5:10',
    description: 'Develop crisp passing, moving into space, and team tactics for invasion games.',
    topicIds: ['pe-tactics'],
    keywords: ['invasion games', 'team tactics', 'passing', 'football', 'netball', 'games', 'throwing'],
  },

  // ==========================================
  // RELIGIOUS EDUCATION (RE)
  // ==========================================
  {
    id: 'yt-re1-diwali',
    title: 'What is Diwali? The Festival of Lights',
    youtubeId: '-YSN5qICTog',
    subjectId: 'RE',
    channelName: 'BBC Newsround',
    duration: '3:15',
    description: 'Explore the story of Diwali, clay diya lamps, and colourful celebrations.',
    topicIds: ['re-diwali'],
    keywords: ['diwali', 'hinduism', 'festival of lights', 'diyas', 'rama'],
  },
  {
    id: 'yt-re2-ramadan',
    title: 'Ramadan and Eid al-Fitr Explained for Kids',
    youtubeId: '-4r0ZTi0olM',
    subjectId: 'RE',
    channelName: 'Twinkl',
    duration: '3:40',
    description: 'Learn why Muslims fast during Ramadan and celebrate with charity at Eid al-Fitr.',
    topicIds: ['re-ramadan'],
    keywords: ['ramadan', 'islam', 'fasting', 'eid', 'mosque', 'five pillars', 'quran'],
  },
  {
    id: 'yt-re3-buddhism',
    title: 'The Story of Siddhartha Gautama (Buddhism)',
    youtubeId: 'J-UwlloVveI',
    subjectId: 'RE',
    channelName: 'BBC Bitesize',
    duration: '4:05',
    description: 'Follow Prince Siddhartha’s path of kindness, mindfulness, and the Eightfold Path.',
    topicIds: ['re-buddhism'],
    keywords: ['buddhism', 'buddha', 'siddhartha', 'eightfold path', 'meditation'],
  },

  // ==========================================
  // PSHE
  // ==========================================
  {
    id: 'yt-pshe1-feelings',
    title: 'Feelings and Emotions for Kids',
    youtubeId: '0076ZF4jg3o',
    subjectId: 'PSHE',
    channelName: 'Diane Alber',
    duration: '3:20',
    description: 'Name big emotions, practice calm breathing, and build caring friendships.',
    topicIds: ['pshe-feelings'],
    keywords: ['feelings', 'emotions', 'relationships', 'friends', 'kindness', 'mental health'],
  },
  {
    id: 'yt-pshe2-safety',
    title: 'Internet Safety & Healthy Digital Habits',
    youtubeId: 'yiKeLOKc1tw',
    subjectId: 'PSHE',
    channelName: 'Smile and Learn',
    duration: '4:25',
    description: 'Keep passwords private, balance screen time, and know when to ask a trusted adult.',
    topicIds: ['pshe-safety'],
    keywords: ['internet safety', 'screen balance', 'safety', 'online relationships'],
  },
  {
    id: 'yt-pshe3-growth',
    title: 'Growth Mindset for Kids (Episode 1)',
    youtubeId: '2zrtHt3bBmQ',
    subjectId: 'PSHE',
    channelName: 'ClassDojo',
    duration: '2:35',
    description: 'Build resilience, tackle mistakes bravely, and stretch your brain with practice.',
    topicIds: ['pshe-decisions'],
    keywords: ['growth mindset', 'growth mindsets', 'goals', 'transition', 'decision'],
  },
];

export const EDUCATION_CHANNELS: EducationChannel[] = [
  {
    name: 'BBC Teach',
    logo: '📺',
    handle: '@bbcteach',
    url: 'https://www.youtube.com/@bbcteach',
    description: 'Curriculum-aligned animated lessons and clips for UK primary schools.',
    popularPlaylists: ['KS1 English', 'KS2 History', 'Primary Science'],
  },
  {
    name: 'Numberblocks',
    logo: '🔢',
    handle: '@numberblocks',
    url: 'https://www.youtube.com/@numberblocks',
    description: 'Singing block characters helping children master numbers and calculations.',
    popularPlaylists: ['Counting 1–100', 'Adding Up', 'Times Tables'],
  },
  {
    name: 'SciShow Kids',
    logo: '🔬',
    handle: '@scishowkids',
    url: 'https://www.youtube.com/@scishowkids',
    description: 'Curious science explainers answering children’s big "how" and "why" questions.',
    popularPlaylists: ['Plants & Seeds', 'Space Science', 'Circuits & Bridges'],
  },
  {
    name: 'Math Antics',
    logo: '🧮',
    handle: '@mathantics',
    url: 'https://www.youtube.com/@mathantics',
    description: 'Crystal-clear visual lessons on column addition, primes, decimals, and algebra.',
    popularPlaylists: ['Arithmetic', 'Fractions & Decimals', 'Algebra Basics'],
  },
];

export function getFallbackVideoSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${query.trim()} UK primary KS1 KS2 kids`
  )}`;
}

/**
 * Matches the best verified curated YouTube video for a topic.
 * First checks exact topicId mapping, then scores keywords/title within subjectId,
 * and falls back across subjects or first subject video.
 */
export function findMatchingYouTubeVideo(
  subjectId: string,
  topicId?: string,
  textQuery?: string,
  allowSubjectFallback = true
): YouTubeVideo | null {
  if (topicId) {
    const byId = CURATED_YOUTUBE_VIDEOS.find((v) => v.topicIds?.includes(topicId));
    if (byId) return byId;
  }

  const normalized = (textQuery || '').toLowerCase();
  const words = normalized
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  const scoreVideo = (v: YouTubeVideo) => {
    let score = 0;
    for (const kw of v.keywords) {
      const k = kw.toLowerCase();
      if (normalized.includes(k)) {
        score += k.includes(' ') ? 8 : 4;
      }
    }
    for (const w of words) {
      if (w.length >= 4 && v.title.toLowerCase().includes(w)) {
        score += 2;
      }
    }
    return score;
  };

  const subjectVideos = CURATED_YOUTUBE_VIDEOS.filter((v) => v.subjectId === subjectId);
  let bestSubjectMatch: { video: YouTubeVideo; score: number } | null = null;
  for (const v of subjectVideos) {
    const sc = scoreVideo(v);
    if (!bestSubjectMatch || sc > bestSubjectMatch.score) {
      bestSubjectMatch = { video: v, score: sc };
    }
  }

  if (bestSubjectMatch && bestSubjectMatch.score > 0) {
    return bestSubjectMatch.video;
  }

  // Check strong cross-subject keyword match (e.g. Water Cycle under Science or Geography)
  let bestCrossMatch: { video: YouTubeVideo; score: number } | null = null;
  for (const v of CURATED_YOUTUBE_VIDEOS) {
    const sc = scoreVideo(v);
    if (sc >= 6 && (!bestCrossMatch || sc > bestCrossMatch.score)) {
      bestCrossMatch = { video: v, score: sc };
    }
  }
  if (bestCrossMatch) {
    return bestCrossMatch.video;
  }

  return allowSubjectFallback ? subjectVideos[0] || null : null;
}
