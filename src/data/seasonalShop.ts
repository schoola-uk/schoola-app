export type SeasonalCategoryId =
  | 'all'
  | 'winter'
  | 'teacher'
  | 'birthday'
  | 'lunchbox'
  | 'trending'
  | 'bikes-tech';

export type ShopAgeBand = 'all' | '3-5' | '6-8' | '9-12';
export type ShopBudgetBand = 'all' | 'under-5' | 'under-15' | 'under-50' | 'affordable-tech';

export interface SeasonalTimelineNode {
  id: Exclude<SeasonalCategoryId, 'all'>;
  seasonWindow: string;
  title: string;
  shortLabel: string;
  highlights: string;
  quickTag: string;
  bagBodyColor: string;
  bagSideColor: string;
  bagHandleColor: string;
  bagBadgeBg: string;
  dealSearchQuery: string;
  illustration: 'winter' | 'teacher' | 'birthday' | 'lunchbox' | 'trending' | 'bikes-tech';
}

export interface SeasonalShopItem {
  id: string;
  title: string;
  category: Exclude<SeasonalCategoryId, 'all'>;
  categoryLabel: string;
  ageBand: ShopAgeBand;
  budgetBand: Exclude<ShopBudgetBand, 'all'>;
  budgetHint: string;
  parentNote: string;
  amazonTarget: string;
  dealSearchQuery: string;
  badgeText?: string;
}

export interface SpecialDiscountCategoryLink {
  id: string;
  label: string;
  category: Exclude<SeasonalCategoryId, 'all'>;
  searchQuery: string;
  highlightNote: string;
}

export interface ParentBlogArticle {
  id: string;
  tag: string;
  readTime: string;
  title: string;
  summary: string;
  category: Exclude<SeasonalCategoryId, 'all'>;
  highlights: { label: string; detail: string; searchQuery: string }[];
  ctaLabel: string;
  ctaQuery: string;
}

export interface MumHumourArticle {
  id: string;
  badge: string;
  title: string;
  byline: string;
  story: string;
  placements: {
    name: string;
    quip: string;
    searchQuery: string;
  }[];
  category: Exclude<SeasonalCategoryId, 'all'>;
}

