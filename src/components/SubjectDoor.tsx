import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Subject } from '../types';

interface SubjectDoorProps {
  subject: Subject;
  onClick: () => void;
}

const SubjectSceneIllustration: React.FC<{ subjectId: string }> = ({ subjectId }) => {
  switch (subjectId) {
    case 'English':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FFE4E9" />
          <circle cx="48" cy="36" r="20" fill="#FDE68A" />
          <path d="M0 104 Q160 86 320 104 V130 H0 Z" fill="#FDA4AF" opacity="0.45" />
          {/* Storybook Castle */}
          <rect x="192" y="48" width="84" height="58" rx="6" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <rect x="214" y="26" width="40" height="80" fill="#FFF1F2" stroke="#E11D48" strokeWidth="2.5" />
          <polygon points="234,6 208,28 260,28" fill="#E11D48" />
          <polygon points="202,30 186,50 218,50" fill="#FB7185" />
          <polygon points="266,30 250,50 282,50" fill="#FB7185" />
          <path d="M225 106 V86 A9 9 0 0 1 243 86 V106 Z" fill="#9F1239" />
          {/* Open Book */}
          <path d="M36 104 Q76 92 114 104 V62 Q76 50 36 62 Z" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <path d="M114 104 Q152 92 190 104 V62 Q152 50 114 62 Z" fill="#FFF5F5" stroke="#E11D48" strokeWidth="2.5" />
          {/* Floating Letters */}
          <text x="90" y="42" fill="#E11D48" fontSize="19" fontWeight="900">A</text>
          <text x="128" y="30" fill="#0284C7" fontSize="18" fontWeight="900">B</text>
          <text x="158" y="48" fill="#D97706" fontSize="19" fontWeight="900">C</text>
        </svg>
      );
    case 'Maths':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#DBEAFE" />
          <path d="M0 86 Q80 62 160 86 T320 78 V130 H0 Z" fill="#34D399" />
          {/* Number River */}
          <path d="M36 130 C76 94 162 112 192 78 C222 44 272 54 306 30" stroke="#0284C7" strokeWidth="22" strokeLinecap="round" />
          <path d="M36 130 C76 94 162 112 192 78 C222 44 272 54 306 30" stroke="#7DD3FC" strokeWidth="10" strokeLinecap="round" strokeDasharray="6 8" />
          {/* Floating Math Shapes & Sign */}
          <polygon points="56,22 82,66 30,66" fill="#F59E0B" />
          <circle cx="268" cy="30" r="17" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="226" y="78" width="32" height="32" rx="7" fill="#F43F5E" transform="rotate(-10 242 94)" />
          <rect x="92" y="72" width="76" height="28" rx="9" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <text x="130" y="91" textAnchor="middle" fill="#0F172A" fontSize="14" fontWeight="900">3 + ? = 7</text>
        </svg>
      );
    case 'Science':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#DCFCE7" />
          {/* Rainbow */}
          <path d="M40 104 A100 100 0 0 1 240 104" stroke="#FB7185" strokeWidth="6" opacity="0.65" />
          <path d="M48 104 A92 92 0 0 1 232 104" stroke="#FBBF24" strokeWidth="6" opacity="0.65" />
          <path d="M56 104 A84 84 0 0 1 224 104" stroke="#38BDF8" strokeWidth="6" opacity="0.65" />
          <path d="M0 98 Q160 80 320 98 V130 H0 Z" fill="#10B981" />
          {/* Volcano */}
          <path d="M120 108 L146 58 H174 L200 108 Z" fill="#92400E" />
          <path d="M146 58 Q160 66 174 58 L179 68 Q160 76 141 68 Z" fill="#F97316" />
          <circle cx="155" cy="44" r="6" fill="#FBBF24" />
          <circle cx="169" cy="36" r="5" fill="#FB7185" />
          {/* Flower & Rocket */}
          <path d="M62 108 V72" stroke="#065F46" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="62" cy="66" r="11" fill="#F43F5E" />
          <circle cx="62" cy="66" r="5" fill="#FDE047" />
          <g transform="translate(262, 42) rotate(24)">
            <ellipse cx="0" cy="0" rx="10" ry="20" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="0" cy="-3" r="4" fill="#38BDF8" />
            <path d="M-5 18 L0 28 L5 18 Z" fill="#F59E0B" />
          </g>
        </svg>
      );
    case 'History':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FEF3C7" />
          <circle cx="268" cy="32" r="18" fill="#FDE047" />
          <path d="M0 104 H320 V130 H0 Z" fill="#FCD34D" />
          {/* Pyramids */}
          <polygon points="32,106 96,34 160,106" fill="#F59E0B" />
          <polygon points="96,34 160,106 116,106" fill="#D97706" />
          <polygon points="126,106 176,50 226,106" fill="#FBBF24" />
          {/* Ancient Scroll */}
          <rect x="210" y="56" width="76" height="44" rx="7" fill="#FFFBEB" stroke="#92400E" strokeWidth="2.5" />
          <line x1="224" y1="70" x2="272" y2="70" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="224" y1="82" x2="262" y2="82" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'Geography':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#CCFBF1" />
          <circle cx="160" cy="66" r="48" fill="#38BDF8" stroke="#0D9488" strokeWidth="3" />
          <path d="M134 40 C150 34 158 48 154 62 C150 76 162 88 150 102 C134 98 122 80 124 58 Z" fill="#34D399" />
          <path d="M174 36 C192 40 202 58 198 78 C190 88 174 86 170 70 Z" fill="#10B981" />
          {/* Compass & Mountain */}
          <circle cx="56" cy="92" r="20" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
          <polygon points="56,76 61,92 56,108 51,92" fill="#F43F5E" />
          <polygon points="234,114 264,62 294,114" fill="#0F766E" />
          <polygon points="254,80 264,62 274,80 264,76" fill="#FFFFFF" />
          <circle cx="272" cy="30" r="14" fill="#FBBF24" />
        </svg>
      );
    case 'Art':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FFEDD5" />
          {/* Easel Canvas */}
          <rect x="176" y="20" width="94" height="72" rx="8" fill="#FFFFFF" stroke="#EA580C" strokeWidth="3" />
          <path d="M192 70 Q218 32 254 66" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
          <circle cx="212" cy="44" r="9" fill="#FBBF24" />
          <circle cx="242" cy="48" r="8" fill="#38BDF8" />
          {/* Paint Palette */}
          <ellipse cx="92" cy="70" rx="54" ry="38" fill="#FEF3C7" stroke="#D97706" strokeWidth="3" />
          <circle cx="66" cy="58" r="9" fill="#EF4444" />
          <circle cx="94" cy="48" r="9" fill="#3B82F6" />
          <circle cx="122" cy="62" r="9" fill="#10B981" />
          <circle cx="104" cy="88" r="9" fill="#A855F7" />
          <circle cx="64" cy="82" r="7" fill="#FFEDD5" stroke="#D97706" strokeWidth="2" />
        </svg>
      );
    case 'DT':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FCE7F3" />
          {/* Blueprint Grid Lines */}
          <path d="M0 32 H320 M0 64 H320 M0 96 H320 M80 0 V130 M160 0 V130 M240 0 V130" stroke="#F9A8D4" strokeWidth="1" opacity="0.55" />
          {/* Gear 1 */}
          <circle cx="92" cy="64" r="30" fill="#F97316" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="92" cy="64" r="11" fill="#FCE7F3" />
          {/* Gear 2 */}
          <circle cx="148" cy="84" r="22" fill="#EC4899" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="148" cy="84" r="8" fill="#FCE7F3" />
          {/* Toy Vehicle */}
          <rect x="194" y="54" width="88" height="36" rx="10" fill="#0EA5E9" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="212" y="38" width="46" height="20" rx="6" fill="#BAE6FD" />
          <circle cx="216" cy="92" r="12" fill="#1E293B" stroke="#FFFFFF" strokeWidth="3" />
          <circle cx="262" cy="92" r="12" fill="#1E293B" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      );
    case 'Computing':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#EEF2FF" />
          {/* Laptop */}
          <rect x="78" y="20" width="164" height="82" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="3" />
          <rect x="60" y="100" width="200" height="12" rx="6" fill="#4F46E5" />
          {/* Scratch Code Blocks inside screen */}
          <rect x="94" y="34" width="76" height="14" rx="5" fill="#F59E0B" />
          <rect x="104" y="54" width="92" height="14" rx="5" fill="#38BDF8" />
          <rect x="104" y="74" width="66" height="14" rx="5" fill="#10B981" />
          <circle cx="214" cy="54" r="14" fill="#F43F5E" />
          <polygon points="210,48 222,54 210,60" fill="#FFFFFF" />
        </svg>
      );
    case 'Music':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#F3E8FF" />
          {/* Musical Stave Lines */}
          <path d="M16 42 Q160 22 304 42 M16 58 Q160 38 304 58 M16 74 Q160 54 304 74" stroke="#C084FC" strokeWidth="2" />
          {/* Notes */}
          <circle cx="72" cy="72" r="12" fill="#7C3AED" />
          <rect x="81" y="30" width="5" height="42" fill="#7C3AED" />
          <circle cx="148" cy="56" r="12" fill="#EC4899" />
          <rect x="157" y="18" width="5" height="38" fill="#EC4899" />
          {/* Boombox / Piano keys */}
          <rect x="198" y="42" width="92" height="62" rx="10" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="2.5" />
          <rect x="210" y="54" width="12" height="42" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="226" y="54" width="12" height="42" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="242" y="54" width="12" height="42" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="258" y="54" width="12" height="42" rx="2" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.5" />
          <rect x="219" y="54" width="8" height="24" rx="2" fill="#4C1D95" />
          <rect x="251" y="54" width="8" height="24" rx="2" fill="#4C1D95" />
        </svg>
      );
    case 'PE':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#E0F2FE" />
          <path d="M0 84 H320 V130 H0 Z" fill="#22C55E" />
          <line x1="160" y1="84" x2="160" y2="130" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="5 4" />
          {/* Golden Trophy */}
          <path d="M210 34 H260 L254 68 C252 78 218 78 216 68 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="2.5" />
          <rect x="230" y="74" width="10" height="18" fill="#D97706" />
          <rect x="218" y="92" width="34" height="10" rx="3" fill="#92400E" />
          {/* Football */}
          <circle cx="98" cy="72" r="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
          <polygon points="98,58 110,67 105,82 91,82 86,67" fill="#0F172A" />
        </svg>
      );
    case 'RE':
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FFF1F2" />
          <circle cx="160" cy="64" r="44" fill="#FDE68A" opacity="0.7" />
          {/* Festive Lanterns */}
          <line x1="76" y1="0" x2="76" y2="36" stroke="#9F1239" strokeWidth="2.5" />
          <rect x="58" y="36" width="36" height="44" rx="14" fill="#F43F5E" stroke="#9F1239" strokeWidth="2.5" />
          <circle cx="76" cy="58" r="7" fill="#FEF08A" />
          <line x1="244" y1="0" x2="244" y2="30" stroke="#D97706" strokeWidth="2.5" />
          <rect x="226" y="30" width="36" height="44" rx="14" fill="#F59E0B" stroke="#92400E" strokeWidth="2.5" />
          <circle cx="244" cy="52" r="7" fill="#FEF08A" />
          {/* Dove / Heart */}
          <circle cx="160" cy="64" r="24" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <text x="160" y="72" textAnchor="middle" fontSize="24">🕊️</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 320 130" className="w-full h-full object-cover" fill="none">
          <rect width="320" height="130" fill="#FEF9C3" />
          <path d="M0 94 Q160 72 320 94 V130 H0 Z" fill="#86EFAC" />
          <circle cx="88" cy="60" r="28" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M74 54 Q88 46 102 58" stroke="#22C55E" strokeWidth="8" strokeLinecap="round" />
          <circle cx="218" cy="56" r="28" fill="#FECDD3" stroke="#E11D48" strokeWidth="2.5" />
          <path d="M218 70 C200 56 204 42 218 50 C232 42 236 56 218 70 Z" fill="#E11D48" />
          <path d="M132 58 Q154 38 176 58" stroke="#F59E0B" strokeWidth="4" strokeDasharray="5 5" />
        </svg>
      );
  }
};

