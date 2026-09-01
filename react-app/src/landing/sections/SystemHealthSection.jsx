import React from 'react';

const pipelineStages = [
  { name: 'Sensor', latency: '0.2ms', health: 98 },
  { name: 'Ingestion', latency: '1.4ms', health: 100 },
  { name: 'Feature extraction', latency: '3.8ms', health: 97 },
  { name: 'ML engine', latency: '12ms', health: 99 },
  { name: 'Alert engine', latency: '2.1ms', health: 100 },
  { name: 'Database', latency: '0.8ms', health: 100 },
  { name: 'SOC UI', latency: '—', health: 100 },
];

export function SystemHealthSection() {
  return (
    <section id="system-health" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          The platform watches itself, too
        </h2>
        <p className="mt-4 text-textSecondary text-lg max-w-xl">
          Built-in observability tracks latency, drop rate, queue depth, and telemetry
          freshness across the entire pipeline — so you know the detection system is healthy,
          not just that it's running.
        </p>

        <div className="mt-12 space-y-3 max-w-2xl">
          {pipelineStages.map((stage, i) => (
            <div key={stage.name} className="flex items-center gap-4">
              <span className="text-textSecondary text-sm w-36 shrink-0">
                {stage.name}
              </span>
              <div className="flex-1 h-1.5 bg-hairline rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${stage.health}%`,
                    backgroundColor:
                      stage.health >= 99
                        ? '#4B5A6B'
                        : stage.health >= 95
                        ? '#8B98A5'
                        : '#FF7A45',
                  }}
                />
              </div>
              <span className="font-mono text-xs text-calm w-16 text-right shrink-0">
                {stage.latency}
              </span>
              {i < pipelineStages.length - 1 && (
                <span className="text-hairline text-xs hidden sm:inline">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
