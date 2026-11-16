import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type CompanionId = 'sparkle' | 'jack' | 'celeste' | 'pippa';

interface FairyGuideProps {
  expression: 'happy' | 'thinking' | 'sparkle' | 'sad' | 'excited';
  message: string;
  companionId?: CompanionId;
  onCompanionClick?: () => void;
}

export const FairyGuide: React.FC<FairyGuideProps> = ({ 
  expression, 
  message, 
  companionId = 'sparkle',
  onCompanionClick
}) => {
  // SVG face details depending on expression
  const renderFace = () => {
    switch (expression) {
      case 'sparkle':
        return (
          <>
            {/* Sparkly eyes */}
            <path d="M12 18 L14 21 L12 24 L10 21 Z" fill="#FFF" />
            <path d="M28 18 L30 21 L28 24 L26 21 Z" fill="#FFF" />
            <circle cx="13" cy="21" r="2.5" fill="#FFE66D" />
            <circle cx="27" cy="21" r="2.5" fill="#FFE66D" />
            {/* Rosy cheeks */}
            <ellipse cx="8" cy="26" rx="4" ry="2" fill="#FFA4B4" opacity="0.8" />
            <ellipse cx="32" cy="26" rx="4" ry="2" fill="#FFA4B4" opacity="0.8" />
            {/* Excited mouth */}
            <path d="M16 26 Q20 31 24 26" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'thinking':
        return (
          <>
            {/* Thinking eyes */}
            <path d="M10 20 Q13 17 16 20" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M24 20 Q27 17 30 20" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="13" cy="22" r="1" fill="#4A1E29" />
            <circle cx="27" cy="22" r="1" fill="#4A1E29" />
            {/* Rosy cheeks */}
            <ellipse cx="8" cy="26" rx="3" ry="1.5" fill="#FFA4B4" opacity="0.6" />
            <ellipse cx="32" cy="26" rx="3" ry="1.5" fill="#FFA4B4" opacity="0.6" />
            {/* Small curiosity mouth */}
            <circle cx="20" cy="26" r="2" fill="#4A1E29" />
          </>
        );
      case 'sad':
        return (
          <>
            {/* Sad/encouraging eyes */}
            <path d="M11 22 Q14 19 15 23" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M29 22 Q26 19 25 23" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Minimal cheek */}
            <ellipse cx="8" cy="27" rx="2" ry="1" fill="#FFA4B4" opacity="0.5" />
            <ellipse cx="32" cy="27" rx="2" ry="1" fill="#FFA4B4" opacity="0.5" />
            {/* Inverted sad smile */}
            <path d="M17 28 Q20 25 23 28" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Curved closed laughing eyes */}
            <path d="M10 23 Q13 17 16 23" stroke="#4A1E29" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M24 23 Q27 17 30 23" stroke="#4A1E29" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Giant blush */}
            <ellipse cx="7" cy="26" rx="5" ry="3" fill="#FF8FA3" opacity="0.9" />
            <ellipse cx="33" cy="26" rx="5" ry="3" fill="#FF8FA3" opacity="0.9" />
            {/* Open happy mouth */}
            <path d="M16 26 Q20 33 24 26 Z" fill="#FF6B6B" stroke="#4A1E29" strokeWidth="2" />
          </>
        );
      case 'happy':
      default:
        return (
          <>
            {/* Cute big open round eyes */}
            <circle cx="13" cy="20" r="4.5" fill="#4A1E29" />
            <circle cx="27" cy="20" r="4.5" fill="#4A1E29" />
            {/* Catch lights */}
            <circle cx="11.5" cy="18.5" r="1.8" fill="#FFF" />
            <circle cx="14" cy="21" r="0.8" fill="#FFF" />
            <circle cx="25.5" cy="18.5" r="1.8" fill="#FFF" />
            <circle cx="28" cy="21" r="0.8" fill="#FFF" />
            {/* Rosy cheeks */}
            <ellipse cx="8" cy="25" rx="4" ry="2" fill="#FFA4B4" opacity="0.8" />
            <ellipse cx="32" cy="25" rx="4" ry="2" fill="#FFA4B4" opacity="0.8" />
            {/* Sweet smile */}
            <path d="M17 25 Q20 28 23 25" stroke="#4A1E29" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  // Character config data
  const charConfig = {
    sparkle: {
      name: 'Sparkle the Pixie',
      emoji: '✨',
      skinColor: '#FFE5EC',
      hairColor: '#FF8FA3',
      glowClass: 'bg-pink-300',
      tagBg: 'from-pink-400 to-sky-400',
      bubbleTitleColor: 'text-pink-500',
      bubbleBorder: 'border-pink-200/80',
      gradientWingStart: '#FFF0F5',
      gradientWingMid: '#FFC2D1',
      gradientWingEnd: '#B5E2FA',
      gradientDressStart: '#B5E2FA',
      gradientDressEnd: '#FFC2D1',
      headbandColor: '#FFA4B4',
      earsColor: '#FFC2D1',
      gemColor: '#FFE66D',
    },
    jack: {
      name: 'Abacus Jack',
      emoji: '🧮',
      skinColor: '#EBF6FF',
      hairColor: '#3B9FE0',
      glowClass: 'bg-sky-300',
      tagBg: 'from-sky-500 to-amber-400',
      bubbleTitleColor: 'text-sky-500',
      bubbleBorder: 'border-sky-200/80',
      gradientWingStart: '#E0F2FE',
      gradientWingMid: '#90D4F7',
      gradientWingEnd: '#FFE66D',
      gradientDressStart: '#0284C7',
      gradientDressEnd: '#F59E0B',
      headbandColor: '#7DD3FC',
      earsColor: '#93C5FD',
      gemColor: '#FFD700',
    },
    celeste: {
      name: 'Celeste',
      emoji: '🔮',
      skinColor: '#FAF7FF',
      hairColor: '#D2B9F6',
      glowClass: 'bg-purple-300',
      tagBg: 'from-purple-500 to-orange-400',
      bubbleTitleColor: 'text-purple-500',
      bubbleBorder: 'border-purple-200/80',
      gradientWingStart: '#F5F3FF',
      gradientWingMid: '#C084FC',
      gradientWingEnd: '#FFEDD5',
      gradientDressStart: '#7C3AED',
      gradientDressEnd: '#FB923C',
      headbandColor: '#C084FC',
      earsColor: '#DDD6FE',
      gemColor: '#A7F3D0',
    },
    pippa: {
      name: 'Pippa',
      emoji: '🌿',
      skinColor: '#F2FFF5',
      hairColor: '#2D6A4F',
      glowClass: 'bg-emerald-300',
      tagBg: 'from-emerald-400 to-pink-400',
      bubbleTitleColor: 'text-emerald-600',
      bubbleBorder: 'border-emerald-200/80',
      gradientWingStart: '#ECFDF5',
      gradientWingMid: '#34D399',
      gradientWingEnd: '#FCE7F3',
      gradientDressStart: '#10B981',
      gradientDressEnd: '#F472B6',
      headbandColor: '#6EE7B7',
      earsColor: '#A7F3D0',
      gemColor: '#FB7185',
    }
  }[companionId] || {
    name: 'Sparkle the Pixie',
    emoji: '✨',
    skinColor: '#FFE5EC',
    hairColor: '#FF8FA3',
    glowClass: 'bg-pink-300',
    tagBg: 'from-pink-400 to-sky-400',
    bubbleTitleColor: 'text-pink-500',
    bubbleBorder: 'border-pink-200/80',
    gradientWingStart: '#FFF0F5',
    gradientWingMid: '#FFC2D1',
    gradientWingEnd: '#B5E2FA',
    gradientDressStart: '#B5E2FA',
    gradientDressEnd: '#FFC2D1',
    headbandColor: '#FFA4B4',
    earsColor: '#FFC2D1',
    gemColor: '#FFE66D',
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-end gap-4 max-w-2xl mx-auto my-6 px-4 relative z-20">
      {/* Companion Avatar Wrapper */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0],
        }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        onClick={onCompanionClick}
        className="relative flex-shrink-0 cursor-pointer"
      >
        {/* Subtle glow behind Avatar */}
        <div className={`absolute -inset-2 rounded-full blur-xl opacity-30 ${charConfig.glowClass}`}></div>

        {/* The Avatar Body (SVG) */}
        <svg
          width="88"
          height="88"
          viewBox="0 0 40 40"
          className="relative drop-shadow-md z-10 filter"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back Wings */}
          <path
            d="M5 12 Q-3 15 2 24 Q6 28 10 20 Z"
            fill={`url(#wingGrad-${companionId})`}
            className="origin-right"
            style={{ animation: 'wingFlapLeft 1.2s ease-in-out infinite' }}
          />
          <path
            d="M35 12 Q43 15 38 24 Q34 28 30 20 Z"
            fill={`url(#wingGrad-${companionId})`}
            className="origin-left"
            style={{ animation: 'wingFlapRight 1.2s ease-in-out infinite' }}
          />

          {/* Lower Small Wings */}
          <path d="M8 22 Q3 24 6 29 Q9 30 11 25 Z" fill={charConfig.gradientWingEnd} opacity="0.8" />
          <path d="M32 22 Q37 24 34 29 Q31 30 29 25 Z" fill={charConfig.gradientWingEnd} opacity="0.8" />

          {/* Body/Dress */}
          <path d="M15 25 L11 35 Q20 38 29 35 L25 25 Z" fill={`url(#dressGrad-${companionId})`} />
          {/* Collar/Bow */}
          <circle cx="20" cy="25" r="3.5" fill={charConfig.gemColor} />
          <path d="M17 25 L13 23 L13 27 Z" fill={charConfig.gemColor} />
          <path d="M23 25 L27 23 L27 27 Z" fill={charConfig.gemColor} />

          {/* Magical Gem Headband */}
          <path d="M12 11 Q20 5 28 11" stroke={charConfig.headbandColor} strokeWidth="1.5" />
          <polygon points="20,4 23,7 20,10 17,7" fill={charConfig.gemColor} stroke={charConfig.headbandColor} strokeWidth="0.5" />

          {/* Cute Magical Ears */}
          <path d="M7 11 Q3 5 10 8 Z" fill={charConfig.earsColor} />
          <path d="M33 11 Q37 5 30 8 Z" fill={charConfig.earsColor} />

          {/* Head & Hair */}
          <circle cx="20" cy="18" r="13" fill={charConfig.skinColor} />
          {/* Hair bangs/side locks */}
          <path d="M7 16 Q13 11 20 13 Q27 11 33 16 Q34 22 32 22 Q20 15 8 22 Z" fill={charConfig.hairColor} />
          {/* Back hair buns */}
          <circle cx="9" cy="8" r="4" fill={charConfig.hairColor} />
          <circle cx="31" cy="8" r="4" fill={charConfig.hairColor} />

          {/* Interactive Face Expression */}
          {renderFace()}

          {/* Gradients definitions */}
          <defs>
            <linearGradient id={`wingGrad-${companionId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={charConfig.gradientWingStart} />
              <stop offset="50%" stopColor={charConfig.gradientWingMid} />
              <stop offset="100%" stopColor={charConfig.gradientWingEnd} />
            </linearGradient>
            <linearGradient id={`dressGrad-${companionId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={charConfig.gradientDressStart} />
              <stop offset="100%" stopColor={charConfig.gradientDressEnd} />
            </linearGradient>
          </defs>
        </svg>

        {/* Name Tag under avatar */}
        <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-gradient-to-r ${charConfig.tagBg} text-white font-extrabold text-[9px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md z-20 border border-white whitespace-nowrap`}>
          {charConfig.name}
        </span>
      </motion.div>

      {/* Sweet Speech Bubble */}
      <div className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`relative bg-white border-2 ${charConfig.bubbleBorder} rounded-2xl p-4 shadow-sm text-left`}
          >
            {/* Bubble Tail for desktop (left) */}
            <div className={`hidden md:block absolute bottom-4 -left-2.5 w-4 h-4 bg-white border-l-2 border-b-2 ${charConfig.bubbleBorder} rotate-45`}></div>
            {/* Bubble Tail for mobile (bottom/top) */}
            <div className={`md:hidden absolute -top-2.5 left-10 w-4 h-4 bg-white border-l-2 border-t-2 ${charConfig.bubbleBorder} rotate-45`}></div>

            <div className="flex items-start gap-2 text-left">
              <span className="text-lg">{charConfig.emoji}</span>
              <div>
                <h4 className={`font-black text-xs tracking-wider uppercase ${charConfig.bubbleTitleColor} font-sans mb-0.5`}>
                  {charConfig.name} Says:
                </h4>
                <p className="text-slate-700 text-sm font-medium leading-relaxed font-sans">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CSS Animations Injection inside component safely */}
      <style>{`
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-10deg) translateY(-2px); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg) translateY(-2px); }
        }
      `}</style>
    </div>
  );
};
