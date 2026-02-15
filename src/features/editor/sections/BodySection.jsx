import React, { useState, useEffect } from 'react';
import { useCurl } from '../../../context/CurlContext';
import { Plus, Trash2, Code2, List } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function BodySection() {
  const { state, dispatch, actions } = useCurl();
  const { body, bodyType, multipartData } = state.curlData;
  const [mode, setMode] = useState('text'); // 'text' or 'builder'
  const [kvPairs, setKvPairs] = useState([]);

  // Auto-switch to builder for multipart
  useEffect(() => {
    if (bodyType === 'multipart/form-data') {
      setMode('builder');
    }
  }, [bodyType]);

  // Sync KV local state when global body changes (only if in builder mode logic)
  // For simplicity, we parse on mode switch to Builder
  const handleModeSwitch = (newMode) => {
    if (newMode === 'builder') {
      if (bodyType === 'json') {
        try {
          const jsonInfo = JSON.parse(body || '{}');
          const pairs = [];
          Object.entries(jsonInfo).forEach(([key, value]) => {
            pairs.push({ id: uuidv4(), key, value: typeof value === 'string' ? value : JSON.stringify(value) });
          });
          setKvPairs(pairs);
        } catch (e) {
          // Fallback or error?
          setKvPairs([]);
        }
      } else if (bodyType === 'x-www-form-urlencoded') {
        const params = new URLSearchParams(body || '');
        const pairs = [];
        params.forEach((value, key) => {
          pairs.push({ id: uuidv4(), key, value });
        });
        setKvPairs(pairs);
      }
    }
    setMode(newMode);
  };

  const updateField = (payload) => {
    dispatch({ type: actions.UPDATE_FIELD, payload });
  };

  const updateKvPair = (id, field, value) => {
    const newPairs = kvPairs.map(p => p.id === id ? { ...p, [field]: value } : p);
    setKvPairs(newPairs);
    syncBodyFromKv(newPairs);
  };

  const addKvPair = () => {
    const newPairs = [...kvPairs, { id: uuidv4(), key: '', value: '' }];
    setKvPairs(newPairs);
    syncBodyFromKv(newPairs);
  };

  const removeKvPair = (id) => {
    const newPairs = kvPairs.filter(p => p.id !== id);
    setKvPairs(newPairs);
    syncBodyFromKv(newPairs);
  };

  const syncBodyFromKv = (pairs) => {
    if (bodyType === 'json') {
      const obj = {};
      pairs.forEach(p => {
        if (p.key) obj[p.key] = p.value;
      });
      updateField({ body: JSON.stringify(obj, null, 2) });
    } else if (bodyType === 'x-www-form-urlencoded') {
      const params = new URLSearchParams();
      pairs.forEach(p => {
        if (p.key) params.append(p.key, p.value);
      });
      updateField({ body: params.toString() });
    }
  };

  // Multipart handlers (direct context manipulation)
  const addMultipart = () => dispatch({ type: actions.ADD_MULTIPART });
  const updateMultipart = (id, field, value) => dispatch({ type: actions.UPDATE_MULTIPART, payload: { id, field, value } });
  const removeMultipart = (id) => dispatch({ type: actions.REMOVE_MULTIPART, payload: id });

  const renderKvEditor = (data, onUpdate, onRemove, onAdd) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {data.map(item => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => onUpdate(item.id, 'key', e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
          />
          <button
            onClick={() => onRemove(item.id)}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="btn-secondary"
        style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
      >
        <Plus size={14} /> Add Row
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <label style={{ marginBottom: 0 }}>Body Type</label>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
           {/* Mode Toggle */}
           {bodyType !== 'multipart/form-data' && (
             <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
               <button
                 onClick={() => handleModeSwitch('text')}
                 style={{
                   background: mode === 'text' ? 'var(--bg-secondary)' : 'transparent',
                   color: mode === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)',
                   border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem'
                 }}
               >
                 <Code2 size={12} /> Text
               </button>
               <button
                 onClick={() => handleModeSwitch('builder')}
                 style={{
                   background: mode === 'builder' ? 'var(--bg-secondary)' : 'transparent',
                   color: mode === 'builder' ? 'var(--text-primary)' : 'var(--text-secondary)',
                   border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem'
                 }}
               >
                 <List size={12} /> Builder
               </button>
             </div>
           )}
        </div>
      </div>

      <select
          value={bodyType || 'raw'}
          onChange={(e) => updateField({ bodyType: e.target.value })}
      >
        <option value="raw">Raw</option>
        <option value="json">JSON</option>
        <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
        <option value="multipart/form-data">multipart/form-data</option>
      </select>

      {/* Logic for Multipart - Always Builder */}
      {bodyType === 'multipart/form-data' && (
        renderKvEditor(
          multipartData || [],
          updateMultipart,
          removeMultipart,
          addMultipart
        )
      )}

      {/* Logic for Text Mode */}
      {bodyType !== 'multipart/form-data' && mode === 'text' && (
        <div style={{ position: 'relative' }}>
          <textarea
            value={body || ''}
            onChange={(e) => updateField({ body: e.target.value })}
            placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'key=value&foo=bar'}
            style={{ minHeight: '150px' }}
          />
          {bodyType === 'json' && (
             // JSON Hint
             <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>JSON</div>
          )}
        </div>
      )}

      {/* Logic for Builder Mode (Standard) */}
      {bodyType !== 'multipart/form-data' && mode === 'builder' && (
        bodyType === 'raw' ? (
          <div style={{ padding: '1rem', background: 'rgba(255,255,0,0.1)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            Builder mode not available for Raw text. Switch to text mode.
          </div>
        ) : (
          renderKvEditor(
            kvPairs,
            updateKvPair,
            removeKvPair,
            addKvPair
          )
        )
      )}
    </div>
  );
}
