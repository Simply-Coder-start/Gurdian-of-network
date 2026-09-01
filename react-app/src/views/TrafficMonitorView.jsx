import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Search,
  Pause,
  Play,
  Download,
  Clock,
  Layers,
  Globe,
  Radio,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Target,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Server,
  Network
} from 'lucide-react';

// Sample Initial Network Flow Data matching the user's reference
const INITIAL_FLOWS = [
  {
    id: 'fl-1',
    time: '14:23:41.123',
    timestamp: Date.now() - 10000,
    sourceIp: '10.0.1.24',
    sourcePort: 52341,
    destIp: '10.0.2.15',
    destPort: 443,
    protocol: 'TCP',
    packets: 12,
    bytes: 7372,
    bytesFormatted: '7.2 KB',
    duration: '00:00:01',
    threatScore: 12,
    status: 'Normal',
    isNew: false,
    sni: 'internal-api.cluster.local',
    ja3: '771,4865-4866-4867,0-23-65281-10-11,29-23,0',
    entropy: 4.12,
    flags: 'SYN, ACK, PSH, FIN',
    details: 'Standard internal microservice RPC communication over TLS.'
  },
  {
    id: 'fl-2',
    time: '14:23:41.456',
    timestamp: Date.now() - 9500,
    sourceIp: '10.0.1.56',
    sourcePort: 49822,
    destIp: '185.22.33.16',
    destPort: 443,
    protocol: 'TLS',
    packets: 18,
    bytes: 9318,
    bytesFormatted: '9.1 KB',
    duration: '00:00:02',
    threatScore: 78,
    status: 'Suspicious',
    isNew: false,
    sni: 'update-check.external-cdn.biz',
    ja3: '771,49195-49199-52393,0-10-11-35-16,29-23,0',
    entropy: 7.42,
    flags: 'ACK, PSH',
    details: 'Unregistered external domain contacted by finance department host.'
  },
  {
    id: 'fl-3',
    time: '14:23:41.789',
    timestamp: Date.now() - 9000,
    sourceIp: '10.0.1.87',
    sourcePort: 55321,
    destIp: '8.8.8.8',
    destPort: 53,
    protocol: 'UDP',
    packets: 5,
    bytes: 1126,
    bytesFormatted: '1.1 KB',
    duration: '00:00:00',
    threatScore: 65,
    status: 'DNS Anomaly',
    isNew: false,
    dnsQuery: 'vx892-payload-staging.cdn.co',
    entropy: 6.88,
    flags: 'UDP-DATAGRAM',
    details: 'High-entropy TXT record query with potential data staging encoded in subdomain.'
  },
  {
    id: 'fl-4',
    time: '14:23:42.011',
    timestamp: Date.now() - 8500,
    sourceIp: '10.0.1.44',
    sourcePort: 34123,
    destIp: '10.0.4.10',
    destPort: 22,
    protocol: 'TCP',
    packets: 45,
    bytes: 3891,
    bytesFormatted: '3.8 KB',
    duration: '00:00:03',
    threatScore: 94,
    status: 'Port Scan',
    isNew: false,
    flags: 'SYN, RST',
    entropy: 3.10,
    details: 'Rapid sequential SYN packet burst across internal subnet 10.0.4.0/24.'
  },
  {
    id: 'fl-5',
    time: '14:23:42.245',
    timestamp: Date.now() - 8000,
    sourceIp: '10.0.1.31',
    sourcePort: 62011,
    destIp: '192.168.1.5',
    destPort: 443,
    protocol: 'QUIC',
    packets: 23,
    bytes: 12902,
    bytesFormatted: '12.6 KB',
    duration: '00:00:04',
    threatScore: 18,
    status: 'Normal',
    isNew: false,
    sni: 'gateway.storage.internal',
    entropy: 5.24,
    flags: 'QUIC-HANDSHAKE',
    details: 'Encrypted UDP datagram stream conforming to HTTP/3 QUIC specifications.'
  },
  {
    id: 'fl-6',
    time: '14:23:42.512',
    timestamp: Date.now() - 7500,
    sourceIp: '10.0.1.56',
    sourcePort: 49822,
    destIp: '185.22.33.16',
    destPort: 443,
    protocol: 'TLS',
    packets: 20,
    bytes: 10444,
    bytesFormatted: '10.2 KB',
    duration: '00:00:03',
    threatScore: 81,
    status: 'C2 Beaconing',
    isNew: false,
    sni: 'c2-listener.darkcorp-threat.org',
    ja3: '771,4865-4866-4867-49195,0-23-65281-10-11-35-16,29-23,0',
    entropy: 7.82,
    flags: 'ACK, PSH',
    details: 'Regular 15-second heartbeat intervals matching Cobalt Strike beacon profile.'
  },
  {
    id: 'fl-7',
    time: '14:23:42.789',
    timestamp: Date.now() - 7000,
    sourceIp: '10.0.1.99',
    sourcePort: 49211,
    destIp: 'random-domain.xyz',
    destPort: 53,
    protocol: 'UDP',
    packets: 6,
    bytes: 1331,
    bytesFormatted: '1.3 KB',
    duration: '00:00:00',
    threatScore: 88,
    status: 'DGA Detected',
    isNew: false,
    dnsQuery: 'qwxplzkj88912aa.xyz',
    entropy: 8.14,
    flags: 'UDP-DATAGRAM',
    details: 'Domain Generation Algorithm pattern identified with zero historical reputation.'
  },
  {
    id: 'fl-8',
    time: '14:23:43.012',
    timestamp: Date.now() - 6500,
    sourceIp: '10.0.1.24',
    sourcePort: 52342,
    destIp: '172.217.160.1',
    destPort: 443,
    protocol: 'TCP',
    packets: 15,
    bytes: 6656,
    bytesFormatted: '6.5 KB',
    duration: '00:00:02',
    threatScore: 15,
    status: 'Normal',
    isNew: false,
    sni: 'google-public-dns.google.com',
    entropy: 4.88,
    flags: 'SYN, ACK, PSH',
    details: 'Legitimate public service HTTPS connection.'
  },
  {
    id: 'fl-9',
    time: '14:23:43.245',
    timestamp: Date.now() - 6000,
    sourceIp: '10.0.1.77',
    sourcePort: 51321,
    destIp: '203.0.113.45',
    destPort: 8080,
    protocol: 'TCP',
    packets: 32,
    bytes: 23654,
    bytesFormatted: '23.1 KB',
    duration: '00:00:05',
    threatScore: 72,
    status: 'Suspicious',
    isNew: false,
    flags: 'ACK, PSH',
    entropy: 6.95,
    details: 'Unencrypted proxy payload transferred over non-standard port 8080.'
  },
  {
    id: 'fl-10',
    time: '14:23:43.678',
    timestamp: Date.now() - 5500,
    sourceIp: '10.0.1.66',
    sourcePort: 45621,
    destIp: '10.0.3.8',
    destPort: 445,
    protocol: 'TCP',
    packets: 11,
    bytes: 5324,
    bytesFormatted: '5.2 KB',
    duration: '00:00:01',
    threatScore: 11,
    status: 'Normal',
    isNew: false,
    flags: 'SYN, ACK',
    entropy: 3.44,
    details: 'Legitimate enterprise file server SMB session.'
  },
  {
    id: 'fl-11',
    time: '14:23:43.912',
    timestamp: Date.now() - 5000,
    sourceIp: '10.0.1.44',
    sourcePort: 34124,
    destIp: '10.0.4.11',
    destPort: 80,
    protocol: 'TCP',
    packets: 27,
    bytes: 8908,
    bytesFormatted: '8.7 KB',
    duration: '00:00:03',
    threatScore: 67,
    status: 'Web Scan',
    isNew: false,
    flags: 'ACK, PSH',
    entropy: 5.60,
    details: 'Automated HTTP HEAD / Nikto scan headers probing internal admin interface.'
  },
  {
    id: 'fl-12',
    time: '14:23:44.123',
    timestamp: Date.now() - 4500,
    sourceIp: '10.0.1.56',
    sourcePort: 49823,
    destIp: '185.22.33.16',
    destPort: 443,
    protocol: 'TLS',
    packets: 21,
    bytes: 11571,
    bytesFormatted: '11.3 KB',
    duration: '00:00:04',
    threatScore: 85,
    status: 'C2 Beaconing',
    isNew: false,
    sni: 'c2-listener.darkcorp-threat.org',
    ja3: '771,4865-4866-4867-49195,0-23-65281-10-11-35-16,29-23,0',
    entropy: 7.89,
    flags: 'ACK, PSH',
    details: 'Second staged payload chunk transmitted to remote C2 listener.'
  }
];

