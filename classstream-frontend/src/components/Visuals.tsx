import React from 'react';
import { Link } from 'react-router-dom';

/* ============================================================================
 * 1. SMARTLIST BRAND LOGO
 * Matches the exact 3-shape icon (sky-blue + purple + coral-orange) + Smartlist
 * ========================================================================== */
export const BrandLogo: React.FC<{ dark?: boolean; className?: string }> = ({
  dark = false,
  className = '',
}) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 select-none group focus:outline-none ${className}`}
    >
      <svg
        width="28"
        height="30"
        viewBox="0 0 28 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Top sky-blue circle */}
        <circle cx="9.5" cy="8.5" r="6.5" fill="#63D2FF" />
        {/* Bottom purple circle */}
        <circle cx="9.5" cy="20.5" r="6.5" fill="#7662F6" />
        {/* Intersection dark navy lens */}
        <path
          d="M4.65 14.5C5.85 13.05 7.58 12.15 9.5 12.15C11.42 12.15 13.15 13.05 14.35 14.5C13.15 15.95 11.42 16.85 9.5 16.85C7.58 16.85 5.85 15.95 4.65 14.5Z"
          fill="#1B1642"
        />
        {/* Right coral-orange circle */}
        <circle cx="21" cy="21" r="5" fill="#FF7954" />
      </svg>
      <span className="text-[21px] tracking-tight font-display leading-none">
        <strong className={`font-extrabold ${dark ? 'text-white' : 'text-[#11142D]'}`}>
          Class
        </strong>
        <span className={`font-normal ${dark ? 'text-[#8A8D9F]' : 'text-[#808191]'}`}>
          stream
        </span>
      </span>
    </Link>
  );
};

/* ============================================================================
 * 2. DOT MATRIX DECORATION GRIDS
 * ========================================================================== */
export const DotGrid: React.FC<{
  rows?: number;
  cols?: number;
  color?: string;
  className?: string;
  gap?: number;
}> = ({ rows = 7, cols = 6, color = '#6FD4F2', className = '', gap = 12 }) => {
  const width = (cols - 1) * gap + 6;
  const height = (rows - 1) * gap + 6;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={3 + c * gap}
            cy={3 + r * gap}
            r="1.75"
            fill={color}
          />
        ))
      )}
    </svg>
  );
};

/* ============================================================================
 * 3. 3D ILLUSTRATIONS (Rocket, Checkmark, Shopping Bag, Purple Envelope)
 * ========================================================================== */

/** 3D Toy Rocket blasting off in Section 2 ("FIND YOUR FLOW") */
export const Rocket3D: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="110"
    height="155"
    viewBox="0 0 110 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <defs>
      {/* Rocket white body 3D cylinder gradient */}
      <linearGradient id="rocketBody" x1="28" y1="35" x2="80" y2="55" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#F5F7FB" />
        <stop offset="100%" stopColor="#D5DFEE" />
      </linearGradient>
      {/* Coral-orange nose & fins gradient */}
      <linearGradient id="rocketCoral" x1="40" y1="10" x2="78" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF8563" />
        <stop offset="50%" stopColor="#FF5E3A" />
        <stop offset="100%" stopColor="#D9381E" />
      </linearGradient>
      {/* Window glass cyan gradient */}
      <radialGradient id="rocketWindow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(55 52) rotate(50) scale(16)">
        <stop offset="0%" stopColor="#90E0EF" />
        <stop offset="65%" stopColor="#00B4D8" />
        <stop offset="100%" stopColor="#0077B6" />
      </radialGradient>
      {/* Exhaust flame gradient */}
      <linearGradient id="rocketFlame" x1="52" y1="92" x2="48" y2="132" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="40%" stopColor="#FF9F1C" />
        <stop offset="100%" stopColor="#FF5400" stopOpacity="0" />
      </linearGradient>
      {/* Smoke trail gradient */}
      <linearGradient id="smokeTrail" x1="50" y1="105" x2="45" y2="155" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFD6A5" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FFD6A5" stopOpacity="0" />
      </linearGradient>
      <filter id="rocketShadow" x="0" y="0" width="110" height="150" filterUnits="userSpaceOnUse">
        <feDropShadow dx="-6" dy="12" stdDeviation="8" floodColor="#1D2B4F" floodOpacity="0.18" />
      </filter>
    </defs>

    {/* Soft exhaust vertical trail */}
    <path d="M43 102 L55 102 L59 152 L37 152 Z" fill="url(#smokeTrail)" />

    <g filter="url(#rocketShadow)" transform="rotate(11 56 58)">
      {/* Flame */}
      <path
        d="M47 92 C47 92 42 112 54 126 C66 112 61 92 61 92 Z"
        fill="url(#rocketFlame)"
      />
      <path
        d="M50 92 C50 92 48 106 54 115 C60 106 58 92 58 92 Z"
        fill="#FFF8D6"
      />

      {/* Left Fin */}
      <path
        d="M35 66 C23 72 20 85 22 93 C28 90 34 85 39 84 Z"
        fill="url(#rocketCoral)"
      />
      {/* Right Fin */}
      <path
        d="M73 66 C85 72 88 85 86 93 C80 90 74 85 69 84 Z"
        fill="url(#rocketCoral)"
      />

      {/* Dark nozzle base */}
      <rect x="44" y="86" width="20" height="6" rx="3" fill="#4A5568" />

      {/* Main Fuselage Body */}
      <path
        d="M54 12 C41 24 35 44 35 67 C35 76 38 84 41 88 L67 88 C70 84 73 76 73 67 C73 44 67 24 54 12 Z"
        fill="url(#rocketBody)"
      />

      {/* Nose Cone Coral Cap */}
      <path
        d="M54 12 C46 19 40 30 37.5 41 L70.5 41 C68 30 62 19 54 12 Z"
        fill="url(#rocketCoral)"
      />

      {/* Nose Cone Specular Highlight */}
      <path
        d="M52 16 C47 22 43 30 41.5 39"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      {/* Porthole Outer Ring */}
      <circle cx="54" cy="57" r="12.5" fill="#E2E8F0" />
      <circle cx="54" cy="57" r="10" fill="url(#rocketWindow)" />
      {/* Window specular glint */}
      <ellipse
        cx="50.5"
        cy="53.5"
        rx="3.5"
        ry="2"
        transform="rotate(-30 50.5 53.5)"
        fill="white"
        fillOpacity="0.8"
      />

      {/* Center Front Fin */}
      <rect x="51" y="72" width="6" height="20" rx="3" fill="url(#rocketCoral)" />
    </g>
  </svg>
);

/** 3D Purple Checkmark Icon */
export const Checkmark3D: React.FC<{ className?: string; withCard?: boolean }> = ({
  className = '',
  withCard = false,
}) => {
  if (withCard) {
    return (
      <svg
        width="120"
        height="110"
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
      >
        <defs>
          <linearGradient id="checkGradCard" x1="25" y1="15" x2="85" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9C8CFA" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
          <filter id="cardPlateShadow" x="0" y="15" width="115" height="95" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#3F3385" floodOpacity="0.22" />
          </filter>
          <filter id="checkDrop" x="15" y="0" width="95" height="90" filterUnits="userSpaceOnUse">
            <feDropShadow dx="-4" dy="10" stdDeviation="6" floodColor="#4834D4" floodOpacity="0.32" />
          </filter>
        </defs>
        {/* Tilted white/lavender 3D base plate */}
        <g filter="url(#cardPlateShadow)">
          <rect
            x="24"
            y="42"
            width="68"
            height="46"
            rx="10"
            transform="rotate(-8 58 65)"
            fill="#F4F3FF"
          />
          <rect
            x="32"
            y="54"
            width="36"
            height="5"
            rx="2.5"
            transform="rotate(-8 50 56)"
            fill="#D0CCF8"
          />
          <rect
            x="33"
            y="64"
            width="24"
            height="5"
            rx="2.5"
            transform="rotate(-8 45 66)"
            fill="#E2E0FC"
          />
        </g>
        {/* Big 3D glossy purple checkmark */}
        <g filter="url(#checkDrop)">
          <path
            d="M36 45 L52 61 L88 21"
            stroke="url(#checkGradCard)"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M36 43 L52 59 L88 19"
            stroke="#B8AEFF"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.6"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id="checkGradSmall" x1="8" y1="8" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A393FA" />
          <stop offset="100%" stopColor="#6C5CE7" />
        </linearGradient>
        <filter id="smallCheckShadow" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#6C5CE7" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#smallCheckShadow)">
        <path
          d="M11 23 L19 31 L34 14"
          stroke="url(#checkGradSmall)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

/** 3D Cyan Shopping Bag Icon in Section 2 */
export const ShoppingBag3D: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="46"
    height="48"
    viewBox="0 0 46 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <defs>
      <linearGradient id="bagBody" x1="10" y1="14" x2="36" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#72EFDD" />
        <stop offset="50%" stopColor="#48CAE4" />
        <stop offset="100%" stopColor="#0096C7" />
      </linearGradient>
      <filter id="bagShadow" x="0" y="4" width="46" height="44" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#0096C7" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#bagShadow)" transform="rotate(-6 23 26)">
      {/* Bag Handle */}
      <path
        d="M17 16 V12 C17 8.686 19.686 6 23 6 C26.314 6 29 8.686 29 12 V16"
        stroke="#A8DADC"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Bag 3D trapezoid body */}
      <path
        d="M11 16 C11 14.343 12.343 13 14 13 H32 C33.657 13 35 14.343 35 16 L37 36 C37 38.209 35.209 40 33 40 H13 C10.791 40 9 38.209 9 36 L11 16 Z"
        fill="url(#bagBody)"
      />
      {/* Handle sockets */}
      <circle cx="17" cy="17.5" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="29" cy="17.5" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
    </g>
  </svg>
);

/** 3D Purple/Periwinkle Open Envelope in Section 3 ("Capture everything") */
export const Envelope3D: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="180"
    height="175"
    viewBox="0 0 180 175"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <defs>
      <linearGradient id="envBack" x1="30" y1="20" x2="145" y2="140" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8E8CFA" />
        <stop offset="100%" stopColor="#5D59E2" />
      </linearGradient>
      <linearGradient id="envLeftFlap" x1="22" y1="60" x2="115" y2="145" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9A98FF" />
        <stop offset="100%" stopColor="#7572F6" />
      </linearGradient>
      <linearGradient id="envRightFlap" x1="150" y1="65" x2="65" y2="148" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8582FA" />
        <stop offset="100%" stopColor="#6562EC" />
      </linearGradient>
      <linearGradient id="envBottomFlap" x1="88" y1="92" x2="88" y2="152" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9391FF" />
        <stop offset="100%" stopColor="#6E6BF2" />
      </linearGradient>
      <filter id="envDropShadow" x="0" y="10" width="180" height="165" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="18" stdDeviation="12" floodColor="#342E78" floodOpacity="0.26" />
      </filter>
    </defs>

    {/* Ground shadow */}
    <ellipse cx="90" cy="156" rx="56" ry="10" fill="#2A275C" fillOpacity="0.14" />

    <g filter="url(#envDropShadow)" transform="rotate(-5 90 90)">
      {/* Open Top Triangular Flap */}
      <path
        d="M28 66 L82 22 C86.8 18.2 93.2 18.2 98 22 L152 66 Z"
        fill="url(#envBack)"
      />
      {/* Back interior */}
      <rect x="28" y="64" width="124" height="82" rx="12" fill="#524ECF" />

      {/* White paper letter card sticking out */}
      <rect x="40" y="42" width="100" height="76" rx="8" fill="#FFFFFF" />
      <rect x="54" y="56" width="46" height="5" rx="2.5" fill="#E2E8F0" />
      <rect x="54" y="67" width="70" height="4" rx="2" fill="#EDF2F7" />
      <rect x="54" y="76" width="58" height="4" rx="2" fill="#EDF2F7" />

      {/* Left Fold */}
      <path
        d="M28 66 L96 112 L28 142 C28 142 28 72 28 66 Z"
        fill="url(#envLeftFlap)"
      />
      {/* Right Fold */}
      <path
        d="M152 66 L84 112 L152 142 C152 142 152 72 152 66 Z"
        fill="url(#envRightFlap)"
      />
      {/* Bottom Fold */}
      <path
        d="M28 138 C28 143 32 146 37 146 H143 C148 146 152 143 152 138 L98 98 C93.2 94.5 86.8 94.5 82 98 L28 138 Z"
        fill="url(#envBottomFlap)"
      />
    </g>
  </svg>
);

/* ============================================================================
 * 4. FLOATING TASK CARDS (Exact Replicas from Hero & Section 3)
 * ========================================================================== */

/** Card: Shopping Apple Store (with iOS Calendar TUE 12 + Apple Watch rings) */
export const ShoppingAppleStoreCard: React.FC<{ className?: string; compact?: boolean }> = ({
  className = '',
  compact = false,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 overflow-hidden select-none ${
      compact ? 'p-3' : 'p-3.5'
    } ${className}`}
  >
    {/* Top thin color indicator bar */}
    <div className="flex gap-1.5 mb-2.5">
      <span className="h-1 w-8 rounded-full bg-[#3B82F6]" />
      <span className="h-1 w-5 rounded-full bg-[#FF6B4A]" />
      <span className="h-1 w-6 rounded-full bg-[#F59E0B]" />
    </div>

    <div className="text-[11px] font-bold text-[#11142D] tracking-tight mb-1">
      Shopping Apple Store
    </div>

    <div className="flex items-center justify-between text-[9px] mb-2">
      <span className="text-[#6E7191] font-medium flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-[#11142D]" />
        Apple Watch
      </span>
      <span className="text-[#FF6B4A] font-bold tabular-nums">1279</span>
    </div>

    {/* Miniature iOS Calendar & Watch Widget */}
    <div className="bg-[#F8F9FD] rounded-xl p-2 border border-gray-100 flex gap-2 items-stretch">
      {/* Left: TUE 12 + Watch ring */}
      <div className="flex flex-col justify-between w-[48px] shrink-0">
        <div>
          <div className="text-[7px] font-bold text-[#FF5E3A] uppercase tracking-wider">
            TUE
          </div>
          <div className="text-[18px] font-extrabold text-[#11142D] leading-none tabular-nums">
            12
          </div>
        </div>
        {/* Mini dark watch dial */}
        <div className="mt-1.5 w-9 h-9 rounded-lg bg-[#14172B] flex items-center justify-center relative">
          <svg width="24" height="24" viewBox="0 0 24 24" className=" -rotate-90">
            <circle cx="12" cy="12" r="9" stroke="#FF3B30" strokeWidth="2" fill="none" strokeDasharray="42 60" strokeLinecap="round" />
            <circle cx="12" cy="12" r="6.5" stroke="#4CD964" strokeWidth="2" fill="none" strokeDasharray="30 50" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" stroke="#5AC8FA" strokeWidth="2" fill="none" strokeDasharray="18 40" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Right: Mini schedule bars */}
      <div className="flex-1 flex flex-col justify-between text-[7px] text-[#808191]">
        <div className="bg-[#FFE5E0] text-[#D9381E] rounded px-1.5 py-0.5 font-semibold truncate">
          • Design Sync
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-gray-400 w-5">9AM</span>
          <div className="flex-1 bg-[#E3F8FC] text-[#0096C7] rounded px-1.5 py-0.5 font-semibold truncate">
            Apple Pickup
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[6px] text-gray-400 w-5">10AM</span>
          <div className="flex-1 bg-[#FFF3D1] text-[#D97706] rounded px-1.5 py-0.5 font-semibold truncate">
            Team Review
          </div>
        </div>
        <div className="bg-[#EDE9FE] text-[#6D28D9] rounded px-1.5 py-0.5 font-semibold truncate">
          • Watch Strap
        </div>
      </div>
    </div>

    {/* Bottom footer row */}
    <div className="mt-2 flex items-center justify-between">
      <span className="text-[8px] text-gray-400">Apple Store Fifth Ave</span>
      <div className="flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 rounded bg-[#EBF5FF] text-[#3B82F6] text-[8px] font-bold tabular-nums">
          $ 1279
        </span>
        <span className="w-3.5 h-3.5 rounded-full bg-[#3B5998] text-white text-[8px] font-bold flex items-center justify-center">
          f
        </span>
      </div>
    </div>
  </div>
);

