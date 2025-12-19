
import React, { useState, useEffect } from 'react';
import { BudgetItem } from '../types';
import { getPriceComparison } from '../services/geminiService';
import { getTechTrends, generateBudgetQR } from '../services/externalApis';

const STORAGE_KEY = 'nexus_command_budget_v4';

const PRESETS = [
  { label: 'School Uniforms', estimated: 1800, category: 'Uniform' },
  { label: 'Primary Textbooks', estimated: 950, category: 'Books' },
  { label: 'Stationery Suite', estimated: 650, category: 'Other' },
  { label: 'Term Registration', estimated: 3200, category: 'Fees' },
  { label: 'Sporting Equipment', estimated: 1400, category: 'Sport' },
  { label: 'Transport / Commute', estimated: 1200, category: 'Fees' }
];

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [techTrends, setTechTrends] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [dealSearch, setDealSearch] = useState('');
  const [dealInfo, setDealInfo] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    
    const fetchTrends = async () => {
      const data = await getTechTrends();
      if (data) setTechTrends(data);
    };
    fetchTrends();
  }, [items]);

  const addItem = (preset?: typeof PRESETS[0]) => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: preset?.label || 'MANUAL OVERRIDE ITEM',
      estimated: preset?.estimated || 0,
      actual: 0,
      category: preset?.category || 'Other'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("CONFIRM PURGE: This will erase all mission budget data.")) {
      setItems([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const updateItem = (id: string, key: keyof BudgetItem, val: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [key]: val } : i));
  };

  const handleSearchDeals = async () => {
    if (!dealSearch) return;
    setIsSearching(true);
    const info = await getPriceComparison(dealSearch);
    setDealInfo(info);
    setIsSearching(false);
  };

  const handleGenerateQR = () => {
    if (items.length === 0) return;
    const summary = items.map(i => `${i.label}: R${i.actual}`).join('; ');
    const url = generateBudgetQR(`BUDGET SUMMARY: ${summary}. Total: R${totalActual}`);
    setQrUrl(url);
  };

  const totalActual = items.reduce((acc, curr) => acc + curr.actual, 0);
  const totalEstimated = items.reduce((acc, curr) => acc + curr.estimated, 0);
  const diff = totalEstimated - totalActual;

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 pb-44 reveal bg-black min-h-screen">
      <header className="mb-14 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-[clamp(3rem,10vw,6rem)] font-[900] tracking-tighter leading-[0.85] uppercase mb-8 italic">
          BUDGET<br /><span className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">COMMANDER.</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-12 bg-zinc-800"></div>
          <p className="text-zinc-600 font-[900] uppercase tracking-[0.4em] text-[9px]">
            Financial Logistics & Intelligence Unit 03
          </p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Expenditure Console */}
          <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.03),transparent_50%)]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#CCFF00] mb-2 italic">Expenditure Matrix</h2>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic">Tracking {items.length} Intelligence Nodes</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => addItem()} 
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  + Add Custom Node
                </button>
                {items.length > 0 && (
                  <button 
                    onClick={clearAll} 
                    className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors px-2"
                  >
                    Purge All
                  </button>
                )}
              </div>
            </div>

            {/* Tactical Presets Drawer */}
            <div className="mb-12">
               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4">Tactical Presets Deployment</p>
               <div className="flex flex-wrap gap-3">
                  {PRESETS.map((p, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => addItem(p)}
                      className="bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 px-5 py-3 rounded-2xl text-[9px] font-black text-zinc-400 hover:text-white transition-all group flex items-center gap-3"
                    >
                      <span className="opacity-30 group-hover:opacity-100 group-hover:text-emerald-500 transition-all">▶</span>
                      {p.label.toUpperCase()}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-10">
              {items.length === 0 ? (
                <div className="py-24 text-center group">
                  <div className="w-16 h-16 border border-dashed border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:border-emerald-500/30 transition-all duration-700">
                    <svg className="w-6 h-6 text-zinc-800 group-hover:text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 italic">No Active Intelligence Nodes</p>
                  <p className="text-[9px] text-zinc-800 font-bold uppercase mt-2 tracking-widest">Select a preset above to begin deployment</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="group relative reveal p-1">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute -right-2 top-0 text-zinc-800 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2 z-10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    
                    <div className="grid md:grid-cols-12 gap-6 items-end mb-5">
                      <div className="md:col-span-7 space-y-4">
                        <input 
                          type="text" 
                          value={item.label}
                          onChange={e => updateItem(item.id, 'label', e.target.value.toUpperCase())}
                          className="bg-transparent text-xl md:text-2xl font-[900] uppercase tracking-tighter text-white border-b-2 border-zinc-900 focus:border-emerald-500/50 w-full outline-none py-1 transition-all"
                        />
                        <div className="flex items-center gap-4">
                          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Estimated Goal</span>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-500">R</span>
                             <input 
                                type="number" 
                                value={item.estimated || ''}
                                onChange={e => updateItem(item.id, 'estimated', Number(e.target.value))}
                                className="bg-zinc-950/50 border border-zinc-900 px-7 py-2 rounded-xl text-[11px] font-black text-zinc-400 w-32 outline-none focus:border-zinc-700"
                             />
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-5 flex flex-col items-end gap-3">
                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Actual Spend</span>
                        <div className="relative w-full md:w-44">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-[900] text-zinc-700">R</span>
                          <input 
                            type="number" 
                            value={item.actual || ''} 
                            onChange={e => updateItem(item.id, 'actual', Number(e.target.value))}
                            placeholder="0.00"
                            className="bg-zinc-950 border border-zinc-800 p-5 pl-9 rounded-[24px] font-[900] text-right w-full text-2xl text-emerald-500 focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Visual Meter */}
                    <div className="w-full h-1.5 bg-zinc-900/50 rounded-full overflow-hidden shadow-inner border border-white/5">
                      <div 
                        className={`h-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${item.actual > item.estimated ? 'bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-[#CCFF00]/80 shadow-[0_0_15px_rgba(204,255,0,0.4)]'}`} 
                        style={{ width: `${item.estimated > 0 ? Math.min((item.actual/item.estimated)*100, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Global Summary Hub */}
            {items.length > 0 && (
              <div className="mt-20 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-end gap-8 reveal">
                 <div className="w-full md:w-auto">
                    <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4 italic">Commander Intelligence Summary</p>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase mb-1">Target Aggregate</p>
                         <p className="text-xl font-[900] text-zinc-400">R{totalEstimated.toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase mb-1">Variance Status</p>
                         <p className={`text-xl font-[900] ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                           {diff >= 0 ? `+R${diff.toLocaleString()}` : `-R${Math.abs(diff).toLocaleString()}`}
                         </p>
                       </div>
                    </div>
                 </div>
                 <div className="text-right w-full md:w-auto">
                    <h2 className="text-6xl md:text-8xl font-[900] text-[#CCFF00] tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(204,255,0,0.15)] italic">
                      R{totalActual.toLocaleString()}
                    </h2>
                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.6em] mt-4">Gross Actual Liquidity</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Side Panels */}
        <div className="lg:col-span-4 space-y-6">
           {/* Tech Market Ticker */}
           <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Tech-Cycle Pulse
              </p>
              <div className="space-y-4">
                {techTrends ? Object.entries(techTrends).map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between items-center p-5 bg-black/50 rounded-[24px] border border-zinc-900 group hover:border-zinc-700 transition-all">
                    <span className="text-[11px] font-[900] uppercase text-zinc-500 tracking-tight">{name.replace(/-/g, ' ')}</span>
                    <div className="text-right">
                      <p className="text-sm font-[900] text-white">R{data.zar.toLocaleString()}</p>
                      <p className={`text-[9px] font-black ${data.zar_24h_change >= 0 ? 'text-emerald-500' : 'text-red-500'} italic`}>
                        {data.zar_24h_change.toFixed(2)}% {data.zar_24h_change >= 0 ? '↑' : '↓'}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-zinc-900/10 animate-pulse rounded-[24px]"></div>)}
                  </div>
                )}
              </div>
              <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest mt-8 text-center italic">Live Node: Coingecko Index</p>
           </div>

           {/* Deployment / Export */}
           <div className="bg-[#0A0A0B] border border-white/5 p-8 rounded-[40px] shadow-2xl text-center">
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-10">Intelligence Export</p>
              {qrUrl ? (
                <div className="reveal space-y-8 pb-4">
                   <div className="bg-white p-5 rounded-[32px] inline-block shadow-[0_0_50px_rgba(255,255,255,0.05)] transform hover:scale-105 transition-transform duration-500">
                      <img src={qrUrl} className="w-36 h-36" alt="Tactical QR" />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[11px] font-black text-white uppercase tracking-widest">Protocol Export Ready</p>
                     <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight">Scan for offline target list</p>
                   </div>
                   <button onClick={() => setQrUrl(null)} className="text-[9px] font-black text-[#CCFF00] uppercase tracking-widest underline decoration-zinc-800 underline-offset-8 hover:text-white transition-all">Reset Sync</button>
                </div>
              ) : (
                <button 
                  onClick={handleGenerateQR} 
                  disabled={items.length === 0}
                  className="w-full py-8 border-2 border-dashed border-zinc-900 rounded-[32px] text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] hover:border-emerald-500/50 hover:text-emerald-500 transition-all disabled:opacity-10 group"
                >
                  <span className="block mb-2 text-xl group-hover:scale-110 transition-transform">▣</span>
                  Generate Shopping QR
                </button>
              )}
           </div>

           {/* Tactical Scan Helper */}
           <div className="bg-emerald-500/[0.03] border border-emerald-500/10 p-8 rounded-[40px]">
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.4em] mb-8">Target Intelligence Lookup</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={dealSearch} 
                  onChange={e => setDealSearch(e.target.value)}
                  placeholder="SCAN PRODUCT..." 
                  className="bg-black/50 border border-zinc-900 rounded-2xl px-6 py-4 text-[11px] font-black flex-grow outline-none focus:border-emerald-500/50 uppercase tracking-widest text-white placeholder:text-zinc-800"
                />
                <button onClick={handleSearchDeals} disabled={isSearching} className="bg-emerald-500 text-black w-14 h-14 rounded-2xl flex items-center justify-center font-black hover:scale-[1.05] transition-transform active:scale-95 disabled:opacity-20 shadow-lg shadow-emerald-500/20">
                  {isSearching ? <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : '▶'}
                </button>
              </div>
              {dealInfo && (
                <div className="mt-8 text-zinc-400 text-xs font-medium leading-relaxed bg-black/80 p-6 rounded-[24px] border border-zinc-800/50 reveal whitespace-pre-wrap shadow-2xl relative">
                  <div className="absolute top-2 right-4 text-[8px] font-black text-zinc-800 uppercase tracking-widest">Direct Link Active</div>
                  {dealInfo}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
