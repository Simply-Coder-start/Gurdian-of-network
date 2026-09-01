import React from 'react';
import { ShieldAlert, AlertOctagon, Activity, CheckCircle2, Radio } from 'lucide-react';

export const SeverityKpiStrip = ({ incidents = [], activeSeverity, onSelectSeverity, onSelectStatus }) => {
  const total = incidents.length;
  const critical = incidents.filter(i => i.severity.toLowerCase() === 'critical').length;
  const high = incidents.filter(i => i.severity.toLowerCase() === 'high').length;
  const medium = incidents.filter(i => i.severity.toLowerCase() === 'medium').length;
  const low = incidents.filter(i => i.severity.toLowerCase() === 'low').length;
  const investigating = incidents.filter(i => i.status.toLowerCase() === 'investigating').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs select-none">
      
      {/* Total Threats */}
      <div
        onClick={() => onSelectSeverity('ALL')}
        className={`p-3 rounded-xl border bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition ${
          activeSeverity === 'ALL' ? 'border-[#2FD9C8] bg-primary/5' : 'border-[#1C2630] hover:border-[#2FD9C8]/40'
        }`}
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">Total Threats</span>
          <ShieldAlert className="w-3.5 h-3.5 text-[#2FD9C8]" />
        </div>
        <div className="text-2xl font-bold text-white">{total}</div>
        <div className="text-[10px] text-gray-500">active feeds</div>
      </div>

      {/* Critical */}
      <div
        onClick={() => onSelectSeverity('CRITICAL')}
        className={`p-3 rounded-xl border bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition ${
          activeSeverity === 'CRITICAL' ? 'border-[#E13B3B] bg-[#E13B3B]/10' : 'border-[#1C2630] hover:border-[#E13B3B]/50'
        }`}
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">Critical</span>
          <span className="w-2 h-2 rounded-full bg-[#E13B3B] animate-ping" />
        </div>
        <div className="text-2xl font-bold text-[#E13B3B]">{critical}</div>
        <div className="text-[10px] text-[#E13B3B]/80 font-bold">Immediate Action</div>
      </div>

      {/* High */}
      <div
        onClick={() => onSelectSeverity('HIGH')}
        className={`p-3 rounded-xl border bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition ${
          activeSeverity === 'HIGH' ? 'border-[#E8622F] bg-[#E8622F]/10' : 'border-[#1C2630] hover:border-[#E8622F]/50'
        }`}
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">High</span>
          <AlertOctagon className="w-3.5 h-3.5 text-[#E8622F]" />
        </div>
        <div className="text-2xl font-bold text-[#E8622F]">{high}</div>
        <div className="text-[10px] text-[#E8622F]/80">Elevated Posture</div>
      </div>

      {/* Medium */}
      <div
        onClick={() => onSelectSeverity('MEDIUM')}
        className={`p-3 rounded-xl border bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition ${
          activeSeverity === 'MEDIUM' ? 'border-[#E8A23D] bg-[#E8A23D]/10' : 'border-[#1C2630] hover:border-[#E8A23D]/50'
        }`}
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">Medium</span>
          <Activity className="w-3.5 h-3.5 text-[#E8A23D]" />
        </div>
        <div className="text-2xl font-bold text-white">{medium}</div>
        <div className="text-[10px] text-gray-500">Standard Priority</div>
      </div>

      {/* Low */}
      <div
        onClick={() => onSelectSeverity('LOW')}
        className={`p-3 rounded-xl border bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition ${
          activeSeverity === 'LOW' ? 'border-[#4C8DFF] bg-[#4C8DFF]/10' : 'border-[#1C2630] hover:border-[#4C8DFF]/50'
        }`}
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">Low</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
        </div>
        <div className="text-2xl font-bold text-gray-300">{low}</div>
        <div className="text-[10px] text-gray-500">Informational</div>
      </div>

      {/* Investigating */}
      <div
        onClick={() => onSelectStatus('INVESTIGATING')}
        className="p-3 rounded-xl border border-[#1C2630] hover:border-[#2FD9C8]/40 bg-[#0D1318] shadow-sm space-y-1 cursor-pointer transition"
      >
        <div className="flex justify-between items-center text-[10px] text-gray-400">
          <span className="uppercase">Investigating</span>
          <Radio className="w-3.5 h-3.5 text-[#51F0E3] animate-pulse" />
        </div>
        <div className="text-2xl font-bold text-[#51F0E3]">{investigating}</div>
        <div className="text-[10px] text-[#51F0E3]/80">In Forensic Queue</div>
      </div>

    </div>
  );
};
