import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* ─────────────────────────────────────────────────────────────
   7–10 Global Network Monitoring Points
   Coordinate system: 1000 x 580 (Equirectangular projection)
   ───────────────────────────────────────────────────────────── */
const MONITORING_NODES = [
  { id: 'us-east', name: 'US East (Virginia)', code: 'US-E', region: 'North America', x: 278, y: 200, count: null, status: 'active' },
  { id: 'us-west', name: 'US West (California)', code: 'US-W', region: 'North America', x: 172, y: 205, count: null, status: 'active' },
  { id: 'sa-east', name: 'South America (São Paulo)', code: 'BR-SP', region: 'South America', x: 362, y: 395, count: null, status: 'active' },
  { id: 'eu-cluster', name: 'Europe (London / Frankfurt)', code: 'EU-C', region: 'Europe', x: 508, y: 168, count: 2, status: 'high' },
  { id: 'za-south', name: 'South Africa (Cape Town)', code: 'ZA-CPT', region: 'Africa', x: 558, y: 432, count: null, status: 'active' },
  { id: 'in-west', name: 'India (Mumbai / Delhi)', code: 'IN-MUM', region: 'India', x: 686, y: 268, count: null, status: 'anomaly' },
  { id: 'se-asia', name: 'Southeast Asia (Singapore)', code: 'SG-SIN', region: 'Southeast Asia', x: 772, y: 334, count: null, status: 'high' },
  { id: 'east-asia', name: 'East Asia (Tokyo)', code: 'JP-TYO', region: 'East Asia', x: 868, y: 212, count: null, status: 'high' },
  { id: 'au-east', name: 'Australia (Sydney)', code: 'AU-SYD', region: 'Australia', x: 894, y: 428, count: null, status: 'active' },
];

/* ─────────────────────────────────────────────────────────────
   Global Network Routes with Connection States:
   - normal: subtle teal (#22D3C7 at 0.35)
   - high: brighter teal (#51F0E3 at 0.75)
   - suspicious: subtle orange (#FF9F45)
   - anomaly: highlighted alert route (#FF5533)
   ───────────────────────────────────────────────────────────── */
const NETWORK_ROUTES = [
  // Transatlantic & Americas
  { id: 'r1', from: 'us-west', to: 'us-east', bend: -18, state: 'high', speed: 1.2 },
  { id: 'r2', from: 'us-east', to: 'eu-cluster', bend: -32, state: 'high', speed: 1.4 },
  { id: 'r3', from: 'us-east', to: 'sa-east', bend: 24, state: 'normal', speed: 0.9 },
  { id: 'r4', from: 'sa-east', to: 'za-south', bend: 18, state: 'normal', speed: 0.8 },
  
  // Europe to Africa, Middle East & Asia
  { id: 'r5', from: 'eu-cluster', to: 'za-south', bend: -15, state: 'normal', speed: 0.85 },
  { id: 'r6', from: 'eu-cluster', to: 'in-west', bend: -28, state: 'anomaly', speed: 1.6 }, // Anomaly Route!
  
  // Indo-Pacific & East Asia
  { id: 'r7', from: 'in-west', to: 'se-asia', bend: -12, state: 'high', speed: 1.3 },
  { id: 'r8', from: 'se-asia', to: 'east-asia', bend: -22, state: 'high', speed: 1.5 },
  { id: 'r9', from: 'se-asia', to: 'au-east', bend: 20, state: 'normal', speed: 0.9 },
  
  // Transpacific Backbone (Tokyo -> US West)
  { id: 'r10', from: 'east-asia', to: 'us-west', bend: -55, state: 'suspicious', speed: 1.1, isTranspacific: true },
];

/* ─────────────────────────────────────────────────────────────
   Realistic Monochrome World Map Geometry
   Detailed landmasses + country boundaries matching reference
   ───────────────────────────────────────────────────────────── */
