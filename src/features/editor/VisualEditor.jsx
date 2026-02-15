import React, { useState } from 'react';
import { useCurl } from '../../context/CurlContext';
import {
  Trash2, Plus, Settings2, ShieldCheck,
  FileJson, List, ChevronDown, ChevronRight
} from 'lucide-react';
import AuthSection from './sections/AuthSection';
import BodySection from './sections/BodySection';
import SettingsSection from './sections/SettingsSection';

const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid var(--border-color)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0.75rem 0',
          background: isOpen ? 'var(--bg-tertiary)' : 'none', // Active state bg
          border: 'none',
          color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
          cursor: 'pointer',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          paddingLeft: isOpen ? '0.75rem' : '0', // Indent on active
          transition: 'all 0.1s'
        }}
      >
        <span style={{ marginRight: '0.5rem', opacity: 0.5 }}>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {Icon && <Icon size={16} style={{ marginRight: '0.75rem' }} />}
        <span style={{ flex: 1, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>{title}</span>
      </button>
      {isOpen && <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>{children}</div>}
    </div>
  );
};

export default function VisualEditor() {
  const { state, dispatch, actions } = useCurl();
  const { curlData } = state;

  const handleUpdate = (field, value) => {
    dispatch({ type: actions.UPDATE_FIELD, payload: { [field]: value } });
  };

  return (
    <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
        <h2 style={{ fontWeight: 800, fontSize: '0.875rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Builder // Configuration</h2>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* General Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label>Method</label>
            <select
              value={curlData.method}
              onChange={(e) => handleUpdate('method', e.target.value)}
              style={{ fontWeight: 600 }}
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label>Endpoint URL</label>
            <input
              type="text"
              value={curlData.url}
              onChange={(e) => handleUpdate('url', e.target.value)}
              placeholder="https://api.example.com/v1/resource"
            />
          </div>
        </div>

        {/* Sections */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <Section title="Authentication" icon={ShieldCheck}>
                <AuthSection />
            </Section>

            <Section title="Headers" icon={List} defaultOpen={true}>
                <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ margin: 0 }}>Request Headers list</label>
                    <button
                    onClick={() => dispatch({ type: actions.ADD_HEADER })}
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                    <Plus size={12} /> ADD
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {curlData.headers.map(header => (
                    <div key={header.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 28px', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                        type="text"
                        placeholder="KEY"
                        value={header.key}
                        onChange={(e) => dispatch({ type: actions.UPDATE_HEADER, payload: { id: header.id, field: 'key', value: e.target.value } })}
                        />
                        <input
                        type="text"
                        placeholder="VALUE"
                        value={header.value}
                        onChange={(e) => dispatch({ type: actions.UPDATE_HEADER, payload: { id: header.id, field: 'value', value: e.target.value } })}
                        />
                        <button
                        onClick={() => dispatch({ type: actions.REMOVE_HEADER, payload: header.id })}
                        style={{ background: 'transparent', border: 'none', color: '#db2777', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
                        >
                        <Trash2 size={14} />
                        </button>
                    </div>
                    ))}
                    {curlData.headers.length === 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', padding: '0.75rem', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                        NO HEADERS CONFIGURED
                    </div>
                    )}
                </div>
                </div>
            </Section>

            <Section title="Request Body" icon={FileJson}>
                <BodySection />
            </Section>

            <Section title="Settings" icon={Settings2}>
                <SettingsSection />
            </Section>
        </div>
      </div>
    </div>
  );
}
