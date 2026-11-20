import React, { useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
  Play,
  Search,
  Share2,
  SlidersHorizontal,
  Tag,
  Tv,
  X,
  Youtube,
} from 'lucide-react';
import { SUBJECTS } from '../data/curriculum';
import {
  CURATED_YOUTUBE_VIDEOS,
  EDUCATION_CHANNELS,
  YouTubeVideo,
} from '../data/youtubeVideos';

type VideoSortMode = 'keyword' | 'subject' | 'title' | 'channel';

const POPULAR_KEYWORDS = [
  'phonics',
  'fractions',
  'multiplication',
  'plants',
  'space',
  'romans',
  'punctuation',
  'electricity',
  'rivers',
  'coding',
  'weather',
  'animals',
];

export const CuratedVideoClassroom: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<VideoSortMode>('keyword');
  const [showAll, setShowAll] = useState<boolean>(false);
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [tvPlayerVideo, setTvPlayerVideo] = useState<YouTubeVideo | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const filteredAndSortedVideos = useMemo(() => {
    const q = keywordFilter.trim().toLowerCase();

    const filtered = CURATED_YOUTUBE_VIDEOS.filter((v) => {
      const matchSubj = selectedSubject === 'All' || v.subjectId === selectedSubject;
      if (!matchSubj) return false;
      if (!q) return true;
      return (
        v.keywords.some((k) => k.toLowerCase().includes(q)) ||
        v.title.toLowerCase().includes(q) ||
        v.subjectId.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.channelName.toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'subject') {
        const sCmp = a.subjectId.localeCompare(b.subjectId);
        return sCmp !== 0 ? sCmp : a.title.localeCompare(b.title);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'channel') {
        const cCmp = a.channelName.localeCompare(b.channelName);
        return cCmp !== 0 ? cCmp : a.title.localeCompare(b.title);
      }
      // 'keyword' sort: exact keyword match first, then primary keyword alphabetically
      if (q) {
        const aExact = a.keywords.some((k) => k.toLowerCase() === q) ? 2 : a.keywords.some((k) => k.toLowerCase().includes(q)) ? 1 : 0;
        const bExact = b.keywords.some((k) => k.toLowerCase() === q) ? 2 : b.keywords.some((k) => k.toLowerCase().includes(q)) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
      }
      const aKey = (a.keywords[0] || a.title).toLowerCase();
      const bKey = (b.keywords[0] || b.title).toLowerCase();
      return aKey.localeCompare(bKey);
    });
  }, [selectedSubject, keywordFilter, sortBy]);

  const visibleVideos = showAll
    ? filteredAndSortedVideos
    : filteredAndSortedVideos.slice(0, 12);

  const handleShareOrCopyVideo = async (video: YouTubeVideo) => {
    const url = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `${video.title} · Schoola`, url });
        return;
      } catch {
        // Cancelled or unavailable — fall back to clipboard copy
      }
    }
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopiedVideoId(video.id);
      window.setTimeout(() => {
        setCopiedVideoId((curr) => (curr === video.id ? null : curr));
      }, 2400);
    } catch {
      setCopiedVideoId(video.id);
    }
  };

  const handleEnterFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  const currentTvIndex = tvPlayerVideo
    ? filteredAndSortedVideos.findIndex((v) => v.id === tvPlayerVideo.id)
    : -1;

  return (
    <section aria-label="Curated UK Primary Video Classroom" className="space-y-8">
      {/* Subtle Classroom Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#152038] to-[#1A1D3D] border border-slate-800/90 text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-rose-300/90 flex items-center gap-1.5">
            <Youtube className="w-4 h-4" />
            Verified UK Primary Video Links · {CURATED_YOUTUBE_VIDEOS.length} Lessons (KS1–KS2)
          </p>
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
            Curated UK Primary Video Classroom
          </h2>
          <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
            Subtle, keyword-sorted curriculum lessons. Launch our TV &amp; iPhone Screen Mirror player, cast via AirPlay, or open directly in your external YouTube app.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() =>
              setTvPlayerVideo(filteredAndSortedVideos[0] || CURATED_YOUTUBE_VIDEOS[0])
            }
            className="min-h-[42px] px-4 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 text-xs font-bold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors"
          >
            <Tv className="w-4 h-4 text-sky-300" />
            External Player &amp; TV Mirror
          </button>
        </div>
      </div>

      {/* Subtle Keyword Search, Sort & Filter Strip */}
      <div className="bg-[#0F172A]/85 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="Filter & sort by keyword (e.g. phonics, fractions, romans, space)..."
              className="w-full min-h-[40px] pl-10 pr-8 py-2 rounded-xl border border-slate-700/80 bg-slate-900/90 focus:bg-slate-950 focus:border-sky-500/70 focus:outline-none text-xs sm:text-sm font-medium text-white placeholder:text-slate-500"
            />
            {keywordFilter && (
              <button
                type="button"
                onClick={() => setKeywordFilter('')}
                aria-label="Clear keyword filter"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <label
              htmlFor="video-sort-select"
              className="text-xs text-slate-400 inline-flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort:
            </label>
            <select
              id="video-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as VideoSortMode)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-slate-700/80 bg-slate-900 text-xs font-semibold text-slate-200 cursor-pointer"
            >
              <option value="keyword">By Keywords (A–Z)</option>
              <option value="subject">By Subject (A–Z)</option>
              <option value="title">By Lesson Title (A–Z)</option>
              <option value="channel">By Channel</option>
            </select>
          </div>
        </div>

        {/* Subtle Clickable Keyword Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 inline-flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-400" />
            Keywords:
          </span>
          <button
            type="button"
            onClick={() => setKeywordFilter('')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
              !keywordFilter
                ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({CURATED_YOUTUBE_VIDEOS.length})
          </button>
          {POPULAR_KEYWORDS.map((kw) => {
            const active = keywordFilter.toLowerCase() === kw;
            return (
              <button
                key={kw}
                type="button"
                onClick={() => setKeywordFilter(active ? '' : kw)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border capitalize cursor-pointer transition-colors ${
                  active
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                #{kw}
              </button>
            );
          })}
        </div>

        {/* Subtle Subject Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/70 pt-3">
          {['All', ...SUBJECTS.map((s) => s.id)].map((subj) => {
            const active = selectedSubject === subj;
            return (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0 border cursor-pointer transition-colors ${
                  active
                    ? 'bg-slate-100 text-slate-950 border-white'
                    : 'bg-transparent text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle, Scannable Two-Column Lesson Links Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-slate-200">{visibleVideos.length}</strong> of{' '}
            <strong className="text-slate-200">{filteredAndSortedVideos.length}</strong> curated UK lessons
          </span>
          {filteredAndSortedVideos.length > 12 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sky-300 hover:text-sky-200 font-semibold cursor-pointer hover:underline"
            >
              {showAll
                ? 'Show compact view (12)'
                : `Show all ${filteredAndSortedVideos.length} lessons`}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleVideos.map((video) => {
            const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
            const isCopied = copiedVideoId === video.id;
            return (
              <div
                key={video.id}
                className="group rounded-2xl bg-[#0F172A]/80 hover:bg-[#131D35] border border-slate-800/80 hover:border-slate-700 p-4 flex flex-col sm:flex-row gap-4 transition-colors"
              >
                {/* Compact Subtle Video Preview Trigger */}
                <button
                  type="button"
                  onClick={() => setTvPlayerVideo(video)}
                  aria-label={`Play "${video.title}" in TV & Screen Mirror player`}
                  className="relative w-full sm:w-36 aspect-video rounded-xl overflow-hidden bg-slate-950 shrink-0 cursor-pointer border border-slate-800/80"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
                    </span>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono text-slate-200">
                    {video.duration}
                  </span>
                </button>

                {/* Lesson Details + Subtle Keyword Tags + Quiet Engaging Actions */}
                <div className="min-w-0 flex-1 flex flex-col justify-between gap-2.5">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-sky-300/80">
                      {video.subjectId} · {video.channelName}
                    </p>
                    <h3 className="font-heading font-bold text-sm text-white leading-snug line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">{video.description}</p>
                  </div>

                  {/* Clickable Subtle Keyword Chips */}
                  <div className="flex flex-wrap gap-1">
                    {video.keywords.slice(0, 3).map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => setKeywordFilter(kw)}
                        className="px-2 py-0.5 rounded-md bg-slate-800/70 hover:bg-slate-800 text-[10px] font-medium text-slate-300 hover:text-amber-200 cursor-pointer transition-colors"
                      >
                        #{kw}
                      </button>
                    ))}
                  </div>

                  {/* Subtle, Clean Links Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/60 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setTvPlayerVideo(video)}
                      className="text-sky-300 hover:text-sky-200 inline-flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      TV Mirror
                    </button>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white inline-flex items-center gap-1 hover:underline"
                    >
                      YouTube App <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleShareOrCopyVideo(video)}
                      className={`inline-flex items-center gap-1 cursor-pointer hover:underline ${
                        isCopied ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied for TV
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          Share / Cast
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedVideos.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 text-center space-y-2">
            <p className="text-sm font-bold text-white">
              No lessons matched &ldquo;{keywordFilter}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => {
                setKeywordFilter('');
                setSelectedSubject('All');
              }}
              className="px-4 py-1.5 rounded-lg bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold cursor-pointer"
            >
              Reset Video Filters
            </button>
          </div>
        )}
      </div>

      {/* Subtle Trusted UK Primary Channels Strip */}
      <div className="bg-[#0F172A]/65 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="font-heading font-bold text-sm text-slate-200">
          Trusted UK Primary Educational Channels
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {EDUCATION_CHANNELS.map((ch) => (
            <a
              key={ch.name}
              href={ch.url}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-colors space-y-1 block"
            >
              <p className="font-bold text-xs text-white flex items-center justify-between gap-2">
                <span>
                  {ch.logo} {ch.name}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
              </p>
              <p className="text-[11px] text-sky-400/80 font-mono">{ch.handle}</p>
            </a>
          ))}
        </div>
      </div>

      {/* EXTERNAL TV PLAYER & IPHONE SCREEN MIRRORING / AIRPLAY MODAL */}
      {tvPlayerVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="External TV & Screen Mirroring Classroom Player"
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => setTvPlayerVideo(null)}
        >
          <div
            ref={playerContainerRef}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#0B1120] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Top Bar */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0F172A]">
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" />
                  TV &amp; iPhone Screen Mirroring Player · {tvPlayerVideo.subjectId}
                </p>
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-white truncate">
                  {tvPlayerVideo.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleEnterFullscreen}
                  title="Fullscreen for TV & Mirroring"
                  className="min-h-[36px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen TV</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTvPlayerVideo(null)}
                  aria-label="Close TV Player"
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clean 16:9 Playsinline Embed (Supports native iOS AirPlay & Screen Mirroring) */}
            <div className="aspect-video w-full bg-black">
              <iframe
                key={tvPlayerVideo.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${tvPlayerVideo.youtubeId}?autoplay=1&playsinline=1&rel=0`}
                title={tvPlayerVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Bottom AirPlay / External YouTube App / Next Controls */}
            <div className="px-5 py-4 bg-[#0F172A] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong className="text-sky-300">iPhone / iPad TV Mirroring:</strong> Swipe down Control Centre → tap <strong>Screen Mirroring</strong> (or open directly in YouTube App to Cast).
              </p>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {currentTvIndex > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setTvPlayerVideo(filteredAndSortedVideos[currentTvIndex - 1])
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Prev
                  </button>
                )}
                {currentTvIndex >= 0 &&
                  currentTvIndex < filteredAndSortedVideos.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setTvPlayerVideo(filteredAndSortedVideos[currentTvIndex + 1])
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                <a
                  href={`https://www.youtube.com/watch?v=${tvPlayerVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  Open YouTube App <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleShareOrCopyVideo(tvPlayerVideo)}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedVideoId === tvPlayerVideo.id ? 'Copied!' : 'Cast / Share'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
