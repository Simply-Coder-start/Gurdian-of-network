import React, { useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Database,
  Server,
  FileText,
  Loader2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radio,
  Layers,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Shield,
  Clock,
  Play,
  Check,
  XCircle,
  HardDrive,
  Cpu
} from 'lucide-react';

export const SystemStatesView = () => {
  // Edge simulation states: 'nominal', 'db-offline', 'backend-failover', 'ml-degraded', 'buffer-sync'
  const [activeState, setActiveState] = useState('nominal');
  const [runningTest, setRunningTest] = useState(null);
  const [testResults, setTestResults] = useState({});

  const handleRunTest = (testId) => {
    setRunningTest(testId);
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [testId]: 'PASSED' }));
      setRunningTest(null);
    }, 600);
  };

  // Dynamic component status based on simulated edge state
  const getComponentStatus = (compId) => {
    if (activeState === 'nominal') return { status: 'HEALTHY', color: 'text-healthy', border: 'border-healthy/40' };
    if (activeState === 'db-offline') {
      if (compId === 'db') return { status: 'OFFLINE', color: 'text-error', border: 'border-error/50', msg: 'Connection Refused' };
      if (compId === 'alert') return { status: 'DEGRADED', color: 'text-warning', border: 'border-warning/40', msg: 'Local Queue Only' };
    }
    if (activeState === 'backend-failover') {
      if (compId === 'backend') return { status: 'FAILOVER', color: 'text-warning', border: 'border-warning/40', msg: 'Electing Secondary' };
    }
    if (activeState === 'ml-degraded') {
      if (compId === 'ml') return { status: 'DEGRADED', color: 'text-warning', border: 'border-warning/40', msg: 'Inference Latency 84ms' };
    }
    if (activeState === 'buffer-sync') {
      if (compId === 'db') return { status: 'SYNCING', color: 'text-primary', border: 'border-primary/40', msg: 'Flushing Buffer (84%)' };
    }
    return { status: 'HEALTHY', color: 'text-healthy', border: 'border-[#1C2630]' };
  };

  return (
    <div className="pt-20 px-6 pb-8 space-y-6 select-none text-white min-h-full bg-[#070A0D]">
      
      {/* 1. Header & State Simulator Switcher */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              Diagnostics &amp; System States
            </h1>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>LIVE FAILOVER CONSOLE</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Component dependency topology, edge state simulators, local ring buffer telemetry, and automated recovery workflows.
          </p>
        </div>

        {/* State Simulator Pills */}
        <div className="flex flex-wrap items-center bg-[#0D1318] p-1 rounded-lg border border-[#1C2630] text-xs font-mono gap-1">
          {[
            { id: 'nominal', label: 'Nominal Healthy' },
            { id: 'db-offline', label: 'DB Offline' },
            { id: 'backend-failover', label: 'Backend Failover' },
            { id: 'ml-degraded', label: 'ML Degraded' },
            { id: 'buffer-sync', label: 'Buffer Syncing' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setActiveState(st.id)}
              className={`px-3 py-1 rounded font-medium transition ${
                activeState === st.id
                  ? 'bg-primary text-gray-950 font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top Summary KPI Cards (Buffer, Drop Rate, Recovery) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        
        {/* Card 1: Active System State */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">System State</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xl font-bold font-sans text-white uppercase">
            {activeState === 'nominal' ? 'Nominal Cluster' : activeState.replace('-', ' ')}
          </div>
          <div className="text-[10px] text-gray-400">
            {activeState === 'nominal' ? 'All 6 microservices operational' : 'Simulating degraded failover condition'}
          </div>
        </div>

        {/* Card 2: Telemetry Buffer Status ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Local Ring Buffer</span>
            <HardDrive className="w-4 h-4 text-primaryContainer" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {activeState === 'db-offline' ? '48,290' : '18,420'}
            </span>
            <span className="text-[10px] text-gray-400">events ({activeState === 'db-offline' ? '9.6%' : '3.6%'})</span>
          </div>
          <div className="w-full bg-[#11171E] h-1.5 rounded-full overflow-hidden border border-[#1C2630]">
            <div className={`h-full rounded-full ${activeState === 'db-offline' ? 'bg-warning w-[9.6%]' : 'bg-primary w-[3.6%]'}`} />
          </div>
        </div>

        {/* Card 3: Data Loss Monitor ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Data Loss Monitor</span>
            <CheckCircle2 className="w-4 h-4 text-healthy" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-healthy">0.00%</span>
            <span className="text-[10px] text-gray-400">drops</span>
          </div>
          <div className="text-[10px] text-gray-400">
            14.28M pkts received • 100% processed
          </div>
        </div>

        {/* Card 4: Bottleneck Latency Status ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-4 shadow-sm space-y-1.5">
          <div className="flex justify-between items-center text-[10px] text-gray-400">
            <span className="uppercase">Bottleneck Detection</span>
            <Zap className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-xl font-bold text-white">
            {activeState === 'ml-degraded' ? 'ML INFERENCE (84ms)' : 'NOMINAL (< 35ms)'}
          </div>
          <div className="text-[10px] text-gray-400">
            {activeState === 'ml-degraded' ? 'Queue backpressure flagged' : 'Zero pipeline bottlenecks detected'}
          </div>
        </div>

      </div>

      {/* 3. ① COMPONENT DEPENDENCY MAP ⭐ */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5 text-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="font-bold uppercase tracking-wider text-white">
              End-to-End Component Dependency Map
            </h2>
          </div>
          <span className="text-[10px] text-gray-400">Unidirectional Data Pipeline</span>
        </div>

        {/* Dependency Flow Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
          
          {/* Node 1: Sensor */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('sensor').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">01. SENSOR</span>
              <span className={`font-bold ${getComponentStatus('sensor').color}`}>{getComponentStatus('sensor').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">Optical TAP Mirror</div>
            <div className="text-[10px] text-gray-400">86.4k pkts/s • 0.4ms</div>
          </div>

          {/* Node 2: Ingestion */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('ingest').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">02. INGESTION</span>
              <span className={`font-bold ${getComponentStatus('ingest').color}`}>{getComponentStatus('ingest').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">eBPF Ring Buffer</div>
            <div className="text-[10px] text-gray-400">1,482 flows/s • 18ms</div>
          </div>

          {/* Node 3: Core Backend */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('backend').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">03. BACKEND</span>
              <span className={`font-bold ${getComponentStatus('backend').color}`}>{getComponentStatus('backend').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">Core Orchestrator</div>
            <div className="text-[10px] text-gray-400">RPC Gateway • 8.1ms</div>
          </div>

          {/* Node 4: ML Engine */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('ml').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">04. ML ENGINE</span>
              <span className={`font-bold ${getComponentStatus('ml').color}`}>{getComponentStatus('ml').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">Deep Flow Classifier</div>
            <div className="text-[10px] text-gray-400">{activeState === 'ml-degraded' ? '84.3ms (Degraded)' : '1.2ms (Active)'}</div>
          </div>

          {/* Node 5: Telemetry DB */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('db').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">05. DATABASE</span>
              <span className={`font-bold ${getComponentStatus('db').color}`}>{getComponentStatus('db').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">Timescale Cluster</div>
            <div className="text-[10px] text-gray-400">{activeState === 'db-offline' ? 'Offline (Buffering)' : '18.2 MB/s • 4.2ms'}</div>
          </div>

          {/* Node 6: Alert Engine */}
          <div className={`p-3 bg-[#11171E] border rounded-lg space-y-1.5 ${getComponentStatus('alert').border}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-400">06. ALERTING</span>
              <span className={`font-bold ${getComponentStatus('alert').color}`}>{getComponentStatus('alert').status}</span>
            </div>
            <div className="font-bold text-white text-xs font-sans">MITRE Rules Engine</div>
            <div className="text-[10px] text-gray-400">140 Rules Active</div>
          </div>

        </div>
      </div>

      {/* 4. 2-Column Grid: Incident Impact Analysis & 4-Stage Recovery Tracker ⭐ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-mono text-xs">
        
        {/* Incident Impact Analysis Matrix ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <h3 className="font-bold uppercase tracking-wider text-white">
                Incident Impact &amp; Resiliency Matrix
              </h3>
            </div>
            <span className="text-[10px] text-gray-400">Failover Isolation</span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <span className="text-gray-200">Live Traffic Ingress Sniffing</span>
              <span className="text-healthy font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> <span>ACTIVE (100% Intact)</span>
              </span>
            </div>

            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <span className="text-gray-200">Local Ring Buffer Telemetry</span>
              <span className="text-healthy font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> <span>ACTIVE (Buffering Locally)</span>
              </span>
            </div>

            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <span className="text-gray-200">Real-Time In-Memory Alert Generation</span>
              <span className="text-healthy font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> <span>ACTIVE (Zero Drop)</span>
              </span>
            </div>

            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <span className="text-gray-200">Historical Telemetry DB Queries</span>
              {activeState === 'db-offline' ? (
                <span className="text-error font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> <span>OFFLINE (Pending Reconnect)</span>
                </span>
              ) : (
                <span className="text-healthy font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> <span>ACTIVE (4.2ms)</span>
                </span>
              )}
            </div>

            <div className="p-2.5 bg-[#11171E] rounded-lg border border-[#1C2630] flex items-center justify-between">
              <span className="text-gray-200">Neural Network Model Inference</span>
              {activeState === 'ml-degraded' ? (
                <span className="text-warning font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> <span>DEGRADED (High Latency)</span>
                </span>
              ) : (
                <span className="text-healthy font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> <span>ACTIVE (1,482/s)</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4-Stage Recovery Progress Tracker ⭐ */}
        <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-bold uppercase tracking-wider text-white">
                Automated Recovery Progress
              </h3>
            </div>
            <span className="text-[10px] text-primary font-bold">RECOVERY ENGINE</span>
          </div>

          <div className="space-y-2">
            {[
              { num: '01', title: 'Socket Reconnection Probe', desc: 'Continuous TCP handshake retry loop', done: true },
              { num: '02', title: 'Connection Pool Re-Established', desc: 'PostgreSQL connection pool verified', done: activeState !== 'db-offline' },
              { num: '03', title: 'Local Buffer Flushing & Sync', desc: '18,420 queued events dispatched to DB partition', done: activeState === 'nominal' || activeState === 'buffer-sync', active: activeState === 'buffer-sync' },
              { num: '04', title: 'Fully Synchronized State', desc: 'Live stream and database reconciled', done: activeState === 'nominal' }
            ].map(step => (
              <div
                key={step.num}
                className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  step.done
                    ? 'bg-[#11171E] border-healthy/40 text-gray-200'
                    : step.active
                    ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                    : 'bg-[#11171E]/50 border-[#1C2630] text-gray-500'
                }`}
              >
                <div>
                  <div className="font-bold">{step.num}. {step.title}</div>
                  <div className="text-[10px] text-gray-400 font-sans">{step.desc}</div>
                </div>
                {step.done && <CheckCircle2 className="w-4 h-4 text-healthy" />}
                {step.active && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setActiveState('nominal')}
              className="bg-primary text-gray-950 font-bold px-3.5 py-1.5 rounded-lg text-xs hover:bg-primaryContainer transition active:scale-95 shadow-sm"
            >
              Reconcile All Services
            </button>
          </div>
        </div>

      </div>

      {/* 5. Safe Internal Diagnostics Test Panel */}
      <div className="bg-[#0D1318] border border-[#1C2630] rounded-xl p-5 shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1C2630] pb-2.5">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="font-bold uppercase tracking-wider text-white">
              Safe Internal Diagnostics Self-Tests
            </h3>
          </div>
          <span className="text-[10px] text-gray-400">Non-Intrusive Passive Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Test 1: Sensor Diode Check */}
          <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2">
            <div className="font-bold text-white">01. SPAN Diode Verification</div>
            <div className="text-[10px] text-gray-400">Verifies unidirectional optical TAP state.</div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleRunTest('diode')}
                disabled={runningTest === 'diode'}
                className="px-2.5 py-1 rounded bg-[#0D1318] hover:bg-[#151E28] border border-[#1C2630] text-primary text-[10px] font-bold"
              >
                {runningTest === 'diode' ? 'Testing...' : '▶ Run Test'}
              </button>
              <span className="text-healthy font-bold text-[10px]">{testResults['diode'] || 'Passed (0.4ms)'}</span>
            </div>
          </div>

          {/* Test 2: DB Write Check */}
          <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2">
            <div className="font-bold text-white">02. DB Write Latency</div>
            <div className="text-[10px] text-gray-400">Tests 100-row time-series insert commit.</div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleRunTest('db')}
                disabled={runningTest === 'db'}
                className="px-2.5 py-1 rounded bg-[#0D1318] hover:bg-[#151E28] border border-[#1C2630] text-primary text-[10px] font-bold"
              >
                {runningTest === 'db' ? 'Testing...' : '▶ Run Test'}
              </button>
              <span className="text-healthy font-bold text-[10px]">{testResults['db'] || 'Passed (4.2ms)'}</span>
            </div>
          </div>

          {/* Test 3: ML Inference Check */}
          <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2">
            <div className="font-bold text-white">03. ML Inference Latency</div>
            <div className="text-[10px] text-gray-400">Benchmarks single flow tensor pass.</div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleRunTest('ml')}
                disabled={runningTest === 'ml'}
                className="px-2.5 py-1 rounded bg-[#0D1318] hover:bg-[#151E28] border border-[#1C2630] text-primary text-[10px] font-bold"
              >
                {runningTest === 'ml' ? 'Testing...' : '▶ Run Test'}
              </button>
              <span className="text-healthy font-bold text-[10px]">{testResults['ml'] || 'Passed (1.2ms)'}</span>
            </div>
          </div>

          {/* Test 4: Ring Buffer Capacity */}
          <div className="p-3 bg-[#11171E] rounded-lg border border-[#1C2630] space-y-2">
            <div className="font-bold text-white">04. Buffer Overflow Margin</div>
            <div className="text-[10px] text-gray-400">Verifies &gt; 90% available buffer memory.</div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handleRunTest('buffer')}
                disabled={runningTest === 'buffer'}
                className="px-2.5 py-1 rounded bg-[#0D1318] hover:bg-[#151E28] border border-[#1C2630] text-primary text-[10px] font-bold"
              >
                {runningTest === 'buffer' ? 'Testing...' : '▶ Run Test'}
              </button>
              <span className="text-healthy font-bold text-[10px]">{testResults['buffer'] || 'Passed (0.12% depth)'}</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
