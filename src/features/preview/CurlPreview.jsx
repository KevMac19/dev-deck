import React, { useState } from 'react';
import { useCurl } from '../../context/CurlContext';
import { Copy, Check, TerminalSquare } from 'lucide-react';

export default function CurlPreview() {
  const { state } = useCurl();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!state.generatedCurl) return;
    navigator.clipboard.writeText(state.generatedCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1.5rem', overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TerminalSquare size={16} />
          <h2 style={{ fontWeight: 800, fontSize: '0.875rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generated Command</h2>
        </div>
        <button
          onClick={handleCopy}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem' }}
          disabled={!state.generatedCurl}
        >
          {copied ? <Check size={14} className="text-green-500" style={{ color: '#22c55e' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div style={{
        padding: '1.5rem',
        background: 'var(--bg-secondary)',
        overflowX: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8125rem',
        lineHeight: '1.6',
        color: '#fff',
        minHeight: '80px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {state.generatedCurl || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>// Command output...</span>}
      </div>
    </div>
  );
}
