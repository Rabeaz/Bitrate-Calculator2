
import React from 'react';

interface Props {
  targetSizeMB: number;
  setTargetSizeMB: (val: number) => void;
  durationSec: number;
  setDurationSec: (val: number) => void;
  safetyMargin: number;
  setSafetyMargin: (val: number) => void;
  preset: string;
  setPreset: (val: string) => void;
}

const PRESETS = [
  'ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'
];

const CalculatorCard: React.FC<Props> = ({ 
  targetSizeMB, setTargetSizeMB, 
  durationSec, setDurationSec,
  safetyMargin, setSafetyMargin,
  preset, setPreset
}) => {
  
  const calculateBitrate = () => {
    if (durationSec <= 0) return 0;
    const sizeInKbits = targetSizeMB * 8 * 1024;
    const rawBitrate = sizeInKbits / durationSec;
    const marginMultiplier = (100 - safetyMargin) / 100;
    return Math.floor(rawBitrate * marginMultiplier);
  };

  const bitrateKbps = calculateBitrate();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <i className="fa-solid fa-calculator text-purple-500"></i>
          WebM Bitrate Calculator
        </h2>
        <p className="text-slate-400 text-sm mt-1">Determine the perfect bitrate for your Twitch or OBS alerts.</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input 1: Target Size */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Target File Size (MB)
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={targetSizeMB}
                onChange={(e) => setTargetSizeMB(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white font-mono"
              />
              <span className="absolute right-4 top-3.5 text-slate-500 text-sm font-bold">MB</span>
            </div>
          </div>

          {/* Input 2: Duration */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">
              Video Duration (Seconds)
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={durationSec}
                step="0.1"
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white font-mono"
              />
              <span className="absolute right-4 top-3.5 text-slate-500 text-sm font-bold">SEC</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input 3: Safety Margin Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300">Safety Buffer</label>
              <span className="text-xs font-mono text-purple-400">{safetyMargin}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[10px] text-slate-500">Leaving a small buffer prevents exceeding hard limits.</p>
          </div>

          {/* Input 4: FFmpeg Preset */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-300">FFmpeg Preset</label>
            <select 
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white text-sm"
            >
              {PRESETS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">Slower presets produce better quality at the same bitrate.</p>
          </div>
        </div>

        {/* Result Area */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-purple-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-microchip text-6xl"></i>
          </div>
          
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Recommended Bitrate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">{bitrateKbps}</span>
              <span className="text-xl text-purple-400 font-medium">kbps</span>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-4">
               <div className="bg-slate-800/50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <i className="fa-solid fa-code text-blue-400 text-xs"></i>
                  <span className="text-xs font-mono text-slate-300">ffmpeg: -b:v {bitrateKbps}k -preset {preset}</span>
               </div>
               <div className="bg-slate-800/50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <i className="fa-solid fa-terminal text-green-400 text-xs"></i>
                  <span className="text-xs font-mono text-slate-300">min/maxrate matching active</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorCard;
