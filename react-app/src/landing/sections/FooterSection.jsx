import React from 'react';

export function FooterSection() {
  return (
    <footer id="contact" className="relative py-24 sm:py-32 border-t border-hairline">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="font-display text-2xl sm:text-3xl font-bold text-textPrimary leading-snug">
            A passive sensor that watches behavior, detects threats without signatures,
            and explains why something looks wrong.
          </p>

          <div className="mt-10">
            <a
              href="mailto:demo@guardianofnetwork.com"
              className="inline-flex items-center px-7 py-3.5 bg-signal text-ink font-display font-semibold text-base rounded-lg hover:bg-[#ff8f62] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-signal/50 focus:ring-offset-2 focus:ring-offset-ink"
            >
              Request a demo
            </a>
          </div>
        </div>

        {/* Minimal footer links */}
        <div className="mt-20 pt-8 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-display text-textPrimary font-semibold text-sm">
              Guardian of Network
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-calm">
            <a href="#hero" className="hover:text-textSecondary transition-colors">Overview</a>
            <a href="#pipeline" className="hover:text-textSecondary transition-colors">How it works</a>
            <a href="#detection" className="hover:text-textSecondary transition-colors">Detection</a>
            <a href="#dashboard-preview" className="hover:text-textSecondary transition-colors">Dashboard</a>
          </div>

          <span className="text-xs text-calm">
            © {new Date().getFullYear()} Guardian of Network
          </span>
        </div>
      </div>
    </footer>
  );
}
