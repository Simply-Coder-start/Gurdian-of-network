import React, { createContext, useContext, useState, useEffect } from 'react';

const TelemetryContext = createContext();

export const TelemetryProvider = ({ children }) => {
  const [riskScore, setRiskScore] = useState(90);
  const [activeSources, setActiveSources] = useState(1284);
  const [suspiciousCount, setSuspiciousCount] = useState(12);
  const [latencyMs, setLatencyMs] = useState(335);
  const [confidence, setConfidence] = useState(94.2);

  const [activeView, setActiveView] = useState('topology');
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Header filter states
  const [activeSegment, setActiveSegment] = useState('All Segments');
  const [activeZone, setActiveZone] = useState('All Regions');
  const [activeTimeRange, setActiveTimeRange] = useState('Last 24 Hours');
  const [activeModel, setActiveModel] = useState('Behaviour AI v4.2');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications & UI state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showAiSocModal, setShowAiSocModal] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      title: 'Critical Exfiltration In Progress',
      desc: '10.240.12.84 -> 194.26.29.112 (4.2 GB outside window)',
      severity: 'CRITICAL',
      time: '2m ago',
      read: false
    },
    {
      id: 'NOTIF-2',
      title: 'DNS Tunneling Payload Flagged',
      desc: 'High entropy Base64 TXT lookup rate (28/s)',
      severity: 'HIGH',
      time: '6m ago',
      read: false
    },
    {
      id: 'NOTIF-3',
      title: 'Cobalt Strike JA3 Fingerprint Match',
      desc: 'JA3 matched known malleable C2 profile',
      severity: 'HIGH',
      time: '14m ago',
      read: false
    },
    {
      id: 'NOTIF-4',
      title: 'Perimeter Shodan Port Scan Blocked',
      desc: 'SYN sweep dropped by perimeter NGFW',
      severity: 'LOW',
      time: '42m ago',
      read: true
    }
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Simulated live telemetry pulses
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMs(prev => Math.max(280, Math.min(420, prev + Math.floor(Math.random() * 15 - 7))));
      setActiveSources(prev => prev + (Math.random() > 0.6 ? 1 : Math.random() < 0.3 ? -1 : 0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [threats, setThreats] = useState([
    {
      id: 'TH-902',
      title: 'Anomalous Data Exfiltration',
      severity: 'CRITICAL',
      source: '10.240.12.84',
      dest: '194.26.29.112',
      mitre: 'T1048 - Exfil via Web Service',
      anomaly: 94.2,
      time: '2 mins ago',
      status: 'Open'
    },
    {
      id: 'TH-884',
      title: 'DNS Tunneling Payload Detected',
      severity: 'HIGH',
      source: '10.240.8.19',
      dest: '8.8.8.8',
      mitre: 'T1071.004 - DNS Transport',
      anomaly: 88.7,
      time: '6 mins ago',
      status: 'Investigating'
    },
    {
      id: 'TH-731',
      title: 'Lateral Movement via SMBv1',
      severity: 'HIGH',
      source: '192.168.4.11',
      dest: '192.168.4.2',
      mitre: 'T1021.002 - SMB Shares',
      anomaly: 82.1,
      time: '14 mins ago',
      status: 'Open'
    },
    {
      id: 'TH-612',
      title: 'Credential Spraying Cluster',
      severity: 'MEDIUM',
      source: '185.220.101.5',
      dest: '10.0.0.5',
      mitre: 'T1110.003 - Password Spraying',
      anomaly: 67.4,
      time: '22 mins ago',
      status: 'Resolved'
    },
    {
      id: 'TH-409',
      title: 'Port Scan Probe Matrix',
      severity: 'LOW',
      source: '45.155.205.233',
      dest: '10.240.0.0/24',
      mitre: 'T1046 - Network Discovery',
      anomaly: 41.2,
      time: '45 mins ago',
      status: 'Resolved'
    }
  ]);

  const [systemNodes, setSystemNodes] = useState([
    { name: 'Ingestion Pipeline', status: 'ONLINE', latency: '4.2 ms', uptime: '99.99%', cpu: 38, mem: 54 },
    { name: 'Core Backend Node', status: 'ONLINE', latency: '8.1 ms', uptime: '99.95%', cpu: 42, mem: 61 },
    { name: 'Telemetry Database', status: 'ONLINE', latency: '11.5 ms', uptime: '99.99%', cpu: 58, mem: 79 },
    { name: 'ML Anomaly Engine', status: 'DEGRADED', latency: '84.3 ms', uptime: '98.12%', cpu: 89, mem: 88 },
    { name: 'API Gateway', status: 'ONLINE', latency: '2.1 ms', uptime: '100.0%', cpu: 18, mem: 32 }
  ]);

  // Action: Trigger Refresh Data
  const triggerRefresh = () => {
    setIsRefreshing(true);
    setToastMessage('Refreshing live telemetry streams...');
    setTimeout(() => {
      setLatencyMs(Math.floor(Math.random() * 60 + 310));
      setActiveSources(prev => prev + Math.floor(Math.random() * 8 - 4));
      setIsRefreshing(false);
      setToastMessage('✓ Telemetry streams synchronized & verified!');
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  // Action: Trigger Export Data
  const triggerExport = (format = 'csv') => {
    try {
      let content = '';
      let filename = `guardian_soc_export_${Date.now()}.${format}`;
      let mimeType = 'text/plain';

      if (format === 'json') {
        content = JSON.stringify({ exportedAt: new Date().toISOString(), segment: activeSegment, region: activeZone, model: activeModel, threats, systemNodes }, null, 2);
        mimeType = 'application/json';
      } else {
        content = 'Incident ID,Title,Severity,Source IP,Dest IP,MITRE Technique,Anomaly Score,Status\n' +
          threats.map(t => `"${t.id}","${t.title}","${t.severity}","${t.source}","${t.dest}","${t.mitre}",${t.anomaly}%,"${t.status}"`).join('\n');
        mimeType = 'text/csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastMessage(`✓ Exported ${threats.length} telemetry records as ${format.toUpperCase()}`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to trigger export');
    }
  };

  // Action: Trigger Share Link
  const triggerShare = () => {
    const shareUrl = window.location.href || 'https://interface-motivated-likely-mounts.trycloudflare.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage('✓ Dashboard link copied to clipboard!');
        setTimeout(() => setToastMessage(null), 3000);
      });
    } else {
      setToastMessage('Dashboard URL: ' + shareUrl);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <TelemetryContext.Provider value={{
      riskScore, setRiskScore,
      activeSources,
      suspiciousCount,
      latencyMs,
      confidence,
      activeView, setActiveView,
      selectedNode, setSelectedNode,
      activeSegment, setActiveSegment,
      activeZone, setActiveZone,
      activeTimeRange, setActiveTimeRange,
      activeModel, setActiveModel,
      searchQuery, setSearchQuery,
      threats, setThreats,
      systemNodes, setSystemNodes,
      notifications, setNotifications,
      unreadNotificationsCount,
      isRefreshing, triggerRefresh,
      triggerExport,
      triggerShare,
      toastMessage, setToastMessage,
      showAiSocModal, setShowAiSocModal
    }}>
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
