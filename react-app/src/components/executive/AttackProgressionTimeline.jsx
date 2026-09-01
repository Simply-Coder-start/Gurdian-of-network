import React from 'react';
import { Clock } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../utils/severity';

export const AttackProgressionTimeline = ({ events = [] }) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3.5 font-mono">
      <div className="flex items-center justify-between border-b border-[#1C2630] pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E8A23D]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            ATTACK PROGRESSION TIMELINE
          </h3>
        </div>
        <span className="text-[10px] text-gray-400">Chronological Event Chain</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
        {events.map((step, idx) => {
          const badge = getSeverityBadgeStyle(step.severity);
          return (
            <div
              key={idx}
              className="p-3 bg-[#11171E] border border-[#1C2630] rounded-xl space-y-1.5 hover:border-[#2FD9C8]/40 transition"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-gray-400">{step.timestamp}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate font-sans">{step.title}</div>
              <div className="text-[10px] text-[#2FD9C8] truncate">{step.sourceIp}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
