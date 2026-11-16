import React from 'react';
import { motion } from 'motion/react';

interface MagicDoorProps {
  year: 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4' | 'Year 5' | 'Year 6';
  onClick: () => void;
  isFocused?: boolean;
  isHanddrawn?: boolean;
}

export const MagicDoor: React.FC<MagicDoorProps> = ({ year, onClick, isFocused = true, isHanddrawn = false }) => {
  const getTheme = () => {
    switch (year) {
      case 'Year 1':
        return {
          accentColor: isHanddrawn ? 'bg-[#D3A297] text-[#334030]' : 'from-pink-400 via-rose-300 to-pink-500',
          doorBg: isHanddrawn ? 'bg-[#FAF0ED]' : 'bg-gradient-to-b from-pink-100 to-rose-200',
          doorTrim: isHanddrawn ? 'border-[#D3A297]' : 'border-pink-300',
          glowColor: 'rgba(244,172,183,0.5)',
          icon: '⭐',
          bannerText: 'Year 1: Magical Sparkles',
          ageRange: 'Ages 5 - 6 · Key Stage 1',
          starsColor: 'text-pink-400',
          doorKnob: 'bg-amber-400'
        };
      case 'Year 2':
        return {
          accentColor: isHanddrawn ? 'bg-[#98B6B1] text-[#334030]' : 'from-sky-400 via-indigo-300 to-sky-500',
          doorBg: isHanddrawn ? 'bg-[#F0F5F4]' : 'bg-gradient-to-b from-sky-100 to-indigo-200',
          doorTrim: isHanddrawn ? 'border-[#98B6B1]' : 'border-sky-300',
          glowColor: 'rgba(181,226,250,0.5)',
          icon: '🎈',
          bannerText: 'Year 2: Cosmic Wonders',
          ageRange: 'Ages 6 - 7 · Key Stage 1',
          starsColor: 'text-sky-400',
          doorKnob: 'bg-amber-400'
        };
      case 'Year 3':
        return {
          accentColor: isHanddrawn ? 'bg-[#A8B79B] text-[#334030]' : 'from-emerald-400 via-teal-300 to-emerald-500',
          doorBg: isHanddrawn ? 'bg-[#F4F6F1]' : 'bg-gradient-to-b from-emerald-100 to-teal-200',
          doorTrim: isHanddrawn ? 'border-[#A8B79B]' : 'border-emerald-300',
          glowColor: 'rgba(167,244,200,0.5)',
          icon: '🍀',
          bannerText: 'Year 3: Discovery Forest',
          ageRange: 'Ages 7 - 8 · Key Stage 2',
          starsColor: 'text-emerald-400',
          doorKnob: 'bg-amber-400'
        };
      case 'Year 4':
        return {
          accentColor: isHanddrawn ? 'bg-[#C79E45] text-[#334030]' : 'from-amber-400 via-orange-300 to-amber-500',
          doorBg: isHanddrawn ? 'bg-[#FAF6EC]' : 'bg-gradient-to-b from-amber-100 to-orange-200',
          doorTrim: isHanddrawn ? 'border-[#C79E45]' : 'border-amber-300',
          glowColor: 'rgba(253,210,167,0.5)',
          icon: '☀️',
          bannerText: 'Year 4: Solar Pathways',
          ageRange: 'Ages 8 - 9 · Key Stage 2',
          starsColor: 'text-amber-500',
          doorKnob: 'bg-amber-400'
        };
      case 'Year 5':
        return {
          accentColor: isHanddrawn ? 'bg-[#9F8BB5] text-[#334030]' : 'from-purple-400 via-violet-300 to-purple-500',
          doorBg: isHanddrawn ? 'bg-[#F5F1F8]' : 'bg-gradient-to-b from-purple-100 to-violet-200',
          doorTrim: isHanddrawn ? 'border-[#9F8BB5]' : 'border-purple-300',
          glowColor: 'rgba(210,185,246,0.5)',
          icon: '🔮',
          bannerText: 'Year 5: Mystic Scrolls',
          ageRange: 'Ages 9 - 10 · Key Stage 2',
          starsColor: 'text-purple-400',
          doorKnob: 'bg-amber-400'
        };
      case 'Year 6':
      default:
        return {
          accentColor: isHanddrawn ? 'bg-[#D3979E] text-[#334030]' : 'from-rose-400 via-pink-300 to-rose-500',
          doorBg: isHanddrawn ? 'bg-[#FAF0F1]' : 'bg-gradient-to-b from-rose-100 to-pink-200',
          doorTrim: isHanddrawn ? 'border-[#D3979E]' : 'border-rose-300',
          glowColor: 'rgba(255,183,197,0.5)',
          icon: '👑',
          bannerText: 'Year 6: Leadership Summit',
          ageRange: 'Ages 10 - 11 · Key Stage 2',
          starsColor: 'text-rose-400',
          doorKnob: 'bg-amber-400'
        };
    }
  };

  const theme = getTheme();

  return (
    <motion.div
      whileHover={isFocused ? { scale: 1.02, y: -4 } : {}}
      whileTap={isFocused ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`cursor-pointer group flex flex-col items-center w-full max-w-[250px] transition-all duration-300 ${
        isFocused ? 'opacity-100' : 'opacity-65 scale-90 pointer-events-none'
      }`}
    >
      {/* Magical Door Frame Archway */}
      <div className={`relative w-full aspect-[2/3] rounded-t-full p-2.5 shadow-lg overflow-hidden transition-all duration-300 ${
        isHanddrawn
          ? 'bg-[#FCFBF7] border-3 border-[#334030] canvas-border-rough-thin canvas-shadow-handdrawn'
          : 'bg-gradient-to-b from-amber-100 via-white to-amber-50 border-4 border-amber-300'
      }`}>
        {/* Glow background on hover */}
        {!isHanddrawn && (
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial-[circle_at_center,${theme.glowColor}_0%,transparent_75%] z-0`} />
        )}

        {/* Inner double doors */}
        <div className={`relative h-full w-full flex rounded-t-full overflow-hidden z-10 bg-slate-50 border-2 border-dashed ${
          isHanddrawn ? 'border-[#334030]/25' : 'border-amber-200/80'
        }`}>
          
          {/* Left Door Half */}
          <div className={`w-1/2 h-full ${theme.doorBg} border-r p-1 relative transition-transform duration-500 ${
            isHanddrawn ? 'border-[#334030]/20' : 'border-amber-300/40'
          } ${isFocused ? 'group-hover:-rotate-y-12 origin-left' : ''}`}>
            {/* Grooves & Paneling details */}
            <div className={`absolute inset-1.5 rounded-tl-full border-2 ${theme.doorTrim} opacity-60`} />
            <div className={`w-1.5 h-6 rounded-full mt-12 mr-1 float-right ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400/80'
            }`} />
            
            {/* Left Hinge */}
            <div className={`absolute left-1 top-8 w-1.5 h-3 rounded-sm shadow-xs ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400'
            }`} />
            <div className={`absolute left-1 bottom-12 w-1.5 h-3 rounded-sm shadow-xs ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400'
            }`} />
          </div>

          {/* Right Door Half */}
          <div className={`w-1/2 h-full ${theme.doorBg} border-l p-1 relative transition-transform duration-500 ${
            isHanddrawn ? 'border-[#334030]/20' : 'border-amber-300/40'
          } ${isFocused ? 'group-hover:rotate-y-12 origin-right' : ''}`}>
            {/* Grooves & Paneling details */}
            <div className={`absolute inset-1.5 rounded-tr-full border-2 ${theme.doorTrim} opacity-60`} />
            <div className={`w-1.5 h-6 rounded-full mt-12 ml-1 float-left ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400/80'
            }`} />

            {/* Right Hinge */}
            <div className={`absolute right-1 top-8 w-1.5 h-3 rounded-sm shadow-xs ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400'
            }`} />
            <div className={`absolute right-1 bottom-12 w-1.5 h-3 rounded-sm shadow-xs ${
              isHanddrawn ? 'bg-[#334030]/80' : 'bg-amber-400'
            }`} />
          </div>

          {/* Door Ornaments overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between py-6 z-20">
            {/* Spinning Floating emoji symbol */}
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl filter drop-shadow-xs"
            >
              {theme.icon}
            </motion.span>

            {/* Golden shield plate lock with keyhole */}
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 ${
              isFocused ? 'group-hover:scale-105' : ''
            } ${
              isHanddrawn
                ? 'bg-[#FCFBF7] border-2 border-[#334030] canvas-shadow-handdrawn'
                : 'bg-gradient-to-b from-amber-300 to-amber-500 border-2 border-white shadow-md'
            }`}>
              <div className={`w-4 h-6 rounded-full flex flex-col items-center pt-1.5 ${
                isHanddrawn ? 'bg-[#334030]' : 'bg-slate-900'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isHanddrawn ? 'bg-[#FCFBF7]' : 'bg-amber-400'}`} />
                <div className={`w-1 h-2 -mt-0.5 rounded-xs ${isHanddrawn ? 'bg-[#FCFBF7]' : 'bg-amber-400'}`} />
              </div>
              
              {!isHanddrawn && (
                <>
                  <span className={`absolute -top-1 -left-1 text-[8px] ${theme.starsColor} animate-ping`}>✦</span>
                  <span className={`absolute -bottom-1 -right-1 text-[8px] ${theme.starsColor} animate-ping delay-300`}>✦</span>
                </>
              )}
            </div>

            {/* School Year Badge */}
            <div className={`font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md tracking-wider border transition-all duration-300 ${
              isHanddrawn
                ? `${theme.accentColor} border-[#334030] border-2 font-black canvas-shadow-handdrawn`
                : `bg-gradient-to-r ${theme.accentColor} text-white border-white`
            }`}>
              {year}
            </div>
          </div>
        </div>

        {/* Shimmer Light across the door frame */}
        {!isHanddrawn && (
          <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-30 z-30 group-hover:animate-shine" />
        )}
      </div>

      {/* Door Name & Age detail banner */}
      <div className="mt-3 text-center w-full">
        <h3 className={`font-extrabold text-sm transition-colors duration-300 ${
          isHanddrawn
            ? 'text-[#334030] font-black group-hover:text-[#5F745B]'
            : 'text-slate-700 font-sans group-hover:text-pink-500'
        }`}>
          {theme.bannerText}
        </h3>
        <span className={`text-[11px] font-bold tracking-wide block mt-0.5 transition-colors duration-300 ${
          isHanddrawn ? 'text-[#334030]/60' : 'text-slate-400'
        }`}>
          {theme.ageRange}
        </span>
      </div>

      <style>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .group:hover .group-hover\\:animate-shine {
          animation: shine 0.8s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
};