export const MUM_HUMOUR_ARTICLES: MumHumourArticle[] = [
  {
    id: 'mum-school-prep',
    badge: 'School Prep & Lunchboxes',
    title: 'The Great Book-Bag Mystery: Where Do Water Bottles Go?!',
    byline: 'By a Year 2 & Reception Mum (still looking for a lost left wellie)',
    story:
      'Every September I swear this is the year we become an organised Pinterest family. By week three, a squished banana has welded itself to the spelling sheet and someone’s water bottle has leaked over the library book. Moral of the morning rush? Only buy kit that locks shut, wipes clean in ten seconds, and survives puddles.',
    placements: [
      {
        name: 'Sistema Bento TO GO Lunchbox',
        quip: 'Stops grapes rolling into the sandwich corner.',
        searchQuery: 'sistema bento lunchbox kids',
      },
      {
        name: 'Polar Gear Bottle & Lunch Bag Combo',
        quip: 'Flip-straw doesn’t soak the reading diary.',
        searchQuery: 'polar gear lunch bag bottle kids',
      },
      {
        name: 'Kids Wellies & Waterproof Puddle Suit',
        quip: 'Forest School mud stays outside the hallway.',
        searchQuery: 'kids wellies waterproof suit',
      },
    ],
    category: 'lunchbox',
  },
  {
    id: 'mum-teacher-gifts',
    badge: 'Gifts for Teachers',
    title: 'Under-£5 Teacher Gifts (Because They Have 47 Mugs Already)',
    byline: 'By a Mum who once wrapped a candle at 7:55am in the car',
    story:
      'Let us be honest: primary teachers deserve a medal and a sofa, not mug number forty-eight saying World’s Best Teacher. Pair a big card the whole class can scribble inside with a keepsake or mini desk stationery set they will actually reach for in Year 3—or chip in £2 each for a boxed pamper treat.',
    placements: [
      {
        name: 'Class Signing Cards + Stickers',
        quip: 'Under £5 · Kids actually enjoy signing it.',
        searchQuery: 'thank you teacher card stickers',
      },
      {
        name: 'Tinc Mini Desk Stationery Set',
        quip: 'Cute scissors & stapler that won’t vanish.',
        searchQuery: 'tinc mini desk stationery set',
      },
      {
        name: 'NIVEA Pamper Me Gift Set (Boxed)',
        quip: 'Already boxed—zero midnight sellotape wrestling.',
        searchQuery: 'nivea gift set women pamper',
      },
    ],
    category: 'teacher',
  },
  {
    id: 'mum-girls-party',
    badge: 'Girls Birthday Parties',
    title: 'Surviving the Saturday Party Circuit Under £15 (No Glitter Slime!)',
    byline: 'By a Mum who has attended 14 soft-play discos this term',
    story:
      'Rule number one of class birthday parties: never gift loud sirens or open pots of glitter slime to parents you have to face at school pick-up on Monday. Stick to under-£15 hits that feel thrilling to unwrap—creative LEGO builds, jewellery craft tins, and unicorn bottles they genuinely use.',
    placements: [
      {
        name: 'LEGO Creator Playful Cat & LEGO Roses',
        quip: 'Three builds in one box—huge unwrap smile.',
        searchQuery: 'lego roses creator playful cat under 15',
      },
      {
        name: 'Friendship Bracelet & Craft Box',
        quip: 'Buy one hour of rainy-Sunday calm for their mum.',
        searchQuery: 'girls craft bracelet making kit under 15',
      },
      {
        name: 'Polar Gear Unicorn Bottle & Bag Set',
        quip: 'Practical, adorable, and always hits under £15.',
        searchQuery: 'polar gear unicorn bottle bag kids',
      },
    ],
    category: 'birthday',
  },
  {
    id: 'mum-christmas-prep',
    badge: 'Christmas & Big Picks',
    title: 'Cosy Pyjamas, Stocking Stashes & Bikes They Won’t Outgrow in May',
    byline: 'By a Mum hiding parcels behind the winter coats',
    story:
      'December sneaks up faster than a reception nativity rehearsal. Start quietly with matching cotton PJs for Christmas Eve (saves the last-minute size hunt), tuck Usborne sticker books into stockings, and if you are hunting for a sport bicycle or study tablet, stick strictly to the All-Discounts filter.',
    placements: [
      {
        name: 'Matching Family Christmas Pyjamas',
        quip: 'Yes, even Dad wears the reindeer top.',
        searchQuery: 'matching family christmas pyjamas',
      },
      {
        name: 'Affordable Kids Sport Bicycles',
        quip: 'All-Discounts picks under £150 for park laps.',
        searchQuery: 'kids sport bicycle mountain bike',
      },
      {
        name: 'Kids No-SIM Watch & Fire HD Tablet',
        quip: 'Screen-safe timers and homework practice.',
        searchQuery: 'kids smart watch fire hd kids tablet',
      },
    ],
    category: 'bikes-tech',
  },
];

export const DEFAULT_AMAZON_TAG = 'schoola-21';

export function buildAmazonAffiliateUrl(target: string, tag: string): string {
  const cleanTag = (tag || DEFAULT_AMAZON_TAG).trim() || DEFAULT_AMAZON_TAG;
  const base = `https://www.amazon.co.uk/${target.replace(/^\/+/, '')}`;
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}tag=${encodeURIComponent(cleanTag)}`;
}

/**
 * Builds an Amazon.co.uk search URL pre-filtered with Amazon's "All Discounts" deal refinement
 * (rh=p_n_deal_type%3A26901100031&dc&rnid=26901097031&tag=...&ref=sr_nr_p_n_deal_type_1).
 */
export function buildAmazonAllDiscountsUrl(searchQuery: string, tag: string = DEFAULT_AMAZON_TAG): string {
  const cleanTag = (tag || DEFAULT_AMAZON_TAG).trim() || DEFAULT_AMAZON_TAG;
  const encodedQuery = encodeURIComponent(searchQuery.replace(/\+/g, ' ')).replace(/%20/g, '+');
  return `https://www.amazon.co.uk/s?k=${encodedQuery}&rh=p_n_deal_type%3A26901100031&dc&rnid=26901097031&tag=${encodeURIComponent(cleanTag)}&ref=sr_nr_p_n_deal_type_1`;
}

