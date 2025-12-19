
import React, { useState, useEffect } from 'react';
import { fetchNexusPulse, executeNexusDeepScan } from '../services/nexusIntelligence';
import { AIResponse, TrendingItem } from '../types';
import { getRetailerLogo } from '../services/externalApis';

export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="markdown-output space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-4"></div>;
        
        // Handle Tables (Simplified detection)
        if (trimmed.startsWith('|') && trimmed.includes('|')) {
          return (
            <div key={i} className="overflow-x-auto my-2">
              <pre className="bg-zinc-950 p-4 rounded-xl text-[12px] font-mono border border-zinc-800 text-zinc-400 leading-relaxed">
                {line}
              </pre>
            </div>
          );
        }
        
        // Handle Headers
        if (trimmed.startsWith('#')) {
          const level = (trimmed.match(/^#+/) || ['#'])[0].length;
          const fontSize = level === 1 ? 'text-4xl' : level === 2 ? 'text-2xl' : 'text-lg';
          return (
            <h3 key={i} className={`${fontSize} font-black accent-text mt-8 mb-4 uppercase tracking-tight border-l-4 border-accent pl-4`}>
              {trimmed.replace(/^#+\s/, '')}
            </h3>
          );
        }

        // Handle Lists
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
          return (
            <div key={i} className="flex gap-4 ml-2 group border-l border-zinc-900 pl-4 py-1">
              <span className="text-accent font-black mt-1.5 shrink-0 text-[10px]">•</span>
              <p className="text-zinc-300 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: trimmed.replace(/^[*-]\s|\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>') }} />
            </div>
          );
        }

        // Handle Normal Text with Bolding
        return (
          <p key={i} className="leading-relaxed text-zinc-400 font-medium text-sm" 
             dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-black">$1</b>') }} 
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
    setTimeout(() => document.getElementById('scan-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 pb-44 reveal bg-black min-h-screen">
      <header className="mb-14 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/5 blur-[80px] rounded-full pointer-events-none"></div>
        <h1 className="text-6xl md:text-[96px] font-black tracking-tighter leading-[0.8] uppercase mb-6">
          MARKET<br />
          <span className="accent-text">SCANNER.</span>
        </h1>
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-zinc-800"></div>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">
            Hyper-Local Retail Intelligence Unit
          </p>
        </div>
      </header>

      <div className="relative mb-16">
        <div className="bg-[#0a0a0b] border border-zinc-800 p-2 flex flex-col md:flex-row gap-2 shadow-2xl rounded-[32px] overflow-hidden">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
            placeholder="SCAN FOR PRODUCT (E.G. MATHS LIT GRADE 12)..."
            className="bg-transparent flex-grow px-8 py-5 text-xs font-bold text-white focus:outline-none placeholder:text-zinc-800 uppercase tracking-widest"
          />
          <button 
            onClick={() => handleScan()} 
            disabled={isLoading}
            className="bg-[#CCFF00] text-black px-12 py-5 uppercase text-[11px] font-black tracking-[0.2em] rounded-[24px] transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 shadow-[0_10px_30px_rgba(204,255,0,0.2)]"
          >
            {isLoading ? 'EXECUTING SCAN...' : 'LAUNCH SCANNER'}
          </button>
        </div>
      </div>

      {!result && !isLoading && (
        <section className="reveal">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">Live Pulse Feed</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black accent-text animate-pulse">RETAIL NODES ACTIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isPulseLoading ? [1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-zinc-900/50 rounded-3xl animate-pulse"></div>
            )) : trending.map(item => {
              const logo = getRetailerLogo(item.retailer);
              return (
                <div key={item.id} className="group p-6 rounded-[32px] bg-[#0a0a0b] border border-zinc-900 hover:border-accent transition-all duration-500 cursor-pointer" onClick={() => handleScan(item.title)}>
                  <div className="flex gap-6">
                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-zinc-950 flex items-center justify-center p-3 overflow-hidden border border-zinc-900">
                      {logo ? <img src={logo} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" alt="" /> : <span className="text-xl font-black text-zinc-800">{item.retailer[0]}</span>}
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1.5">{item.retailer}</p>
                      <h4 className="text-sm font-black text-white mb-2 leading-tight uppercase line-clamp-1">{item.title}</h4>
                      <p className="text-lg font-black accent-text">R{item.price}</p>
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
          <div className="py-32 flex flex-col items-center justify-center space-y-8 reveal">
            <div className="relative">
              <div className="w-20 h-20 border-[6px] border-zinc-900 border-t-accent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-3 h-3 bg-accent rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Scraping Retail Nodes</p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Compiling Price Matrix v4.2</p>
            </div>
          </div>
        ) : result && (
          <div className="reveal space-y-6">
            <div className="flex items-center justify-between mb-4">
               <button onClick={() => setResult(null)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition">← New Scan</button>
               <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Report Generated: {new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="cyber-card bg-zinc-950/50 border-zinc-800 p-10 md:p-16 shadow-3xl">
              <div className="flex items-center gap-4 mb-12 border-b border-zinc-900 pb-10">
                <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_#CCFF00]"></div>
                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-accent">Price Intelligence Report</h2>
              </div>

              <MarkdownRenderer text={result.text} />

              {result.sources.length > 0 && (
                <div className="pt-16 mt-16 border-t border-zinc-900">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-8">Verification Nodes</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="bg-zinc-900/40 border border-zinc-800 px-6 py-4 rounded-2xl text-[10px] font-black text-zinc-400 hover:text-accent hover:border-accent transition-all uppercase flex items-center justify-between">
                         {s.title.substring(0, 30)}... <span className="accent-text">READ SOURCE</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsFinder;
