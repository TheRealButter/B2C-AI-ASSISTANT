
import React, { useState, useEffect } from 'react';
import { fetchNexusPulse, executeNexusDeepScan } from '../services/nexusIntelligence';
import { AIResponse, TrendingItem } from '../types';
import { getRetailerLogo } from '../services/externalApis';

export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const processLine = (line: string) => {
    // Robust Bold Parsing
    let processed = line.replace(/\*\*(.*?)\*\*/g, '<b class="text-[#CCFF00] font-[900]">$1</b>');
    processed = processed.replace(/\*(.*?)\*/g, '<i class="text-zinc-200 opacity-90">$1</i>');
    return processed;
  };

  const lines = text.split('\n');
  
  return (
    <div className="markdown-output space-y-5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-3"></div>;
        
        // Advanced Table Grid Handling
        if (trimmed.startsWith('|')) {
          const cells = trimmed.split('|').filter(c => c.trim().length > 0 || trimmed.includes('---'));
          if (trimmed.includes('---')) return <div key={i} className="border-b border-white/5 my-4"></div>;
          return (
            <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 border-b border-white/[0.02] group hover:bg-white/[0.01] transition-all px-4 rounded-xl">
              {cells.map((cell, ci) => (
                <span key={ci} className="text-[11px] font-[900] text-zinc-400 uppercase tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: processLine(cell.trim()) }} />
              ))}
            </div>
          );
        }
        
        // Tactical Headers
        if (trimmed.startsWith('#')) {
          const level = (trimmed.match(/^#+/) || ['#'])[0].length;
          const style = level === 1 
            ? 'text-4xl font-[900] text-[#CCFF00] mt-12 mb-8 italic drop-shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
            : 'text-xl font-[900] text-white mt-8 mb-4 tracking-tighter uppercase';
          return (
            <h3 key={i} className={`${style} uppercase tracking-tighter`}>
              {trimmed.replace(/^#+\s/, '')}
            </h3>
          );
        }

        // Segmented Lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
          return (
            <div key={i} className="flex gap-5 ml-2 group border-l-[3px] border-[#CCFF00]/10 pl-6 py-2 hover:border-[#CCFF00]/40 transition-all">
              <span className="text-[#CCFF00] font-[900] mt-1.5 shrink-0 text-[9px] animate-pulse">■</span>
              <p className="text-zinc-400 font-medium leading-relaxed text-[15px] tracking-tight" dangerouslySetInnerHTML={{ __html: processLine(trimmed.replace(/^[*-]\s|\d+\.\s/, '')) }} />
            </div>
          );
        }

        // Core Content Blocks
        return (
          <p key={i} className="leading-relaxed text-zinc-500 font-medium text-[16px] tracking-tight mb-2" 
             dangerouslySetInnerHTML={{ __html: processLine(trimmed) }} 
          />
        );
      })}
    </div>
  );
};

const DealsFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulseLoading, setIsPulseLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const deals = await fetchNexusPulse();
        setTrending(deals);
      } catch (e) {} finally {
        setIsPulseLoading(false);
      }
    };
    init();
  }, []);

  const handleScan = async (override?: string) => {
    const q = override || query;
    if (!q) return;
    setQuery(q);
    setIsLoading(true);
    const res = await executeNexusDeepScan(q);
    setResult(res);
    setIsLoading(false);
    setTimeout(() => {
      const el = document.getElementById('scan-results');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 pb-44 reveal bg-black min-h-screen">
      <header className="mb-14 relative pt-6">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#CCFF00]/5 blur-[80px] rounded-full pointer-events-none animate-pulse"></div>
        <h1 className="text-[clamp(3.5rem,10vw,6rem)] font-[900] tracking-tighter leading-[0.8] uppercase mb-8 italic">
          MARKET<br />
          <span className="text-[#CCFF00]">SCANNER.</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-[2px] w-12 bg-zinc-800"></div>
          <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Hyper-Local Retail Intelligence Unit 01
          </p>
        </div>
      </header>

      <div className="relative mb-16 z-20">
        <div className="bg-zinc-900/30 backdrop-blur-3xl border border-white/5 p-2.5 flex flex-col md:flex-row gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden group hover:border-[#CCFF00]/20 transition-all duration-500">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="SCAN FOR PRODUCT (E.G. CASIO SCIENTIFIC)..."
            className="bg-transparent flex-grow px-8 py-5 text-sm font-bold text-white focus:outline-none placeholder:text-zinc-700 uppercase tracking-widest"
          />
          <button 
            onClick={() => handleScan()} 
            disabled={isLoading}
            className="bg-[#CCFF00] text-black px-12 py-5 uppercase text-[12px] font-[900] tracking-[0.2em] rounded-[24px] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-[0_15px_30px_rgba(204,255,0,0.2)]"
          >
            {isLoading ? 'ANALYZING...' : 'LAUNCH SCANNER'}
          </button>
        </div>
      </div>

      {!result && !isLoading && (
        <section className="reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Live Pulse Feed</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-ping"></span>
              <span className="text-[9px] font-black text-[#CCFF00] uppercase tracking-widest">Active Retail Nodes</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isPulseLoading ? [1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-zinc-900/10 border border-white/5 rounded-[32px] animate-pulse"></div>
            )) : trending.map(item => {
              const logo = getRetailerLogo(item.retailer);
              return (
                <div key={item.id} className="group p-8 rounded-[40px] bg-zinc-900/10 border border-white/5 hover:border-[#CCFF00]/30 transition-all duration-500 cursor-pointer shadow-xl" onClick={() => handleScan(item.title)}>
                  <div className="flex gap-6 items-center">
                    <div className="w-16 h-16 shrink-0 rounded-[22px] bg-black border border-white/5 flex items-center justify-center p-3 overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
                      {logo ? <img src={logo} className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" alt="" /> : <span className="text-xl font-black text-zinc-800">{item.retailer[0]}</span>}
                    </div>
                    <div className="flex-grow">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{item.retailer}</p>
                      <h4 className="text-[15px] font-[900] text-white/90 mb-2 leading-tight uppercase line-clamp-1 tracking-tight">{item.title}</h4>
                      <p className="text-xl font-[900] text-[#CCFF00]">R{item.price}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                      <svg className="w-6 h-6 text-[#CCFF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div id="scan-results" className="scroll-mt-24">
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center space-y-10 reveal">
            <div className="relative">
              <div className="w-24 h-24 border-[2px] border-zinc-900 border-t-[#CCFF00] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-10 h-10 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-[12px] flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse shadow-[0_0_15px_#CCFF00]"></div>
                 </div>
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#CCFF00] to-transparent animate-bounce opacity-20"></div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-[11px] font-[900] uppercase tracking-[0.5em] text-[#CCFF00] animate-pulse">Synchronizing Data Streams</p>
              <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Compiling Retail Intelligence Node 01</p>
            </div>
          </div>
        ) : result && (
          <div className="reveal space-y-8 pb-20">
            <div className="flex items-center justify-between px-2">
               <button onClick={() => setResult(null)} className="group flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  New Intelligence Scan
               </button>
               <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic opacity-50 underline decoration-zinc-800">Verified: {new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="bg-[#0A0A0B] border border-white/5 rounded-[48px] p-8 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(204,255,0,0.03),transparent_50%)]"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-14 border-b border-white/5 pb-10">
                  <div className="w-3 h-3 rounded-full bg-[#CCFF00] shadow-[0_0_15px_#CCFF00]"></div>
                  <h2 className="text-[11px] font-[900] uppercase tracking-[0.6em] text-[#CCFF00]">Intelligence Briefing</h2>
                </div>

                <MarkdownRenderer text={result.text} />

                {result.sources.length > 0 && (
                  <div className="pt-20 mt-20 border-t border-white/5">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-8 italic">Verification Nodes</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {result.sources.map((s, i) => (
                        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900/30 border border-white/5 px-8 py-5 rounded-[24px] text-[10px] font-black text-zinc-400 hover:text-[#CCFF00] hover:border-[#CCFF00]/40 transition-all uppercase flex items-center justify-between group shadow-lg">
                           <span className="truncate mr-4 italic">{s.title.substring(0, 35)}...</span>
                           <span className="text-[8px] border border-zinc-800 px-2 py-1 rounded-md group-hover:border-[#CCFF00]/20 transition-colors">ACCESS Node ↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsFinder;
