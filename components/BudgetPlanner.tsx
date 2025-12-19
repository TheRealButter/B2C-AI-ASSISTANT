
import React, { useState, useEffect } from 'react';
import { BudgetItem } from '../types';
import { getPriceComparison } from '../services/geminiService';
import { getTechTrends, generateBudgetQR } from '../services/externalApis';

const STORAGE_KEY = 'skoolswap_budget_v2_prod';

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { id: '1', label: 'School Uniforms', estimated: 1500, actual: 0, category: 'Uniform' },
        { id: '2', label: 'Stationery Pack', estimated: 800, actual: 0, category: 'Other' },
        { id: '3', label: 'Maths Textbooks', estimated: 600, actual: 0, category: 'Books' },
        { id: '4', label: 'Registration Fees', estimated: 2500, actual: 0, category: 'Fees' },
      ];
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
    // Auto-Save Heartbeat
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    
    const fetchTrends = async () => {
      const data = await getTechTrends();
      if (data) setTechTrends(data);
    };
    fetchTrends();
  }, [items]);

  const handleSearchDeals = async () => {
    if (!dealSearch) return;
    setIsSearching(true);
    const info = await getPriceComparison(dealSearch);
    setDealInfo(info);
    setIsSearching(false);
  };

  const handleGenerateQR = () => {
    const summary = items.map(i => `${i.label}: R${i.actual}`).join('; ');
    const url = generateBudgetQR(`BUDGET SUMMARY: ${summary}. Total: R${totalActual}`);
    setQrUrl(url);
  };

  const totalActual = items.reduce((acc, curr) => acc + curr.actual, 0);
  const totalEstimated = items.reduce((acc, curr) => acc + curr.estimated, 0);

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 pb-44 reveal">
      <header className="mb-14">
        <h1 className="text-6xl md:text-[100px] font-black tracking-tighter leading-[0.8] uppercase mb-6">BUDGET<br /><span className="text-emerald-500">COMMANDER.</span></h1>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-zinc-800"></div>
          <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px]">Financial Intelligence & Target Tracking</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="cyber-card p-10 bg-[#0a0a0b] border-zinc-900 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Expenditure Grid</h2>
              <button onClick={() => setItems(items.map(i => ({...i, actual: 0})))} className="text-[9px] font-black text-zinc-700 uppercase hover:text-accent transition">Clear Data</button>
            </div>

            <div className="space-y-12">
              {items.map(item => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight">{item.label}</h3>
                      <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Est: R{item.estimated}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-zinc-700">ZAR</span>
                      <input 
                        type="number" 
                        value={item.actual || ''} 
                        onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, actual: Number(e.target.value) } : i))}
                        placeholder="0.00"
                        className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-black text-right w-40 text-lg text-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${item.actual > item.estimated ? 'bg-red-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${Math.min((item.actual/item.estimated)*100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-16 border-t border-zinc-900 flex justify-between items-end">
               <div>
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Operational Spend</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase italic">Goal: R{totalEstimated}</p>
               </div>
               <h2 className="text-7xl font-black text-emerald-500 tracking-tighter">R{totalActual.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           {/* Tech Cycle Widget */}
           <div className="cyber-card p-8 bg-zinc-950/40 border-zinc-800">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Tech-Cycle Intelligence
              </p>
              <div className="space-y-4">
                {techTrends ? Object.entries(techTrends).map(([name, data]: [string, any]) => (
                  <div key={name} className="flex justify-between items-center p-4 bg-black rounded-2xl border border-zinc-900">
                    <span className="text-[11px] font-black uppercase text-zinc-400">{name.replace(/-/g, ' ')}</span>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">R{data.zar.toLocaleString()}</p>
                      <p className={`text-[9px] font-bold ${data.zar_24h_change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {data.zar_24h_change.toFixed(2)}% {data.zar_24h_change >= 0 ? '↑' : '↓'}
                      </p>
                    </div>
                  </div>
                )) : <div className="h-20 bg-black animate-pulse rounded-2xl"></div>}
              </div>
           </div>

           {/* QR Commander */}
           <div className="cyber-card p-8 bg-zinc-950/40 border-zinc-800 text-center">
              <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-8">Export Intelligence</p>
              {qrUrl ? (
                <div className="reveal space-y-6">
                   <div className="bg-white p-4 rounded-3xl inline-block shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      <img src={qrUrl} className="w-32 h-32" alt="QR" />
                   </div>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Scan to take list offline</p>
                   <button onClick={() => setQrUrl(null)} className="text-[9px] font-black accent-text uppercase underline">Regenerate</button>
                </div>
              ) : (
                <button onClick={handleGenerateQR} className="w-full py-5 border-2 border-dashed border-zinc-800 rounded-2xl text-[11px] font-black text-zinc-700 uppercase hover:border-emerald-500 hover:text-emerald-500 transition-all">
                  Generate Shopping QR
                </button>
              )}
           </div>

           {/* Quick Scans */}
           <div className="cyber-card p-8 bg-emerald-500/5 border-emerald-500/10">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6">Deep Scan Lookup</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={dealSearch} 
                  onChange={e => setDealSearch(e.target.value)}
                  placeholder="E.G. CASIO FX-991ZA" 
                  className="bg-black border border-zinc-800 rounded-xl p-4 text-[11px] font-bold flex-grow outline-none focus:border-emerald-500 uppercase tracking-widest"
                />
                <button onClick={handleSearchDeals} disabled={isSearching} className="bg-emerald-500 text-black px-6 rounded-xl font-black text-[11px] hover:brightness-110">
                  {isSearching ? '...' : 'SCAN'}
                </button>
              </div>
              {dealInfo && (
                <div className="mt-6 text-zinc-400 text-xs font-medium leading-relaxed bg-black/60 p-4 rounded-2xl border border-zinc-900 reveal whitespace-pre-wrap">
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
