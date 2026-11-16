import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RotateCw, Compass, BookOpen, Volume2, 
  Clock, Sun, Moon, Zap, Trophy, Play, Check, AlertCircle 
} from 'lucide-react';

// Play a magical synthesized chime sound using the Web Audio API
export function playChimeSound(type: 'bell' | 'spell' | 'success' | 'fail' | 'step') {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'bell') {
      // Classic metal school bell resonance
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime); // High high chime
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(554.37, ctx.currentTime); // Warm third
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.0);
      osc2.stop(ctx.currentTime + 2.0);
    } else if (type === 'spell') {
      // Mystical ascending wizard twinkle
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
      });
    } else if (type === 'success') {
      // Uplifting victory fanfare
      const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.5);
      });
    } else if (type === 'fail') {
      // Soft downward "bloop"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'step') {
      // Warm marimba-like step sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.warn('Web Audio API not supported or blocked:', e);
  }
}

// ────────────────────────────────────────────────────────
// 1. THE GEOGRAPHY SPINNING GLOBE TRIVIA WIDGET
// ────────────────────────────────────────────────────────
interface GlobeTriviaProps {
  onEarnStar: () => void;
  setFairyMessage: (msg: string) => void;
}

export function GlobeTrivia({ onEarnStar, setFairyMessage }: GlobeTriviaProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [trivia, setTrivia] = useState<{
    question: string;
    options: string[];
    answerIdx: number;
    fact: string;
  } | null>(null);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const triviaPool = [
    {
      question: "Which of these is the longest river in the United Kingdom?",
      options: ["River Thames", "River Severn", "River Trent", "River Clyde"],
      answerIdx: 1,
      fact: "The River Severn is the longest in the UK at 220 miles (354 km), flowing through both Wales and England!"
    },
    {
      question: "What is the highest mountain peak in the entire United Kingdom?",
      options: ["Snowdon (Yr Wyddfa)", "Ben Nevis", "Scafell Pike", "Slieve Donard"],
      answerIdx: 1,
      fact: "Ben Nevis in Scotland is the tallest mountain peak in the UK, standing proud at 1,345 metres tall!"
    },
    {
      question: "Which sea separates the islands of Great Britain and Ireland?",
      options: ["The North Sea", "The Irish Sea", "The English Channel", "The Celtic Sea"],
      answerIdx: 1,
      fact: "The Irish Sea separates Great Britain from Ireland and has been an active shipping route for thousands of years."
    },
    {
      question: "What is the capital city of Northern Ireland?",
      options: ["Belfast", "Dublin", "Cardiff", "Edinburgh"],
      answerIdx: 0,
      fact: "Belfast is the capital of Northern Ireland, famous for its historic shipyards where the Titanic was built."
    },
    {
      question: "Which landmark is a massive ancient stone circle found in Wiltshire, England?",
      options: ["The Giant's Causeway", "Stonehenge", "Hadrian's Wall", "Loch Ness"],
      answerIdx: 1,
      fact: "Stonehenge was built over 4,500 years ago during the late Neolithic period and aligns perfectly with the Solstice sun!"
    },
    {
      question: "Which national park is home to the largest and deepest natural lakes in England?",
      options: ["The Peak District", "The Lake District", "Dartmoor", "The Yorkshire Dales"],
      answerIdx: 1,
      fact: "The Lake District in Cumbria contains Wastwater, England's deepest lake, and Windermere, the largest natural lake."
    }
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTrivia(null);
    setSelectedOpt(null);
    setHasAnswered(false);
    playChimeSound('bell');

    // Simulate 3D rotation delay
    setTimeout(() => {
      const randomQ = triviaPool[Math.floor(Math.random() * triviaPool.length)];
      setTrivia(randomQ);
      setIsSpinning(false);
      setFairyMessage("The Speaking Globe has landed on a magical geography scroll! Read the map query and make your guess.");
    }, 1200);
  };

  const handleAnswer = (idx: number) => {
    if (hasAnswered || !trivia) return;
    setSelectedOpt(idx);
    setHasAnswered(true);

    if (idx === trivia.answerIdx) {
      playChimeSound('success');
      onEarnStar();
      setFairyMessage("Spot on! The Speaking Globe spins in delight and grants you a golden star coin! 🌟");
    } else {
      playChimeSound('fail');
      setFairyMessage("Oh, close! The Speaking Globe shines a blue guiding light. Study the fun fact to learn the answer!");
    }
  };

  return (
    <div className="bg-white border-2 border-sky-300 border-b-4 rounded-3xl p-5 shadow-md text-slate-900 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-sky-100 border border-sky-200 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-sky-700">
        <Compass className="w-3 h-3 animate-spin" /> Geography Globe
      </div>

      <h3 className="font-heading font-extrabold text-sm text-sky-900 mb-3 flex items-center gap-1.5 self-start">
        <span>🌍</span> The Speaking Globe
      </h3>

      {/* Illustrated Spinning Earth Globe */}
      <div className="relative w-32 h-32 my-3 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-sky-100/70 rounded-full border-2 border-dashed border-sky-300 animate-spin"
          style={{ animationDuration: '30s' }}
        />
        <motion.button
          type="button"
          animate={isSpinning ? { rotate: 360 * 3 } : { y: [0, -4, 0] }}
          transition={
            isSpinning
              ? { duration: 1.2, ease: 'easeInOut' }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          onClick={handleSpin}
          aria-label="Spin the Speaking Globe"
          className="relative w-24 h-24 rounded-full border-3 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform overflow-hidden"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <circle cx="50" cy="50" r="50" fill="#0284C7" />
            <circle cx="38" cy="34" r="32" fill="#38BDF8" opacity="0.45" />
            <path d="M22 28 Q35 18 46 28 Q50 42 36 48 Q24 44 22 28 Z" fill="#34D399" />
            <path d="M58 22 Q76 24 80 42 Q72 54 58 46 Q52 34 58 22 Z" fill="#10B981" />
            <path d="M36 58 Q52 54 62 68 Q56 82 38 78 Q30 70 36 58 Z" fill="#34D399" />
            <ellipse cx="34" cy="24" rx="10" ry="4" fill="#FFFFFF" opacity="0.65" />
            <ellipse cx="64" cy="64" rx="11" ry="4" fill="#FFFFFF" opacity="0.55" />
          </svg>
        </motion.button>
        {isSpinning && (
          <div className="absolute inset-0 bg-sky-500/20 rounded-full flex items-center justify-center text-[10px] font-black tracking-widest text-sky-900 bg-white/75 px-2">
            SPINNING...
          </div>
        )}
      </div>

      {!trivia ? (
        <button
          type="button"
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full min-h-[42px] py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 border-b-4 border-blue-800 text-white font-heading font-extrabold text-xs rounded-2xl shadow-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <RotateCw className="w-3.5 h-3.5" />
          Spin the Globe
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-left bg-sky-50 border border-sky-200 rounded-2xl p-3.5"
        >
          <p className="text-xs font-extrabold text-slate-900 mb-2.5 leading-snug">
            {trivia.question}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {trivia.options.map((opt, idx) => {
              let btnClass =
                'border-sky-200 bg-white text-slate-800 hover:bg-sky-100 hover:border-sky-400';
              if (hasAnswered) {
                if (idx === trivia.answerIdx) {
                  btnClass = 'border-emerald-500 bg-emerald-100 text-emerald-900';
                } else if (idx === selectedOpt) {
                  btnClass = 'border-rose-400 bg-rose-100 text-rose-900';
                } else {
                  btnClass = 'border-slate-200 bg-white/60 text-slate-400';
                }
              }
              return (
                <button
                  type="button"
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={`px-2.5 py-2 border-2 rounded-xl text-[11px] font-bold text-left transition-all truncate cursor-pointer ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 pt-3 border-t border-sky-200 text-[11px] text-slate-700 leading-relaxed font-medium"
            >
              <strong>💡 Scroll Fact:</strong> {trivia.fact}
              <button
                type="button"
                onClick={handleSpin}
                className="mt-2 text-sky-700 hover:underline font-extrabold block cursor-pointer"
              >
                Spin again ➔
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 2. THE MAGICAL ABACUS WIDGET
// ────────────────────────────────────────────────────────
interface AbacusMathProps {
  onEarnStar: () => void;
  setFairyMessage: (msg: string) => void;
}

export function AbacusMath({ onEarnStar, setFairyMessage }: AbacusMathProps) {
  // We represent beads on 3 brass rods. Each rod can have beads slid left or right (0 to 10)
  const [beads, setBeads] = useState<number[]>([3, 5, 2]); // beads on left for rods 1, 2, 3
  const [currentChallenge, setCurrentChallenge] = useState<{
    prompt: string;
    targetValue: number;
    rodIndex: number;
    completed: boolean;
  } | null>(null);

  const generateChallenge = () => {
    const rodIdx = Math.floor(Math.random() * 3);
    const num1 = Math.floor(Math.random() * 6) + 1;
    const num2 = Math.floor(Math.random() * 4);
    const sum = num1 + num2;
    
    setCurrentChallenge({
      prompt: `Slide beads on Row ${rodIdx + 1} to equal ${num1} + ${num2}`,
      targetValue: sum,
      rodIndex: rodIdx,
      completed: false
    });
    setFairyMessage(`An abacus math puzzle appears! Slide the wooden beads on the copper rod to match the sum.`);
    playChimeSound('step');
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const slideBead = (rodIdx: number, val: number) => {
    const newBeads = [...beads];
    newBeads[rodIdx] = val;
    setBeads(newBeads);
    playChimeSound('step');

    if (currentChallenge && rodIdx === currentChallenge.rodIndex && val === currentChallenge.targetValue && !currentChallenge.completed) {
      setCurrentChallenge(prev => prev ? { ...prev, completed: true } : null);
      playChimeSound('success');
      onEarnStar();
      setFairyMessage(`Fantastic arithmetic! The abacus rings in gold and awards you a star coin! 🌟`);
    }
  };

  return (
    <div className="bg-white border-2 border-amber-300 border-b-4 rounded-3xl p-5 shadow-md text-slate-900 relative overflow-hidden">
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-amber-800">
        🧮 Math Beads
      </div>

      <h3 className="font-heading font-extrabold text-sm text-amber-950 mb-3 flex items-center gap-1.5 text-left">
        <span>🧮</span> Magical Math Abacus
      </h3>

      {/* Interactive Abacus display board */}
      <div className="bg-amber-100 border-4 border-amber-700 rounded-2xl p-4 my-3 flex flex-col gap-4 shadow-inner relative">
        {/* Brass side rails */}
        <div className="absolute left-1.5 top-0 bottom-0 w-1.5 bg-amber-600 rounded-full" />
        <div className="absolute right-1.5 top-0 bottom-0 w-1.5 bg-amber-600 rounded-full" />

        {[0, 1, 2].map((rodIdx) => (
          <div key={rodIdx} className="relative h-7 flex items-center justify-between px-3">
            {/* The metal horizontal wire bar */}
            <div className="absolute inset-x-3 h-1.5 bg-amber-800/40 rounded-full" />

            {/* Clickable zones to position beads */}
            <div className="absolute inset-x-3 h-full flex">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => slideBead(rodIdx, num)}
                  className="flex-1 h-full cursor-pointer z-20 outline-hidden opacity-0"
                  aria-label={`Slide ${num} beads on row ${rodIdx + 1}`}
                  title={`Slide ${num} beads`}
                />
              ))}
            </div>

            {/* Render Sliding Beads */}
            <div className="w-full flex justify-between items-center relative h-full z-10 pointer-events-none">
              {/* Left group of beads */}
              <div className="flex gap-0.5">
                {Array.from({ length: beads[rodIdx] }).map((_, bIdx) => (
                  <motion.div
                    layout
                    key={`left-${bIdx}`}
                    className="w-3.5 h-6 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 border border-rose-700 shadow-sm"
                  />
                ))}
              </div>

              {/* Right group of beads */}
              <div className="flex gap-0.5">
                {Array.from({ length: 10 - beads[rodIdx] }).map((_, bIdx) => (
                  <motion.div
                    layout
                    key={`right-${bIdx}`}
                    className="w-3.5 h-6 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 border border-sky-700 shadow-sm"
                  />
                ))}
              </div>
            </div>

            {/* Row Number Badge */}
            <div className="absolute -left-1 bg-amber-800 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              R{rodIdx + 1}
            </div>
          </div>
        ))}
      </div>

      {currentChallenge && (
        <div className="text-left mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase">Sum Goal:</span>
            {currentChallenge.completed ? (
              <span className="text-[9px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="w-2.5 h-2.5" /> SUCCESS
              </span>
            ) : (
              <span className="text-[9px] bg-amber-200/70 text-amber-900 font-black px-2 py-0.5 rounded-full">
                ACTIVE Row {currentChallenge.rodIndex + 1}
              </span>
            )}
          </div>
          <p className="text-xs font-extrabold text-slate-900">
            {currentChallenge.prompt}
          </p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[11px] text-slate-600 font-semibold">
              Current Beads: <strong className="text-amber-900 text-xs">{beads[currentChallenge.rodIndex]}</strong> / {currentChallenge.targetValue}
            </span>
            <button
              type="button"
              onClick={generateChallenge}
              className="text-[11px] font-extrabold text-amber-700 hover:underline cursor-pointer"
            >
              New Puzzle ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 3. THE ANCIENT SPELLBOOK (SPELLING WIZARD)
// ────────────────────────────────────────────────────────
interface SpellbookProps {
  onEarnStar: () => void;
  setFairyMessage: (msg: string) => void;
}

export function AncientSpellbook({ onEarnStar, setFairyMessage }: SpellbookProps) {
  const [challenge, setChallenge] = useState<{
    word: string;
    jumbled: string[];
    hint: string;
    currentGuess: string[];
  } | null>(null);
  const [hasSolved, setHasSolved] = useState(false);

  const wordPool = [
    { word: "SCHOOL", hint: "A building where learning magic happens!" },
    { word: "SCIENCE", hint: "Exploring stars, ecosystems, and gravity." },
    { word: "SPELL", hint: "Arranging letters beautifully to form words." },
    { word: "FRIEND", hint: "Someone who walks down the corridor with you." },
    { word: "WEATHER", hint: "The wind, rain, and bright sun outside." },
    { word: "HISTORY", hint: "The scrolls of great kings, queens, and castles." },
    { word: "GEOGRAPHY", hint: "The study of maps, rivers, and mountains!" },
    { word: "CREATIVE", hint: "Thinking outside the wooden cabinet." }
  ];

  const generateSpell = () => {
    const item = wordPool[Math.floor(Math.random() * wordPool.length)];
    const chars = item.word.split('');
    // Jumble the letters
    const jumbled = [...chars].sort(() => Math.random() - 0.5);

    setChallenge({
      word: item.word,
      jumbled,
      hint: item.hint,
      currentGuess: []
    });
    setHasSolved(false);
    setFairyMessage("Open the Ancient Spellbook! Solve the word puzzle by clicking letters in the correct spelling sequence.");
    playChimeSound('spell');
  };

  useEffect(() => {
    generateSpell();
  }, []);

  const handleLetterClick = (letter: string, index: number) => {
    if (!challenge || hasSolved) return;

    // Check if letter is the NEXT correct character
    const targetChar = challenge.word[challenge.currentGuess.length];
    if (letter === targetChar) {
      const newGuess = [...challenge.currentGuess, letter];
      setChallenge({ ...challenge, currentGuess: newGuess });
      playChimeSound('step');

      if (newGuess.join('') === challenge.word) {
        setHasSolved(true);
        playChimeSound('success');
        onEarnStar();
        setFairyMessage(`Magnificent spelling spell! "${challenge.word}" is correctly written in the spellbook! Here is a star! 🌟`);
      }
    } else {
      playChimeSound('fail');
      setFairyMessage(`Incorrect rune sequence. Try starting with "${challenge.word[0]}" or look closely at the letters!`);
    }
  };

  const handleReset = () => {
    if (!challenge) return;
    setChallenge({ ...challenge, currentGuess: [] });
    playChimeSound('spell');
  };

  return (
    <div className="bg-white border-2 border-violet-300 border-b-4 rounded-3xl p-5 shadow-md text-slate-900 relative overflow-hidden">
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-100 border border-violet-200 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-violet-700">
        📖 Spell Book
      </div>

      <h3 className="font-heading font-extrabold text-sm text-violet-950 mb-3 flex items-center gap-1.5 text-left">
        <span>📖</span> Ancient Spellbook
      </h3>

      {challenge && (
        <div className="flex flex-col gap-4">
          {/* Scroll book background */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-400 text-slate-800 rounded-2xl p-4 shadow-sm flex flex-col items-center relative">
            <p className="text-[10px] uppercase font-black tracking-widest text-amber-800 mb-1.5">
              Spelling Runes Challenge
            </p>

            <span className="text-xs italic text-slate-700 mb-3.5 font-bold text-center leading-relaxed">
              &ldquo;{challenge.hint}&rdquo;
            </span>

            {/* Render Empty Blocks for word */}
            <div className="flex gap-1.5 justify-center mb-3 flex-wrap">
              {challenge.word.split('').map((_char, idx) => {
                const filled = challenge.currentGuess[idx];
                return (
                  <div
                    key={idx}
                    className={`w-7 h-9 rounded-lg border-2 flex items-center justify-center font-black text-sm shadow-inner ${
                      filled
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                        : 'border-amber-300 bg-white text-transparent'
                    }`}
                  >
                    {filled || '_'}
                  </div>
                );
              })}
            </div>

            {hasSolved && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-emerald-100 border border-emerald-300 rounded-full px-4 py-1 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
              >
                🔮 SPELL CAST SUCCESSFULLY!
              </motion.div>
            )}
          </div>

          {/* Letter Choice Buttons */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {challenge.jumbled.map((letter, idx) => {
                const targetUses = challenge.word.split('').filter((c) => c === letter).length;
                const guessUses = challenge.currentGuess.filter((c) => c === letter).length;
                const isFullyUsed = guessUses >= targetUses;

                return (
                  <button
                    type="button"
                    key={idx}
                    disabled={isFullyUsed || hasSolved}
                    onClick={() => handleLetterClick(letter, idx)}
                    className={`w-9 h-9 rounded-xl border-2 border-b-4 font-heading font-extrabold text-xs transition-all cursor-pointer ${
                      isFullyUsed
                        ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-50 cursor-default'
                        : 'border-violet-300 bg-violet-100 text-violet-900 hover:bg-violet-200 active:translate-y-0.5'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 justify-between">
              <button
                type="button"
                onClick={handleReset}
                disabled={hasSolved}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-extrabold uppercase transition-colors cursor-pointer"
              >
                Clear Spell
              </button>
              <button
                type="button"
                onClick={generateSpell}
                className="px-3.5 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 border-b-2 border-indigo-800 text-white rounded-xl text-[11px] font-extrabold uppercase shadow-sm hover:opacity-95 cursor-pointer"
              >
                Next Spell ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 4. STEPPING STONES MEMORY PATH (FLOOR PATH MINI-GAME)
// ────────────────────────────────────────────────────────
interface PatternPathProps {
  onEarnStar: () => void;
  setFairyMessage: (msg: string) => void;
}

export function PatternPath({ onEarnStar, setFairyMessage }: PatternPathProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activeStone, setActiveStone] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'player' | 'win' | 'fail'>('idle');

  const startNewGame = () => {
    setIsPlaying(true);
    // Generate a sequence of 4 stepping stones (indices 0, 1, 2, 3)
    const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setPlayerIndex(0);
    setGameState('showing');
    setFairyMessage("Watch the glowing path stones closely! Memorise the magical flash pattern, then tap them in order.");
    
    // Play the sequence with visual delays
    let delay = 600;
    newSeq.forEach((stoneIdx, idx) => {
      setTimeout(() => {
        setActiveStone(stoneIdx);
        playChimeSound('step');
        setTimeout(() => setActiveStone(null), 300);
      }, delay);
      delay += 600;
    });

    setTimeout(() => {
      setGameState('player');
      setFairyMessage("Your turn! Tap the glowing stepping stones in the correct sequence.");
    }, delay);
  };

  const handleStoneClick = (idx: number) => {
    if (gameState !== 'player') return;
    setActiveStone(idx);
    playChimeSound('step');
    setTimeout(() => setActiveStone(null), 250);

    // Verify player step
    if (idx === sequence[playerIndex]) {
      const nextIdx = playerIndex + 1;
      setPlayerIndex(nextIdx);

      if (nextIdx === sequence.length) {
        setGameState('win');
        playChimeSound('success');
        onEarnStar();
        setFairyMessage("Astonishing! You traversed the magical glowing floor stones flawlessly and earned a star! 🌟");
      }
    } else {
      setGameState('fail');
      playChimeSound('fail');
      setFairyMessage("Oh! The pathway flickers in blue fog. Try starting a fresh memory sequence!");
    }
  };

  return (
    <div className="bg-white border-2 border-emerald-300 border-b-4 rounded-3xl p-5 shadow-md text-slate-900 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-emerald-700">
        ✨ Floor Path
      </div>

      <h3 className="font-heading font-extrabold text-sm text-emerald-950 mb-3 flex items-center gap-1.5 self-start">
        <span>✨</span> Winding Pathway Game
      </h3>

      {/* Render the four glowing stepping stones layout */}
      <div className="grid grid-cols-2 gap-3 w-44 my-4">
        {[0, 1, 2, 3].map((stoneIdx) => {
          const isGlowing = activeStone === stoneIdx;
          const colors = [
            'bg-rose-500 shadow-rose-300 text-white border-rose-700',
            'bg-sky-500 shadow-sky-300 text-white border-sky-700',
            'bg-emerald-500 shadow-emerald-300 text-white border-emerald-700',
            'bg-amber-400 shadow-amber-300 text-amber-950 border-amber-600'
          ];
          return (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              key={stoneIdx}
              disabled={gameState !== 'player'}
              onClick={() => handleStoneClick(stoneIdx)}
              className={`h-16 rounded-2xl border-2 border-b-4 flex items-center justify-center text-xl font-bold cursor-pointer transition-all ${
                isGlowing
                  ? `${colors[stoneIdx]} scale-105 ring-4 ring-sky-200 shadow-lg`
                  : 'bg-sky-50 border-sky-200 text-sky-400 hover:bg-sky-100 hover:text-amber-500'
              }`}
            >
              ⭐
            </motion.button>
          );
        })}
      </div>

      {gameState === 'idle' && (
        <button
          type="button"
          onClick={startNewGame}
          className="w-full min-h-[42px] py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-b-4 border-teal-800 text-white font-heading font-extrabold text-xs rounded-2xl shadow-sm transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" /> Start Path Challenge
        </button>
      )}

      {gameState === 'showing' && (
        <div className="text-xs text-amber-700 font-black animate-pulse uppercase tracking-wider py-2">
          🔮 Memorising Path...
        </div>
      )}

      {gameState === 'player' && (
        <div className="text-xs text-sky-700 font-black uppercase tracking-wider py-2">
          👉 Your Turn: {playerIndex} / {sequence.length}
        </div>
      )}

      {(gameState === 'win' || gameState === 'fail') && (
        <div className="w-full flex flex-col gap-2 items-center">
          <span className={`text-[11px] font-black uppercase tracking-widest ${gameState === 'win' ? 'text-emerald-700' : 'text-rose-600'}`}>
            {gameState === 'win' ? '✓ Pathway Traversed!' : '✗ Path Flickered!'}
          </span>
          <button
            type="button"
            onClick={startNewGame}
            className="w-full min-h-[40px] py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold text-xs rounded-2xl cursor-pointer transition-all"
          >
            Play Again ➔
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 5. CORRIDOR BELL & VINTAGE LONDON CLOCK
// ────────────────────────────────────────────────────────
interface VintageClockAndBellProps {
  onEarnStar: () => void;
  setFairyMessage: (msg: string) => void;
}

export function VintageClockAndBell({ onEarnStar, setFairyMessage }: VintageClockAndBellProps) {
  const [time, setTime] = useState(new Date());
  const [bellClicks, setBellClicks] = useState(0);
  const [isChiming, setIsChiming] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const ringBell = () => {
    setIsChiming(true);
    playChimeSound('bell');
    setBellClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        onEarnStar();
        setFairyMessage("Magnificent! You rang the corridor school bell 5 times! The Headteacher grants you a gold star coin! 🌟");
        return 0; // reset
      } else {
        setFairyMessage(`*DONG! DONG!* You chime the ancient corridor school bell! Chime it ${5 - next} more times for a star!`);
        return next;
      }
    });

    setTimeout(() => setIsChiming(false), 800);
  };

  // Format with UK style / leading zeros
  const formattedTime = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="bg-white border-2 border-indigo-300 border-b-4 rounded-3xl p-5 shadow-md text-slate-900 relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase text-indigo-700">
        🕒 Live Chime
      </div>

      <h3 className="font-heading font-extrabold text-sm text-indigo-950 mb-3 flex items-center gap-1.5 self-start">
        <span>🕒</span> Corridor Clock &amp; Bell
      </h3>

      <div className="flex flex-col items-center gap-4 my-2">
        {/* Retro grandfather wall clock casing */}
        <div className="w-36 h-14 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-xl border-2 border-amber-800 shadow-md flex items-center justify-center p-2 relative">
          <div className="inset-1 bg-slate-900 rounded-lg flex items-center justify-center border border-amber-500/40 w-full h-full">
            <span className="font-mono text-lg font-bold text-sky-300 tracking-widest">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Big Interactive Golden Bell */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isChiming ? { rotate: [0, -15, 15, -15, 0] } : {}}
          transition={{ duration: 0.5 }}
          onClick={ringBell}
          className="relative w-16 h-16 rounded-full bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 border-3 border-amber-600 flex items-center justify-center shadow-lg hover:shadow-amber-300/60 cursor-pointer"
        >
          <span className="text-3xl filter drop-shadow-sm select-none">🔔</span>
          {isChiming && (
            <span className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping pointer-events-none" />
          )}
        </motion.button>

        <p className="text-[11px] text-slate-600 font-bold leading-relaxed text-center">
          Tap Bell to start lessons! <br />
          <strong className="text-amber-700">{bellClicks} / 5</strong> chimes for star
        </p>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 6. AMBIENT ATMOSPHERE CONTROLLER
// ────────────────────────────────────────────────────────
export type AtmosphereType = 'sunrise' | 'twilight' | 'storm';

interface AtmosphereControlProps {
  currentAtmosphere: AtmosphereType;
  onChangeAtmosphere: (type: AtmosphereType) => void;
  setFairyMessage: (msg: string) => void;
}

export function AtmosphereControl({ currentAtmosphere, onChangeAtmosphere, setFairyMessage }: AtmosphereControlProps) {
  const modes = [
    {
      id: 'sunrise' as const,
      label: 'Sunrise Solitude',
      icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
      desc: 'Soft golden rays, chirping robin widgets and warm school morning energy.',
      fairy: 'Beautiful morning in the corridor! The golden sunbeams make the floor boards shine!'
    },
    {
      id: 'twilight' as const,
      label: 'Mystical Twilight',
      icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
      desc: 'Arched glass windows showing magical garden with floating candles and stars.',
      fairy: 'Welcome to twilight hours! The corridors glow with starlight and magical lantern embers.'
    },
    {
      id: 'storm' as const,
      label: 'Lightning Storm',
      icon: <Zap className="w-3.5 h-3.5 text-sky-400" />,
      desc: 'Dramatic blue thunder flashes behind the window panes with cozy fireplace lighting.',
      fairy: 'A heavy rain storm is lashing the classroom glass! Stay cozy inside our warm corridor.'
    }
  ];

  const handleSelect = (mode: typeof modes[number]) => {
    onChangeAtmosphere(mode.id);
    setFairyMessage(mode.fairy);
    playChimeSound('spell');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/30 rounded-2xl p-5 shadow-xl text-white relative overflow-hidden text-left">
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-700/10 border border-slate-700/20 px-2 py-0.5 rounded text-[9px] font-black uppercase text-slate-400">
        🔮 Ambiance
      </div>

      <h3 className="font-bold text-sm text-indigo-200 mb-3 flex items-center gap-1.5">
        <span>🔮</span> Corridor Atmosphere
      </h3>

      <p className="text-[10px] text-slate-400 font-semibold mb-4">
        Toggle the physical lighting and weather window visuals of the School Corridor corridor:
      </p>

      <div className="flex flex-col gap-2.5">
        {modes.map((mode) => {
          const isActive = currentAtmosphere === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex gap-3 items-start ${
                isActive
                  ? 'border-indigo-400 bg-indigo-500/10 text-white shadow-md'
                  : 'border-white/5 bg-white/0 text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-lg border shrink-0 ${isActive ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-white/5 border-white/5'}`}>
                {mode.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black">{mode.label}</span>
                <span className="text-[9px] font-medium leading-relaxed mt-0.5 opacity-80">{mode.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
