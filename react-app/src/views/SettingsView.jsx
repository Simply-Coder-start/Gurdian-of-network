import React, { useState } from 'react';
import {
  Save,
  Check,
  Shield,
  Radio,
  Sliders,
  Lock,
  HardDrive,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Activity,
  FileText,
  Key,
  Server,
  Zap
} from 'lucide-react';

export const SettingsView = () => {
  const [saved, setSaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  // Sensor Settings
  const [sensorInterface, setSensorInterface] = useState('eth0:tap');
  const [captureEngine, setCaptureEngine] = useState('ebpf');
  const [monitoredVlans, setMonitoredVlans] = useState(['VLAN 100 (WAN)', 'VLAN 200 (Perimeter)', 'VLAN 400 (K8s)', 'VLAN 700 (LAN)']);

  // Telemetry Sources
  const [sources, setSources] = useState({
    span: true,
    ipfix: true,
    sflow: false,
    zeek: true,
    ebpf: true
  });

  // Detection Modules
  const [modules, setModules] = useState({
    ddos: true,
    c2: true,
    dga: true,
    dns: true,
    portscan: true,
    exfil: true,
    unknown: true
  });

  // Thresholds
  const [criticalThreshold, setCriticalThreshold] = useState(90);
  const [highThreshold, setHighThreshold] = useState(75);
  const [mediumThreshold, setMediumThreshold] = useState(50);

  // Privacy & Inspection (100% Passive)
  const [flowMetadataOnly, setFlowMetadataOnly] = useState(true);
  const [payloadDecryption, setPayloadDecryption] = useState(false); // ALWAYS FALSE
  const [activeProbing, setActiveProbing] = useState(false); // ALWAYS FALSE
  const [hardwareDiode, setHardwareDiode] = useState(true);

  // Retention
  const [flowRetentionDays, setFlowRetentionDays] = useState('30');
  const [incidentRetentionDays, setIncidentRetentionDays] = useState('90');

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationSuccess(true);
      setTimeout(() => setValidationSuccess(false), 2500);
    }, 600);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Restore system settings to recommended SOC defaults?')) {
      setCriticalThreshold(90);
      setHighThreshold(75);
      setMediumThreshold(50);
      setFlowMetadataOnly(true);
      setPayloadDecryption(false);
      setActiveProbing(false);
      setHardwareDiode(true);
      alert('Default security settings restored.');
    }
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              System Configuration &amp; Security Controls
            </h1>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-healthy/10 border border-healthy/30 text-healthy font-mono text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CONFIGURATION VALID</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Configure passive optical sensors, ML detection modules, anomaly thresholds, privacy controls, and data retention.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={handleRestoreDefaults}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleValidate}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-primary/40 text-primary hover:text-white px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-primary" />
            <span>{isValidating ? 'Validating...' : validationSuccess ? '✓ Compatible!' : 'Validate Config'}</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-primary text-gray-950 font-bold px-4 py-1.5 rounded-lg hover:bg-primaryContainer transition flex items-center gap-1.5 active:scale-95 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>

      {/* 2. 2-Column Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* ================= LEFT COLUMN: SENSORS & PRIVACY GUARANTEES ================= */}
        <div className="space-y-6">
          
          {/* Section 1: Sensor & TAP Hardware Configuration ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Sensor &amp; TAP Hardware Configuration
                </h2>
              </div>
              <span className="text-[10px] text-healthy font-semibold">100G SPAN Mirror</span>
            </div>

            <div className="space-y-3 text-[11px]">
              <div>
                <label className="text-gray-400 block mb-1">CAPTURE INTERFACE PORT</label>
                <input
                  type="text"
                  value={sensorInterface}
                  onChange={e => setSensorInterface(e.target.value)}
                  className="w-full bg-[#11171E] border border-[#1C2630] rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">KERNEL CAPTURE ENGINE</label>
                <select
                  value={captureEngine}
                  onChange={e => setCaptureEngine(e.target.value)}
                  className="w-full bg-[#11171E] border border-[#1C2630] rounded-lg px-3 py-1.5 text-white font-mono focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="ebpf">Zero-Copy eBPF Ring Buffer (Kernel 6.8+)</option>
                  <option value="af_packet">AF_PACKET / PACKET_MMAP (Standard Linux)</option>
                  <option value="dpdk">DPDK User-Space Driver (High Throughput)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">MONITORED NETWORK SEGMENTS</label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {monitoredVlans.map(vlan => (
                    <span key={vlan} className="px-2 py-0.5 rounded bg-[#11171E] border border-primary/30 text-primary text-[10px]">
                      {vlan}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Privacy & Passive Read-Only Guarantee (Replaces DPI) ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Privacy &amp; Passive Guarantee Controls
                </h2>
              </div>
              <span className="text-[10px] text-healthy font-bold">100% PASSIVE</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg bg-[#11171E] border border-[#1C2630] cursor-pointer">
                <div>
                  <div className="font-bold text-white">Encrypted Traffic Flow &amp; Metadata Analysis</div>
                  <div className="text-[10px] text-gray-400 font-sans">Inspects packet headers, timings, and entropy without decrypting payload bodies.</div>
                </div>
                <input
                  type="checkbox"
                  checked={flowMetadataOnly}
                  onChange={e => setFlowMetadataOnly(e.target.checked)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#11171E] border border-[#1C2630] cursor-not-allowed opacity-75">
                <div>
                  <div className="font-bold text-gray-300">Payload Decryption / Deep Body Inspection</div>
                  <div className="text-[10px] text-gray-500 font-sans">Strictly disabled. System enforces zero payload retention.</div>
                </div>
                <input
                  type="checkbox"
                  checked={payloadDecryption}
                  disabled
                  className="w-4 h-4 accent-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#11171E] border border-[#1C2630] cursor-not-allowed opacity-75">
                <div>
                  <div className="font-bold text-gray-300">Active Network Probing &amp; Packet Injection</div>
                  <div className="text-[10px] text-gray-500 font-sans">Disabled. Hardware TAP diode prevents any return transmission.</div>
                </div>
                <input
                  type="checkbox"
                  checked={activeProbing}
                  disabled
                  className="w-4 h-4 accent-primary"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-[#11171E] border border-healthy/40 cursor-pointer">
                <div>
                  <div className="font-bold text-healthy">Read-Only Optical Hardware Diode Enforced</div>
                  <div className="text-[10px] text-gray-400 font-sans">Physical unidirectional optical cable prevents packet injection.</div>
                </div>
                <input
                  type="checkbox"
                  checked={hardwareDiode}
                  onChange={e => setHardwareDiode(e.target.checked)}
                  className="w-4 h-4 accent-healthy cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Telemetry Ingestion Sources */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Telemetry Ingestion Protocol Feeds
                </h2>
              </div>
              <span className="text-[10px] text-gray-400">4 Active Feeds</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {[
                { key: 'span', label: 'Optical SPAN Mirror', rate: '86.4k pkts/s' },
                { key: 'ipfix', label: 'IPFIX / NetFlow v9', rate: 'UDP :2055' },
                { key: 'zeek', label: 'Zeek Transaction Logs', rate: 'JSON Feed' },
                { key: 'ebpf', label: 'eBPF Socket Hooks', rate: 'Kernel Ring' }
              ].map(feed => (
                <label key={feed.key} className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-white block">{feed.label}</span>
                    <span className="text-[10px] text-primary">{feed.rate}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sources[feed.key]}
                    onChange={e => setSources(prev => ({ ...prev, [feed.key]: e.target.checked }))}
                    className="accent-primary cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: DETECTION MODULES & THRESHOLDS ================= */}
        <div className="space-y-6">
          
          {/* Section 4: Detection Modules (Individual Toggles) ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Neural &amp; Behavioral Detection Modules
                </h2>
              </div>
              <span className="text-[10px] text-primary font-bold">7/7 Modules Active</span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'exfil', label: 'Data Exfiltration & Volumetric Anomaly', desc: 'Flags unexpected high-entropy outbound egress bursts' },
                { key: 'c2', label: 'C2 Beaconing & Heartbeat Jitter Analysis', desc: 'Identifies periodic Command-and-Control callback channels' },
                { key: 'dns', label: 'DNS Tunneling & Encoded Payload Channel', desc: 'Detects Base64/Hex TXT/NULL record data smuggling' },
                { key: 'dga', label: 'DGA (Domain Generation Algorithm) Filter', desc: 'Flags algorithmic high-entropy domain queries' },
                { key: 'portscan', label: 'Internal Port Scan & Reconnaissance', desc: 'Tracks horizontal and vertical TCP SYN sweeps' },
                { key: 'ddos', label: 'DDoS & Volumetric Packet Floods', desc: 'Detects high-rate SYN/UDP amplification floods' },
                { key: 'unknown', label: 'Zero-Day / Unknown Anomaly Discovery', desc: 'Unsupervised clustering for novel attack patterns' }
              ].map(m => (
                <label key={m.key} className="flex items-center justify-between p-2.5 rounded-lg bg-[#11171E] hover:bg-[#141C24] border border-[#1C2630] cursor-pointer transition">
                  <div>
                    <div className="font-bold text-white text-xs">{m.label}</div>
                    <div className="text-[10px] text-gray-400 font-sans">{m.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={modules[m.key]}
                    onChange={e => setModules(prev => ({ ...prev, [m.key]: e.target.checked }))}
                    className="w-4 h-4 accent-primary cursor-pointer shrink-0 ml-3"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Section 5: Detection Severity Thresholds ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Detection Severity Thresholds
                </h2>
              </div>
              <span className="text-[10px] text-gray-400">Confidence Calibration</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-error font-bold">CRITICAL SEVERITY THRESHOLD</span>
                  <span className="text-white font-bold">&gt; {criticalThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="99"
                  value={criticalThreshold}
                  onChange={e => setCriticalThreshold(parseInt(e.target.value))}
                  className="w-full accent-error cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-warning font-bold">HIGH SEVERITY THRESHOLD</span>
                  <span className="text-white font-bold">{highThreshold}% – {criticalThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="89"
                  value={highThreshold}
                  onChange={e => setHighThreshold(parseInt(e.target.value))}
                  className="w-full accent-warning cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-primary font-bold">MEDIUM SEVERITY THRESHOLD</span>
                  <span className="text-white font-bold">{mediumThreshold}% – {highThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="74"
                  value={mediumThreshold}
                  onChange={e => setMediumThreshold(parseInt(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Data Retention Policies */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                  Data Retention &amp; Storage Window
                </h2>
              </div>
              <span className="text-[10px] text-gray-400">PostgreSQL Partitioning</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <label className="text-gray-400 block mb-1">FLOW TELEMETRY LOGS</label>
                <select
                  value={flowRetentionDays}
                  onChange={e => setFlowRetentionDays(e.target.value)}
                  className="w-full bg-[#11171E] border border-[#1C2630] rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none cursor-pointer"
                >
                  <option value="14">14 Days Rolling</option>
                  <option value="30">30 Days Rolling</option>
                  <option value="60">60 Days Rolling</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">INCIDENT PCAP HEADERS</label>
                <select
                  value={incidentRetentionDays}
                  onChange={e => setIncidentRetentionDays(e.target.value)}
                  className="w-full bg-[#11171E] border border-[#1C2630] rounded-lg px-2.5 py-1.5 text-white font-mono focus:outline-none cursor-pointer"
                >
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">180 Days</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Configuration Audit History */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <h3 className="font-bold uppercase tracking-wider text-white">Configuration Change Audit Trail</h3>
          </div>
          <span className="text-[10px] text-gray-400">Cryptographically Hashed</span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          {[
            { author: 'SO (SecOps)', time: '2026-08-30 14:10 UTC', change: 'Exfiltration Threshold calibrated', from: '80%', to: '75%' },
            { author: 'Alex R. (Triage)', time: '2026-08-30 11:22 UTC', change: 'Sensor Interface assigned', from: 'eth1', to: 'eth0:tap' },
            { author: 'System Auto-Tune', time: '2026-08-30 08:00 UTC', change: 'Confidence Cutoff updated', from: '0.70', to: '0.75' }
          ].map((log, idx) => (
            <div key={idx} className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">{log.time}</span>
                <span className="text-primary font-bold">{log.author}</span>
                <span className="text-gray-200">{log.change}</span>
              </div>
              <span className="text-gray-400">
                <span className="text-warning">{log.from}</span> ➜ <span className="text-healthy font-bold">{log.to}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
