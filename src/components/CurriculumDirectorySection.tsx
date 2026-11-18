import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Printer,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { SUBJECTS, TOPICS } from '../data/curriculum';
import { findMatchingYouTubeVideo, getFallbackVideoSearchUrl, YouTubeVideo } from '../data/youtubeVideos';
import { Topic } from '../types';

interface CurriculumDirectorySectionProps {
  onOpenTopic: (topic: Topic) => void;
  onOpenWorld: (subjectId: string) => void;
  activeKS?: 'ks1' | 'ks2';
  onSelectKS?: (ks: 'ks1' | 'ks2') => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

interface DirectoryRow {
  s: string;
  y: string;
  t: string;
}

const KS1_ROWS: DirectoryRow[] = [
  { s: 'English', y: 'Year 1', t: 'Spoken language: listening and responding' },
  { s: 'English', y: 'Year 1', t: 'Spoken language: asking and answering questions' },
  { s: 'English', y: 'Year 1', t: 'Word reading: phonics — Phase 3 and 4' },
  { s: 'English', y: 'Year 1', t: 'Word reading: phonics — Phase 5' },
  { s: 'English', y: 'Year 1', t: 'Word reading: common exception words (Year 1)' },
  { s: 'English', y: 'Year 1', t: 'Comprehension: understanding fiction texts' },
  { s: 'English', y: 'Year 1', t: 'Comprehension: understanding non-fiction texts' },
  { s: 'English', y: 'Year 1', t: 'Handwriting: correct letter formation' },
  { s: 'English', y: 'Year 1', t: 'Writing composition: sentences with capital letters and full stops' },
  { s: 'English', y: 'Year 1', t: 'Spelling: Year 1 statutory word list' },
  { s: 'English', y: 'Year 1', t: 'Grammar: word classes — nouns, verbs, adjectives' },
  { s: 'English', y: 'Year 2', t: 'Word reading: decoding unfamiliar words' },
  { s: 'English', y: 'Year 2', t: 'Comprehension: inference and prediction' },
  { s: 'English', y: 'Year 2', t: 'Comprehension: poetry and rhyme' },
  { s: 'English', y: 'Year 2', t: 'Writing composition: planning and drafting stories' },
  { s: 'English', y: 'Year 2', t: 'Writing composition: non-chronological reports' },
  { s: 'English', y: 'Year 2', t: 'Handwriting: joined handwriting introduction' },
  { s: 'English', y: 'Year 2', t: 'Spelling: Year 2 statutory word list' },
  { s: 'English', y: 'Year 2', t: 'Grammar: coordination and subordination' },
  { s: 'English', y: 'Year 2', t: 'Grammar: expanded noun phrases' },
  { s: 'English', y: 'Year 2', t: 'Punctuation: apostrophes for omission and possession' },
  { s: 'Maths', y: 'Year 1', t: 'Number: counting to and across 100' },
  { s: 'Maths', y: 'Year 1', t: 'Number: reading and writing numbers to 20' },
  { s: 'Maths', y: 'Year 1', t: 'Number: place value — tens and ones' },
  { s: 'Maths', y: 'Year 1', t: 'Addition and subtraction: number bonds to 10 and 20' },
  { s: 'Maths', y: 'Year 1', t: 'Multiplication and division: counting in 2s, 5s, and 10s' },
  { s: 'Maths', y: 'Year 1', t: 'Fractions: half and quarter of shapes and quantities' },
  { s: 'Maths', y: 'Year 1', t: 'Measurement: length and height' },
  { s: 'Maths', y: 'Year 1', t: "Measurement: time — o'clock and half past" },
  { s: 'Maths', y: 'Year 1', t: 'Measurement: money — recognising coins and notes' },
  { s: 'Maths', y: 'Year 1', t: 'Geometry: 2D and 3D shapes — properties' },
  { s: 'Maths', y: 'Year 2', t: 'Number: reading and writing numbers to 100' },
  { s: 'Maths', y: 'Year 2', t: 'Addition and subtraction: solving two-step problems' },
  { s: 'Maths', y: 'Year 2', t: 'Multiplication: 2, 5, and 10 times tables' },
  { s: 'Maths', y: 'Year 2', t: 'Fractions: thirds, quarters — equivalence' },
  { s: 'Maths', y: 'Year 2', t: 'Measurement: time — quarter past, quarter to; minutes' },
  { s: 'Maths', y: 'Year 2', t: 'Statistics: block diagrams and tally charts' },
  { s: 'Maths', y: 'Year 2', t: 'Geometry: lines of symmetry' },
  { s: 'Science', y: 'Year 1', t: 'Biology: everyday materials and their properties' },
  { s: 'Science', y: 'Year 1', t: 'Biology: plants — identify and name common plants' },
  { s: 'Science', y: 'Year 1', t: 'Biology: animals — carnivores, herbivores, omnivores' },
  { s: 'Science', y: 'Year 1', t: 'Physics: seasonal changes — the four seasons' },
  { s: 'Science', y: 'Year 2', t: 'Biology: living things and their habitats' },
  { s: 'Science', y: 'Year 2', t: 'Biology: food chains — producers and consumers' },
  { s: 'Science', y: 'Year 2', t: 'Biology: plants — what plants need to grow' },
  { s: 'Science', y: 'Year 2', t: 'Biology: animals including humans — basic needs' },
  { s: 'Science', y: 'Year 2', t: 'Chemistry: states of matter — uses of everyday materials' },
  { s: 'History', y: 'Year 1–2', t: 'Changes within living memory' },
  { s: 'History', y: 'Year 1–2', t: 'Events beyond living memory — Great Fire of London 1666' },
  { s: 'History', y: 'Year 1–2', t: 'Lives of significant individuals — Florence Nightingale' },
  { s: 'History', y: 'Year 1–2', t: 'Lives of significant individuals — Neil Armstrong' },
  { s: 'History', y: 'Year 1–2', t: 'Lives of significant individuals — Rosa Parks' },
  { s: 'History', y: 'Year 1–2', t: 'Historical vocabulary: chronology, past, present, source' },
  { s: 'Geography', y: 'Year 1–2', t: 'Locational knowledge: four countries of the UK and capitals' },
  { s: 'Geography', y: 'Year 1–2', t: 'Locational knowledge: seven continents and five oceans' },
  { s: 'Geography', y: 'Year 1–2', t: 'Human and physical geography: seasonal weather' },
  { s: 'Geography', y: 'Year 1–2', t: 'Geographical skills: maps, atlases, globes' },
  { s: 'Geography', y: 'Year 1–2', t: 'Fieldwork: observing and recording the local environment' },
  { s: 'Art', y: 'Year 1–2', t: 'Drawing: line, shape, tone, and texture from observation' },
  { s: 'Art', y: 'Year 1–2', t: 'Painting: mixing primary and secondary colours' },
  { s: 'Art', y: 'Year 1–2', t: 'Sculpture: using clay and natural materials' },
  { s: 'Art', y: 'Year 1–2', t: "Artists study: Georgia O'Keeffe (natural forms)" },
  { s: 'Art', y: 'Year 1–2', t: 'Artists study: Andy Warhol (repetition and colour)' },
  { s: 'DT', y: 'Year 1–2', t: 'Design: generating and communicating ideas' },
  { s: 'DT', y: 'Year 1–2', t: 'Make: cooking and nutrition — where food comes from' },
  { s: 'DT', y: 'Year 1–2', t: 'Mechanisms: wheels and axles — making a moving vehicle' },
  { s: 'DT', y: 'Year 1–2', t: 'Structures: building stable structures' },
  { s: 'Computing', y: 'Year 1–2', t: 'Algorithms: step-by-step instructions' },
  { s: 'Computing', y: 'Year 1–2', t: 'Programming: using floor robots (Bee-Bot) and Scratch Jr' },
  { s: 'Computing', y: 'Year 1–2', t: 'Digital literacy: using technology safely and respectfully' },
  { s: 'Computing', y: 'Year 1–2', t: 'Networks: what the internet is' },
  { s: 'Music', y: 'Year 1–2', t: 'Listening: appraising and describing music' },
  { s: 'Music', y: 'Year 1–2', t: 'Performing: singing in tune with expression' },
  { s: 'Music', y: 'Year 1–2', t: 'Performing: playing untuned percussion instruments' },
  { s: 'Music', y: 'Year 1–2', t: 'Music theory: pulse, rhythm, pitch, dynamics, tempo' },
  { s: 'PE', y: 'Year 1–2', t: 'Games: throwing, catching, kicking, and striking skills' },
  { s: 'PE', y: 'Year 1–2', t: 'Gymnastics: travelling, rolling, jumping, balancing' },
  { s: 'PE', y: 'Year 1–2', t: 'Dance: performing dances using simple movement patterns' },
  { s: 'PE', y: 'Year 1–2', t: 'Athletics: running, jumping, and throwing' },
  { s: 'RE', y: 'Year 1–2', t: 'Christianity: the Christmas and Easter story' },
  { s: 'RE', y: 'Year 1–2', t: 'Islam: key beliefs; the Five Pillars; Ramadan' },
  { s: 'RE', y: 'Year 1–2', t: 'Judaism: the Shabbat; Hanukkah; the Torah' },
  { s: 'RE', y: 'Year 1–2', t: 'Sikhism: the Gurus; the Gurdwara; Vaisakhi' },
  { s: 'RE', y: 'Year 1–2', t: 'Hinduism: Diwali; key deities (Ganesha, Lakshmi)' },
  { s: 'RE', y: 'Year 1–2', t: 'Buddhism: the life of the Buddha' },
  { s: 'PSHE', y: 'Year 1–2', t: 'Health and wellbeing: keeping clean; dental hygiene' },
  { s: 'PSHE', y: 'Year 1–2', t: 'Relationships: family types; making and keeping friends' },
  { s: 'PSHE', y: 'Year 1–2', t: 'Living in the wider world: rules at home and school' },
  { s: 'PSHE', y: 'Year 1–2', t: 'Safety: road safety; stranger awareness; online safety' },
];

const KS2_ROWS: DirectoryRow[] = [
  { s: 'English', y: 'Year 3–4', t: 'Word reading: morphology and etymology' },
  { s: 'English', y: 'Year 3–4', t: 'Comprehension: drawing inferences; identifying themes' },
  { s: 'English', y: 'Year 3–4', t: 'Writing composition: organising paragraphs around a theme' },
  { s: 'English', y: 'Year 3–4', t: 'Writing composition: narrative — settings, characters, plot' },
  { s: 'English', y: 'Year 3–4', t: 'Writing composition: persuasive texts and letters' },
  { s: 'English', y: 'Year 3–4', t: 'Spelling: Years 3–4 statutory word list' },
  { s: 'English', y: 'Year 3–4', t: 'Grammar: adverbs, prepositions, conjunctions' },
  { s: 'English', y: 'Year 3–4', t: 'Grammar: inverted commas (speech marks)' },
  { s: 'English', y: 'Year 3–4', t: 'Grammar: fronted adverbials with comma' },
  { s: 'English', y: 'Year 5–6', t: 'Comprehension: predicting from details; summarising' },
  { s: 'English', y: 'Year 5–6', t: 'Writing composition: formal and informal registers' },
  { s: 'English', y: 'Year 5–6', t: 'Writing composition: discursive writing — balanced arguments' },
  { s: 'English', y: 'Year 5–6', t: 'Spelling: Years 5–6 statutory word list' },
  { s: 'English', y: 'Year 5–6', t: 'Grammar: subjunctive mood and passive voice' },
  { s: 'English', y: 'Year 5–6', t: 'Grammar: colons, semi-colons, and dashes' },
  { s: 'English', y: 'Year 5–6', t: 'Vocabulary: etymology; using a thesaurus' },
  { s: 'Maths', y: 'Year 3', t: 'Number: place value to 1,000' },
  { s: 'Maths', y: 'Year 3', t: 'Addition and subtraction: column methods' },
  { s: 'Maths', y: 'Year 3', t: 'Multiplication: 3, 4, and 8 times tables' },
  { s: 'Maths', y: 'Year 3', t: 'Fractions: tenths; comparing and ordering fractions' },
  { s: 'Maths', y: 'Year 3', t: 'Measurement: telling time to the nearest minute; 24-hour clock' },
  { s: 'Maths', y: 'Year 3', t: 'Geometry: right angles; horizontal and vertical lines' },
  { s: 'Maths', y: 'Year 3', t: 'Statistics: bar charts, pictograms, tables' },
  { s: 'Maths', y: 'Year 4', t: 'Number: place value to 10,000; negative numbers' },
  { s: 'Maths', y: 'Year 4', t: 'Multiplication: all tables to 12×12 (MTC statutory)' },
  { s: 'Maths', y: 'Year 4', t: 'Fractions: equivalent fractions; add and subtract' },
  { s: 'Maths', y: 'Year 4', t: 'Decimals: tenths and hundredths' },
  { s: 'Maths', y: 'Year 4', t: 'Measurement: area by counting squares' },
  { s: 'Maths', y: 'Year 4', t: 'Statistics: line graphs; time graphs' },
  { s: 'Maths', y: 'Year 5', t: 'Number: place value to 1,000,000' },
  { s: 'Maths', y: 'Year 5', t: 'Multiplication and division: long multiplication' },
  { s: 'Maths', y: 'Year 5', t: 'Fractions, decimals, percentages: equivalence and conversion' },
  { s: 'Maths', y: 'Year 5', t: 'Measurement: converting metric and imperial units' },
  { s: 'Maths', y: 'Year 5', t: 'Geometry: angles — measuring with protractor' },
  { s: 'Maths', y: 'Year 5', t: 'Statistics: mean average; line graphs' },
  { s: 'Maths', y: 'Year 6', t: 'Number: place value to 10,000,000; BODMAS' },
  { s: 'Maths', y: 'Year 6', t: 'Algebra: using simple formulae; finding unknowns' },
  { s: 'Maths', y: 'Year 6', t: 'Ratio and proportion: scale drawings' },
  { s: 'Maths', y: 'Year 6', t: 'Fractions, decimals, percentages: all conversions' },
  { s: 'Maths', y: 'Year 6', t: 'Geometry: angles in polygons; circles intro' },
  { s: 'Maths', y: 'Year 6', t: 'Statistics: pie charts; mean, median, mode, range' },
  { s: 'Maths', y: 'Year 6', t: 'SATs revision: arithmetic and reasoning strategies' },
  { s: 'Science', y: 'Year 3', t: 'Biology: plants — functions of parts; requirements for growth' },
  { s: 'Science', y: 'Year 3', t: 'Biology: animals — nutrition; skeleton and muscles' },
  { s: 'Science', y: 'Year 3', t: 'Chemistry: rocks — types, properties, formation; fossils' },
  { s: 'Science', y: 'Year 3', t: 'Physics: light — sources, reflection, shadows' },
  { s: 'Science', y: 'Year 3', t: 'Physics: forces and magnets' },
  { s: 'Science', y: 'Year 4', t: 'Biology: living things — classification; vertebrates' },
  { s: 'Science', y: 'Year 4', t: 'Biology: digestive system; teeth and food' },
  { s: 'Science', y: 'Year 4', t: 'Chemistry: states of matter; the water cycle' },
  { s: 'Science', y: 'Year 4', t: 'Physics: sound — vibration, pitch, volume' },
  { s: 'Science', y: 'Year 4', t: 'Physics: electricity — simple circuits; conductors' },
  { s: 'Science', y: 'Year 5', t: 'Biology: life cycles of plants, animals, humans' },
  { s: 'Science', y: 'Year 5', t: 'Chemistry: properties and changes of materials' },
  { s: 'Science', y: 'Year 5', t: 'Physics: Earth and space — Solar System; the Moon' },
  { s: 'Science', y: 'Year 5', t: 'Physics: forces — gravity, air resistance, levers, gears' },
  { s: 'Science', y: 'Year 6', t: 'Biology: classification of micro-organisms, plants, animals' },
  { s: 'Science', y: 'Year 6', t: 'Biology: the circulatory system; heart, blood, vessels' },
  { s: 'Science', y: 'Year 6', t: 'Biology: evolution and inheritance — Darwin and Wallace' },
  { s: 'Science', y: 'Year 6', t: 'Physics: light — refraction; the eye' },
  { s: 'Science', y: 'Year 6', t: 'Physics: electricity — voltage; comparing circuits' },
  { s: 'History', y: 'Year 3–4', t: 'Changes in Britain: Stone Age to Iron Age' },
  { s: 'History', y: 'Year 3–4', t: 'The Roman Empire and its impact on Britain' },
  { s: 'History', y: 'Year 3–4', t: 'Anglo-Saxons, Vikings, and the Kingdom of England' },
  { s: 'History', y: 'Year 3–4', t: 'Ancient Egypt — achievements of early civilisations' },
  { s: 'History', y: 'Year 3–4', t: 'Ancient Greece — democracy, philosophy, the Olympics' },
  { s: 'History', y: 'Year 5–6', t: 'The Tudor period (Henry VIII, Elizabeth I, the Reformation)' },
  { s: 'History', y: 'Year 5–6', t: 'The Victorian era (Industrial Revolution, Empire)' },
  { s: 'History', y: 'Year 5–6', t: 'World War II — the Blitz, evacuation, the Home Front' },
  { s: 'History', y: 'Year 5–6', t: 'Benin Kingdom (West Africa, 900–1300)' },
  { s: 'History', y: 'Year 5–6', t: 'Historical skills: chronology; change and continuity' },
  { s: 'Geography', y: 'Year 3–4', t: 'Locational knowledge: counties and cities of the UK' },
  { s: 'Geography', y: 'Year 3–4', t: 'Locational knowledge: countries of Europe' },
  { s: 'Geography', y: 'Year 3–4', t: 'Physical geography: rivers — the water cycle' },
  { s: 'Geography', y: 'Year 3–4', t: 'Physical geography: mountains — key UK ranges' },
  { s: 'Geography', y: 'Year 3–4', t: 'Geographical skills: four-figure grid references; OS maps' },
  { s: 'Geography', y: 'Year 5–6', t: 'Locational knowledge: North and South America' },
  { s: 'Geography', y: 'Year 5–6', t: 'Human geography: settlement; migration; economic development' },
  { s: 'Geography', y: 'Year 5–6', t: 'Physical geography: volcanoes and earthquakes' },
  { s: 'Geography', y: 'Year 5–6', t: 'Physical geography: biomes and vegetation belts' },
  { s: 'Geography', y: 'Year 5–6', t: 'Physical geography: climate zones; the equator and tropics' },
  { s: 'Art', y: 'Year 3–4', t: 'Drawing: perspective, tonal shading, portraiture' },
  { s: 'Art', y: 'Year 3–4', t: 'Painting: watercolour techniques; mixing tints and shades' },
  { s: 'Art', y: 'Year 3–4', t: 'Artists study: Paul Cézanne (Impressionism)' },
  { s: 'Art', y: 'Year 3–4', t: 'Artists study: Henry Moore (sculpture)' },
  { s: 'Art', y: 'Year 5–6', t: 'Drawing: technical drawing; perspective with vanishing points' },
  { s: 'Art', y: 'Year 5–6', t: 'Digital art: photo editing; digital illustration tools' },
  { s: 'Art', y: 'Year 5–6', t: 'Artists study: Leonardo da Vinci (observation and invention)' },
  { s: 'Art', y: 'Year 5–6', t: 'Artists study: Frida Kahlo (identity and symbolism)' },
  { s: 'Art', y: 'Year 5–6', t: 'Design history: Art Deco; Bauhaus; contemporary graphic design' },
  { s: 'DT', y: 'Year 3–4', t: 'Structures: bridges — load-bearing and cross-bracing' },
  { s: 'DT', y: 'Year 3–4', t: 'Mechanisms: levers and linkages; sliders and pivots' },
  { s: 'DT', y: 'Year 3–4', t: 'Electrical systems: simple circuits in products' },
  { s: 'DT', y: 'Year 3–4', t: 'Cooking and nutrition: food groups; preparing savoury dishes' },
  { s: 'DT', y: 'Year 5–6', t: 'Structures: frame structures; strengthening techniques' },
  { s: 'DT', y: 'Year 5–6', t: 'Mechanical systems: cams, cranks, and gears' },
  { s: 'DT', y: 'Year 5–6', t: 'Electrical systems: programmable components (micro:bit)' },
  { s: 'DT', y: 'Year 5–6', t: 'Computing in D&T: CAD — using 2D design tools' },
  { s: 'Computing', y: 'Year 3–4', t: 'Programming: Scratch — sequence, selection, loops' },
  { s: 'Computing', y: 'Year 3–4', t: 'Networks: how the internet works — IP addresses, servers' },
  { s: 'Computing', y: 'Year 3–4', t: 'Data: collecting, organising, and presenting data' },
  { s: 'Computing', y: 'Year 3–4', t: 'Digital literacy: copyright and ownership' },
  { s: 'Computing', y: 'Year 5–6', t: 'Programming: Python — variables, inputs, outputs' },
  { s: 'Computing', y: 'Year 5–6', t: 'Programming: Python — conditions and loops' },
  { s: 'Computing', y: 'Year 5–6', t: 'Networks: how websites work — HTML basics' },
  { s: 'Computing', y: 'Year 5–6', t: 'Digital literacy: digital footprints; responsible use of AI' },
  { s: 'Music', y: 'Year 3–4', t: 'Performing: playing a tuned instrument (recorder, ukulele)' },
  { s: 'Music', y: 'Year 3–4', t: 'Composing: using notation; compose an 8-bar melody' },
  { s: 'Music', y: 'Year 3–4', t: 'Listening: Western Classical — Vivaldi, Mozart, Beethoven' },
  { s: 'Music', y: 'Year 3–4', t: 'Music theory: note values; treble clef; note names C–G' },
  { s: 'Music', y: 'Year 5–6', t: 'Performing: ensemble performance; accuracy and expression' },
  { s: 'Music', y: 'Year 5–6', t: 'Composing: composing for a specific purpose' },
  { s: 'Music', y: 'Year 5–6', t: 'Music theory: key signatures; chords; melody and harmony' },
  { s: 'Music', y: 'Year 5–6', t: 'Music history: Baroque to Modern' },
  { s: 'PE', y: 'Year 3–4', t: 'Games: invasion games (football, netball) — tactics and rules' },
  { s: 'PE', y: 'Year 3–4', t: 'Games: striking and fielding (cricket, rounders)' },
  { s: 'PE', y: 'Year 3–4', t: 'Athletics: sprinting technique; long jump; relay' },
  { s: 'PE', y: 'Year 3–4', t: 'Gymnastics: sequences; counterbalance and countertension' },
  { s: 'PE', y: 'Year 3–4', t: 'Outdoor & adventurous: orienteering; team challenges' },
  { s: 'PE', y: 'Year 5–6', t: 'Games: competitive invasion games — positional play' },
  { s: 'PE', y: 'Year 5–6', t: 'Games: net and wall games (badminton, tennis)' },
  { s: 'PE', y: 'Year 5–6', t: 'Athletics: improving personal bests; training principles' },
  { s: 'PE', y: 'Year 5–6', t: 'Swimming: front crawl; backstroke; water safety; self-rescue' },
  { s: 'PE', y: 'Year 5–6', t: 'Outdoor & adventurous: map reading; survival skills' },
  { s: 'RE', y: 'Year 3–4', t: 'Christianity: the Bible; the life of Jesus; Christian worship' },
  { s: 'RE', y: 'Year 3–4', t: "Islam: the Qur'an; prayer and mosque; Hajj" },
  { s: 'RE', y: 'Year 3–4', t: 'Judaism: the Torah; Passover; Rosh Hashanah' },
  { s: 'RE', y: 'Year 3–4', t: 'Hinduism: the Trimurti; the Mahabharata; puja' },
  { s: 'RE', y: 'Year 3–4', t: 'Sikhism: the Guru Granth Sahib; the Khalsa; Baisakhi' },
  { s: 'RE', y: 'Year 5–6', t: 'Christianity: denominations; global Christianity; ethics' },
  { s: 'RE', y: 'Year 5–6', t: 'Islam: Islamic ethics; contributions of scholars to science' },
  { s: 'RE', y: 'Year 5–6', t: 'Buddhism: the Eightfold Path; Buddhist ethics; meditation' },
  { s: 'RE', y: 'Year 5–6', t: 'Philosophy of religion: Why is there suffering? Does God exist?' },
  { s: 'RE', y: 'Year 5–6', t: 'Religious diversity: living in a multi-faith society' },
  { s: 'PSHE', y: 'Year 3–4', t: 'Health and wellbeing: healthy lifestyle — diet, exercise, sleep' },
  { s: 'PSHE', y: 'Year 3–4', t: 'Relationships: respecting differences; bullying' },
  { s: 'PSHE', y: 'Year 3–4', t: 'Living in the wider world: communities; money management' },
  { s: 'PSHE', y: 'Year 3–4', t: 'Safety: drug awareness; fire safety; first aid basics' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Health and wellbeing: mental health; managing stress' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Health and wellbeing: puberty; personal hygiene' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Relationships: healthy and unhealthy relationships; consent' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Relationships: online relationships — trust and safety' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Living in the wider world: democracy; human rights; global issues' },
  { s: 'PSHE', y: 'Year 5–6', t: 'Safety: personal safety; 999 and emergency services' },
];

const PARENT_TIPS: Record<string, string[]> = {
  English: [
    'Read together every day — even 10 minutes helps enormously.',
    'Ask your child to retell what happened in a book: who, what, where, why.',
    'Play word games in the car — "I spy" sounds, rhyming pairs, or silly sentences.',
    'Leave little notes for your child to find and reply to.',
  ],
  Maths: [
    'Use real objects — count grapes, add stair steps, share biscuits equally.',
    'Times tables in the car: sing them to a familiar tune.',
    'Play board games that involve counting or money.',
    'Encourage them to explain their working out — it deepens understanding.',
  ],
  Science: [
    'Go for a nature walk and ask "what do you notice?" questions.',
    'Simple kitchen experiments (vinegar and bicarbonate) make great science.',
    'Look up at the night sky and talk about what you can see.',
    'Let your child handle and sort objects by material, weight, or texture.',
  ],
  History: [
    'Ask "what was it like to live then?" to build empathy and curiosity.',
    'Visit a local museum or castle — even virtually online.',
    'Compare old photographs with how places look today.',
    "Find out where your family is from — that's history too!",
  ],
  Geography: [
    'Use maps to zoom in and out — from your street to the whole world.',
    "Talk about the weather every morning: what season? what's typical?",
    'Cook a meal from a different country and find it on a map.',
    'Let your child plan the route on a walk with a simple map.',
  ],
  default: [
    'Little and often beats long occasional sessions.',
    "Ask your child to teach you — it's the best test of understanding.",
    'Praise effort and curiosity, not just right answers.',
    'Link learning to real life whenever you can.',
  ],
};

function shortKeywords(topic: string): string {
  const cleaned = topic
    .replace(
      /^(Biology|Physics|Chemistry|Geography|History|Geometry|Statistics|Measurement|Grammar|Spelling|Punctuation|Comprehension|Writing composition|Word reading|Spoken language|Handwriting|Performing|Composing|Listening|Music theory|Design|Make|Mechanisms|Structures|Electrical systems|Cooking and nutrition|Programming|Networks|Digital literacy|Data|Locational knowledge|Human and physical geography|Geographical skills|Physical geography|Human geography|Fieldwork|Artists study|Drawing|Painting|Sculpture|Digital art|Design history|Games|Gymnastics|Dance|Athletics|Swimming|Outdoor):\s*/i,
      ''
    )
    .replace(
      /^(Changes in Britain|Changes within|Events beyond|Lives of significant individuals|Historical|Living things|Living in|Health and wellbeing|Relationships|Safety)[\s:—–-]+/i,
      ''
    )
    .replace(/—.*$/, '')
    .replace(/;.*$/, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned
    .split(' ')
    .filter((w) => w.length > 1)
    .slice(0, 3)
    .join(' ');
}

function buildTopicLinks(topic: string, subjectId: string): {
  kw: string;
  matchedVideo: YouTubeVideo | null;
  watch: string;
  bbcSearch: string;
  oak: string;
  print: string;
  classroomSecrets: string;
  quiz: string;
} {
  const kw = shortKeywords(topic);
  const bbcKw = encodeURIComponent(kw);
  const twinklKw = encodeURIComponent(`${kw} ${subjectId.replace('&', '').trim()}`);
  const matchedVideo = findMatchingYouTubeVideo(subjectId, undefined, topic, false);
  const watch = matchedVideo
    ? `https://www.youtube.com/watch?v=${matchedVideo.youtubeId}`
    : getFallbackVideoSearchUrl(`${kw} ${subjectId}`);
  return {
    kw,
    matchedVideo,
    watch,
    bbcSearch: `https://www.bbc.co.uk/search?q=${bbcKw}&d=search_ps`,
    oak: `https://www.thenational.academy/teachers/search?term=${bbcKw}`,
    print: `https://www.twinkl.co.uk/search?q=${twinklKw}`,
    classroomSecrets: `https://classroomsecrets.co.uk/?s=${bbcKw}`,
    quiz: `https://www.bbc.co.uk/bitesize/search?q=${bbcKw}&d=BITESIZE`,
  };
}

function findMatchingAppTopic(subjectId: string, textQuery: string): Topic {
  const phrase = textQuery.toLowerCase().trim();
  const words = phrase
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const subjectTopics = TOPICS.filter((t) => t.subjectId === subjectId);
  const exactPhrase = subjectTopics.find(
    (t) =>
      t.title.toLowerCase().includes(phrase) ||
      t.objectives.some((o) => o.toLowerCase().includes(phrase))
  );
  if (exactPhrase) return exactPhrase;
  const wordMatch = subjectTopics.find((t) =>
    words.some((w) => t.title.toLowerCase().includes(w) || t.objectives.some((o) => o.toLowerCase().includes(w)))
  );
  return wordMatch || subjectTopics[0] || TOPICS[0];
}

export const CurriculumDirectorySection: React.FC<CurriculumDirectorySectionProps> = ({
  onOpenTopic,
  onOpenWorld,
  activeKS,
  onSelectKS,
  isOpen: controlledOpen,
  onToggleOpen,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isDirectoryOpen = controlledOpen ?? internalOpen;
  const handleToggleDirectory = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  const [internalKS, setInternalKS] = useState<'ks1' | 'ks2'>('ks1');
  const selectedKS = activeKS ?? internalKS;
  const setSelectedKS = (ks: 'ks1' | 'ks2') => {
    setInternalKS(ks);
    onSelectKS?.(ks);
  };
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRowModal, setActiveRowModal] = useState<{ ks: 'ks1' | 'ks2'; row: DirectoryRow } | null>(
    null
  );
  const [openTipIdx, setOpenTipIdx] = useState<number | null>(0);

  const subjectMap = useMemo(() => {
    const map: Record<string, (typeof SUBJECTS)[number]> = {};
    SUBJECTS.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, []);

  const filteredRows = useMemo(() => {
    const base = selectedKS === 'ks1' ? KS1_ROWS : KS2_ROWS;
    const q = searchQuery.trim().toLowerCase();
    return base.filter((r) => {
      const subjOk = subjectFilter === 'all' || r.s === subjectFilter;
      const qOk = !q || r.t.toLowerCase().includes(q) || r.s.toLowerCase().includes(q) || r.y.toLowerCase().includes(q);
      return subjOk && qOk;
    });
  }, [selectedKS, subjectFilter, searchQuery]);

  const modalSubject = activeRowModal ? subjectMap[activeRowModal.row.s] || SUBJECTS[0] : null;
  const modalLinks = activeRowModal
    ? buildTopicLinks(activeRowModal.row.t, activeRowModal.row.s)
    : null;
  const modalTips = activeRowModal
    ? PARENT_TIPS[activeRowModal.row.s] || PARENT_TIPS.default
    : [];

  return (
    <>
      {/* FULL NATIONAL CURRICULUM KS1 & KS2 DIRECTORY (COLLAPSIBLE PANEL — HIDDEN BY DEFAULT) */}
      <section
        id="full-curriculum-directory"
        aria-labelledby="full-curriculum-heading"
        className="w-full bg-[#F8FAFC] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-t border-b border-slate-200 space-y-10"
      >
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
          <button
            type="button"
            onClick={handleToggleDirectory}
            aria-expanded={isDirectoryOpen}
            className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-left cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                <span>📚 KS1 &amp; KS2 · 12 Subjects</span>
              </div>
              <h2 id="full-curriculum-heading" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900 group-hover:text-indigo-800 transition-colors">
                Full National Curriculum Directory
              </h2>
              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Every topic for KS1 &amp; KS2 — click here to expand and browse BBC Teach videos, Oak National lessons, Twinkl printables, quizzes &amp; Schoola games.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
              <span className="text-xs font-bold text-slate-500 tabular-nums whitespace-nowrap hidden md:inline">
                {KS1_ROWS.length + KS2_ROWS.length} topics
              </span>
              <span className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#0B1F4D] group-hover:bg-[#163276] text-white font-playful font-bold text-sm inline-flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors">
                <span>{isDirectoryOpen ? 'Hide Directory' : 'Open Directory'}</span>
                {isDirectoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </div>
          </button>

          {isDirectoryOpen && (
            <div className="pt-6 border-t border-slate-200 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedKS('ks1')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-playful font-bold text-sm border-2 transition-colors cursor-pointer whitespace-nowrap ${
              selectedKS === 'ks1'
                ? 'bg-[#FFE0DC] text-[#9A2E1B] border-[#f87171]'
                : 'bg-[#FFF0EE] text-[#b83922] border-[#fecdc8] hover:bg-[#FFE0DC]'
            }`}
          >
            📗 Key Stage 1 · Years 1–2 · Ages 5–7
          </button>
          <button
            type="button"
            onClick={() => setSelectedKS('ks2')}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl font-playful font-bold text-sm border-2 transition-colors cursor-pointer whitespace-nowrap ${
              selectedKS === 'ks2'
                ? 'bg-[#E0E7FF] text-[#1e3a8a] border-[#818cf8]'
                : 'bg-[#EEF2FF] text-[#1e3a8a] border-[#c7d2fe] hover:bg-[#E0E7FF]'
            }`}
          >
            📘 Key Stage 2 · Years 3–6 · Ages 7–11
          </button>
                </div>
                <div className="text-xs font-bold text-slate-600 tabular-nums whitespace-nowrap">
                  Showing {filteredRows.length} topics ({selectedKS.toUpperCase()})
                </div>
              </div>

        {/* Search & Subject Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. fractions, materials)..."
              aria-label="Search curriculum topics"
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setSubjectFilter('all')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap transition-colors ${
              subjectFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All subjects
          </button>

          {['English', 'Maths', 'Science', 'History', 'Geography', 'Computing', 'Art', 'DT', 'Music', 'PE', 'RE', 'PSHE'].map(
            (subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSubjectFilter(subj)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer whitespace-nowrap transition-colors ${
                  subjectFilter === subj
                    ? 'bg-sky-600 text-white border-sky-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {subj}
              </button>
            )
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 text-slate-800 font-playful font-bold text-xs">
                <tr>
                  <th className="py-3 px-4 whitespace-nowrap">Subject</th>
                  <th className="py-3 px-4 whitespace-nowrap">Year</th>
                  <th className="py-3 px-4">Topic / Area</th>
                  <th className="py-3 px-4 whitespace-nowrap">Videos</th>
                  <th className="py-3 px-4 whitespace-nowrap">Printables</th>
                  <th className="py-3 px-4 whitespace-nowrap">Quiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 text-sm">
                      No curriculum topics matched &ldquo;{searchQuery}&rdquo;. Try clearing your search or switching Key Stage.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => {
                    const sMeta = subjectMap[row.s] || SUBJECTS[0];
                    const links = buildTopicLinks(row.t, row.s);
                    return (
                      <tr
                        key={`${row.s}-${row.y}-${idx}`}
                        className="odd:bg-white even:bg-slate-50/60 hover:bg-sky-50/70 transition-colors"
                      >
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{ backgroundColor: sMeta.bg, color: sMeta.textColor }}
                          >
                            <span aria-hidden="true">{sMeta.emoji}</span>
                            <span>{row.s}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                            {row.y}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <button
                            type="button"
                            onClick={() => {
                              setOpenTipIdx(0);
                              setActiveRowModal({ ks: selectedKS, row });
                            }}
                            className="text-left text-sky-700 hover:text-sky-900 hover:underline font-semibold cursor-pointer"
                          >
                            {row.t}
                          </button>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <a
                            href={links.watch}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 hover:bg-violet-100"
                          >
                            ▶ Watch
                          </a>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <a
                            href={links.print}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
                          >
                            🖨 Print
                          </a>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <a
                            href={links.quiz}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100"
                          >
                            ? Quiz
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
            </div>
          )}
        </div>
      </section>

      {/* TOPIC DETAIL MODAL (MIRRORS TOPIC RESOURCE VIEW + LAUNCHES SCHOOLA HUB) */}
      {activeRowModal && modalSubject && modalLinks && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="directory-topic-title"
        >
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 text-left">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>{activeRowModal.ks === 'ks1' ? 'Key Stage 1' : 'Key Stage 2'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRowModal.row.y}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {modalSubject.emoji} {activeRowModal.row.s}
                  </span>
                </div>
                <h3 id="directory-topic-title" className="font-playful font-bold text-2xl sm:text-3xl text-slate-900">
                  {activeRowModal.row.t}
                </h3>
                <p className="text-xs text-slate-500">
                  Source:{' '}
                  <a
                    href="https://www.gov.uk/national-curriculum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline font-semibold"
                  >
                    DfE National Curriculum — {activeRowModal.row.s}
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveRowModal(null)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer shrink-0"
                aria-label="Close topic details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Launch Interactive Schoola Lesson */}
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-playful font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  Play Interactive Schoola Quest
                </p>
                <p className="text-xs sm:text-sm text-sky-100">
                  Practice {activeRowModal.row.s} inside Schoola&apos;s interactive lesson player and earn Stars.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const matched = findMatchingAppTopic(activeRowModal.row.s, activeRowModal.row.t);
                    setActiveRowModal(null);
                    onOpenTopic(matched);
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-playful font-bold text-sm cursor-pointer whitespace-nowrap"
                >
                  Open Lesson →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const subj = activeRowModal.row.s;
                    setActiveRowModal(null);
                    onOpenWorld(subj);
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-playful font-bold text-sm cursor-pointer whitespace-nowrap"
                >
                  {activeRowModal.row.s} World
                </button>
              </div>
            </div>

            {/* Video Lessons */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-playful font-bold text-base text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-600" />
                Video lessons &amp; explainers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <a
                  href={modalLinks.watch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:border-rose-400 hover:bg-rose-50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-rose-600 uppercase">
                    {modalLinks.matchedVideo ? `Video · ${modalLinks.matchedVideo.channelName}` : 'YouTube Kids'}
                  </p>
                  <p className="font-playful font-bold text-sm text-slate-900 line-clamp-2">
                    {modalLinks.matchedVideo ? modalLinks.matchedVideo.title : modalLinks.kw}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                    ▶ Watch video →
                  </span>
                </a>
                <a
                  href={modalLinks.bbcSearch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">BBC Teach</p>
                  <p className="font-playful font-bold text-sm text-slate-900">{modalLinks.kw}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                    ▶ Search BBC →
                  </span>
                </a>
                <a
                  href={modalLinks.oak}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Oak National Academy</p>
                  <p className="font-playful font-bold text-sm text-slate-900">{modalLinks.kw}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                    ▶ Search on Oak →
                  </span>
                </a>
                <a
                  href={modalLinks.quiz}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">BBC Bitesize</p>
                  <p className="font-playful font-bold text-sm text-slate-900">Bitesize: {modalLinks.kw}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
                    <HelpCircle className="w-3.5 h-3.5" /> Quizzes &amp; Guides →
                  </span>
                </a>
              </div>
            </div>

            {/* Printables */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-playful font-bold text-base text-slate-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                Free printable resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={modalLinks.print}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Twinkl</p>
                  <p className="font-playful font-bold text-sm text-slate-900">{modalLinks.kw} worksheets</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    🖨 Find on Twinkl →
                  </span>
                </a>
                <a
                  href={modalLinks.classroomSecrets}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors space-y-1.5"
                >
                  <p className="text-[11px] font-bold text-slate-500 uppercase">Classroom Secrets</p>
                  <p className="font-playful font-bold text-sm text-slate-900">{modalLinks.kw} activities</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    🖨 View resources →
                  </span>
                </a>
              </div>
            </div>

            {/* Teaching Tips for Parents */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2.5">
              <h4 className="font-playful font-bold text-base text-slate-900">
                Teaching tips for parents
              </h4>
              <div className="space-y-2">
                {modalTips.map((tip, idx) => {
                  const isOpen = openTipIdx === idx;
                  return (
                    <div key={tip} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenTipIdx(isOpen ? null : idx)}
                        className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-left text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                      >
                        <span>
                          Tip {idx + 1}: {tip.split('—')[0].trim()}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 py-3 text-xs sm:text-sm text-slate-600 bg-white">
                          {tip}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
