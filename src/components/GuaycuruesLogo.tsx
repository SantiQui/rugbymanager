import React from 'react';

interface GuaycuruesLogoProps {
  className?: string; // custom styling
  iconOnly?: boolean; // toggle showing text alongside the icon
  showUsr?: boolean;  // toggle showing the Union Santafesina text
}

export default function GuaycuruesLogo({ className = 'h-10', iconOnly = false, showUsr = true }: GuaycuruesLogoProps) {
  return (
    <div className={`flex items-center gap-3 font-club select-none ${className}`}>
      {/* High-Fidelity Silhouette SVG representing the Maroon Warrior of Guaycurúes Sunchales */}
      <div className="relative flex items-center justify-center shrink-0 w-12 h-12 rounded-xl bg-zinc-950 border border-[#8C3A2B]/20 shadow-lg shadow-black/40 overflow-hidden">
        <svg 
          viewBox="0 0 100 100" 
          className="w-10 h-10 select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Logo Theme Color: #8C3A2B (Maroon / Terracotta red) */}
          <g transform="translate(4, 4)">
            {/* 1. Long Straight Hair flowing backward diagonally to the bottom-left */}
            <path d="M 52 16 L 16 64" stroke="#8C3A2B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 56 12 L 20 68" stroke="#8C3A2B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 60 8  L 24 72" stroke="#8C3A2B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 64 4  L 28 76" stroke="#8C3A2B" strokeWidth="4" strokeLinecap="round" />
            <path d="M 68 0  L 32 80" stroke="#8C3A2B" strokeWidth="4" strokeLinecap="round" />

            {/* 2. Head Profile Base */}
            <path 
              d="M 45 22 C 55 18, 68 22, 72 28 C 74 32, 70 38, 62 42 C 58 44, 52 42, 49 40 C 46 38, 44 32, 45 22" 
              fill="#8C3A2B" 
              opacity="0.15"
            />

            {/* 3. Warrior facial outline - Cheek, strong brow, sharp hooked nose, lips, jaw, and chin facing right */}
            <path 
              d="M 64 28 L 78 30 L 66 38 L 81 42 L 67 49 L 71 54 L 64 57 L 57 59 C 53 58, 48 50, 48 45 Z" 
              fill="#8C3A2B"
              stroke="#8C3A2B"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* 4. Native Necklace collar with woven details (diamond mesh base) */}
            <path 
              d="M 38 65 Q 52 78 68 65" 
              fill="none" 
              stroke="#8C3A2B" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
            {/* Chevron-styled weave pattern dots */}
            <path 
              d="M 34 70 Q 52 84 72 70" 
              fill="none" 
              stroke="#8C3A2B" 
              strokeWidth="2.5" 
              strokeDasharray="2,3.5"
              strokeLinecap="round"
            />

            {/* 5. Ear ornament / big hoop earring representing the chief's status */}
            <circle cx="50" cy="46" r="4.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            <circle cx="50" cy="46" r="1.5" fill="#8C3A2B" />

            {/* 6. Forehead Headband */}
            <path 
              d="M 46 30 Q 54 22 63 32" 
              fill="none" 
              stroke="#FFFFFF" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col text-left">
          {/* Primary Logo text stylized in bold serif italic with the Maroon identity */}
          <span className="font-sans font-black tracking-tight text-white uppercase text-base leading-none italic md:text-lg">
            GUAYCURÚES
          </span>
          <div className="flex items-center gap-1.5 leading-none mt-0.5">
            <span className="font-sans font-bold text-[10px] md:text-xs text-[#2ECC71] tracking-wider uppercase">
              Rugby Sunchales
            </span>
            {showUsr && (
              <span className="inline-flex items-center rounded bg-[#2ECC71]/10 px-1 py-0.2 text-[8px] font-extrabold text-[#2ECC71] border border-[#2ECC71]/20 font-mono tracking-tight uppercase">
                USR
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