export const PARENT_BLOG_ARTICLES: ParentBlogArticle[] = [
  {
    id: 'blog-christmas',
    tag: 'Christmas Guide',
    readTime: '2 min read',
    title: 'Christmas Gifts for Kids: What Actually Gets Used',
    summary: 'Age-sorted toys, festive pyjamas, and under-£10 stocking fillers parents swear by.',
    category: 'winter',
    highlights: [
      {
        label: 'Ages 3–5 & 6–8 Winners',
        detail: 'LEGO Creator 3-in-1 Playful Cat, Melissa & Doug chunky puzzles, and Orchard Toys.',
        searchQuery: 'lego creator playful cat kids christmas gifts',
      },
      {
        label: 'Cosy Family Christmas',
        detail: 'Matching family Christmas pyjamas, festive jumpers, and warm fleece-lined coats.',
        searchQuery: 'matching family christmas pyjamas kids jumper',
      },
      {
        label: 'Under-£10 Stocking Fillers',
        detail: 'Usborne sticker books, Schleich animals, and pocket craft packs.',
        searchQuery: 'kids stocking fillers under 10',
      },
    ],
    ctaLabel: 'Shop Christmas All Discounts',
    ctaQuery: 'kids christmas gifts toys pyjamas',
  },
  {
    id: 'blog-teacher',
    tag: 'Teacher Thank-You',
    readTime: '2 min read',
    title: "Gifts for Teachers Under £5 That Don't Look Cheap",
    summary: 'Thoughtful classroom keepsakes, desk sets, and boxed pamper upgrades for term-end.',
    category: 'teacher',
    highlights: [
      {
        label: 'Cards & Keepsakes Under £5',
        detail: 'Class signing cards with stickers, wooden thank-you plaques, and wish bracelets.',
        searchQuery: 'thank you teacher wooden plaque card stickers',
      },
      {
        label: 'Useful Desk Sets',
        detail: 'Tinc mini desk stationery kits, sticky-note sets, and daily planners teachers actually use.',
        searchQuery: 'teacher desk stationery gift set',
      },
      {
        label: 'Class Collection Upgrades (£8–£15)',
        detail: 'Gift-boxed NIVEA Pamper Me & Baylis & Harding sets — zero wrapping needed.',
        searchQuery: 'nivea baylis harding pamper gift set',
      },
    ],
    ctaLabel: 'Shop Teacher Gifts (All Discounts)',
    ctaQuery: 'teacher gift set thank you',
  },
  {
    id: 'blog-girls-birthday',
    tag: 'Party Picks',
    readTime: '2 min read',
    title: 'Birthday Party Gifts for Girls Under £15',
    summary: 'Class-party favourites that feel special, stay on budget, and skip plastic clutter.',
    category: 'birthday',
    highlights: [
      {
        label: 'Creative & LEGO Sets',
        detail: 'LEGO Roses & Playful Cat 3-in-1, friendship bracelet beads, and watercolour craft boxes.',
        searchQuery: 'girls birthday gifts lego roses craft set under 15',
      },
      {
        label: 'Unicorn & Character Favourites',
        detail: 'Polar Gear unicorn bottle + bag sets, Care Bears plush, and Usborne activity books.',
        searchQuery: 'girls birthday gifts unicorn craft books under 15',
      },
      {
        label: 'Tweens (Ages 9–12)',
        detail: 'Mini lip gloss & hair accessory kits, pastel notebooks, and gel pen sets.',
        searchQuery: 'birthday gifts 9 10 year old girl under 15',
      },
    ],
    ctaLabel: 'Shop Girls Party Gifts (All Discounts)',
    ctaQuery: 'girls birthday gifts under 15',
  },
  {
    id: 'blog-lunch-winter',
    tag: 'School Survival',
    readTime: '2 min read',
    title: 'Wellies, Winter Coats & Leakproof Lunchboxes',
    summary: 'Mud-proof Forest School kit and spill-free bento sets built for the daily school run.',
    category: 'lunchbox',
    highlights: [
      {
        label: 'Rain & Playground Proof',
        detail: 'Kids wellies, fleece-lined puddle suits, and waterproof padded coats.',
        searchQuery: 'kids wellies waterproof suit',
      },
      {
        label: 'Book-Bag Safe Lunch Sets',
        detail: 'Sistema Bento TO GO boxes and 3-piece bottle + insulated bag combos.',
        searchQuery: 'sistema bento lunchbox kids water bottle',
      },
    ],
    ctaLabel: 'Shop School Kit (All Discounts)',
    ctaQuery: 'kids wellies waterproof suit lunchbox',
  },
];

