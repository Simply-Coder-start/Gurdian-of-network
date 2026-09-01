import React from 'react';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

export const ComplianceStatusStrip = ({ status = { passiveMonitoringActive: true, mode: 'READ-ONLY', payloadInspection: 'Headers Only', returnPath: 'None (TAP)' } }) => {
  // Assert safe literals; warn if server misreports
  const isSafe =
    status.mode === 'READ-ONLY' &&
    status.payloadInspection === 'Headers Only' &&
    status.returnPath === 'None (TAP)';

  if (!isSafe) {
    return (
      <div className="p-2.5 rounded-lg bg-[#E13B3B]/15 border border-[#E13B3B]/40 text-[#E13B3B] font-mono text-xs flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>WARNING: Server reported non-passive compliance parameters. Client enforces strict read-only mode.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono select-none">
      {/* Passive Monitoring Status */}
      <div className="px-2.5 py-1 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center gap-1.5 text-gray-300">
        <span className={`w-1.5 h-1.5 rounded-full ${status.passiveMonitoringActive ? 'bg-[#34D399]' : 'bg-[#E13B3B]'}`} />
        <span className="text-gray-400">Passive Monitoring:</span>
        <span className="text-white font-bold">{status.passiveMonitoringActive ? 'ACTIVE' : 'INACTIVE'}</span>
      </div>

      {/* Mode Constant */}
      <div className="px-2.5 py-1 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center gap-1.5 text-gray-300">
        <Lock className="w-3 h-3 text-[#2FD9C8]" />
        <span className="text-gray-400">Mode:</span>
        <span className="text-[#2FD9C8] font-bold">READ-ONLY</span>
      </div>

      {/* Payload Inspection Constant */}
      <div className="px-2.5 py-1 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center gap-1.5 text-gray-400 hidden sm:flex">
        <span>Payload Inspection:</span>
        <span className="text-gray-200 font-semibold">Headers Only</span>
      </div>

      {/* Return Path Constant */}
      <div className="px-2.5 py-1 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center gap-1.5 text-gray-400 hidden md:flex">
        <span>Return Path:</span>
        <span className="text-[#34D399] font-bold">None (TAP)</span>
      </div>
    </div>
  );
};
