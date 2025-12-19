
import React, { useState } from 'react';
import { getPlacementStrategicAdvice } from '../services/geminiService';
import { AIResponse } from '../types';

type MissionMode = 'ADVICE' | 'APPEAL' | 'AVAILABILITY';

const PlacementAssistant: React.FC<{ onBack: () => void }> = () => {
  const [province, setProvince] = useState('Gauteng');
  const [status, setStatus] = useState('Pending');
  const [mode, setMode] = useState<MissionMode>('ADVICE');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    const res = await getPlacementStrategicAdvice(province, status, mode, userInput);
    setResult(res);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.text);
      alert('Strategic data copied to clipboard.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 pb-40 reveal">
      <div className="mb-12">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase mb-4">Strategic<br /><span className="accent-text">Command.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Unit: Placement Intelligence Engine v3.1</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="cyber-card p-6">
            <p className="text-[10px] font-black accent-text uppercase tracking-widest mb-6">Mission Parameters</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'ADVICE', label: 'Status Intel', sub: 'General guidance' },
                  { id: 'APPEAL', label: 'Appeal Drafter', sub: 'Generate templates' },
                  { id: 'AVAILABILITY', label: 'Late Radar', sub: 'Find open schools' }
                ].map((m) => (
                  <button 
                    key={m.id}
                    onClick={() => setMode(m.id as MissionMode)}
                    className={`text-left p-4 rounded-xl border transition-all ${mode === m.id ? 'accent-border bg-accent/5' : 'border-zinc-800 bg-zinc-900/20 text-zinc-500'}`}
                  >
                    <p className={`text-sm font-black uppercase tracking-tight ${mode === m.id ? 'accent-text' : ''}`}>{m.label}</p>
                    <p className="text-[10px] font-medium opacity-60">{m.sub}</p>
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-600 uppercase mb-2">Operation Area</label>
                  <select value={province} onChange={e => setProvince(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-xs font-bold text-white outline-none">
                    <option>Gauteng (GDE)</option>
                    <option>Western Cape (WCED)</option>
                    <option>KZN / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-zinc-600 uppercase mb-2">Specific Details</label>
                  <textarea 
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder={mode === 'APPEAL' ? "Why were you rejected? (e.g. too far from work)" : "Ask about closing dates or specific areas..."}
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-xs font-bold text-white outline-none h-24 resize-none"
                  />
                </div>

                <button 
                  onClick={handleExecute}
                  disabled={isLoading}
                  className="w-full btn-primary py-4 text-xs tracking-widest uppercase disabled:opacity-20"
                >
                  {isLoading ? 'Executing Search...' : 'Run Diagnostics'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Console */}
        <div className="lg:col-span-8">
          <div className="cyber-card p-8 min-h-[500px] flex flex-col bg-black border-zinc-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
            </div>

            {result ? (
              <div className="reveal">
                <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
                  <span className="text-[10px] font-black accent-text uppercase tracking-widest">Operation Response</span>
                  <button onClick={copyToClipboard} className="text-[9px] font-black text-zinc-500 uppercase hover:text-white">Copy Data</button>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-zinc-300 text-lg leading-relaxed space-y-6 font-medium whitespace-pre-wrap">
                    {result.text}
                  </div>
                </div>

                {result.sources.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-zinc-900">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-4">Intel Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:accent-text transition">
                          {s.title} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-20">
                <svg className="w-16 h-16 text-zinc-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <p className="text-xs font-black uppercase tracking-[0.3em]">Standby for Input</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementAssistant;
