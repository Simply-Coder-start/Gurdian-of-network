import React from 'react';
import { HeroSection } from './sections/HeroSection';
import { ProblemSection } from './sections/ProblemSection';
import { PipelineSection } from './sections/PipelineSection';
import { DetectionSection } from './sections/DetectionSection';
import { ExplainableAiSection } from './sections/ExplainableAiSection';
import { MitreCorrelationSection } from './sections/MitreCorrelationSection';
import { DashboardPreviewSection } from './sections/DashboardPreviewSection';
import { SystemHealthSection } from './sections/SystemHealthSection';
import { PrivacySection } from './sections/PrivacySection';
import { FooterSection } from './sections/FooterSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-textPrimary overflow-x-hidden">
      {/* Sticky minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ink/80 backdrop-blur-md border-b border-hairline/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-14">
          <a href="#hero" className="flex items-center gap-2 group">
            <svg className="w-5 h-5 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span className="font-display text-textPrimary font-semibold text-sm">
              Guardian of Network
            </span>
          </a>

          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#pipeline" className="text-textSecondary hover:text-textPrimary transition-colors">
              How it works
            </a>
            <a href="#detection" className="text-textSecondary hover:text-textPrimary transition-colors">
              Detection
            </a>
            <a href="#explainable-ai" className="text-textSecondary hover:text-textPrimary transition-colors">
              Explainability
            </a>
            <a href="#dashboard-preview" className="text-textSecondary hover:text-textPrimary transition-colors">
              Dashboard
            </a>
            <a
              href="#contact"
              className="ml-2 px-4 py-1.5 bg-signal text-ink font-display font-semibold text-sm rounded-md hover:bg-[#ff8f62] transition-colors"
            >
              Request a demo
            </a>
          </div>
        </div>
      </nav>

      {/* Sections */}
      <HeroSection />
      <ProblemSection />
      <PipelineSection />
      <DetectionSection />
      <ExplainableAiSection />
      <MitreCorrelationSection />
      <DashboardPreviewSection />
      <SystemHealthSection />
      <PrivacySection />
      <FooterSection />
    </div>
  );
}
