import React from 'react';
import { useInView } from '../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';

const dotPositions = [
  { x: -60, y: -40, delay: 0 },
  { x: 50, y: -55, delay: 0.1 },
  { x: -45, y: 35, delay: 0.2 },
  { x: 70, y: 20, delay: 0.15 },
  { x: -20, y: 60, delay: 0.25 },
  { x: 55, y: 50, delay: 0.05 },
];

export function MitreCorrelationSection() {
  const [ref, visible] = useInView({ threshold: 0.3 });
  const reducedMotion = useReducedMotion();
  const shouldAnimate = visible && !reducedMotion;

  return (
    <section id="mitre-correlation" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — correlation animation */}
          <div ref={ref} className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Scattered dots that converge */}
              {dotPositions.map((dot, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-signal left-1/2 top-1/2 -ml-1.5 -mt-1.5"
                  style={
                    shouldAnimate
                      ? {
                          '--dot-x': `${dot.x}px`,
                          '--dot-y': `${dot.y}px`,
                          '--dot-delay': `${dot.delay}s`,
                          transform: `translate(${dot.x}px, ${dot.y}px)`,
                          opacity: 0.4,
                          animation: `dot-converge 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${dot.delay}s forwards`,
                        }
                      : visible
                      ? { transform: 'translate(0, 0)', opacity: 1 }
                      : { transform: `translate(${dot.x}px, ${dot.y}px)`, opacity: 0.4 }
                  }
                />
              ))}

              {/* Center label — appears after convergence */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                style={
                  shouldAnimate
                    ? {
                        opacity: 0,
                        animation: 'callout-fade 0.5s ease-out 1.4s forwards',
                      }
                    : visible
                    ? { opacity: 1 }
                    : { opacity: 0 }
                }
              >
                <div className="bg-surfaceLanding border border-signal/30 rounded-md px-4 py-2 text-center">
                  <span className="font-mono text-lg text-signal font-semibold">1</span>
                  <span className="text-textSecondary text-sm ml-1.5">incident</span>
                </div>
              </div>

              {/* Subtle ring */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-hairline"
                style={
                  shouldAnimate
                    ? { opacity: 0, animation: 'callout-fade 0.5s ease-out 1.2s forwards' }
                    : visible
                    ? { opacity: 1 }
                    : { opacity: 0 }
                }
              />
            </div>
          </div>

          {/* Right — copy */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
              Hundreds of alerts, one incident
            </h2>
            <p className="mt-4 text-textSecondary text-lg leading-relaxed">
              Detected behaviors map directly to MITRE ATT&CK tactics and techniques. Related
              alerts — matched by source, destination, timing, behavior, and threat type — get
              grouped into a single incident instead of flooding the queue with hundreds of
              standalone notifications.
            </p>
            <p className="mt-4 text-textSecondary leading-relaxed">
              Analysts investigate one coherent story, not a disconnected pile of alerts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
