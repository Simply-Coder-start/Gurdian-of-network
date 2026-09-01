import React, { useState, useEffect } from 'react';
import { useTelemetry } from './context/TelemetryContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TopologyOverviewView } from './views/TopologyOverviewView';
import { DashboardView } from './views/DashboardView';
import { ThreatsMonitoringView } from './views/ThreatsMonitoringView';
import { SystemHealthView } from './views/SystemHealthView';
import { AlertInvestigationView } from './views/AlertInvestigationView';
import { AlertsManagementView } from './views/AlertsManagementView';
import { AnalyticsIntelligenceView } from './views/AnalyticsIntelligenceView';
import { TrafficMonitorView } from './views/TrafficMonitorView';
import { SettingsView } from './views/SettingsView';
import { SystemStatesView } from './views/SystemStatesView';
import { LandingPage } from './landing/LandingPage';

function App() {
  const { activeView } = useTelemetry();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      setShowLanding(!hash || hash === '#' || hash === '#landing' || hash === '#hero' || hash === '#pipeline' || hash === '#detection' || hash === '#explainable-ai' || hash === '#mitre-correlation' || hash === '#dashboard-preview' || hash === '#system-health' || hash === '#privacy' || hash === '#problem' || hash === '#contact');
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Landing page — full screen, no sidebar/header
  if (showLanding) {
    return <LandingPage />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'topology':
        return <TopologyOverviewView />;
      case 'dashboard':
        return <DashboardView />;
      case 'threats':
        return <ThreatsMonitoringView />;
      case 'health':
        return <SystemHealthView />;
      case 'investigation':
        return <AlertInvestigationView />;
      case 'alerts':
        return <AlertsManagementView />;
      case 'analytics':
        return <AnalyticsIntelligenceView />;
      case 'traffic':
        return <TrafficMonitorView />;
      case 'settings':
        return <SettingsView />;
      case 'states':
        return <SystemStatesView />;
      default:
        return <TopologyOverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#070A0D] overflow-hidden text-gray-200">
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main App Viewport Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Fixed Translucent Glass Header (Overlays Content) */}
        <Header />

        {/* Scrollable Main Viewport (Passes Behind Header) */}
        <main className="flex-1 overflow-y-auto relative h-full scroll-smooth">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default App;
