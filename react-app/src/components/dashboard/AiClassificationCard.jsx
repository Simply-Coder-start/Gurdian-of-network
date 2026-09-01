import React, { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../utils/severity';

export const AiClassificationCard = ({ data, onInvestigate }) => {
  const [expanded, setExpanded] = useState(true);
  const badge = getSeverityBadgeStyle(data?.severity || 'critical');

  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2FD9C8]" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono">
            AI Classification
          </h2>
        </div>
        <span className="bg-[#2FD9C8]/10 text-[#2FD9C8] text-[10px] uppercase font-semibold font-mono px-2 py-0.5 rounded border border-[#2FD9C8]/25">
          ACTIVE INFERENCE
        </span>
      </div>

      {/* Primary Classification Item */}
      <div
        onClick={() => setExpanded(prev => !prev)}
        className="p-3.5 bg-[#11171E] hover:bg-[#141C24] border border-[#1C2630] rounded-lg space-y-2 cursor-pointer transition-colors"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white font-sans">{data?.title || 'Anomalous Data Exfiltration'}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
            {badge.label}
          </span>
        </div>

        <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
          {data?.description || '4.2 GB payload surge dispatched to unrated external endpoint 194.26.29.112 outside operational window.'}
        </p>

        {expanded && (
          <div className="pt-2 border-t border-[#1C2630] space-y-1 font-mono text-[10px]">
            <div className="flex justify-between text-gray-400">
              <span>Volume Deviation:</span>
              <span className="text-[#E13B3B] font-bold">{data?.volumeDeviation || '+840%'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Byte Entropy:</span>
              <span className="text-[#E8A23D] font-bold">{data?.byteEntropy || '7.82 bits/B'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>IoC Match:</span>
              <span className="text-[#2FD9C8]">{data?.iocMatch || 'APT-29 Profile'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
