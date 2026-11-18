import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Play } from 'lucide-react';
import { CURATED_YOUTUBE_VIDEOS, YouTubeVideo } from '../data/youtubeVideos';
import { TOPICS } from '../data/curriculum';
import { Topic } from '../types';

interface FeaturedVideoLessonsPanelProps {
  subjectId?: string;
  topicId?: string;
  topicTitle?: string;
  onOpenTopic?: (topic: Topic) => void;
}

const CARD_GRADIENTS = [
  'from-[#1a1060] to-[#3b1d8a]',
  'from-[#2d0a4e] to-[#5b21b6]',
  'from-[#0c4a6e] to-[#0369a1]',
  'from-[#1e3a8a] to-[#2563eb]',
  'from-[#7c2d12] to-[#c2410c]',
  'from-[#14532d] to-[#15803d]',
];

export const FeaturedVideoLessonsPanel: React.FC<FeaturedVideoLessonsPanelProps> = ({
  subjectId,
  topicId,
  topicTitle,
  onOpenTopic,
}) => {
  const videos = useMemo(() => {
    if (!subjectId) {
      return CURATED_YOUTUBE_VIDEOS.slice(0, 6);
    }

    const queryWords = (topicTitle || '')
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    const subjectMatches = CURATED_YOUTUBE_VIDEOS.filter((v) => v.subjectId === subjectId).sort(
      (a, b) => {
        const aExact = topicId && a.topicIds?.includes(topicId) ? 100 : 0;
        const bExact = topicId && b.topicIds?.includes(topicId) ? 100 : 0;
        const aScore =
          aExact +
          queryWords.reduce(
            (acc, w) =>
              acc +
              (a.title.toLowerCase().includes(w) || a.keywords.some((k) => k.toLowerCase().includes(w))
                ? 5
                : 0),
            0
          );
        const bScore =
          bExact +
          queryWords.reduce(
            (acc, w) =>
              acc +
              (b.title.toLowerCase().includes(w) || b.keywords.some((k) => k.toLowerCase().includes(w))
                ? 5
                : 0),
            0
          );
        return bScore - aScore;
      }
    );

    if (subjectMatches.length >= 6) {
      return subjectMatches.slice(0, 6);
    }

    const filler = CURATED_YOUTUBE_VIDEOS.filter(
      (v) => v.subjectId !== subjectId
    ).slice(0, 6 - subjectMatches.length);

    return [...subjectMatches, ...filler];
  }, [subjectId, topicId, topicTitle]);

  const handleOpenMatchedTopic = (video: YouTubeVideo) => {
    if (!onOpenTopic) return;
    const foundById = video.topicIds?.length
      ? TOPICS.find((t) => video.topicIds!.includes(t.id))
      : undefined;
    const foundBySubj = TOPICS.find((t) => t.subjectId === video.subjectId) || TOPICS[0];
    onOpenTopic(foundById || foundBySubj);
  };

  return (
    <section
      aria-labelledby="study-featured-videos-heading"
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            id="study-featured-videos-heading"
            className="font-playful font-bold text-xl sm:text-2xl text-slate-900"
          >
            <span aria-hidden="true">🎬</span> Featured video lessons
            {subjectId ? ` · ${subjectId}` : ''}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Curated curriculum video links matched to what you are studying — opens in your external player or YouTube app.
          </p>
        </div>
        <a
          href="https://www.bbc.co.uk/teach"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs sm:text-sm font-playful font-bold text-sky-700 hover:underline whitespace-nowrap flex items-center gap-1"
        >
          BBC Teach <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((vid, idx) => (
          <motion.div
            key={vid.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <a
              href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-1 flex flex-col text-left"
            >
              <div
                className={`relative h-36 bg-gradient-to-br ${CARD_GRADIENTS[idx % CARD_GRADIENTS.length]} overflow-hidden`}
              >
                <img
                  src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                  </span>
                </div>
                <span className="absolute bottom-2 left-2 bg-slate-950/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md tabular-nums">
                  {vid.duration}
                </span>
                <span className="absolute bottom-2 right-2 bg-white/95 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                  {vid.subjectId} <ExternalLink className="w-2.5 h-2.5 text-sky-700" />
                </span>
              </div>
              <div className="p-4 space-y-1.5 flex-1">
                <p className="text-[11px] font-bold text-slate-500 line-clamp-1">
                  {vid.channelName} · External Video
                </p>
                <p className="font-playful font-bold text-sm text-slate-900 group-hover:text-sky-700 leading-snug line-clamp-2">
                  {vid.title}
                </p>
              </div>
            </a>

            {onOpenTopic && (
              <div className="px-4 pb-3.5 pt-0">
                <button
                  type="button"
                  onClick={() => handleOpenMatchedTopic(vid)}
                  className="w-full min-h-[36px] px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-playful font-bold text-xs cursor-pointer transition-colors"
                >
                  Open {vid.subjectId} Activity →
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