const formatTimeWithMs = (date = new Date()) => {
  const pad = (n, z = 2) => ('00' + n).slice(-z);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
};

export const TrafficMonitorView = () => {
  const [flows, setFlows] = useState(INITIAL_FLOWS);
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('All');
  const [selectedThreat, setSelectedThreat] = useState('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 5 min');
  const [selectedFlow, setSelectedFlow] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Top KPI stats
  const [flowsPerSec, setFlowsPerSec] = useState(1482);
  const [pktsPerSec, setPktsPerSec] = useState(86420);
  const [activeConnections, setActiveConnections] = useState(14295);
  const [trafficAlerts, setTrafficAlerts] = useState(24);

  // Candidate data for live injection
  const candidateIPs = ['10.0.1.24', '10.0.1.56', '10.0.1.87', '10.0.1.44', '10.0.1.31', '10.0.1.99', '10.0.1.77', '10.0.1.66'];
  const candidateDestIPs = ['10.0.2.15', '185.22.33.16', '8.8.8.8', '10.0.4.10', '192.168.1.5', 'random-domain.xyz', '172.217.160.1', '203.0.113.45', '10.0.3.8'];
  const candidateProtocols = ['TCP', 'TLS', 'UDP', 'QUIC'];
  const statuses = [
    { name: 'Normal', score: () => Math.floor(Math.random() * 25 + 5), weight: 0.55 },
    { name: 'Suspicious', score: () => Math.floor(Math.random() * 20 + 65), weight: 0.15 },
    { name: 'C2 Beaconing', score: () => Math.floor(Math.random() * 15 + 80), weight: 0.10 },
    { name: 'DNS Anomaly', score: () => Math.floor(Math.random() * 25 + 60), weight: 0.08 },
    { name: 'Port Scan', score: () => Math.floor(Math.random() * 10 + 90), weight: 0.06 },
    { name: 'DGA Detected', score: () => Math.floor(Math.random() * 15 + 85), weight: 0.06 }
  ];

  // Simulation interval for real-time passive packet tap
  useEffect(() => {
    if (!isLive) return;

    const timer = setInterval(() => {
      const rand = Math.random();
      let chosen = statuses[0];
      let acc = 0;
      for (const s of statuses) {
        acc += s.weight;
        if (rand <= acc) {
          chosen = s;
          break;
        }
      }

      const srcIp = candidateIPs[Math.floor(Math.random() * candidateIPs.length)];
      const dstIp = candidateDestIPs[Math.floor(Math.random() * candidateDestIPs.length)];
      const proto = candidateProtocols[Math.floor(Math.random() * candidateProtocols.length)];
      const port = proto === 'UDP' && Math.random() > 0.5 ? 53 : proto === 'QUIC' ? 443 : [443, 80, 8080, 22, 445][Math.floor(Math.random() * 5)];
      const pkts = Math.floor(Math.random() * 40 + 4);
      const rawBytes = Math.floor(pkts * (Math.random() * 600 + 200));
      const bytesFmt = rawBytes > 1024 * 1024 ? `${(rawBytes / (1024 * 1024)).toFixed(1)} MB` : `${(rawBytes / 1024).toFixed(1)} KB`;
      const durSec = Math.floor(Math.random() * 6);
      const durationFmt = `00:00:0${durSec}`;
      const score = chosen.score();

      const newFlow = {
        id: 'fl-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        time: formatTimeWithMs(),
        timestamp: Date.now(),
        sourceIp: srcIp,
        sourcePort: Math.floor(Math.random() * 30000 + 32000),
        destIp: dstIp,
        destPort: port,
        protocol: proto,
        packets: pkts,
        bytes: rawBytes,
        bytesFormatted: bytesFmt,
        duration: durationFmt,
        threatScore: score,
        status: chosen.name,
        isNew: true,
        sni: dstIp.includes('.') && !dstIp.startsWith('10.') ? `endpoint-${dstIp.replace(/\./g, '-')}.net` : 'internal-service.local',
        entropy: (Math.random() * 4 + 4).toFixed(2),
        flags: proto === 'UDP' ? 'UDP-DATAGRAM' : proto === 'QUIC' ? 'QUIC-HANDSHAKE' : 'ACK, PSH',
        details: `Real-time passive packet capture stream from interface eth0 for 5-tuple ${srcIp} -> ${dstIp}:${port}.`
      };

      setFlows(prev => [newFlow, ...prev.slice(0, 499)]);

      setFlowsPerSec(prev => Math.max(1200, Math.min(1800, prev + Math.floor(Math.random() * 31 - 15))));
      setPktsPerSec(prev => Math.max(75000, Math.min(98000, prev + Math.floor(Math.random() * 501 - 250))));
      setActiveConnections(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 1800);

    return () => clearInterval(timer);
  }, [isLive]);

  // Filter flows
  const filteredFlows = useMemo(() => {
    return flows.filter(flow => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          flow.sourceIp.toLowerCase().includes(q) ||
          flow.destIp.toLowerCase().includes(q) ||
          String(flow.sourcePort).includes(q) ||
          String(flow.destPort).includes(q) ||
          flow.status.toLowerCase().includes(q) ||
          flow.protocol.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (selectedProtocol !== 'All' && flow.protocol.toUpperCase() !== selectedProtocol.toUpperCase()) {
        return false;
      }

      if (selectedThreat !== 'All' && flow.status.toLowerCase() !== selectedThreat.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [flows, searchQuery, selectedProtocol, selectedThreat]);

  // Pagination calculation
  const totalEntries = 8421 + flows.length - INITIAL_FLOWS.length;
  const totalPages = Math.ceil(filteredFlows.length / rowsPerPage);
  const paginatedFlows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredFlows.slice(start, start + rowsPerPage);
  }, [filteredFlows, currentPage, rowsPerPage]);

  const renderStatusPill = (status, score) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-healthy/10 border border-healthy/30 text-healthy text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-healthy" />
            <span>Normal</span>
          </span>
        );
      case 'Suspicious':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning/10 border border-warning/30 text-warning text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span>Suspicious</span>
          </span>
        );
      case 'DNS Anomaly':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F5C451]/10 border border-[#F5C451]/30 text-[#F5C451] text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C451]" />
            <span>DNS Anomaly</span>
          </span>
        );
      case 'Port Scan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/10 border border-error/30 text-error text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span>Port Scan</span>
          </span>
        );
      case 'C2 Beaconing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2994A]/10 border border-[#F2994A]/30 text-[#F2994A] text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2994A]" />
            <span>C2 Beaconing</span>
          </span>
        );
      case 'DGA Detected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/10 border border-error/30 text-error text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span>DGA Detected</span>
          </span>
        );
      case 'Web Scan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning/10 border border-warning/30 text-warning text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span>Web Scan</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-[11px] font-mono">
            <span>{status}</span>
          </span>
        );
    }
  };

  const renderDestIp = (ip, status) => {
    if (ip.startsWith('10.') || ip.startsWith('192.168.')) {
      return <span className="text-[#4ADE80] font-mono">{ip}</span>;
    }
    if (ip === '8.8.8.8' || ip === '1.1.1.1') {
      return <span className="text-[#F5C451] font-mono">{ip}</span>;
    }
    if (status === 'C2 Beaconing' || status === 'Suspicious' || status === 'DGA Detected') {
      return <span className="text-[#FF7675] font-mono">{ip}</span>;
    }
    return <span className="text-[#81ECEC] font-mono">{ip}</span>;
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Traffic Monitor</h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-healthy/15 border border-healthy/40 text-healthy text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-healthy animate-ping" />
                <span>LIVE</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              PASSIVE TAP SENSOR: <span className="text-primary">sensor-gw01-eth0</span> | READ-ONLY TELEMETRY
            </p>
          </div>
        </div>

        {/* Controls: Pause/Resume, Export */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 border transition ${
              isLive
                ? 'bg-panel border-warning/40 text-warning hover:bg-warning/10'
                : 'bg-primary text-gray-950 border-primary font-bold shadow-md shadow-primary/20'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isLive ? 'Pause Stream' : 'Resume Live'}</span>
          </button>

          <button className="bg-panel border border-border hover:border-primary/40 text-xs text-gray-300 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono transition">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 5 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* 1. Flows/sec */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-3.5 shadow-lg space-y-1 hover:border-primary/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-mono">
            <span className="uppercase">Flows / sec</span>
            <Activity className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{flowsPerSec.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
            <span>+3.4%</span>
            <span className="text-gray-500">live sampling</span>
          </div>
        </div>

        {/* 2. Packets/sec */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-3.5 shadow-lg space-y-1 hover:border-primary/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-mono">
            <span className="uppercase">Packets / sec</span>
            <Network className="w-3.5 h-3.5 text-primaryContainer" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{pktsPerSec.toLocaleString()}</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-primaryContainer">
            <span>+1.8%</span>
            <span className="text-gray-500">zero drop rate</span>
          </div>
        </div>

        {/* 3. Bandwidth */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-3.5 shadow-lg space-y-1 hover:border-primary/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-mono">
            <span className="uppercase">Bandwidth</span>
            <Globe className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">1.84 <span className="text-sm font-normal text-gray-400">Gbps</span></div>
          <div className="text-[10px] font-mono text-gray-400 truncate">
            ↓ 1.42 Gbps | ↑ 420 Mbps
          </div>
        </div>

        {/* 4. Active Connections */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-3.5 shadow-lg space-y-1 hover:border-primary/30 transition">
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-mono">
            <span className="uppercase">Active Conns</span>
            <Radio className="w-3.5 h-3.5 text-[#F5C451]" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">{activeConnections.toLocaleString()}</div>
          <div className="text-[10px] font-mono text-gray-400">
            ESTABLISHED states
          </div>
        </div>

        {/* 5. Traffic Alerts */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-3.5 shadow-lg space-y-1 hover:border-error/40 transition">
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-mono">
            <span className="uppercase">Traffic Alerts</span>
            <ShieldAlert className="w-3.5 h-3.5 text-error" />
          </div>
          <div className="text-2xl font-bold font-mono text-error tracking-tight">{trafficAlerts}</div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-error">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
            <span>7 require triage</span>
          </div>
        </div>

      </div>

      {/* MAIN TABLE CARD: REALTIME NETWORK LOG */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header & Controls (Matching Image 1:1) */}
        <div className="p-4 border-b border-[#1C252E] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Title & LIVE badge */}
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">REALTIME NETWORK LOG</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-healthy/15 border border-healthy/40 text-healthy text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-healthy animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>

          {/* Right: Search, Protocol, Threat, Time Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Search Bar */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search IP / Domain / Port"
                className="bg-[#11171E] h-8 pl-8 pr-3 rounded-lg border border-[#1C2630] text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-primary w-48 sm:w-56 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 text-gray-400 hover:text-white text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Protocol Dropdown */}
            <select
              value={selectedProtocol}
              onChange={e => setSelectedProtocol(e.target.value)}
              className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-xs font-mono text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">Protocol: All</option>
              <option value="TCP">TCP</option>
              <option value="TLS">TLS</option>
              <option value="UDP">UDP</option>
              <option value="QUIC">QUIC</option>
            </select>

            {/* Threat Dropdown */}
            <select
              value={selectedThreat}
              onChange={e => setSelectedThreat(e.target.value)}
              className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-xs font-mono text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">Threat: All</option>
              <option value="Normal">Normal</option>
              <option value="Suspicious">Suspicious</option>
              <option value="C2 Beaconing">C2 Beaconing</option>
              <option value="DNS Anomaly">DNS Anomaly</option>
              <option value="Port Scan">Port Scan</option>
              <option value="DGA Detected">DGA Detected</option>
              <option value="Web Scan">Web Scan</option>
            </select>

            {/* Time Range Dropdown */}
            <select
              value={selectedTimeRange}
              onChange={e => setSelectedTimeRange(e.target.value)}
              className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-xs font-mono text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="Last 5 min">Last 5 min</option>
              <option value="Last 15 min">Last 15 min</option>
              <option value="Last 1 hour">Last 1 hour</option>
              <option value="Last 24 Hours">Last 24 Hours</option>
            </select>

            {/* Reset Filter Button */}
            {(searchQuery || selectedProtocol !== 'All' || selectedThreat !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedProtocol('All');
                  setSelectedThreat('All');
                }}
                className="p-1.5 rounded-lg bg-[#141A21] border border-[#1C2630] text-gray-400 hover:text-white"
                title="Clear Filters"
              >
                <Filter className="w-3.5 h-3.5 text-primary" />
              </button>
            )}

          </div>
        </div>

        {/* Table Viewport */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#11171E] border-b border-[#1C2630] text-gray-400 uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-3.5 font-semibold text-gray-300">Time ▾</th>
                <th className="py-3 px-3.5 font-semibold">Source IP</th>
                <th className="py-3 px-3 font-semibold">Source Port</th>
                <th className="py-3 px-3.5 font-semibold">Destination IP</th>
                <th className="py-3 px-3 font-semibold">Dest. Port</th>
                <th className="py-3 px-3 font-semibold">Protocol</th>
                <th className="py-3 px-3 text-right font-semibold">Packets</th>
                <th className="py-3 px-3.5 text-right font-semibold">Bytes</th>
                <th className="py-3 px-3.5 font-semibold">Flow Duration</th>
                <th className="py-3 px-3 text-center font-semibold">Threat Score</th>
                <th className="py-3 px-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182026]">
              {paginatedFlows.map((flow) => {
                const isThreat = flow.threatScore > 50;
                return (
                  <tr
                    key={flow.id}
                    onClick={() => setSelectedFlow(flow)}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedFlow?.id === flow.id
                        ? 'bg-primary/10 border-l-2 border-primary'
                        : flow.isNew
                        ? 'bg-primary/5 hover:bg-[#141C24]'
                        : 'hover:bg-[#131A22]'
                    }`}
                  >
                    {/* Time with ms */}
                    <td className="py-2.5 px-3.5 text-gray-400 whitespace-nowrap">{flow.time}</td>
                    
                    {/* Source IP (styled green) */}
                    <td className="py-2.5 px-3.5 font-bold text-[#4ADE80] whitespace-nowrap">{flow.sourceIp}</td>
                    
                    {/* Source Port */}
                    <td className="py-2.5 px-3 text-gray-300">{flow.sourcePort}</td>
                    
                    {/* Destination IP (context colored) */}
                    <td className="py-2.5 px-3.5 font-semibold whitespace-nowrap">
                      {renderDestIp(flow.destIp, flow.status)}
                    </td>
                    
                    {/* Dest Port */}
                    <td className="py-2.5 px-3 text-gray-300">{flow.destPort}</td>
                    
                    {/* Protocol */}
                    <td className="py-2.5 px-3 text-gray-200 font-semibold">{flow.protocol}</td>
                    
                    {/* Packets */}
                    <td className="py-2.5 px-3 text-right text-gray-300">{flow.packets}</td>
                    
                    {/* Bytes */}
                    <td className="py-2.5 px-3.5 text-right font-semibold text-gray-200 whitespace-nowrap">{flow.bytesFormatted}</td>
                    
                    {/* Flow Duration */}
                    <td className="py-2.5 px-3.5 text-gray-400 whitespace-nowrap">{flow.duration}</td>
                    
                    {/* Threat Score */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`font-bold ${isThreat ? (flow.threatScore > 80 ? 'text-error' : 'text-warning') : 'text-gray-400'}`}>
                        {flow.threatScore}
                      </span>
                    </td>
                    
                    {/* Status Pill */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {renderStatusPill(flow.status, flow.threatScore)}
                    </td>
                  </tr>
                );
              })}

              {paginatedFlows.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-500 font-mono">
                    No matching network flow events found for current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Controls (Matching Image 1:1) */}
        <div className="p-3.5 bg-[#11171E] border-t border-[#1C252E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400">
          
          <div>
            Showing <span className="text-white font-semibold">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="text-white font-semibold">{Math.min(currentPage * rowsPerPage, filteredFlows.length)}</span> of <span className="text-white font-semibold">{totalEntries.toLocaleString()}</span> entries
          </div>

          <div className="flex items-center gap-3">
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1 rounded bg-[#141A21] border border-[#1C2630] disabled:opacity-30 hover:text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3, 4, 5].map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded text-xs font-mono transition ${
                    currentPage === pageNum
                      ? 'bg-primary text-gray-950 font-bold shadow-sm'
                      : 'bg-[#141A21] border border-[#1C2630] text-gray-300 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <span className="text-gray-500 px-1">...</span>
              <button
                onClick={() => setCurrentPage(702)}
                className="w-8 h-7 rounded text-xs font-mono bg-[#141A21] border border-[#1C2630] text-gray-300 hover:text-white"
              >
                702
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-[#141A21] border border-[#1C2630] disabled:opacity-30 hover:text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rows Per Page */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#222E3A]">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={e => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[#141A21] h-7 px-2 rounded border border-[#1C2630] text-xs font-mono text-white focus:outline-none"
              >
                <option value={12}>12</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

          </div>

        </div>

      </div>

      {/* BELOW TABLE ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 1. Live Traffic Volume Area Chart */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">Live Traffic Volume</h3>
            <span className="text-[10px] font-mono text-primary">↓ 1.42G | ↑ 420M</span>
          </div>

          {/* SVG Multi-Line Chart */}
          <div className="h-36 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ingressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#51F0E3" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#51F0E3" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Ingress Area */}
              <polygon
                points="0,100 0,35 50,45 100,25 150,30 200,15 250,40 300,20 300,100"
                fill="url(#ingressGrad)"
              />
              <polyline
                points="0,35 50,45 100,25 150,30 200,15 250,40 300,20"
                fill="none"
                stroke="#51F0E3"
                strokeWidth="2"
              />

              {/* Egress Line */}
              <polyline
                points="0,75 50,80 100,70 150,72 200,65 250,78 300,68"
                fill="none"
                stroke="#F5C451"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>

            {/* Chart Timeline Markers */}
            <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-2">
              <span>-60s</span>
              <span>-45s</span>
              <span>-30s</span>
              <span>-15s</span>
              <span className="text-primary font-bold">Now</span>
            </div>
          </div>
        </div>

        {/* 2. Top Talkers by Source IP */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">Top Talkers (Src IP)</h3>
            <span className="text-[10px] font-mono text-gray-400">Total 5.4 GB</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { ip: '10.0.1.56', vol: '1.84 GB', pct: 34, isThreat: true },
              { ip: '10.0.1.24', vol: '1.42 GB', pct: 26, isThreat: false },
              { ip: '10.0.1.77', vol: '980 MB', pct: 18, isThreat: true },
              { ip: '10.0.1.44', vol: '720 MB', pct: 13, isThreat: true },
              { ip: '10.0.1.31', vol: '490 MB', pct: 9, isThreat: false }
            ].map(t => (
              <div
                key={t.ip}
                onClick={() => setSearchQuery(t.ip)}
                className="p-1.5 rounded bg-[#131920] hover:bg-[#18212B] border border-[#1C252E] cursor-pointer space-y-1 transition"
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#4ADE80]">{t.ip}</span>
                  <span className="text-gray-300">{t.vol}</span>
                </div>
                <div className="w-full bg-[#1C252E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.isThreat ? 'bg-error' : 'bg-primary'}`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Protocol Distribution */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">Protocol Distribution</h3>
            <span className="text-[10px] font-mono text-primary">All Sessions</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { proto: 'HTTPS / TLS 1.3', pct: 68.5, vol: '18.4 TB', color: 'bg-primary' },
              { proto: 'gRPC / HTTP/2', pct: 18.2, vol: '4.9 TB', color: 'bg-primaryContainer' },
              { proto: 'QUIC / UDP', pct: 8.1, vol: '2.1 TB', color: 'bg-[#F5C451]' },
              { proto: 'DNS / DoH', pct: 3.8, vol: '1.0 TB', color: 'bg-secondary' },
              { proto: 'Raw TCP / Other', pct: 1.4, vol: '380 GB', color: 'bg-error' }
            ].map(p => (
              <div key={p.proto} className="space-y-1">
                <div className="flex justify-between text-[11px] text-gray-300">
                  <span>{p.proto}</span>
                  <span className="text-white font-bold">{p.pct}%</span>
                </div>
                <div className="w-full bg-[#1C252E] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FLOW DETAILS INSPECTOR DRAWER (Opens when any row is clicked) */}
      {selectedFlow && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1217] border border-primary/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#11171E] border-b border-[#1C2630] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className={`w-5 h-5 ${selectedFlow.threatScore > 50 ? 'text-error' : 'text-primary'}`} />
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">FLOW TELEMETRY INSPECTOR</h3>
                  <p className="text-[10px] font-mono text-gray-400">ID: {selectedFlow.id} | Timestamp: {selectedFlow.time}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFlow(null)}
                className="w-7 h-7 rounded-lg bg-[#182028] hover:bg-surfaceHighest text-gray-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs">
              
              {/* 5-Tuple Header Card */}
              <div className="p-3.5 bg-[#141A21] border border-[#1C252E] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase">Source</span>
                  <div className="text-sm font-bold text-[#4ADE80]">{selectedFlow.sourceIp}:{selectedFlow.sourcePort}</div>
                </div>
                <div className="text-gray-500 font-bold">→</div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase">Destination</span>
                  <div className="text-sm font-bold text-white">{selectedFlow.destIp}:{selectedFlow.destPort}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase">Protocol</span>
                  <div className="text-sm font-bold text-primary">{selectedFlow.protocol}</div>
                </div>
              </div>

              {/* AI Threat Assessment */}
              <div className="p-3.5 bg-[#141A21] border border-[#1C252E] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">AI Threat Classification</span>
                  {renderStatusPill(selectedFlow.status, selectedFlow.threatScore)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Anomaly Threat Score:</span>
                  <span className={`text-lg font-bold ${selectedFlow.threatScore > 50 ? 'text-error' : 'text-healthy'}`}>
                    {selectedFlow.threatScore} / 100
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed pt-1 border-t border-[#1C252E]">
                  {selectedFlow.details}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">Packets</span>
                  <p className="text-sm font-bold text-white">{selectedFlow.packets}</p>
                </div>
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">Volume</span>
                  <p className="text-sm font-bold text-white">{selectedFlow.bytesFormatted}</p>
                </div>
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">Duration</span>
                  <p className="text-sm font-bold text-white">{selectedFlow.duration}</p>
                </div>
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">TCP / State Flags</span>
                  <p className="text-xs font-semibold text-primary">{selectedFlow.flags}</p>
                </div>
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">Byte Entropy</span>
                  <p className="text-xs font-semibold text-warning">{selectedFlow.entropy} bits/B</p>
                </div>
                <div className="p-2.5 bg-[#141A21] border border-[#1C252E] rounded-lg">
                  <span className="text-[10px] text-gray-400 uppercase">Sensor Tap</span>
                  <p className="text-xs text-gray-300">eth0:mirror</p>
                </div>
              </div>

              {/* TLS / DNS Attributes (if present) */}
              {selectedFlow.sni && (
                <div className="p-3 bg-[#141A21] border border-[#1C252E] rounded-lg space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">TLS Server Name Indication (SNI)</span>
                  <p className="text-xs font-mono text-primary break-all">{selectedFlow.sni}</p>
                </div>
              )}

              {selectedFlow.ja3 && (
                <div className="p-3 bg-[#141A21] border border-[#1C252E] rounded-lg space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">JA3 Client Fingerprint</span>
                  <p className="text-[10px] font-mono text-gray-400 break-all">{selectedFlow.ja3}</p>
                </div>
              )}

              {/* Passive System Disclaimer */}
              <div className="p-2.5 bg-surface/30 border border-border/40 rounded-lg text-[10px] text-gray-400">
                🔒 <strong>Passive Telemetry Notice:</strong> This sensor operates in strictly passive, read-only capture mode. No active packet modification, TCP RST injection, or active probing is performed.
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-[#11171E] border-t border-[#1C252E] flex justify-end">
              <button
                onClick={() => setSelectedFlow(null)}
                className="bg-primary text-gray-950 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-primaryContainer transition"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
