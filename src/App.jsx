import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurlProvider } from './context/CurlContext';
import DashboardLayout from './layouts/DashboardLayout';
import CurlTool from './features/curl/CurlTool';

// Placeholder for other tool
const JsonTool = () => <div className="glass-panel p-4">JSON Formatter (Proprietary Coming Soon)</div>;

function App() {
  return (
    <CurlProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/curl" replace />} />
            <Route path="curl" element={<CurlTool />} />
            <Route path="json" element={<JsonTool />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CurlProvider>
  );
}

export default App;
