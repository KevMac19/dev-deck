import React from 'react';
import { useCurl } from '../../../../context/CurlContext';

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
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
          Auth Type
        </label>
        <select
          value={auth.type}
          onChange={(e) => updateAuth({ type: e.target.value })}
          className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm font-bold focus:border-border-focus transition-colors appearance-none"
        >
          <option value="none">No Auth</option>
          <option value="basic">Basic Auth</option>
          <option value="bearer">Bearer Token</option>
        </select>
      </div>

      {auth.type === 'basic' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={auth.username}
              onChange={(e) => updateAuth({ username: e.target.value })}
              placeholder="admin"
              className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm focus:border-border-focus transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="text" // using text for visibility in editor, could be password
              value={auth.password}
              onChange={(e) => updateAuth({ password: e.target.value })}
              placeholder="password"
              className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm focus:border-border-focus transition-colors"
            />
          </div>
        </div>
      )}

      {auth.type === 'bearer' && (
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
            Token
          </label>
          <input
            type="text"
            value={auth.token}
            onChange={(e) => updateAuth({ token: e.target.value })}
            placeholder="eyJh..."
            className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm font-mono focus:border-border-focus transition-colors"
          />
        </div>
      )}
    </div>
  );
}
