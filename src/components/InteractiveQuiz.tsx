import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, Sparkles, Star, Volume2, XCircle } from 'lucide-react';
import { Topic, Subject } from '../types';
import { QuizVisualIllustration } from './WorldIllustrations';
import { speakText } from '../utils/speech';

interface InteractiveQuizProps {
  topic: Topic;
  subject: Subject;
  onClose: () => void;
  onQuizComplete?: (score: number, total: number, starsEarned: number) => void;
  onOpenCertificate?: () => void;
  onExpressionChange?: (expr: 'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited', msg: string) => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  topic,
  subject,
  onClose,
  onQuizComplete,
  onOpenCertificate,
  onExpressionChange,
}) => {
  const quizQuestions = topic.quiz || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  if (quizQuestions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-sky-600 mx-auto" />
        <h4 className="font-heading font-bold text-slate-900 text-lg">Challenge complete!</h4>
        <p className="text-sm text-slate-600">
          You reviewed all objectives for {topic.title}. Claim your effort stars!
        </p>
        <button
          type="button"
          onClick={() => {
            onQuizComplete?.(1, 1, 3);
            onClose();
          }}
          className="min-h-[44px] px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl cursor-pointer"
        >
          Claim 3 Effort Stars
        </button>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentIdx];

  const inferVisualHint = (): 'plants' | 'space' | 'numbers' | 'shapes' | 'story' | 'globe' | 'history' => {
    if (currentQuestion.visualHint) return currentQuestion.visualHint;
    const lower = `${topic.title} ${currentQuestion.question}`.toLowerCase();
    if (lower.includes('plant') || lower.includes('seed') || lower.includes('grow')) return 'plants';
    if (lower.includes('space') || lower.includes('planet') || lower.includes('earth')) return 'space';
    if (topic.subjectId === 'Maths') return 'numbers';
    if (topic.subjectId === 'English') return 'story';
    if (topic.subjectId === 'Geography') return 'globe';
    if (topic.subjectId === 'History') return 'history';
    return 'plants';
  };

  const handleAnswerClick = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedIdx(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      onExpressionChange?.(
        'excited',
        `Brilliant work! "${currentQuestion.options[optionIdx]}" is right. ${currentQuestion.explanation}`
      );
    } else {
      onExpressionChange?.(
        'thinking',
        `Great try! Every mistake helps our brain grow. The answer is "${currentQuestion.options[currentQuestion.correctAnswer]}". ${currentQuestion.explanation}`
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < quizQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
      onExpressionChange?.('thinking', 'Here comes the next challenge — take your time!');
    } else {
      // Reward effort & curiosity (always at least 3 stars for completing, +2 bonus for getting all right)
      const finalScore = score;
      const starsAwarded = finalScore === quizQuestions.length ? 5 : 3;
      setEarnedStars(starsAwarded);
      setQuizCompleted(true);
      onQuizComplete?.(finalScore, quizQuestions.length, starsAwarded);
      onExpressionChange?.(
        'sparkle',
        `Hooray! You completed the challenge and earned ${starsAwarded} Stars for your effort and curiosity!`
      );
    }
  };

  const progressPercent = Math.round(((currentIdx + (isAnswered ? 1 : 0)) / quizQuestions.length) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm relative">
      <AnimatePresence mode="wait">
        {!quizCompleted ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5 text-left"
          >
            {/* Header & Progress Bar */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span>Schoola mini challenge</span>
                  <span aria-hidden="true">·</span>
                  <span>{subject.label}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    Question {currentIdx + 1} of {quizQuestions.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 tabular-nums">
                    Score: {score}/{quizQuestions.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speakText(
                        `${currentQuestion.question}. Options: ${currentQuestion.options.join('. ')}`
                      )
                    }
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    aria-label="Read question aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                    Read aloud
                  </button>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Visual Illustration */}
            <QuizVisualIllustration hint={inferVisualHint()} />

            {/* Question Text */}
            <h4 className="font-heading font-extrabold text-slate-900 text-lg sm:text-xl leading-snug">
              {currentQuestion.question}
            </h4>

            {/* Large Touch-Friendly Answer Buttons (>= 48px) */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                let buttonClass =
                  'bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-900';
                let badgeClass = 'bg-white border-slate-300 text-slate-700';

                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) {
                    buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-950';
                    badgeClass = 'bg-emerald-600 border-emerald-700 text-white';
                  } else if (idx === selectedIdx) {
                    buttonClass = 'bg-rose-50 border-rose-400 text-rose-950';
                    badgeClass = 'bg-rose-600 border-rose-700 text-white';
                  } else {
                    buttonClass = 'bg-slate-50 border-slate-200 text-slate-500 opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleAnswerClick(idx)}
                    className={`w-full min-h-[54px] text-left p-4 rounded-2xl border-2 font-semibold text-sm sm:text-base flex items-center gap-3.5 transition-all cursor-pointer disabled:cursor-default ${buttonClass}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-extrabold shrink-0 ${badgeClass}`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isAnswered && idx === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && idx === selectedIdx && idx !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback & Explanation */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                  selectedIdx === currentQuestion.correctAnswer
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <p className="font-bold mb-1">
                  {selectedIdx === currentQuestion.correctAnswer
                    ? 'Brilliant! You got it right!'
                    : 'Nice try! Let’s learn why:'}
                </p>
                <p>{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Footer Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 border-b-4 text-slate-700 font-heading font-extrabold text-xs sm:text-sm rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Back
              </button>

              {isAnswered && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[46px] px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-2 border-orange-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {currentIdx + 1 === quizQuestions.length ? 'Collect Stars! →' : 'Next! →'}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto">
              <Award className="w-9 h-9 text-amber-600" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Amazing Effort!
              </h3>
              <p className="text-sm text-slate-600 tabular-nums">
                Score: <span className="font-extrabold text-slate-900">{score} / {quizQuestions.length}</span>
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-base tabular-nums">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              +{earnedStars} Stars!
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="min-h-[48px] px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
                >
                  Certificate
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] px-6 py-2.5 bg-sky-500 hover:bg-sky-600 border-2 border-sky-700 border-b-4 text-white font-heading font-extrabold text-sm rounded-2xl transition-transform hover:-translate-y-0.5 cursor-pointer"
              >
                Rewards! →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
