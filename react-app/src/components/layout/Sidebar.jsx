import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Grid,
  Shield,
  Layers,
  Activity,
  AlertOctagon,
  Search,
  Cpu,
  Radio,
  Settings,
  AlertCircle,
  Pin,
  PinOff,
  ChevronRight,
  ChevronLeft,
  Radar
} from 'lucide-react';

export const Sidebar = () => {
  const { activeView, setActiveView } = useTelemetry();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isPinned || isHovered;

  const navItems = [
    { id: 'topology', label: 'Threat Topology (Optimized)', icon: Radio },
    { id: 'dashboard', label: 'Executive Dashboard', icon: Grid },
    { id: 'threats', label: 'Threats Matrix', icon: Shield },
    { id: 'health', label: 'System Health', icon: Activity },
    { id: 'investigation', label: 'Alert Investigation', icon: Search },
    { id: 'alerts', label: 'Alerts Management', icon: AlertOctagon },
    { id: 'analytics', label: 'ML Intelligence', icon: Cpu },
    { id: 'traffic', label: 'Traffic Monitor', icon: Layers },
    { id: 'states', label: 'Diagnostics & States', icon: AlertCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[#070A0D] border-r border-[#1C2630] h-full flex flex-col shrink-0 z-40 transition-all duration-300 ease-in-out select-none relative ${
        isExpanded ? 'w-64 shadow-2xl shadow-black/80' : 'w-16'
      }`}
    >
      {/* Top Header & Branding */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-[#1C2630] overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          {/* Radar / Target Logo (matching Image 2) */}
          <div className="w-9 h-9 rounded-full bg-[#0D1A1C] border border-primary/50 flex items-center justify-center  shrink-0 transition-transform duration-300 hover:scale-105">
            <div className="w-6 h-6 rounded-full border border-dashed border-primary/80 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          {/* Expanded Brand Name */}
          <div
            className={`flex flex-col transition-all duration-200 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none w-0 overflow-hidden'
            }`}
          >
            <span className="font-bold text-sm tracking-wider text-white whitespace-nowrap">GUARDIAN</span>
            <span className="text-[9px] font-mono text-primary uppercase tracking-widest whitespace-nowrap font-semibold">
              NETWORK SOC
            </span>
          </div>
        </div>

        {/* Pin / Expand Toggle Button (visible in expanded state) */}
        {isExpanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Unpin Sidebar (Auto-collapse on mouse leave)' : 'Pin Sidebar Open'}
            className={`p-1.5 rounded-lg text-xs font-mono transition shrink-0 ${
              isPinned
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'text-gray-400 hover:text-white hover:bg-surface'
            }`}
          >
            {isPinned ? <Pin className="w-3.5 h-3.5 rotate-45" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <div key={item.id} className="relative group">
              <button
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-200 ${
                  isExpanded ? 'px-3 py-2.5 gap-3' : 'px-0 py-2.5 justify-center'
                } ${
                  isActive
                    ? 'bg-[#111820] border border-[#1C3B3B] text-primary font-semibold  '
                    : 'text-[#E2E8F0] hover:text-primary hover:bg-[#141A21] border border-transparent'
                }`}
              >
                {/* Nav Icon */}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-primary scale-110' : 'text-gray-300 group-hover:text-primary'
                  }`}
                />

                {/* Nav Label (Smooth slide-in) */}
                <span
                  className={`truncate text-left whitespace-nowrap transition-all duration-200 ${
                    isExpanded
                      ? 'opacity-100 translate-x-0 w-auto'
                      : 'opacity-0 -translate-x-3 pointer-events-none w-0 overflow-hidden hidden'
                  }`}
                >
                  {item.label}
                </span>
              </button>

              {/* Floating Tooltip in Collapsed State */}
              {!isExpanded && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 rounded-md bg-[#0D1A1C] border border-primary/40 text-white text-xs font-medium whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 z-50">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{item.label}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-2.5 border-t border-[#1C2630] overflow-hidden">
        {isExpanded ? (
          <div className="p-2 rounded-lg bg-[#111820] border border-[#1C3B3B] flex items-center justify-between text-[11px] font-mono transition-opacity duration-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#51F0E3] animate-pulse" />
              <span className="text-gray-300">Sensor: Online</span>
            </div>
            <span className="text-primary font-bold">SYNCHRONIZED</span>
          </div>
        ) : (
          <div className="flex justify-center" title="Sensor: Synchronized Online">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_#51F0E3] animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
