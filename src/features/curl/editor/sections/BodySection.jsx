import React, { useState, useEffect } from 'react';
import { useCurl } from '../../../../context/CurlContext';
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
    <div className="flex flex-col gap-2">
      {data.map(item => (
        <div key={item.id} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => onUpdate(item.id, 'key', e.target.value)}
            className="bg-bg-secondary border border-border text-text-primary rounded-sm p-2 outline-none text-xs focus:border-border-focus transition-colors"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
            className="bg-bg-secondary border border-border text-text-primary rounded-sm p-2 outline-none text-xs focus:border-border-focus transition-colors"
          />
          <button
            onClick={() => onRemove(item.id)}
            className="bg-transparent border-none text-pink-600 cursor-pointer flex items-center justify-center p-2 hover:text-pink-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="max-w-max flex items-center gap-2 py-1 px-2.5 bg-transparent border border-border text-text-secondary rounded-sm hover:border-text-primary hover:text-text-primary hover:bg-bg-tertiary transition-all text-xs font-bold uppercase cursor-pointer"
      >
        <Plus size={14} /> Add Row
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-0 uppercase tracking-wider">
            Body Type
          </label>
        </div>
        <div className="flex gap-2">
           {/* Mode Toggle */}
           {bodyType !== 'multipart/form-data' && (
             <div className="flex bg-bg-tertiary rounded-sm p-0.5">
               <button
                 onClick={() => handleModeSwitch('text')}
                 className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs cursor-pointer border-none transition-colors ${
                   mode === 'text' ? 'bg-bg-secondary text-text-primary shadow-sm' : 'bg-transparent text-text-secondary hover:text-text-primary'
                 }`}
               >
                 <Code2 size={12} /> Text
               </button>
               <button
                 onClick={() => handleModeSwitch('builder')}
                 className={`flex items-center gap-1 px-2 py-1 rounded-sm text-xs cursor-pointer border-none transition-colors ${
                   mode === 'builder' ? 'bg-bg-secondary text-text-primary shadow-sm' : 'bg-transparent text-text-secondary hover:text-text-primary'
                 }`}
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
          className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm font-bold focus:border-border-focus transition-colors appearance-none"
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
        <div className="relative">
          <textarea
            value={body || ''}
            onChange={(e) => updateField({ body: e.target.value })}
            placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'key=value&foo=bar'}
            className="w-full min-h-[150px] bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm font-mono focus:border-border-focus transition-colors resize-y leading-relaxed"
          />
          {bodyType === 'json' && (
             // JSON Hint
             <div className="absolute bottom-4 right-4 text-xs font-bold text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded-sm uppercase tracking-wider pointer-events-none">
               JSON
             </div>
          )}
        </div>
      )}

      {/* Logic for Builder Mode (Standard) */}
      {bodyType !== 'multipart/form-data' && mode === 'builder' && (
        bodyType === 'raw' ? (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-sm text-yellow-500/90 font-medium">
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