export const SPECIAL_DISCOUNT_LINKS: SpecialDiscountCategoryLink[] = [
  {
    id: 'disc-wellies',
    label: 'Kids Wellies & Waterproof Suits',
    category: 'winter',
    searchQuery: 'kids wellies waterproof suit',
    highlightNote: 'All Discounts · Winter Kit',
  },
  {
    id: 'disc-xmas',
    label: 'Christmas Gifts & Family PJs',
    category: 'winter',
    searchQuery: 'kids christmas gifts matching pyjamas',
    highlightNote: 'All Discounts · Festive Deals',
  },
  {
    id: 'disc-teacher',
    label: 'Teacher Thank-You & Pamper Sets',
    category: 'teacher',
    searchQuery: 'teacher gift set thank you',
    highlightNote: 'All Discounts · Under £5–£15',
  },
  {
    id: 'disc-girls-bday',
    label: 'Birthday Party Gifts for Girls Under £15',
    category: 'birthday',
    searchQuery: 'girls birthday gifts under 15',
    highlightNote: 'All Discounts · Ages 3–12',
  },
  {
    id: 'disc-lunch',
    label: 'Water Bottles & Bento Lunchboxes',
    category: 'lunchbox',
    searchQuery: 'kids bento lunchbox water bottle leakproof',
    highlightNote: 'All Discounts · School Ready',
  },
  {
    id: 'disc-trending',
    label: 'Trending Kids Toys, Books & Scooters',
    category: 'trending',
    searchQuery: 'kids bestselling toys games scooter',
    highlightNote: 'All Discounts · Trending',
  },
  {
    id: 'disc-bikes',
    label: 'Affordable Kids Sport Bicycles',
    category: 'bikes-tech',
    searchQuery: 'kids sport bicycle mountain bike',
    highlightNote: 'All Discounts · Under £150',
  },
  {
    id: 'disc-tech',
    label: 'Smart Watches, Fire Tablets & iPads',
    category: 'bikes-tech',
    searchQuery: 'kids smart watch fire hd tablet ipad',
    highlightNote: 'All Discounts · Value Tech',
  },
];

