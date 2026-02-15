import React from 'react';
import CurlInput from '../input/CurlInput';
import VisualEditor from '../editor/VisualEditor';
import CurlPreview from '../preview/CurlPreview';

export default function CurlTool() {
  return (
    <div className="layout-grid">
      {/* Left Column: Input */}
      <div className="scroll-col">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Raw Input</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Paste your cURL command here</p>
        </div>
        <CurlInput />
      </div>

      {/* Right Column: Visual Editor & Preview */}
      <div className="scroll-col">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Visual Builder</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Edit and preview the command</p>
        </div>
        <VisualEditor />
        <CurlPreview />
      </div>
    </div>
  );
}
