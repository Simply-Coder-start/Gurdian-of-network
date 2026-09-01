import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Shield,
  Server,
  Radio,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Pause,
  Play,
  Globe,
  Database,
  Cpu,
  Layers,
  Lock,
  Network,
  Activity,
  ArrowRight,
  Monitor,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Cable,
  HardDrive
} from 'lucide-react';

export const NetworkTopology = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { selectedNode, setSelectedNode } = useTelemetry();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Authentic Enterprise Pipeline Node Architecture
  const nodes = useRef([
    {
      id: 'node-wan',
      label: 'Internet / WAN Gateway',
      shortName: 'WAN EDGE',
      type: 'wan',
      x: 85,
      y: 195,
      status: 'healthy',
      ip: '0.0.0.0/0',
      vlan: 'BGP AS13335 (Upstream)',
      interfaceName: '100G-WAN-01',
      rate: '↓ 1.84 Gbps | ↑ 420 Mbps',
      pkts: '86.4k pkts/s',
      role: 'External Transit & Cloud Ingress',
      tier: 'Perimeter Tier'
    },
    {
      id: 'node-edge-router',
      label: 'Edge Router (RTR-EDGE-01)',
      shortName: 'EDGE RTR',
      type: 'router',
      x: 215,
      y: 195,
      status: 'healthy',
      ip: '198.51.100.1/30',
      vlan: 'VLAN 100 • WAN Transit',
      interfaceName: 'xe-0/0/0 (10GbE)',
      rate: '1.84 Gbps',
      pkts: '86.4k pkts/s',
      role: 'Border Gateway / BGP / NAT',
      tier: 'Perimeter Tier'
    },
    {
      id: 'node-ngfw',
      label: 'Perimeter Firewall (NGFW-01)',
      shortName: 'NGFW CLUSTER',
      type: 'firewall',
      x: 350,
      y: 195,
      status: 'healthy',
      ip: '10.240.0.1/24',
      vlan: 'VLAN 200 • Perimeter DMZ',
      interfaceName: 'bond0 (2x10G LACP)',
      rate: '1.82 Gbps (Inspected)',
      pkts: '85.9k pkts/s',
      role: 'Stateful L4/L7 Inspection & IPS',
      tier: 'Security Tier',
      hasTapMirror: true
    },
    {
      id: 'node-alb',
      label: 'Load Balancer (ALB-PROD-01)',
      shortName: 'ALB / WAF',
      type: 'loadbalancer',
      x: 485,
      y: 195,
      status: 'healthy',
      ip: '10.240.2.10',
      vlan: 'VLAN 300 • Load Balancing',
      interfaceName: 'eth1 (VIP 10.240.2.10)',
      rate: '1.42 Gbps',
      pkts: '68.2k pkts/s',
      role: 'HA Proxy / TLS 1.3 Termination',
      tier: 'App Gateway Tier'
    },
    {
      id: 'node-app-pool',
      label: 'Web & API App Services',
      shortName: 'K8S APP POOL',
      type: 'server',
      x: 625,
      y: 120,
      status: 'healthy',
      ip: '10.240.10.0/24',
      vlan: 'VLAN 400 • Microservices',
      interfaceName: 'calico-veth0 (Overlay)',
      rate: '980 Mbps (HTTP/2 & gRPC)',
      pkts: '48.1k pkts/s',
      role: 'Kubernetes Pods & Microservices',
      tier: 'Application Tier'
    },
    {
      id: 'node-core-switch',
      label: 'Core Switch (SW-CORE-01)',
      shortName: 'CORE SPINE',
      type: 'switch',
      x: 625,
      y: 270,
      status: 'healthy',
      ip: '10.240.0.254',
      vlan: 'VLAN 10 • Backbone Spine',
      interfaceName: '100GbE Spine-Leaf',
      rate: '3.80 Gbps Switching',
      pkts: '142.8k pkts/s',
      role: 'L3 Backbone Routing & SPAN Tap',
      tier: 'Backbone Tier',
      hasTapMirror: true
    },
    {
      id: 'node-db-cluster',
      label: 'Database (DB-PROD-01)',
      shortName: 'TELEMETRY DB',
      type: 'database',
      x: 785,
      y: 100,
      status: 'healthy',
      ip: '10.240.20.5',
      vlan: 'VLAN 500 • Data Tier',
      interfaceName: 'bond1 (NVMe-oF)',
      rate: '840 Mbps',
      pkts: '24.2k pkts/s',
      role: 'Columnar Time-Series Cluster',
      tier: 'Data Tier'
    },
    {
      id: 'node-ad-sso',
      label: 'Active Directory (AD-DC-01)',
      shortName: 'IDENTITY / AD',
      type: 'identity',
      x: 785,
      y: 195,
      status: 'healthy',
      ip: '10.240.30.12',
      vlan: 'VLAN 600 • Identity Tier',
      interfaceName: 'eth0 (Kerberos :88)',
      rate: '120 Mbps',
      pkts: '6.4k pkts/s',
      role: 'Kerberos / SSO / LDAP Controller',
      tier: 'Identity Tier'
    },
    {
      id: 'node-lan-workstations',
      label: 'Workstations (LAN-WORKSTATIONS)',
      shortName: 'INTERNAL LAN',
      type: 'workstation',
      x: 785,
      y: 290,
      status: 'critical',
      ip: '10.240.12.0/24',
      vlan: 'VLAN 700 • Corporate LAN',
      interfaceName: '1GbE PoE Access',
      rate: '480 Mbps',
      pkts: '18.9k pkts/s',
      role: 'Corporate Workstations Subnet',
      alert: 'Compromised Host (10.240.12.84 Exfiltration)',
      tier: 'Client Tier'
    }
  ]);

  // Network Pipeline Physical & Logical Links
  const connections = useRef([
    { from: 'node-wan', to: 'node-edge-router', bandwidth: '1.84 Gbps', proto: 'BGP / IP', color: '#51F0E3', speed: 0.008 },
    { from: 'node-edge-router', to: 'node-ngfw', bandwidth: '1.84 Gbps', proto: 'LACP Bond', color: '#51F0E3', speed: 0.008 },
    { from: 'node-ngfw', to: 'node-alb', bandwidth: '1.42 Gbps', proto: 'TLS 1.3 / TCP', color: '#51F0E3', speed: 0.008 },
    { from: 'node-alb', to: 'node-app-pool', bandwidth: '980 Mbps', proto: 'HTTP/2 & gRPC', color: '#51F0E3', speed: 0.009 },
    { from: 'node-app-pool', to: 'node-core-switch', bandwidth: '1.20 Gbps', proto: 'Internal RPC', color: '#51F0E3', speed: 0.008 },
    { from: 'node-core-switch', to: 'node-db-cluster', bandwidth: '840 Mbps', proto: 'Postgres :5432', color: '#51F0E3', speed: 0.007 },
    { from: 'node-core-switch', to: 'node-ad-sso', bandwidth: '120 Mbps', proto: 'LDAP / Kerberos', color: '#51F0E3', speed: 0.006 },
    { from: 'node-core-switch', to: 'node-lan-workstations', bandwidth: '480 Mbps', proto: 'SMB / HTTPS', color: '#FF4450', threat: true, speed: 0.014 }
  ]);

  // Bi-directional Animated Flow Particles
  const particles = useRef([]);
  useEffect(() => {
    particles.current = Array.from({ length: 42 }, () => {
      const cIdx = Math.floor(Math.random() * connections.current.length);
      const conn = connections.current[cIdx];
      const isReverse = Math.random() > 0.65; // Egress/Response return packets
      return {
        connIndex: cIdx,
        t: Math.random(),
        speed: (conn.speed || 0.008) * (0.8 + Math.random() * 0.4),
        isReverse,
        size: conn.threat ? 3.8 : 2.4
      };
    });
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const now = Date.now();

      // 1. Draw Network Infrastructure Rack Grid
      ctx.strokeStyle = 'rgba(28, 48, 60, 0.3)';
      ctx.lineWidth = 1;
      const gridSize = 35;
      const w = canvas.width / zoom;
      const h = canvas.height / zoom;

      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. Draw Pipeline Tier Enclosure Bounding Boxes
      const drawTierBox = (x1, y1, x2, y2, title) => {
        ctx.save();
        ctx.strokeStyle = 'rgba(81, 240, 227, 0.08)';
        ctx.fillStyle = 'rgba(10, 18, 24, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.roundRect(x1, y1, x2 - x1, y2 - y1, 8);
        ctx.fill();
        ctx.stroke();
        ctx.font = '600 9px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(81, 240, 227, 0.4)';
        ctx.fillText(title.toUpperCase(), x1 + 8, y1 + 14);
        ctx.restore();
      };

      drawTierBox(40, 60, 410, 345, 'Perimeter & Ingress Security Tier');
      drawTierBox(435, 60, 700, 345, 'Application & Backbone Fabric Tier');
      drawTierBox(720, 60, 920, 345, 'Internal Secure Services & LAN');

      // 3. Draw Physical & Logical Network Links
      connections.current.forEach(conn => {
        const fromNode = nodes.current.find(n => n.id === conn.from);
        const toNode = nodes.current.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const isHighlighted =
          hoveredNode && (hoveredNode.id === conn.from || hoveredNode.id === conn.to);
        const isDimmed = hoveredNode && !isHighlighted;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        if (conn.threat) {
          // Compromised Exfil Link
          ctx.strokeStyle = isDimmed ? 'rgba(255, 68, 80, 0.2)' : 'rgba(255, 68, 80, 0.85)';
          ctx.lineWidth = isHighlighted ? 3.5 : 2.5;
          ctx.setLineDash([6, 3]);
          ctx.lineDashOffset = -now / 35;
          ctx.shadowColor = '#FF4450';
          ctx.shadowBlur = isDimmed ? 0 : 10;
        } else {
          // Nominal High-Speed Link
          ctx.strokeStyle = isDimmed ? 'rgba(81, 240, 227, 0.12)' : 'rgba(81, 240, 227, 0.5)';
          ctx.lineWidth = isHighlighted ? 3 : 1.8;
          ctx.setLineDash([]);
          ctx.shadowColor = '#51F0E3';
          ctx.shadowBlur = isDimmed ? 0 : 5;
        }

        ctx.stroke();

        // Draw Link Bandwidth Pill Tag at Midpoint
        if (!isDimmed) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          ctx.font = '500 8px JetBrains Mono, monospace';
          ctx.fillStyle = conn.threat ? '#FF7675' : '#8B9AA3';
          ctx.textAlign = 'center';
          ctx.fillText(conn.bandwidth, midX, midY - 6);
        }

        ctx.restore();
      });

      // 4. Draw Animated Bi-directional Flow Packets
      if (!isPaused) {
        particles.current.forEach(p => {
          const conn = connections.current[p.connIndex];
          const fromNode = nodes.current.find(n => n.id === conn.from);
          const toNode = nodes.current.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return;

          p.t += p.speed;
          if (p.t > 1) p.t = 0;

          const progress = p.isReverse ? 1 - p.t : p.t;
          const curX = fromNode.x + (toNode.x - fromNode.x) * progress;
          const curY = fromNode.y + (toNode.y - fromNode.y) * progress;

          const isDimmed = hoveredNode && !(hoveredNode.id === conn.from || hoveredNode.id === conn.to);
          const pColor = conn.threat
            ? '#FF4450'
            : p.isReverse
            ? '#22D3C7'
            : '#51F0E3';

          ctx.save();
          ctx.beginPath();
          ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.15)' : pColor;
          ctx.shadowColor = pColor;
          ctx.shadowBlur = isDimmed ? 0 : conn.threat ? 12 : 6;
          ctx.fill();
          ctx.restore();
        });
      }

      // 5. Draw Enterprise Pipeline Nodes
      nodes.current.forEach(node => {
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isDimmed = hoveredNode && !isHovered && !connections.current.some(c => (c.from === hoveredNode.id && c.to === node.id) || (c.to === hoveredNode.id && c.from === node.id));

        const isCritical = node.status === 'critical';
        const isWarning = node.status === 'warning';

        ctx.save();

        // Critical Node Radar Ring
        if (isCritical && !isDimmed) {
          const ring = (now / 22) % 36;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 16 + ring, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 68, 80, ${Math.max(0, 0.6 - ring / 36)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Device Icon Enclosure Box (Rack Unit look)
        const boxW = 34;
        const boxH = 34;
        ctx.beginPath();
        ctx.roundRect(node.x - boxW / 2, node.y - boxH / 2, boxW, boxH, 8);

        ctx.fillStyle = isDimmed
          ? 'rgba(8, 14, 18, 0.4)'
          : isCritical
          ? 'rgba(42, 14, 18, 0.95)'
          : isWarning
          ? 'rgba(38, 28, 14, 0.95)'
          : isSelected || isHovered
          ? 'rgba(20, 48, 54, 0.98)'
          : 'rgba(12, 22, 28, 0.92)';

        ctx.strokeStyle = isDimmed
          ? 'rgba(28, 48, 60, 0.3)'
          : isCritical
          ? '#FF4450'
          : isWarning
          ? '#FFB963'
          : isSelected || isHovered
          ? '#51F0E3'
          : 'rgba(81, 240, 227, 0.3)';

        ctx.lineWidth = isSelected || isHovered ? 2.5 : 1.5;
        ctx.shadowColor = isCritical ? '#FF4450' : '#51F0E3';
        ctx.shadowBlur = isDimmed ? 0 : isHovered || isSelected ? 16 : isCritical ? 10 : 3;
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw Center Status Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isDimmed
          ? '#445566'
          : isCritical
          ? '#FF4450'
          : isWarning
          ? '#FFB963'
          : '#51F0E3';
        ctx.fill();

        // Node Short/Main Label
        ctx.font = '600 10.5px Inter, sans-serif';
        ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.3)' : '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(node.shortName, node.x, node.y + 28);

        // Subnet / VLAN Label
        ctx.font = '400 9px JetBrains Mono, monospace';
        ctx.fillStyle = isDimmed
          ? 'rgba(139, 154, 163, 0.3)'
          : isCritical
          ? '#FF7675'
          : isWarning
          ? '#F5C451'
          : '#8B9AA3';
        ctx.fillText(node.ip, node.x, node.y + 39);

        // Interface / Rate Mini Subtitle
        ctx.font = '400 8.5px JetBrains Mono, monospace';
        ctx.fillStyle = isDimmed ? 'rgba(81, 240, 227, 0.2)' : 'rgba(81, 240, 227, 0.85)';
        ctx.fillText(node.interfaceName, node.x, node.y - 23);

        ctx.restore();
      });

      // 6. Draw Passive Optical SPAN Mirror Tap Module (SOC Sensor HUD Overlay)
      ctx.save();
      const tapX = 490;
      const tapY = 320;
      ctx.beginPath();
      ctx.roundRect(tapX - 110, tapY - 14, 220, 28, 6);
      ctx.fillStyle = 'rgba(7, 14, 19, 0.85)';
      ctx.strokeStyle = 'rgba(81, 240, 227, 0.4)';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();

      // Optical Tap Line from NGFW and Core Switch into Sensor
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(81, 240, 227, 0.35)';
      ctx.beginPath();
      ctx.moveTo(350, 212);
      ctx.lineTo(tapX - 40, tapY);
      ctx.moveTo(625, 287);
      ctx.lineTo(tapX + 40, tapY);
      ctx.stroke();

      ctx.font = '700 9px JetBrains Mono, monospace';
      ctx.fillStyle = '#51F0E3';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 PASSIVE OPTICAL TAP (READ-ONLY)', tapX, tapY + 4);
      ctx.restore();

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [zoom, pan, isPaused, hoveredNode, selectedNode]);

  // Mouse Move Hover Detector
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left - pan.x) / zoom;
    const clientY = (e.clientY - rect.top - pan.y) / zoom;

    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    const found = nodes.current.find(n => {
      const dx = n.x - clientX;
      const dy = n.y - clientY;
      return Math.sqrt(dx * dx + dy * dy) < 26;
    });

    setHoveredNode(found || null);
  };

  // Node Click Inspector Detector
  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    const clicked = nodes.current.find(n => {
      const dx = n.x - clickX;
      const dy = n.y - clickY;
      return Math.sqrt(dx * dx + dy * dy) < 26;
    });

    setSelectedNode(clicked || null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[470px] bg-[#070D12] border border-primary/25 rounded-2xl overflow-hidden shadow-2xl flex flex-col select-none group"
    >
      {/* Top Controls Header Bar */}
      <div className="h-11 bg-[#091218]/90 border-b border-primary/15 px-4 flex items-center justify-between text-xs backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_8px_#51F0E3]" />
          </span>
          <span className="font-mono text-primary font-bold uppercase tracking-wider text-[11px]">
            ENTERPRISE END-TO-END TRAFFIC PIPELINE
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#111A22] border border-primary/15 text-gray-300">
            9 Pipeline Nodes Active
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 font-mono">
          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume Packet Flow' : 'Pause Flow Simulation'}
            className="px-2.5 py-1 rounded bg-[#111A22] hover:bg-[#182632] border border-primary/15 text-xs text-gray-300 hover:text-white transition flex items-center gap-1"
          >
            {isPaused ? <Play className="w-3 h-3 text-primary fill-current" /> : <Pause className="w-3 h-3 text-warning" />}
            <span className="hidden sm:inline text-[10px]">{isPaused ? 'Play' : 'Pause'}</span>
          </button>

          <button
            onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
            title="Zoom In"
            className="p-1.5 rounded bg-[#111A22] hover:bg-[#182632] border border-primary/15 text-gray-300 hover:text-white transition"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
            title="Zoom Out"
            className="p-1.5 rounded bg-[#111A22] hover:bg-[#182632] border border-primary/15 text-gray-300 hover:text-white transition"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Reset Pipeline View"
            className="p-1.5 rounded bg-[#111A22] hover:bg-[#182632] border border-primary/15 text-gray-300 hover:text-white transition"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex-1 relative overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={980}
          height={430}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={handleClick}
          className="w-full h-full block"
        />

        {/* Hover Floating HUD Tooltip */}
        {hoveredNode && (
          <div
            className="pointer-events-none absolute z-30 p-2.5 rounded-xl bg-[#091319]/95 border border-primary/40 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1 transform -translate-x-1/2 -translate-y-full -mt-3"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-primary/20 pb-1">
              <span className="font-bold text-white font-sans">{hoveredNode.label}</span>
              <span className={`text-[10px] font-bold ${hoveredNode.status === 'critical' ? 'text-error' : 'text-primary'}`}>
                {hoveredNode.status.toUpperCase()}
              </span>
            </div>
            <div className="text-[10px] text-gray-300 space-y-0.5">
              <div><span>Subnet: </span><span className="text-primary">{hoveredNode.vlan}</span></div>
              <div><span>Interface: </span><span className="text-white">{hoveredNode.interfaceName}</span> ({hoveredNode.rate})</div>
              <div><span>Throughput: </span><span className="text-primaryContainer">{hoveredNode.pkts}</span></div>
            </div>
            {hoveredNode.alert && (
              <div className="text-[10px] text-error font-semibold pt-0.5">
                ⚠ {hoveredNode.alert}
              </div>
            )}
          </div>
        )}

        {/* Top-Right Passive Read-Only Guarantee Badge */}
        <div className="absolute top-3 left-3 bg-[#081016]/90 backdrop-blur-md border border-primary/25 rounded-lg px-2.5 py-1 text-[10px] font-mono text-gray-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-healthy shadow-[0_0_6px_#4ADE80]" />
          <span>PASSIVE SPAN SENSOR: <strong className="text-primary font-bold">READ-ONLY</strong></span>
        </div>

        {/* Click-Selected Device Telemetry Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 bg-[#081016]/95 backdrop-blur-md border border-primary/40 rounded-xl p-4 w-80 shadow-2xl text-xs space-y-3 z-20 animate-fadeIn font-mono">
            <div className="flex items-center justify-between border-b border-primary/20 pb-2">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${selectedNode.status === 'critical' ? 'text-error' : 'text-primary'}`} />
                <span className="font-bold text-white font-sans truncate">{selectedNode.label}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="w-5 h-5 rounded hover:bg-surfaceHighest text-gray-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>IP / CIDR:</span> <span className="text-primary font-bold">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>VLAN / Segment:</span> <span className="text-white truncate max-w-[150px]">{selectedNode.vlan}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Interface Port:</span> <span className="text-gray-200">{selectedNode.interfaceName}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Throughput:</span> <span className="text-primary">{selectedNode.rate}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Packet Velocity:</span> <span className="text-white">{selectedNode.pkts}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Architecture Tier:</span> <span className="text-primaryContainer">{selectedNode.tier}</span>
              </div>

              {selectedNode.alert && (
                <div className="mt-2 p-2.5 rounded-lg bg-error/15 border border-error/30 text-error text-[10px] space-y-1">
                  <div className="font-bold">SECURITY ANOMALY FLAGGED</div>
                  <p className="text-gray-300 font-sans">{selectedNode.alert}</p>
                </div>
              )}

              {/* Passive Notice */}
              <div className="mt-2 p-2 rounded bg-[#111A22] border border-border text-[9px] text-gray-400">
                🔒 Captured via passive SPAN mirror port. Zero active injection or routing intervention.
              </div>
            </div>

            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-bold text-[10px] transition"
            >
              Close Device Telemetry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
