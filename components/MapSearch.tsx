import React, { useState, useMemo } from 'react';
import { Listing, Category } from '../types';

interface MapSearchProps {
  items: Listing[];
  onItemClick: (item: Listing) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ items, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<Category | 'All'>('All');
  
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'All' || item.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filter]);

  const [selectedPin, setSelectedPin] = useState<Listing | null>(filteredItems[0] || null);

  return (
    <div className="fixed inset-0 w-full h-full bg-black overflow-hidden z-0 flex flex-col pt-12">
      {/* HUD Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[60] space-y-4">
        <div className="cyber-card bg-black/80 backdrop-blur h-16 md:h-20 flex items-center px-8 border-zinc-800">
          <svg className="w-5 h-5 text-zinc-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER BY SCHOOL OR BOOK..." 
            className="bg-transparent w-full text-sm font-black text-white focus:outline-none placeholder:text-zinc-800 uppercase tracking-widest" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {['All', Category.TEXTBOOKS, Category.UNIFORMS, Category.STATIONERY].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${filter === cat ? 'accent-bg text-black border-accent' : 'bg-black text-zinc-600 border-zinc-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dark Map Grid */}
      <div className="flex-grow relative bg-[#050505]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:40px_40px]"></div>
        
        {filteredItems.map((item, idx) => {
          const top = 35 + (idx * 12) % 45;
          const left = 20 + (idx * 18) % 65;
          const isActive = selectedPin?.id === item.id;
          return (
            <div 
              key={item.id} 
              className={`absolute transition-all duration-700 cursor-pointer`}
              style={{ top: `${top}%`, left: `${left}%` }}
              onClick={() => setSelectedPin(item)}
            >
               <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transform hover:scale-125 transition-all ${isActive ? 'accent-bg text-black border-accent glow' : 'bg-black text-zinc-600 border-zinc-800'}`}>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg>
               </div>
            </div>
          );
        })}
      </div>

      {/* HUD Detail Panel */}
      {selectedPin && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[60] reveal">
          <div className="cyber-card p-6 border-zinc-800 bg-black/95 backdrop-blur shadow-2xl flex gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 grayscale group-hover:grayscale-0 border border-zinc-900">
              <img src={selectedPin.imageUrl} className="w-full h-full object-cover" alt="Item" />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[8px] font-black accent-text uppercase tracking-[0.2em]">{selectedPin.category}</span>
                  <span className="text-xl font-black accent-text">R{selectedPin.price}</span>
                </div>
                <h3 className="text-sm font-black line-clamp-1 mb-2 uppercase tracking-tight">{selectedPin.title}</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{selectedPin.location}</p>
              </div>
              <button 
                onClick={() => onItemClick(selectedPin)}
                className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-colors"
              >
                Inspect Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSearch;