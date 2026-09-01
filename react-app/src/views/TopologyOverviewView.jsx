import React, { useEffect, useState } from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import { ThreatScoreGauge } from '../components/dashboard/ThreatScoreGauge';
import { StatTileGrid } from '../components/dashboard/StatTileGrid';
import { AiClassificationCard } from '../components/dashboard/AiClassificationCard';
import { DetectionEngineCard } from '../components/dashboard/DetectionEngineCard';
import { ActiveDefenseRuleCard } from '../components/dashboard/ActiveDefenseRuleCard';
import { LiveThreatStream } from '../components/dashboard/LiveThreatStream';
import { NetworkTopology } from '../components/topology/NetworkTopology';
import { apiClient } from '../services/apiClient';
import { RefreshCw, Download, Share2 } from 'lucide-react';

export const TopologyOverviewView = () => {
  const {
    riskScore,
    activeSources,
    suspiciousCount,
    latencyMs,
    confidence,
    threats,
    setActiveView,
    isRefreshing,
    triggerRefresh,
    triggerExport,
    triggerShare
  } = useTelemetry();

  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    apiClient.getDashboardSummary().then(data => setSummaryData(data));
  }, []);

  const handleInvestigate = () => {
    setActiveView('investigation');
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Full-Width Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Threat Detection Overview
            </h1>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2FD9C8]/10 border border-[#2FD9C8]/30 text-[#2FD9C8] font-mono text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2FD9C8] animate-pulse" />
              <span>AI-SOC ACTIVE</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Real-time passive traffic telemetry, neural classification, and end-to-end network pipeline.
          </p>
        </div>

        {/* Right-Aligned Action Buttons */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={triggerRefresh}
            className="bg-[#0D1318] hover:bg-[#131B22] border border-[#1C2630] hover:border-[#2FD9C8]/40 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#2FD9C8] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          
          <button
            onClick={() => triggerExport('csv')}
            title="Export Telemetry Data (CSV)"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0D1318] hover:bg-[#131B22] text-gray-300 hover:text-white border border-[#1C2630] hover:border-[#2FD9C8]/40 transition active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={triggerShare}
            title="Share Public Link (Copy to Clipboard)"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0D1318] hover:bg-[#131B22] text-gray-300 hover:text-white border border-[#1C2630] hover:border-[#2FD9C8]/40 transition active:scale-95 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Three-Column SOC Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] xl:grid-cols-[290px_1fr_330px] gap-5">
        
        {/* LEFT RAIL: Threat Score Gauge, Stat Tiles, AI Classification Card */}
        <div className="flex flex-col gap-5">
          
          {/* Card 1: Threat Score Gauge Card */}
          <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4">
            <ThreatScoreGauge
              score={riskScore}
              maxScore={100}
              label={summaryData?.threatScoreLabel || 'Excellent'}
            />
            <StatTileGrid
              activeSources={activeSources}
              suspiciousCount={suspiciousCount}
              latencyMs={latencyMs}
              confidence={confidence}
            />
          </div>

          {/* Card 2: AI Classification Card */}
          <AiClassificationCard
            data={summaryData?.primaryAiClassification}
            onInvestigate={handleInvestigate}
          />
        </div>

        {/* CENTER PANEL: Enterprise Pipeline Diagram, Detection Engine & Active Defense Rule Cards */}
        <div className="flex flex-col gap-5">
          <NetworkTopology />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetectionEngineCard engine={summaryData?.detectionEngine} />
            <ActiveDefenseRuleCard rule={summaryData?.defenseRuleStatus} />
          </div>
        </div>

        {/* RIGHT RAIL: Live Threat Stream List */}
        <div className="flex flex-col gap-5">
          <LiveThreatStream
            threats={threats}
            onInvestigate={handleInvestigate}
          />
        </div>

      </div>
    </div>
  );
};
