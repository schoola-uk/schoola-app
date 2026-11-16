import React from 'react';

export const HeroAdventureIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 560 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Children exploring Earth, space, books and numbers">
    <defs>
      <linearGradient id="spaceSky" x1="0" y1="0" x2="560" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0F172A" />
        <stop offset="55%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
      <radialGradient id="earthOcean" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0369A1" />
      </radialGradient>
      <linearGradient id="saturnRing" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    <rect width="560" height="320" rx="24" fill="url(#spaceSky)" />

    {/* Stars */}
    <circle cx="48" cy="44" r="2.5" fill="#FDE68A" />
    <circle cx="118" cy="28" r="2" fill="#BAE6FD" />
    <circle cx="445" cy="36" r="2.5" fill="#FDE68A" />
    <circle cx="512" cy="72" r="2" fill="#FFFFFF" opacity="0.8" />
    <circle cx="88" cy="148" r="2" fill="#FFFFFF" opacity="0.7" />
    <circle cx="485" cy="184" r="2.5" fill="#FDE68A" />
    <path d="M164 56 L168 64 L176 68 L168 72 L164 80 L160 72 L152 68 L160 64 Z" fill="#FBBF24" />
    <path d="M402 82 L405 88 L411 91 L405 94 L402 100 L399 94 L393 91 L399 88 Z" fill="#34D399" />

    {/* Moon */}
    <circle cx="72" cy="74" r="26" fill="#FEF3C7" />
    <circle cx="64" cy="68" r="5" fill="#FDE68A" />
    <circle cx="80" cy="82" r="4" fill="#FDE68A" />

    {/* Saturn */}
    <g transform="translate(465, 76)">
      <ellipse cx="0" cy="0" rx="44" ry="12" transform="rotate(-18)" stroke="url(#saturnRing)" strokeWidth="6" fill="none" />
      <circle cx="0" cy="0" r="22" fill="#FBBF24" />
      <path d="M-21 -3 Q0 6 21 -3" stroke="#D97706" strokeWidth="3" fill="none" />
    </g>

    {/* Rocket */}
    <g transform="translate(450, 178) rotate(-32)">
      <path d="M0 -24 C12 -10 12 14 8 24 L-8 24 C-12 14 -12 -10 0 -24 Z" fill="#F8FAFC" />
      <path d="M0 -24 C5 -16 7 -10 8 -5 L-8 -5 C-7 -10 -5 -16 0 -24 Z" fill="#EF4444" />
      <circle cx="0" cy="5" r="5" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
      <path d="M-8 14 L-16 26 L-7 22 Z" fill="#EF4444" />
      <path d="M8 14 L16 26 L7 22 Z" fill="#EF4444" />
      <path d="M-4 24 L0 36 L4 24 Z" fill="#F59E0B" />
    </g>

    {/* Central Illustrated Globe */}
    <circle cx="280" cy="176" r="102" fill="url(#earthOcean)" stroke="#BAE6FD" strokeWidth="4" />
    <path d="M228 118 C245 104 275 110 278 134 C282 156 256 164 252 184 C248 206 268 232 246 248 C222 230 206 198 208 164 C210 142 216 128 228 118 Z" fill="#34D399" />
    <path d="M298 116 C324 114 352 134 356 164 C358 184 338 196 322 192 C304 188 292 162 294 140 Z" fill="#10B981" />
    <path d="M312 206 C332 206 346 220 342 238 C332 252 308 256 296 240 C290 226 298 208 312 206 Z" fill="#34D399" />

    {/* Floating Learning Icons */}
    <g transform="translate(132, 206)">
      <rect x="-24" y="-20" width="48" height="40" rx="10" fill="#FFFFFF" />
      <text x="0" y="7" textAnchor="middle" fill="#0284C7" fontSize="18" fontWeight="800" fontFamily="Outfit, sans-serif">2+3</text>
    </g>
    <g transform="translate(410, 244)">
      <rect x="-24" y="-20" width="48" height="40" rx="10" fill="#FEF3C7" />
      <text x="0" y="7" textAnchor="middle" fill="#D97706" fontSize="18" fontWeight="800" fontFamily="Outfit, sans-serif">ABC</text>
    </g>

    {/* Ground hill & curious explorer silhouettes */}
    <path d="M0 296 Q140 258 280 284 Q420 306 560 270 L560 320 L0 320 Z" fill="#059669" />
    {/* Explorer left */}
    <circle cx="104" cy="252" r="14" fill="#FDE68A" />
    <path d="M88 296 C88 272 120 272 120 296 Z" fill="#F43F5E" />
    {/* Explorer right */}
    <circle cx="448" cy="250" r="14" fill="#FED7AA" />
    <path d="M432 296 C432 270 464 270 464 296 Z" fill="#38BDF8" />
  </svg>
);

