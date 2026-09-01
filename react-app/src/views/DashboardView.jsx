import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { ComplianceStatusStrip } from '../components/executive/ComplianceStatusStrip';
import { ThreatLevelBadge } from '../components/executive/ThreatLevelBadge';
import { AiThreatInsightCard } from '../components/executive/AiThreatInsightCard';
import { ThreatEscalationCard } from '../components/executive/ThreatEscalationCard';
import { AttackProgressionTimeline } from '../components/executive/AttackProgressionTimeline';
import { MitreCoverageGrid } from '../components/executive/MitreCoverageGrid';
import { LabeledBarList } from '../components/executive/LabeledBarList';
import { analyticsApi } from '../services/analyticsApi';
import { getSeverityBadgeStyle } from '../utils/severity';
import {
  Shield,
  Activity,
  AlertOctagon,
  TrendingUp,
  Cpu,
  Network,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const DashboardView = () => {
  const { threats, setActiveView } = useTelemetry();
  const [summaryV2, setSummaryV2] = useState(null);
  const [insight, setInsight] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [mitreCoverage, setMitreCoverage] = useState([]);
  const [threatDistribution, setThreatDistribution] = useState([]);
  const [topSources, setTopSources] = useState([]);
  const [topAssets, setTopAssets] = useState([]);
  const [protocolBreakdown, setProtocolBreakdown] = useState([]);

  useEffect(() => {
    analyticsApi.getSummaryV2().then(setSummaryV2);
    analyticsApi.getLatestInsight().then(setInsight);
    analyticsApi.getEscalationForecast().then(setForecast);
    analyticsApi.getTimeline().then(setTimeline);
    analyticsApi.getMitreCoverage().then(setMitreCoverage);
    analyticsApi.getThreatDistribution().then(setThreatDistribution);
    analyticsApi.getTopSources().then(setTopSources);
    analyticsApi.getTopAssets().then(setTopAssets);
    analyticsApi.getProtocolBreakdown().then(setProtocolBreakdown);
  }, []);

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Page Header & Compliance Status Strip */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Executive SOC Dashboard
            </h1>
            <ThreatLevelBadge level={summaryV2?.overallThreatLevel || 'high'} />
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Global threat posture, active incidents, telemetry rates, and network bandwidth distribution.
          </p>
        </div>

        {/* Compliance Status Strip (Asserts Safe Literals) */}
        <ComplianceStatusStrip status={summaryV2?.complianceStatus} />
      </div>

      {/* 2. 5 KPI Strip Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono">
        
        {/* KPI 1: Active Incidents */}
        <div
          onClick={() => setActiveView('alerts')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-[#E8A23D]/50 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase text-[10px]">Active Incidents</span>
            <AlertOctagon className="w-4 h-4 text-[#E8A23D]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{summaryV2?.activeIncidents.count || 14}</div>
            <div className="text-[10px] text-[#E8A23D] mt-0.5">+{summaryV2?.activeIncidents.triageDelta || 2} requiring triage</div>
          </div>
        </div>

        {/* KPI 2: Threat Trend (30m Sparkline) */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase text-[10px]">Threat Trend (30m)</span>
            <TrendingUp className="w-4 h-4 text-[#E13B3B]" />
          </div>
          <div>
            <div className="h-6 w-full my-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <polyline
                  points="0,18 20,16 40,20 60,12 80,8 100,4"
                  fill="none"
                  stroke="#E13B3B"
                  strokeWidth="2.2"
                />
              </svg>
            </div>
            <div className="text-[10px] text-[#E13B3B] font-bold">
              ↑ +{summaryV2?.threatTrend30m.velocityPct || 14}% Increasing velocity
            </div>
          </div>
        </div>

        {/* KPI 3: AI Confidence */}
        <div
          onClick={() => setActiveView('analytics')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-[#2FD9C8]/50 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase text-[10px]">AI Confidence</span>
            <Sparkles className="w-4 h-4 text-[#2FD9C8]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{summaryV2?.aiConfidence.pct || 94.2}%</div>
            <div className="text-[10px] text-[#2FD9C8] mt-0.5">{summaryV2?.aiConfidence.highConfidenceAlertPct || 88.4}% high-conf alerts</div>
          </div>
        </div>

        {/* KPI 4: Detection Engine */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase text-[10px]">Detection Engine</span>
            <Cpu className="w-4 h-4 text-[#2FD9C8]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{summaryV2?.detectionEngine.inferencesPerSec.toLocaleString() || '1,482'}</div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>Latency: {summaryV2?.detectionEngine.latencyMs || 1.2}ms</span>
              <span className="text-[#34D399] font-bold">100% RT</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Network Health (Honest Drop Counter) */}
        <div
          onClick={() => setActiveView('health')}
          className="bg-[#0D1318] border border-[#1C2630] hover:border-[#34D399]/50 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-2 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="uppercase text-[10px]">Network Health</span>
            <Network className="w-4 h-4 text-[#34D399]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white font-mono">{summaryV2?.networkHealth.bandwidthGbps || 1.84} Gbps</div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>Active: {(summaryV2?.networkHealth.activeEndpoints / 1000).toFixed(1) || 14.2}k</span>
              <span className="text-[#34D399] font-bold">{summaryV2?.networkHealth.drops || 0} Drops</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Row 2: AI Threat Insight & Escalation Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AiThreatInsightCard insight={insight} />
        </div>
        <div>
          <ThreatEscalationCard forecast={forecast} />
        </div>
      </div>

      {/* 4. Row 3: Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High-Confidence Threat Stream, Attack Timeline, MITRE Techniques */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* High-Confidence Threat Stream */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#2FD9C8]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  HIGH-CONFIDENCE THREAT STREAM
                </h2>
              </div>
              <button
                onClick={() => setActiveView('alerts')}
                className="text-xs text-[#2FD9C8] hover:underline font-mono flex items-center gap-1"
              >
                <span>View All Events</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {threats.map(threat => {
                const badge = getSeverityBadgeStyle(threat.severity);
                return (
                  <div
                    key={threat.id}
                    onClick={() => setActiveView('investigation')}
                    className="p-3.5 bg-[#11171E] hover:bg-[#141C24] border border-[#1C2630] rounded-xl transition flex items-center justify-between cursor-pointer group hover:border-[#2FD9C8]/40 duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                        {badge.label}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#2FD9C8] transition truncate font-sans">
                          {threat.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 mt-0.5">
                          <span>SRC: <span className="text-[#2FD9C8]">{threat.sourceIp || threat.source}</span></span>
                          <span>→</span>
                          <span>DST: <span className="text-gray-300">{threat.destIp || threat.dest}</span></span>
                          <span className="hidden sm:inline">| {threat.mitre}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right pl-3 shrink-0 font-mono">
                      <span className="text-xs font-bold text-[#2FD9C8]">{threat.anomalyScorePct || threat.anomaly}%</span>
                      <p className="text-[10px] text-gray-500">{threat.time || threat.timeAgo}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attack Progression Timeline */}
          <AttackProgressionTimeline events={timeline} />

          {/* MITRE ATT&CK Technique Coverage */}
          <MitreCoverageGrid techniques={mitreCoverage} />

        </div>

        {/* Right 1 Col: Labeled Bar Lists (Threat Type Distribution, Top Sources/Assets, Protocol Breakdown) */}
        <div className="space-y-6">
          
          {/* Bar List 1: Threat Type Distribution */}
          <LabeledBarList
            title="THREAT TYPE DISTRIBUTION"
            items={threatDistribution}
          />

          {/* Card: Top Sources & Attacked Assets */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">TOP SOURCES &amp; ATTACKED ASSETS</h3>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Top Threat Sources</span>
                <div className="mt-1.5 space-y-1.5">
                  {topSources.map(s => (
                    <div
                      key={s.ip}
                      className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center justify-between text-[11px] hover:border-[#2FD9C8]/30 transition"
                    >
                      <div>
                        <span className={`font-bold ${s.isCrit ? 'text-[#E13B3B]' : 'text-[#2FD9C8]'}`}>{s.ip}</span>
                        <p className="text-[10px] text-gray-400 font-sans">{s.role}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/40 text-gray-300 text-[10px] font-bold">
                        {s.alertCount} alerts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2630]">
                <span className="text-[10px] text-gray-400 uppercase font-bold">Top Attacked Assets</span>
                <div className="mt-1.5 space-y-1.5">
                  {topAssets.map(a => (
                    <div
                      key={a.hostLabel}
                      className="p-2.5 rounded-lg bg-[#11171E] border border-[#1C2630] flex items-center justify-between text-[11px] hover:border-[#2FD9C8]/30 transition"
                    >
                      <div>
                        <span className="font-bold text-white font-sans">{a.hostLabel}</span>
                        <p className="text-[10px] text-gray-400">{a.ip}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#2FD9C8] font-bold">{a.volumeText}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bar List 2: Protocol Breakdown */}
          <LabeledBarList
            title="PROTOCOL BREAKDOWN"
            items={protocolBreakdown}
          />

        </div>

      </div>

    </div>
  );
};
