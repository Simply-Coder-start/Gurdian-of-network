import React from 'react';

const points = [
  {
    icon: (
      <svg className="w-5 h-5 text-calm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: 'Passive, read-only — no active probing, no packets injected into the network',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-calm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    text: 'No payload decryption required — detection works on metadata, not content',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-calm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: 'Controlled retention — configurable data lifecycle and automated purging',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-calm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    text: 'Role-based access control — audit trail for all analyst actions',
  },
];

export function PrivacySection() {
  return (
    <section id="privacy" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary tracking-tight">
            Built for trust
          </h2>
          <p className="mt-4 text-textSecondary text-lg leading-relaxed">
            Designed to complement your existing IDS/IPS and SIEM — not replace them.
            Adds behavioral visibility without increasing your attack surface.
          </p>

          <div className="mt-10 space-y-6">
            {points.map((p, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-0.5 shrink-0">{p.icon}</div>
                <p className="text-textSecondary leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
