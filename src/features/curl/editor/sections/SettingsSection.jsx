import React from 'react';
import { useCurl } from '../../../../context/CurlContext';

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
    <label className="flex items-start gap-3 py-2 cursor-pointer hover:bg-bg-tertiary rounded-sm px-2 -mx-2 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-text-primary w-4 h-4 bg-bg-secondary border border-border rounded-sm custom-checkbox"
      />
      <div>
        <div className="font-bold text-sm text-text-primary">{label}</div>
        <div className="text-xs text-text-secondary mt-0.5">{description}</div>
      </div>
    </label>
  );

  return (
    <div className="flex flex-col gap-1">
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
