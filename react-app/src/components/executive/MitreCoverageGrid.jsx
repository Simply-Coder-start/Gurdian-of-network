import React from 'react';
import { Target } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../utils/severity';

export const MitreCoverageGrid = ({ techniques = [] }) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-[#1C2630] pb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#2FD9C8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            MITRE ATT&amp;CK TECHNIQUE COVERAGE
          </h3>
        </div>
        <span className="text-[10px] text-[#2FD9C8] font-bold">
          {techniques.length} Active Techniques
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        {techniques.map(tech => {
          const badge = getSeverityBadgeStyle(tech.severity || 'medium');
          return (
            <div
              key={tech.techniqueId}
              className={`p-2.5 rounded-lg bg-[#11171E] border ${badge.border} flex items-center justify-between hover:scale-[1.02] transition-transform cursor-pointer`}
            >
              <div className="truncate pr-1">
                <div className={`font-bold ${badge.text}`}>{tech.techniqueId}</div>
                <div className="text-[10px] text-gray-400 font-sans truncate">{tech.label}</div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/50 text-white font-bold">
                {tech.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
