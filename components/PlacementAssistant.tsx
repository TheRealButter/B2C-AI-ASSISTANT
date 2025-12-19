
import React, { useState } from 'react';
import { getPlacementStrategicAdvice } from '../services/geminiService';
import { AIResponse } from '../types';
import { lookupPostcode } from '../services/externalApis';
import { MarkdownRenderer } from './DealsFinder';

type MissionMode = 'ADVICE' | 'APPEAL' | 'AVAILABILITY';

const PlacementAssistant: React.FC<{ onBack: () => void }> = () => {
  const [province, setProvince] = useState('Gauteng');
  const [postcode, setPostcode] = useState('');
  const [districtInfo, setDistrictInfo] = useState<any>(null);
  const [status, setStatus] = useState('Pending');
  const [mode, setMode] = useState<MissionMode>('ADVICE');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePostcodeBlur = async () => {
    if (postcode.length === 4) {
      const info = await lookupPostcode(postcode);
      if (info && info.places) {
        setDistrictInfo(info.places[0]);
        if (info.places[0].state === 'Gauteng') setProvince('Gauteng (GDE)');
        else if (info.places[0].state === 'Western Cape') setProvince('Western Cape (WCED)');
      }
    }
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const context = `Postal Code: ${postcode}. Area: ${districtInfo ? districtInfo['place name'] : 'Unknown'}. User Input: ${userInput}.`;
    const res = await getPlacementStrategicAdvice(province, status, mode, context);
    setResult(res);
    setIsLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 pb-44 reveal">
      <div className="mb-14 text-center md:text-left">
        <h1 className="text-6xl md:text-[110px] font-black tracking-tighter leading-[0.8] uppercase mb-6">STRATEGIC<br /><span className="text-blue-500">ADVOCATE.</span></h1>
        <div className="flex items-center gap-4 justify-center md:justify-start">
          <div className="h-[1px] w-12 bg-zinc-800"></div>
          <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">Education Rights & Placement Unit</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="cyber-card p-8 bg-[#0a0a0b] border-zinc-900 shadow-2xl">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Mission Parameters
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                { id: 'ADVICE', label: 'Intelligence Scan', sub: 'Status analysis & advice' },
                { id: 'APPEAL', label: 'Legal Drafter', sub: 'Appeal letter & legal grounds' },
                { id: 'AVAILABILITY', label: 'Availability Radar', sub: 'Open spots & waitlists' }
              ].map((m) => (
                <button 
                  key={m.id}
                  onClick={() => setMode(m.id as MissionMode)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${mode === m.id ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-900 bg-transparent text-zinc-600 hover:border-zinc-700'}`}
                >
                  <p className={`text-sm font-black uppercase tracking-tight ${mode === m.id ? 'text-white' : ''}`}>{m.label}</p>
                  <p className="text-[10px] font-medium opacity-60 mt-1">{m.sub}</p>
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-700 uppercase mb-3 tracking-widest">Postal Code</label>
                  <input 
                    type="text" 
                    maxLength={4}
                    value={postcode}
                    onChange={e => setPostcode(e.target.value)}
                    onBlur={handlePostcodeBlur}
                    placeholder="2001"
                    className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-sm font-black text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-700 uppercase mb-3 tracking-widest">Department</label>
                  <select value={province} onChange={e => setProvince(e.target.value)} className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-sm font-black text-white outline-none">
                    <option>Gauteng (GDE)</option>
                    <option>Western Cape (WCED)</option>
                    <option>KZN / Other</option>
                  </select>
                </div>
              </div>

              {districtInfo && (
                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl reveal">
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Detected Area</p>
                  <p className="text-xs font-bold text-zinc-300">{districtInfo['place name']}, {districtInfo['state abbreviation']}</p>
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black text-zinc-700 uppercase mb-3 tracking-widest">Case Narrative</label>
                <textarea 
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  placeholder={mode === 'APPEAL' ? "State why you are appealing..." : "Enter your current placement status..."}
                  className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-xl text-sm font-bold text-white outline-none h-32 resize-none focus:border-blue-500"
                />
              </div>

              <button 
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-20 shadow-xl shadow-blue-600/20"
              >
                {isLoading ? 'Processing Intelligence...' : 'Generate Strategic Report'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="cyber-card p-10 min-h-[600px] flex flex-col bg-zinc-950/30 border-zinc-800 relative overflow-hidden">
            {isLoading && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>}

            {result ? (
              <div className="reveal">
                <div className="flex justify-between items-center mb-10 border-b border-zinc-900 pb-6">
                  <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">AI Strategic Output</h3>
                  <button onClick={() => { navigator.clipboard.writeText(result.text); alert('Strategy copied.'); }} className="text-[9px] font-black text-zinc-600 uppercase hover:text-white transition">Copy Protocol</button>
                </div>

                <MarkdownRenderer text={result.text} />

                {result.sources.length > 0 && (
                  <div className="mt-16 pt-10 border-t border-zinc-900">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Legal & Gov Sources</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[9px] font-black text-zinc-400 hover:text-blue-500 transition-all uppercase">
                          {s.title} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-10">
                <svg className="w-24 h-24 text-zinc-700 mb-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <p className="text-sm font-black uppercase tracking-[0.5em]">System Standby</p>
                <p className="text-[10px] font-medium mt-4 uppercase">Enter parameters to begin mission</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementAssistant;