/** Card: Send email (Tue, 15 December, @bill) */
export const SendEmailBillCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 p-3.5 select-none ${className}`}
  >
    <div className="flex gap-1.5 mb-2">
      <span className="h-1 w-6 rounded-full bg-[#FF6B4A]" />
      <span className="h-1 w-8 rounded-full bg-[#3B82F6]" />
      <span className="h-1 w-5 rounded-full bg-[#10B981]" />
    </div>
    <div className="text-[11px] font-bold text-[#11142D] mb-1.5">Send email</div>
    <div className="flex items-center gap-1.5 text-[9px] text-[#6E7191] font-medium mb-2">
      <span className="w-3.5 h-3.5 rounded bg-[#EDE9FE] text-[#7B61FF] flex items-center justify-center text-[8px] font-bold">
        ✓
      </span>
      <span>Tue, 15 December</span>
    </div>
    <p className="text-[8.5px] leading-[1.45] text-[#808191] mb-2.5">
      I wanted to tell you that I had a baby in the hospital so you don&apos;t have to worry about anything.
    </p>
    <div className="flex justify-end">
      <span className="px-2 py-0.5 rounded bg-[#E6F4FF] text-[#3B82F6] text-[8px] font-semibold">
        @bill
      </span>
    </div>
  </div>
);

/** Card: Small Send Email (17 December, Mon) */
export const SendEmailMiniCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 p-3 select-none ${className}`}
  >
    <div className="flex gap-1 mb-1.5">
      <span className="h-1 w-7 rounded-full bg-[#FF6B4A]" />
      <span className="h-1 w-4 rounded-full bg-[#F59E0B]" />
    </div>
    <div className="text-[10.5px] font-bold text-[#11142D] mb-1">Send email</div>
    <div className="flex items-center gap-1.5 text-[8.5px] text-[#6E7191] font-medium mb-1.5">
      <span className="w-3 h-3 rounded bg-[#FFE5E0] text-[#FF5E3A] flex items-center justify-center text-[7px] font-bold">
        📅
      </span>
      <span>17 December, Mon</span>
    </div>
    <p className="text-[8px] leading-[1.4] text-[#808191] line-clamp-2">
      I wanted to tell you that I had a baby in the hospital so you don&apos;t have to worry...
    </p>
  </div>
);

