import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Radio, AlertTriangle, ShieldCheck, Globe, Zap, Cpu } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* 12 Realistic Global Enterprise Backbone Nodes in 1000x560 space */
const GLOBAL_NODES = [
  { id: 'us-east', name: 'US-East (Virginia)', code: 'IAD', region: 'North America', x: 275, y: 195, ip: '198.51.100.24', ping: '1.2ms', flows: 284, status: 'normal' },
  { id: 'us-west', name: 'US-West (Oregon)', code: 'PDX', region: 'North America', x: 185, y: 180, ip: '198.51.100.82', ping: '1.8ms', flows: 210, status: 'normal' },
  { id: 'sa-east', name: 'SA-East (São Paulo)', code: 'GRU', region: 'South America', x: 345, y: 385, ip: '177.18.20.1', ping: '62ms', flows: 94, status: 'normal' },
  { id: 'eu-west', name: 'EU-West (London)', code: 'LHR', region: 'Europe', x: 485, y: 155, ip: '185.199.108.15', ping: '3.4ms', flows: 260, status: 'normal' },
  { id: 'eu-central', name: 'EU-Central (Frankfurt)', code: 'FRA', region: 'Europe', x: 520, y: 165, ip: '185.199.110.15', ping: '2.9ms', flows: 315, status: 'normal' },
  { id: 'me-central', name: 'ME-Central (Dubai)', code: 'DXB', region: 'Middle East', x: 625, y: 240, ip: '194.170.1.2', ping: '48ms', flows: 112, status: 'normal' },
  { id: 'in-west', name: 'IN-West (Mumbai)', code: 'BOM', region: 'India', x: 672, y: 265, ip: '103.21.244.10', ping: '0.8ms', flows: 340, status: 'anomaly-source' },
  { id: 'in-south', name: 'IN-South (Bengaluru)', code: 'BLR', region: 'India', x: 685, y: 295, ip: '103.21.246.5', ping: '0.6ms', flows: 290, status: 'normal' },
  { id: 'se-asia', name: 'SE-Asia (Singapore)', code: 'SIN', region: 'Southeast Asia', x: 755, y: 325, ip: '104.244.42.1', ping: '18ms', flows: 275, status: 'normal' },
  { id: 'east-asia-nrt', name: 'East Asia (Tokyo)', code: 'NRT', region: 'East Asia', x: 848, y: 200, ip: '142.250.196.46', ping: '22ms', flows: 240, status: 'normal' },
  { id: 'east-asia-icn', name: 'East Asia (Seoul)', code: 'ICN', region: 'East Asia', x: 818, y: 195, ip: '142.250.198.12', ping: '24ms', flows: 185, status: 'normal' },
  { id: 'au-east', name: 'AU-East (Sydney)', code: 'SYD', region: 'Oceania', x: 885, y: 410, ip: '139.130.4.5', ping: '84ms', flows: 128, status: 'normal' }
];

/* Interconnecting Backbone & Transoceanic Routes */
const GLOBAL_ROUTES = [
  // Transatlantic & Intra-US
  { from: 'us-west', to: 'us-east', bend: -25, isAnomaly: false },
  { from: 'us-east', to: 'eu-west', bend: -40, isAnomaly: false },
  { from: 'us-east', to: 'sa-east', bend: 30, isAnomaly: false },
  // Europe Backbone
  { from: 'eu-west', to: 'eu-central', bend: -10, isAnomaly: false },
  { from: 'eu-central', to: 'me-central', bend: -20, isAnomaly: false },
  // Middle East to India
  { from: 'me-central', to: 'in-west', bend: -15, isAnomaly: false },
  // India Intra-Route & Anomaly Beacon Link (Mumbai -> Frankfurt via suspicious detour)
  { from: 'in-west', to: 'in-south', bend: 10, isAnomaly: false },
  { from: 'in-west', to: 'eu-central', bend: -55, isAnomaly: true }, // Flagged threat path
  // Indo-Pacific & East Asia
  { from: 'in-south', to: 'se-asia', bend: -15, isAnomaly: false },
  { from: 'se-asia', to: 'east-asia-nrt', bend: -30, isAnomaly: false },
  { from: 'east-asia-icn', to: 'east-asia-nrt', bend: -10, isAnomaly: false },
  { from: 'se-asia', to: 'au-east', bend: 25, isAnomaly: false },
  // Transpacific Backbone (Tokyo to US-West)
  { from: 'east-asia-nrt', to: 'us-west', bend: -60, isAnomaly: false, isTranspacific: true }
];

