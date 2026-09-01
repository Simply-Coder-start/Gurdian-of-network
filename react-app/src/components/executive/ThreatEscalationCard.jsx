import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getSeverityBadgeStyle } from '../../utils/severity';

/**
 * Threat Escalation Card
 * Clearly identified as a predictive forecast generated server-side.
 */
export const ThreatEscalationCard = ({ forecast }) => {
  if (!forecast) return null;

  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2 hover:border-[#E8A23D]/60 transition-all duration-300">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-[#E8A23D] uppercase flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>THREAT ESCALATION</span>
        </span>
        <span className="text-[10px] text-gray-400 font-mono">
          Risk: High (↑ +{forecast.riskDeltaPct}%)
        </span>
      </div>

      <div className="p-2.5 bg-[#11171E] border border-[#1C2630] rounded-lg text-xs font-mono space-y-1">
        <span className="text-[10px] text-gray-400 uppercase block">MOST LIKELY NEXT STAGE:</span>
        <p className="text-xs text-white font-bold font-sans">{forecast.predictedNextStage}</p>
        <div className="flex justify-between items-center text-[10px] text-[#2FD9C8] pt-1 border-t border-[#1C2630]/60">
          <span>Heuristic Confidence: {forecast.heuristicConfidencePct}%</span>
          <span className="text-gray-400">Stage {forecast.killChainStage.current} of {forecast.killChainStage.total} (predicted)</span>
        </div>
      </div>
    </div>
  );
};
