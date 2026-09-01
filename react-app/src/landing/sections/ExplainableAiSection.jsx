import React from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const features = [
  { label: 'High Byte Volume', value: '+0.32', width: 80 },
  { label: 'Repeated Connections', value: '+0.24', width: 60 },
  { label: 'Unusual Timing', value: '+0.18', width: 45 },
  { label: 'New Destination', value: '+0.14', width: 35 },
];

export function ExplainableAiSection() {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const reducedMotion = useReducedMotion();
  const shouldAnimate = visible && !reducedMotion;

  return (
    <section id="explainable-ai" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — copy */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
              Every score comes with a reason
            </h2>
            <p className="mt-4 text-textSecondary text-lg leading-relaxed">
              The ML engine doesn't just flag — it explains which features contributed most
              to the anomaly score, using SHAP-based feature attribution. Analysts see
              what drove the detection, not just that something triggered.
            </p>
          </div>

          {/* Right — interactive SHAP component */}
          <div ref={ref} className="bg-surfaceLanding border border-hairline rounded-lg p-6 sm:p-8">
            {/* Confidence readout */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-textSecondary text-sm">Threat Confidence</span>
              <span className="font-mono text-3xl font-semibold text-signal">
                94%
              </span>
            </div>

            {/* Feature bars */}
            <div className="space-y-5">
              {features.map((f, i) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-textSecondary text-sm">{f.label}</span>
                    <span className="font-mono text-xs text-signal">{f.value}</span>
                  </div>
                  <div className="h-2 bg-hairline rounded-full overflow-hidden">
                    <div
                      className={shouldAnimate ? 'shap-bar-animate' : ''}
                      style={{
                        '--bar-width': `${f.width}%`,
                        '--bar-delay': `${i * 0.15}s`,
                        width: !shouldAnimate && visible ? `${f.width}%` : shouldAnimate ? undefined : '0%',
                        height: '100%',
                        borderRadius: '9999px',
                        background: `linear-gradient(90deg, #FF7A45 0%, rgba(255, 122, 69, 0.4) 100%)`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-calm leading-relaxed">
              Powered by SHAP-based feature attribution — every detection includes a breakdown
              of which behavioral signals contributed most to the anomaly score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
