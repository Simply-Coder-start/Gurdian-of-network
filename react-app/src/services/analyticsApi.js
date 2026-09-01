/**
 * Read-Only Analytics API Service
 * Conforms to Executive SOC Dashboard specification.
 */

export const MOCK_SUMMARY_V2 = {
  overallThreatLevel: 'high',
  activeIncidents: { count: 14, triageDelta: 2 },
  threatTrend30m: {
    velocityPct: 14,
    direction: 'increasing',
    points: [18, 16, 20, 12, 8, 4]
  },
  aiConfidence: { pct: 94.2, highConfidenceAlertPct: 88.4 },
  detectionEngine: { inferencesPerSec: 1482, latencyMs: 1.2, uptimePct: 100 },
  networkHealth: { bandwidthGbps: 1.84, activeEndpoints: 14200, drops: 0 },
  complianceStatus: {
    passiveMonitoringActive: true,
    mode: 'READ-ONLY',
    payloadInspection: 'Headers Only',
    returnPath: 'None (TAP)'
  }
};

export const MOCK_AI_INSIGHT = {
  modelName: 'Deep Flow Classifier v4',
  confidencePct: 94.2,
  explanationText: 'Outbound anomalous data exfiltration detected from host WORKSTATION-SEC-04 (10.240.12.84) to external endpoint 194.26.29.112 over TLS. Volumetric signature (4.2 GB in 180s) diverges by +840% from baseline profile.'
};

export const MOCK_ESCALATION_FORECAST = {
  riskLevel: 'high',
  riskDeltaPct: 12,
  predictedNextStage: 'Lateral RDP Probe / Credential Pivot',
  heuristicConfidencePct: 78,
  killChainStage: { current: 3, total: 5 }
};

export const MOCK_TIMELINE_EVENTS = [
  { timestamp: '14:23:44', severity: 'critical', title: 'Exfiltration Peak', sourceIp: '10.240.12.84' },
  { timestamp: '14:23:41', severity: 'high', title: 'DNS Tunneling Burst', sourceIp: '10.240.8.19' },
  { timestamp: '14:23:38', severity: 'high', title: 'Lateral SMB Probe', sourceIp: '192.168.4.11' },
  { timestamp: '14:23:30', severity: 'medium', title: 'Password Spray', sourceIp: '185.220.101.5' }
];

export const MOCK_MITRE_COVERAGE = [
  { techniqueId: 'T1048', label: 'Exfiltration Over Web', count: 4, severity: 'critical' },
  { techniqueId: 'T1071.004', label: 'DNS Transport C2', count: 3, severity: 'high' },
  { techniqueId: 'T1021.002', label: 'SMB Windows Shares', count: 2, severity: 'high' },
  { techniqueId: 'T1110.003', label: 'Password Spraying', count: 3, severity: 'medium' },
  { techniqueId: 'T1046', label: 'Network Discovery', count: 5, severity: 'medium' },
  { techniqueId: 'T1071.001', label: 'Web Protocols', count: 8, severity: 'informational' }
];

export const MOCK_THREAT_DISTRIBUTION = [
  { label: 'Exfiltration', count: 6, pct: 38, color: '#E13B3B' },
  { label: 'C2 Beaconing', count: 4, pct: 25, color: '#E8622F' },
  { label: 'DNS Tunneling', count: 3, pct: 19, color: '#E8A23D' },
  { label: 'Reconnaissance', count: 2, pct: 12, color: '#2FD9C8' },
  { label: 'DDoS / Volumetric', count: 1, pct: 6, color: '#4C8DFF' }
];

export const MOCK_TOP_SOURCES = [
  { ip: '10.240.12.84', role: 'Infected Host (Exfil)', alertCount: 6, isCrit: true },
  { ip: '185.220.101.5', role: 'External Attacker', alertCount: 3, isCrit: false },
  { ip: '192.168.4.11', role: 'Lateral Pivot', alertCount: 2, isCrit: false }
];

export const MOCK_TOP_ASSETS = [
  { hostLabel: 'SRV-PROD-ANALYTICS-01', ip: '10.240.10.14', volumeText: '4.2 GB' },
  { hostLabel: 'DC01-GLOBAL-AD', ip: '10.0.0.5', volumeText: '120 MB' },
  { hostLabel: 'GW-DMZ-PROXY-02', ip: '10.240.4.19', volumeText: '840 MB' }
];

export const MOCK_PROTOCOL_BREAKDOWN = [
  { label: 'HTTPS / TLS 1.3', pct: 68.5, volumeText: '18.4 TB', color: '#2FD9C8' },
  { label: 'gRPC / HTTP/2', pct: 18.2, volumeText: '4.9 TB', color: '#51F0E3' },
  { label: 'DNS / DoH', pct: 8.1, volumeText: '2.1 TB', color: '#E8A23D' },
  { label: 'SSH / SFTP', pct: 3.8, volumeText: '1.0 TB', color: '#8B99A5' },
  { label: 'Raw TCP / Other', pct: 1.4, volumeText: '380 GB', color: '#E13B3B' }
];

export const analyticsApi = {
  getSummaryV2: async () => Promise.resolve(MOCK_SUMMARY_V2),
  getLatestInsight: async () => Promise.resolve(MOCK_AI_INSIGHT),
  getEscalationForecast: async () => Promise.resolve(MOCK_ESCALATION_FORECAST),
  getTimeline: async () => Promise.resolve(MOCK_TIMELINE_EVENTS),
  getMitreCoverage: async () => Promise.resolve(MOCK_MITRE_COVERAGE),
  getThreatDistribution: async () => Promise.resolve(MOCK_THREAT_DISTRIBUTION),
  getTopSources: async () => Promise.resolve(MOCK_TOP_SOURCES),
  getTopAssets: async () => Promise.resolve(MOCK_TOP_ASSETS),
  getProtocolBreakdown: async () => Promise.resolve(MOCK_PROTOCOL_BREAKDOWN)
};
