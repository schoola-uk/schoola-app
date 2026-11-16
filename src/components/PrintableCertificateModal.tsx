import React, { useState } from 'react';
import { Award, Printer, Star, X } from 'lucide-react';

interface PrintableCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  explorerName: string;
  onUpdateName: (name: string) => void;
  achievementTitle: string;
  yearGroup: string;
  starsEarned: number;
  completedCount: number;
}

export const PrintableCertificateModal: React.FC<PrintableCertificateModalProps> = ({
  isOpen,
  onClose,
  explorerName,
  onUpdateName,
  achievementTitle,
  yearGroup,
  starsEarned,
  completedCount,
}) => {
  const [nameInput, setNameInput] = useState(explorerName);

  if (!isOpen) return null;

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between no-print">
          <h3 className="font-heading font-bold text-lg text-slate-900">
            Printable Achievement Certificate
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            aria-label="Close certificate"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Explorer Nickname Customizer (local only) */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end bg-slate-50 border border-slate-200 rounded-2xl p-4 no-print text-left">
          <div className="flex-1">
            <label htmlFor="cert-name-input" className="block text-xs font-bold text-slate-700 mb-1">
              Name on Certificate (optional, stored locally on this device only)
            </label>
            <input
              id="cert-name-input"
              type="text"
              maxLength={32}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                onUpdateName(e.target.value || 'Young Explorer');
              }}
              placeholder="Young Explorer"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>
        </div>

        {/* Certificate Sheet */}
        <div
          id="printable-certificate-area"
          className="border-4 border-amber-400 bg-amber-50/40 rounded-2xl p-6 sm:p-10 text-center space-y-5"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8 text-amber-600" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Schoola – Discover. Play. Learn.
            </p>
            <h4 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
              Certificate of Curiosity &amp; Achievement
            </h4>
          </div>

          <p className="text-sm text-slate-600">Proudly presented to</p>

          <p className="font-heading font-extrabold text-3xl sm:text-4xl text-sky-800 border-b-2 border-amber-300 pb-2 max-w-md mx-auto">
            {explorerName || 'Young Explorer'}
          </p>

          <p className="text-sm sm:text-base text-slate-700 max-w-lg mx-auto leading-relaxed">
            For wonderful effort, curiosity, and progress in{' '}
            <span className="font-bold text-slate-900">{achievementTitle}</span> ({yearGroup} · England National Curriculum).
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-bold text-slate-700 tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              {starsEarned} Stars Earned
            </span>
            <span aria-hidden="true">·</span>
            <span>{completedCount} Topics Completed</span>
            <span aria-hidden="true">·</span>
            <span>Awarded {todayFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