export const WorldBannerIllustration: React.FC<{
  worldKey: 'maths' | 'science' | 'english' | 'geography' | 'history' | 'creative';
  className?: string;
}> = ({ worldKey, className = 'w-full h-36 object-cover' }) => {
  switch (worldKey) {
    case 'maths':
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#E0F2FE" />
          <path d="M0 130 Q90 100 180 130 T360 120 L360 200 L0 200 Z" fill="#34D399" />
          <path d="M220 40 C260 40 280 110 295 140 L170 140 C185 110 190 40 220 40 Z" fill="#94A3B8" opacity="0.35" />
          {/* Winding Number River */}
          <path d="M60 200 C95 150 185 170 210 125 C235 80 290 95 330 65" stroke="#0284C7" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M60 200 C95 150 185 170 210 125 C235 80 290 95 330 65" stroke="#7DD3FC" strokeWidth="14" strokeLinecap="round" strokeDasharray="8 10" fill="none" />
          {/* Stepping stones */}
          <rect x="78" y="138" width="84" height="32" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <text x="120" y="160" textAnchor="middle" fill="#0F172A" fontSize="16" fontWeight="800" fontFamily="Outfit, sans-serif">3 + ? = 7</text>
          {/* Geometric islands */}
          <polygon points="62,48 92,98 32,98" fill="#F59E0B" />
          <circle cx="290" cy="48" r="22" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="242" y="136" width="38" height="38" rx="8" fill="#F43F5E" transform="rotate(-10 261 155)" />
        </svg>
      );
    case 'science':
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#ECFDF5" />
          {/* Rainbow */}
          <path d="M40 155 A120 120 0 0 1 280 155" stroke="#FB7185" strokeWidth="8" fill="none" opacity="0.6" />
          <path d="M50 155 A110 110 0 0 1 270 155" stroke="#FBBF24" strokeWidth="8" fill="none" opacity="0.6" />
          <path d="M60 155 A100 100 0 0 1 260 155" stroke="#34D399" strokeWidth="8" fill="none" opacity="0.6" />
          <path d="M70 155 A90 90 0 0 1 250 155" stroke="#38BDF8" strokeWidth="8" fill="none" opacity="0.6" />
          {/* Ground */}
          <path d="M0 150 Q180 128 360 150 L360 200 L0 200 Z" fill="#10B981" />
          {/* Volcano */}
          <path d="M135 162 L164 95 L196 95 L225 162 Z" fill="#92400E" />
          <path d="M164 95 Q180 105 196 95 L202 108 Q180 118 158 108 Z" fill="#F97316" />
          <circle cx="174" cy="76" r="8" fill="#FBBF24" />
          <circle cx="190" cy="66" r="6" fill="#FB7185" />
          {/* Sprout & Flower */}
          <path d="M72 162 V112" stroke="#065F46" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="60" cy="130" rx="12" ry="6" transform="rotate(-25 60 130)" fill="#34D399" />
          <circle cx="72" cy="104" r="14" fill="#F43F5E" />
          <circle cx="72" cy="104" r="6" fill="#FDE047" />
          {/* Rocket */}
          <g transform="translate(292, 60) rotate(25)">
            <ellipse cx="0" cy="0" rx="12" ry="24" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
            <circle cx="0" cy="-4" r="5" fill="#38BDF8" />
            <path d="M-6 22 L0 34 L6 22 Z" fill="#F59E0B" />
          </g>
        </svg>
      );
    case 'english':
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#FFF1F2" />
          <circle cx="62" cy="52" r="24" fill="#FDE68A" />
          {/* Storybook Castle */}
          <rect x="210" y="78" width="90" height="82" rx="6" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <rect x="234" y="48" width="42" height="112" fill="#FFE4E6" stroke="#E11D48" strokeWidth="2.5" />
          <polygon points="255,18 228,50 282,50" fill="#E11D48" />
          <polygon points="222,52 204,78 240,78" fill="#FB7185" />
          <polygon points="288,52 270,78 306,78" fill="#FB7185" />
          <path d="M244 160 V132 A11 11 0 0 1 266 132 V160 Z" fill="#9F1239" />
          {/* Open Storybook */}
          <path d="M44 158 Q88 142 128 158 L128 112 Q88 96 44 112 Z" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <path d="M128 158 Q168 142 212 158 L212 112 Q168 96 128 112 Z" fill="#FFF5F5" stroke="#E11D48" strokeWidth="2.5" />
          {/* Floating Letters */}
          <text x="108" y="64" fill="#E11D48" fontSize="22" fontWeight="800" fontFamily="Outfit, sans-serif">A</text>
          <text x="148" y="46" fill="#0284C7" fontSize="20" fontWeight="800" fontFamily="Outfit, sans-serif">B</text>
          <text x="182" y="72" fill="#D97706" fontSize="22" fontWeight="800" fontFamily="Outfit, sans-serif">C</text>
          <path d="M0 160 Q180 144 360 160 L360 200 L0 200 Z" fill="#FDA4AF" opacity="0.45" />
        </svg>
      );
    case 'geography':
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#F0FDFA" />
          {/* Globe */}
          <circle cx="180" cy="100" r="74" fill="#38BDF8" stroke="#0D9488" strokeWidth="3" />
          <path d="M140 62 C164 52 178 72 172 92 C166 112 184 128 168 152 C144 146 124 118 128 88 Z" fill="#34D399" />
          <path d="M198 54 C224 58 242 82 238 112 C226 128 202 124 196 102 C192 84 190 66 198 54 Z" fill="#10B981" />
          {/* Compass */}
          <circle cx="64" cy="144" r="28" fill="#FFFFFF" stroke="#0D9488" strokeWidth="3" />
          <polygon points="64,122 70,144 64,166 58,144" fill="#F43F5E" />
          <text x="64" y="112" textAnchor="middle" fill="#115E59" fontSize="11" fontWeight="800">N</text>
          {/* Mountain & Sun */}
          <polygon points="274,174 304,116 334,174" fill="#0F766E" />
          <polygon points="294,135 304,116 314,135 304,130" fill="#FFFFFF" />
          <circle cx="300" cy="48" r="18" fill="#FBBF24" />
        </svg>
      );
    case 'history':
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#FFFBEB" />
          <circle cx="290" cy="48" r="24" fill="#FDE047" />
          {/* Pyramids */}
          <polygon points="56,166 130,68 204,166" fill="#F59E0B" />
          <polygon points="130,68 204,166 154,166" fill="#D97706" />
          <polygon points="164,166 226,86 288,166" fill="#FBBF24" />
          {/* Scroll */}
          <rect x="242" y="106" width="76" height="54" rx="8" fill="#FEF3C7" stroke="#92400E" strokeWidth="2.5" />
          <line x1="256" y1="124" x2="304" y2="124" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          <line x1="256" y1="138" x2="294" y2="138" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 166 L360 166 L360 200 L0 200 Z" fill="#FDE68A" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 360 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="360" height="200" fill="#EEF2FF" />
          <circle cx="90" cy="96" r="46" fill="#C7D2FE" />
          <rect x="150" y="54" width="136" height="92" rx="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="3" />
          <circle cx="186" cy="100" r="16" fill="#4F46E5" />
          <rect x="216" y="84" width="52" height="12" rx="6" fill="#E0E7FF" />
          <rect x="216" y="104" width="38" height="12" rx="6" fill="#818CF8" />
        </svg>
      );
  }
};

export const InterestIllustration: React.FC<{
  interestKey: 'dinosaurs' | 'space' | 'treasure' | 'storyland' | 'volcano' | 'code';
  className?: string;
}> = ({ interestKey, className = 'w-full h-32' }) => {
  switch (interestKey) {
    case 'dinosaurs':
      return (
        <svg viewBox="0 0 280 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="150" fill="#ECFDF5" />
          <path d="M0 116 Q140 96 280 116 L280 150 L0 150 Z" fill="#34D399" />
          {/* Friendly Green Dino */}
          <path d="M96 118 C96 86 122 78 138 78 L142 52 C142 36 164 34 172 48 C178 58 172 74 156 76 L156 118 Z" fill="#059669" />
          <circle cx="158" cy="52" r="4" fill="#FFFFFF" />
          <circle cx="159" cy="52" r="2" fill="#0F172A" />
          {/* Fossil spiral */}
          <circle cx="222" cy="104" r="16" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          <path d="M222 104 m-6 0 a6 6 0 1 0 12 0 a9 9 0 1 0 -18 0" stroke="#92400E" strokeWidth="2" fill="none" />
          {/* Ferns */}
          <path d="M44 122 Q32 90 54 78 Q58 98 44 122 Z" fill="#10B981" />
          <path d="M56 122 Q72 94 82 86 Q76 106 56 122 Z" fill="#047857" />
        </svg>
      );
    case 'space':
      return (
        <svg viewBox="0 0 280 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="150" fill="#0F172A" />
          <circle cx="48" cy="40" r="18" fill="#FBBF24" />
          <circle cx="144" cy="78" r="32" fill="#38BDF8" />
          <path d="M126 62 Q144 74 162 60" stroke="#34D399" strokeWidth="10" strokeLinecap="round" />
          <circle cx="232" cy="46" r="14" fill="#FB7185" />
          <ellipse cx="232" cy="46" rx="26" ry="7" transform="rotate(-15 232 46)" stroke="#FDE68A" strokeWidth="3" fill="none" />
          <circle cx="90" cy="30" r="2" fill="#FFFFFF" />
          <circle cx="195" cy="24" r="2" fill="#FDE68A" />
          <circle cx="242" cy="112" r="2" fill="#FFFFFF" />
          <circle cx="52" cy="118" r="2" fill="#BAE6FD" />
        </svg>
      );
    case 'treasure':
      return (
        <svg viewBox="0 0 280 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="150" fill="#FFFBEB" />
          <path d="M24 126 Q72 86 130 106 T248 64" stroke="#F59E0B" strokeWidth="6" strokeDasharray="8 8" fill="none" />
          {/* Treasure Chest */}
          <rect x="176" y="74" width="68" height="46" rx="8" fill="#B45309" stroke="#78350F" strokeWidth="3" />
          <path d="M176 86 H244" stroke="#FBBF24" strokeWidth="6" />
          <rect x="204" y="80" width="12" height="16" rx="3" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />
          {/* Gold Coins */}
          <circle cx="76" cy="96" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
          <text x="76" y="101" textAnchor="middle" fill="#78350F" fontSize="13" fontWeight="800">10</text>
          <circle cx="120" cy="64" r="14" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
          <text x="120" y="69" textAnchor="middle" fill="#78350F" fontSize="13" fontWeight="800">+</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 280 150" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="150" fill="#FFF1F2" />
          <path d="M0 118 Q140 96 280 118 L280 150 L0 150 Z" fill="#FECDD3" />
          {/* Book */}
          <path d="M74 114 Q106 102 140 114 L140 62 Q106 50 74 62 Z" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
          <path d="M140 114 Q174 102 206 114 L206 62 Q174 50 140 62 Z" fill="#FFF5F5" stroke="#E11D48" strokeWidth="2.5" />
          {/* Magic sparks */}
          <path d="M140 34 L144 42 L152 46 L144 50 L140 58 L136 50 L128 46 L136 42 Z" fill="#F59E0B" />
          <circle cx="102" cy="40" r="4" fill="#FB7185" />
          <circle cx="178" cy="36" r="4" fill="#38BDF8" />
        </svg>
      );
  }
};

