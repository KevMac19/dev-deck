import React, { useState, useEffect } from 'react';
import { useCurl } from '../../../context/CurlContext';
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
    <div className="bg-bg-secondary border border-border rounded-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-bg-tertiary">
        <div className="flex gap-2 items-center text-text-primary">
          <Database size={16} />
          <h2 className="font-extrabold text-sm m-0 uppercase tracking-widest">
            Raw cURL Input
          </h2>
        </div>
        <button
          onClick={handleParse}
          className="flex items-center gap-2 py-1 px-3 bg-text-primary text-bg-primary rounded-sm font-bold uppercase border border-text-primary hover:bg-transparent hover:text-text-primary transition-colors text-xs cursor-pointer"
        >
          <Wand2 size={14} />
          <span>Parse</span>
        </button>
      </div>

      <div className="flex-1 p-4 bg-bg-secondary">
        <textarea
          value={localInput}
          onChange={handleChange}
          placeholder="Paste your cURL command here..."
          className="w-full h-full resize-none font-mono text-xs leading-relaxed bg-bg-secondary text-text-primary border-none p-0 outline-none placeholder:text-text-tertiary"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
