import React from 'react';

export const LabeledBarList = ({ title, items = [] }) => {
  return (
    <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h3>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-300">
              <span className="truncate pr-2">{item.label}</span>
              <span className="text-white font-bold shrink-0">
                {item.count ? `${item.count} (${item.pct}%)` : `${item.pct}%`}
              </span>
            </div>
            
            {/* Background track & filled bar */}
            <div className="w-full bg-[#17222B] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.pct}%`, backgroundColor: item.color || '#2FD9C8' }}
              />
            </div>

            {item.volumeText && (
              <div className="text-[9px] text-gray-500 text-right">{item.volumeText}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
