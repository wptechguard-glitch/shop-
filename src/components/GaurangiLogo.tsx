import React from "react";

interface GaurangiLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

const GaurangiLogo: React.FC<GaurangiLogoProps> = ({
  size = 44,
  showText = true,
  className = "",
}) => {
  const w = size;
  const h = showText ? size * 1.35 : size;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 100 ${showText ? 135 : 100}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* Main purple/violet gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#b8a0d4" />
          <stop offset="35%"  stopColor="#9b72cf" />
          <stop offset="70%"  stopColor="#7b4fa8" />
          <stop offset="100%" stopColor="#4a2e7a" />
        </linearGradient>

        {/* Bright highlight gradient for ribbon/handle */}
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ffe47a" />
          <stop offset="50%"  stopColor="#b8a0d4" />
          <stop offset="100%" stopColor="#5a3a8c" />
        </linearGradient>

        {/* Text gradient */}
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#ffe47a" />
          <stop offset="50%"  stopColor="#b8a0d4" />
          <stop offset="100%" stopColor="#ffe47a" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1a0d2e88" />
        </filter>
      </defs>

      {/* ─── Shopping bag body (rounded square) ─── */}
      <rect
        x="8" y="28" width="84" height="70"
        rx="10" ry="10"
        fill="url(#goldGrad)"
        filter="url(#softShadow)"
      />
      {/* Inner shadow / depth on bag */}
      <rect
        x="11" y="31" width="78" height="64"
        rx="8" ry="8"
        fill="none"
        stroke="rgba(255,255,180,0.18)"
        strokeWidth="1.5"
      />

      {/* ─── Bag handle (arc ribbon shape) ─── */}
      <path
        d="M 30 28 Q 30 4 50 4 Q 70 4 70 28"
        fill="none"
        stroke="url(#ribbonGrad)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Handle inner highlight */}
      <path
        d="M 33 28 Q 33 9 50 9 Q 67 9 67 28"
        fill="none"
        stroke="rgba(255,240,150,0.35)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* ─── "G" letter shape in bag ─── */}
      {/* Outer arc of G */}
      <path
        d="M 68 50
           A 22 22 0 1 0 68 78
           L 68 65 L 54 65 L 54 72 L 62 72
           A 14 14 0 1 1 62 56 L 68 56 Z"
        fill="rgba(0,0,0,0.22)"
        transform="translate(1,1)"
      />
      <path
        d="M 68 50
           A 22 22 0 1 0 68 78
           L 68 65 L 54 65 L 54 72 L 62 72
           A 14 14 0 1 1 62 56 L 68 56 Z"
        fill="rgba(255, 255, 255, 0.95)"
        filter="url(#glow)"
      />

      {/* ─── Woman face silhouette inside G ─── */}
      {/* Face oval */}
      <ellipse cx="44" cy="62" rx="7" ry="9" fill="url(#goldGrad)" opacity="0.85"/>
      {/* Hair flowing left */}
      <path
        d="M 37 58 Q 30 52 32 44 Q 34 37 42 38 Q 48 36 51 42"
        fill="url(#ribbonGrad)"
        opacity="0.9"
      />
      {/* Hair strand curving right */}
      <path
        d="M 51 42 Q 56 48 53 57 Q 51 63 51 68"
        fill="url(#ribbonGrad)"
        opacity="0.8"
      />
      {/* Neck */}
      <rect x="41" y="70" width="6" height="6" rx="2" fill="url(#goldGrad)" opacity="0.7"/>

      {/* ─── Shine overlay on bag ─── */}
      <ellipse cx="30" cy="45" rx="12" ry="6"
        fill="rgba(255,255,220,0.12)" transform="rotate(-20,30,45)" />

      {/* ─── GAURANGI text ─── */}
      {showText && (
        <text
          x="50" y="126"
          textAnchor="middle"
          fontFamily="'Georgia', 'Times New Roman', serif"
          fontSize="12.5"
          fontWeight="700"
          letterSpacing="3.5"
          fill="url(#textGrad)"
          filter="url(#softShadow)"
        >
          GAURANGI
        </text>
      )}
    </svg>
  );
};

export default GaurangiLogo;
