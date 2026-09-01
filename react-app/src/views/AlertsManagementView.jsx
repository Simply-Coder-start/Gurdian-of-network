import React, { useState, useMemo, useEffect } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  Clock,
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Radio,
  Target,
  ArrowRight,
  RefreshCw,
  X,
  Layers,
  FileText,
  UserCheck,
  Merge,
  AlertTriangle,
  Flame,
  Key,
  Shield,
  Plus
} from 'lucide-react';

const INITIAL_ALERTS = [
  {
    id: 'ALT-8432F7',
    title: 'Anomalous Data Exfiltration',
    severity: 'CRITICAL',
    priority: 'P1',
    threatType: 'Exfiltration',
    source: '10.240.12.84',
    sourceHost: 'WORKSTATION-SEC-04',
    dest: '194.26.29.112',
    destHost: 's3-eu-west-drop.biz',
    confidence: 94.2,
    status: 'New',
    age: '2m',
    sla: '13m remaining',
    eventsCount: 247,
    flowsCount: 18,
    affectedHosts: 3,
    analyst: 'SO (SecOps)',
    campaign: 'APT-29 CobaltStrike',
    mergedCount: 4,
    mitre: 'T1048 - Exfiltration Over Web',
    recommendation: 'Investigate immediately — high-confidence exfiltration with abnormal outbound volume (4.2 GB) outside business hours.',
    features: [
      { name: 'Volume Delta', val: '+840%' },
      { name: 'Payload Entropy', val: '7.82 bits/B' },
      { name: 'Unseen External Endpoint', val: '194.26.29.112' }
    ],
    relatedAlerts: ['#ALT-8429A1', '#ALT-8430B4', '#ALT-8431C8']
  },
  {
    id: 'ALT-8431C8',
    title: 'DNS Tunneling Payload Channel',
    severity: 'HIGH',
    priority: 'P2',
    threatType: 'DNS Tunneling',
    source: '10.240.8.19',
    sourceHost: 'SRV-APPS-INTERNAL',
    dest: '8.8.8.8',
    destHost: 'dns.google',
    confidence: 88.7,
    status: 'Investigating',
    age: '6m',
    sla: '24m remaining',
    eventsCount: 840,
    flowsCount: 42,
    affectedHosts: 1,
    analyst: 'Alex R. (Triage)',
    campaign: 'FIN7 DNS Staging',
    mergedCount: 2,
    mitre: 'T1071.004 - DNS Transport',
    recommendation: 'Inspect DNS TXT record payloads for encoded binary staging. Review recent internal DHCP leases.',
    features: [
      { name: 'Subdomain Length', val: '54 chars avg' },
      { name: 'Query Frequency', val: '28/s' },
      { name: 'Base64 Entropy', val: '7.64 bits/B' }
    ],
    relatedAlerts: ['#ALT-8432F7']
  },
  {
    id: 'ALT-8430B4',
    title: 'Lateral Movement via SMBv1',
    severity: 'HIGH',
    priority: 'P2',
    threatType: 'Reconnaissance',
    source: '192.168.4.11',
    sourceHost: 'DEV-SRV-BUILD-02',
    dest: '192.168.4.2',
    destHost: 'DC01-GLOBAL-AD',
    confidence: 82.1,
    status: 'New',
    age: '14m',
    sla: '16m remaining',
    eventsCount: 94,
    flowsCount: 12,
    affectedHosts: 2,
    analyst: 'Unassigned',
    campaign: 'APT-29 CobaltStrike',
    mergedCount: 1,
    mitre: 'T1021.002 - SMB Shares',
    recommendation: 'Check administrative share IPC$ authentication logs. Isolate source build host if unrecognized.',
    features: [
      { name: 'Deprecated Protocol', val: 'SMBv1 Dialect' },
      { name: 'Admin Share Access', val: 'IPC$ / ADMIN$' }
    ],
    relatedAlerts: ['#ALT-8432F7']
  },
  {
    id: 'ALT-8429A1',
    title: 'Credential Spraying Cluster',
    severity: 'MEDIUM',
    priority: 'P3',
    threatType: 'Reconnaissance',
    source: '185.220.101.5',
    sourceHost: 'tor-exit-node-de',
    dest: '10.0.0.5',
    destHost: 'AUTH-GATEWAY-01',
    confidence: 67.4,
    status: 'Resolved',
    age: '45m',
    sla: 'Met (Resolved)',
    eventsCount: 2300,
    flowsCount: 140,
    affectedHosts: 1,
    analyst: 'SO (SecOps)',
    campaign: 'External Password Sweep',
    mergedCount: 8,
    mitre: 'T1110.003 - Password Spraying',
    recommendation: 'Automated perimeter rate-limit rule engaged. Verified no single account lockout reached.',
    features: [
      { name: 'Account Distribution', val: '142 Users' },
      { name: 'Pacing Delay', val: '12.4s Stagger' }
    ],
    relatedAlerts: ['#ALT-8430B4']
  },
  {
    id: 'ALT-8428E0',
    title: 'Port Scan Discovery Matrix',
    severity: 'LOW',
    priority: 'P4',
    threatType: 'Reconnaissance',
    source: '45.155.205.233',
    sourceHost: 'scanner-cloud-shodan',
    dest: '10.240.0.0/24',
    destHost: 'DMZ Subnet',
    confidence: 98.0,
    status: 'Resolved',
    age: '1h 12m',
    sla: 'Met (Resolved)',
    eventsCount: 4200,
    flowsCount: 420,
    affectedHosts: 24,
    analyst: 'Automated Triage',
    campaign: 'Internet Scanner',
    mergedCount: 12,
    mitre: 'T1046 - Network Discovery',
    recommendation: 'Routine internet scanner sweep. Perimeter firewall dropped SYN packets as intended.',
    features: [
      { name: 'SYN Probe Rate', val: '240 pkts/s' },
      { name: 'Target Range', val: 'Top 100 Ports' }
    ],
    relatedAlerts: []
  },
  {
    id: 'ALT-8433D9',
    title: 'C2 Cobalt Strike Beaconing Heartbeat',
    severity: 'CRITICAL',
    priority: 'P1',
    threatType: 'C2 Beaconing',
    source: '10.0.1.56',
    sourceHost: 'WORKSTATION-FIN-02',
    dest: '185.22.33.16',
    destHost: 'c2-listener.darkcorp-threat.org',
    confidence: 92.8,
    status: 'Investigating',
    age: '3m',
    sla: '12m remaining',
    eventsCount: 312,
    flowsCount: 26,
    affectedHosts: 1,
    analyst: 'SO (SecOps)',
    campaign: 'APT-29 CobaltStrike',
    mergedCount: 3,
    mitre: 'T1071.001 - Web Protocols C2',
    recommendation: 'Periodic 15-second TLS jitter with JA3 client fingerprint match. Immediate network quarantine advised.',
    features: [
      { name: 'Beacon Interval', val: '15.0s Jitter' },
      { name: 'JA3 Fingerprint', val: 'CobaltStrike Profile' }
    ],
    relatedAlerts: ['#ALT-8432F7']
  }
];

