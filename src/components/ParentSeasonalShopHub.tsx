import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Filter,
  Percent,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import {
  buildAmazonAffiliateUrl,
  buildAmazonAllDiscountsUrl,
  DEFAULT_AMAZON_TAG,
  PARENT_BLOG_ARTICLES,
  SEASONAL_SHOP_ITEMS,
  SEASONAL_TIMELINE_NODES,
  SeasonalCategoryId,
  SeasonalTimelineNode,
  ShopAgeBand,
  ShopBudgetBand,
  SPECIAL_DISCOUNT_LINKS,
} from '../data/seasonalShop';

/** Unique 3D-angled paper shopping bag graphic per category (zero SVG text/numbers) */
const ShoppingBagGraphic: React.FC<{
  kind: SeasonalTimelineNode['illustration'];
  bodyColor: string;
  sideColor: string;
  handleColor: string;
  size?: 'lg' | 'sm';
}> = ({ kind, bodyColor, sideColor, handleColor, size = 'lg' }) => {
  const cls =
    size === 'lg'
      ? 'w-22 h-22 sm:w-24 sm:h-24 drop-shadow-md'
      : 'w-11 h-11 shrink-0 drop-shadow-xs';

  const renderFrontEmblem = () => {
    switch (kind) {
      case 'winter':
        return (
          <g fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M52 54 L59 50 Q64 54 69 50 L76 54 L80 65 L75 68 L73 61 L73 84 L55 84 L55 61 L53 68 L48 65 Z"
              fill="#FFFFFF"
              fillOpacity="0.24"
            />
            <circle cx="46" cy="48" r="2.2" fill="#FFFFFF" stroke="none" />
            <circle cx="82" cy="47" r="2" fill="#E0F2FE" stroke="none" />
          </g>
        );
      case 'teacher':
        return (
          <g>
            <path
              d="M64 54 C57 50 49 55 50 66 C51 76 57 81 63 80 C64 79.5 64 79.5 65 80 C71 81 77 76 78 66 C79 55 71 50 64 54 Z"
              fill="#FFFFFF"
              fillOpacity="0.92"
            />
            <path d="M64 54 C64 49 67 46 70 45" stroke="#FEF08A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M65 49 C69 45 75 47 73 51 C70 52 67 51 65 49 Z" fill="#86EFAC" />
            <path
              d="M60 66 C60 63 64 63 64 66 C64 63 68 63 68 66 C68 70 64 73 64 73 C64 73 60 70 60 66 Z"
              fill={sideColor}
            />
          </g>
        );
      case 'birthday':
        return (
          <g>
            <rect x="49" y="57" width="30" height="24" rx="3.5" fill="#FFFFFF" fillOpacity="0.92" />
            <rect x="47" y="53" width="34" height="6" rx="2" fill="#FEF3C7" />
            <rect x="61.5" y="53" width="5" height="28" fill="#F43F5E" />
            <path d="M64 53 C58 46 53 50 59 53 Z" fill="#F43F5E" />
            <path d="M64 53 C70 46 75 50 69 53 Z" fill="#F43F5E" />
          </g>
        );
      case 'lunchbox':
        return (
          <g>
            <rect x="44" y="58" width="24" height="21" rx="4" fill="#FFFFFF" fillOpacity="0.92" />
            <rect x="47" y="61" width="9" height="15" rx="2" fill="#BBF7D0" />
            <rect x="58" y="61" width="7" height="7" rx="1.5" fill="#FDE68A" />
            <rect x="58" y="69.5" width="7" height="6.5" rx="1.5" fill="#FDA4AF" />
            <rect x="72" y="53" width="11" height="26" rx="3.5" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="74.5" y="48.5" width="6" height="4.5" rx="1.5" fill="#FBBF24" />
          </g>
        );
      case 'trending':
        return (
          <g>
            <path
              d="M46 58 Q55 55 64 60 Q73 55 82 58 V79 Q73 76 64 81 Q55 76 46 79 Z"
              fill="#FFFFFF"
              fillOpacity="0.9"
            />
            <path d="M64 60 V81" stroke={sideColor} strokeWidth="2" />
            <path
              d="M64 41 L66.5 47 L73 47 L68 51 L70 57 L64 53 L58 57 L60 51 L55 47 L61.5 47 Z"
              fill="#FEF08A"
            />
          </g>
        );
      case 'bikes-tech':
        return (
          <g>
            <circle cx="52" cy="74" r="7" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
            <circle cx="72" cy="74" r="7" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
            <path
              d="M52 74 L60 62 H68 L72 74 M60 62 L63 74 H52 M68 62 L70 58 H74"
              stroke="#FEF08A"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <rect x="69" y="45" width="13" height="16" rx="2.5" fill="#FFFFFF" fillOpacity="0.92" />
            <rect x="71.5" y="47.5" width="8" height="10" rx="1" fill="#232F3E" />
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 116 112" className={cls} fill="none" aria-hidden="true">
      <ellipse cx="60" cy="103" rx="34" ry="5.5" fill="#CBD5E1" opacity="0.55" />
      <path d="M42 36 C42 15 62 15 62 36" stroke={sideColor} strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <polygon points="34,36 74,36 92,42 52,42" fill="#FEF3C7" opacity="0.9" />
      <polygon points="24,42 36,36 36,92 24,84" fill={sideColor} />
      <polygon points="24,42 36,36 31,64" fill="#000000" opacity="0.08" />
      <polygon points="36,36 88,36 92,98 36,96" fill={bodyColor} />
      <polygon points="88,36 95,43 92,98 88,36" fill={sideColor} opacity="0.7" />
      <line x1="36" y1="36.5" x2="88" y2="36.5" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.65" />
      {renderFrontEmblem()}
      <path d="M49 39 C49 16 74 16 74 39" stroke={handleColor} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path
        d="M49 39 C49 16 74 16 74 39"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.35"
        fill="none"
      />
    </svg>
  );
};

export const ParentSeasonalShopHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SeasonalCategoryId>('all');
  const [ageFilter, setAgeFilter] = useState<ShopAgeBand>('all');
  const [budgetFilter, setBudgetFilter] = useState<ShopBudgetBand>('all');
  const [allDiscountsOnly, setAllDiscountsOnly] = useState<boolean>(true);
  const [activeBlogId, setActiveBlogId] = useState<string>(PARENT_BLOG_ARTICLES[0].id);

  const filteredItems = useMemo(() => {
    return SEASONAL_SHOP_ITEMS.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchAge =
        ageFilter === 'all' || item.ageBand === 'all' || item.ageBand === ageFilter;
      const matchBudget = budgetFilter === 'all' || item.budgetBand === budgetFilter;
      return matchCat && matchAge && matchBudget;
    });
  }, [activeCategory, ageFilter, budgetFilter]);

  const filteredDiscountLinks = useMemo(() => {
    if (activeCategory === 'all') return SPECIAL_DISCOUNT_LINKS;
    return SPECIAL_DISCOUNT_LINKS.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  const activeBlog =
    PARENT_BLOG_ARTICLES.find((a) => a.id === activeBlogId) || PARENT_BLOG_ARTICLES[0];

  return (
    <div
      data-amazon-panel="true"
      className="bg-[#EAEDED] border-2 border-[#D5D9D9] rounded-3xl p-5 sm:p-8 lg:p-10 space-y-10 text-[#0F1111] shadow-xl"
    >
      {/* 1. CLEAN AMAZON CHARCOAL & ORANGE HEADER */}
      <div className="bg-[#232F3E] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-[#FF9900]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFD814]">
            <ShoppingBag className="w-4 h-4 text-[#FF9900]" />
            <span>Amazon.co.uk Parents Seasonal Shop</span>
          </div>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            Seasonal Shopping Bags, Gift Guides &amp; All Discounts
          </h2>
          <p className="text-[11px] text-[#D1D5DB]">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAllDiscountsOnly((prev) => !prev)}
          className={`min-h-[42px] px-4 py-2 rounded-xl border-2 text-xs font-extrabold cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            allDiscountsOnly
              ? 'bg-[#FFD814] border-[#FCD200] text-[#0F1111]'
              : 'bg-[#37475A] border-[#4B5E75] text-white hover:bg-[#485769]'
          }`}
        >
          <Percent className="w-4 h-4" />
          All Discounts: {allDiscountsOnly ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* 2. UNIQUE GRAPHIC FOR EACH SHOPPING BAG */}
      <section
        aria-label="Choose Your Shopping Type by Bag Graphic"
        className="bg-white border border-[#D5D9D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#C45500] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9900]" />
              Choose Shopping Type
            </p>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1111]">
              Seasonal Shopping Bags
            </h3>
          </div>

          {activeCategory !== 'all' && (
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="min-h-[38px] px-4 py-1.5 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-xs font-extrabold text-[#0F1111] cursor-pointer"
            >
              Show All Bags
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-b from-[#FFFFFF] to-[#F3F4F6] p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEASONAL_TIMELINE_NODES.map((node) => {
              const selected = activeCategory === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() =>
                    setActiveCategory((curr) => (curr === node.id ? 'all' : node.id))
                  }
                  className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer flex items-center gap-4 bg-white ${
                    selected
                      ? 'border-[#FF9900] ring-4 ring-[#FFD814]/50 -translate-y-0.5 shadow-md'
                      : 'border-[#D5D9D9] hover:border-[#FF9900] shadow-2xs'
                  }`}
                >
                  <div className={`rounded-2xl border p-1.5 shrink-0 ${node.bagBadgeBg}`}>
                    <ShoppingBagGraphic
                      kind={node.illustration}
                      bodyColor={node.bagBodyColor}
                      sideColor={node.bagSideColor}
                      handleColor={node.bagHandleColor}
                      size="lg"
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#F3F4F6] border border-[#D5D9D9] text-[10px] font-extrabold text-[#565959]">
                      {node.quickTag}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#0F1111] leading-snug">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-[#565959] line-clamp-2">{node.highlights}</p>
                    <span className="inline-block pt-1 text-[11px] font-extrabold text-[#C45500]">
                      {selected ? 'Selected ✓' : `${node.shortLabel} →`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CURATED PARENT BLOG ARTICLES (CHRISTMAS, TEACHER GIFTS, GIRLS BIRTHDAY PARTIES) */}
      <section
        aria-label="Seasonal Gift Blog Articles"
        className="bg-white border border-[#D5D9D9] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#C45500] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#FF9900]" />
              Parent Gift Guides &amp; Blog
            </p>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1111]">
              Christmas, Teacher Thank-Yous &amp; Girls Party Picks
            </h3>
          </div>
        </div>

        {/* Compact Article Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PARENT_BLOG_ARTICLES.map((article) => {
            const isSelected = activeBlog.id === article.id;
            return (
              <button
                key={article.id}
                type="button"
                onClick={() => setActiveBlogId(article.id)}
                className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-[#FFF8E7] border-[#FF9900] shadow-xs'
                    : 'bg-[#F7F8F8] border-[#D5D9D9] hover:border-[#FF9900]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[10px] font-extrabold">
                    <span className="px-2 py-0.5 rounded bg-[#232F3E] text-[#FFD814]">
                      {article.tag}
                    </span>
                    <span className="text-[#565959]">{article.readTime}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-[#0F1111] leading-snug">
                    {article.title}
                  </h4>
                </div>
                <span className="text-[11px] font-extrabold text-[#C45500]">
                  {isSelected ? 'Reading Now ↓' : 'Read Guide →'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Clean Active Blog Article Reader */}
        <article className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8F8] p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5D9D9] pb-4">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded bg-[#FF9900] text-[#0F1111] text-[10px] font-extrabold uppercase tracking-wider">
                {activeBlog.tag}
              </span>
              <h4 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1111]">
                {activeBlog.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#565959]">{activeBlog.summary}</p>
            </div>

            <a
              href={buildAmazonAllDiscountsUrl(activeBlog.ctaQuery, DEFAULT_AMAZON_TAG)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="min-h-[42px] px-5 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] text-xs font-extrabold inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
            >
              <span>{activeBlog.ctaLabel}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeBlog.highlights.map((pt) => (
              <div
                key={pt.label}
                className="bg-white border border-[#D5D9D9] rounded-xl p-4 flex flex-col justify-between gap-3"
              >
                <div className="space-y-1">
                  <p className="font-heading font-bold text-sm text-[#0F1111]">{pt.label}</p>
                  <p className="text-xs text-[#565959] leading-relaxed">{pt.detail}</p>
                </div>
                <a
                  href={buildAmazonAllDiscountsUrl(pt.searchQuery, DEFAULT_AMAZON_TAG)}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#FFF8E7] hover:bg-[#FFD814] border border-[#FF9900]/60 text-[11px] font-extrabold text-[#0F1111] transition-colors"
                >
                  <span>Check Amazon Deals</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* 4. SPECIAL AMAZON SHOPPERS DISCOUNTS + LIVE ALL-DISCOUNTS LINKS */}
      <section
        aria-label="Special Discounts for Amazon Shoppers"
        className="bg-white border-2 border-[#FF9900] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#CC0C39] text-white text-[11px] font-extrabold">
              <Percent className="w-3.5 h-3.5" />
              SPECIAL AMAZON DISCOUNTS · ALL DISCOUNTS FILTER
            </span>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#0F1111]">
              Quick Deal Links
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDiscountLinks.map((disc) => (
            <a
              key={disc.id}
              href={buildAmazonAllDiscountsUrl(disc.searchQuery, DEFAULT_AMAZON_TAG)}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="group rounded-2xl border border-[#D5D9D9] bg-[#F7F8F8] hover:bg-[#FFF8E7] hover:border-[#FF9900] p-4 flex flex-col justify-between gap-3 transition-colors"
            >
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded bg-[#CC0C39] text-white text-[10px] font-extrabold">
                  All Discounts
                </span>
                <p className="font-heading font-bold text-sm text-[#0F1111] group-hover:text-[#C45500] leading-snug pt-0.5">
                  {disc.label}
                </p>
                <p className="text-[11px] font-semibold text-[#565959]">{disc.highlightNote}</p>
              </div>
              <span className="inline-flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#FFD814] group-hover:bg-[#F7CA00] text-[#0F1111] text-xs font-extrabold">
                <span>Shop Discounts</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* 5. COMPACT AGE & BUDGET FILTER + CURATED PICKS */}
      <div className="bg-white border border-[#D5D9D9] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#565959] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'winter' as const, label: 'Winter & Xmas' },
              { id: 'teacher' as const, label: 'Teacher Gifts' },
              { id: 'birthday' as const, label: 'Party & Girls' },
              { id: 'lunchbox' as const, label: 'Lunchboxes' },
              { id: 'trending' as const, label: 'Trending' },
              { id: 'bikes-tech' as const, label: 'Bikes & Tech' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-extrabold border cursor-pointer transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#FF9900] text-[#0F1111] border-[#E47911]'
                    : 'bg-[#F3F4F6] text-[#0F1111] border-[#D5D9D9] hover:bg-[#EAEDED]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all' as const, label: 'All Ages' },
              { id: '3-5' as const, label: '3–5' },
              { id: '6-8' as const, label: '6–8' },
              { id: '9-12' as const, label: '9–12+' },
            ].map((age) => (
              <button
                key={age.id}
                type="button"
                onClick={() => setAgeFilter(age.id)}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                  ageFilter === age.id
                    ? 'bg-[#232F3E] text-white border-[#232F3E]'
                    : 'bg-[#F3F4F6] text-[#0F1111] border-[#D5D9D9]'
                }`}
              >
                {age.label}
              </button>
            ))}

            {[
              { id: 'all' as const, label: 'Any £' },
              { id: 'under-5' as const, label: '<£5' },
              { id: 'under-15' as const, label: '<£15' },
              { id: 'under-50' as const, label: '<£50' },
              { id: 'affordable-tech' as const, label: 'Bikes/Tech' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudgetFilter(b.id)}
                className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                  budgetFilter === b.id
                    ? 'bg-[#FFD814] text-[#0F1111] border-[#FCD200]'
                    : 'bg-[#F3F4F6] text-[#0F1111] border-[#D5D9D9]'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#D5D9D9] rounded-3xl p-8 text-center space-y-3">
          <p className="font-heading font-bold text-base text-[#0F1111]">
            No items matched those filters
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setAgeFilter('all');
              setBudgetFilter('all');
            }}
            className="min-h-[38px] px-5 py-1.5 rounded-xl bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] text-xs font-extrabold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const standardHref = buildAmazonAffiliateUrl(item.amazonTarget, DEFAULT_AMAZON_TAG);
            const allDiscountsHref = buildAmazonAllDiscountsUrl(
              item.dealSearchQuery,
              DEFAULT_AMAZON_TAG
            );
            const primaryHref = allDiscountsOnly ? allDiscountsHref : standardHref;
            const bagMeta =
              SEASONAL_TIMELINE_NODES.find((n) => n.id === item.category) ||
              SEASONAL_TIMELINE_NODES[0];

            return (
              <div
                key={item.id}
                className="bg-white border border-[#D5D9D9] hover:border-[#FF9900] transition-colors rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007185]">
                      {item.categoryLabel}
                    </span>
                    {item.badgeText && (
                      <span className="px-2 py-0.5 rounded bg-[#CC0C39] text-white text-[10px] font-extrabold shrink-0">
                        {item.badgeText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`rounded-xl border p-1.5 shrink-0 ${bagMeta.bagBadgeBg}`}>
                      <ShoppingBagGraphic
                        kind={bagMeta.illustration}
                        bodyColor={bagMeta.bagBodyColor}
                        sideColor={bagMeta.bagSideColor}
                        handleColor={bagMeta.bagHandleColor}
                        size="sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-base text-[#0F1111] leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs font-bold text-[#C45500]">{item.budgetHint}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#565959] leading-relaxed">{item.parentNote}</p>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
                  <a
                    href={primaryHref}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="min-h-[40px] w-full px-4 py-2 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] text-xs font-extrabold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>
                      {allDiscountsOnly ? 'Shop All Discounts' : 'Check Price on Amazon'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>

                  <a
                    href={allDiscountsOnly ? standardHref : allDiscountsHref}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="min-h-[34px] w-full px-3 py-1 rounded-full bg-[#FF9900]/15 hover:bg-[#FF9900]/30 border border-[#FF9900] text-[#0F1111] text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Percent className="w-3 h-3 text-[#C45500]" />
                    <span>
                      {allDiscountsOnly ? 'Standard Search' : 'Apply All Discounts'}
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
