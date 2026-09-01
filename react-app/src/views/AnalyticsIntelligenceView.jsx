import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MetricCard } from '../components/common/MetricCard';
import {
  Cpu,
  Activity,
  Zap,
  CheckCircle,
  BarChart2,
  Sparkles,
  Layers,
  ShieldAlert,
  Sliders,
  TrendingUp,
  RefreshCw,
  Fingerprint,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Copy,
  ExternalLink,
  X,
  Lock,
  Globe,
  Radio
} from 'lucide-react';

export const AnalyticsIntelligenceView = () => {
  const [selectedAlertForShap, setSelectedAlertForShap] = useState('TRT-1048');
  const [threshold, setThreshold] = useState(0.75);

  // Clustering Canvas state
  const clusterCanvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedClusterDetail, setSelectedClusterDetail] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // SHAP alert profiles
  const shapProfiles = {
    'TRT-1048': {
      title: 'TRT-1048: Anomalous Data Exfiltration',
      threatClass: 'Exfiltration Over Web (T1048)',
      confidence: 94.2,
      features: [
        { name: 'Byte Volume Delta', impact: '+0.35', width: '35%', color: 'bg-error', desc: 'Outbound bytes exceed 30d workstation baseline by 840%' },
        { name: 'Destination Uniqueness', impact: '+0.27', width: '27%', color: 'bg-warning', desc: 'First observed communication with ASN AS49505' },
        { name: 'Off-Hours Timing', impact: '+0.18', width: '18%', color: 'bg-primary', desc: 'Session started outside standard 09:00-18:00 operational window' },
        { name: 'TLS Payload Entropy', impact: '+0.14', width: '14%', color: 'bg-primaryContainer', desc: 'High randomness (7.82 bits/B) indicative of compressed encrypted payload' }
      ]
    },
    'TRT-1071': {
      title: 'TRT-1071: DNS Tunneling Channel',
      threatClass: 'DNS Transport (T1071.004)',
      confidence: 88.7,
      features: [
        { name: 'Subdomain Entropy', impact: '+0.38', width: '38%', color: 'bg-error', desc: 'High entropy in Base64 encoded subdomains' },
        { name: 'Query Frequency', impact: '+0.26', width: '26%', color: 'bg-warning', desc: '28 queries/sec exceeding standard recursive resolver rates' },
        { name: 'TXT Record Ratio', impact: '+0.20', width: '20%', color: 'bg-primary', desc: 'Excessive TXT record lookup volume vs standard A/AAAA records' },
        { name: 'Null Query Responses', impact: '+0.16', width: '16%', color: 'bg-primaryContainer', desc: 'Repetitive server ACK packet lengths' }
      ]
    },
    'TRT-1072': {
      title: 'TRT-1072: Cobalt Strike C2 Beacon',
      threatClass: 'Web Protocols C2 (T1071.001)',
      confidence: 92.8,
      features: [
        { name: 'Beacon Periodicity (Jitter)', impact: '+0.41', width: '41%', color: 'bg-error', desc: 'Periodic 15.0s interval with 10% calculated jitter' },
        { name: 'JA3 Fingerprint Match', impact: '+0.31', width: '31%', color: 'bg-warning', desc: 'Exact hash match with known Cobalt Strike malleable C2 profile' },
        { name: 'Self-Signed Certificate', impact: '+0.16', width: '16%', color: 'bg-primary', desc: 'Untrusted internal CA issuer without CRL check' },
        { name: 'Direct IP Host Header', impact: '+0.12', width: '12%', color: 'bg-primaryContainer', desc: 'Host header uses direct raw IP instead of FQDN' }
      ]
    }
  };

  const activeShap = shapProfiles[selectedAlertForShap];

  // Definition of Realistic 2D UMAP Embedding Clusters & Points
  const clusterDefinitions = useMemo(() => [
    {
      id: 'CL-01',
      name: 'Standard Browser TLS (Chrome/Edge/Safari)',
      shortLabel: 'Browser TLS',
      category: 'BROWSER',
      count: 14200,
      percent: '62.3%',
      color: '#4ADE80',
      confidence: '99.8% Nominal',
      ja3: '771,4865-4866-4867-49195-49199,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0',
      ja4: 't13d1516h2_8daaf6152771_b186095e22b7',
      cipher: 'TLS_AES_128_GCM_SHA256 (0x1301)',
      sniExample: 'login.microsoftonline.com',
      hosts: 'Workstations, Laptops, Mobile Endpoints',
      cx: 170,
      cy: 140,
      pointsCount: 75,
      spreadX: 42,
      spreadY: 34
    },
    {
      id: 'CL-02',
      name: 'Cloud Infrastructure & API SDKs (AWS/GCP/Go)',
      shortLabel: 'Cloud API SDKs',
      category: 'CLOUD_API',
      count: 8410,
      percent: '36.9%',
      color: '#51F0E3',
      confidence: '99.4% Nominal',
      ja3: '771,49195-49199-49196-49200-52393,0-10-11-13-16,29-23-24,0',
      ja4: 't13i1900h2_49195_48650000',
      cipher: 'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (0xc02f)',
      sniExample: 's3.us-east-1.amazonaws.com',
      hosts: 'K8s Cluster, Backend Ingestion Nodes',
      cx: 370,
      cy: 220,
      pointsCount: 55,
      spreadX: 38,
      spreadY: 46
    },
    {
      id: 'CL-03',
      name: 'Tor Exit Nodes & External VPN Proxies',
      shortLabel: 'Tor & Proxies',
      category: 'PROXY',
      count: 142,
      percent: '0.62%',
      color: '#FFB963',
      confidence: '84.2% Suspicious',
      ja3: '771,49195-49199-52393-52392-49196,0-5-10-11-13-16-23-65281,29-23-24,0',
      ja4: 't13d3112h2_e3b0c44298fc_771',
      cipher: 'TLS_CHACHA20_POLY1305_SHA256 (0x1303)',
      sniExample: 'exit-relay-4.torproject.net',
      hosts: 'External DMZ Ingress',
      cx: 560,
      cy: 110,
      pointsCount: 28,
      spreadX: 28,
      spreadY: 26
    },
    {
      id: 'CL-04',
      name: 'Cobalt Strike Malleable C2 & Data Exfiltration',
      shortLabel: 'Cobalt Strike C2 (Flagged)',
      category: 'MALICIOUS',
      count: 18,
      percent: '0.08%',
      color: '#FF4450',
      confidence: '94.2% Malicious (#ALT-8432F7)',
      isMalicious: true,
      ja3: '771,4865-4866-4867-49195-49199,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0',
      ja4: 't13d1704h2_a982f812b102_c201',
      cipher: 'TLS_AES_256_GCM_SHA384 (0x1302)',
      sniExample: 's3-eu-west-drop.biz',
      hosts: 'WORKSTATION-SEC-04 (10.240.12.84)',
      cx: 730,
      cy: 180,
      pointsCount: 22,
      spreadX: 22,
      spreadY: 20
    }
  ], []);

  // Pre-generate Realistic Gaussian & Outlier Points
  const rawPoints = useMemo(() => {
    let pts = [];
    clusterDefinitions.forEach(c => {
      // Deterministic seed generation
      for (let i = 0; i < c.pointsCount; i++) {
        // Box-Muller normal distribution
        const u1 = ((i * 37 + 13) % 100) / 100 + 0.001;
        const u2 = ((i * 71 + 29) % 100) / 100 + 0.001;
        const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const randStdNormal2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        const x = c.cx + randStdNormal * (c.spreadX * 0.45);
        const y = c.cy + randStdNormal2 * (c.spreadY * 0.45);

        pts.push({
          id: `${c.id}-pt-${i}`,
          clusterId: c.id,
          clusterName: c.name,
          color: c.color,
          category: c.category,
          isMalicious: c.isMalicious,
          x,
          y,
          ja3: c.ja3,
          ja4: c.ja4,
          tlsVersion: 'TLS 1.3',
          cipher: c.cipher,
          confidence: c.confidence,
          sourceIp: c.isMalicious ? '10.240.12.84' : `10.240.${Math.floor(i % 16)}.${Math.floor(i * 3 % 250)}`,
          destIp: c.isMalicious ? '194.26.29.112' : `104.244.${Math.floor(i % 40)}.${Math.floor(i * 7 % 250)}`,
          firstSeen: '14:02:11 UTC',
          lastSeen: '14:23:44 UTC'
        });
      }
    });

    // Add 10 Realistic Outlier / Noise Points between clusters (HDBSCAN Noise)
    const outliers = [
      { x: 275, y: 180, name: 'Unclassified TLS (Custom Python Script)', ja4: 't12i0400h2_49195_0000' },
      { x: 470, y: 160, name: 'Legacy TLS 1.0 Embedded Device', ja4: 't10d0200h1_002f_0000' },
      { x: 645, y: 140, name: 'Encrypted DNS Over HTTPS Probe', ja4: 't13d1200h2_8daaf6_doh1' },
      { x: 505, y: 250, name: 'Anomalous SSH Over TLS Port 443', ja4: 't13d0900h2_ssh_tunnel' },
      { x: 290, y: 80, name: 'Custom gRPC Microservice Mesh', ja4: 't13i0800h2_grpc_mesh' }
    ];

    outliers.forEach((out, i) => {
      pts.push({
        id: `noise-pt-${i}`,
        clusterId: 'NOISE',
        clusterName: out.name,
        color: '#94A3B8',
        category: 'UNKNOWN',
        isNoise: true,
        x: out.x,
        y: out.y,
        ja3: '771,49195-49199-52393,0-10-11,29-23,0',
        ja4: out.ja4,
        tlsVersion: 'TLS 1.2 / 1.3',
        cipher: 'Custom TLS Cipher Suite',
        confidence: '62.4% Unclassified Outlier',
        sourceIp: `10.240.15.${i * 12 + 4}`,
        destIp: `185.199.${i * 8 + 108}.153`,
        firstSeen: '13:58:20 UTC',
        lastSeen: '14:20:10 UTC'
      });
    });

    return pts;
  }, [clusterDefinitions]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = clusterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Pan & Zoom Transform
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const now = Date.now();
      const w = canvas.width / zoom;
      const h = canvas.height / zoom;

      // 1. Draw Clean UMAP Coordinate Manifold Grid & Axes
      ctx.strokeStyle = 'rgba(28, 48, 60, 0.28)';
      ctx.lineWidth = 1;
      const gridSize = 40;

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

      // Manifold Coordinate Axis Lines (UMAP-1 & UMAP-2)
      ctx.strokeStyle = 'rgba(81, 240, 227, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Axis Ticks
      ctx.font = '500 8.5px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(81, 240, 227, 0.35)';
      ctx.fillText('-4.0', 10, h / 2 - 4);
      ctx.fillText('+4.0', w - 28, h / 2 - 4);
      ctx.fillText('+3.0', w / 2 + 4, 14);
      ctx.fillText('-3.0', w / 2 + 4, h - 6);
      ctx.fillText('UMAP-1 →', w - 50, h / 2 + 12);
      ctx.fillText('↑ UMAP-2', w / 2 + 4, 28);

      // 2. Draw Translucent Cluster Density Contours / Hulls
      clusterDefinitions.forEach(c => {
        const isClusterMatch =
          categoryFilter === 'ALL' ||
          categoryFilter === c.category ||
          (categoryFilter === 'MALICIOUS' && c.isMalicious);

        const isSelected = selectedClusterDetail?.id === c.id;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(c.cx, c.cy, c.spreadX * 1.35, c.spreadY * 1.35, 0, 0, Math.PI * 2);
        
        ctx.fillStyle = isClusterMatch ? c.color + '12' : 'rgba(10,18,24,0.1)';
        ctx.strokeStyle = isSelected
          ? c.color
          : isClusterMatch
          ? c.color + '45'
          : 'rgba(28,48,60,0.2)';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.setLineDash([4, 4]);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        // Subtle Malicious Radar Ring
        if (c.isMalicious && isClusterMatch) {
          const ring = (now / 22) % 32;
          ctx.beginPath();
          ctx.ellipse(c.cx, c.cy, c.spreadX * 1.35 + ring, c.spreadY * 1.35 + ring, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 68, 80, ${Math.max(0, 0.5 - ring / 32)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Crisp Cluster Tag Label (Positioned cleanly to avoid overlap)
        ctx.font = '600 9px JetBrains Mono, monospace';
        ctx.fillStyle = isClusterMatch ? c.color : 'rgba(255,255,255,0.2)';
        ctx.textAlign = 'center';
        
        const labelText = c.isMalicious
          ? `⚠ ${c.id}: ${c.shortLabel} (${c.count})`
          : `${c.id}: ${c.shortLabel} (${c.count})`;
        
        ctx.fillText(labelText, c.cx, c.cy + c.spreadY * 1.35 + 14);
        ctx.restore();
      });

      // 3. Draw Individual TLS Fingerprint Observation Points
      rawPoints.forEach(p => {
        const isHovered = hoveredPoint?.id === p.id;
        const isCategoryMatch =
          categoryFilter === 'ALL' ||
          categoryFilter === p.category ||
          (categoryFilter === 'MALICIOUS' && p.isMalicious);

        const isSearchMatch =
          !searchFilter ||
          p.clusterName.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.ja3.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.ja4.toLowerCase().includes(searchFilter.toLowerCase()) ||
          p.sourceIp.includes(searchFilter) ||
          p.destIp.includes(searchFilter);

        const isDimmed = !isCategoryMatch || !isSearchMatch;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHovered ? 5.5 : p.isMalicious ? 2.8 : 2.2, 0, Math.PI * 2);

        ctx.fillStyle = isDimmed
          ? 'rgba(60, 75, 85, 0.2)'
          : isHovered
          ? '#FFFFFF'
          : p.color;

        ctx.shadowColor = p.color;
        ctx.shadowBlur = isHovered ? 12 : p.isMalicious && !isDimmed ? 6 : 0;
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Axis Alignment Crosshair Lines
          ctx.strokeStyle = p.color + '66';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(p.x, 0);
          ctx.lineTo(p.x, h);
          ctx.moveTo(0, p.y);
          ctx.lineTo(w, p.y);
          ctx.stroke();
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [zoom, pan, hoveredPoint, selectedClusterDetail, categoryFilter, searchFilter, rawPoints, clusterDefinitions]);

  // Handle Mouse Hover on Point
  const handleMouseMove = (e) => {
    const canvas = clusterCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.clientX - rect.left - pan.x) / zoom;
    const clientY = (e.clientY - rect.top - pan.y) / zoom;

    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    // Detect nearest point within 8px
    const found = rawPoints.find(p => {
      const dx = p.x - clientX;
      const dy = p.y - clientY;
      return Math.sqrt(dx * dx + dy * dy) < 8;
    });

    setHoveredPoint(found || null);
  };

  // Handle Click on Cluster / Point
  const handleClick = (e) => {
    const canvas = clusterCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked near a cluster center
    const clickedCluster = clusterDefinitions.find(c => {
      const dx = c.cx - clickX;
      const dy = c.cy - clickY;
      return Math.sqrt(dx * dx + dy * dy) < c.spreadX * 1.4;
    });

    if (clickedCluster) {
      setSelectedClusterDetail(clickedCluster);
    } else if (hoveredPoint) {
      const parentCluster = clusterDefinitions.find(c => c.id === hoveredPoint.clusterId);
      setSelectedClusterDetail(parentCluster || null);
    }
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Analytics &amp; ML Intelligence
            </h1>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BEHAVIOUR AI v4.2.1 ACTIVE</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Predictive threat modeling, multi-class confusion matrix, SHAP explainability, and JA3/JA4 manifold clustering.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-gray-400">
          <span>Calibration Threshold: <strong className="text-primary font-bold">{threshold}</strong></span>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={e => setThreshold(parseFloat(e.target.value))}
            className="accent-primary w-24 cursor-pointer"
          />
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (4 Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="MODEL ACCURACY" value="98.92%" delta="+0.14%" subtitle="ROC-AUC 0.992" icon={CheckCircle} />
        <MetricCard title="FALSE POSITIVE" value="0.04%" delta="-0.01%" subtitle="18 / 42.8M flows" icon={Activity} />
        <MetricCard title="INFERENCES (24H)" value="42.8M" delta="+12.4%" subtitle="1,482 flows/sec" icon={Zap} />
        <MetricCard title="CONFIDENCE MEAN" value="94.2%" delta="+0.8%" subtitle="98.4% high confidence" icon={Cpu} />
      </div>

      {/* 3. ROW 1: MODEL PERFORMANCE DASHBOARD & CONFUSION MATRIX ⭐ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        
        {/* Model Performance Dashboard */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Model Performance Benchmarks
              </h2>
            </div>
            <span className="text-[10px] text-gray-400">Multi-Head Transformer</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-[10px] text-gray-400 uppercase block">Precision</span>
              <span className="text-2xl font-bold text-primary">98.4%</span>
            </div>
            <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-[10px] text-gray-400 uppercase block">Recall</span>
              <span className="text-2xl font-bold text-white">97.8%</span>
            </div>
            <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-[10px] text-gray-400 uppercase block">F1-Score</span>
              <span className="text-2xl font-bold text-primaryContainer">98.1%</span>
            </div>
          </div>

          {/* Threat Class F1-Score Comparison */}
          <div className="space-y-2 text-xs pt-1">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Detection by Threat Class</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">DDoS:</span> <span className="text-primary font-bold">99.4%</span>
              </div>
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">C2 Beacon:</span> <span className="text-primary font-bold">98.2%</span>
              </div>
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">DNS Tunnel:</span> <span className="text-primary font-bold">98.6%</span>
              </div>
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">Recon:</span> <span className="text-primary font-bold">99.1%</span>
              </div>
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">DGA:</span> <span className="text-primary font-bold">97.9%</span>
              </div>
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630] flex justify-between">
                <span className="text-gray-300">Exfiltration:</span> <span className="text-primary font-bold">97.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Matrix ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Confusion Matrix (24H Evaluation)
              </h2>
            </div>
            <span className="text-[10px] text-healthy font-bold">99.96% Accuracy</span>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-[#11171E] border border-primary/40 rounded-lg space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span className="font-bold text-primary">TRUE POSITIVE (TP)</span>
                <span className="text-primary">97.8%</span>
              </div>
              <div className="text-xl font-bold text-white">41,820</div>
              <div className="text-[10px] text-gray-400 font-sans">Correctly identified threat intrusions</div>
            </div>

            <div className="p-4 bg-[#11171E] border border-warning/40 rounded-lg space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span className="font-bold text-warning">FALSE POSITIVE (FP)</span>
                <span className="text-warning">0.04%</span>
              </div>
              <div className="text-xl font-bold text-warning">18</div>
              <div className="text-[10px] text-gray-400 font-sans">Benign traffic flagged as anomaly</div>
            </div>

            <div className="p-4 bg-[#11171E] border border-error/40 rounded-lg space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span className="font-bold text-error">FALSE NEGATIVE (FN)</span>
                <span className="text-error">0.22%</span>
              </div>
              <div className="text-xl font-bold text-error">94</div>
              <div className="text-[10px] text-gray-400 font-sans">Threats missed below threshold</div>
            </div>

            <div className="p-4 bg-[#11171E] border border-primary/40 rounded-lg space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span className="font-bold text-primary">TRUE NEGATIVE (TN)</span>
                <span className="text-primary">99.96%</span>
              </div>
              <div className="text-xl font-bold text-white">42.75M</div>
              <div className="text-[10px] text-gray-400 font-sans">Correctly allowed nominal traffic</div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 flex justify-between items-center pt-1 border-t border-[#1C2630]">
            <span>Receiver Operating Characteristic: <strong>ROC-AUC 0.992</strong></span>
            <span className="text-primary">Evaluated on 42,800,000 flows</span>
          </div>
        </div>

      </div>

      {/* 4. ROW 2: SHAP ALERT EXPLAINABILITY & MODEL DRIFT DETECTION ⭐ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono">
        
        {/* SHAP Alert Feature Explainability ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                SHAP Explanation for Selected Alert
              </h2>
            </div>
            
            <select
              value={selectedAlertForShap}
              onChange={e => setSelectedAlertForShap(e.target.value)}
              className="bg-[#11171E] h-7 px-2 rounded border border-[#1C2630] text-primary text-[11px] font-bold focus:outline-none cursor-pointer"
            >
              <option value="TRT-1048">TRT-1048 (Data Exfil)</option>
              <option value="TRT-1071">TRT-1071 (DNS Tunnel)</option>
              <option value="TRT-1072">TRT-1072 (Cobalt Strike)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-white font-sans">{activeShap.title}</div>
            <div className="text-[10px] text-primary font-mono">Classified as: {activeShap.threatClass} (Confidence: {activeShap.confidence}%)</div>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            {activeShap.features.map((f, i) => (
              <div key={i} className="space-y-1 p-2 bg-[#11171E] rounded-lg border border-[#1C2630]">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-200 font-semibold">{f.name}</span>
                  <span className="text-primary font-bold">{f.impact} contribution</span>
                </div>
                <div className="w-full bg-[#1C2630] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${f.color}`} style={{ width: f.width }} />
                </div>
                <p className="text-[10px] text-gray-400 font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Drift & Unknown Pattern Detection ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Model Drift &amp; Feature Stability
              </h2>
            </div>
            <span className="text-[10px] text-healthy font-bold">PSI: 0.024 (Nominal)</span>
          </div>

          <div className="p-3.5 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-300">Feature Drift Rate:</span>
              <span className="text-healthy font-bold">2.4% (Below 5% Retrain Threshold)</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Training Baseline vs. Live Traffic:</span>
              <span className="text-white">97.6% Conformance</span>
            </div>
            <div className="w-full bg-[#1C2630] h-2 rounded-full overflow-hidden">
              <div className="bg-healthy h-full rounded-full w-[97.6%]" />
            </div>
          </div>

          <div className="p-3.5 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase text-[11px]">Unknown / Unseen Traffic Patterns</span>
              <span className="text-[10px] text-warning font-semibold">Zero-Day Shield</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 bg-[#0D1318] rounded border border-[#1C2630]">
                <span className="text-[10px] text-gray-400 block">Known Signatures</span>
                <span className="text-lg font-bold text-primary">96.4%</span>
              </div>
              <div className="p-2 bg-[#0D1318] rounded border border-warning/40">
                <span className="text-[10px] text-warning block">Unknown Anomaly</span>
                <span className="text-lg font-bold text-warning">3.6%</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 font-sans">
              3.6% of flows diverge from known benign/attack clusters and are routed to unsupervised isolation analysis.
            </p>
          </div>
        </div>

      </div>

      {/* 5. ⭐ PRODUCTION-GRADE JA3 / JA4 ENCRYPTED FINGERPRINT CLUSTERING VISUALIZATION ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4 font-mono">
        
        {/* Header & Live Manifold Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C2630] pb-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Fingerprint className="w-4 h-4 text-primary" />
            <div>
              <h2 className="font-bold uppercase tracking-wider text-white">
                JA3 / JA4 Encrypted Behavioral Fingerprint Clustering
              </h2>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                2D UMAP Embedding Manifold • Unsupervised HDBSCAN Density Clustering • Zero Payload Decryption
              </p>
            </div>
          </div>

          {/* Live Telemetry Counters */}
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            <div className="px-2.5 py-1 rounded bg-[#11171E] border border-[#1C2630] text-gray-300">
              Handshakes: <strong className="text-white">22,770</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#11171E] border border-[#1C2630] text-gray-300">
              Unique JA3: <strong className="text-primary">482</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#11171E] border border-[#1C2630] text-gray-300">
              Clusters: <strong className="text-white">4 Active</strong>
            </div>
            <div className="px-2.5 py-1 rounded bg-error/15 border border-error/30 text-error font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              <span>1 Flagged Anomaly</span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar: Search, Filter, Zoom */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          
          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex items-center">
              <Search className="w-3 h-3 absolute left-2.5 text-gray-500 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filter by JA3, JA4, IP, or Host..."
                className="bg-[#11171E] h-7 pl-7 pr-2.5 rounded border border-[#1C2630] text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-primary w-52 sm:w-64"
              />
              {searchFilter && (
                <button onClick={() => setSearchFilter('')} className="absolute right-2 text-gray-400 hover:text-white text-xs">✕</button>
              )}
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#11171E] h-7 px-2 rounded border border-[#1C2630] text-gray-300 text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Cluster Categories</option>
              <option value="BROWSER">Browser TLS (Chrome/Edge)</option>
              <option value="CLOUD_API">Cloud API &amp; SDKs</option>
              <option value="PROXY">Tor &amp; Proxy Nodes</option>
              <option value="MALICIOUS">Malicious C2 &amp; Exfil Only</option>
            </select>
          </div>

          {/* Zoom & Viewport Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.min(1.6, prev + 0.15))}
              title="Zoom In"
              className="p-1 rounded bg-[#11171E] hover:bg-[#151E28] border border-[#1C2630] text-gray-300 hover:text-white"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
              title="Zoom Out"
              className="p-1 rounded bg-[#11171E] hover:bg-[#151E28] border border-[#1C2630] text-gray-300 hover:text-white"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              title="Reset Viewport"
              className="p-1 rounded bg-[#11171E] hover:bg-[#151E28] border border-[#1C2630] text-gray-300 hover:text-white"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* 2D Cluster Manifold Canvas Viewport */}
        <div className="relative w-full h-[320px] bg-[#070D12] border border-[#1C2630] rounded-xl overflow-hidden cursor-crosshair">
          <canvas
            ref={clusterCanvasRef}
            width={960}
            height={320}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={handleClick}
            className="w-full h-full block"
          />

          {/* Hover HUD Tooltip */}
          {hoveredPoint && (
            <div
              className="pointer-events-none absolute z-30 p-3 rounded-xl bg-[#091319]/95 border border-primary/40 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1 transform -translate-x-1/2 -translate-y-full -mt-3 max-w-xs"
              style={{ left: mousePos.x, top: mousePos.y }}
            >
              <div className="flex items-center justify-between gap-2 border-b border-primary/20 pb-1">
                <span className="font-bold text-white truncate">{hoveredPoint.clusterName}</span>
                <span className={`text-[9px] font-bold ${hoveredPoint.isMalicious ? 'text-error' : 'text-primary'}`}>
                  {hoveredPoint.isMalicious ? 'MALICIOUS' : 'NOMINAL'}
                </span>
              </div>
              <div className="text-[10px] text-gray-300 space-y-0.5">
                <div><span className="text-gray-400">JA4: </span><span className="text-primary font-bold">{hoveredPoint.ja4}</span></div>
                <div><span className="text-gray-400">Cipher: </span><span className="text-white">{hoveredPoint.cipher.split(' (')[0]}</span></div>
                <div><span className="text-gray-400">Flow: </span><span className="text-primary">{hoveredPoint.sourceIp}</span> → <span className="text-gray-300">{hoveredPoint.destIp}</span></div>
                <div><span className="text-gray-400">Confidence: </span><span className="text-primaryContainer font-semibold">{hoveredPoint.confidence}</span></div>
              </div>
            </div>
          )}

          {/* Compact Legend Overlay */}
          <div className="absolute bottom-2.5 left-2.5 bg-[#081016]/90 border border-[#1C2630] rounded-lg px-3 py-1.5 flex flex-wrap items-center gap-3 text-[10px] shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
              <span className="text-gray-300">Browser TLS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#51F0E3]" />
              <span className="text-gray-300">Cloud API SDKs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFB963]" />
              <span className="text-gray-300">Tor &amp; Proxies</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4450] animate-ping" />
              <span className="text-error font-bold">C2 Exfil Cluster (Flagged)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
              <span className="text-gray-400">Outliers</span>
            </div>
          </div>

          {/* Click-Selected Cluster Forensic Detail Drawer */}
          {selectedClusterDetail && (
            <div className="absolute top-2.5 right-2.5 bg-[#081016]/95 backdrop-blur-md border border-primary/40 rounded-xl p-4 w-80 shadow-2xl text-xs space-y-2.5 z-20 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <div className="flex items-center gap-2">
                  <Fingerprint className={`w-4 h-4 ${selectedClusterDetail.isMalicious ? 'text-error' : 'text-primary'}`} />
                  <span className="font-bold text-white font-sans truncate">{selectedClusterDetail.name}</span>
                </div>
                <button
                  onClick={() => setSelectedClusterDetail(null)}
                  className="w-5 h-5 rounded hover:bg-surfaceHighest text-gray-400 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-gray-400">
                  <span>Cluster ID:</span> <span className="text-primary font-bold">{selectedClusterDetail.id}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Sample Volume:</span> <span className="text-white">{selectedClusterDetail.count.toLocaleString()} sessions ({selectedClusterDetail.percent})</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Classification:</span> <span className={selectedClusterDetail.isMalicious ? 'text-error font-bold' : 'text-healthy'}>{selectedClusterDetail.confidence}</span>
                </div>
                <div className="pt-1">
                  <span className="text-gray-400 text-[10px] block">REPRESENTATIVE JA4 HASH:</span>
                  <code className="text-primary text-[10px] block bg-[#11171E] p-1.5 rounded border border-[#1C2630] truncate mt-0.5">
                    {selectedClusterDetail.ja4}
                  </code>
                </div>
                <div className="pt-1">
                  <span className="text-gray-400 text-[10px] block">ASSOCIATED ENDPOINTS:</span>
                  <div className="text-white text-[10px] truncate">{selectedClusterDetail.sniExample}</div>
                  <div className="text-gray-400 text-[10px] truncate">{selectedClusterDetail.hosts}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedClusterDetail(null)}
                className="w-full py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-bold text-[10px] transition"
              >
                Close Cluster Inspection
              </button>
            </div>
          )}
        </div>

        {/* Footer Technical Note */}
        <div className="text-[11px] text-gray-400 flex flex-wrap justify-between items-center pt-1 border-t border-[#1C2630]">
          <span>Manifold Dimensionality Reduction: <strong>UMAP (n_neighbors=15, min_dist=0.1)</strong></span>
          <span className="text-primary">1 flagged malicious cluster isolated (#ALT-8432F7)</span>
        </div>

      </div>

    </div>
  );
};
