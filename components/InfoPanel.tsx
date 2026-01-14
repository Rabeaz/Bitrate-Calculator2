
import React from 'react';

const InfoPanel: React.FC = () => {
  const PLATFORMS = [
    { name: 'StreamElements', limit: '30 MB', note: 'Standard limit (WebM)' },
    { name: 'Streamlabs', limit: '30 MB', note: 'Max file size' },
    { name: 'Twitch Extensions', limit: '5-10 MB', note: 'Varies by extension' },
    { name: 'Discord Nitro', limit: '50-500 MB', note: 'For stickers/emojis' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-blue-400"></i>
          Platform Limits
        </h3>
        <div className="space-y-4">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="flex justify-between items-start border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-200">{p.name}</p>
                <p className="text-xs text-slate-500">{p.note}</p>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded">
                {p.limit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-md font-semibold mb-2 text-white">Why WebM?</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          WebM (VP8/VP9) is the gold standard for streaming alerts because it supports <strong>transparency (alpha channel)</strong> and provides excellent compression compared to heavy GIF files.
        </p>
        <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5">
           <p className="text-xs font-medium text-slate-300 mb-2">💡 Quick Tip:</p>
           <p className="text-xs text-slate-500 italic">Always use 2-pass encoding for the most accurate file size matching.</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
