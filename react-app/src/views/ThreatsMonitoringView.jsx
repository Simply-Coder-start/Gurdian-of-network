import React, { useState, useMemo, useEffect } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { SeverityKpiStrip } from '../components/matrix/SeverityKpiStrip';
import { TableToolbar } from '../components/matrix/TableToolbar';
import { ConfirmDialog } from '../components/matrix/ConfirmDialog';
import { incidentsApi } from '../services/incidentsApi';
import { getSeverityBadgeStyle } from '../utils/severity';
import {
  Download,
  FileText,
  ChevronDown,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const ThreatsMonitoringView = () => {
  const { setActiveView, toastMessage, setToastMessage } = useTelemetry();
  const [incidents, setIncidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Accordion expansion state: exactly one expanded row
  const [expandedId, setExpandedId] = useState('TRT-1048');
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Confirm Dialog state for Resolve Alert
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, caseId: null });

  // Live timer simulation
  const [lastUpdatedSec, setLastUpdatedSec] = useState(11);

  useEffect(() => {
    incidentsApi.getIncidents().then(setIncidents);
    const t = setInterval(() => {
      setLastUpdatedSec(prev => (prev >= 20 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Filtered dataset
  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.caseId.toLowerCase().includes(q) ||
          item.sourceIp.toLowerCase().includes(q) ||
          item.destIp.toLowerCase().includes(q) ||
          (item.sourceHost && item.sourceHost.toLowerCase().includes(q)) ||
          (item.destHost && item.destHost.toLowerCase().includes(q)) ||
          (item.mitreTechniqueId && item.mitreTechniqueId.toLowerCase().includes(q)) ||
          (item.threatType && item.threatType.toLowerCase().includes(q));
        if (!match) return false;
      }

      if (filterSeverity !== 'ALL' && item.severity.toUpperCase() !== filterSeverity.toUpperCase()) return false;
      if (filterType !== 'ALL' && item.threatType.toUpperCase() !== filterType.toUpperCase()) return false;
      if (filterStatus !== 'ALL' && item.status.toUpperCase() !== filterStatus.toUpperCase()) return false;

      return true;
    });
  }, [incidents, searchQuery, filterSeverity, filterType, filterStatus]);

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredIncidents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIncidents.map(i => i.caseId));
    }
  };

  const handleToggleSelect = (caseId) => {
    setSelectedIds(prev =>
      prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]
    );
  };

  // Safe Case-Management Status Mutation (Resolve Alert)
  const handleResolveAlert = (caseId) => {
    setConfirmDialog({
      isOpen: true,
      caseId
    });
  };

  const executeResolveAlert = () => {
    const caseId = confirmDialog.caseId;
    incidentsApi.updateIncidentStatus(caseId, 'resolved').then(() => {
      setIncidents(prev =>
        prev.map(i => (i.caseId === caseId ? { ...i, status: 'resolved' } : i))
      );
      setConfirmDialog({ isOpen: false, caseId: null });
      setToastMessage(`✓ Case ${caseId} marked as Resolved.`);
      setTimeout(() => setToastMessage(null), 3000);
    });
  };

  // Export CSV
  const handleExportCsv = () => {
    const header = 'Case ID,Title,Severity,Threat Type,Source IP,Source Host,Dest IP,Dest Host,MITRE,Events,Status\n';
    const rows = filteredIncidents.map(i =>
      `"${i.caseId}","${i.title}","${i.severity}","${i.threatType}","${i.sourceIp}","${i.sourceHost}","${i.destIp}","${i.destHost}","${i.mitreTechniqueId}",${i.eventCount},"${i.status}"`
    ).join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `threat_detection_matrix_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate IoC Report Document
  const handleIocReport = () => {
    const iocDoc = {
      reportType: 'INDICATOR_OF_COMPROMISE_REPORT',
      generatedAt: new Date().toISOString(),
      activeIncidents: filteredIncidents.map(i => ({
        caseId: i.caseId,
        threatActor: i.campaignLabel,
        indicators: {
          sourceIp: i.sourceIp,
          destinationIp: i.destIp,
          fqdn: i.destHost,
          mitreTactic: `${i.mitreTechniqueId} - ${i.mitreTechniqueLabel}`
        },
        confidence: `${i.confidencePct}%`
      }))
    };

    const blob = new Blob([JSON.stringify(iocDoc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ioc_report_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Header & Live Telemetry Status */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Threat Detection Matrix
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E13B3B]/15 border border-[#E13B3B]/40 text-[#E13B3B] font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#E13B3B] animate-ping" />
              <span>● LIVE — Updated {lastUpdatedSec}s ago</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Detailed MITRE ATT&amp;CK exfiltration feeds, anomaly scores, IoCs, and interactive attack progression chains.
          </p>
        </div>

        {/* Right-Aligned Action Buttons */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={handleExportCsv}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] hover:border-[#2FD9C8]/40 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#2FD9C8]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleIocReport}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] hover:border-[#2FD9C8]/40 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-[#2FD9C8]" />
            <span>IOC Report</span>
          </button>
        </div>
      </div>

      {/* 2. Top Severity KPI Cards (6 Strip Tiles) */}
      <SeverityKpiStrip
        incidents={incidents}
        activeSeverity={filterSeverity}
        onSelectSeverity={setFilterSeverity}
        onSelectStatus={setFilterStatus}
      />

      {/* 3. Controls & Advanced Filters Toolbar */}
      <TableToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
      />

      {/* 4. Bulk Action Bar (When rows selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#2FD9C8]/10 border border-[#2FD9C8]/40 rounded-xl flex items-center justify-between font-mono text-xs animate-fadeIn">
          <span className="font-bold text-[#2FD9C8]">{selectedIds.length} threats selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIncidents(prev => prev.map(i => selectedIds.includes(i.caseId) ? { ...i, status: 'investigating' } : i));
                setSelectedIds([]);
              }}
              className="px-3 py-1 rounded bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] text-white text-xs"
            >
              Mark Investigating
            </button>
            <button
              onClick={() => {
                setIncidents(prev => prev.map(i => selectedIds.includes(i.caseId) ? { ...i, status: 'resolved' } : i));
                setSelectedIds([]);
              }}
              className="px-3 py-1 rounded bg-[#34D399]/20 hover:bg-[#34D399]/30 border border-[#34D399]/40 text-[#34D399] text-xs font-bold"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      )}

      {/* 5. Threat Matrix Table with Accordion Expansion ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#11171E] border-b border-[#1C2630] text-gray-400 uppercase text-[11px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredIncidents.length && filteredIncidents.length > 0}
                    onChange={handleSelectAll}
                    className="accent-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Threat Type</th>
                <th className="py-3 px-3">Incident Title &amp; Campaign</th>
                <th className="py-3 px-3">Source IP / Host</th>
                <th className="py-3 px-3">Destination IP</th>
                <th className="py-3 px-3">MITRE Tactic</th>
                <th className="py-3 px-3 text-center">Events</th>
                <th className="py-3 px-3 text-center">First / Last Seen</th>
                <th className="py-3 px-3 text-center">Score &amp; Confidence</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182026]">
              {filteredIncidents.map((threat) => {
                const isExpanded = expandedId === threat.caseId;
                const isSelected = selectedIds.includes(threat.caseId);
                const badge = getSeverityBadgeStyle(threat.severity);

                return (
                  <React.Fragment key={threat.caseId}>
                    {/* Main Row */}
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : threat.caseId)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isExpanded ? 'bg-primary/5 border-l-2 border-[#E13B3B]' : 'hover:bg-[#131A22]'
                      } ${isSelected ? 'bg-primary/10' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(threat.caseId)}
                          className="accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Threat Type */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#141A21] border border-[#1C2630] text-gray-300 text-[10px]">
                          {threat.threatType}
                        </span>
                      </td>

                      {/* Incident Title */}
                      <td className="py-3 px-3 font-sans">
                        <div className="font-bold text-white text-xs">{threat.title}</div>
                        <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span className="text-[#2FD9C8] font-bold">{threat.caseId}</span>
                          <span>•</span>
                          <span className="text-gray-400">{threat.campaignLabel}</span>
                        </div>
                      </td>

                      {/* Source IP */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-[#34D399] font-bold flex items-center gap-1">
                          <span>{threat.sourceIp}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">{threat.sourceHost}</div>
                      </td>

                      {/* Destination IP */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-[#E8622F] font-semibold flex items-center gap-1">
                          <span>{threat.destIp}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-gray-500" />
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">{threat.destHost}</div>
                      </td>

                      {/* MITRE ATT&CK */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#2FD9C8]/10 border border-[#2FD9C8]/25 text-[#2FD9C8] text-[10px] font-bold">
                          {threat.mitreTechniqueId}
                        </span>
                        <div className="text-[10px] text-gray-400 font-sans truncate max-w-[140px] mt-0.5">
                          {threat.mitreTechniqueLabel}
                        </div>
                      </td>

                      {/* Events Count */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className="font-bold text-white">{threat.eventCount}</span>
                        <div className="text-[9px] text-gray-500">flows</div>
                      </td>

                      {/* First / Last Seen */}
                      <td className="py-3 px-3 text-center whitespace-nowrap text-[10px] text-gray-400">
                        <div>{threat.firstSeen}</div>
                        <div className="text-gray-500">to {threat.lastSeen}</div>
                      </td>

                      {/* Score & Confidence */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-bold ${threat.anomalyScorePct >= 80 ? 'text-[#E13B3B]' : 'text-[#E8A23D]'}`}>
                            {threat.anomalyScorePct}%
                          </span>
                          <div className="w-12 bg-[#1C252E] h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${threat.anomalyScorePct >= 80 ? 'bg-[#E13B3B]' : 'bg-[#E8A23D]'}`}
                              style={{ width: `${threat.anomalyScorePct}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-[9px] text-[#2FD9C8]">Conf: {threat.confidencePct}%</div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border text-[10px] capitalize ${
                          threat.status === 'open'
                            ? 'bg-[#E13B3B]/15 border-[#E13B3B]/30 text-[#E13B3B] font-bold'
                            : threat.status === 'investigating'
                            ? 'bg-[#E8A23D]/15 border-[#E8A23D]/30 text-[#E8A23D] font-bold'
                            : 'bg-[#34D399]/15 border-[#34D399]/30 text-[#34D399]'
                        }`}>
                          {threat.status}
                        </span>
                      </td>

                      {/* Evidence Expand Chevron */}
                      <td className="py-3 px-3 text-center">
                        <button className="p-1 rounded bg-[#141A21] text-[#2FD9C8] border border-[#1C2630]">
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-white' : ''}`} />
                        </button>
                      </td>
                    </tr>

                    {/* ⭐ INLINE EXPANDABLE FORENSIC PANEL (ONE ROW AT A TIME) ⭐ */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={12} className="p-0">
                          <div className="p-5 bg-[#080E13] border-y border-[#1C2630] space-y-4 font-mono text-xs animate-fadeIn">
                            
                            {/* 1. AI Rationale Box */}
                            <div className="p-3.5 rounded-xl bg-[#0D1318] border border-[#1C2630] flex items-start gap-3">
                              <Sparkles className="w-4 h-4 text-[#2FD9C8] shrink-0 mt-0.5 animate-pulse" />
                              <div className="space-y-1">
                                <div className="text-[10px] text-[#2FD9C8] font-bold uppercase tracking-wider flex items-center gap-2">
                                  <span>AI THREAT DETECTION RATIONALE</span>
                                  <span className="px-1.5 py-0.2 rounded bg-[#2FD9C8]/20 text-[#2FD9C8]">
                                    CONFIDENCE: {threat.rationale?.confidencePct || threat.confidencePct}%
                                  </span>
                                  <span className="text-gray-400 font-sans">| SEVERITY: {threat.severity.toUpperCase()}</span>
                                </div>
                                <p className="text-xs text-gray-200 font-sans leading-relaxed">
                                  {threat.rationale?.text}
                                </p>
                              </div>
                            </div>

                            {/* 2. Attack Kill-Chain Progression (Server-Provided Stages) */}
                            <div className="p-3.5 rounded-xl bg-[#0D1318] border border-[#1C2630] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-[#E8A23D]" />
                                  <span>ATTACK KILL-CHAIN PROGRESSION</span>
                                </span>
                                <span className="text-[10px] text-[#2FD9C8]">Related Incident: {threat.campaignLabel}</span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                                {threat.killChain.map((stg, i) => (
                                  <div
                                    key={i}
                                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                                      stg.state === 'active'
                                        ? 'bg-[#E13B3B]/15 border-[#E13B3B] text-[#E13B3B] font-bold shadow-md'
                                        : stg.state === 'completed'
                                        ? 'bg-[#11171E] border-[#2FD9C8]/40 text-[#2FD9C8] font-semibold'
                                        : 'bg-[#11171E]/50 border-gray-800 text-gray-500'
                                    }`}
                                  >
                                    <div>
                                      <div className="text-[11px] font-sans">{stg.label}</div>
                                      <div className="text-[9px] font-mono">{stg.techniqueId}</div>
                                    </div>
                                    {stg.state === 'active' && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E13B3B] text-white font-bold animate-pulse">
                                        ACTIVE
                                      </span>
                                    )}
                                    {stg.state === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-[#2FD9C8]" />}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 3. Neural Feature Weights + Flow Telemetry */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              
                              {/* Neural Feature Weights */}
                              <div className="p-3.5 rounded-xl bg-[#0D1318] border border-[#1C2630] space-y-2.5">
                                <span className="text-[10px] text-gray-400 uppercase font-bold">NEURAL FEATURE WEIGHTS</span>
                                <div className="space-y-2">
                                  {threat.featureWeights.map((f, fi) => (
                                    <div key={fi} className="space-y-1">
                                      <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-300">{f.featureName}</span>
                                        <span className="text-white font-bold">{f.displayValue}</span>
                                      </div>
                                      <div className="w-full bg-[#1C252E] h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#2FD9C8] h-full rounded-full" style={{ width: `${f.barPct}%` }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Flow Telemetry & Action Buttons */}
                              <div className="p-3.5 rounded-xl bg-[#0D1318] border border-[#1C2630] flex flex-col justify-between space-y-3">
                                <div>
                                  <span className="text-[10px] text-gray-400 uppercase font-bold">FLOW TELEMETRY</span>
                                  <div className="grid grid-cols-3 gap-2 mt-2 text-[11px]">
                                    <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                                      <span className="text-[9px] text-gray-400 block uppercase">Volume</span>
                                      <span className="text-white font-bold">{threat.flowTelemetry?.volumeBytes || '4.2 GB'}</span>
                                    </div>
                                    <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                                      <span className="text-[9px] text-gray-400 block uppercase">Packets</span>
                                      <span className="text-white font-bold">{threat.flowTelemetry?.packetCount?.toLocaleString() || '28,410'}</span>
                                    </div>
                                    <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                                      <span className="text-[9px] text-gray-400 block uppercase">Duration</span>
                                      <span className="text-white font-bold">{threat.flowTelemetry?.durationSeconds || '00:15:32'}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-[#1C2630]">
                                  <button
                                    onClick={() => setActiveView('investigation')}
                                    className="flex-1 py-2 rounded-lg bg-[#2FD9C8] hover:bg-[#51F0E3] text-gray-950 font-bold text-xs transition active:scale-95 text-center shadow-sm"
                                  >
                                    Open Deep Investigation Panel →
                                  </button>

                                  <button
                                    onClick={() => handleResolveAlert(threat.caseId)}
                                    className="px-4 py-2 rounded-lg bg-[#11171E] hover:bg-[#182026] border border-[#1C2630] hover:border-[#34D399]/50 text-gray-300 hover:text-white text-xs font-semibold transition active:scale-95"
                                  >
                                    Resolve Alert
                                  </button>
                                </div>
                              </div>

                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog for Resolve Alert */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Resolve Threat Incident?"
        message={`Are you sure you want to mark incident ${confirmDialog.caseId} as Resolved? This records the case resolution in the SOC audit log.`}
        onConfirm={executeResolveAlert}
        onCancel={() => setConfirmDialog({ isOpen: false, caseId: null })}
      />

    </div>
  );
};