export const SEASONAL_TIMELINE_NODES: SeasonalTimelineNode[] = [
  {
    id: 'winter',
    seasonWindow: 'Winter & Xmas',
    title: 'Winter Wear & Christmas',
    shortLabel: 'Winter Bag',
    highlights: 'Wellies, waterproof suits, padded coats & matching PJs',
    quickTag: 'Coats & Wellies',
    bagBodyColor: '#0EA5E9',
    bagSideColor: '#0369A1',
    bagHandleColor: '#0284C7',
    bagBadgeBg: 'bg-sky-50 border-sky-200',
    dealSearchQuery: 'kids wellies waterproof suit',
    illustration: 'winter',
  },
  {
    id: 'teacher',
    seasonWindow: 'Term End',
    title: 'Gifts for Teachers',
    shortLabel: 'Teacher Bag',
    highlights: 'Under-£5 keepsakes, cards, stationery & boxed pamper sets',
    quickTag: 'Under £5–£15',
    bagBodyColor: '#F43F5E',
    bagSideColor: '#BE123C',
    bagHandleColor: '#E11D48',
    bagBadgeBg: 'bg-rose-50 border-rose-200',
    dealSearchQuery: 'teacher gift set thank you',
    illustration: 'teacher',
  },
  {
    id: 'birthday',
    seasonWindow: 'Party Ready',
    title: 'Birthday Gifts Under £15',
    shortLabel: 'Birthday Bag',
    highlights: 'Girls party hits, LEGO 3-in-1, craft kits & board games',
    quickTag: 'Girls & Boys',
    bagBodyColor: '#FBBF24',
    bagSideColor: '#D97706',
    bagHandleColor: '#F59E0B',
    bagBadgeBg: 'bg-amber-50 border-amber-300',
    dealSearchQuery: 'girls birthday gifts under 15',
    illustration: 'birthday',
  },
  {
    id: 'lunchbox',
    seasonWindow: 'School Daily',
    title: 'Water Bottles & Lunchboxes',
    shortLabel: 'Lunch Bag',
    highlights: 'Leakproof flip bottles, Sistema bento & 3pc character sets',
    quickTag: 'Leakproof Sets',
    bagBodyColor: '#22C55E',
    bagSideColor: '#15803D',
    bagHandleColor: '#16A34A',
    bagBadgeBg: 'bg-emerald-50 border-emerald-200',
    dealSearchQuery: 'kids bento lunchbox water bottle',
    illustration: 'lunchbox',
  },
  {
    id: 'trending',
    seasonWindow: 'Hot Picks',
    title: 'Trending Items for Kids',
    shortLabel: 'Trending Bag',
    highlights: 'Daily toy markdowns, sticker books & 3-wheel scooters',
    quickTag: 'Live Markdowns',
    bagBodyColor: '#FF9900',
    bagSideColor: '#C2410C',
    bagHandleColor: '#EA580C',
    bagBadgeBg: 'bg-orange-50 border-orange-300',
    dealSearchQuery: 'trending kids toys books games',
    illustration: 'trending',
  },
  {
    id: 'bikes-tech',
    seasonWindow: 'Active & Study',
    title: 'Sport Bikes, Watches & iPads',
    shortLabel: 'Bikes & Tech',
    highlights: 'Affordable sport bicycles, no-SIM watches & study tablets',
    quickTag: 'Budget Value',
    bagBodyColor: '#8B5CF6',
    bagSideColor: '#5B21B6',
    bagHandleColor: '#7C3AED',
    bagBadgeBg: 'bg-violet-50 border-violet-200',
    dealSearchQuery: 'kids sport bicycle smart watch tablet',
    illustration: 'bikes-tech',
  },
];