const LAND_POLYGONS = [
  // North America (Canada, US, Alaska)
  "M 60 120 L 105 105 L 145 92 L 205 78 L 265 82 L 315 105 L 340 135 L 320 160 L 285 168 L 298 195 L 292 225 L 275 240 L 255 248 L 235 275 L 210 260 L 195 242 L 165 240 L 140 215 L 115 175 L 80 155 Z",
  // Greenland
  "M 345 52 L 392 42 L 415 72 L 378 95 L 342 78 Z",
  // Central America & Mexico
  "M 210 260 L 235 275 L 260 288 L 272 312 L 255 315 L 235 295 L 205 272 Z",
  // South America (Brazil, Colombia, Peru, Chile, Argentina)
  "M 268 318 L 305 312 L 348 335 L 395 372 L 388 425 L 355 475 L 325 515 L 308 485 L 295 435 L 278 375 L 258 340 Z",
  // British Isles
  "M 472 145 L 488 135 L 495 155 L 482 172 L 468 160 Z",
  // Western & Central Europe
  "M 495 130 L 542 120 L 568 135 L 565 175 L 525 198 L 488 190 L 480 162 Z",
  // Scandinavia
  "M 515 85 L 545 75 L 562 105 L 538 128 L 515 110 Z",
  // Africa (North, West, Central, South, Horn)
  "M 470 212 L 552 208 L 595 245 L 618 282 L 588 365 L 565 448 L 528 425 L 488 355 L 452 285 L 452 235 Z",
  // Madagascar
  "M 622 390 L 635 385 L 638 422 L 625 432 Z",
  // Middle East & Levant
  "M 565 195 L 625 192 L 652 235 L 635 275 L 588 270 L 575 225 Z",
  // Russian Mainland & North Asia
  "M 568 125 L 665 95 L 775 88 L 885 105 L 945 145 L 920 185 L 845 192 L 765 188 L 685 182 L 595 175 Z",
  // Central Asia & China
  "M 635 188 L 745 192 L 835 195 L 852 255 L 815 288 L 762 278 L 715 258 L 655 242 Z",
  // India Subcontinent
  "M 662 238 L 712 245 L 728 288 L 695 342 L 668 295 Z",
  // Southeast Asia (Indochina, Malay Peninsula)
  "M 755 262 L 795 272 L 788 322 L 762 338 L 748 295 Z",
  // Indonesia & Philippines Islands
  "M 785 348 L 842 355 L 835 385 L 778 375 Z M 825 285 L 848 292 L 842 335 L 820 325 Z",
  // Japan Archipelago
  "M 855 175 L 878 185 L 868 232 L 848 215 Z",
  // Australia Mainland
  "M 808 385 L 875 372 L 928 405 L 905 475 L 835 468 L 795 425 Z",
  // New Zealand
  "M 945 465 L 962 458 L 955 495 L 938 488 Z",
  // Antarctica Coastline Strip
  "M 50 555 L 250 545 L 500 548 L 750 542 L 950 550 L 950 575 L 50 575 Z"
];

/* Subtle country internal border lines (matching dark reference) */
const COUNTRY_BORDERS = [
  "M 140 160 L 285 168", // US / Canada Border
  "M 210 240 L 265 240", // US / Mexico Border
  "M 285 360 L 375 365", // Brazil Northern Border
  "M 290 440 L 355 440", // Argentina / Brazil Border
  "M 515 165 L 542 165", // France / Germany
  "M 500 280 L 580 280", // Sahara division
  "M 530 350 L 585 350", // Central Africa division
  "M 550 400 L 590 400", // South Africa border
  "M 660 170 L 760 170", // Russia / Central Asia
  "M 655 242 L 662 238", // Pakistan / India
  "M 712 245 L 762 278", // India / China
  "M 788 322 L 762 338", // Thailand / Malaysia
  "M 845 420 L 895 420"  // Australia state division
];

