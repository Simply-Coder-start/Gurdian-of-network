import React from 'react';
import { Sparkles } from 'lucide-react';

export const AiThreatInsightCard = ({ insight }) => {
  if (!insight) return null;

  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex items-start gap-3.5 relative overflow-hidden group hover:border-[#2FD9C8]/50 transition-all duration-300">
      <div className="w-9 h-9 rounded-lg bg-[#2FD9C8]/10 border border-[#2FD9C8]/40 flex items-center justify-center text-[#2FD9C8] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2FD9C8] font-mono flex items-center gap-1.5">
            <span>AI THREAT INSIGHT &amp; EXPLANATION</span>
            <span className="px-1.5 py-0.2 rounded bg-[#2FD9C8]/20 text-[#2FD9C8] text-[10px]">
              CONF: {insight.confidencePct}%
            </span>
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            Model: {insight.modelName}
          </span>
        </div>

        {/* Verbatim Server-Side Explanation Text */}
        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          Outbound anomalous data exfiltration detected from host <strong className="text-white">WORKSTATION-SEC-04 (10.240.12.84)</strong> to external endpoint <strong className="text-[#2FD9C8] font-mono">194.26.29.112</strong> over TLS. Volumetric signature (4.2 GB in 180s) diverges by <strong className="text-[#E13B3B] font-bold">+840%</strong> from baseline profile.
        </p>
      </div>
    </div>
  );
};
