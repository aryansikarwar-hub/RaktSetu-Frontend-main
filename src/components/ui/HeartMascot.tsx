'use client';
import React from 'react';

/**
 * RaktSetu's friendly chatbot mascot — a cute heart with blinking eyes.
 * Pure SVG so it's crisp at any size and themeable.
 */
export default function HeartMascot({ size = 30, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Heart body */}
      <path
        d="M32 56C32 56 6 40 6 22C6 13.16 13.16 6 22 6C26.5 6 30.5 8.2 32 11.5C33.5 8.2 37.5 6 42 6C50.84 6 58 13.16 58 22C58 40 32 56 32 56Z"
        fill="#fff"
      />
      {/* subtle blush */}
      <circle cx="18" cy="32" r="4" fill="#f9b4ad" opacity="0.7" />
      <circle cx="46" cy="32" r="4" fill="#f9b4ad" opacity="0.7" />
      {/* Eyes */}
      <g fill="#c0392b">
        <ellipse cx="24" cy="26" rx="3.4" ry={talking ? 4.4 : 4} />
        <ellipse cx="40" cy="26" rx="3.4" ry={talking ? 4.4 : 4} />
      </g>
      {/* eye sparkle */}
      <circle cx="25.2" cy="24.6" r="1.1" fill="#fff" />
      <circle cx="41.2" cy="24.6" r="1.1" fill="#fff" />
      {/* Smile */}
      <path
        d={talking ? 'M26 35 Q32 41 38 35' : 'M27 35 Q32 39 37 35'}
        stroke="#c0392b"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
