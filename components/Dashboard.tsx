import React, { useMemo } from 'react';
import { Listing, UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  listings: Listing[];
  onPostNew: () => void;
  onItemClick: (item: Listing) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, listings, onPostNew, onItemClick }) => {
  const totalValue = useMemo(() => {
    return listings.reduce((acc, curr) => acc + curr.price, 0);
  }, [listings]);

  return (
    <div className="max-w-6xl mx-auto px-8 py-16 pb-40 w-full reveal">
      <header className="mb-16">
        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-4">COMMAND<br />CENTER.</h1>
        <div className="flex items-center space-x-4">
          <div className="h-0.5 w-12 accent-bg"></div>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Parent Account Status: Active</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: 'Calculated Savings', val: `R${(totalValue + 2450).toLocaleString()}`, color: 'accent-text' },
          { label: 'Active Items', val: listings.length, color: '' },
          { label: 'Chat Inquiries', val: stats.messages, color: '' },
          { label: 'Trust Rank', val: `${stats.rating}/5`, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <div key={i} className="cyber-card p-6 border-zinc-900">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tight">MY SWAPS</h2>
        <button onClick={onPostNew} className="text-[10px] font-black uppercase accent-text hover:underline">Add Entry +</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {listings.map(item => (
          <div 
            key={item.id} 
            className="cyber-card p-5 group cursor-pointer overflow-hidden" 
            onClick={() => onItemClick(item)}
          >
            <div className="aspect-[1.5/1] rounded-[20px] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="px-1">
               <div className="flex justify-between items-start mb-1">
                 <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.category}</p>
                 <span className="accent-text font-black text-xl">R{item.price}</span>
               </div>
               <h4 className="text-lg font-bold leading-tight line-clamp-2">{item.title}</h4>
            </div>
          </div>
        ))}
        
        <button onClick={onPostNew} className="border-2 border-dashed border-zinc-900 rounded-[24px] h-[340px] flex flex-col items-center justify-center group hover:border-zinc-700 transition-colors">
           <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:accent-text group-hover:accent-border transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
           </div>
           <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">New Entry</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;