export const QuizVisualIllustration: React.FC<{
  hint?: 'plants' | 'space' | 'numbers' | 'shapes' | 'story' | 'globe' | 'history';
}> = ({ hint = 'plants' }) => {
  if (hint === 'plants') {
    // Matches Page 8 example: sun, clouds, seed -> sprout -> leaves -> flower in soil
    return (
      <svg viewBox="0 0 420 170" className="w-full h-40 rounded-xl border border-sky-100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plant growth stages diagram">
        <rect width="420" height="170" fill="#E0F2FE" />
        {/* Sun */}
        <circle cx="56" cy="42" r="20" fill="#FBBF24" />
        <g stroke="#F59E0B" strokeWidth="3" strokeLinecap="round">
          <line x1="56" y1="12" x2="56" y2="18" />
          <line x1="56" y1="66" x2="56" y2="72" />
          <line x1="26" y1="42" x2="32" y2="42" />
          <line x1="80" y1="42" x2="86" y2="42" />
        </g>
        {/* Clouds */}
        <path d="M148 42 H194 A10 10 0 0 0 188 24 A14 14 0 0 0 160 22 A10 10 0 0 0 148 42 Z" fill="#FFFFFF" />
        <path d="M298 52 H346 A10 10 0 0 0 340 34 A14 14 0 0 0 312 32 A10 10 0 0 0 298 52 Z" fill="#FFFFFF" />
        {/* Soil */}
        <rect x="0" y="132" width="420" height="38" fill="#78350F" />
        <rect x="0" y="128" width="420" height="6" fill="#22C55E" />
        {/* Stage 1: Seed */}
        <ellipse cx="64" cy="122" rx="9" ry="6" transform="rotate(-25 64 122)" fill="#92400E" />
        {/* Stage 2: Sprout */}
        <path d="M148 132 V106" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="140" cy="106" rx="8" ry="4" transform="rotate(-25 140 106)" fill="#4ADE80" />
        <ellipse cx="156" cy="106" rx="8" ry="4" transform="rotate(25 156 106)" fill="#4ADE80" />
        {/* Stage 3: Young Plant + Roots */}
        <path d="M242 132 V80" stroke="#15803D" strokeWidth="4.5" strokeLinecap="round" />
        <ellipse cx="229" cy="106" rx="11" ry="5" transform="rotate(-20 229 106)" fill="#22C55E" />
        <ellipse cx="255" cy="94" rx="11" ry="5" transform="rotate(20 255 94)" fill="#22C55E" />
        <path d="M242 132 L230 152 M242 132 L244 156 M242 132 L254 150" stroke="#FDE68A" strokeWidth="2" />
        {/* Stage 4: Flowering Plant */}
        <path d="M342 132 V62" stroke="#15803D" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="328" cy="104" rx="12" ry="6" transform="rotate(-20 328 104)" fill="#22C55E" />
        <ellipse cx="356" cy="92" rx="12" ry="6" transform="rotate(20 356 92)" fill="#22C55E" />
        <circle cx="342" cy="48" r="14" fill="#FB7185" />
        <circle cx="342" cy="48" r="6" fill="#FDE047" />
        <path d="M342 132 L328 154 M342 132 L344 158 M342 132 L356 152" stroke="#FDE68A" strokeWidth="2" />
      </svg>
    );
  }
  if (hint === 'space') return <InterestIllustration interestKey="space" className="w-full h-36 rounded-xl" />;
  if (hint === 'numbers' || hint === 'shapes') return <WorldBannerIllustration worldKey="maths" className="w-full h-36 rounded-xl" />;
  if (hint === 'story') return <WorldBannerIllustration worldKey="english" className="w-full h-36 rounded-xl" />;
  if (hint === 'globe') return <WorldBannerIllustration worldKey="geography" className="w-full h-36 rounded-xl" />;
  return <WorldBannerIllustration worldKey="history" className="w-full h-36 rounded-xl" />;
};