export const SubjectDoor: React.FC<SubjectDoorProps> = ({ subject, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer group relative flex flex-col w-full text-left rounded-3xl overflow-hidden border-2 border-b-4 shadow-sm transition-all hover:shadow-xl bg-white"
      style={{
        borderColor: subject.borderColor,
      }}
    >
      {/* Top Illustrated Storybook Gate Window */}
      <div className="relative w-full h-32 overflow-hidden border-b-2" style={{ borderColor: subject.borderColor }}>
        <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500">
          <SubjectSceneIllustration subjectId={subject.id} />
        </div>

        {/* Arched Wooden/Gold Keyhole Pill Top-Left */}
        <span
          className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-playful font-extrabold uppercase tracking-wider bg-white/95 shadow-xs border"
          style={{ color: subject.textColor, borderColor: subject.borderColor }}
        >
          Learning World
        </span>

        {/* Sparkle Badge Top-Right */}
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 shadow-xs flex items-center justify-center"
          style={{ color: subject.textColor }}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </span>

        {/* Hover Shimmer Sweep */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sweep z-10" />
        </div>
      </div>

      {/* Circular Emblem Badge straddling the window */}
      <div className="relative px-5 pt-8 pb-5 flex flex-col flex-1 justify-between" style={{ backgroundColor: subject.bg }}>
        <div
          className="absolute -top-6 left-5 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white transform group-hover:-rotate-6 transition-transform"
          style={{ backgroundColor: subject.color }}
        >
          <span aria-hidden="true">{subject.emoji}</span>
        </div>

        <div className="space-y-2">
          <h3
            className="font-playful font-bold text-lg tracking-tight leading-snug"
            style={{ color: subject.textColor }}
          >
            {subject.label}
          </h3>
          <p className="text-xs font-medium leading-relaxed text-slate-700 line-clamp-2">
            {subject.description}
          </p>
        </div>

        {/* Tactile Bottom Gate Action Bar */}
        <div
          className="flex items-center justify-between w-full mt-4 pt-3 border-t border-dashed"
          style={{ borderColor: subject.borderColor }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-playful font-extrabold uppercase tracking-wider bg-white shadow-2xs border"
            style={{ color: subject.textColor, borderColor: subject.borderColor }}
          >
            Enter World →
          </span>

          <motion.span
            aria-hidden="true"
            className="text-base"
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2 }}
          >
            🔑
          </motion.span>
        </div>
      </div>

      <style>{`
        @keyframes sweep {
          0% { left: -100%; }
          100% { left: 150%; }
        }
        .group:hover .group-hover\\:animate-sweep {
          animation: sweep 0.8s ease-in-out;
        }
      `}</style>
    </motion.button>
  );
};
