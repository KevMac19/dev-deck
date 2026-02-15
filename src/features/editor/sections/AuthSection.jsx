import React from 'react';
import { useCurl } from '../../../context/CurlContext';

export default function AuthSection() {
  const { state, dispatch, actions } = useCurl();
  const { auth } = state.curlData;

  const updateAuth = (updates) => {
    dispatch({
      type: actions.UPDATE_FIELD,
      payload: { auth: { ...auth, ...updates } }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label>Auth Type</label>
        <select
          value={auth.type}
          onChange={(e) => updateAuth({ type: e.target.value })}
        >
          <option value="none">No Auth</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
        </select>
      </div>

      {auth.type === 'basic' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label>Username</label>
            <input
              type="text"
              value={auth.username}
              onChange={(e) => updateAuth({ username: e.target.value })}
              placeholder="admin"
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="text" // using text for visibility in editor, could be password
              value={auth.password}
              onChange={(e) => updateAuth({ password: e.target.value })}
              placeholder="password"
            />
          </div>
        </div>
      )}

      {auth.type === 'bearer' && (
        <div>
          <label>Token</label>
          <input
            type="text"
            value={auth.token}
            onChange={(e) => updateAuth({ token: e.target.value })}
            placeholder="eyJh..."
            style={{ fontFamily: 'var(--font-mono)' }}
          />
        </div>
      )}
    </div>
  );
}