export const AlertsManagementView = () => {
  const { setActiveView } = useTelemetry();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterConfidence, setFilterConfidence] = useState('ALL');
  const [groupByCampaign, setGroupByCampaign] = useState(true);

  const [expandedId, setExpandedId] = useState('ALT-8432F7'); // default expanded critical
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastUpdatedSec, setLastUpdatedSec] = useState(2);

  useEffect(() => {
    const t = setInterval(() => {
      setLastUpdatedSec(prev => (prev >= 15 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Summary Metrics
  const totalAlerts = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.severity === 'HIGH').length;
  const investigatingCount = alerts.filter(a => a.status === 'Investigating').length;
  const unresolvedCount = alerts.filter(a => a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length;

  // Filtered dataset
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.dest.toLowerCase().includes(q) ||
          a.sourceHost.toLowerCase().includes(q) ||
          a.destHost.toLowerCase().includes(q) ||
          a.campaign.toLowerCase().includes(q) ||
          a.mitre.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
      if (filterStatus !== 'ALL' && a.status.toUpperCase() !== filterStatus.toUpperCase()) return false;
      if (filterType !== 'ALL' && a.threatType.toUpperCase() !== filterType.toUpperCase()) return false;

      if (filterConfidence === '>90' && a.confidence < 90) return false;
      if (filterConfidence === '>80' && a.confidence < 80) return false;

      return true;
    });
  }, [alerts, searchQuery, filterSeverity, filterStatus, filterType, filterConfidence]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAlerts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAlerts.map(a => a.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (newStatus) => {
    setAlerts(prev =>
      prev.map(a => (selectedIds.includes(a.id) ? { ...a, status: newStatus } : a))
    );
    setSelectedIds([]);
  };

  const handleMergeSelected = () => {
    alert(`Merged ${selectedIds.length} selected alerts under campaign incident parent.`);
    setSelectedIds([]);
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Alerts Management
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/15 border border-error/40 text-error font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-error animate-ping" />
              <span>● LIVE — Updated {lastUpdatedSec}s ago</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Incident triage queue, campaign deduplication, AI-assisted recommendations, and alert workflow automation.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleBulkStatus('Acknowledged')}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] hover:border-primary/40 text-xs font-mono text-white px-3.5 py-1.5 rounded-lg transition active:scale-95 shadow-sm"
          >
            Acknowledge All
          </button>
          
          <button
            onClick={() => alert('New detection rule wizard opened.')}
            className="bg-primary text-gray-950 font-bold px-3.5 py-1.5 rounded-lg text-xs hover:bg-primaryContainer transition flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Rule</span>
          </button>
        </div>
      </div>

      {/* 2. Top Alert Summary Cards (6 KPIs) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        
        {/* Total Alerts */}
        <div
          onClick={() => setFilterSeverity('ALL')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-primary/40 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Total Alerts</span>
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-white">{totalAlerts}</div>
          <div className="text-[10px] text-gray-500">active pipeline</div>
        </div>

        {/* Critical */}
        <div
          onClick={() => setFilterSeverity('CRITICAL')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-error/50 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Critical</span>
            <span className="w-2 h-2 rounded-full bg-error animate-ping" />
          </div>
          <div className="text-2xl font-bold text-error">{criticalCount}</div>
          <div className="text-[10px] text-error/80 font-semibold">Immediate Triage</div>
        </div>

        {/* High */}
        <div
          onClick={() => setFilterSeverity('HIGH')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-warning/50 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">High Priority</span>
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="text-2xl font-bold text-warning">{highCount}</div>
          <div className="text-[10px] text-warning/80">Elevated Posture</div>
        </div>

        {/* Investigating */}
        <div
          onClick={() => setFilterStatus('INVESTIGATING')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-primary/40 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Investigating</span>
            <Radio className="w-3.5 h-3.5 text-primaryContainer animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-primaryContainer">{investigatingCount}</div>
          <div className="text-[10px] text-primaryContainer/80">In Forensic Queue</div>
        </div>

        {/* Unresolved */}
        <div
          onClick={() => setFilterStatus('NEW')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-primary/40 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Unresolved</span>
            <Clock className="w-3.5 h-3.5 text-gray-300" />
          </div>
          <div className="text-2xl font-bold text-white">{unresolvedCount}</div>
          <div className="text-[10px] text-gray-500">Pending Resolution</div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => setFilterStatus('RESOLVED')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-healthy/40 rounded-xl p-3 shadow-sm space-y-1 transition cursor-pointer"
        >
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-healthy" />
          </div>
          <div className="text-2xl font-bold text-healthy">{resolvedCount}</div>
          <div className="text-[10px] text-gray-500">Remediated</div>
        </div>

      </div>

      {/* 3. Advanced Filter Bar ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono text-xs">
        
        {/* Left: Universal Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Universal Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Alert ID, IP, Host, Campaign, MITRE..."
              className="bg-[#11171E] h-8 pl-8 pr-3 rounded-lg border border-[#1C2630] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary w-60 sm:w-72 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 text-gray-400 hover:text-white text-xs">✕</button>
            )}
          </div>

          {/* Severity Dropdown */}
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Threat Type Dropdown */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-primary cursor-pointer hidden sm:block"
          >
            <option value="ALL">All Threat Types</option>
            <option value="EXFILTRATION">Exfiltration</option>
            <option value="C2 BEACONING">C2 Beaconing</option>
            <option value="DNS TUNNELING">DNS Tunneling</option>
            <option value="RECONNAISSANCE">Reconnaissance</option>
          </select>

          {/* Confidence Filter */}
          <select
            value={filterConfidence}
            onChange={e => setFilterConfidence(e.target.value)}
            className="bg-[#11171E] h-8 px-2.5 rounded-lg border border-[#1C2630] text-gray-300 focus:outline-none focus:border-primary cursor-pointer hidden md:block"
          >
            <option value="ALL">All Confidence</option>
            <option value=">90">&gt; 90% (High Confidence)</option>
            <option value=">80">&gt; 80%</option>
          </select>
        </div>

        {/* Right: Campaign Deduplication Toggle ⭐ */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={groupByCampaign}
              onChange={e => setGroupByCampaign(e.target.checked)}
              className="accent-primary cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Merge className="w-3 h-3 text-primary" />
              <span>Deduplicate by Campaign</span>
            </span>
          </label>
        </div>

      </div>

      {/* 4. Bulk Action Bar (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-primary/10 border border-primary/40 rounded-xl flex items-center justify-between font-mono text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">{selectedIds.length} alerts selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus('Acknowledged')}
              className="px-3 py-1 rounded bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] text-white text-xs"
            >
              Acknowledge
            </button>
            <button
              onClick={handleMergeSelected}
              className="px-3 py-1 rounded bg-[#0D1318] hover:bg-[#131B22] border border-primary/40 text-primary text-xs flex items-center gap-1"
            >
              <Merge className="w-3 h-3" />
              <span>Merge &amp; Deduplicate ⭐</span>
            </button>
            <button
              onClick={() => handleBulkStatus('Resolved')}
              className="px-3 py-1 rounded bg-healthy/20 hover:bg-healthy/30 border border-healthy/40 text-healthy text-xs font-bold"
            >
              Resolve ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {/* 5. Alerts Incident Queue with Expandable Rows ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl overflow-hidden shadow-sm divide-y divide-[#182026]">
        
        {/* Table Header / Selection Bar */}
        <div className="p-3 bg-[#11171E] border-b border-[#1C2630] flex items-center justify-between text-xs font-mono text-gray-400 uppercase text-[11px] select-none">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredAlerts.length && filteredAlerts.length > 0}
              onChange={handleSelectAll}
              className="accent-primary cursor-pointer ml-1"
            />
            <span>Incident Alert Stream ({filteredAlerts.length})</span>
          </div>
          <span>Triage Workflow</span>
        </div>

        {/* Alert Cards / Rows */}
        {filteredAlerts.map(alert => {
          const isExpanded = expandedId === alert.id;
          const isSelected = selectedIds.includes(alert.id);
          
          return (
            <div key={alert.id} className={`transition-colors ${isExpanded ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-[#11171E]'} ${isSelected ? 'bg-primary/10' : ''}`}>
              
              {/* Main Card Header Row */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
              >
                
                {/* Left: Checkbox + Priority + Severity + Incident Metadata */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1">
                  <div onClick={e => e.stopPropagation()} className="pt-1 sm:pt-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(alert.id)}
                      className="accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Priority Badge ⭐ */}
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                    alert.priority === 'P1'
                      ? 'bg-error text-gray-950 shadow-sm'
                      : alert.priority === 'P2'
                      ? 'bg-warning text-gray-950'
                      : 'bg-[#1C2630] text-gray-300'
                  }`}>
                    {alert.priority}
                  </span>

                  <StatusBadge severity={alert.severity} size="sm" />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-sans">{alert.title}</h3>
                      <span className="text-[10px] font-mono text-gray-500">ID: {alert.id}</span>
                      {alert.mergedCount > 1 && groupByCampaign && (
                        <span className="px-2 py-0.2 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-mono flex items-center gap-1">
                          <Merge className="w-2.5 h-2.5" />
                          <span>{alert.mergedCount} deduplicated events</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                      <span>Source: <span className="text-primary font-semibold">{alert.source}</span> ({alert.sourceHost})</span>
                      <span>Target: <span className="text-gray-200">{alert.dest}</span></span>
                      <span>Confidence: <span className="text-primary font-bold">{alert.confidence}%</span></span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics + Status + Investigate Action */}
                <div className="flex items-center justify-between lg:justify-end gap-4 font-mono text-xs">
                  <div className="text-right text-[11px] text-gray-400 hidden sm:block">
                    <div>{alert.eventsCount} events • {alert.flowsCount} flows</div>
                    <div className="text-gray-500">Age: {alert.age} | SLA: {alert.sla}</div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                    alert.status === 'New'
                      ? 'bg-error/15 border-error/30 text-error font-bold'
                      : alert.status === 'Investigating'
                      ? 'bg-warning/15 border-warning/30 text-warning'
                      : 'bg-healthy/15 border-healthy/30 text-healthy'
                  }`}>
                    {alert.status}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('investigation');
                    }}
                    className="text-primary hover:text-white hover:underline text-xs flex items-center gap-1 font-bold"
                  >
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                </div>

              </div>

              {/* ⭐ INLINE EXPANDABLE DETAILS ACCORDION ⭐ */}
              {isExpanded && (
                <div className="p-5 bg-[#090E13] border-t border-[#1C2630] space-y-4 font-mono text-xs animate-fadeIn">
                  
                  {/* AI Triage Recommendation ⭐ */}
                  <div className="p-3.5 bg-[#0D151C] border border-primary/30 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-1">
                      <div className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>AI Triage Recommendation</span>
                        <span className="text-gray-400 font-sans">| Assigned: {alert.analyst}</span>
                      </div>
                      <p className="text-xs text-gray-200 font-sans leading-relaxed">
                        {alert.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* 3-Column Diagnostic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Detection Features */}
                    <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Observed Evidence Features</span>
                      <div className="space-y-1.5 text-[11px]">
                        {alert.features.map((f, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-gray-400">{f.name}:</span>
                            <span className="text-white font-bold">{f.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* MITRE ATT&CK Mapping */}
                    <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">MITRE ATT&amp;CK Mapping</span>
                      <div className="text-primary font-bold text-xs">{alert.mitre}</div>
                      <div className="text-[10px] text-gray-400">
                        Observed across {alert.affectedHosts} affected host(s) in corporate subnet.
                      </div>
                    </div>

                    {/* Campaign & Related Alerts */}
                    <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-2">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Campaign Correlation</span>
                      <div className="text-white font-bold">{alert.campaign}</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {alert.relatedAlerts.map(rel => (
                          <span key={rel} className="px-1.5 py-0.5 rounded bg-[#18222C] text-primary text-[10px] font-mono">
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Workflow Action Bar */}
                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-[#1C2630] gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Investigating', analyst: 'SO (SecOps)' } : a));
                        }}
                        className="px-3 py-1 rounded bg-[#11171E] hover:bg-[#16202A] border border-[#1C2630] text-xs text-white"
                      >
                        Assign to Me
                      </button>
                      <button
                        onClick={() => {
                          setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Resolved' } : a));
                        }}
                        className="px-3 py-1 rounded bg-healthy/20 hover:bg-healthy/30 border border-healthy/40 text-healthy text-xs font-bold"
                      >
                        Resolve Alert
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveView('investigation')}
                      className="px-4 py-1.5 rounded-lg bg-primary text-gray-950 font-bold text-xs hover:bg-primaryContainer transition flex items-center gap-1.5"
                    >
                      <span>Open Deep Investigation Panel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center text-gray-500 font-mono text-xs">
            No incident alerts match the active search and filter criteria.
          </div>
        )}

      </div>

    </div>
  );
};