export const RedOrangeDoorIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-9' }) => (
  <svg viewBox="0 0 44 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="redOrangeDoorGrad" x1="8" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
    </defs>
    {/* Door Frame */}
    <path d="M5 44 V20 C5 10.6 12.6 3 22 3 C31.4 3 39 10.6 39 20 V44 Z" fill="#7C2D12" />
    {/* Arched Red-Orange Door */}
    <path d="M8 44 V20 C8 12.3 14.3 6 22 6 C29.7 6 36 12.3 36 20 V44 Z" fill="url(#redOrangeDoorGrad)" stroke="#FED7AA" strokeWidth="1.5" />
    {/* Decorative Door Panels */}
    <path d="M13 20 C13 15 17 11 22 11 C27 11 31 15 31 20 V24 H13 Z" fill="#C2410C" opacity="0.45" />
    <rect x="13" y="28" width="18" height="11" rx="2" fill="#9A3412" opacity="0.4" />
    {/* Brass Handle & Glow */}
    <circle cx="30" cy="27" r="2.6" fill="#FDE047" stroke="#92400E" strokeWidth="1" />
    {/* Door Step */}
    <rect x="3" y="42" width="38" height="4" rx="2" fill="#FDBA74" />
  </svg>
);

export const DarkCloudsSkyBackdrop: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="darkSkyGrad" x1="0" y1="0" x2="1440" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#090D16" />
        <stop offset="45%" stopColor="#131B2E" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </linearGradient>
    </defs>
    <rect width="1440" height="160" fill="url(#darkSkyGrad)" />
    {/* Twinkling Sky Stars */}
    <circle cx="95" cy="28" r="1.8" fill="#FDE68A" opacity="0.85" />
    <circle cx="240" cy="18" r="1.4" fill="#BAE6FD" opacity="0.7" />
    <circle cx="430" cy="34" r="2" fill="#FDE68A" opacity="0.75" />
    <circle cx="670" cy="20" r="1.6" fill="#FFFFFF" opacity="0.7" />
    <circle cx="890" cy="30" r="2" fill="#FDE68A" opacity="0.85" />
    <circle cx="1140" cy="18" r="1.5" fill="#BAE6FD" opacity="0.75" />
    <circle cx="1320" cy="38" r="2.2" fill="#FDE68A" opacity="0.85" />
    {/* Back Dark Cloud Layer */}
    <path
      d="M-40 160 V112 Q20 78 90 100 Q150 64 235 92 Q320 56 410 92 Q495 66 575 98 Q660 62 760 94 Q850 68 935 98 Q1030 62 1125 94 Q1220 66 1310 96 Q1390 74 1480 105 V160 Z"
      fill="#1E293B"
      opacity="0.9"
    />
    {/* Front Midnight Cloud Silhouette */}
    <path
      d="M-20 160 V126 Q45 96 125 118 Q200 84 295 114 Q385 88 470 116 Q560 82 655 112 Q745 86 835 118 Q925 84 1020 116 Q1115 90 1205 118 Q1300 88 1390 114 Q1430 104 1460 118 V160 Z"
      fill="#0F172A"
      opacity="0.95"
    />
  </svg>
);

