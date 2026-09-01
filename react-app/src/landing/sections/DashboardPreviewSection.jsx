import React from 'react';

const feedItems = [
  {
    time: '14:32:07',
    severity: 'high',
    label: 'C2 beacon — periodic HTTPS to 185.220.x.x',
    confidence: '94%',
    src: '10.0.4.22',
    dst: '185.220.x.x',
    flagged: true,
  },
  {
    time: '14:31:54',
    severity: 'medium',
    label: 'Unusual DNS query volume from endpoint',
    confidence: '78%',
    src: '10.0.2.15',
    dst: 'dns.corp',
    flagged: true,
  },
  {
    time: '14:31:41',
    severity: 'low',
    label: 'Standard TLS handshake — known CDN',
    confidence: '—',
    src: '10.0.1.8',
    dst: 'cdn.provider.com',
    flagged: false,
  },
  {
    time: '14:31:28',
    severity: 'low',
    label: 'Authenticated API call — internal service',
    confidence: '—',
    src: '10.0.3.12',
    dst: 'api.internal',
    flagged: false,
  },
  {
    time: '14:31:15',
    severity: 'low',
    label: 'Health check response — load balancer',
    confidence: '—',
    src: '10.0.0.1',
    dst: '10.0.0.5',
    flagged: false,
  },
  {
    time: '14:31:02',
    severity: 'low',
    label: 'Inbound SSH session — approved bastion',
    confidence: '—',
    src: '203.0.113.5',
    dst: '10.0.1.2',
    flagged: false,
  },
];

const severityColors = {
  high: 'bg-signal text-ink',
  medium: 'bg-signal/30 text-signal',
  low: 'bg-hairline text-calm',
};

export function DashboardPreviewSection() {
  return (
    <section id="dashboard-preview" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          One place from detection to resolution
        </h2>
        <p className="mt-4 text-textSecondary text-lg max-w-xl mb-14">
          The SOC dashboard shows real-time activity, threat context, and investigation tools
          in a single interface — no tab-switching between detection and response.
        </p>

        {/* Mock dashboard panel */}
        <div className="bg-surfaceLanding border border-hairline rounded-lg overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-hairline">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="font-mono text-xs text-textSecondary">
                Live activity feed
              </span>
            </div>
            <span className="font-mono text-xs text-calm">
              Last updated: 14:32:07
            </span>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-12 gap-2 px-5 py-2 border-b border-hairline text-xs text-calm font-mono">
            <div className="col-span-1">Time</div>
            <div className="col-span-1">Severity</div>
            <div className="col-span-5">Detection</div>
            <div className="col-span-1">Confidence</div>
            <div className="col-span-2">Source</div>
            <div className="col-span-2">Destination</div>
          </div>

          {/* Feed rows */}
          {feedItems.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 sm:grid-cols-12 gap-2 px-5 py-3 border-b border-hairline/50 transition-colors ${
                item.flagged
                  ? 'bg-signal/[0.03] hover:bg-signal/[0.06]'
                  : 'hover:bg-hairline/30'
              }`}
            >
              <div className="sm:col-span-1 font-mono text-xs text-calm">
                {item.time}
              </div>
              <div className="sm:col-span-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                    severityColors[item.severity]
                  }`}
                >
                  {item.severity}
                </span>
              </div>
              <div className={`sm:col-span-5 text-sm ${item.flagged ? 'text-textPrimary' : 'text-textSecondary'}`}>
                {item.label}
              </div>
              <div className="sm:col-span-1 font-mono text-xs text-signal">
                {item.confidence}
              </div>
              <div className="sm:col-span-2 font-mono text-xs text-calm">
                {item.src}
              </div>
              <div className="sm:col-span-2 font-mono text-xs text-calm">
                {item.dst}
              </div>
            </div>
          ))}

          {/* Mini timeline at bottom */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-calm">Attack timeline</span>
            </div>
            <div className="flex items-center gap-1 h-6">
              {Array.from({ length: 48 }).map((_, i) => {
                const isHot = i === 38 || i === 39 || i === 42;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: isHot ? '100%' : `${20 + Math.random() * 40}%`,
                      backgroundColor: isHot ? '#FF7A45' : '#4B5A6B',
                      opacity: isHot ? 0.9 : 0.2 + Math.random() * 0.15,
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[10px] text-calm">00:00</span>
              <span className="font-mono text-[10px] text-calm">now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