/* Detailed Continent Outlines (SVG Path Data for Dark World Map) */
const WORLD_CONTINENTS = [
  // North America
  "M 130 110 L 170 95 L 230 80 L 290 85 L 320 120 L 295 160 L 260 170 L 285 210 L 265 240 L 230 260 L 210 240 L 180 230 L 150 190 L 120 150 Z",
  // Greenland
  "M 340 50 L 390 40 L 410 70 L 370 90 L 340 70 Z",
  // South America
  "M 260 270 L 310 280 L 360 320 L 375 365 L 345 440 L 315 470 L 290 440 L 285 360 L 255 310 Z",
  // Europe
  "M 470 120 L 520 110 L 560 125 L 560 170 L 515 190 L 480 185 L 460 155 Z",
  // Africa
  "M 470 210 L 540 210 L 580 260 L 580 340 L 530 420 L 490 380 L 450 290 L 450 230 Z",
  // Asia (Mainland & North)
  "M 570 110 L 680 85 L 820 95 L 880 140 L 860 210 L 780 240 L 730 220 L 670 240 L 610 210 L 580 160 Z",
  // India Subcontinent
  "M 650 225 L 700 235 L 710 285 L 685 335 L 655 285 Z",
  // Southeast Asia & Archipelagos
  "M 740 250 L 780 265 L 775 315 L 740 330 Z M 770 335 L 820 345 L 810 375 L 760 360 Z",
  // Japan
  "M 845 175 L 865 195 L 850 225 L 835 205 Z",
  // Australia
  "M 800 370 L 870 360 L 915 395 L 890 460 L 820 450 L 785 410 Z"
];