export const BlueStageCharactersIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 560 410" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Colourful illustrated Schoola animal friends exploring books, music, science and football">
    <defs>
      <linearGradient id="foxFur" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      <linearGradient id="dinoGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#16A34A" />
      </linearGradient>
      <linearGradient id="catPurple" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4338CA" />
        <stop offset="100%" stopColor="#1E1B4B" />
      </linearGradient>
      <radialGradient id="stageGlow" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Soft background stage glow + subtle doodle icons */}
    <circle cx="290" cy="210" r="190" fill="url(#stageGlow)" />
    <g opacity="0.24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="64" cy="70" r="16" />
      <ellipse cx="64" cy="70" rx="28" ry="8" transform="rotate(-20 64 70)" />
      <path d="M132 32 L144 44 M144 32 L132 44" />
      <polygon points="486,44 504,74 468,74" />
      <text x="454" y="132" fill="#FFFFFF" stroke="none" fontSize="18" fontWeight="800" fontFamily="Outfit, sans-serif">2+3=5</text>
      <path d="M510 218 Q522 204 534 218" />
    </g>

    {/* Stage Floor Shadow */}
    <ellipse cx="286" cy="364" rx="215" ry="22" fill="#0F172A" opacity="0.22" />

    {/* 1. SCHOLAR FOX (Left-Center) */}
    <g transform="translate(115, 76)">
      {/* Fluffy Fox Tail */}
      <path d="M12 210 C-36 206 -52 162 -22 138 C-4 154 6 184 24 198 Z" fill="#EA580C" />
      <path d="M-22 138 C-34 148 -38 164 -26 174 C-14 166 -12 150 -22 138 Z" fill="#FFF7ED" />
      {/* Body & Blue Tunic */}
      <path d="M28 148 C28 124 88 124 88 148 L96 226 H20 Z" fill="#1D4ED8" />
      <path d="M40 132 L58 154 L76 132 Z" fill="#FFF7ED" />
      {/* Legs & Shoes */}
      <rect x="34" y="224" width="16" height="44" rx="8" fill="#EA580C" />
      <rect x="66" y="224" width="16" height="44" rx="8" fill="#EA580C" />
      <ellipse cx="42" cy="272" rx="15" ry="9" fill="#FFFFFF" />
      <ellipse cx="74" cy="272" rx="15" ry="9" fill="#FFFFFF" />
      {/* Fox Ears */}
      <polygon points="18,46 8,2 50,24" fill="#EA580C" />
      <polygon points="20,40 14,12 42,26" fill="#334155" />
      <polygon points="98,46 108,2 66,24" fill="#EA580C" />
      <polygon points="96,40 102,12 74,26" fill="#334155" />
      {/* Head */}
      <ellipse cx="58" cy="74" rx="50" ry="44" fill="url(#foxFur)" />
      {/* White Cheeks */}
      <path d="M10 78 Q34 68 58 98 Q82 68 106 78 Q94 114 58 118 Q22 114 10 78 Z" fill="#FFF7ED" />
      {/* Glasses */}
      <circle cx="38" cy="68" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
      <circle cx="78" cy="68" r="16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
      <line x1="54" y1="68" x2="62" y2="68" stroke="#0F172A" strokeWidth="4" />
      <circle cx="40" cy="68" r="6" fill="#0F172A" />
      <circle cx="42" cy="66" r="2" fill="#FFFFFF" />
      <circle cx="76" cy="68" r="6" fill="#0F172A" />
      <circle cx="78" cy="66" r="2" fill="#FFFFFF" />
      {/* Nose & Smile */}
      <ellipse cx="58" cy="88" rx="7" ry="5" fill="#0F172A" />
      <path d="M48 98 Q58 106 68 98" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Arm holding open book */}
      <path d="M84 150 Q114 166 102 188" stroke="#EA580C" strokeWidth="14" strokeLinecap="round" />
    </g>

    {/* Stack of Colourful Books & Open Flying Book */}
    <g transform="translate(88, 286)">
      <rect x="0" y="42" width="84" height="18" rx="5" fill="#F43F5E" />
      <rect x="8" y="46" width="68" height="10" rx="2" fill="#FFE4E6" />
      <rect x="6" y="24" width="76" height="18" rx="5" fill="#F59E0B" />
      <rect x="14" y="28" width="60" height="10" rx="2" fill="#FEF3C7" />
      <rect x="2" y="6" width="80" height="18" rx="5" fill="#10B981" />
      <rect x="10" y="10" width="64" height="10" rx="2" fill="#D1FAE5" />
    </g>
    {/* Open Magic Storybook */}
    <g transform="translate(155, 225) rotate(-8)">
      <path d="M0 44 Q32 32 60 44 L60 6 Q32 -6 0 6 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
      <path d="M60 44 Q92 32 120 44 L120 6 Q92 -6 60 6 Z" fill="#EFF6FF" stroke="#0284C7" strokeWidth="2.5" />
      <line x1="14" y1="16" x2="46" y2="14" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="25" x2="42" y2="23" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="88" cy="20" r="7" fill="#FBBF24" />
    </g>

    {/* 2. MUSIC DINO (Center) */}
    <g transform="translate(242, 134)">
      {/* Spikes */}
      <polygon points="44,-6 56,-22 66,-4" fill="#38BDF8" />
      <polygon points="68,-2 82,-18 90,4" fill="#38BDF8" />
      {/* Body */}
      <ellipse cx="64" cy="144" rx="44" ry="52" fill="url(#dinoGreen)" />
      <ellipse cx="64" cy="152" rx="28" ry="38" fill="#BBF7D0" />
      {/* Head */}
      <ellipse cx="64" cy="48" rx="44" ry="40" fill="url(#dinoGreen)" />
      {/* Eyes */}
      <circle cx="48" cy="40" r="10" fill="#FFFFFF" />
      <circle cx="80" cy="40" r="10" fill="#FFFFFF" />
      <circle cx="50" cy="40" r="5" fill="#0F172A" />
      <circle cx="82" cy="40" r="5" fill="#0F172A" />
      {/* Big Happy Smile */}
      <path d="M36 60 Q64 84 92 60 Z" fill="#7F1D1D" />
      <polygon points="48,63 54,71 60,63" fill="#FFFFFF" />
      <polygon points="68,63 74,71 80,63" fill="#FFFFFF" />
      {/* Feet */}
      <ellipse cx="46" cy="206" rx="18" ry="11" fill="#15803D" />
      <ellipse cx="82" cy="206" rx="18" ry="11" fill="#15803D" />
      {/* Acoustic Ukulele */}
      <g transform="translate(24, 118) rotate(-18)">
        <rect x="52" y="12" width="52" height="10" rx="4" fill="#92400E" />
        <ellipse cx="32" cy="18" rx="24" ry="19" fill="#F59E0B" stroke="#92400E" strokeWidth="3" />
        <circle cx="36" cy="18" r="7" fill="#78350F" />
        <line x1="22" y1="18" x2="98" y2="17" stroke="#FEF3C7" strokeWidth="1.5" />
      </g>
      {/* Musical Notes */}
      <text x="108" y="88" fill="#FDE047" fontSize="22" fontWeight="800">♪</text>
      <text x="126" y="66" fill="#FBBF24" fontSize="18" fontWeight="800">♫</text>
    </g>

    {/* 3. EXPLORER CAT / PANTHER (Right) */}
    <g transform="translate(366, 94)">
      {/* Tail */}
      <path d="M98 192 C142 184 152 132 126 112" stroke="#1E1B4B" strokeWidth="14" strokeLinecap="round" fill="none" />
      {/* Sporty Shorts & Jersey */}
      <rect x="26" y="124" width="76" height="62" rx="20" fill="#FFFFFF" />
      <rect x="24" y="172" width="80" height="32" rx="10" fill="#F97316" />
      {/* Legs & Sneakers */}
      <rect x="34" y="202" width="16" height="54" rx="8" fill="#1E1B4B" />
      <rect x="76" y="202" width="16" height="40" rx="8" fill="#1E1B4B" />
      <rect x="26" y="252" width="32" height="14" rx="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
      <rect x="70" y="236" width="32" height="14" rx="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
      {/* Cat Ears */}
      <polygon points="22,42 14,2 52,24" fill="#1E1B4B" />
      <polygon points="26,36 20,12 46,26" fill="#F472B6" />
      <polygon points="106,42 114,2 76,24" fill="#1E1B4B" />
      <polygon points="102,36 108,12 82,26" fill="#F472B6" />
      {/* Head */}
      <ellipse cx="64" cy="68" rx="48" ry="42" fill="url(#catPurple)" />
      <ellipse cx="64" cy="80" rx="30" ry="22" fill="#4F46E5" opacity="0.65" />
      {/* Eyes */}
      <circle cx="46" cy="60" r="9" fill="#FFFFFF" />
      <circle cx="82" cy="60" r="9" fill="#FFFFFF" />
      <circle cx="46" cy="60" r="4.5" fill="#0F172A" />
      <circle cx="82" cy="60" r="4.5" fill="#0F172A" />
      {/* Smile */}
      <path d="M42 82 Q64 98 86 82 Z" fill="#FFFFFF" />
      {/* Football */}
      <g transform="translate(88, 248)">
        <circle cx="0" cy="0" r="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
        <polygon points="0,-10 9,-3 6,8 -6,8 -9,-3" fill="#0F172A" />
      </g>
    </g>
  </svg>
);

