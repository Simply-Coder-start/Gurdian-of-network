/**
 * Read-Only / Case-Management Incidents API Service
 * Conforms to Threat Detection Matrix specification.
 */

export const MOCK_INCIDENTS = [
  {
    id: 'FLOW-001245',
    caseId: 'TRT-1048',
    title: 'Anomalous Data Exfiltration',
    severity: 'critical',
    threatType: 'Exfiltration',
    sourceIp: '10.240.12.84',
    sourceHost: 'WORKSTATION-SEC-04',
    destIp: '194.26.29.112',
    destHost: 's3-eu-west-drop.biz',
    mitreTechniqueId: 'T1048',
    mitreTechniqueLabel: 'Exfiltration Over Web',
    eventCount: 142,
    firstSeen: '14:08:12',
    lastSeen: '14:23:44',
    anomalyScorePct: 94.2,
    confidencePct: 96.5,
    status: 'open',
    campaignLabel: 'APT-29 CobaltStrike Campaign',
    rationale: {
      text: 'High anomaly score caused by continuous high-throughput outbound TLS payload to an unclassified external endpoint outside business hours.',
      confidencePct: 96.5
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1046', state: 'completed' },
      { label: 'C2 Beaconing', techniqueId: 'T1071', state: 'completed' },
      { label: 'Lateral Movement', techniqueId: 'T1021', state: 'completed' },
      { label: 'Exfiltration', techniqueId: 'T1048', state: 'active' }
    ],
    featureWeights: [
      { featureName: 'Volume Deviation', displayValue: '+840%', barPct: 94 },
      { featureName: 'Payload Entropy', displayValue: '7.82 bits/B', barPct: 88 },
      { featureName: 'Unseen Destination IP', displayValue: 'First Observed', barPct: 92 }
    ],
    flowTelemetry: {
      volumeBytes: '4.2 GB',
      packetCount: 28410,
      durationSeconds: '00:15:32'
    }
  },
  {
    id: 'FLOW-001244',
    caseId: 'TRT-1071',
    title: 'DNS Tunneling Payload Channel',
    severity: 'high',
    threatType: 'DNS Tunneling',
    sourceIp: '10.240.8.19',
    sourceHost: 'SRV-APPS-INTERNAL',
    destIp: '8.8.8.8',
    destHost: 'dns.google',
    mitreTechniqueId: 'T1071.004',
    mitreTechniqueLabel: 'DNS Transport',
    eventCount: 840,
    firstSeen: '13:45:00',
    lastSeen: '14:21:03',
    anomalyScorePct: 88.7,
    confidencePct: 91.2,
    status: 'investigating',
    campaignLabel: 'FIN7 DNS Exfil Staging',
    rationale: {
      text: 'Burst of high-entropy Base64-encoded TXT and NULL record queries with unusual subdomain length and rapid request pacing.',
      confidencePct: 91.2
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1046', state: 'completed' },
      { label: 'C2 Beaconing', techniqueId: 'T1071.004', state: 'active' },
      { label: 'Lateral Movement', techniqueId: 'T1021', state: 'not_observed' },
      { label: 'Exfiltration', techniqueId: 'T1048', state: 'not_observed' }
    ],
    featureWeights: [
      { featureName: 'TXT Record Entropy', displayValue: '7.64 bits/B', barPct: 89 },
      { featureName: 'Subdomain Length Avg', displayValue: '54 chars', barPct: 85 },
      { featureName: 'Query Frequency', displayValue: '28 queries/s', barPct: 78 }
    ],
    flowTelemetry: {
      volumeBytes: '840 KB',
      packetCount: 4210,
      durationSeconds: '00:36:03'
    }
  },
  {
    id: 'FLOW-001243',
    caseId: 'TRT-1021',
    title: 'Lateral Movement via SMBv1',
    severity: 'high',
    threatType: 'Reconnaissance',
    sourceIp: '192.168.4.11',
    sourceHost: 'DEV-SRV-BUILD-02',
    destIp: '192.168.4.2',
    destHost: 'DC01-GLOBAL-AD',
    mitreTechniqueId: 'T1021.002',
    mitreTechniqueLabel: 'SMB Shares',
    eventCount: 94,
    firstSeen: '14:10:00',
    lastSeen: '14:22:15',
    anomalyScorePct: 82.1,
    confidencePct: 89.0,
    status: 'open',
    campaignLabel: 'Internal Pivot Attempt',
    rationale: {
      text: 'Deprecated SMBv1 protocol session attempting administrative IPC$ share enumeration with service account credentials.',
      confidencePct: 89.0
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1046', state: 'completed' },
      { label: 'C2 Beaconing', techniqueId: 'T1071', state: 'completed' },
      { label: 'Lateral Movement', techniqueId: 'T1021.002', state: 'active' },
      { label: 'Exfiltration', techniqueId: 'T1048', state: 'not_observed' }
    ],
    featureWeights: [
      { featureName: 'Deprecated Protocol', displayValue: 'SMBv1 Dialect', barPct: 88 },
      { featureName: 'Admin Share Access', displayValue: 'IPC$ / ADMIN$', barPct: 84 },
      { featureName: 'Privileged Account', displayValue: 'svc_backup_admin', barPct: 76 }
    ],
    flowTelemetry: {
      volumeBytes: '14.2 MB',
      packetCount: 820,
      durationSeconds: '00:12:15'
    }
  },
  {
    id: 'FLOW-001242',
    caseId: 'TRT-1110',
    title: 'Credential Spraying Cluster',
    severity: 'medium',
    threatType: 'Reconnaissance',
    sourceIp: '185.220.101.5',
    sourceHost: 'tor-exit-node-de',
    destIp: '10.0.0.5',
    destHost: 'AUTH-GATEWAY-01',
    mitreTechniqueId: 'T1110.003',
    mitreTechniqueLabel: 'Password Spraying',
    eventCount: 2300,
    firstSeen: '13:00:12',
    lastSeen: '13:45:30',
    anomalyScorePct: 67.4,
    confidencePct: 84.5,
    status: 'resolved',
    campaignLabel: 'External Password Sweep',
    rationale: {
      text: 'Distributed single-password attempt across 140+ active directory accounts with deliberate 12-second inter-request delay.',
      confidencePct: 84.5
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1110.003', state: 'completed' }
    ],
    featureWeights: [
      { featureName: 'Account Distribution', displayValue: '142 Users', barPct: 82 },
      { featureName: 'Jitter / Delay Pacing', displayValue: '12.4s Stagger', barPct: 74 },
      { featureName: 'Known Tor IP', displayValue: 'TOR Exit Node', barPct: 90 }
    ],
    flowTelemetry: {
      volumeBytes: '2.1 MB',
      packetCount: 4600,
      durationSeconds: '00:45:18'
    }
  },
  {
    id: 'FLOW-001241',
    caseId: 'TRT-1046',
    title: 'Port Scan Probe Matrix',
    severity: 'low',
    threatType: 'Reconnaissance',
    sourceIp: '45.155.205.233',
    sourceHost: 'scanner-cloud-shodan',
    destIp: '10.240.0.0/24',
    destHost: 'DMZ Subnet',
    mitreTechniqueId: 'T1046',
    mitreTechniqueLabel: 'Network Discovery',
    eventCount: 4200,
    firstSeen: '12:15:00',
    lastSeen: '12:35:10',
    anomalyScorePct: 41.2,
    confidencePct: 98.0,
    status: 'resolved',
    campaignLabel: 'Internet Wide Scanner',
    rationale: {
      text: 'Sequential TCP SYN probes across standard web ports with rapid reset responses.',
      confidencePct: 98.0
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1046', state: 'completed' }
    ],
    featureWeights: [
      { featureName: 'SYN Burst Rate', displayValue: '240 pkts/s', barPct: 70 },
      { featureName: 'Port Sequence', displayValue: 'Top 100 Web', barPct: 65 }
    ],
    flowTelemetry: {
      volumeBytes: '380 KB',
      packetCount: 8400,
      durationSeconds: '00:20:10'
    }
  },
  {
    id: 'FLOW-001246',
    caseId: 'TRT-1072',
    title: 'C2 Cobalt Strike Beaconing',
    severity: 'critical',
    threatType: 'C2 Beaconing',
    sourceIp: '10.0.1.56',
    sourceHost: 'WORKSTATION-FIN-02',
    destIp: '185.22.33.16',
    destHost: 'c2-listener.darkcorp-threat.org',
    mitreTechniqueId: 'T1071.001',
    mitreTechniqueLabel: 'Web Protocols C2',
    eventCount: 312,
    firstSeen: '14:00:00',
    lastSeen: '14:23:40',
    anomalyScorePct: 92.8,
    confidencePct: 97.4,
    status: 'investigating',
    campaignLabel: 'APT-29 CobaltStrike Campaign',
    rationale: {
      text: 'Highly periodic 15-second heartbeat TLS sessions with JA3 client fingerprint matching known Cobalt Strike malleable C2 profile.',
      confidencePct: 97.4
    },
    killChain: [
      { label: 'Reconnaissance', techniqueId: 'T1046', state: 'completed' },
      { label: 'C2 Beaconing', techniqueId: 'T1071.001', state: 'active' }
    ],
    featureWeights: [
      { featureName: 'Periodic Jitter', displayValue: '15s Interval', barPct: 96 },
      { featureName: 'JA3 Fingerprint Match', displayValue: 'CobaltStrike Profile', barPct: 98 },
      { featureName: 'Direct IP Cert', displayValue: 'Self-Signed', barPct: 86 }
    ],
    flowTelemetry: {
      volumeBytes: '12.4 MB',
      packetCount: 1240,
      durationSeconds: '00:23:40'
    }
  }
];

export const incidentsApi = {
  getIncidents: async () => Promise.resolve(MOCK_INCIDENTS),
  updateIncidentStatus: async (caseId, newStatus) => {
    // Pure case-management database update; zero network mitigation
    return Promise.resolve({ caseId, status: newStatus, success: true });
  }
};
