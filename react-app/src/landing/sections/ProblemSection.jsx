import React from 'react';

export function ProblemSection() {
  return (
    <section id="problem" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-xl sm:text-2xl text-textPrimary leading-relaxed">
            Signature-based tools miss modified, encrypted, or unseen attacks.
          </p>
          <p className="mt-4 text-xl sm:text-2xl text-textPrimary leading-relaxed">
            High alert volume causes analysts to miss what matters (alert fatigue).
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-8">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl sm:text-3xl text-signal font-semibold">
              1,000+
            </span>
            <span className="text-textSecondary text-sm">
              alerts / day
            </span>
            <span className="text-calm text-lg mx-1">→</span>
            <span className="font-mono text-2xl sm:text-3xl text-textPrimary font-semibold">
              12
            </span>
            <span className="text-textSecondary text-sm">
              that matter
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-mono text-2xl sm:text-3xl text-signal font-semibold">
              68%
            </span>
            <span className="text-textSecondary text-sm">
              of breaches use techniques with no known signature
            </span>
          </div>
        </div>

        <p className="mt-6 text-xs text-calm font-mono">
          Illustrative figures — not claimed as customer data
        </p>
      </div>
    </section>
  );
}
