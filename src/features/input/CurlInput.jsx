import React, { useState, useEffect } from 'react';
import { useCurl } from '../../context/CurlContext';
import { Database, Wand2 } from 'lucide-react';

export default function CurlInput() {
  const { state, dispatch, actions } = useCurl();
  const [localInput, setLocalInput] = useState(state.rawInput);

  useEffect(() => {
    setLocalInput(state.rawInput);
  }, [state.rawInput]);

  const handleChange = (e) => {
    setLocalInput(e.target.value);
    dispatch({ type: actions.SET_RAW_INPUT, payload: e.target.value });
  };

  const handleParse = () => {
    dispatch({ type: actions.PARSE_INPUT });
  };

  return (
    <div className="glass-panel curl-input-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Database size={16} />
          <h2 style={{ fontWeight: 800, fontSize: '0.875rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Raw cURL Input</h2>
        </div>
        <button
          onClick={handleParse}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem' }}
        >
          <Wand2 size={14} />
          <span>Parse</span>
        </button>
      </div>

      <div style={{ flex: 1, padding: '1rem' }}>
        <textarea
          value={localInput}
          onChange={handleChange}
          placeholder="Paste your cURL command here..."
          style={{
            height: '100%',
            resize: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
            background: 'var(--bg-secondary)',
            border: 'none', // Remove border for clean look inside panel
            color: 'var(--text-primary)',
            padding: '0'
          }}
          spellCheck="false"
        />
      </div>
    </div>
  );
}
