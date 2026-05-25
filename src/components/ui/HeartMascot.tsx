'use client';
import React from 'react';

/**
 * RaktSetu's friendly chatbot mascot — a cute BLOOD DROP with animated,
 * blinking eyes and a smile. Pure SVG + CSS so it's crisp at any size,
 * themeable, and gently "alive".
 *
 * The eyes blink on a timer via a tiny inline <style> keyframe, and when
 * `talking` is true the smile opens up.
 */
export default function HeartMascot({ size = 30, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <style>{`
        @keyframes rs-blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%, 97%      { transform: scaleY(0.1); }
        }
        @keyframes rs-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-1px); }
        }
        .rs-eyes { animation: rs-blink 4s infinite; transform-origin: center; transform-box: fill-box; }
        .rs-face { animation: rs-bob 3s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
      `}</style>

      {/* Blood drop body */}
      <g className="rs-face">
        <path
          d="M32 4 C32 4 12 28 12 42 C12 53 21 60 32 60 C43 60 52 53 52 42 C52 28 32 4 32 4 Z"
          fill="#ffffff"
        />
        {/* highlight shine */}
        <ellipse cx="24" cy="34" rx="5" ry="8" fill="#ffe3e0" opacity="0.6" />
        {/* blush */}
        <circle cx="21" cy="44" r="3.2" fill="#f9b4ad" opacity="0.75" />
        <circle cx="43" cy="44" r="3.2" fill="#f9b4ad" opacity="0.75" />
        {/* Eyes (blinking) */}
        <g className="rs-eyes" fill="#c0392b">
          <ellipse cx="26" cy="40" rx="3.2" ry={talking ? 4.2 : 3.8} />
          <ellipse cx="38" cy="40" rx="3.2" ry={talking ? 4.2 : 3.8} />
        </g>
        {/* eye sparkles */}
        <circle cx="27.1" cy="38.7" r="1" fill="#fff" />
        <circle cx="39.1" cy="38.7" r="1" fill="#fff" />
        {/* Smile */}
        <path
          d={talking ? 'M27 48 Q32 53 37 48' : 'M28 48 Q32 51 36 48'}
          stroke="#c0392b"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}