export function LiveGlobalNetworkMap() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [selectedNode, setSelectedNode] = useState(null);
  const [threatCycle, setThreatCycle] = useState(0);

  // Dynamic live telemetry readings
  const [metrics, setMetrics] = useState({
    flowsPerSec: 1482,
    throughput: 42.6,
    activeNodes: 12,
    anomalyConfidence: 94.2,
    threatActive: true,
    lastUpdate: 'LIVE'
  });

  // Fluctuate telemetry values realistically
  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        flowsPerSec: Math.floor(1470 + Math.random() * 28),
        throughput: +(42.1 + Math.random() * 1.2).toFixed(1),
        anomalyConfidence: +(93.9 + Math.random() * 0.6).toFixed(1)
      }));
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  // Threat pulse timer (cycles anomaly alert flare every 6-8 seconds)
  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setThreatCycle(c => (c + 1) % 10);
    }, 1000);
    return () => clearInterval(cycleTimer);
  }, []);

  const isAnomalyActive = threatCycle >= 2 && threatCycle <= 7;

  // Node position dictionary
  const nodeDict = useMemo(() => {
    const map = {};
    GLOBAL_NODES.forEach(n => { map[n.id] = n; });
    return map;
  }, []);

  // High-performance Canvas animation for Bidirectional flowing data packets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Create bidirectional packet particles along curves
    const particles = [];
    GLOBAL_ROUTES.forEach((route, idx) => {
      const src = nodeDict[route.from];
      const dst = nodeDict[route.to];
      if (!src || !dst) return;

      const particleCount = route.isAnomaly ? 10 : 7;

      // Packets flowing from -> to
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          route,
          src,
          dst,
          dir: 1, // forward
          t: Math.random(),
          speed: (0.0035 + Math.random() * 0.0035) * (route.isAnomaly ? 1.4 : 1),
          size: route.isAnomaly ? 2.8 : 1.8 + Math.random() * 0.8,
          color: route.isAnomaly ? '#FF7A45' : '#51F0E3'
        });
      }

      // Packets flowing to -> from (Bidirectional traffic)
      for (let i = 0; i < particleCount - 2; i++) {
        particles.push({
          route,
          src: dst,
          dst: src,
          dir: -1, // reverse
          t: Math.random(),
          speed: (0.003 + Math.random() * 0.003),
          size: 1.6 + Math.random() * 0.7,
          color: route.isAnomaly ? '#FF7A45' : '#22D3C7'
        });
      }
    });

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Fit DPI
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale((rect.width * dpr) / 1000, (rect.height * dpr) / 560);
      ctx.clearRect(0, 0, 1000, 560);

      // Draw packet particles along routes
      particles.forEach(p => {
        p.t += p.speed * (dt * 60);
        if (p.t > 1) {
          p.t = 0;
        }

        const t = p.t;
        const x1 = p.src.x;
        const y1 = p.src.y;
        const x2 = p.dst.x;
        const y2 = p.dst.y;

        // Quadratic Bézier curve point calculation
        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2 + (p.route.bend || 0);

        // Transpacific loop curve
        if (p.route.isTranspacific) {
          cx = 500;
          cy = 40;
        }

        // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

        ctx.beginPath();
        ctx.arc(px, py, p.route.isAnomaly && isAnomalyActive ? p.size * 1.3 : p.size, 0, Math.PI * 2);

        if (p.route.isAnomaly && isAnomalyActive) {
          ctx.fillStyle = '#FF7A45';
          ctx.shadowColor = '#FF7A45';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();

      if (!reducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render(performance.now());
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, [reducedMotion, nodeDict, isAnomalyActive]);

  return (
    <div className="relative w-full h-[520px] lg:h-[570px] select-none rounded-2xl bg-[#090D12]/95 border border-[#1B222B] backdrop-blur-xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col justify-between group">
      
      {/* ── Background Cyber Map Grid & Lat/Long Coordinates ── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1B222B 1px, transparent 1px),
            linear-gradient(to bottom, #1B222B 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#090D12]/50 to-[#090D12]" />

      {/* ── Top Real-Time Telemetry Bar ──────────────────────── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[#1B222B]/80 bg-[#10151D]/80 backdrop-blur-md">
        
        {/* Left: Status & Live Pulse */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-textPrimary tracking-wider uppercase">
              LIVE GLOBAL NETWORK MAP
            </span>
          </div>
          <span className="hidden sm:inline-block w-1 h-3 bg-[#1B222B]" />
          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-textSecondary">
            <Globe className="w-3 h-3 text-[#51F0E3]" />
            <span>GLOBAL SPAN FABRIC</span>
          </span>
        </div>

        {/* Right: Key Telemetry Metrics */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-textSecondary">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-calm" />
            <span className="text-textPrimary font-semibold">{metrics.flowsPerSec.toLocaleString()}</span>
            <span className="text-calm">FLOWS/SEC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-textPrimary font-semibold">{metrics.throughput}</span>
            <span className="text-calm">MB/s</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[#51F0E3] font-semibold">{metrics.activeNodes}</span>
            <span className="text-calm">ACTIVE NODES</span>
          </div>
          <div className="flex items-center gap-1.5 pl-1 border-l border-[#1B222B]">
            <span className={`w-2 h-2 rounded-full ${isAnomalyActive ? 'bg-signal animate-pulse' : 'bg-emerald-400'}`} />
            <span className={isAnomalyActive ? 'text-signal font-semibold' : 'text-emerald-400 font-semibold'}>
              {isAnomalyActive ? 'C2 DETECTED' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Map Canvas & Interactive SVG Overlay ────────── */}
      <div className="relative flex-1 w-full h-full min-h-[400px] overflow-hidden">
        
        {/* SVG World Map & Routes Layer */}
        <svg 
          viewBox="0 0 1000 560" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="route-normal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B5A6B" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#51F0E3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4B5A6B" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="route-anomaly" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A45" stopOpacity={isAnomalyActive ? "0.9" : "0.3"} />
              <stop offset="50%" stopColor="#FF7A45" stopOpacity={isAnomalyActive ? "0.8" : "0.2"} />
              <stop offset="100%" stopColor="#FF7A45" stopOpacity={isAnomalyActive ? "0.9" : "0.3"} />
            </linearGradient>

            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Subtle Continents Background Outlines */}
          <g className="opacity-25" fill="#131C26" stroke="#1E2B3A" strokeWidth="0.8">
            {WORLD_CONTINENTS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* 2. Global Lat/Long Graticule Lines */}
          <g className="opacity-10" stroke="#8B98A5" strokeWidth="0.5" strokeDasharray="3 4">
            <line x1="0" y1="140" x2="1000" y2="140" /> {/* 45° N */}
            <line x1="0" y1="280" x2="1000" y2="280" /> {/* Equator */}
            <line x1="0" y1="420" x2="1000" y2="420" /> {/* 45° S */}
            <line x1="250" y1="0" x2="250" y2="560" />  {/* Americas */}
            <line x1="500" y1="0" x2="500" y2="560" />  {/* Prime Meridian */}
            <line x1="750" y1="0" x2="750" y2="560" />  {/* Asia/Pacific */}
          </g>

          {/* 3. Curved Backbone Routes */}
          {GLOBAL_ROUTES.map((route, i) => {
            const src = nodeDict[route.from];
            const dst = nodeDict[route.to];
            if (!src || !dst) return null;

            let pathData;
            if (route.isTranspacific) {
              pathData = `M ${src.x} ${src.y} Q 500 40 ${dst.x} ${dst.y}`;
            } else {
              const cx = (src.x + dst.x) / 2;
              const cy = (src.y + dst.y) / 2 + (route.bend || 0);
              pathData = `M ${src.x} ${src.y} Q ${cx} ${cy} ${dst.x} ${dst.y}`;
            }

            const isAnom = route.isAnomaly && isAnomalyActive;

            return (
              <path 
                key={i}
                d={pathData}
                fill="none"
                stroke={isAnom ? "url(#route-anomaly)" : "url(#route-normal)"}
                strokeWidth={isAnom ? "2" : "1.2"}
                strokeDasharray={isAnom ? "none" : undefined}
                filter={isAnom ? "url(#route-glow)" : undefined}
                className="transition-all duration-500"
              />
            );
          })}
        </svg>

        {/* Canvas Particle Stream Overlay */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        />

        {/* ── Interactive Regional Nodes Overlay ─────────────── */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {GLOBAL_NODES.map((node) => {
            const isAnomalyNode = node.id === 'in-west';
            const isSelected = selectedNode?.id === node.id;

            return (
              <div 
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node)}
                style={{
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 560) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute cursor-pointer group/node"
              >
                {/* Outer Wave Pulse on Anomaly Node */}
                {isAnomalyNode && isAnomalyActive && (
                  <span className="absolute -inset-3 rounded-full bg-signal/25 animate-ping pointer-events-none" />
                )}

                {/* Node Dot / Halo */}
                <div className="relative flex items-center justify-center">
                  <span className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    isAnomalyNode && isAnomalyActive
                      ? 'bg-[#FF7A45] border-white/80 shadow-[0_0_12px_#FF7A45]'
                      : isSelected
                      ? 'bg-[#51F0E3] border-white shadow-[0_0_10px_#51F0E3]'
                      : 'bg-[#121A24] border-[#51F0E3]/70 group-hover/node:border-[#51F0E3] group-hover/node:bg-[#1E2E3D]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isAnomalyNode && isAnomalyActive ? 'bg-white' : 'bg-[#51F0E3]'
                    }`} />
                  </span>

                  {/* Node City Code Label */}
                  <span className={`absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] font-semibold tracking-wider whitespace-nowrap px-1 rounded transition-colors ${
                    isAnomalyNode && isAnomalyActive 
                      ? 'text-signal bg-[#1D1412]/80 border border-signal/40' 
                      : 'text-[#8B98A5] group-hover/node:text-textPrimary bg-[#0A0D12]/70'
                  }`}>
                    {node.code}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Anomaly Detection Floating Badge (Near Mumbai/Frankfurt Route) ── */}
        <div 
          className={`absolute z-20 transition-all duration-700 pointer-events-none max-w-[280px] rounded-xl border p-3 backdrop-blur-xl ${
            isAnomalyActive 
              ? 'top-[42%] left-[46%] -translate-x-1/2 -translate-y-1/2 bg-[#16110F]/95 border-signal shadow-2xl shadow-signal/25 opacity-100 scale-100' 
              : 'top-[42%] left-[46%] -translate-x-1/2 -translate-y-1/2 bg-[#10161E]/90 border-[#1B222B] opacity-90 scale-95'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-lg shrink-0 ${isAnomalyActive ? 'bg-signal/20 text-signal animate-pulse' : 'bg-[#1B222B] text-calm'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="font-display font-bold text-[11px] text-textPrimary tracking-tight">
                  {isAnomalyActive ? 'ANOMALY DETECTED' : 'PASSIVE TAP STREAM'}
                </span>
                <span className="font-mono text-[10px] font-bold text-signal">
                  {metrics.anomalyConfidence}% CONF
                </span>
              </div>
              <p className="font-mono text-[10px] text-textSecondary leading-snug">
                {isAnomalyActive
                  ? 'BOM → FRA • C2 Periodic Beacon (32.4s interval)'
                  : '1,482 active flow streams monitored without latency'}
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-[#1B222B] flex items-center justify-between text-[9px] font-mono text-calm">
                <span>SENSOR: TAP-GLOBAL-01</span>
                <span className="text-emerald-400">INLINE IMPACT: 0.00ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Node Detail Popup Inspector (When Node Clicked) ──── */}
        {selectedNode && (
          <div className="absolute top-4 left-4 z-30 w-72 rounded-xl border border-textPrimary/40 bg-[#0B0F15]/95 p-3.5 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1B222B]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#51F0E3]" />
                <span className="font-display font-semibold text-xs text-textPrimary">
                  {selectedNode.name}
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
              <div className="flex justify-between text-textSecondary">
                <span>Region:</span>
                <span className="text-textPrimary">{selectedNode.region}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>Sensor IP:</span>
                <span className="text-textPrimary">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>Latency to Edge:</span>
                <span className="text-emerald-400">{selectedNode.ping}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>Active Monitored Flows:</span>
                <span className="text-textPrimary font-semibold">{selectedNode.flows}</span>
              </div>
              <div className="flex justify-between text-textSecondary">
                <span>Status:</span>
                <span className={selectedNode.id === 'in-west' && isAnomalyActive ? 'text-signal font-semibold' : 'text-emerald-400'}>
                  {selectedNode.id === 'in-west' && isAnomalyActive ? 'Anomaly Flagged (C2)' : 'Passive Monitoring'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Bottom Map Legend & Coverage Strip ───────────────── */}
      <div className="relative z-20 px-5 py-2.5 border-t border-[#1B222B]/80 bg-[#0C1117]/90 flex flex-wrap items-center justify-between gap-3 text-[11px] text-textSecondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#51F0E3]" />
            <span>Normal Traffic Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-signal" />
            <span>Suspicious/Anomalous Vector</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-calm hidden sm:inline">
          Click any POP node to inspect live flow telemetry
        </span>
      </div>

    </div>
  );
}
