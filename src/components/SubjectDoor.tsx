import React from 'react';
import { motion } from 'motion/react';
import { Subject } from '../types';

interface SubjectDoorProps {
  subject: Subject;
  onClick: () => void;
}

export const SubjectDoor: React.FC<SubjectDoorProps> = ({ subject, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: [0, -1, 1, 0] }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer group relative flex flex-col justify-between h-48 rounded-2xl p-4 overflow-hidden border-2 shadow-sm transition-shadow hover:shadow-md"
      style={{
        backgroundColor: subject.bg,
        borderColor: `${subject.borderColor}80`,
      }}
    >
      {/* Sparkly corner stars */}
      <span className="absolute top-2 right-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: subject.textColor }}>✦</span>
      <span className="absolute bottom-2 left-2 text-xs opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: subject.textColor }}>✦</span>

      {/* Magical Background Accent Circles */}
      <div 
        className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full opacity-20 filter blur-lg transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: subject.color }}
      />

      {/* Subject Header */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Floating rounded emoji gate */}
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white"
          style={{ backgroundColor: `${subject.color}60` }}
        >
          <span className="transform group-hover:scale-125 transition-transform duration-300">
            {subject.emoji}
          </span>
        </div>

        <div>
          <h3 
            className="font-bold text-sm tracking-tight font-sans"
            style={{ color: subject.textColor }}
          >
            {subject.label}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60" style={{ color: subject.textColor }}>
            Fairy Gate
          </span>
        </div>
      </div>

      {/* Whimsical description */}
      <p className="text-xs font-medium leading-relaxed text-slate-500/90 font-sans my-2 relative z-10 flex-1">
        {subject.description}
      </p>

      {/* "Unlock" indicator */}
      <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200 relative z-10">
        <span 
          className="text-[10px] font-extrabold uppercase tracking-widest"
          style={{ color: subject.textColor }}
        >
          Enter Gate
        </span>
        
        {/* Cute key icon that spins slightly on hover */}
        <motion.span 
          className="text-xs"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ color: subject.textColor }}
        >
          🔑
        </motion.span>
      </div>

      {/* Light sweep animation on hover */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
        <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sweep z-0" />
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
    </motion.div>
  );
};
