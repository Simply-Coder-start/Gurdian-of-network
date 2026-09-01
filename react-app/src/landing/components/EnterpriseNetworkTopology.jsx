import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Globe, 
  Shield, 
  Server, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Layers, 
  Radio, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Laptop
} from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* Node topology definition in normalized coordinate space (0-1000 width, 0-600 height) */
const TOPOLOGY_NODES = [
  {
    id: 'internet',
    label: 'Internet / WAN',
    subtext: '198.51.100.0/24',
    type: 'wan',
    x: 100,
    y: 110,
    icon: Globe,
    status: 'normal',
    details: { protocol: 'BGP / Multi-Homed', rx: '24.8 MB/s', tx: '18.4 MB/s', activeFlows: 412 }
  },
  {
    id: 'gateway',
    label: 'Edge Gateway',
    subtext: 'GW-01 • Core Edge',
    type: 'gateway',
    x: 320,
    y: 110,
    icon: Shield,
    status: 'normal',
    details: { firewall: 'Stateful Pass-Through', drops: '0 pkts', interface: '10G SFP+', latency: '0.12ms' }
  },
  {
    id: 'switch',
    label: 'Core Switch',
    subtext: 'SW-DIST-01 (SPAN Port)',
    type: 'switch',
    x: 540,
    y: 110,
    icon: Layers,
    status: 'mirroring',
    details: { mode: 'L3 Distribution', portMirror: 'Port 24 (SPAN Mirror)', throughput: '42.6 MB/s', packets: '14.8k/s' }
  },
  {
    id: 'host-compromised',
    label: 'Workstation 10.24.18.42',
    subtext: 'Endpoint • Finance VLAN',
    type: 'endpoint',
    x: 820,
    y: 80,
    icon: Laptop,
    status: 'threat',
    details: { host: 'DESKTOP-FIN-04', os: 'Windows 11 Enterprise', alert: 'Periodic C2 Beaconing (32s interval)', score: '0.942' }
  },
  {
    id: 'host-server',
    label: 'App Cluster',
    subtext: '10.24.18.10 • Prod',
    type: 'endpoint',
    x: 820,
    y: 180,
    icon: Server,
    status: 'normal',
    details: { role: 'API Microservices', health: '99.99%', certs: 'Valid (DigiCert)', connections: 189 }
  },
  {
    id: 'host-db',
    label: 'Database Pool',
    subtext: '10.24.20.5 • Secure',
    type: 'endpoint',
    x: 820,
    y: 280,
    icon: Database,
    status: 'normal',
    details: { role: 'PostgreSQL Primary', encryption: 'TLS 1.3 Strict', auth: 'mTLS Verified', queryRate: '840 qps' }
  },
  {
    id: 'tap-sensor',
    label: 'Passive TAP / SPAN Sensor',
    subtext: 'Non-Intrusive Optical Tap',
    type: 'sensor',
    x: 540,
    y: 350,
    icon: Eye,
    status: 'passive',
    details: { mode: 'Read-Only (Rx Only)', inlineImpact: '0.00ms latency', dropRate: '0.000%', memory: '24% used' }
  },
  {
    id: 'ai-engine',
    label: 'AI Behavioral Engine',
    subtext: 'SHAP Feature Attribution ML',
    type: 'ai',
    x: 230,
    y: 390,
    icon: Cpu,
    status: 'analyzing',
    details: { model: 'Behavioral-Tree-v4.2', shapWeights: '+0.32 ByteVol, +0.24 Interval', evalRate: '22,400 flows/s', confidence: '94.2%' }
  }
];

