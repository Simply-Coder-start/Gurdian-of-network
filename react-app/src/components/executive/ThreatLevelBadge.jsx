import React from 'react';
import { getSeverityBadgeStyle } from '../../utils/severity';

export const ThreatLevelBadge = ({ level = 'high' }) => {
  const badge = getSeverityBadgeStyle(level);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-xs font-bold tracking-wider ${badge.bg} ${badge.border} ${badge.text}`}>
      <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
      <span>THREAT LEVEL: {badge.label}</span>
    </div>
  );
};