export function LiveGlobalNetworkMap() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('ALL TRAFFIC');
  const [pulseNodeId, setPulseNodeId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Quick lookup dictionary for nodes
  const nodeLookup = useMemo(() => {
    const map = {};
    MONITORING_NODES.forEach(n => { map[n.id] = n; });
    return map;
  }, []);

  // Continuous Canvas rendering of glowing teal & amber packets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    // Generate flowing packet particles
    const particles = [];
    NETWORK_ROUTES.forEach(route => {
      const src = nodeLookup[route.from];
      const dst = nodeLookup[route.to];
      if (!src || !dst) return;

      const count = route.state === 'high' ? 8 : route.state === 'anomaly' ? 9 : 5;

      for (let i = 0; i < count; i++) {
        particles.push({
          route,
          src,
          dst,
          t: Math.random(),
          speed: (0.0035 + Math.random() * 0.0025) * (route.speed || 1),
          size: route.state === 'anomaly' ? 2.6 : route.state === 'high' ? 2.2 : 1.8,
          dir: i % 2 === 0 ? 1 : -1, // Bidirectional flow
          color: route.state === 'anomaly' 
            ? '#FF5533' 
            : route.state === 'suspicious' 
            ? '#FF9F45' 
            : route.state === 'high' 
            ? '#51F0E3' 
            : '#22D3C7'
        });
      }
    });

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale((rect.width * dpr) / 1000, (rect.height * dpr) / 580);
      ctx.clearRect(0, 0, 1000, 580);

      particles.forEach(p => {
        p.t += p.speed * (dt * 60);

        // Packet reached destination node -> trigger node pulse wave
        if (p.t >= 1) {
          p.t = 0;
          const arrivedNodeId = p.dir === 1 ? p.route.to : p.route.from;
          if (Math.random() < 0.35) {
            setPulseNodeId(arrivedNodeId);
          }
        }

        const t = p.dir === 1 ? p.t : 1 - p.t;
        const x1 = p.src.x;
        const y1 = p.src.y;
        const x2 = p.dst.x;
        const y2 = p.dst.y;

        // Quadratic curve center point
        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2 + (p.route.bend || 0);

        // Transpacific arc wrap
        if (p.route.isTranspacific) {
          cx = 520;
          cy = 30;
        }

        // Quadratic Bezier interpolation
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.route.state === 'anomaly' ? 8 : 4;
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
  }, [reducedMotion, nodeLookup]);

  return (
    <div className="relative w-full h-[520px] lg:h-[570px] select-none rounded-2xl bg-[#080B10] border border-[#161C24] backdrop-blur-xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col justify-between group">
      
      {/* ── Top Minimal Segmented Navigation Bar (Matching Reference) ── */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2.5 border-b border-[#141A22] bg-[#0C1017]/90 text-xs">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {['ALL TRAFFIC', 'HIGH LOAD', 'ANOMALIES', 'LATENCY'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all ${
                activeTab === tab
                  ? 'bg-[#18222E] text-[#51F0E3] border border-[#233547] shadow-sm font-semibold'
                  : 'text-[#6C7D8F] hover:text-[#B0BAC5] hover:bg-[#121720]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Live indicator & node count */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#7E8D9F] shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#51F0E3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#51F0E3]"></span>
            </span>
            <span className="text-[#E7ECF0] font-medium hidden sm:inline">GLOBAL SENSOR FABRIC</span>
          </div>
          <span className="text-[#1F2937]">|</span>
          <span className="text-[#51F0E3] font-semibold">9 MONITORS</span>
        </div>
      </div>

      {/* ── Main World Map Canvas & Vector Geometry ───────────── */}
      <div className="relative flex-1 w-full h-full min-h-[390px] overflow-hidden bg-[#070A0E]">
        
        {/* Subtle Vignette & Glow */}
        <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#070A0E]/30 to-[#070A0E]" />

        {/* SVG World Map Continents & Curved Network Routes */}
        <svg 
          viewBox="0 0 1000 580" 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <defs>
            {/* Soft subtle glow for routes */}
            <filter id="route-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradients */}
            <linearGradient id="route-teal-normal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3C7" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#22D3C7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#22D3C7" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="route-teal-high" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#51F0E3" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#51F0E3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#51F0E3" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="route-anomaly-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5533" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FF7A45" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FF5533" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="route-suspicious-orange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF9F45" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FF9F45" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FF9F45" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* 1. Dark Charcoal Continents (Matching Reference) */}
          <g fill="#14181F" stroke="#1D242E" strokeWidth="0.75" className="opacity-95">
            {LAND_POLYGONS.map((path, idx) => (
              <path key={idx} d={path} />
            ))}
          </g>

          {/* 2. Country Internal Boundary Borders */}
          <g fill="none" stroke="#1D242E" strokeWidth="0.6" className="opacity-70">
            {COUNTRY_BORDERS.map((line, idx) => (
              <path key={idx} d={line} />
            ))}
          </g>

          {/* 3. Curved Network Routes */}
          {NETWORK_ROUTES.map((route) => {
            const src = nodeLookup[route.from];
            const dst = nodeLookup[route.to];
            if (!src || !dst) return null;

            let pathData;
            if (route.isTranspacific) {
              pathData = `M ${src.x} ${src.y} Q 520 30 ${dst.x} ${dst.y}`;
            } else {
              const cx = (src.x + dst.x) / 2;
              const cy = (src.y + dst.y) / 2 + (route.bend || 0);
              pathData = `M ${src.x} ${src.y} Q ${cx} ${cy} ${dst.x} ${dst.y}`;
            }

            const strokeUrl = route.state === 'anomaly'
              ? "url(#route-anomaly-red)"
              : route.state === 'suspicious'
              ? "url(#route-suspicious-orange)"
              : route.state === 'high'
              ? "url(#route-teal-high)"
              : "url(#route-teal-normal)";

            const strokeWidth = route.state === 'anomaly' ? "1.8" : route.state === 'high' ? "1.4" : "1.0";

            return (
              <path 
                key={route.id}
                d={pathData}
                fill="none"
                stroke={strokeUrl}
                strokeWidth={strokeWidth}
                filter={route.state === 'anomaly' || route.state === 'high' ? "url(#route-soft-glow)" : undefined}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* 4. Canvas Packet Animation Layer */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        />

        {/* 5. Clean Circular Pin Nodes (Matching Reference Screenshot) */}
        <div className="absolute inset-0 z-20 pointer-events-auto">
          {MONITORING_NODES.map((node) => {
            const isAnomaly = node.status === 'anomaly';
            const isPulsing = pulseNodeId === node.id;
            const isHovered = hoveredNode?.id === node.id;

            return (
              <div 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  left: `${(node.x / 1000) * 100}%`,
                  top: `${(node.y / 580) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute cursor-pointer group"
              >
                {/* Outer Ripple Wave on packet arrival / anomaly */}
                {isPulsing && (
                  <span className={`absolute -inset-3 rounded-full animate-ping pointer-events-none ${
                    isAnomaly ? 'bg-[#FF5533]/30' : 'bg-[#51F0E3]/25'
                  }`} />
                )}

                {/* Node White / Light Badge Circle */}
                <div className="relative flex items-center justify-center">
                  {node.count ? (
                    // Group count badge (like "2" in London/Frankfurt cluster in reference)
                    <div className="w-6 h-6 rounded-full bg-[#E5E9EE] text-[#0A0D12] font-display font-bold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.4)] border border-white">
                      {node.count}
                    </div>
                  ) : (
                    // Single circular pin node
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isAnomaly 
                        ? 'bg-[#FF5533] border-white shadow-[0_0_12px_#FF5533]' 
                        : 'bg-[#E5E9EE] border-[#18202A] shadow-[0_0_8px_rgba(255,255,255,0.45)] group-hover:scale-125'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isAnomaly ? 'bg-white' : 'bg-[#0E1318]'
                      }`} />
                    </div>
                  )}

                  {/* Clean city label on hover */}
                  {isHovered && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#0F141C] border border-[#232D3B] text-[#E7ECF0] text-[10px] font-mono whitespace-nowrap shadow-xl z-30">
                      {node.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Clean Small "ANOMALY" Indicator Pill on Mumbai-Europe Route */}
        <div 
          className="absolute z-20 pointer-events-none rounded-full px-2.5 py-0.5 border border-[#FF5533]/80 bg-[#1A100E]/90 backdrop-blur-md shadow-[0_0_15px_rgba(255,85,51,0.25)] flex items-center gap-1.5"
          style={{
            left: '58%',
            top: '32%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] animate-ping" />
          <span className="font-mono text-[9.5px] font-bold text-[#FF5533] tracking-wider uppercase">
            ANOMALY • 94.2%
          </span>
        </div>

        {/* 7. Minimal Zoom Controls [+] [-] (Matching Reference Image) */}
        <div className="absolute bottom-3 right-3 z-20 flex flex-col rounded-lg border border-[#1C2532] bg-[#0E131A]/90 overflow-hidden shadow-lg">
          <button 
            onClick={() => setZoomLevel(z => Math.min(z + 0.1, 1.4))}
            className="w-6 h-6 flex items-center justify-center text-[#8B98A5] hover:text-[#E7ECF0] hover:bg-[#1A232F] text-xs font-mono border-b border-[#1C2532] transition-colors"
          >
            +
          </button>
          <button 
            onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.8))}
            className="w-6 h-6 flex items-center justify-center text-[#8B98A5] hover:text-[#E7ECF0] hover:bg-[#1A232F] text-xs font-mono transition-colors"
          >
            −
          </button>
        </div>

      </div>

      {/* ── Bottom Clean Legend Strip ─────────────────────────── */}
      <div className="relative z-20 px-4 py-2 border-t border-[#141A22] bg-[#0A0E14]/90 flex items-center justify-between text-[11px] text-[#6C7D8F]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22D3C7]" />
            <span>Normal Traffic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#51F0E3]" />
            <span>High Load</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5533]" />
            <span>Suspicious Anomaly</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-[#4A5766] hidden sm:inline">
          GLOBAL NETWORK TRAFFIC • 1,482 FLOWS/S
        </span>
      </div>

    </div>
  );
}
