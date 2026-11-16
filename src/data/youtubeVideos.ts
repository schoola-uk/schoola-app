export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeId: string;
  subjectId: string;
  channelName: string;
  duration: string;
  description: string;
}

export const CURATED_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  // English
  {
    id: 'yt-e1',
    title: 'Phonics Phase 2 & 3: Learn Letter Sounds and Blending',
    youtubeId: 'UCI2H1_4SgM',
    subjectId: 'English',
    channelName: 'BBC Teach',
    duration: '6:15',
    description: 'Master primary phonics sounds, pronunciation, and early letter blending with fun music!'
  },
  {
    id: 'yt-e2',
    title: 'Nouns, Verbs, and Adjectives for Kids',
    youtubeId: 'Y9D92uNf_M8',
    subjectId: 'English',
    channelName: 'Kids Academy',
    duration: '4:32',
    description: 'Learn to distinguish between naming words (nouns), action words (verbs), and describing words (adjectives).'
  },
  {
    id: 'yt-e3',
    title: 'How to Use Speech Marks (Inverted Commas)',
    youtubeId: 'qN_7Z4XpP0Q',
    subjectId: 'English',
    channelName: 'Primary English',
    duration: '3:45',
    description: 'Learn the golden rules for punctuating direct speech with inverted commas, commas, and capitals.'
  },
  // Maths
  {
    id: 'yt-m1',
    title: 'Count to 100 with the Numberblocks!',
    youtubeId: 'v3S9S1N6Lgw',
    subjectId: 'Maths',
    channelName: 'Numberblocks',
    duration: '11:20',
    description: 'A magical journey from one to one hundred, learning numbers, place value, and patterns.'
  },
  {
    id: 'yt-m2',
    title: 'Multiplication Times Tables (2, 5, and 10)',
    youtubeId: '8Qu_M0WZ3_8',
    subjectId: 'Maths',
    channelName: 'Laugh Along and Learn',
    duration: '5:10',
    description: 'Sing along to remember the core multiplication facts for the 2, 5, and 10 times tables!'
  },
  {
    id: 'yt-m3',
    title: 'What is a Fraction? (An Introduction for Children)',
    youtubeId: 'DnFrOetuUKg',
    subjectId: 'Maths',
    channelName: 'Maths Antics',
    duration: '8:40',
    description: 'Understand numerators, denominators, and how we split shapes and numbers into equal parts.'
  },
  // Science
  {
    id: 'yt-s1',
    title: 'States of Matter for Kids: Solids, Liquids, and Gases',
    youtubeId: 'wclY8F-UoTE',
    subjectId: 'Science',
    channelName: 'SciShow Kids',
    duration: '4:55',
    description: 'Explore how temperature changes everyday matter from frozen ice, to liquid water, to steam gas!'
  },
  {
    id: 'yt-s2',
    title: 'The Planets in Our Solar System',
    youtubeId: 'Qd6nLM2MKEY',
    subjectId: 'Science',
    channelName: 'Crash Course Kids',
    duration: '6:12',
    description: 'Fly through space to discover the eight magnificent planets orbiting around our hot Sun!'
  },
  {
    id: 'yt-s3',
    title: 'What is Electricity? (Simple Circuit Science)',
    youtubeId: 'VnnpLaKZuLY',
    subjectId: 'Science',
    channelName: 'SciShow Kids',
    duration: '5:30',
    description: 'How do electrons flow through wires to power light bulbs, buzzers, and electronic toys?'
  },
  // History
  {
    id: 'yt-h1',
    title: 'The Great Fire of London 1666 (Historical Animation)',
    youtubeId: 'Er3GKw8Z3Sg',
    subjectId: 'History',
    channelName: 'BBC Teach',
    duration: '7:40',
    description: 'Learn how a small spark in Pudding Lane’s bakery grew into a fire that changed London forever.'
  },
  {
    id: 'yt-h2',
    title: 'The Roman Army and Boudicca\'s Rebellion',
    youtubeId: '2b_2V256_sU',
    subjectId: 'History',
    channelName: 'Horrible Histories',
    duration: '4:20',
    description: 'Meet Boudicca, the fierce Celtic Queen, and see how she led her tribes against the mighty Roman Empire!'
  },
  // Geography
  {
    id: 'yt-g1',
    title: 'The Four Countries of the United Kingdom and Capitals',
    youtubeId: 'RvDIp9gC6sc',
    subjectId: 'Geography',
    channelName: 'Kids Learning Tube',
    duration: '3:15',
    description: 'Sing along to learn England, Scotland, Wales, Northern Ireland, and their vibrant capital cities!'
  },
  {
    id: 'yt-g2',
    title: 'Volcanoes 101: How Magma Erupts',
    youtubeId: 'Be7o6BYVOzA',
    subjectId: 'Geography',
    channelName: 'National Geographic Kids',
    duration: '4:10',
    description: 'Go deep inside the Earth to understand tectonic movements, magma reservoirs, and active volcanic cones.'
  }
];

export const EDUCATION_CHANNELS = [
  {
    name: 'BBC Teach',
    logo: '📺',
    handle: '@bbcteach',
    description: 'Curriculum-aligned animated lessons and clips for primary schools.',
    popularPlaylists: ['KS1 English', 'KS2 Maths', 'Primary Science']
  },
  {
    name: 'Numberblocks',
    logo: '🔢',
    handle: '@numberblocks',
    description: 'Singing block characters helping children master numbers and calculations.',
    popularPlaylists: ['Counting 1-10', 'Adding up', 'Number Patterns']
  },
  {
    name: 'SciShow Kids',
    logo: '🔬',
    handle: '@scishowkids',
    description: 'Fun, curious science explainers answering children\'s big "how" and "why" questions.',
    popularPlaylists: ['Awesome Animals', 'Everyday Materials', 'Space Science']
  },
  {
    name: 'Horrible Histories',
    logo: '🏛️',
    handle: '@horriblehistories',
    description: 'Vibrant historical musical parodies and fun stories for Key Stages 1-2.',
    popularPlaylists: ['Rotten Romans', 'Awful Egyptians', 'Vile Victorians']
  }
];
