import React from 'react';
import { EnterpriseNetworkTopology } from '../components/EnterpriseNetworkTopology';
import { ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-16 lg:py-28 overflow-hidden bg-ink">
      {/* Background Ambience & Cyber Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 75% 35%, rgba(81, 240, 227, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 25% 65%, rgba(255, 122, 69, 0.06) 0%, transparent 40%),
            linear-gradient(to right, #1B222B 1px, transparent 1px),
            linear-gradient(to bottom, #1B222B 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink via-transparent to-ink/70" />

      {/* Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1B222B] bg-[#12171F]/80 backdrop-blur-md w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              <span className="font-mono text-[11px] text-textSecondary uppercase tracking-wider">
                Passive Network Threat Intelligence
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold text-textPrimary leading-[1.08] tracking-tight">
              See what your network is actually doing
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-base sm:text-lg text-textSecondary leading-relaxed max-w-xl">
              A passive, read-only sensor that watches behavior instead of chasing signatures — then explains, in plain terms, why something looks wrong.
            </p>

            {/* CTA Buttons */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-7 py-3.5 bg-signal text-ink font-display font-semibold text-base rounded-lg hover:bg-[#ff8f62] transition-colors duration-200 shadow-lg shadow-signal/20 focus:outline-none focus:ring-2 focus:ring-signal/50 focus:ring-offset-2 focus:ring-offset-ink"
              >
                Request a demo
              </a>
              <a
                href="#pipeline"
                className="inline-flex items-center text-textSecondary hover:text-textPrimary font-medium transition-colors duration-200 group text-base px-2 py-3"
              >
                See how it works
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Small reassurance bullet highlights */}
            <div className="mt-10 pt-6 border-t border-[#1B222B]/80 grid grid-cols-2 gap-4 text-xs text-textSecondary font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#51F0E3]" />
                <span>Zero Inline Latency</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#51F0E3]" />
                <span>SHAP Explainable AI</span>
              </div>
            </div>

          </div>

          {/* Right Column: Realistic Enterprise SOC Topology & Flow Engine */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            <EnterpriseNetworkTopology />
          </div>

        </div>
      </div>
    </section>
  );
}
