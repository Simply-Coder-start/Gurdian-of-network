import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../utils/severity';

export const LiveThreatStream = ({ threats = [], onInvestigate }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5 border-b border-[#1C2630] pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2FD9C8]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200 font-mono">
            Live Threat Stream
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#E13B3B]/10 border border-[#E13B3B]/30 text-[#E13B3B] text-[10px] font-mono font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E13B3B] animate-pulse" />
          <span>LIVE</span>
        </span>
      </div>

      {/* Stream Items List */}
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-[580px]">
        {threats.map((threat) => {
          const badge = getSeverityBadgeStyle(threat.severity);
          const isExpanded = expandedId === threat.id;

          return (
            <div
              key={threat.id}
              onClick={() => setExpandedId(isExpanded ? null : threat.id)}
              className={`p-3 bg-[#11171E] hover:bg-[#141C24] border rounded-lg transition-colors cursor-pointer space-y-2 ${
                isExpanded ? 'border-[#2FD9C8]/50 shadow-sm' : 'border-[#1C2630] hover:border-[#2FD9C8]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate font-sans">{threat.title}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                  {badge.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>
                  <span className="text-[#2FD9C8]">{threat.sourceIp || threat.source}</span> → <span className="text-gray-300">{threat.destIp || threat.dest}</span>
                </span>
                <span className="text-[#2FD9C8] font-semibold">{threat.anomalyScorePct || threat.anomaly}% Anomaly</span>
              </div>

              {/* MITRE ATT&CK Tag (Only if provided) */}
              {(threat.mitreTechniqueId || threat.mitre) && (
                <div className="text-[10px] text-gray-500 font-mono truncate">
                  {threat.mitreTechniqueId ? `${threat.mitreTechniqueId} – ${threat.mitreTechniqueLabel}` : threat.mitre}
                </div>
              )}

              {/* Expandable Forensic Quick Detail */}
              {isExpanded && (
                <div className="pt-2 border-t border-[#1C2630] space-y-1 font-mono text-[10px] text-gray-300">
                  <div className="flex justify-between">
                    <span>Flow ID:</span> <span className="text-white">{threat.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span> <span className="text-[#E8A23D]">{threat.status || 'Open'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onInvestigate) onInvestigate(threat);
                    }}
                    className="w-full mt-2 py-1 rounded bg-[#2FD9C8] text-gray-950 font-bold text-[10px] hover:bg-[#51F0E3] transition active:scale-95"
                  >
                    Investigate Threat →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
