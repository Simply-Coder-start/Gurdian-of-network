import React from 'react';
import { Shield } from 'lucide-react';

/**
 * Active Defense Rule Card (Read-Only Status Display)
 * Complies with Passive Monitoring Rule 11: purely displays that upstream isolation exists.
 * Does NOT send any active command or packet injection from client.
 */
export const ActiveDefenseRuleCard = ({ rule = { name: 'Zero-Trust Isolation Active', description: 'Passive Tap Mirror Enforced' } }) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div>
        <span className="text-[10px] font-mono text-gray-400 uppercase">Active Defense Rule</span>
        <h4 className="text-sm font-bold text-white font-sans mt-0.5">{rule.name}</h4>
        <p className="text-[10px] font-mono text-[#4C8DFF] mt-0.5">
          {rule.description}
        </p>
      </div>
      <Shield className="w-6 h-6 text-[#4C8DFF] shrink-0" />
    </div>
  );
};
