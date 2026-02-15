import React, { useState } from 'react';
import { useCurl } from '../../../context/CurlContext';
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
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center w-full py-3 text-left bg-transparent border-none cursor-pointer transition-all ${
          isOpen ? 'bg-bg-tertiary text-text-primary pl-3' : 'text-text-secondary pl-0'
        }`}
      >
        <span className="mr-2 opacity-50">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
        {Icon && <Icon size={16} className="mr-3" />}
        <span className="flex-1 text-xs font-bold uppercase tracking-wider font-mono">{title}</span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-border bg-bg-secondary">
          {children}
        </div>
      )}
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
    <div className="bg-bg-secondary border border-border rounded-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-tertiary">
        <h2 className="font-extrabold text-sm m-0 uppercase tracking-widest text-text-primary">
          Builder // Configuration
        </h2>
      </div>

      <div className="p-6">
        {/* General Section */}
        <div className="grid grid-cols-[100px_1fr] gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
              Method
            </label>
            <select
              value={curlData.method}
              onChange={(e) => handleUpdate('method', e.target.value)}
              className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm font-bold focus:border-border-focus transition-colors appearance-none"
            >
              {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">
              Endpoint URL
            </label>
            <input
              type="text"
              value={curlData.url}
              onChange={(e) => handleUpdate('url', e.target.value)}
              placeholder="https://api.example.com/v1/resource"
              className="w-full bg-bg-secondary border border-border text-text-primary rounded-sm p-3 outline-none text-sm focus:border-border-focus transition-colors"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="border border-border rounded-sm">
            <Section title="Authentication" icon={ShieldCheck}>
                <AuthSection />
            </Section>

            <Section title="Headers" icon={List} defaultOpen={true}>
                <div>
                  <div className="flex justify-between items-center mb-3">
                      <label className="m-0 text-xs font-bold text-text-secondary uppercase tracking-wider">
                        Request Headers list
                      </label>
                      <button
                        onClick={() => dispatch({ type: actions.ADD_HEADER })}
                        className="flex items-center gap-1 py-1 px-2 bg-transparent border border-border text-text-secondary rounded-sm hover:border-text-primary hover:text-text-primary hover:bg-bg-tertiary transition-all text-xs font-bold uppercase cursor-pointer"
                      >
                        <Plus size={12} /> ADD
                      </button>
                  </div>
                  <div className="flex flex-col gap-2">
                      {curlData.headers.map(header => (
                      <div key={header.id} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center">
                          <input
                            type="text"
                            placeholder="KEY"
                            value={header.key}
                            onChange={(e) => dispatch({ type: actions.UPDATE_HEADER, payload: { id: header.id, field: 'key', value: e.target.value } })}
                            className="bg-bg-secondary border border-border text-text-primary rounded-sm p-2 outline-none text-xs focus:border-border-focus transition-colors"
                          />
                          <input
                            type="text"
                            placeholder="VALUE"
                            value={header.value}
                            onChange={(e) => dispatch({ type: actions.UPDATE_HEADER, payload: { id: header.id, field: 'value', value: e.target.value } })}
                            className="bg-bg-secondary border border-border text-text-primary rounded-sm p-2 outline-none text-xs focus:border-border-focus transition-colors"
                          />
                          <button
                            onClick={() => dispatch({ type: actions.REMOVE_HEADER, payload: header.id })}
                            className="bg-transparent border-none text-pink-600 cursor-pointer flex items-center justify-center p-2 hover:text-pink-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                      </div>
                      ))}
                      {curlData.headers.length === 0 && (
                      <div className="text-xs text-text-tertiary p-3 text-center border border-dashed border-border rounded-sm">
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
