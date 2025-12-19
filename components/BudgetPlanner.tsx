
import React, { useState, useEffect } from 'react';
import { BudgetItem } from '../types';
import { getPriceComparison } from '../services/geminiService';

const STORAGE_KEY = 'skoolswap_budget';

const BudgetPlanner: React.FC = () => {
  const [items, setItems] = useState<BudgetItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: '1', label: 'Uniforms', estimated: 1200, actual: 0, category: 'Uniform' },
      { id: '2', label: 'Stationery', estimated: 600, actual: 0, category: 'Other' },
      { id: '3', label: 'Fees', estimated: 5000, actual: 0, category: 'Fees' },
    ];
  });

  const [dealSearch, setDealSearch] = useState('');
  const [dealInfo, setDealInfo] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleSearchDeals = async () => {
    setIsSearching(true);
    const info = await getPriceComparison(dealSearch);
    setDealInfo(info);
    setIsSearching(false);
  };

  const totalActual = items.reduce((acc, curr) => acc + curr.actual, 0);

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 pb-40 reveal">
      <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-12">BUDGET<br /><span className="accent-text">PLANNER.</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="cyber-card p-10">
            <div className="space-y-10">
              {items.map(item => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-black">{item.label}</h3>
                    <input 
                      type="number" 
                      value={item.actual || ''} 
                      onChange={e => setItems(items.map(i => i.id === item.id ? { ...i, actual: Number(e.target.value) } : i))}
                      placeholder="R 0.00"
                      className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl font-black text-right w-32 focus:accent-border outline-none"
                    />
                  </div>
                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full accent-bg" style={{ width: `${Math.min((item.actual/item.estimated)*100, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-12 border-t border-zinc-900 flex justify-between items-end">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Spend</p>
               <h2 className="text-6xl font-black accent-text">R{totalActual.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="cyber-card p-8 border-emerald-900/30">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">SA Price Checker</p>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={dealSearch} 
                  onChange={e => setDealSearch(e.target.value)}
                  placeholder="e.g. Boys Blazer Size 34" 
                  className="bg-black border border-zinc-800 rounded-xl p-3 text-xs font-bold flex-grow outline-none focus:accent-border"
                />
                <button onClick={handleSearchDeals} className="accent-bg text-black p-3 rounded-xl font-black text-xs">GO</button>
              </div>
              {isSearching ? <div className="text-zinc-500 animate-pulse text-xs font-bold">Scanning retailers...</div> : dealInfo && (
                <div className="text-zinc-300 text-sm font-medium leading-relaxed bg-zinc-900/50 p-4 rounded-xl">
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
