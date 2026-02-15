import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurlProvider } from './context/CurlContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import CurlTool from './features/curl/CurlTool';

// Placeholder for other tool
const JsonTool = () => (
  <div className="bg-bg-secondary border border-border rounded-sm p-4 text-text-primary font-mono text-sm">
    JSON Formatter (Proprietary Coming Soon)
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <CurlProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/curl" replace />} />
              <Route path="curl" element={<CurlTool />} />
              <Route path="json" element={<JsonTool />} />
            </Route>
          </Routes>
        </HashRouter>
      </CurlProvider>
    </ThemeProvider>
  );
}

export default App;
