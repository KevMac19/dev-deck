import React from 'react';
import { useCurl } from '../../../context/CurlContext';

export default function SettingsSection() {
  const { state, dispatch, actions } = useCurl();
  const { flags } = state.curlData;

  const updateFlags = (updates) => {
    dispatch({
      type: actions.UPDATE_FIELD,
      payload: { flags: { ...flags, ...updates } }
    });
  };

  const Checkbox = ({ label, checked, onChange, description }) => (
    <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', padding: '0.5rem 0' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: '0.25rem' }}
      />
      <div>
        <div style={{ fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{description}</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox
        label="Insecure (-k)"
        checked={flags?.insecure}
        onChange={(v) => updateFlags({ insecure: v })}
        description="Allow connections to SSL sites without certs"
      />
      <Checkbox
        label="Follow Location (-L)"
        checked={flags?.location}
        onChange={(v) => updateFlags({ location: v })}
        description="Follow redirects"
      />
      <Checkbox
        label="Compressed (--compressed)"
        checked={flags?.compressed}
        onChange={(v) => updateFlags({ compressed: v })}
        description="Request compressed response"
      />
    </div>
  );
}
