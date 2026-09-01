import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ThreatScoreGauge = ({ score = 90, maxScore = 100, label = 'Excellent' }) => {
  const pct = Math.min(Math.max(score / maxScore, 0), 1);
  const angle = Math.PI - pct * Math.PI;
  const cx = 100;
  const cy = 90;
  const r = 70;
  const markerX = cx + r * Math.cos(angle);
  const markerY = cy - r * Math.sin(angle);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        <defs>
          <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E13B3B" />
            <stop offset="25%" stopColor="#E8622F" />
            <stop offset="50%" stopColor="#E8A23D" />
            <stop offset="75%" stopColor="#2FD9C8" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
        </defs>

        {/* Gauge Background Track */}
        <path
          d="M 30 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="#17222B"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Active Arc */}
        <path
          d="M 30 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="url(#scoreGaugeGrad)"
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* Marker Position Circle */}
        <circle
          cx={markerX}
          cy={markerY}
          r="5"
          fill="#FFFFFF"
          stroke="#0A0D10"
          strokeWidth="2"
        />

        {/* Score Center Text */}
        <text x="100" y="78" textAnchor="middle">
          <tspan className="fill-white font-bold font-mono text-3xl">{score}</tspan>
          <tspan className="fill-gray-400 font-normal font-mono text-sm">/{maxScore}</tspan>
        </text>

        {/* Band Label */}
        <text x="100" y="98" textAnchor="middle" className="fill-[#2FD9C8] font-bold font-mono text-[11px] tracking-wider uppercase">
          {label}
        </text>
      </svg>

      {/* Zero-Trust Inspection Status Row */}
      <div className="w-full pt-2 border-t border-[#1C2630] flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400 text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2FD9C8]" />
          <span>Zero-Trust Inspection</span>
        </span>
        <span className="text-[#2FD9C8] text-[10px] font-bold">SYNCHRONIZED</span>
      </div>
    </div>
  );
};
