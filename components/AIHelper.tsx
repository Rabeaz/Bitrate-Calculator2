
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  targetSizeMB: number;
  durationSec: number;
  preset: string;
}

const AIHelper: React.FC<Props> = ({ targetSizeMB, durationSec, preset }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAIAdvice = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `I am a streamer making a WebM alert. 
      File size limit: ${targetSizeMB}MB. 
      Duration: ${durationSec} seconds. 
      Selected FFmpeg preset: ${preset}.
      The calculated bitrate is approximately ${Math.floor((targetSizeMB * 8 * 1024) / durationSec)}kbps. 
      Please provide brief, professional advice on FFmpeg settings (VP9/VP8) specifically considering the '${preset}' preset. 
      Explain how this preset choice affects the final WebM alert quality/size and if any other flags like -crf or -deadline should be adjusted. 
      Use a friendly tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a senior video engineer and streaming expert. Provide concise, actionable advice for WebM (VP9) encoding. Focus on the relationship between bitrate, duration, and the chosen FFmpeg preset.",
          temperature: 0.7,
        }
      });

      setAdvice(response.text || "Couldn't generate advice at this moment.");
    } catch (err) {
      console.error(err);
      setAdvice("Error connecting to the AI assistant. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i>
          </div>
          <h3 className="font-semibold text-slate-200">AI Encoding Assistant</h3>
        </div>
        {!advice && !loading && (
          <button 
            onClick={getAIAdvice}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Expert Tips
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <p className="text-sm text-slate-500">Analyzing your alert specs with "{preset}" preset...</p>
        </div>
      )}

      {advice && (
        <div className="prose prose-invert prose-sm max-w-none">
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
            {advice}
          </div>
          <button 
            onClick={() => setAdvice(null)}
            className="mt-3 text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1"
          >
            <i className="fa-solid fa-rotate-left"></i> Refresh Advice
          </button>
        </div>
      )}

      {!advice && !loading && (
        <p className="text-sm text-slate-500 italic">
          Need specific FFmpeg commands or quality tips? Ask the assistant.
        </p>
      )}
    </div>
  );
};

export default AIHelper;
