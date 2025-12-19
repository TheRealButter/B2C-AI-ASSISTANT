
import React from 'react';

interface LandingProps {
  onBrowse: () => void;
  onPlacement: () => void;
  onBudget: () => void;
}

const Landing: React.FC<LandingProps> = ({ onBrowse, onPlacement, onBudget }) => {
  return (
    <div className="w-full min-h-screen pb-40 px-8 flex flex-col items-center justify-center text-center">
      <div className="reveal">
        <div className="accent-bg w-12 h-12 rounded-xl flex items-center justify-center text-black font-black text-2xl mx-auto mb-8 shadow-[0_0_20px_rgba(204,255,0,0.5)]">S</div>
        <div className="inline-block border border-zinc-800 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Retail Intelligence v2.0
        </div>
        <h1 className="text-[60px] md:text-[100px] font-black leading-[0.8] tracking-tighter mb-10">
          SAVE<br />
          <span className="accent-text">EVERY</span><br />
          CENT.
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl mx-auto mb-12">
          AI-powered price tracking for South African school gear. Stop overpaying. Start scanning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <button onClick={onBrowse} className="cyber-card p-6 flex flex-col items-center hover:bg-zinc-900 transition">
             <span className="accent-text text-xs font-black uppercase tracking-widest mb-2">Deals</span>
             <span className="text-xl font-black">SCAN PRICES</span>
          </button>
          <button onClick={onPlacement} className="cyber-card p-6 flex flex-col items-center hover:bg-zinc-900 transition">
             <span className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2">School AI</span>
             <span className="text-xl font-black">STATUS CHECK</span>
          </button>
          <button onClick={onBudget} className="cyber-card p-6 flex flex-col items-center hover:bg-zinc-900 transition">
             <span className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">Money</span>
             <span className="text-xl font-black">COMMANDER</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