/** Card: Call to Esther Howard (Purple left border accent, 6pm | Tue, 15 December, 8:00 tag) */
export const CallEstherHowardCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 border-l-[3.5px] border-l-[#7B61FF] p-3.5 select-none ${className}`}
  >
    <div className="flex gap-1.5 mb-2">
      <span className="h-1 w-7 rounded-full bg-[#F59E0B]" />
      <span className="h-1 w-5 rounded-full bg-[#10B981]" />
    </div>
    <div className="text-[11px] font-bold text-[#11142D] mb-1.5">
      Call to Esther Howard
    </div>
    <div className="flex items-center gap-2 text-[8.5px] text-[#6E7191] font-medium mb-2">
      <span className="font-semibold text-[#11142D]">6pm</span>
      <span className="text-gray-300">|</span>
      <span className="w-3.5 h-3.5 rounded bg-[#EDE9FE] text-[#7B61FF] flex items-center justify-center text-[7px]">
        📅
      </span>
      <span>Tue, 15 December</span>
    </div>
    <p className="text-[8.5px] leading-[1.45] text-[#808191] mb-2">
      Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat.
    </p>
    <div className="flex justify-end">
      <span className="px-2 py-0.5 rounded bg-[#E6F9F0] text-[#10B981] text-[8px] font-bold tabular-nums">
        8:00
      </span>
    </div>
  </div>
);

