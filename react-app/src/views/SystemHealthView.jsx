import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Globe,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
  Radio,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Shield,
  Filter,
  BarChart2,
  Terminal
} from 'lucide-react';

export const SystemHealthView = () => {
  const { systemNodes } = useTelemetry();
  const [timeRange, setTimeRange] = useState('30m');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live Activity Log state
  const [logs, setLogs] = useState([
    { time: '16:16:40.102', system: 'ML ENGINE', msg: 'Deep Flow Neural inference batch #94821 completed — 1,482 flows/s', status: 'OK' },
    { time: '16:16:39.840', system: 'FEATURE EXTRACT', msg: 'Calculated byte entropy (7.82) for flow 10.240.12.84:443', status: 'OK' },
    { time: '16:16:39.210', system: 'STORAGE', msg: 'Telemetry DB committed 8,420 rows to columnar partition', status: 'OK' },
    { time: '16:16:38.990', system: 'SENSOR TAP', msg: 'SPAN Mirror interface eth0:tap — zero packet drops verified', status: 'OK' },
    { time: '16:16:38.420', system: 'ALERT ENGINE', msg: 'Correlation rule match #ALT-8432F7 for APT-29 signature', status: 'WARN' }
  ]);

  // Live log generator
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      const sampleLogs = [
        { system: 'ML ENGINE', msg: `Inference batch #94${Math.floor(Math.random()*800+100)} evaluated — latency 1.2ms`, status: 'OK' },
        { system: 'SENSOR TAP', msg: 'Kernel eBPF ring buffer synchronized — 0 drops', status: 'OK' },
        { system: 'INGESTION', msg: `Received ${Math.floor(Math.random()*200+1400)} flows/s across 4 SPAN probes`, status: 'OK' },
        { system: 'STORAGE', msg: 'Time-series partition write completed — query latency 4.2ms', status: 'OK' }
      ];
      const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
      setLogs(prev => [{ time: timeStr, ...randomLog }, ...prev.slice(0, 7)]);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Top Header & System Score */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              System Health &amp; Telemetry
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-healthy/15 border border-healthy/40 text-healthy font-mono text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>97/100 HEALTHY</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#11171E] border border-[#1C2630] text-gray-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>PASSIVE TAP: ZERO-DROP GUARANTEE</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Real-time pipeline diagnostics, telemetry ingestion rates, latency breakdowns, and node hardware allocation.
          </p>
        </div>

        {/* Action Controls & Time Filter */}
        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#0D1318] p-1 rounded-lg border border-[#1C2630] text-xs font-mono">
            {['5m', '30m', '1h', '24h'].map(t => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  timeRange === t ? 'bg-primary text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] hover:border-primary/40 text-xs font-mono text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking...' : 'Check Health'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Ingestion, Drop Rate, Latency, Queue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Telemetry Ingestion Rate ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
            <span className="uppercase">Ingestion Rate</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">1,482</span>
            <span className="text-xs font-mono text-primary font-semibold">flows/sec</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1C2630]">
            <div>Packets: <span className="text-gray-200">86.4k/s</span></div>
            <div>Bandwidth: <span className="text-gray-200">1.84 Gbps</span></div>
          </div>
        </div>

        {/* KPI 2: Packet Drop Rate (Zero Drops) ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
            <span className="uppercase">Packet Drop Rate</span>
            <CheckCircle2 className="w-4 h-4 text-healthy" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-healthy">0.00%</span>
            <span className="text-xs font-mono text-gray-400">drops</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1C2630]">
            <div>Received: <span className="text-gray-200">14.2M pkts</span></div>
            <div>Processed: <span className="text-healthy font-semibold">100.0%</span></div>
          </div>
        </div>

        {/* KPI 3: End-to-End Pipeline Latency ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
            <span className="uppercase">E2E Pipeline Latency</span>
            <Clock className="w-4 h-4 text-secondary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">93.4</span>
            <span className="text-xs font-mono text-secondary font-semibold">ms</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1C2630]">
            <div>ML Inference: <span className="text-primary">1.2ms</span></div>
            <div>DB Commit: <span className="text-gray-200">4.2ms</span></div>
          </div>
        </div>

        {/* KPI 4: Event Processing Queue Depth ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
            <span className="uppercase">Event Queue Depth</span>
            <Layers className="w-4 h-4 text-primaryContainer" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">1,678</span>
            <span className="text-xs font-mono text-gray-400">in flight</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1C2630]">
            <div>Buffer Depth: <span className="text-healthy">0.12%</span></div>
            <div>Completed: <span className="text-gray-200">2.48M</span></div>
          </div>
        </div>

      </div>

      {/* 3. ① PIPELINE HEALTH / DATA FLOW ARCHITECTURE ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Live Pipeline Data Flow Architecture
            </h2>
          </div>
          <span className="text-[11px] font-mono text-healthy font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-healthy" />
            <span>ALL STAGES HEALTHY (6/6)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2.5 font-mono text-xs">
          
          {/* Stage 1: Network Sensor TAP */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>01. SENSOR TAP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            </div>
            <div className="font-bold text-white text-xs">Optical SPAN Mirror</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Rate: <span className="text-primary">86.4k pkts/s</span></div>
              <div>Latency: <span className="text-gray-300">12ms</span></div>
            </div>
          </div>

          {/* Stage 2: Ingestion Buffer */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>02. INGESTION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            </div>
            <div className="font-bold text-white text-xs">eBPF Ring Buffer</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Rate: <span className="text-primary">1,482 flows/s</span></div>
              <div>Latency: <span className="text-gray-300">18ms</span></div>
            </div>
          </div>

          {/* Stage 3: Feature Extraction */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>03. EXTRACTION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            </div>
            <div className="font-bold text-white text-xs">Entropy &amp; 5-Tuple</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Vectors: <span className="text-primary">32 features</span></div>
              <div>Latency: <span className="text-gray-300">24ms</span></div>
            </div>
          </div>

          {/* Stage 4: ML Neural Classifier */}
          <div className="p-3 bg-[#11171E] border border-primary/40 rounded-lg space-y-2 relative bg-primary/5">
            <div className="flex items-center justify-between text-[10px] text-primary font-bold">
              <span>04. ML INFERENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="font-bold text-white text-xs">Deep Flow v4</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Inference: <span className="text-primary font-bold">1,482/s</span></div>
              <div>Latency: <span className="text-primary">1.2ms</span></div>
            </div>
          </div>

          {/* Stage 5: Alert Engine */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>05. CORRELATION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            </div>
            <div className="font-bold text-white text-xs">MITRE ATT&amp;CK Rules</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Rules: <span className="text-primary">140 rules</span></div>
              <div>Latency: <span className="text-gray-300">8ms</span></div>
            </div>
          </div>

          {/* Stage 6: Database Persistence */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2 relative">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>06. STORAGE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            </div>
            <div className="font-bold text-white text-xs">Columnar Timescale</div>
            <div className="text-[10px] text-gray-400 space-y-0.5">
              <div>Write: <span className="text-primary">18.2 MB/s</span></div>
              <div>Commit: <span className="text-gray-300">4.2ms</span></div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. ② PROCESSING LATENCY BREAKDOWN ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" />
            <h3 className="font-bold uppercase tracking-wider text-white">
              End-to-End Processing Latency Breakdown (93.4 ms Total)
            </h3>
          </div>
          <span className="text-gray-400 text-[11px]">Target SLA: &lt; 250ms</span>
        </div>

        {/* Horizontal Stacked Latency Meter */}
        <div className="w-full bg-[#11171E] h-4 rounded-lg overflow-hidden flex border border-[#1C2630]">
          <div style={{ width: '13%' }} title="Packet Capture: 12ms" className="bg-[#51F0E3] h-full" />
          <div style={{ width: '19%' }} title="Header Parsing: 18ms" className="bg-[#22D3C7] h-full" />
          <div style={{ width: '26%' }} title="Feature Extraction: 24ms" className="bg-[#38BDF8] h-full" />
          <div style={{ width: '33%' }} title="ML Inference: 31ms" className="bg-[#818CF8] h-full" />
          <div style={{ width: '9%' }} title="Alert Engine: 8ms" className="bg-[#A78BFA] h-full" />
        </div>

        {/* Legend Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] text-gray-300 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#51F0E3]" />
            <span>Capture (12ms / 13%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#22D3C7]" />
            <span>Parsing (18ms / 19%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#38BDF8]" />
            <span>Extraction (24ms / 26%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#818CF8]" />
            <span>ML Model (31ms / 33%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#A78BFA]" />
            <span>Alert Engine (8ms / 9%)</span>
          </div>
        </div>
      </div>

      {/* 5. 2-Column Diagnostics Grid: ML Model Health & Telemetry Freshness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        
        {/* ⑤ ML Model Health Diagnostics ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-bold uppercase tracking-wider text-white">ML Model Health &amp; Accuracy</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold">
              ACTIVE INFERENCE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-400 text-[10px] uppercase block">Model Architecture</span>
              <span className="font-bold text-white">Deep Flow Neural Classifier v4</span>
            </div>
            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-400 text-[10px] uppercase block">Avg Inference Time</span>
              <span className="font-bold text-primary">1.2ms / flow</span>
            </div>
            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-400 text-[10px] uppercase block">Mean Confidence</span>
              <span className="font-bold text-white">94.2% (98.4% high-conf)</span>
            </div>
            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-400 text-[10px] uppercase block">Classification Error</span>
              <span className="font-bold text-healthy">0.001% (0 drops)</span>
            </div>
          </div>
        </div>

        {/* Telemetry Freshness & Sensor Status */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary" />
              <h3 className="font-bold uppercase tracking-wider text-white">Telemetry Source Freshness</h3>
            </div>
            <span className="text-[10px] text-gray-400">4 Active TAPs</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex items-center justify-between p-2 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-200">Sensor-01 (Perimeter NGFW TAP)</span>
              <span className="text-healthy font-semibold">0.4s ago (Healthy)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-200">Sensor-02 (Core Spine Switch SPAN)</span>
              <span className="text-healthy font-semibold">0.8s ago (Healthy)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-200">Sensor-03 (DMZ Reverse Proxy)</span>
              <span className="text-healthy font-semibold">1.2s ago (Healthy)</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-[#11171E] rounded-lg border border-[#1C2630]">
              <span className="text-gray-200">Sensor-04 (Cloud Ingress Gateway)</span>
              <span className="text-healthy font-semibold">2.1s ago (Healthy)</span>
            </div>
          </div>
        </div>

      </div>

      {/* 6. Node Cluster Resource Allocation Table */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
            Node Cluster Resource Allocation
          </h2>
          <span className="text-xs font-mono text-gray-400">5 Cluster Nodes Online</span>
        </div>
        
        <div className="space-y-2.5">
          {systemNodes.map(node => (
            <div key={node.name} className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] grid grid-cols-1 md:grid-cols-5 items-center gap-4 text-xs font-mono">
              <div className="font-bold text-white font-sans">{node.name}</div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-10 text-[10px]">CPU:</span>
                <div className="flex-1 bg-[#1C2630] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${node.cpu}%` }} />
                </div>
                <span className="text-primary w-8 text-right font-bold">{node.cpu}%</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-10 text-[10px]">MEM:</span>
                <div className="flex-1 bg-[#1C2630] rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primaryContainer h-full rounded-full" style={{ width: `${node.mem}%` }} />
                </div>
                <span className="text-primaryContainer w-8 text-right font-bold">{node.mem}%</span>
              </div>

              <div className="text-gray-400 text-center">
                <span>Latency: </span><span className="text-white">{node.latency}</span>
                <span className="text-gray-500 ml-2">({node.uptime})</span>
              </div>

              <div className="text-right">
                <StatusBadge severity={node.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Real-Time System Activity Log (Live Stream) */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="font-bold uppercase tracking-wider text-white">Real-Time System Operations Stream</h3>
          </div>
          <span className="text-[10px] text-gray-400">Live Microsecond Audit Feed</span>
        </div>

        <div className="space-y-1.5 overflow-x-auto text-[11px]">
          {logs.map((log, index) => (
            <div key={index} className="p-2 rounded bg-[#11171E] border border-[#1C2630] flex items-center justify-between font-mono">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-[10px]">{log.time}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#18222C] text-primary text-[9px] font-bold">{log.system}</span>
                <span className="text-gray-200">{log.msg}</span>
              </div>
              <span className={`text-[10px] font-bold ${log.status === 'WARN' ? 'text-warning' : 'text-healthy'}`}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
