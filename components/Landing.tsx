
import React from 'react';

interface LandingProps {
  onBrowse: () => void;
  onPlacement: () => void;
  onBudget: () => void;
}

const NexusLogo = () => (
  <div className="relative w-16 h-16 mx-auto mb-8 group cursor-pointer reveal">
    {/* Core Glow */}
    <div className="absolute inset-0 bg-[#CCFF00]/25 blur-[40px] rounded-full animate-pulse"></div>
    
    {/* Brand Squircle */}
    <div className="relative w-full h-full bg-[#CCFF00] rounded-[18px] flex items-center justify-center shadow-[0_0_25px_rgba(204,255,0,0.4)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
      <span className="text-3xl font-[900] text-black select-none tracking-tighter">S</span>
      <div className="absolute inset-1 border border-black/10 rounded-[15px]"></div>
    </div>
  </div>
);

const Landing: React.FC<LandingProps> = ({ onBrowse, onPlacement, onBudget }) => {
  return (
    <div className="w-full min-h-screen pb-48 px-6 flex flex-col items-center justify-start text-center bg-black relative overflow-x-hidden pt-12">
      {/* Enhanced HUD Background Nodes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-[#CCFF00]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-20%] w-[60vw] h-[60vw] bg-blue-600/5 blur-[120px] rounded-full" style={{ animationDelay: '2s' }}></div>
        {/* Subtle Grid Line Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="reveal relative z-10 w-full max-w-xl">
        <NexusLogo />
        
        {/* Animated Status Tag */}
        <div className="inline-flex items-center gap-3 border border-white/5 bg-white/[0.02] backdrop-blur-2xl px-6 py-2.5 rounded-full mb-12 shadow-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Nexus Intelligence Unit Live</span>
        </div>

        <h1 className="text-[clamp(3.8rem,14vw,5.5rem)] font-[900] leading-[0.78] tracking-tighter mb-14 uppercase italic italic-shaping select-none">
          RETAIL<br />
          <span className="text-[#CCFF00] drop-shadow-[0_0_30px_rgba(204,255,0,0.2)]">COMMAND.</span>
        </h1>
        
        <p className="text-zinc-500 text-sm md:text-base font-medium max-w-md mx-auto mb-20 leading-relaxed px-6 opacity-80">
          The ultimate 100% free intelligence suite for South African parents. <span className="text-white">Real-time pricing</span>, <span className="text-white">strategic placement AI</span>, and <span className="text-white">total budget control</span>.
        </p>

        <div className="space-y-5 w-full px-2 mb-10">
          {[
            { 
              id: '01', 
              label: 'MARKET SCANNER', 
              color: 'group-hover:text-[#CCFF00]',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              action: onBrowse 
            },
            { 
              id: '02', 
              label: 'STRATEGIC AI', 
              color: 'group-hover:text-blue-500',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              action: onPlacement 
            },
            { 
              id: '03', 
              label: 'COMMANDER', 
              color: 'group-hover:text-emerald-500',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                </svg>
              ),
              action: onBudget 
            }
          ].map((unit) => (
            <button 
              key={unit.id}
              onClick={unit.action} 
              className="w-full group bg-white/[0.01] backdrop-blur-[40px] border border-white/5 p-12 rounded-[44px] flex flex-col items-center justify-center transition-all duration-500 hover:bg-white/[0.03] hover:border-white/10 hover:-translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-[0.98]"
            >
               <div className="w-14 h-14 bg-zinc-950/80 border border-white/5 rounded-[22px] flex items-center justify-center mb-6 text-zinc-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-white/10">
                 {unit.icon}
               </div>
               <span className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 transition-colors duration-500 ${unit.id === '01' ? 'text-[#CCFF00]' : unit.id === '02' ? 'text-blue-500' : 'text-emerald-500'}`}>Unit {unit.id}</span>
               <span className="text-xl font-[900] uppercase tracking-tighter text-white/90 group-hover:text-white transition-all">{unit.label}</span>
               {/* Hover Accent Glow */}
               <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 blur-lg opacity-0 group-hover:opacity-100 transition-opacity ${unit.id === '01' ? 'bg-[#CCFF00]' : unit.id === '02' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
            </button>
          ))}
        </div>

        <div className="mt-20 opacity-30">
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.8em]">End-to-End Encryption Secured</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