export const SEASONAL_SHOP_ITEMS: SeasonalShopItem[] = [
  {
    id: 'winter-wellies',
    title: 'Kids Wellies & Waterproof Puddle Suit',
    category: 'winter',
    categoryLabel: 'Winter Clothing',
    ageBand: '3-5',
    budgetBand: 'under-50',
    budgetHint: 'All Discounts · 4★+ Prime',
    parentNote: 'Mud-proof Forest School kit and rainy playtime waterproof sets.',
    amazonTarget: 's?k=kids+wellies+waterproof+suit',
    dealSearchQuery: 'kids wellies waterproof suit',
    badgeText: 'All Discounts',
  },
  {
    id: 'winter-coat',
    title: 'Girls & Boys Padded Waterproof Winter Coat',
    category: 'winter',
    categoryLabel: 'Winter Clothing',
    ageBand: 'all',
    budgetBand: 'under-50',
    budgetHint: 'Budget to mid-range · Prime',
    parentNote: 'Fleece-lined playground coats for rainy school runs.',
    amazonTarget: 's?k=kids+padded+winter+coat+waterproof',
    dealSearchQuery: 'kids padded winter coat waterproof',
    badgeText: 'Winter Pick',
  },
  {
    id: 'winter-xmas-pjs',
    title: 'Matching Family Christmas Pyjamas & Jumpers',
    category: 'winter',
    categoryLabel: 'Christmas Festive',
    ageBand: 'all',
    budgetBand: 'under-50',
    budgetHint: 'Cosy festive sets',
    parentNote: 'Soft cotton Christmas PJs and school Jumper Day picks.',
    amazonTarget: 's?k=matching+family+christmas+pyjamas',
    dealSearchQuery: 'matching family christmas pyjamas kids jumper',
    badgeText: 'Christmas Hit',
  },
  {
    id: 'teacher-cards',
    title: 'Thank You Teacher Cards with Envelope & Stickers',
    category: 'teacher',
    categoryLabel: 'Teacher Gifts',
    ageBand: 'all',
    budgetBand: 'under-5',
    budgetHint: 'Under £5 · 4.8★+',
    parentNote: 'Easy whole-class signing card with fun stickers included.',
    amazonTarget: 's?k=thank+you+teacher+card+stickers',
    dealSearchQuery: 'thank you teacher card gift',
    badgeText: 'Under £5',
  },
  {
    id: 'teacher-plaque',
    title: 'Wooden Thank You Plaque / Hanging Heart',
    category: 'teacher',
    categoryLabel: 'Teacher Gifts',
    ageBand: 'all',
    budgetBand: 'under-5',
    budgetHint: 'Under £5 · Prime',
    parentNote: 'Thoughtful wooden keepsake for teachers & TAs.',
    amazonTarget: 's?k=thank+you+teacher+wooden+plaque+heart',
    dealSearchQuery: 'teacher wooden plaque keepsake gift',
  },
  {
    id: 'teacher-nivea',
    title: 'NIVEA Pamper Me & Baylis Gift Sets (Boxed)',
    category: 'teacher',
    categoryLabel: 'Teacher Gifts',
    ageBand: 'all',
    budgetBand: 'under-15',
    budgetHint: '£8–£15 · Gift boxed',
    parentNote: 'Ready-wrapped pamper set — ideal for class-collection gifts.',
    amazonTarget: 'dp/B0G17HNTMN',
    dealSearchQuery: 'nivea gift set women pamper',
    badgeText: 'Class Favourite',
  },
  {
    id: 'bday-girls-roses',
    title: 'LEGO Roses & Creator Playful Cat (Girls Party Hit)',
    category: 'birthday',
    categoryLabel: 'Girls Birthday · Under £15',
    ageBand: '6-8',
    budgetBand: 'under-15',
    budgetHint: 'Under £15 · 4.8★+',
    parentNote: 'Pretty display builds & 3-in-1 animal sets girls love for parties.',
    amazonTarget: 'dp/B0DHSDDDZ6',
    dealSearchQuery: 'lego roses creator playful cat under 15',
    badgeText: 'Girls Party Hit',
  },
  {
    id: 'bday-girls-craft',
    title: 'Friendship Bracelet & Art Craft Party Gift Box',
    category: 'birthday',
    categoryLabel: 'Girls Birthday · Ages 6–12',
    ageBand: '9-12',
    budgetBand: 'under-15',
    budgetHint: 'Under £15 · Creative Kit',
    parentNote: 'Beading, watercolour, and sticker craft kits under party budget.',
    amazonTarget: 's?k=girls+craft+bracelet+making+kit+under+15',
    dealSearchQuery: 'girls craft bracelet making kit under 15',
  },
  {
    id: 'bday-chunky-puzzle',
    title: 'Melissa & Doug Wooden Puzzles & Dobble Games',
    category: 'birthday',
    categoryLabel: 'Birthday · Ages 3–8',
    ageBand: '3-5',
    budgetBand: 'under-15',
    budgetHint: 'Under £15 · Screen-Free',
    parentNote: 'Durable wooden puzzles and fast 10-minute family card games.',
    amazonTarget: 'dp/B000EK5AEC',
    dealSearchQuery: 'melissa doug puzzle dobble kids',
  },
  {
    id: 'lunch-sistema',
    title: 'Sistema Bento TO GO Divided Lunchbox',
    category: 'lunchbox',
    categoryLabel: 'Lunchboxes & Bottles',
    ageBand: 'all',
    budgetBand: 'under-15',
    budgetHint: 'Under £15 · BPA-Free',
    parentNote: 'Leakproof compartments that fit neatly inside a school book bag.',
    amazonTarget: 'dp/B0721B2GV4',
    dealSearchQuery: 'sistema bento lunchbox kids',
    badgeText: 'Bestseller',
  },
  {
    id: 'lunch-3pc-sets',
    title: 'Polar Gear Unicorn & 3-Piece Bottle + Bag Set',
    category: 'lunchbox',
    categoryLabel: 'Lunchboxes & Bottles',
    ageBand: '3-5',
    budgetBand: 'under-15',
    budgetHint: 'Under £15 · Bundle Deal',
    parentNote: 'Matching insulated bag, bento & leakproof flip-straw bottle.',
    amazonTarget: 'dp/B0F1FZXF3T',
    dealSearchQuery: 'polar gear unicorn lunch bag bottle kids',
  },
  {
    id: 'trend-deals',
    title: "Today's Kids Deals, Usborne Books & 3-Wheel Scooters",
    category: 'trending',
    categoryLabel: 'Trending Kids',
    ageBand: 'all',
    budgetBand: 'under-50',
    budgetHint: 'Live Daily Markdowns',
    parentNote: 'Top trending sticker books, Bluey sets & starter scooters on sale.',
    amazonTarget: 'deals',
    dealSearchQuery: 'kids trending toys usborne scooter',
    badgeText: 'Live Deals',
  },
  {
    id: 'tech-sport-bike',
    title: 'Affordable Kids Sport & Mountain Bicycles (16"–24")',
    category: 'bikes-tech',
    categoryLabel: 'Affordable Sport Bikes',
    ageBand: '6-8',
    budgetBand: 'affordable-tech',
    budgetHint: 'Budget Pick · Under £150',
    parentNote: 'Sturdy kids sport bikes filtered strictly for family-friendly budgets.',
    amazonTarget: 's?k=kids+sport+bicycle+mountain+bike+under+150',
    dealSearchQuery: 'kids sport bicycle mountain bike',
    badgeText: 'Budget Bike',
  },
  {
    id: 'tech-smartwatch',
    title: 'Kids Fitness Smart Watch (No-SIM / Screen-Safe)',
    category: 'bikes-tech',
    categoryLabel: 'Kids Smart Watches',
    ageBand: '9-12',
    budgetBand: 'under-50',
    budgetHint: 'Affordable · No SIM Plan',
    parentNote: 'Step tracker, swim-proof watch & wake alarms without social apps.',
    amazonTarget: 's?k=kids+smart+watch+step+counter+no+sim',
    dealSearchQuery: 'kids smart watch fitness tracker',
  },
  {
    id: 'tech-ipad-renewed',
    title: 'Amazon Fire HD Kids Tablet & Renewed Study iPads',
    category: 'bikes-tech',
    categoryLabel: 'Budget Tablets & iPads',
    ageBand: '9-12',
    budgetBand: 'affordable-tech',
    budgetHint: 'Value Home Study Option',
    parentNote: 'Kid-proof Fire tablets & Amazon-inspected renewed iPads for homework.',
    amazonTarget: 's?k=amazon+fire+hd+kids+tablet+apple+ipad+renewed',
    dealSearchQuery: 'fire hd kids tablet apple ipad renewed',
    badgeText: 'Smart Value',
  },
];
