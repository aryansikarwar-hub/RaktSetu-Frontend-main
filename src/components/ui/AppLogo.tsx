'use client';

import React, { memo } from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

/**
 * RaktSetu logo — a self-contained SVG blood-drop with a subtle bridge ("setu")
 * motif. No external image, so it always renders crisp and is fully themeable.
 */
const AppLogo = memo(function AppLogo({ size = 36, className = '', onClick }: AppLogoProps) {
  return (
    <div
      className={`flex items-center flex-shrink-0 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
      onClick={onClick}
    >
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="RaktSetu logo">
        <defs>
          <linearGradient id="rs-drop" x1="24" y1="3" x2="24" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e74c3c" />
            <stop offset="1" stopColor="#c0392b" />
          </linearGradient>
        </defs>
        {/* Blood drop */}
        <path
          d="M24 3.5C24 3.5 8.5 21 8.5 31.5C8.5 40.06 15.44 45 24 45C32.56 45 39.5 40.06 39.5 31.5C39.5 21 24 3.5 24 3.5Z"
          fill="url(#rs-drop)"
        />
        {/* Bridge (setu) + pulse line in white */}
        <path
          d="M14 32 H20 L23 26 L26 36 L29 30 H34"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
});

export default AppLogo;
