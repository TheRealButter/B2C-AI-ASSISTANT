
import React from 'react';

interface LandingProps {
  onBrowse: () => void;
  onPlacement: () => void;
  onBudget: () => void;
}

const Landing: React.FC<LandingProps> = ({ onBrowse, onPlacement, onBudget }) => {
  return (
    <div className="w-full min-h-screen pb-40 px-8 flex flex-col items-center justify-center text-center bg-black relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>

      <div className="reveal relative z-10">
        <div className="accent-bg w-14 h-14 rounded-2xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-10 shadow-[0_0_30px_rgba(204,255,0,0.4)]">S</div>
        
        <div className="inline-flex items-center gap-3 border border-zinc-800 bg-zinc-900/40 px-5 py-2 rounded-full mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Intelligence Unit v3.5 Live</span>
        </div>

        <h1 className="text-[64px] md:text-[120px] font-black leading-[0.85] tracking-tighter mb-12 uppercase">
          RETAIL<br />
          <span className="accent-text">COMMAND.</span>
        </h1>
        
        <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mx-auto mb-16 leading-relaxed">
          The ultimate 100% free intelligence suite for South African parents. Real-time pricing, strategic placement AI, and total budget control.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button 
            onClick={onBrowse} 
            className="group bg-[#0a0a0b] border border-zinc-900 p-8 rounded-[32px] flex flex-col items-center hover:border-accent transition-all duration-500 shadow-2xl"
          >
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:accent-bg group-hover:text-black transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <span className="accent-text text-[10px] font-black uppercase tracking-widest mb-3">Unit 01</span>
             <span className="text-xl font-black uppercase tracking-tighter">Market Scanner</span>
             <p className="mt-4 text-xs font-medium text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">Deep price intelligence</p>
          </button>

          <button 
            onClick={onPlacement} 
            className="group bg-[#0a0a0b] border border-zinc-900 p-8 rounded-[32px] flex flex-col items-center hover:border-blue-500 transition-all duration-500 shadow-2xl"
          >
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-black transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">Unit 02</span>
             <span className="text-xl font-black uppercase tracking-tighter">Strategic AI</span>
             <p className="mt-4 text-xs font-medium text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">School placement mission</p>
          </button>

          <button 
            onClick={onBudget} 
            className="group bg-[#0a0a0b] border border-zinc-900 p-8 rounded-[32px] flex flex-col items-center hover:border-emerald-500 transition-all duration-500 shadow-2xl"
          >
             <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" /></svg>
             </div>
             <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-3">Unit 03</span>
             <span className="text-xl font-black uppercase tracking-tighter">Commander</span>
             <p className="mt-4 text-xs font-medium text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">Financial target tracking</p>
          </button>
        </div>

        <div className="mt-20">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">100% Free • POPIA Secure • No Ads</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
