import React from 'react';

export const RiskGauge = ({ score = 90, maxScore = 100, label = "Excellent" }) => {
  // Score percentage from 0 to 1
  const pct = Math.min(Math.max(score / maxScore, 0), 1);
  
  // Angle for marker: 180 degrees arc (from PI to 0)
  const angle = Math.PI - (pct * Math.PI);
  const cx = 100;
  const cy = 90;
  const r = 70;
  const markerX = cx + r * Math.cos(angle);
  const markerY = cy - r * Math.sin(angle);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
        <defs>
          <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4450" />
            <stop offset="25%" stopColor="#F2994A" />
            <stop offset="50%" stopColor="#FFB963" />
            <stop offset="75%" stopColor="#22D3C7" />
            <stop offset="100%" stopColor="#51F0E3" />
          </linearGradient>
        </defs>

        {/* Gauge Track Background */}
        <path
          d="M 30 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="#1B2B2E"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Gauge Active Colored Arc */}
        <path
          d="M 30 90 A 70 70 0 0 1 170 90"
          fill="none"
          stroke="url(#riskGaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Position Marker Circle */}
        <circle
          cx={markerX}
          cy={markerY}
          r="5"
          fill="#FFFFFF"
          stroke="#0F1419"
          strokeWidth="2"
          className="shadow-md"
        />

        {/* Score Center Text */}
        <text x="100" y="78" textAnchor="middle">
          <tspan className="fill-white font-bold font-mono text-3xl">{score}</tspan>
          <tspan className="fill-gray-400 font-normal font-mono text-sm">/{maxScore}</tspan>
        </text>

        {/* Status Label */}
        <text x="100" y="98" textAnchor="middle" className="fill-primary font-semibold text-xs tracking-wider uppercase">
          {label}
        </text>
      </svg>
    </div>
  );
};
