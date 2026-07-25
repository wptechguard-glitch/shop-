import React from "react";

interface GaurangiLogoProps {
  size?: number;
  className?: string;
}

const GaurangiLogo: React.FC<GaurangiLogoProps> = ({
  size = 40,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        {/* Rose gold / Premium gold gradient */}
        <linearGradient id="roseGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3A3B1" />
          <stop offset="40%" stopColor="#E57C90" />
          <stop offset="70%" stopColor="#C24D67" />
          <stop offset="100%" stopColor="#881B34" />
        </linearGradient>
        {/* Royal violet / Pink gradient */}
        <linearGradient id="royalPink" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B1FA2" />
          <stop offset="50%" stopColor="#C2185B" />
          <stop offset="100%" stopColor="#E91E63" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer decorative circular frames */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#roseGold)" strokeWidth="2.5" strokeDasharray="1 1" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="url(#roseGold)" strokeWidth="1" opacity="0.6" />
      
      {/* Outer decorative dots */}
      <circle cx="50" cy="9" r="2" fill="#E57C90" />
      <circle cx="50" cy="91" r="2" fill="#E57C90" />
      <circle cx="9" cy="50" r="2" fill="#E57C90" />
      <circle cx="91" cy="50" r="2" fill="#E57C90" />

      {/* The Elegant "G" shape with floral curves */}
      <path
        d="M 72 38 
           C 68 28, 56 22, 44 24
           C 30 26, 20 38, 20 52
           C 20 68, 32 78, 48 78
           C 62 78, 72 68, 72 55
           L 50 55
           M 72 55 L 72 60
           C 72 68, 66 74, 58 74" 
        fill="none" 
        stroke="url(#royalPink)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        filter="url(#softGlow)"
      />

      {/* Inner floral leaf curving from center */}
      <path d="M 50 55 C 50 48, 56 42, 62 42" fill="none" stroke="url(#roseGold)" strokeWidth="3" strokeLinecap="round" />
      <path d="M 62 42 L 56 46 Z" fill="url(#roseGold)" />
      
      {/* Star Sparkle at top right */}
      <path d="M 72 26 L 74 30 L 78 32 L 74 34 L 72 38 L 70 34 L 66 32 L 70 30 Z" fill="url(#roseGold)" />
    </svg>
  );
};

export default GaurangiLogo;