/** Card: Finish Project (for Section 3 top-right grid) */
export const FinishProjectCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-card border border-gray-100/80 p-3.5 select-none ${className}`}
  >
    <div className="flex gap-1.5 mb-2">
      <span className="h-1 w-6 rounded-full bg-[#3B82F6]" />
      <span className="h-1 w-6 rounded-full bg-[#7B61FF]" />
    </div>
    <div className="text-[11px] font-bold text-[#11142D] mb-1.5">Finish Project</div>
    <div className="flex items-center gap-1.5 text-[8.5px] text-[#6E7191] font-medium mb-2">
      <span className="w-3.5 h-3.5 rounded bg-[#EDE9FE] text-[#7B61FF] flex items-center justify-center text-[7px]">
        ✓
      </span>
      <span>Tue, 15 December</span>
    </div>
    <p className="text-[8.5px] leading-[1.45] text-[#808191] mb-2">
      I wanted to tell you that I had a baby in the hospital so you don&apos;t have to worry about anything.
    </p>
    <div className="flex justify-end">
      <span className="px-2 py-0.5 rounded bg-[#FFF3D1] text-[#D97706] text-[8px] font-semibold">
        @work
      </span>
    </div>
  </div>
);

/** Hero Main Featured Card: Meet Annette Black (Interactive Checkboxes + Uber Map) */
export const MeetAnnetteBlackCard: React.FC<{
  callChecked: boolean;
  uberChecked: boolean;
  onToggleCall: () => void;
  onToggleUber: () => void;
  className?: string;
}> = ({ callChecked, uberChecked, onToggleCall, onToggleUber, className = '' }) => (
  <div
    className={`bg-white rounded-2xl shadow-smart-float border border-gray-100 p-5 ${className}`}
  >
    {/* Top thin color accent bar */}
    <div className="flex gap-2 mb-3">
      <span className="h-1 w-10 rounded-full bg-[#63D2FF]" />
      <span className="h-1 w-8 rounded-full bg-[#F7C852]" />
    </div>

    <h3 className="text-[15px] font-extrabold text-[#11142D] tracking-tight mb-3.5">
      Meet Annette Black
    </h3>

    <div className="grid grid-cols-2 gap-4 items-start">
      {/* Left sub-column */}
      <div className="pr-2 border-r border-gray-100">
        <button
          type="button"
          onClick={onToggleCall}
          className="flex items-center gap-2 text-left group w-full mb-1 focus:outline-none"
        >
          <span
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
              callChecked
                ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                : 'border-[#63D2FF] bg-[#F0FAFF] group-hover:border-[#3B82F6]'
            }`}
          >
            {callChecked && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span
            className={`text-[11px] font-semibold transition-colors ${
              callChecked ? 'line-through text-gray-400' : 'text-[#11142D]'
            }`}
          >
            Call Annette Black
          </span>
        </button>

        <div className="text-[10px] text-[#808191] pl-6 mb-3 tabular-nums">
          (684) 555-0102
        </div>

        <div className="h-px bg-gray-100 mb-2.5" />

        <div className="text-[10.5px] font-bold text-[#11142D] mb-1">Subject</div>
        <p className="text-[9px] leading-[1.5] text-[#808191]">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.
        </p>
      </div>

      {/* Right sub-column */}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={onToggleUber}
          className="flex items-center gap-2 text-left group w-full mb-2.5 focus:outline-none"
        >
          <span
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
              uberChecked
                ? 'bg-[#3B82F6] border-[#3B82F6] text-white'
                : 'border-[#63D2FF] bg-[#F0FAFF] group-hover:border-[#3B82F6]'
            }`}
          >
            {uberChecked && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6L5 8.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span
            className={`text-[11px] font-semibold transition-colors ${
              uberChecked ? 'line-through text-gray-400' : 'text-[#11142D]'
            }`}
          >
            Order Uber
          </span>
        </button>

        {/* Map Widget */}
        <div className="relative rounded-xl overflow-hidden border border-gray-100 h-[92px] bg-[#EEF2F6]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 160 92"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Map Background & Blocks */}
            <rect width="160" height="92" fill="#F1F4F9" />
            <path d="M0 22 L160 38" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M35 0 L52 92" stroke="#FFFFFF" strokeWidth="5" />
            <path d="M108 0 L92 92" stroke="#FFFFFF" strokeWidth="4" />
            <path d="M0 68 L160 56" stroke="#FFFFFF" strokeWidth="4" />
            {/* Green park patches */}
            <rect x="8" y="42" width="22" height="18" rx="3" fill="#D8F3DC" />
            <rect x="115" y="10" width="32" height="20" rx="4" fill="#D8F3DC" />
            {/* Blue water corner */}
            <path d="M125 65 Q145 60 160 72 L160 92 L120 92 Z" fill="#CAF0F8" />
            {/* Dashed route line */}
            <path
              d="M44 63 Q68 55 82 46"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="3 2"
              fill="none"
            />
            <circle cx="44" cy="63" r="2.5" fill="#3B82F6" />
          </svg>

          {/* Address floating tooltip */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs text-[6.5px] font-semibold text-[#11142D] whitespace-nowrap border border-gray-100">
            2464 Royal Ln. Mesa, New Jersey
          </div>

          {/* Red Map Pin */}
          <div className="absolute top-[34px] left-[51%] -translate-x-1/2">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M8 0C3.58 0 0 3.58 0 8C0 13.25 8 20 8 20C8 20 16 13.25 16 8C16 3.58 12.42 0 8 0Z"
                fill="#FF4D4F"
              />
              <circle cx="8" cy="7.5" r="3" fill="white" />
            </svg>
          </div>
        </div>

        {/* Bottom right Facebook icon */}
        <div className="mt-2 flex justify-end">
          <span className="w-4 h-4 rounded-full bg-[#3B5998] text-white text-[9px] font-bold flex items-center justify-center">
            f
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================================
 * 5. TESTIMONIAL AVATARS (Matching Frame 00:08)
 * ========================================================================== */
export const TestimonialAvatar: React.FC<{
  person: 'ralph' | 'kathryn' | 'albert';
}> = ({ person }) => {
  if (person === 'ralph') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#8E7CF8] overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#8E7CF8" />
          {/* Shoulders / Suit */}
          <path d="M8 40 C8 32 13 29 20 29 C27 29 32 32 32 40" fill="#2D3142" />
          <path d="M17 29 L20 35 L23 29" fill="#FFFFFF" />
          {/* Neck & Head */}
          <rect x="17.5" y="24" width="5" height="6" rx="2" fill="#F1C27D" />
          <circle cx="20" cy="18" r="7" fill="#F1C27D" />
          {/* Hair & Beard */}
          <path d="M13 17 C13 11 27 11 27 17 C26 14 14 14 13 17 Z" fill="#3D2B1F" />
          <path d="M14 20 C14 24 17 25.5 20 25.5 C23 25.5 26 24 26 20 C25 22.5 22.5 23.5 20 23.5 C17.5 23.5 15 22.5 14 20 Z" fill="#3D2B1F" />
          {/* Glasses */}
          <circle cx="17.5" cy="17.5" r="2" stroke="#11142D" strokeWidth="1" fill="none" />
          <circle cx="22.5" cy="17.5" r="2" stroke="#11142D" strokeWidth="1" fill="none" />
          <line x1="19.5" y1="17.5" x2="20.5" y2="17.5" stroke="#11142D" strokeWidth="1" />
        </svg>
      </div>
    );
  }
  if (person === 'kathryn') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#56CFE1] overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#56CFE1" />
          {/* Long dark hair back */}
          <path d="M11 16 C11 10 29 10 29 16 L30 32 L10 32 Z" fill="#1E1B2E" />
          {/* Top / Shirt */}
          <path d="M9 40 C9 33 14 30 20 30 C26 30 31 33 31 40" fill="#FF7954" />
          {/* Neck & Face */}
          <rect x="17.5" y="24" width="5" height="7" rx="2" fill="#F5CBA7" />
          <circle cx="20" cy="18.5" r="6.5" fill="#F5CBA7" />
          {/* Hair bangs */}
          <path d="M13 17 C14 12 26 12 27 17 C24 14 16 14 13 17 Z" fill="#1E1B2E" />
          {/* Smile */}
          <path d="M18 21 Q20 22.8 22 21" stroke="#B05B4C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#F7C852] overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="20" fill="#F7C852" />
        {/* Shirt */}
        <path d="M8 40 C8 32 13 29 20 29 C27 29 32 32 32 40" fill="#3B82F6" />
        {/* Neck & Face */}
        <rect x="17.5" y="24" width="5" height="6" rx="2" fill="#E0AC69" />
        <circle cx="20" cy="18" r="6.8" fill="#E0AC69" />
        {/* Hair */}
        <path d="M13 16.5 C13 11 27 11 27 16.5 C25 13.5 15 13.5 13 16.5 Z" fill="#1A1A2E" />
        {/* Smile */}
        <path d="M18 21 Q20 22.5 22 21" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

/* ============================================================================
 * 6. PARTNER / INTEGRATION LOGOS ROW (Frame 00:03 - 00:05)
 * Google Calendar [31], Gmail, zapier, Trello, Jira, asana
 * ========================================================================== */
export const IntegrationLogosRow: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-10 text-[#4F5265]">
      {/* 1. Google Calendar 31 icon */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Google Calendar">
        <div className="w-6 h-6 rounded border-2 border-[#4F5265] flex items-center justify-center text-[10px] font-extrabold tracking-tighter">
          31
        </div>
      </div>

      {/* 2. Gmail */}
      <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Gmail">
        <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path
            d="M2 2H18C19.1 2 20 2.9 20 4V14C20 15.1 19.1 16 18 16H2C0.9 16 0 15.1 0 14V4C0 2.9 0.9 2 2 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M1 3L10 9.5L19 3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span className="text-[15px] font-medium tracking-tight">Gmail</span>
      </div>

      {/* 3. zapier */}
      <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Zapier">
        <span className="text-[16px] font-extrabold border-b-[2.5px] border-[#4F5265] leading-none pb-0.5 mr-0.5">
          _
        </span>
        <span className="text-[16px] font-bold tracking-tight">zapier</span>
      </div>

      {/* 4. Trello */}
      <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Trello">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="currentColor">
          <rect x="1" y="1" width="16" height="16" rx="3" fill="currentColor" />
          <rect x="3.5" y="3.5" width="4.2" height="9.5" rx="1" fill="white" />
          <rect x="10.2" y="3.5" width="4.2" height="5.5" rx="1" fill="white" />
        </svg>
        <span className="text-[16px] font-extrabold tracking-tight">Trello</span>
      </div>

      {/* 5. Jira */}
      <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Jira">
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
          <path
            d="M9.5 2L3 8.5L6.5 12L13 5.5L9.5 2Z"
            fill="currentColor"
          />
          <path
            d="M14.5 7L8 13.5L11.5 17L18 10.5L14.5 7Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
        </svg>
        <span className="text-[16px] font-bold tracking-tight">Jira</span>
      </div>

      {/* 6. asana */}
      <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" title="Asana">
        <svg width="17" height="16" viewBox="0 0 18 16" fill="currentColor">
          <circle cx="9" cy="4" r="3.2" />
          <circle cx="4.2" cy="12" r="3.2" />
          <circle cx="13.8" cy="12" r="3.2" />
        </svg>
        <span className="text-[16px] font-semibold tracking-tight">asana</span>
      </div>
    </div>
  );
};
