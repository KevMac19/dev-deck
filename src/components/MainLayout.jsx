import React from 'react';
import CurlInput from '../features/input/CurlInput';
import VisualEditor from '../features/editor/VisualEditor';
import CurlPreview from '../features/preview/CurlPreview';
import { Terminal } from 'lucide-react';

export default function MainLayout() {
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header className="header">
        <div className="icon-box">
          <Terminal size={24} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Antigravity cURL Editor</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            From raw cURL to visual request builder
          </p>
        </div>
      </header>

      <div className="layout-grid">
        {/* Left Column: Input */}
        <div className="scroll-col">
          <CurlInput />
        </div>

        {/* Right Column: Visual Editor & Preview */}
        <div className="scroll-col">
          <VisualEditor />
          <CurlPreview />
        </div>
      </div>
    </div>
  );
}
