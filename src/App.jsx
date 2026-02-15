import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurlProvider } from './context/CurlContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import CurlTool from './features/curl/CurlTool';

// Placeholder for other tool
const JsonTool = () => <div className="glass-panel p-4">JSON Formatter (Proprietary Coming Soon)</div>;

function App() {
  return (
    <ThemeProvider>
      <CurlProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/curl" replace />} />
              <Route path="curl" element={<CurlTool />} />
              <Route path="json" element={<JsonTool />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CurlProvider>
    </ThemeProvider>
  );
}

export default App;
