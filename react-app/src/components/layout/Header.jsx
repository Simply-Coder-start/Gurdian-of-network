import React, { useState, useRef, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Search,
  Bell,
  ChevronDown,
  Activity,
  Check,
  Clock,
  Shield,
  Layers,
  Globe,
  Cpu,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  Radio,
  X
} from 'lucide-react';

export const Header = () => {
  const {
    activeSegment, setActiveSegment,
    activeZone, setActiveZone,
    activeTimeRange, setActiveTimeRange,
    activeModel, setActiveModel,
    searchQuery, setSearchQuery,
    latencyMs,
    notifications, setNotifications,
    unreadNotificationsCount,
    setActiveView,
    toastMessage
  } = useTelemetry();

  // Active Dropdown & Modal states
  const [openDropdown, setOpenDropdown] = useState(null); // 'source', 'region', 'time', 'model', 'notif', 'profile', 'latency'
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const headerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header
      ref={headerRef}
      className="absolute top-0 left-0 right-0 z-40 h-16 w-full px-6 flex items-center justify-between select-none bg-gradient-to-b from-[#070A0D]/90 via-[#070A0D]/70 to-[#070A0D]/20 backdrop-blur-[16px] backdrop-saturate-150 border-none"
    >
      {/* 1. Left: Filter Dropdowns Bar */}
      <div className="flex items-center gap-2 overflow-x-visible py-1">
        
        {/* Source Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('source')}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium text-white flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              openDropdown === 'source'
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-[#0D1318]/90 hover:bg-[#131B22] border-[#1C2630]/60 hover:border-primary/40'
            }`}
          >
            <span>Source: <strong className="font-semibold">{activeSegment}</strong></span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${openDropdown === 'source' ? 'rotate-180 text-primary' : ''}`} />
          </button>

          {openDropdown === 'source' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-1.5 z-50 font-mono text-xs animate-fadeIn space-y-1">
              <div className="px-2.5 py-1 text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5 border-b border-[#1C2630]/60 pb-1.5">
                <Layers className="w-3 h-3 text-primary" />
                <span>Monitored Network Segments</span>
              </div>
              {[
                { label: 'All Segments', sub: 'Unified Ingress' },
                { label: 'VLAN 100 (WAN Gateway)', sub: 'AS13335 Ingress' },
                { label: 'VLAN 200 (Perimeter DMZ)', sub: 'NGFW Perimeter' },
                { label: 'VLAN 400 (K8s Cluster)', sub: 'Microservices' },
                { label: 'VLAN 700 (Corporate LAN)', sub: 'Workstations' }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { setActiveSegment(item.label); setOpenDropdown(null); }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition ${
                    activeSegment === item.label ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-[#121B24] hover:text-white'
                  }`}
                >
                  <div>
                    <div>{item.label}</div>
                    <div className="text-[9px] text-gray-400">{item.sub}</div>
                  </div>
                  {activeSegment === item.label && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Region Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('region')}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium text-white flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              openDropdown === 'region'
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-[#0D1318]/90 hover:bg-[#131B22] border-[#1C2630]/60 hover:border-primary/40'
            }`}
          >
            <span>Region: <strong className="font-semibold">{activeZone}</strong></span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${openDropdown === 'region' ? 'rotate-180 text-primary' : ''}`} />
          </button>

          {openDropdown === 'region' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-1.5 z-50 font-mono text-xs animate-fadeIn space-y-1">
              <div className="px-2.5 py-1 text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5 border-b border-[#1C2630]/60 pb-1.5">
                <Globe className="w-3 h-3 text-primary" />
                <span>Geographic SPAN Zones</span>
              </div>
              {[
                'All Regions',
                'US-East (N. Virginia)',
                'EU-Central (Frankfurt)',
                'AP-East (Tokyo)',
                'Global SPAN Fabric'
              ].map(reg => (
                <button
                  key={reg}
                  onClick={() => { setActiveZone(reg); setOpenDropdown(null); }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition ${
                    activeZone === reg ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-[#121B24] hover:text-white'
                  }`}
                >
                  <span>{reg}</span>
                  {activeZone === reg && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Filter Dropdown */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => toggleDropdown('time')}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium text-white flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              openDropdown === 'time'
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-[#0D1318]/90 hover:bg-[#131B22] border-[#1C2630]/60 hover:border-primary/40'
            }`}
          >
            <span>Time: <strong className="font-semibold">{activeTimeRange}</strong></span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${openDropdown === 'time' ? 'rotate-180 text-primary' : ''}`} />
          </button>

          {openDropdown === 'time' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-1.5 z-50 font-mono text-xs animate-fadeIn space-y-1">
              <div className="px-2.5 py-1 text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5 border-b border-[#1C2630]/60 pb-1.5">
                <Clock className="w-3 h-3 text-primary" />
                <span>Telemetry Time Window</span>
              </div>
              {[
                'Real-Time (Live 30s)',
                'Last 1 Hour',
                'Last 6 Hours',
                'Last 24 Hours',
                'Last 7 Days'
              ].map(t => (
                <button
                  key={t}
                  onClick={() => { setActiveTimeRange(t); setOpenDropdown(null); }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition ${
                    activeTimeRange === t ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-[#121B24] hover:text-white'
                  }`}
                >
                  <span>{t}</span>
                  {activeTimeRange === t && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => toggleDropdown('model')}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-medium text-white flex items-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              openDropdown === 'model'
                ? 'bg-primary/15 border-primary text-primary'
                : 'bg-[#0D1318]/90 hover:bg-[#131B22] border-[#1C2630]/60 hover:border-primary/40'
            }`}
          >
            <span>Model: <strong className="font-semibold">{activeModel}</strong></span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${openDropdown === 'model' ? 'rotate-180 text-primary' : ''}`} />
          </button>

          {openDropdown === 'model' && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-1.5 z-50 font-mono text-xs animate-fadeIn space-y-1">
              <div className="px-2.5 py-1 text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5 border-b border-[#1C2630]/60 pb-1.5">
                <Cpu className="w-3 h-3 text-primary" />
                <span>Active Neural Classifiers</span>
              </div>
              {[
                { name: 'Behaviour AI v4.2', sub: 'Multi-Head Transformer (Active)' },
                { name: 'Gradient SHAP Ensemble v3.8', sub: 'Explainable Tree Model' },
                { name: 'Isolation Forest Zero-Day', sub: 'Unsupervised Anomaly' },
                { name: 'eBPF Kernel Signature', sub: 'Heuristic Rule Stream' }
              ].map(m => (
                <button
                  key={m.name}
                  onClick={() => { setActiveModel(m.name); setOpenDropdown(null); }}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between transition ${
                    activeModel === m.name ? 'bg-primary/20 text-primary font-bold' : 'text-gray-300 hover:bg-[#121B24] hover:text-white'
                  }`}
                >
                  <div>
                    <div>{m.name}</div>
                    <div className="text-[9px] text-gray-400">{m.sub}</div>
                  </div>
                  {activeModel === m.name && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 2. Right: Search, Latency, Notifications, and Profile */}
      <div className="flex items-center gap-3.5">
        
        {/* Universal Search Input Pill */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search by Source / IP / Host..."
            className={`bg-[#0D1318]/90 hover:bg-[#131B22] border text-xs text-white placeholder-gray-500 rounded-full h-9 pl-9 pr-7 transition-all duration-200 focus:outline-none shadow-sm ${
              isSearchFocused
                ? 'border-primary/60 w-60 sm:w-72 shadow-[0_0_12px_rgba(81,240,227,0.15)]'
                : 'border-[#1C2630]/60 w-44 sm:w-52 lg:w-60'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Latency Diagnostic Pill & Popover */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => toggleDropdown('latency')}
            title="Click to view Processing Latency Breakdown"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D1318]/90 hover:bg-[#131B22] border border-[#1C2630]/60 hover:border-primary/40 text-[11px] font-mono text-gray-300 shadow-sm cursor-pointer active:scale-95 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#51F0E3] animate-pulse" />
            <span>{latencyMs}ms</span>
          </button>

          {openDropdown === 'latency' && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-3 z-50 font-mono text-xs animate-fadeIn space-y-2">
              <div className="flex items-center justify-between border-b border-[#1C2630]/60 pb-1.5">
                <span className="font-bold text-white uppercase text-[10px]">Pipeline Latency</span>
                <span className="text-primary font-bold">{latencyMs}ms Total</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between text-gray-300"><span>Capture SPAN Diode:</span> <span className="text-white">0.4ms</span></div>
                <div className="flex justify-between text-gray-300"><span>eBPF Ring Buffer:</span> <span className="text-white">18.0ms</span></div>
                <div className="flex justify-between text-gray-300"><span>Feature Extraction:</span> <span className="text-white">24.2ms</span></div>
                <div className="flex justify-between text-gray-300"><span>Neural Inference (ML):</span> <span className="text-white">31.1ms</span></div>
                <div className="flex justify-between text-gray-300"><span>MITRE Alert Match:</span> <span className="text-white">8.1ms</span></div>
              </div>
              <div className="text-[9px] text-healthy pt-1 border-t border-[#1C2630]/40">
                ✓ Zero packet drops • Microsecond jitter nominal
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell & Drawer */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('notif')}
            title="Incident Notifications"
            className="relative p-2 rounded-full bg-[#0D1318]/90 hover:bg-[#131B22] border border-[#1C2630]/60 hover:border-primary/40 text-gray-300 hover:text-white transition-all duration-200 active:scale-95 shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full shadow-[0_0_6px_#FF4450] animate-ping" />
            )}
          </button>

          {openDropdown === 'notif' && (
            <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-3 z-50 font-mono text-xs animate-fadeIn space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#1C2630]/60 pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold text-white uppercase text-[11px]">SOC Live Incident Alerts</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-error/20 text-error text-[10px] font-bold">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-primary hover:underline"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg border transition ${
                      !n.read ? 'bg-[#121D26] border-primary/40' : 'bg-[#0E151C] border-[#1C2630]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs ${n.severity === 'CRITICAL' ? 'text-error' : n.severity === 'HIGH' ? 'text-warning' : 'text-primary'}`}>
                        {n.title}
                      </span>
                      <span className="text-[9px] text-gray-500">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-gray-300 font-sans mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setActiveView('investigation'); setOpenDropdown(null); }}
                className="w-full py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-bold text-[10px] transition text-center"
              >
                Open Deep Investigation Queue →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar (SO) & Menu */}
        <div className="relative pl-2 border-l border-[#1C2630]/60">
          <button
            onClick={() => toggleDropdown('profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-primaryContainer to-primary flex items-center justify-center text-gray-900 font-bold text-xs shadow-md hover:ring-2 hover:ring-primary transition active:scale-95"
          >
            SO
          </button>

          {openDropdown === 'profile' && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0B1218]/95 backdrop-blur-md border border-[#1C2630] rounded-xl shadow-2xl p-3 z-50 font-mono text-xs animate-fadeIn space-y-3">
              <div className="flex items-center gap-3 border-b border-[#1C2630]/60 pb-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primaryContainer to-primary flex items-center justify-center text-gray-900 font-bold text-sm shadow">
                  SO
                </div>
                <div>
                  <div className="font-bold text-white">Security Ops Lead</div>
                  <div className="text-[10px] text-primary">Analyst Tier-3 • Active</div>
                </div>
              </div>

              <div className="space-y-1 text-[10px] text-gray-300">
                <div className="flex justify-between"><span>Session Uptime:</span> <span className="text-white">4h 18m</span></div>
                <div className="flex justify-between"><span>Sensor Permission:</span> <span className="text-healthy font-semibold">Passive Read-Only</span></div>
                <div className="flex justify-between"><span>Authentication:</span> <span className="text-white">Hardware Key (MFA)</span></div>
              </div>

              <div className="space-y-1 pt-1 border-t border-[#1C2630]/60">
                <button
                  onClick={() => { setActiveView('settings'); setOpenDropdown(null); }}
                  className="w-full px-2 py-1.5 rounded hover:bg-[#121B24] text-left text-gray-200 hover:text-white flex items-center gap-2 text-xs"
                >
                  <Settings className="w-3.5 h-3.5 text-primary" />
                  <span>System Settings</span>
                </button>
                <button
                  onClick={() => { setActiveView('states'); setOpenDropdown(null); }}
                  className="w-full px-2 py-1.5 rounded hover:bg-[#121B24] text-left text-gray-200 hover:text-white flex items-center gap-2 text-xs"
                >
                  <Activity className="w-3.5 h-3.5 text-warning" />
                  <span>Diagnostics &amp; States</span>
                </button>
                <button
                  onClick={() => { alert('Session locked.'); setOpenDropdown(null); }}
                  className="w-full px-2 py-1.5 rounded hover:bg-error/20 text-left text-error flex items-center gap-2 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock Analyst Session</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 px-4 py-2 rounded-xl bg-[#0B151E]/95 border border-primary/50 text-white font-mono text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

    </header>
  );
};
