import React from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const stages = [
  {
    num: 1,
    title: 'Observe',
    desc: 'Passive SPAN/TAP sensor copies traffic without injecting packets or disrupting the network.',
  },
  {
    num: 2,
    title: 'Understand',
    desc: 'Extracts packet size, flow duration, timing, entropy, JA3/JA4 hashes, and TLS characteristics.',
  },
  {
    num: 3,
    title: 'Detect',
    desc: 'ML engine scores each behavior: anomaly score, confidence, and classification.',
  },
  {
    num: 4,
    title: 'Explain',
    desc: 'SHAP-style feature contributions translated into plain language — not just a number.',
  },
  {
    num: 5,
    title: 'Correlate',
    desc: 'Groups related alerts into one incident or campaign instead of hundreds of standalone items.',
  },
  {
    num: 6,
    title: 'Investigate',
    desc: 'SOC dashboard: one place from detection to resolution, with full context.',
  },
];

export function PipelineSection() {
  const [ref, visible] = useInView({ threshold: 0.15 });
  const reducedMotion = useReducedMotion();
  const shouldAnimate = visible && !reducedMotion;

  return (
    <section id="pipeline" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
          From raw traffic to resolved incident
        </h2>
        <p className="mt-4 text-textSecondary text-lg max-w-xl">
          Six stages, one continuous pipeline. No manual hand-offs between tools.
        </p>

        {/* Pipeline stages */}
        <div ref={ref} className="mt-16 relative">
          {/* Connecting line — desktop horizontal */}
          <div className="hidden lg:block absolute top-8 left-[calc(8.33%+12px)] right-[calc(8.33%+12px)] h-px bg-hairline">
            {shouldAnimate && (
              <div className="absolute inset-0 pipeline-pulse" />
            )}
            {(reducedMotion || !visible) && (
              <div className="absolute inset-0 bg-hairline" />
            )}
          </div>

          {/* Connecting line — mobile vertical */}
          <div className="lg:hidden absolute left-5 top-4 bottom-4 w-px bg-hairline">
            {shouldAnimate && (
              <div
                className="absolute inset-0 w-px"
                style={{
                  background: 'linear-gradient(180deg, #1B222B 0%, #FF7A45 50%, #1B222B 100%)',
                  backgroundSize: '100% 200%',
                  animation: 'pipeline-pulse 2s ease-in-out forwards',
                }}
              />
            )}
          </div>

          {/* Stages */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4">
            {stages.map((stage, i) => (
              <div
                key={stage.num}
                className="relative pl-12 lg:pl-0 lg:text-center"
                style={{
                  opacity: shouldAnimate ? undefined : 1,
                  animation: shouldAnimate
                    ? `callout-fade 0.4s ease-out ${0.2 + i * 0.15}s both`
                    : undefined,
                }}
              >
                {/* Number circle */}
                <div className="w-10 h-10 rounded-full border border-hairline bg-surfaceLanding flex items-center justify-center absolute left-0 top-0 lg:relative lg:mx-auto lg:mb-4">
                  <span className="font-mono text-sm text-signal font-medium">
                    {stage.num}
                  </span>
                </div>

                <h3 className="font-display text-textPrimary font-semibold text-base mt-0.5 lg:mt-0">
                  {stage.title}
                </h3>
                <p className="mt-2 text-textSecondary text-sm leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
