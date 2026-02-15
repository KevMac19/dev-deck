import React, { useState } from 'react';
import { useCurl } from '../../../context/CurlContext';
import { Copy, Check, TerminalSquare } from 'lucide-react';

export default function CurlPreview() {
  const { state } = useCurl();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!state.generatedCurl) return;
    navigator.clipboard.writeText(state.generatedCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 bg-bg-secondary border border-border rounded-sm flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-bg-tertiary">
        <div className="flex items-center gap-2 text-text-primary">
          <TerminalSquare size={16} />
          <h2 className="font-extrabold text-sm m-0 uppercase tracking-widest">
            Generated Command
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 py-1 px-3 bg-transparent border border-border text-text-secondary rounded-sm hover:border-text-primary hover:text-text-primary hover:bg-bg-tertiary transition-all text-xs font-bold uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!state.generatedCurl}
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="p-6 bg-bg-secondary overflow-x-auto min-h-[80px]">
        <code className="font-mono text-xs leading-relaxed text-text-primary whitespace-pre-wrap break-all block">
          {state.generatedCurl || <span className="text-text-tertiary italic">// Command output...</span>}
        </code>
      </div>
    </div>
  );
}
