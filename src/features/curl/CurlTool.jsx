import React from 'react';
import CurlInput from '../input/CurlInput';
import VisualEditor from '../editor/VisualEditor';
import CurlPreview from '../preview/CurlPreview';

export default function CurlTool() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-auto md:h-full">
      {/* Left Column: Input */}
      <div className="h-400px md:h-full overflow-y-visible md:overflow-y-auto pb-0 md:pb-8 flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 m-0">Raw Input</h2>
          <p className="m-0 text-sm text-text-secondary">Paste your cURL command here</p>
        </div>
        <div className="flex-1 md:h-full min-h-[400px] md:min-h-0">
             <CurlInput />
        </div>
      </div>

      {/* Right Column: Visual Editor & Preview */}
      <div className="h-auto md:h-full overflow-y-visible md:overflow-y-auto pb-0 md:pb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 m-0">Visual Builder</h2>
          <p className="m-0 text-sm text-text-secondary">Edit and preview the command</p>
        </div>
        <VisualEditor />
        <CurlPreview />
      </div>
    </div>
  );
}