/* Network Links between nodes */
const NETWORK_LINKS = [
  // Normal network backbone
  { from: 'internet', to: 'gateway', type: 'backbone', isThreatPath: true },
  { from: 'gateway', to: 'switch', type: 'backbone', isThreatPath: true },
  { from: 'switch', to: 'host-compromised', type: 'endpoint-link', isThreatPath: true },
  { from: 'switch', to: 'host-server', type: 'endpoint-link', isThreatPath: false },
  { from: 'switch', to: 'host-db', type: 'endpoint-link', isThreatPath: false },
  
  // Passive Mirror Feed (Switch -> TAP Sensor)
  { from: 'switch', to: 'tap-sensor', type: 'mirror', isThreatPath: true },
  
  // Telemetry Pipeline (TAP Sensor -> AI Engine)
  { from: 'tap-sensor', to: 'ai-engine', type: 'ai-feed', isThreatPath: true }
];

export function EnterpriseNetworkTopology() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [selectedNode, setSelectedNode] = useState(null);
  const [threatPulseActive, setThreatPulseActive] = useState(true);
  const [activeCycleTime, setActiveCycleTime] = useState(0);
  
  // Live telemetry counters that fluctuate realistically
  const [telemetry, setTelemetry] = useState({
    packetsPerSec: 14820,
    bandwidth: 42.6,
    activeFlows: 1428,
    anomalyConfidence: 94.2,
    threatDetected: true
  });

  // Fluctuate telemetry numbers gently
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        packetsPerSec: Math.floor(14500 + Math.random() * 650),
        bandwidth: +(41.8 + Math.random() * 1.6).toFixed(1),
        activeFlows: Math.floor(1410 + Math.random() * 40),
        anomalyConfidence: +(93.8 + Math.random() * 0.8).toFixed(1)
      }));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Periodic threat pulse cycle: 6s cycle (3s normal flow, 3s flagged anomaly burst)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCycleTime(prev => (prev + 1) % 10);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAnomalyFlaring = activeCycleTime >= 2 && activeCycleTime <= 7;

  // Particle simulation for Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Node coordinate map
    const nodeMap = {};
    TOPOLOGY_NODES.forEach(n => {
      nodeMap[n.id] = { x: n.x, y: n.y };
    });

    // Create particle systems for each link
    const particles = [];
    NETWORK_LINKS.forEach(link => {
      const src = nodeMap[link.from];
      const dst = nodeMap[link.to];
      const count = link.type === 'mirror' ? 12 : link.type === 'ai-feed' ? 14 : 9;

      for (let i = 0; i < count; i++) {
        particles.push({
          link,
          progress: Math.random(),
          speed: (link.type === 'mirror' ? 0.007 : link.type === 'ai-feed' ? 0.008 : 0.004) + Math.random() * 0.003,
          size: link.type === 'mirror' ? 2.5 : 2,
          isAnomaly: link.isThreatPath && Math.random() < 0.35,
          color: link.type === 'mirror' ? '#51F0E3' : link.type === 'ai-feed' ? '#22D3C7' : '#4B5A6B'
        });
      }
    });

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Coordinate scaling (fixed internal 1000 x 540 space)
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }
      ctx.save();
      ctx.scale((rect.width * dpr) / 1000, (rect.height * dpr) / 540);
      ctx.clearRect(0, 0, 1000, 540);

      // Draw particle flows
      particles.forEach(p => {
        p.progress += p.speed * (dt * 60);
        if (p.progress > 1) {
          p.progress = 0;
          p.isAnomaly = p.link.isThreatPath && (isAnomalyFlaring || Math.random() < 0.25);
        }

        const src = nodeMap[p.link.from];
        const dst = nodeMap[p.link.to];

        // Linear interpolation with slight curve for mirror & AI feed
        let x, y;
        if (p.link.type === 'mirror') {
          // Curved mirror drop from switch (540, 110) to tap-sensor (540, 350)
          const midX = src.x - 25;
          const t = p.progress;
          x = (1 - t) * (1 - t) * src.x + 2 * (1 - t) * t * midX + t * t * dst.x;
          y = (1 - t) * src.y + t * dst.y;
        } else if (p.link.type === 'ai-feed') {
          // Curved horizontal pipe from TAP to AI Engine
          const t = p.progress;
          const midY = src.y + 25;
          x = (1 - t) * src.x + t * dst.x;
          y = (1 - t) * (1 - t) * src.y + 2 * (1 - t) * t * midY + t * t * dst.y;
        } else {
          x = src.x + (dst.x - src.x) * p.progress;
          y = src.y + (dst.y - src.y) * p.progress;
        }

        // Particle rendering
        ctx.beginPath();
        ctx.arc(x, y, p.isAnomaly && isAnomalyFlaring ? 3.2 : p.size, 0, Math.PI * 2);

        if (p.isAnomaly && isAnomalyFlaring) {
          ctx.fillStyle = '#FF7A45';
          ctx.shadowColor = '#FF7A45';
          ctx.shadowBlur = 8;
        } else if (p.link.type === 'mirror') {
          ctx.fillStyle = '#51F0E3';
          ctx.shadowColor = '#51F0E3';
          ctx.shadowBlur = 4;
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, isAnomalyFlaring]);

  return (
    <div className="relative w-full h-[520px] lg:h-[560px] select-none rounded-2xl bg-[#0B0F14]/90 border border-[#1B222B] backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col justify-between group">
      
      {/* Background Grid & Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1B222B 1px, transparent 1px),
            linear-gradient(to bottom, #1B222B 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0A0D12] via-transparent to-[#0A0D12]/60" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0A0D12]/40 via-transparent to-[#0A0D12]/70" />

      {/* ── Top HUD Status Strip ─────────────────────────────── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#1B222B]/80 bg-[#12171F]/70 text-xs">
        {/* Left indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-textPrimary uppercase tracking-wider">
              LIVE SENSOR TOPOLOGY
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#283138] bg-[#161D24] text-[11px] text-textSecondary">
            <Radio className="w-3 h-3 text-[#51F0E3] animate-pulse" />
            <span>Passive SPAN (0ms Overhead)</span>
          </div>
        </div>

        {/* Right Telemetry Readouts */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-textSecondary">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-calm" />
            <span>THROUGHPUT:</span>
            <span className="text-textPrimary font-semibold">{telemetry.bandwidth} MB/s</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span>PACKETS:</span>
            <span className="text-textPrimary font-semibold">{telemetry.packetsPerSec.toLocaleString()} /s</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isAnomalyFlaring ? 'bg-signal animate-ping' : 'bg-emerald-400'}`} />
            <span className={isAnomalyFlaring ? 'text-signal font-semibold' : 'text-emerald-400 font-semibold'}>
              {isAnomalyFlaring ? 'BEACON ALERT' : 'SECURE'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Interactive Network Canvas & SVG Layer ───────── */}
      <div className="relative flex-1 w-full h-full min-h-[380px] overflow-hidden">
        
        {/* Canvas Particle Stream */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        />

        {/* Static/Glow SVG Link Connections */}
        <svg 
          viewBox="0 0 1000 540" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0 preserve-3d"
        >
          <defs>
            {/* Gradients for links */}
            <linearGradient id="link-normal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B5A6B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#4B5A6B" stopOpacity="0.3" />
            </linearGradient>

            <linearGradient id="link-threat" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A45" stopOpacity={isAnomalyFlaring ? "0.9" : "0.3"} />
              <stop offset="50%" stopColor="#FF7A45" stopOpacity={isAnomalyFlaring ? "0.8" : "0.2"} />
              <stop offset="100%" stopColor="#FF7A45" stopOpacity={isAnomalyFlaring ? "0.9" : "0.3"} />
            </linearGradient>

            <linearGradient id="link-mirror" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#51F0E3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22D3C7" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="link-ai" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#51F0E3" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF7A45" stopOpacity={isAnomalyFlaring ? "0.9" : "0.4"} />
            </linearGradient>

            <filter id="glow-threat" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Network Links */}
          {NETWORK_LINKS.map((link, idx) => {
            const src = TOPOLOGY_NODES.find(n => n.id === link.from);
            const dst = TOPOLOGY_NODES.find(n => n.id === link.to);
            if (!src || !dst) return null;

            if (link.type === 'mirror') {
              // Curved optical mirror line down from Switch to TAP
              const pathData = `M ${src.x} ${src.y} Q ${src.x - 30} ${src.y + 120} ${dst.x} ${dst.y}`;
              return (
                <g key={idx}>
                  <path 
                    d={pathData} 
                    fill="none" 
                    stroke="url(#link-mirror)" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 4"
                    className="opacity-75"
                  />
                  <text 
                    x={src.x - 75} 
                    y={(src.y + dst.y) / 2 - 10} 
                    fill="#51F0E3" 
                    fontSize="10" 
                    fontFamily="JetBrains Mono"
                    className="opacity-90 font-medium"
                  >
                    PASSIVE SPAN MIRROR (RX ONLY)
                  </text>
                </g>
              );
            }

            if (link.type === 'ai-feed') {
              // Pipe between TAP and AI Engine
              const pathData = `M ${src.x} ${src.y} Q ${(src.x + dst.x) / 2} ${src.y + 35} ${dst.x} ${dst.y}`;
              return (
                <g key={idx}>
                  <path 
                    d={pathData} 
                    fill="none" 
                    stroke="url(#link-ai)" 
                    strokeWidth="3" 
                    filter={isAnomalyFlaring ? "url(#glow-threat)" : undefined}
                  />
                  <text 
                    x={(src.x + dst.x) / 2 - 45} 
                    y={src.y + 55} 
                    fill="#8B98A5" 
                    fontSize="9.5" 
                    fontFamily="JetBrains Mono"
                  >
                    RAW PACKET METADATA PIPELINE
                  </text>
                </g>
              );
            }

            // Standard / Backbone Links
            const isThreat = link.isThreatPath && isAnomalyFlaring;
            return (
              <line 
                key={idx}
                x1={src.x} 
                y1={src.y} 
                x2={dst.x} 
                y2={dst.y} 
                stroke={isThreat ? "url(#link-threat)" : "url(#link-normal)"}
                strokeWidth={isThreat ? "2.5" : "1.5"}
                filter={isThreat ? "url(#glow-threat)" : undefined}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* ── HTML Interactive Nodes Overlay ──────────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {TOPOLOGY_NODES.map((node) => {
            const Icon = node.icon;
            const isCompromised = node.id === 'host-compromised';
            const isAI = node.id === 'ai-engine';
            const isTap = node.id === 'tap-sensor';
            const isSelected = selectedNode?.id === node.id;

            return (
              <div 
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node)}
                style={{
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 540) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute cursor-pointer transition-all duration-300 group/node ${
                  isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'
                }`}
              >
                {/* Outer Glow / Ring */}
                {isCompromised && isAnomalyFlaring && (
                  <span className="absolute -inset-2 rounded-xl bg-signal/20 animate-ping pointer-events-none" />
                )}
                {isAI && (
                  <span className="absolute -inset-1.5 rounded-xl bg-[#51F0E3]/15 animate-pulse pointer-events-none" />
                )}

                {/* Node Box */}
                <div 
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border backdrop-blur-md transition-all shadow-lg ${
                    isCompromised && isAnomalyFlaring
                      ? 'bg-[#1D1412]/90 border-signal shadow-signal/20'
                      : isAI
                      ? 'bg-[#0F1D24]/90 border-[#22D3C7]/60 shadow-[#22D3C7]/15'
                      : isTap
                      ? 'bg-[#101820]/90 border-[#51F0E3]/40'
                      : isSelected
                      ? 'bg-[#1B232D] border-textPrimary shadow-white/10'
                      : 'bg-[#12171F]/90 border-[#1B222B] hover:border-[#3B4A59]'
                  }`}
                >
                  {/* Icon Circle */}
                  <div 
                    className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${
                      isCompromised && isAnomalyFlaring
                        ? 'bg-signal/20 text-signal'
                        : isAI
                        ? 'bg-[#51F0E3]/20 text-[#51F0E3]'
                        : isTap
                        ? 'bg-[#51F0E3]/15 text-[#51F0E3]'
                        : 'bg-[#1B222B] text-[#8B98A5] group-hover/node:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Label & Subtext */}
                  <div className="flex flex-col text-left pr-1">
                    <span className={`text-[11px] font-semibold tracking-tight whitespace-nowrap ${
                      isCompromised && isAnomalyFlaring 
                        ? 'text-signal' 
                        : isAI
                        ? 'text-[#E7ECF0]'
                        : 'text-textPrimary'
                    }`}>
                      {node.label}
                    </span>
                    <span className="font-mono text-[9.5px] text-textSecondary whitespace-nowrap">
                      {node.subtext}
                    </span>
                  </div>

                  {/* Quick indicator badge */}
                  {isCompromised && (
                    <span className="flex h-2 w-2 relative ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Live AI Anomaly Callout Overlay (Bottom Right) ───── */}
        <div 
          className={`absolute bottom-4 right-4 z-20 max-w-[270px] sm:max-w-[310px] rounded-xl border p-3.5 backdrop-blur-xl transition-all duration-500 ${
            isAnomalyFlaring 
              ? 'bg-[#161210]/95 border-signal/80 shadow-2xl shadow-signal/20 translate-y-0 opacity-100' 
              : 'bg-[#12171F]/90 border-[#1B222B] translate-y-0 opacity-95'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className={`p-2 rounded-lg shrink-0 ${isAnomalyFlaring ? 'bg-signal/20 text-signal' : 'bg-[#1B222B] text-calm'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-display font-bold text-xs text-textPrimary">
                  {isAnomalyFlaring ? 'AI THREAT DETECTED' : 'AI REAL-TIME ANALYSIS'}
                </span>
                <span className="font-mono font-bold text-xs text-signal">
                  {telemetry.anomalyConfidence}%
                </span>
              </div>
              <p className="text-[11px] text-textSecondary leading-snug">
                {isAnomalyFlaring 
                  ? 'C2 Beaconing pattern flagged on 10.24.18.42 → 185.220.101.5 (SHAP: +0.32 ByteVol, +0.24 Interval)'
                  : 'Continuous passive packet evaluation across 1,428 active flows with zero inline latency.'}
              </p>
              
              {/* Telemetry Micro Bar */}
              <div className="mt-2.5 pt-2 border-t border-[#1B222B] flex items-center justify-between text-[10px] font-mono text-calm">
                <span>SENSOR: TAP-01 (PASSIVE)</span>
                <span className="text-emerald-400">LATENCY: 0.00ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Node Detail Inspector Card (When clicked) ───────── */}
        {selectedNode && (
          <div className="absolute top-4 left-4 z-30 w-72 rounded-xl border border-textPrimary/40 bg-[#0E141B]/95 p-3.5 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B222B]">
              <div className="flex items-center gap-2">
                <selectedNode.icon className="w-4 h-4 text-[#51F0E3]" />
                <span className="font-display font-semibold text-xs text-textPrimary">
                  {selectedNode.label}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedNode(null); }}
                className="text-calm hover:text-textPrimary text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 font-mono text-[10.5px]">
              {Object.entries(selectedNode.details).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-textSecondary">
                  <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-textPrimary font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Explanatory Strip ─────────────────────────── */}
      <div className="relative z-20 px-5 py-2.5 border-t border-[#1B222B]/80 bg-[#0E131A]/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-textSecondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#51F0E3]" />
            <span>Passive Mirror Traffic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-signal" />
            <span>AI Anomaly Vector</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-calm hidden sm:inline">
          Click any node to inspect telemetry
        </span>
      </div>

    </div>
  );
}
