import React from 'react';

export const StatusBadge = ({ text, severity = 'ONLINE', size = 'md' }) => {
  const upper = (severity || text || '').toUpperCase();
  
  let dotColor = 'bg-primary';
  let textColor = 'text-primary';
  let borderColor = 'border-primary/30';
  let bgColor = 'bg-primary/10';

  if (['CRITICAL', 'ERROR', 'OFFLINE', 'HIGH'].includes(upper)) {
    dotColor = 'bg-error';
    textColor = 'text-error';
    borderColor = 'border-error/40';
    bgColor = 'bg-error/10';
  } else if (['DEGRADED', 'WARNING', 'MEDIUM'].includes(upper)) {
    dotColor = 'bg-warning';
    textColor = 'text-warning';
    borderColor = 'border-warning/40';
    bgColor = 'bg-warning/10';
  } else if (['ONLINE', 'HEALTHY', 'NORMAL', 'EXCELLENT', 'LOW'].includes(upper)) {
    dotColor = 'bg-primary';
    textColor = 'text-primary';
    borderColor = 'border-primary/40';
    bgColor = 'bg-primary/10';
  } else {
    dotColor = 'bg-gray-400';
    textColor = 'text-gray-300';
    borderColor = 'border-gray-600';
    bgColor = 'bg-gray-800/40';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${borderColor} ${bgColor} ${px} font-mono uppercase tracking-wider font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span className={textColor}>{text || severity}</span>
    </div>
  );
};
