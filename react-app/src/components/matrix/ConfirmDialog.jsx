import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-mono text-xs select-none animate-fadeIn">
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
          <div className="flex items-center gap-2 text-white font-bold font-sans text-sm">
            <AlertTriangle className="w-4 h-4 text-[#E8A23D]" />
            <span>{title}</span>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          {message}
        </p>

        <div className="text-[10px] text-gray-400 bg-[#11171E] p-2.5 rounded border border-[#1C2630]">
          ℹ This mutates case status in the telemetry database. No network packets or block actions are sent.
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg bg-[#11171E] hover:bg-[#16202A] border border-[#1C2630] text-gray-300 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 rounded-lg bg-[#34D399] hover:bg-[#34D399]/80 text-gray-950 text-xs font-bold shadow-sm"
          >
            Confirm Status Change
          </button>
        </div>
      </div>
    </div>
  );
};
