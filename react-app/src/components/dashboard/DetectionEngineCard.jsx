import React from 'react';
import { Cpu, Info } from 'lucide-react';

export const DetectionEngineCard = ({ engine = { name: 'Deep Flow Neural Model v4.2.1', inferencesPerSec: 1482 } }) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[10px] font-mono text-gray-400 uppercase">Detection Engine</span>
        <h4 className="text-sm font-bold text-white font-sans mt-0.5">{engine.name}</h4>
        <p className="text-[10px] font-mono text-[#2FD9C8] mt-0.5">
          {engine.inferencesPerSec.toLocaleString()} inferences / sec
        </p>
      </div>
      <Cpu className="w-6 h-6 text-[#2FD9C8] shrink-0" />
    </div>
  );
};
