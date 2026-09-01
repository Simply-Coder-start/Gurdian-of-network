import React from 'react';

export const StatTileGrid = ({ activeSources = 1287, suspiciousCount = 12, latencyMs = 337, confidence = 94.2 }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
      <div className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630]">
        <p className="text-[10px] text-gray-400 uppercase">Active Sources</p>
        <p className="text-sm font-bold text-white mt-0.5">{activeSources.toLocaleString()}</p>
      </div>

      <div className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630]">
        <p className="text-[10px] text-gray-400 uppercase">Suspicious</p>
        <p className={`text-sm font-bold mt-0.5 ${suspiciousCount > 0 ? 'text-[#E8622F]' : 'text-white'}`}>
          {suspiciousCount}
        </p>
      </div>

      <div className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630]">
        <p className="text-[10px] text-gray-400 uppercase">Latency</p>
        <p className="text-sm font-bold text-[#51F0E3] mt-0.5">{latencyMs}ms</p>
      </div>

      <div className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630]">
        <p className="text-[10px] text-gray-400 uppercase">Confidence</p>
        <p className="text-sm font-bold text-[#2FD9C8] mt-0.5">{confidence}%</p>
      </div>
    </div>
  );
};
