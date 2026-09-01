import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { TelemetryProvider } from './context/TelemetryContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelemetryProvider>
      <App />
    </TelemetryProvider>
  </React.StrictMode>
);
