import React, { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, Sparkles, Volume2 } from 'lucide-react';
import { Topic } from '../types';
import { getPlayActivityForTopic } from '../data/interactiveActivities';
import { speakText } from '../utils/speech';

interface PlayActivityStageProps {
  topic: Topic;
  isAlreadyPlayed: boolean;
  onCompletePlay: () => void;
  onContinueToQuiz: () => void;
}

export const PlayActivityStage: React.FC<PlayActivityStageProps> = ({
  topic,
  isAlreadyPlayed,
  onCompletePlay,
  onContinueToQuiz,
}) => {
  const activity = useMemo(() => getPlayActivityForTopic(topic), [topic]);

  // Sorting state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedMap, setPlacedMap] = useState<Record<string, string>>({});
  const [sortFeedback, setSortFeedback] = useState<string | null>(null);

  // Sequence state
  const [clickedSeqIds, setClickedSeqIds] = useState<string[]>([]);
  const [seqFeedback, setSeqFeedback] = useState<string | null>(null);

  // Number puzzle state
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [puzzleAnswered, setPuzzleAnswered] = useState<number | null>(null);
  const [puzzleSolvedCount, setPuzzleSolvedCount] = useState(0);

  const [completedLocal, setCompletedLocal] = useState(isAlreadyPlayed);

  const shuffledSteps = useMemo(() => {
    if (activity.kind !== 'sequence') return [];
    // Deterministic shuffle so steps aren't always in order 1..N
    return [...activity.steps].sort((a, b) => a.label.localeCompare(b.label));
  }, [activity]);

  const markStageDone = () => {
    if (!completedLocal) {
      setCompletedLocal(true);
      onCompletePlay();
    }
  };

  const resetActivity = () => {
    setSelectedItemId(null);
    setPlacedMap({});
    setSortFeedback(null);
    setClickedSeqIds([]);
    setSeqFeedback(null);
    setPuzzleIdx(0);
    setPuzzleAnswered(null);
    setPuzzleSolvedCount(0);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-emerald-700">
            Stage 2 · Play &amp; Practise
          </span>
          <h3 className="font-heading font-extrabold text-xl text-slate-900 mt-0.5">
            {activity.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{activity.instructions}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => speakText(`${activity.title}. ${activity.instructions}`)}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Read instructions aloud"
          >
            <Volume2 className="w-4 h-4 text-sky-700" />
            Read aloud
          </button>
          <button
            type="button"
            onClick={resetActivity}
            className="min-h-[42px] px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* SORTING ACTIVITY */}
      {activity.kind === 'sorting' && (
        <div className="space-y-6">
          {/* Unsorted items */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600">
              1. Tap a card below, then tap the matching group box:
            </p>
            <div className="flex flex-wrap gap-2.5">
              {activity.items.map((item) => {
                const isPlacedCorrectly = placedMap[item.id] === item.bucketId;
                const isSelected = selectedItemId === item.id;
                if (isPlacedCorrectly) return null;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setSortFeedback(`Selected "${item.label}". Now tap a group box below!`);
                    }}
                    className={`min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-700 shadow-sm scale-[1.02]'
                        : 'bg-slate-50 text-slate-800 border-slate-300 hover:border-sky-400 hover:bg-sky-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              {Object.keys(placedMap).length === activity.items.length && (
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm py-2">
                  <CheckCircle2 className="w-5 h-5" />
                  All cards sorted! Great practising!
                </div>
              )}
            </div>
          </div>

          {/* Buckets */}
          <div className={`grid grid-cols-1 ${activity.buckets.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
            {activity.buckets.map((bucket) => {
              const itemsInBucket = activity.items.filter(
                (it) => placedMap[it.id] === bucket.id
              );
              return (
                <button
                  key={bucket.id}
                  type="button"
                  onClick={() => {
                    if (!selectedItemId) {
                      setSortFeedback('First tap one of the word/item cards above!');
                      return;
                    }
                    const chosenItem = activity.items.find((i) => i.id === selectedItemId);
                    if (!chosenItem) return;
                    if (chosenItem.bucketId === bucket.id) {
                      const nextMap = { ...placedMap, [chosenItem.id]: bucket.id };
                      setPlacedMap(nextMap);
                      setSelectedItemId(null);
                      setSortFeedback(`Nice! "${chosenItem.label}" belongs in ${bucket.label}.`);
                      if (Object.keys(nextMap).length === activity.items.length) {
                        markStageDone();
                      }
                    } else {
                      setSortFeedback(`Good try! Think again — does "${chosenItem.label}" fit in ${bucket.label}? Try another group!`);
                    }
                  }}
                  className={`min-h-[120px] p-4 rounded-2xl border-2 border-dashed text-left flex flex-col justify-between transition-all cursor-pointer hover:shadow-sm ${bucket.colorClass}`}
                >
                  <span className="font-heading font-bold text-sm">{bucket.label}</span>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {itemsInBucket.length === 0 ? (
                      <span className="text-xs opacity-60">Tap here to place card</span>
                    ) : (
                      itemsInBucket.map((it) => (
                        <span
                          key={it.id}
                          className="px-2.5 py-1 bg-white rounded-lg text-xs font-bold border border-slate-200 text-slate-800"
                        >
                          ✓ {it.label}
                        </span>
                      ))
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {sortFeedback && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sm font-medium text-sky-900">
              {sortFeedback}
            </div>
          )}
        </div>
      )}

      {/* SEQUENCE ACTIVITY */}
      {activity.kind === 'sequence' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shuffledSteps.map((stepItem) => {
              const placedPosition = clickedSeqIds.indexOf(stepItem.id);
              const isDone = placedPosition !== -1;
              return (
                <button
                  key={stepItem.id}
                  type="button"
                  disabled={isDone}
                  onClick={() => {
                    const expectedOrder = clickedSeqIds.length + 1;
                    if (stepItem.order === expectedOrder) {
                      const next = [...clickedSeqIds, stepItem.id];
                      setClickedSeqIds(next);
                      setSeqFeedback(`Spot on! Step ${expectedOrder}: "${stepItem.label}"`);
                      if (next.length === activity.steps.length) {
                        markStageDone();
                      }
                    } else {
                      setSeqFeedback(`Almost! Look for Step ${expectedOrder} first. You can do it!`);
                    }
                  }}
                  className={`min-h-[52px] p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-800 cursor-pointer'
                  }`}
                >
                  <span>{stepItem.label}</span>
                  {isDone && (
                    <span className="text-xs font-mono font-bold text-emerald-700 shrink-0">
                      Step {placedPosition + 1} ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {seqFeedback && (
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sm font-medium text-sky-900">
              {seqFeedback}
            </div>
          )}
        </div>
      )}

      {/* NUMBER PUZZLE ACTIVITY */}
      {activity.kind === 'number-puzzle' && (() => {
        const currentPuzzle = activity.puzzles[puzzleIdx];
        const allSolved = puzzleSolvedCount >= activity.puzzles.length;

        if (allSolved) {
          return (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-heading font-bold text-lg text-emerald-900">
                All {activity.puzzles.length} puzzles solved!
              </h4>
              <p className="text-sm text-emerald-800">
                You are warmed up and ready to challenge the Stage 3 Quiz!
              </p>
            </div>
          );
        }

        const isCorrectChoice = puzzleAnswered === currentPuzzle.answerIndex;

        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Puzzle {puzzleIdx + 1} of {activity.puzzles.length}</span>
              <span className="tabular-nums">Solved: {puzzleSolvedCount}/{activity.puzzles.length}</span>
            </div>

            <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <p className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tabular-nums">
                {currentPuzzle.prompt}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentPuzzle.choices.map((choice, cIdx) => {
                const picked = puzzleAnswered === cIdx;
                const correct = cIdx === currentPuzzle.answerIndex;
                let btnStyle = 'bg-white border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-900';
                if (puzzleAnswered !== null) {
                  if (correct) btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900';
                  else if (picked) btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                }
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => {
                      setPuzzleAnswered(cIdx);
                      if (correct && puzzleAnswered !== currentPuzzle.answerIndex) {
                        const nextCount = puzzleSolvedCount + 1;
                        setPuzzleSolvedCount(nextCount);
                        if (nextCount >= activity.puzzles.length) {
                          markStageDone();
                        }
                      }
                    }}
                    className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 font-heading font-bold text-lg tabular-nums transition-all cursor-pointer ${btnStyle}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {puzzleAnswered !== null && (
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isCorrectChoice ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-start gap-2 text-sm font-medium">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {isCorrectChoice
                      ? `Brilliant! ${currentPuzzle.hint}`
                      : `Good try! Hint: ${currentPuzzle.hint}`}
                  </span>
                </div>
                {isCorrectChoice && puzzleIdx + 1 < activity.puzzles.length && (
                  <button
                    type="button"
                    onClick={() => {
                      setPuzzleIdx((i) => i + 1);
                      setPuzzleAnswered(null);
                    }}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Next puzzle →
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* Stage Footer Action */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          {completedLocal
            ? '✓ Play done! +2 Stars'
            : 'Finish above or jump to quiz anytime!'}
        </span>
        <button
          type="button"
          onClick={() => {
            markStageDone();
            onContinueToQuiz();
          }}
          className="min-h-[48px] px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 border-2 border-indigo-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl transition-transform hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          Quiz Time! →
        </button>
      </div>
    </div>
  );
};
