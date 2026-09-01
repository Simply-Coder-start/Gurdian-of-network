import React from 'react';

const capabilities = [
  {
    title: 'C2 beacon detection',
    desc: 'Identifies repeated communication patterns that indicate malware calling home to a command-and-control server, even when intervals are randomized.',
    featured: true,
  },
  {
    title: 'Jitter-tolerant detection',
    desc: 'Catches periodic behavior across timescales even when attackers randomize timing to avoid simple threshold-based detection.',
    featured: false,
  },
  {
    title: 'JA3/JA4 fingerprinting',
    desc: 'Matches TLS handshake fingerprints to identify suspicious clients and servers without needing to decrypt payload.',
    featured: false,
  },
  {
    title: 'Fingerprint clustering',
    desc: 'Groups similar TLS fingerprints together, then surfaces the unusual outliers that don\'t belong to any known cluster.',
    featured: false,
  },
  {
    title: 'Unknown attack detection',
    desc: 'Detects threats by behavior — not by matching known signatures — so it catches modified, encrypted, or never-before-seen attacks.',
    featured: false,
  },
];

export function DetectionSection() {
  return (
    <section id="detection" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          Detection capabilities
        </h2>
        <p className="mt-4 text-textSecondary text-lg max-w-xl">
          Behavioral detection that works without signatures, decryption, or prior knowledge of the threat.
        </p>

        {/* Asymmetric grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Featured — C2 beacon detection (spans wider) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-lg bg-surfaceLanding border border-hairline group hover:border-signal/30 transition-colors duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-signal mt-2 shrink-0" />
              <h3 className="font-display text-xl font-semibold text-textPrimary">
                {capabilities[0].title}
              </h3>
            </div>
            <p className="text-textSecondary leading-relaxed pl-5">
              {capabilities[0].desc}
            </p>
            {/* Mini visual — repeating pulse dots */}
            <div className="mt-6 flex items-center gap-1 pl-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: i % 4 === 0 ? '#FF7A45' : '#4B5A6B',
                    opacity: i % 4 === 0 ? 0.9 : 0.3,
                  }}
                />
              ))}
              <span className="ml-3 font-mono text-xs text-calm">
                repeating interval detected
              </span>
            </div>
          </div>

          {/* Jitter-tolerant — narrow */}
          <div className="md:col-span-5 p-6 rounded-lg bg-surfaceLanding border border-hairline hover:border-hairline/60 transition-colors duration-300">
            <h3 className="font-display text-base font-semibold text-textPrimary">
              {capabilities[1].title}
            </h3>
            <p className="mt-2 text-textSecondary text-sm leading-relaxed">
              {capabilities[1].desc}
            </p>
          </div>

          {/* JA3/JA4 — medium */}
          <div className="md:col-span-5 p-6 rounded-lg bg-surfaceLanding border border-hairline hover:border-hairline/60 transition-colors duration-300">
            <h3 className="font-display text-base font-semibold text-textPrimary">
              {capabilities[2].title}
            </h3>
            <p className="mt-2 text-textSecondary text-sm leading-relaxed">
              {capabilities[2].desc}
            </p>
          </div>

          {/* Fingerprint clustering — medium */}
          <div className="md:col-span-4 p-6 rounded-lg bg-surfaceLanding border border-hairline hover:border-hairline/60 transition-colors duration-300">
            <h3 className="font-display text-base font-semibold text-textPrimary">
              {capabilities[3].title}
            </h3>
            <p className="mt-2 text-textSecondary text-sm leading-relaxed">
              {capabilities[3].desc}
            </p>
          </div>

          {/* Unknown attack detection — narrow/right */}
          <div className="md:col-span-3 p-6 rounded-lg bg-surfaceLanding border border-signal/20 hover:border-signal/40 transition-colors duration-300">
            <h3 className="font-display text-base font-semibold text-textPrimary">
              {capabilities[4].title}
            </h3>
            <p className="mt-2 text-textSecondary text-sm leading-relaxed">
              {capabilities[4].desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
