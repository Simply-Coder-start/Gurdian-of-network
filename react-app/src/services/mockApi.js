/**
 * Mock API Service
 * Implements standard passive API contract matching the dashboard specification.
 */

export const MOCK_DASHBOARD_SUMMARY = {
  threatScore: 90,
  threatScoreLabel: 'Excellent',
  activeSources: 1287,
  suspiciousCount: 12,
  latencyMs: 337,
  avgConfidencePct: 94.2,
  systemStatus: 'active',
  zeroTrustStatus: 'SYNCHRONIZED',
  detectionEngine: {
    name: 'Deep Flow Neural Model v4.2.1',
    version: '4.2.1',
    inferencesPerSec: 1482
  },
  defenseRuleStatus: {
    name: 'Zero-Trust Isolation Active',
    description: 'Passive Tap Mirror Enforced',
    enforced: true
  },
  primaryAiClassification: {
    title: 'Anomalous Data Exfiltration',
    severity: 'critical',
    confidencePct: 94.2,
    description: '4.2 GB payload surge dispatched to unrated external endpoint 194.26.29.112 outside standard operational window.',
    volumeDeviation: '+840%',
    byteEntropy: '7.82 bits/B',
    iocMatch: 'APT-29 CobaltStrike Profile'
  }
};

export const MOCK_ALERTS = [
  {
    id: 'FLOW-001245',
    timestamp: '2026-08-31T07:15:22Z',
    threatClass: 'data_exfiltration',
    title: 'Anomalous Data Exfiltration',
    severity: 'critical',
    confidencePct: 94.2,
    sourceIp: '10.240.12.84',
    destIp: '194.26.29.112',
    anomalyScorePct: 94.2,
    evidence: ['Outbound volume delta +840%', 'Unseen external destination ASN', 'Off-hours session start'],
    mitreTechniqueId: 'T1048',
    mitreTechniqueLabel: 'Exfil via Web Service',
    timeAgo: '2m ago',
    status: 'Open'
  },
  {
    id: 'FLOW-001244',
    timestamp: '2026-08-31T07:11:05Z',
    threatClass: 'dga_dns_tunneling',
    title: 'DNS Tunneling Payload Detected',
    severity: 'high',
    confidencePct: 88.7,
    sourceIp: '10.240.8.19',
    destIp: '8.8.8.8',
    anomalyScorePct: 88.7,
    evidence: ['High Base64 entropy in subdomains', 'Excessive TXT record query rate (28/s)'],
    mitreTechniqueId: 'T1071.004',
    mitreTechniqueLabel: 'DNS Transport',
    timeAgo: '6m ago',
    status: 'Investigating'
  },
  {
    id: 'FLOW-001243',
    timestamp: '2026-08-31T07:03:18Z',
    threatClass: 'recon_portscan',
    title: 'Lateral Movement via SMBv1',
    severity: 'high',
    confidencePct: 82.1,
    sourceIp: '192.168.4.11',
    destIp: '192.168.4.2',
    anomalyScorePct: 82.1,
    evidence: ['Deprecated SMBv1 dialect negotiation', 'IPC$ admin share access probe'],
    mitreTechniqueId: 'T1021.002',
    mitreTechniqueLabel: 'SMB Shares',
    timeAgo: '14m ago',
    status: 'Open'
  },
  {
    id: 'FLOW-001242',
    timestamp: '2026-08-31T06:55:00Z',
    threatClass: 'recon_portscan',
    title: 'Credential Spraying Cluster',
    severity: 'medium',
    confidencePct: 67.4,
    sourceIp: '185.220.101.5',
    destIp: '10.0.0.5',
    anomalyScorePct: 67.4,
    evidence: ['Distributed authentication failures', 'Staggered 12s pacing delay'],
    mitreTechniqueId: 'T1110.003',
    mitreTechniqueLabel: 'Password Spraying',
    timeAgo: '22m ago',
    status: 'Resolved'
  },
  {
    id: 'FLOW-001241',
    timestamp: '2026-08-31T06:32:44Z',
    threatClass: 'recon_portscan',
    title: 'Port Scan Probe Matrix',
    severity: 'suspicious',
    confidencePct: 41.2,
    sourceIp: '45.155.205.233',
    destIp: '10.240.0.0/24',
    anomalyScorePct: 41.2,
    evidence: ['Horizontal TCP SYN sweep across DMZ top 100 ports'],
    mitreTechniqueId: 'T1046',
    mitreTechniqueLabel: 'Network Discovery',
    timeAgo: '45m ago',
    status: 'Resolved'
  }
];

export const mockApi = {
  getDashboardSummary: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DASHBOARD_SUMMARY), 50));
  },
  getAlerts: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ALERTS), 50));
  }
};
