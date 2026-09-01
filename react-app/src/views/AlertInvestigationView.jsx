import React, { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Terminal,
  CheckCircle2,
  Lock,
  ArrowRight,
  Activity,
  Copy,
  Download,
  Clock,
  Sparkles,
  FileText,
  Layers,
  Globe,
  Server,
  Monitor,
  AlertTriangle,
  ExternalLink,
  Shield,
  Eye,
  Key
} from 'lucide-react';

export const AlertInvestigationView = () => {
  const [triageStatus, setTriageStatus] = useState('Open');
  const [copiedKey, setCopiedKey] = useState(null);
  const [analystNotes, setAnalystNotes] = useState(
    'Initial automated triage: Host WORKSTATION-SEC-04 flagged for high-volume off-hours egress to unclassified external S3 drop. Observed encrypted TLS archive payload matching APT-29 CobaltStrike exfiltration campaign.'
  );

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Incident Header Banner */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2 font-mono text-xs">
            <StatusBadge severity="CRITICAL" />
            <span className="text-gray-400">ID: ALT-8432F7</span>
            <span className="text-gray-500">2026-08-30 14:15:00 UTC</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/10 border border-error/30 text-error font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              <span>THREAT EVOLUTION: ESCALATING (+18%)</span>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-sans">
            ANOMALOUS DATA EXFILTRATION
          </h1>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleCopy('194.26.29.112, s3-eu-west-drop.biz, SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'all-iocs')}
            className="bg-[#11171E] hover:bg-[#151E28] border border-[#1C2630] text-gray-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-primary" />
            <span>{copiedKey === 'all-iocs' ? 'Copied IoCs!' : 'Copy IoCs'}</span>
          </button>
          
          <button
            onClick={() => setTriageStatus('Confirmed Incident')}
            className="bg-primary text-gray-950 font-bold px-4 py-1.5 rounded-lg text-xs hover:bg-primaryContainer transition active:scale-95 shadow-sm"
          >
            Confirm Incident
          </button>
        </div>
      </div>

      {/* 2. Attack Path Visualization (Source ➜ Intermediate ➜ Destination) */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-primary" />
            <span>Attack Path &amp; Ingress/Egress Vector</span>
          </span>
          <span className="text-[10px] text-primary">Protocol: TLS 1.3 (Port 443)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          
          {/* Source Node */}
          <div className="p-3 bg-[#11171E] border border-error/40 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">01. COMPROMISED HOST</span>
              <span className="text-error font-bold">SOURCE</span>
            </div>
            <div className="text-sm font-bold text-white font-sans truncate">WORKSTATION-SEC-04</div>
            <div className="text-[11px] text-primary">10.240.12.84</div>
            <div className="text-[10px] text-gray-400">Finance Subnet (VLAN 700)</div>
          </div>

          {/* Intermediate Hop */}
          <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">02. INTERNAL TRANSIT</span>
              <span className="text-warning font-semibold">INTERMEDIATE</span>
            </div>
            <div className="text-sm font-bold text-white font-sans truncate">DMZ Reverse Proxy</div>
            <div className="text-[11px] text-gray-200">10.240.4.19</div>
            <div className="text-[10px] text-gray-400">Port 443 • LACP Bond0</div>
          </div>

          {/* Destination Node */}
          <div className="p-3 bg-[#11171E] border border-error/40 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">03. EXTERNAL C2 SINK</span>
              <span className="text-error font-bold">DESTINATION</span>
            </div>
            <div className="text-sm font-bold text-white font-sans truncate">s3-eu-west-drop.biz</div>
            <div className="text-[11px] text-error font-bold">194.26.29.112</div>
            <div className="text-[10px] text-gray-400">Autonomous System AS49505</div>
          </div>

        </div>
      </div>

      {/* 3. Traffic Statistics Strip (6 Parameters) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Packets</span>
          <span className="text-base font-bold text-white">28,410</span>
        </div>
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Total Volume</span>
          <span className="text-base font-bold text-primary">4.29 GB</span>
        </div>
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Duration</span>
          <span className="text-base font-bold text-white">00:15:32</span>
        </div>
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Connections</span>
          <span className="text-base font-bold text-white">142 flows</span>
        </div>
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Data Rate</span>
          <span className="text-base font-bold text-warning">24.2 MB/s</span>
        </div>
        <div className="p-3 bg-[#0D1318] border border-[#1C2630] rounded-xl space-y-0.5">
          <span className="text-[10px] text-gray-500 uppercase block">Dest Port</span>
          <span className="text-base font-bold text-white">443 / TLS 1.3</span>
        </div>
      </div>

      {/* 4. Main 2-Column Investigation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        
        {/* LEFT 2 COLS: AI Reasoning Breakdown, Timeline, MITRE, Evidence */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* AI Reasoning Breakdown ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  AI Confidence &amp; Explainability Breakdown (94.0% Total)
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">Deep Flow Neural Model v4</span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Feature 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">Traffic Volume Deviation (Outbound Peak)</span>
                  <span className="text-error font-bold">+35% weight</span>
                </div>
                <div className="w-full bg-[#11171E] h-2 rounded-full overflow-hidden border border-[#1C2630]">
                  <div className="bg-error h-full rounded-full w-[35%]" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">Destination Anomaly &amp; Unregistered Endpoint</span>
                  <span className="text-warning font-bold">+27% weight</span>
                </div>
                <div className="w-full bg-[#11171E] h-2 rounded-full overflow-hidden border border-[#1C2630]">
                  <div className="bg-warning h-full rounded-full w-[27%]" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">Timing &amp; Off-Hours Operational Baseline</span>
                  <span className="text-primary font-bold">+18% weight</span>
                </div>
                <div className="w-full bg-[#11171E] h-2 rounded-full overflow-hidden border border-[#1C2630]">
                  <div className="bg-primary h-full rounded-full w-[18%]" />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-300">TLS Metadata &amp; High Payload Entropy (7.82 bits/B)</span>
                  <span className="text-primaryContainer font-bold">+14% weight</span>
                </div>
                <div className="w-full bg-[#11171E] h-2 rounded-full overflow-hidden border border-[#1C2630]">
                  <div className="bg-primaryContainer h-full rounded-full w-[14%]" />
                </div>
              </div>

            </div>
          </div>

          {/* Graphical Forensic Incident Timeline ⭐ */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-warning" />
                <span>Graphical Forensic Incident Timeline</span>
              </span>
              <span className="text-[10px] text-gray-500">Milestone Sequence</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { time: '-00:14:22', tag: 'PROCESS SPAWN', desc: 'Child process invoked by w3wp.exe (PID: 4920)', status: 'Initial' },
                { time: '-00:08:15', tag: 'TLS HANDSHAKE', desc: 'Outbound TLS session negotiated to 194.26.29.112:443', status: 'C2 Link' },
                { time: '-00:04:30', tag: 'DATA STAGING', desc: 'Encrypted compressed archive compiled (%TEMP%\\exfil_04.tar.gz)', status: 'Staging' },
                { time: '-00:01:03', tag: 'EXFILTRATION PEAK', desc: '4,294,967,296 bytes dispatched to remote host', status: 'Active Peak' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-warning font-bold">{item.time}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#18222C] text-primary text-[9px] font-bold">{item.tag}</span>
                    <span className="text-gray-300 font-sans text-xs">{item.desc}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MITRE ATT&CK Mapping & Threat Intelligence */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                MITRE ATT&amp;CK Framework Mapping
              </span>
              <span className="text-[10px] text-primary font-bold">TACTIC: TA0010</span>
            </div>

            <div className="p-3 bg-[#11171E] border border-[#1C2630] rounded-lg space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold text-xs">
                  T1048 - Exfiltration Over Web Service
                </span>
              </div>
              <p className="text-gray-300 font-sans text-xs pt-1 leading-relaxed">
                Adversary leveraged encrypted web protocols over standard port 443 to transfer compressed internal data archives to an external cloud sink, evading standard perimeter egress filters.
              </p>
            </div>
          </div>

          {/* IOC Panel with Quick Copy & Export */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary" />
                <span>Indicators of Compromise (IoCs)</span>
              </span>
              <span className="text-[10px] text-gray-500">Cryptographic Hashes &amp; Fingerprints</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div><span className="text-gray-400">External IP: </span><span className="text-primary font-bold">194.26.29.112</span></div>
                <button onClick={() => handleCopy('194.26.29.112', 'ip')} className="text-gray-400 hover:text-white">
                  {copiedKey === 'ip' ? 'Copied' : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div><span className="text-gray-400">Domain: </span><span className="text-primary font-bold">s3-eu-west-drop.biz</span></div>
                <button onClick={() => handleCopy('s3-eu-west-drop.biz', 'domain')} className="text-gray-400 hover:text-white">
                  {copiedKey === 'domain' ? 'Copied' : <Copy className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div className="truncate max-w-[380px]"><span className="text-gray-400">SHA256: </span><span className="text-gray-300">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span></div>
                <button onClick={() => handleCopy('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'sha')} className="text-gray-400 hover:text-white">
                  {copiedKey === 'sha' ? 'Copied' : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT 1 COL: Triage, Integrity, Related Alerts, Analyst Notes */}
        <div className="space-y-5 text-xs">
          
          {/* Alert Triage Status */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block border-b border-[#1C2630] pb-2">
              Alert Triage Status
            </span>
            <div className="space-y-1.5">
              {['Open', 'Investigating', 'Confirmed Incident', 'False Positive', 'Resolved'].map(st => (
                <label key={st} className="flex items-center gap-3 p-2 rounded-lg bg-[#11171E] hover:bg-[#141C24] border border-[#1C2630] cursor-pointer transition">
                  <input
                    type="radio"
                    name="alertStatus"
                    checked={triageStatus === st}
                    onChange={() => setTriageStatus(st)}
                    className="accent-primary"
                  />
                  <span className={triageStatus === st ? 'text-primary font-bold' : 'text-gray-300'}>{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Evidence Integrity & Cryptographic Seal */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-2.5">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block border-b border-[#1C2630] pb-2">
              Evidence Integrity
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>Evidence ID:</span> <span className="text-white">EVID-20260830-8432F7</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Cryptographic Seal:</span> <span className="text-healthy font-semibold">100% Unmodified</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Capture Interface:</span> <span className="text-primary">eth0:tap (Passive)</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1C2630] text-[10px] text-gray-500">
              🔒 Passive Sensor: Active | Read-Only | Headers Only
            </div>
          </div>

          {/* Related Campaign Alerts */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-3">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block border-b border-[#1C2630] pb-2">
              Related Alerts (Campaign APT-29)
            </span>
            <div className="space-y-2 text-[11px]">
              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div className="flex justify-between font-bold text-white">
                  <span>#ALT-8429A1</span>
                  <span className="text-warning">MEDIUM</span>
                </div>
                <div className="text-[10px] text-gray-400">Credential Spray on AD-01</div>
              </div>

              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div className="flex justify-between font-bold text-white">
                  <span>#ALT-8430B4</span>
                  <span className="text-warning">HIGH</span>
                </div>
                <div className="text-[10px] text-gray-400">SMBv1 Lateral Pivot Attempt</div>
              </div>

              <div className="p-2 bg-[#11171E] rounded border border-[#1C2630]">
                <div className="flex justify-between font-bold text-white">
                  <span>#ALT-8431C8</span>
                  <span className="text-warning">HIGH</span>
                </div>
                <div className="text-[10px] text-gray-400">DNS Tunneling Base64 Burst</div>
              </div>
            </div>
          </div>

          {/* Analyst Investigation Notes */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 space-y-2.5">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block border-b border-[#1C2630] pb-2">
              Analyst Forensic Notes
            </span>
            <textarea
              rows={4}
              value={analystNotes}
              onChange={e => setAnalystNotes(e.target.value)}
              className="w-full bg-[#11171E] border border-[#1C2630] rounded-lg p-2.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-primary resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => alert('Analyst notes saved to immutable audit trail.')}
                className="px-3 py-1 rounded bg-[#11171E] hover:bg-[#151E28] border border-[#1C2630] text-primary text-xs font-bold"
              >
                Save Notes
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
