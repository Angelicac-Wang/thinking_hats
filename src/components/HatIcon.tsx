import React from 'react';
import { HatType, HAT_CONFIGS } from '../types/hats';

interface HatIconProps {
  hat: HatType;
  className?: string;
  size?: number;
  glow?: boolean;
}

export const HatIcon: React.FC<HatIconProps> = ({
  hat,
  className = '',
  size = 40,
  glow = false,
}) => {
  const config = HAT_CONFIGS[hat];

  // Specific color styles for SVGs
  const hatFills: Record<HatType, { crown: string; brim: string; band: string; highlight: string }> = {
    white: {
      crown: '#F8FAFC',
      brim: '#E2E8F0',
      band: '#94A3B8',
      highlight: '#FFFFFF',
    },
    red: {
      crown: '#EF4444',
      brim: '#DC2626',
      band: '#991B1B',
      highlight: '#FCA5A5',
    },
    black: {
      crown: '#1E293B',
      brim: '#0F172A',
      band: '#475569',
      highlight: '#64748B',
    },
    yellow: {
      crown: '#F59E0B',
      brim: '#D97706',
      band: '#78350F',
      highlight: '#FDE68A',
    },
    green: {
      crown: '#10B981',
      brim: '#059669',
      band: '#064E3B',
      highlight: '#6EE7B7',
    },
    blue: {
      crown: '#3B82F6',
      brim: '#2563EB',
      band: '#1E3A8A',
      highlight: '#93C5FD',
    },
  };

  const colors = hatFills[hat];

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        filter: glow ? `drop-shadow(0 0 12px ${config.glowColor})` : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`glow-${hat}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={colors.highlight} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.crown} stopOpacity="1" />
          </radialGradient>
          <filter id={`shadow-${hat}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Shadow base */}
        <ellipse
          cx="50"
          cy="75"
          rx="42"
          ry="12"
          fill="rgba(0,0,0,0.3)"
          filter="blur(3px)"
        />

        {/* Hat Brim */}
        <path
          d="M 10 70 C 10 60, 90 60, 90 70 C 90 82, 10 82, 10 70 Z"
          fill={colors.brim}
          stroke={colors.band}
          strokeWidth="1.5"
          filter={`url(#shadow-${hat})`}
        />

        {/* Crown Body */}
        <path
          d="M 28 66 C 26 38, 30 25, 48 24 C 54 24, 70 25, 72 38 C 74 48, 72 66, 72 66 Z"
          fill={`url(#glow-${hat})`}
        />

        {/* Top Crease (Fedora Style) */}
        <path
          d="M 36 28 C 44 33, 56 33, 64 28"
          stroke={colors.band}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Hat Ribbon / Band */}
        <path
          d="M 27 60 C 35 64, 65 64, 73 60 C 73 66, 72 67, 72 67 C 65 71, 35 71, 28 67 Z"
          fill={colors.band}
        />

        {/* Subtle Highlight Reflection */}
        <path
          d="M 34 35 C 33 45, 33 55, 35 58"
          stroke={colors.highlight}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      </svg>
    </div>
  );
};
